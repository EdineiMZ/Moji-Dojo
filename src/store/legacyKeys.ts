import type { StateStorage } from 'zustand/middleware';

/** Armazenamento síncrono (o do app usa a API síncrona do expo-sqlite/kv-store). */
export interface SyncStorage extends StateStorage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

/**
 * Chaves de antes da troca de nome do app (Nihongo Dojo → Moji Dojo), indexadas pela chave nova.
 * Quem já estudou com o nome antigo mantém o progresso e as preferências.
 */
export const LEGACY_STORAGE_KEYS: Readonly<Record<string, string>> = {
  'moji-dojo-progress': 'nihongo-dojo-progress',
  'moji-dojo-settings': 'nihongo-dojo-settings',
};

/**
 * Ao ler uma chave nova que ainda não existe, move o valor da chave antiga (se houver):
 * copia para a nova e só então apaga a antiga, então nada se perde se o app fechar no meio.
 * Chaves novas que já existem nunca são tocadas.
 */
export function withLegacyKeys(storage: SyncStorage, legacy: Readonly<Record<string, string>>): SyncStorage {
  return {
    getItem: (name) => {
      const current = storage.getItem(name);
      if (current !== null) return current;

      const oldName = legacy[name];
      if (oldName === undefined) return null;
      const oldValue = storage.getItem(oldName);
      if (oldValue === null) return null;

      storage.setItem(name, oldValue);
      storage.removeItem(oldName);
      return oldValue;
    },
    setItem: (name, value) => storage.setItem(name, value),
    removeItem: (name) => storage.removeItem(name),
  };
}
