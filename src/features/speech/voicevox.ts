import { requireOptionalNativeModule } from 'expo';
import { create } from 'zustand';
import { useSettingsStore } from '@/store';
import { DEFAULT_VOICEVOX_STYLE } from '@/store/settingsStore';
import { packByFile, packUrl, requiredFreeBytes } from './voicevoxPacks';

/** Um estilo de voz (tom) de um personagem do VOICEVOX. */
export interface VoicevoxStyle {
  id: number;
  name: string;
}

export interface VoicevoxSpeaker {
  name: string;
  styles: readonly VoicevoxStyle[];
}

interface NativeVoicevox {
  /** O motor (dicionário) está dentro do app? */
  isInstalled(): Promise<boolean>;
  modelsPath(): Promise<string>;
  installedModels(): Promise<string[]>;
  commitModel(name: string, expectedBytes: number): Promise<string[]>;
  /** Baixa para "<nome>.part" (continuando de onde parou) e confere o SHA-256; lança erro com `code` ("CANCELLED", "NETWORK", "BAD_HASH"...). */
  downloadModel(name: string, url: string, expectedBytes: number, sha256: string): Promise<void>;
  cancelDownload(): void;
  /** Bytes já baixados de cada voz interrompida. */
  partialBytes(): Record<string, number>;
  networkType(): 'wifi' | 'cellular' | 'none';
  addListener(event: 'onDownloadProgress', listener: (e: { file: string; bytes: number }) => void): { remove: () => void };
  removeModel(name: string): Promise<string[]>;
  prepare(): Promise<VoicevoxSpeaker[]>;
  synthesize(text: string, styleId: number, speed: number, pitch: number, intonation: number): Promise<string>;
  clearCache(): Promise<void>;
}

/** O módulo nativo só existe no APK gerado com o VOICEVOX; no Expo Go, na web e nos testes ele é null. */
const native = requireOptionalNativeModule<NativeVoicevox>('Voicevox');

/** `missing`: o APK não tem o motor. `novoices`: o motor está lá, mas nenhuma voz foi baixada ainda. */
/** A rede no momento do toque em "Baixar": só importa saber se é grátis (Wi-Fi) ou com franquia. */
export type NetworkKind = 'wifi' | 'cellular' | 'none' | 'unknown';

export type VoicevoxStatus = 'unsupported' | 'missing' | 'novoices' | 'idle' | 'loading' | 'ready' | 'error';

/** Velocidade da voz do app (taxa do expo-speech, 0,9 = normal) → `speedScale` do VOICEVOX (1,0 = normal). */
export const speedScaleFor = (rate: number): number => Math.round(Math.max(0.55, Math.min(1.4, rate / 0.9)) * 100) / 100;

/** "VOICEVOX:ずんだもん": o crédito que os termos de uso pedem sempre que uma voz é usada. */
export function creditFor(speakers: readonly VoicevoxSpeaker[], styleId: number): string | null {
  const speaker = speakers.find((s) => s.styles.some((st) => st.id === styleId));
  return speaker ? `VOICEVOX:${speaker.name}` : null;
}

/** O estilo a usar: o escolhido se existe nas vozes instaladas; senão o ノーマル de ずんだもん; senão o primeiro. */
export function resolveStyle(speakers: readonly VoicevoxSpeaker[], wanted: number): number {
  const all = speakers.flatMap((s) => s.styles);
  if (all.some((s) => s.id === wanted)) return wanted;
  if (all.some((s) => s.id === DEFAULT_VOICEVOX_STYLE)) return DEFAULT_VOICEVOX_STYLE;
  return all[0]?.id ?? DEFAULT_VOICEVOX_STYLE;
}

/** Um download em andamento: qual arquivo e quanto já veio (0 a 1). */
export interface PackDownload {
  file: string;
  progress: number;
}

