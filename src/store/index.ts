import Storage from 'expo-sqlite/kv-store';
import type { StateStorage } from 'zustand/middleware';
import { createProgressStore } from './progressStore';

/**
 * Armazenamento em SQLite (expo-sqlite/kv-store). Usa a API síncrona, então o
 * progresso já está carregado na primeira renderização, sem tela "zerada".
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
