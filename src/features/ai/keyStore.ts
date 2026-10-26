import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { PROVIDER_IDS, type AiProvider } from './providers';

const storageName = (provider: AiProvider): string => `moji_ai_key_${provider}`;

/** Lê a chave do armazenamento seguro do aparelho (Android Keystore). Falha vira "sem chave". */
export async function readKey(provider: AiProvider): Promise<string | null> {
  try {
    return (await SecureStore.getItemAsync(storageName(provider))) || null;
  } catch {
    return null;
  }
}

export async function writeKey(provider: AiProvider, key: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(storageName(provider), key);
    return true;
  } catch {
    return false;
  }
}

export async function removeKey(provider: AiProvider): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(storageName(provider));
  } catch {
    // já não existe
  }
}

/** Limpa o que foi colado: espaços, aspas e quebras de linha. */
export const cleanKey = (raw: string): string => raw.replace(/["'\s]/g, '');

/** Tamanho razoável para uma chave de API (evita guardar um texto qualquer colado por engano). */
export const looksLikeKey = (key: string): boolean => key.length >= 20 && key.length <= 300 && /^[\w.-]+$/.test(key);

interface KeyState {
  /** A leitura inicial já terminou. */
  loaded: boolean;
  /** Quais provedores têm chave guardada (a chave em si nunca fica no estado). */
  has: Readonly<Record<AiProvider, boolean>>;
  refresh: () => Promise<void>;
  save: (provider: AiProvider, key: string) => Promise<boolean>;
  remove: (provider: AiProvider) => Promise<void>;
}

/** Só diz se há chave; a chave em si é lida do armazenamento seguro na hora de usar. */
export const useAiKeys = create<KeyState>((set) => ({
  loaded: false,
  has: { gemini: false, claude: false },
  refresh: async () => {
    const entries = await Promise.all(PROVIDER_IDS.map(async (p) => [p, (await readKey(p)) !== null] as const));
    set({ loaded: true, has: Object.fromEntries(entries) as Record<AiProvider, boolean> });
  },
  save: async (provider, key) => {
    const ok = await writeKey(provider, key);
    if (ok) set((s) => ({ has: { ...s.has, [provider]: true } }));
    return ok;
  },
  remove: async (provider) => {
    await removeKey(provider);
    set((s) => ({ has: { ...s.has, [provider]: false } }));
  },
}));