interface VoicevoxState {
  status: VoicevoxStatus;
  speakers: readonly VoicevoxSpeaker[];
  error: string;
  /** Arquivos de voz (.vvm) já baixados. */
  installed: readonly string[];
  download: PackDownload | null;
  /** Bytes já baixados das vozes cujo download foi interrompido (dá para continuar). */
  partial: Readonly<Record<string, number>>;
  network: NetworkKind;
  /** Erro do último download ou remoção (vazio se deu certo ou foi cancelado). */
  packError: string;
  /** Vê se o app foi gerado com o motor do VOICEVOX e quais vozes já foram baixadas. */
  check: () => Promise<void>;
  /** Carrega o motor e as vozes (a primeira vez leva alguns segundos). */
  prepare: () => Promise<void>;
  clearCache: () => Promise<void>;
  /**
   * Baixa um arquivo de voz da release oficial e o carrega. `acceptedTerms` diz que a pessoa acabou de aceitar os termos dos
   * personagens daquele arquivo (a tela pede isso a cada download); sem ele, nada é baixado.
   */
  downloadPack: (file: string, acceptedTerms: boolean) => Promise<void>;
  /** Para o download em andamento; o que já veio fica guardado para continuar depois. */
  cancelDownload: () => void;
  removePack: (file: string) => Promise<void>;
  /** Apaga todas as vozes baixadas (e os downloads parciais). */
  removeAll: () => Promise<void>;
  /** Lê o tipo de rede agora (para avisar quando o download gastaria dados móveis). */
  refreshNetwork: () => void;
}

/** O código do erro nativo ("CANCELLED", "NETWORK", "BAD_HASH"...), se houver. */
const codeOf = (e: unknown): string | undefined => (e as { code?: string } | null)?.code;

const message = (e: unknown, fallback: string): string => (e instanceof Error && e.message ? e.message : fallback);

export const useVoicevoxStore = create<VoicevoxState>((set, get) => {
  /** Depois de baixar ou apagar uma voz: atualiza a lista, os personagens e o estado do motor. */
  const applyInstalled = async (installed: string[]) => {
    set({ installed });
    const { status } = get();
    if (installed.length === 0) return set({ status: 'novoices', speakers: [] });
    if (status === 'ready' && native) {
      set({ speakers: await native.prepare() });
    } else if (status === 'novoices') {
      set({ status: 'idle' });
      if (useSettingsStore.getState().voiceEngine === 'voicevox') await get().prepare();
    }
  };

  return {
    status: native ? 'idle' : 'unsupported',
    speakers: [],
    error: '',
    installed: [],
    download: null,
    partial: {},
    network: 'unknown',
    packError: '',
    check: async () => {
      if (!native) return set({ status: 'unsupported' });
      try {
        if (get().status === 'ready' || get().status === 'loading') return;
        if (!(await native.isInstalled())) return set({ status: 'missing' });
        const installed = await native.installedModels();
        set({ installed, partial: native.partialBytes(), status: installed.length > 0 ? 'idle' : 'novoices' });
      } catch {
        set({ status: 'missing' });
      }
    },
    prepare: async () => {
      if (!native) return;
      if (get().status === 'ready' || get().status === 'loading') return;
      set({ status: 'loading', error: '' });
      try {
        set({ speakers: await native.prepare(), status: 'ready' });
      } catch (e) {
        set({ status: 'error', error: message(e, 'Não consegui iniciar o VOICEVOX.') });
      }
    },
    clearCache: async () => {
      await native?.clearCache();
    },
    downloadPack: async (file, acceptedTerms) => {
      const pack = packByFile(file);
      if (!pack || get().download) return;
      if (!acceptedTerms) return set({ packError: 'Aceite os termos de uso dos personagens antes de baixar a voz.' });
      if (!native) return;
      const have = get().partial[file] ?? 0;
      set({ packError: '', download: { file, progress: Math.min(have / pack.bytes, 1) } });
      const progress = native.addListener('onDownloadProgress', (e) => {
        if (e.file === file) set({ download: { file, progress: Math.min(e.bytes / pack.bytes, 1) } });
      });
      try {
        // Carregado só aqui: o módulo de arquivos não precisa existir nos testes nem no Expo Go sem o VOICEVOX.
        const { Paths } = await import('expo-file-system');
        if (Paths.availableDiskSpace < requiredFreeBytes(pack) - have) {
          throw new Error('Falta espaço livre no aparelho para baixar esta voz.');
        }
        try {
          await native.downloadModel(file, packUrl(file), pack.bytes, pack.sha256);
        } catch (e) {
          // O servidor devolveu outro trecho: o parcial foi descartado e uma segunda tentativa recomeça do zero.
          if (codeOf(e) !== 'RANGE') throw e;
          await native.downloadModel(file, packUrl(file), pack.bytes, pack.sha256);
        }
        set({ download: { file, progress: 1 } });
        await applyInstalled(await native.commitModel(file, pack.bytes));
      } catch (e) {
        if (codeOf(e) !== 'CANCELLED') set({ packError: `Não consegui baixar a voz: ${message(e, 'erro desconhecido')}` });
      } finally {
        progress.remove();
        set({ download: null, partial: native.partialBytes() });
      }
    },
    cancelDownload: () => {
      native?.cancelDownload();
    },
    refreshNetwork: () => {
      try {
        set({ network: native ? native.networkType() : 'unknown' });
      } catch {
        set({ network: 'unknown' });
      }
    },
    removeAll: async () => {
      if (!native || get().download) return;
      set({ packError: '' });
      try {
        let left: string[] = [...get().installed];
        for (const file of left) left = await native.removeModel(file);
        await applyInstalled(left);
        set({ partial: native.partialBytes() });
      } catch (e) {
        set({ packError: `Não consegui apagar as vozes: ${message(e, 'erro desconhecido')}` });
      }
    },
    removePack: async (file) => {
      if (!native || get().download) return;
      set({ packError: '' });
      try {
        await applyInstalled(await native.removeModel(file));
        set({ partial: native.partialBytes() });
      } catch (e) {
        set({ packError: `Não consegui apagar a voz: ${message(e, 'erro desconhecido')}` });
      }
    },
  };
});

