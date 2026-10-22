import Storage from 'expo-sqlite/kv-store';
import type { StateStorage } from 'zustand/middleware';
import { createProgressStore } from './progressStore';
import { createSettingsStore } from './settingsStore';

/**
 * Armazenamento em SQLite (expo-sqlite/kv-store). Usa a API síncrona, então os dados já
 * estão carregados na primeira renderização, sem tela "zerada".
 */
const kvStorage: StateStorage = {
  getItem: (name) => Storage.getItemSync(name),
  setItem: (name, value) => Storage.setItemSync(name, value),
  removeItem: (name) => {
    Storage.removeItemSync(name);
  },
};

/** Store de progresso do app (srs, lições, estatísticas e dias de estudo). */
export const useProgressStore = createProgressStore(kvStorage);

/** Preferências do usuário (ex.: escrever nas revisões). */
export const useSettingsStore = createSettingsStore(kvStorage);
