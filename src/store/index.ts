import Storage from 'expo-sqlite/kv-store';
import { createAiStore } from '@/features/ai/aiStore';
import { setRetention } from '@/features/review/retention';
import { setFeedbackPrefs } from '@/lib/feedbackPrefs';
import { LEGACY_STORAGE_KEYS, withLegacyKeys, type SyncStorage } from './legacyKeys';
import { createProgressStore } from './progressStore';
import { createSettingsStore } from './settingsStore';

/**
 * Armazenamento em SQLite (expo-sqlite/kv-store). Usa a API síncrona, então os dados já
 * estão carregados na primeira renderização, sem tela "zerada".
 */
const kvStorage: SyncStorage = {
  getItem: (name) => Storage.getItemSync(name),
  setItem: (name, value) => Storage.setItemSync(name, value),
  removeItem: (name) => {
    Storage.removeItemSync(name);
  },
};

/** O mesmo armazenamento, lendo também as chaves de antes da troca de nome do app. */
const storage = withLegacyKeys(kvStorage, LEGACY_STORAGE_KEYS);

/** Store de progresso do app (srs, lições, estatísticas e dias de estudo). */
export const useProgressStore = createProgressStore(storage);

/** Preferências do usuário (ex.: escrever nas revisões). */
export const useSettingsStore = createSettingsStore(storage);

/** O que a IA gerou e ficou guardado (respostas repetidas e frases para treinar). Fora do backup. */
export const useAiStore = createAiStore(storage);

// Vibração e som consultam um módulo simples (sem depender da store): mantemos os dois em sincronia.
const syncFeedbackPrefs = (s: { hapticsEnabled: boolean; soundEnabled: boolean }) =>
  setFeedbackPrefs({ haptics: s.hapticsEnabled, sound: s.soundEnabled });
setRetention(useSettingsStore.getState().retention);
useSettingsStore.subscribe((s) => setRetention(s.retention));
syncFeedbackPrefs(useSettingsStore.getState());
useSettingsStore.subscribe(syncFeedbackPrefs);
