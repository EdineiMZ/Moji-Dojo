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
  removeModel(name: string): Promise<string[]>;
  prepare(): Promise<VoicevoxSpeaker[]>;
  synthesize(text: string, styleId: number, speed: number): Promise<string>;
  clearCache(): Promise<void>;
}

/** O módulo nativo só existe no APK gerado com o VOICEVOX; no Expo Go, na web e nos testes ele é null. */
const native = requireOptionalNativeModule<NativeVoicevox>('Voicevox');

/** `missing`: o APK não tem o motor. `novoices`: o motor está lá, mas nenhuma voz foi baixada ainda. */
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
  cancelDownload: () => void;
  removePack: (file: string) => Promise<void>;
}

/** O download em curso, para o botão Cancelar. */
let activeTask: { cancel: () => void } | null = null;
let cancelled = false;

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
    packError: '',
    check: async () => {
      if (!native) return set({ status: 'unsupported' });
      try {
        if (get().status === 'ready' || get().status === 'loading') return;
        if (!(await native.isInstalled())) return set({ status: 'missing' });
        const installed = await native.installedModels();
        set({ installed, status: installed.length > 0 ? 'idle' : 'novoices' });
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
      set({ packError: '', download: { file, progress: 0 } });
      cancelled = false;
      let part: { exists: boolean; delete: () => void } | null = null;
      try {
        // Carregado só aqui: o módulo de arquivos não precisa existir nos testes nem no Expo Go sem o VOICEVOX.
        const { File, Paths } = await import('expo-file-system');
        if (Paths.availableDiskSpace < requiredFreeBytes(pack)) {
          throw new Error('Falta espaço livre no aparelho para baixar esta voz.');
        }
        const dir = await native.modelsPath();
        const target = new File(`file://${dir}/${file}.part`);
        part = target;
        if (target.exists) target.delete();
        const task = File.createDownloadTask(packUrl(file), target, {
          onProgress: ({ bytesWritten }) => set({ download: { file, progress: Math.min(bytesWritten / pack.bytes, 1) } }),
        });
        activeTask = task;
        await task.downloadAsync();
        set({ download: { file, progress: 1 } });
        await applyInstalled(await native.commitModel(file, pack.bytes));
      } catch (e) {
        try {
          if (part?.exists) part.delete();
        } catch {
          // O arquivo parcial é apagado de novo no próximo download.
        }
        if (!cancelled) set({ packError: `Não consegui baixar a voz: ${message(e, 'erro desconhecido')}` });
      } finally {
        activeTask = null;
        set({ download: null });
      }
    },
    cancelDownload: () => {
      cancelled = true;
      activeTask?.cancel();
    },
    removePack: async (file) => {
      if (!native || get().download) return;
      set({ packError: '' });
      try {
        await applyInstalled(await native.removeModel(file));
      } catch (e) {
        set({ packError: `Não consegui apagar a voz: ${message(e, 'erro desconhecido')}` });
      }
    },
  };
});

/** A voz VOICEVOX está escolhida e pronta para falar? */
export const voicevoxActive = (): boolean => useSettingsStore.getState().voiceEngine === 'voicevox' && useVoicevoxStore.getState().status === 'ready';

/** Sintetiza o texto com o personagem escolhido e devolve o arquivo de áudio (file://), ou null se não deu. */
export async function synthesizeFile(text: string, rate: number): Promise<string | null> {
  if (!native) return null;
  const style = resolveStyle(useVoicevoxStore.getState().speakers, useSettingsStore.getState().voicevoxStyle);
  return native.synthesize(text, style, speedScaleFor(rate));
}

/** Sintetiza o texto com um estilo escolhido (não o dos Ajustes): usado para ouvir cada voz baixada antes de a escolher. */
export async function synthesizeStyle(text: string, styleId: number, rate: number): Promise<string | null> {
  if (!native) return null;
  return native.synthesize(text, styleId, speedScaleFor(rate));
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
