import { useEffect } from 'react';
import { AppState } from 'react-native';
import { requireOptionalNativeModule } from 'expo';
import { router } from 'expo-router';
import { create } from 'zustand';
import { MAX_TEXT_LENGTH } from '@/features/ai/tasks';

interface NativeShareText {
  consume(): string | null;
  addListener(event: 'onShareText', listener: (e: { text: string }) => void): { remove: () => void };
}

/** O módulo só existe no APK gerado com ele; no Expo Go, na web e nos testes ele é null. */
const native = requireOptionalNativeModule<NativeShareText>('ShareText');

export const shareAvailable: boolean = native !== null;

/** Faixas de caracteres que não servem num texto (controle e marcas invisíveis de direção), em código Unicode: nenhum literal invisível no arquivo. */
const STRIP_RANGES: readonly (readonly [number, number])[] = [
  [0x00, 0x08],
  [0x0b, 0x0c],
  [0x0e, 0x1f],
  [0x7f, 0x9f],
  [0x200b, 0x200f],
  [0x202a, 0x202e],
  [0x2066, 0x2069],
];
const STRIP = new RegExp(`[${STRIP_RANGES.map(([from, to]) => `${String.fromCharCode(from)}-${String.fromCharCode(to)}`).join('')}]`, 'g');

/**
 * Limpa o texto que outro app compartilhou: ele vem de fora, então tira caracteres de controle, junta as quebras de linha e
 * corta no tamanho que a tela aceita. Vazio se não sobra nada.
 */
export function cleanShared(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/\r\n?/g, '\n')
    .replace(STRIP, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

interface ShareState {
  /** O texto recebido que ainda não foi usado pela tela Explicar. */
  text: string | null;
  /** Muda a cada compartilhamento, para as telas saberem que chegou um novo. */
  nonce: number;
  receive: (raw: unknown) => boolean;
  clear: () => void;
}

export const useShareStore = create<ShareState>((set) => ({
  text: null,
  nonce: 0,
  receive: (raw) => {
    const text = cleanShared(raw);
    if (!text) return false;
    set((s) => ({ text, nonce: s.nonce + 1 }));
    return true;
  },
  clear: () => set({ text: null }),
}));

/** Leva a pessoa à tela Frases (onde a IA e o "Explicar" ficam). Se a navegação ainda não está pronta, tenta de novo logo depois. */
function openPhrases(): void {
  const go = () => router.navigate('/(tabs)/phrases');
  try {
    go();
  } catch {
    setTimeout(() => {
      try {
        go();
      } catch {
        // a tela abre quando a pessoa for a Frases: o texto fica guardado
      }
    }, 600);
  }
}

/** Ouve os compartilhamentos do Android (na abertura e com o app aberto) e leva o texto à tela Explicar. */
export function useShareReceiver(): void {
  useEffect(() => {
    if (!native) return;
    const handle = (raw: unknown) => {
      if (useShareStore.getState().receive(raw)) openPhrases();
    };
    const pull = () => {
      try {
        handle(native.consume());
      } catch {
        // sem texto compartilhado
      }
    };
    pull();
    const sub = native.addListener('onShareText', (e) => handle(e.text));
    const app = AppState.addEventListener('change', (state) => {
      if (state === 'active') pull();
    });
    return () => {
      sub.remove();
      app.remove();
    };
  }, []);
}
