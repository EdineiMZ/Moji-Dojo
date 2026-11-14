import Constants from 'expo-constants';
import { create } from 'zustand';
import { useSettingsStore } from '@/store';
import { checkForUpdate, type ReleaseInfo, type UpdateResult } from './release';
import { isCheckDue } from './settings';

/** Versão instalada, lida do app.json. */
export const installedVersion = (): string => Constants.expoConfig?.version ?? '0.0.0';

interface UpdateState {
  /** Release mais nova que a instalada, se a última consulta achou uma. */
  release: ReleaseInfo | null;
  checking: boolean;
  /** Resultado da última consulta feita nesta abertura do app (null = ainda não consultou). */
  last: UpdateResult['status'] | null;
}

/** Estado da checagem nesta abertura do app (não é salvo: o que persiste fica nos Ajustes). */
export const useUpdateStore = create<UpdateState>(() => ({ release: null, checking: false, last: null }));

/**
 * Consulta o GitHub. `force` ignora o intervalo de um dia e a opção "procurar sozinho" (botão "Procurar agora"); sem ele, só
 * consulta se estiver ligado e se faz mais de um dia da última vez. Falha de rede não registra a hora: tenta de novo na próxima abertura.
 */
export async function runUpdateCheck(force = false, now: number = Date.now()): Promise<UpdateResult['status'] | 'skipped'> {
  const settings = useSettingsStore.getState();
  if (!force && !isCheckDue(settings.updates, now)) return 'skipped';
  if (useUpdateStore.getState().checking) return 'skipped';
  useUpdateStore.setState({ checking: true });
  const result = await checkForUpdate(installedVersion());
  useUpdateStore.setState({ checking: false, last: result.status, release: result.status === 'newer' ? result.release : null });
  if (result.status !== 'error') settings.setUpdates({ lastCheckAt: now });
  return result.status;
}