/** A voz VOICEVOX está escolhida e pronta para falar? */
export const voicevoxActive = (): boolean => useSettingsStore.getState().voiceEngine === 'voicevox' && useVoicevoxStore.getState().status === 'ready';

/** O estilo de um papel: o atendente dos diálogos usa a voz própria, se a pessoa escolheu uma e ela está baixada. */
export function styleForRole(speakers: readonly VoicevoxSpeaker[], mainStyle: number, staffStyle: number | null, role: 'you' | 'staff'): number {
  const main = resolveStyle(speakers, mainStyle);
  if (role === 'staff' && staffStyle !== null && speakers.some((s) => s.styles.some((st) => st.id === staffStyle))) return staffStyle;
  return main;
}

/** Sintetiza o texto com o personagem escolhido (ou o do atendente, em diálogos) e devolve o arquivo de áudio (file://), ou null. */
export async function synthesizeFile(text: string, rate: number, role: 'you' | 'staff' = 'you'): Promise<string | null> {
  if (!native) return null;
  const { voicevoxStyle, voicevoxStaffStyle, voicevoxPitch, voicevoxIntonation } = useSettingsStore.getState();
  const style = styleForRole(useVoicevoxStore.getState().speakers, voicevoxStyle, voicevoxStaffStyle, role);
  return native.synthesize(text, style, speedScaleFor(rate), voicevoxPitch, voicevoxIntonation);
}

/** Sintetiza o texto com um estilo escolhido (não o dos Ajustes): usado para ouvir cada voz baixada antes de a escolher. */
export async function synthesizeStyle(text: string, styleId: number, rate: number): Promise<string | null> {
  if (!native) return null;
  const { voicevoxPitch, voicevoxIntonation } = useSettingsStore.getState();
  return native.synthesize(text, styleId, speedScaleFor(rate), voicevoxPitch, voicevoxIntonation);
}

/** Prepara o VOICEVOX em segundo plano quando ele está escolhido (chamado ao abrir o app e ao trocar a voz). */
export function warmUpVoicevox(): void {
  if (useSettingsStore.getState().voiceEngine !== 'voicevox') return;
  void useVoicevoxStore
    .getState()
    .check()
    .then(() => {
      if (useVoicevoxStore.getState().status === 'idle') return useVoicevoxStore.getState().prepare();
    });
}
