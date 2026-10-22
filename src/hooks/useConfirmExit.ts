import { useEffect } from 'react';
import { Alert, type AlertButton } from 'react-native';
import { useNavigation } from 'expo-router';

interface ExitEvent<Action> {
  preventDefault: () => void;
  data: { action: Action };
}

interface ExitGuardOptions<Action> {
  title: string;
  message: string;
  /** Mostra o diálogo (em produção, Alert.alert). */
  alert: (title: string, message: string, buttons: AlertButton[]) => void;
  /** Deixa a navegação que foi interrompida seguir em frente. */
  dispatch: (action: Action) => void;
}

/**
 * O que fazer quando a pessoa tenta sair da tela (botão Voltar, gesto ou tecla do Android):
 * segura a saída e pergunta; só sai se ela confirmar.
 */
export function makeExitGuard<Action>({ title, message, alert, dispatch }: ExitGuardOptions<Action>) {
  return (event: ExitEvent<Action>): void => {
    event.preventDefault();
    alert(title, message, [
      { text: 'Continuar estudando', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => dispatch(event.data.action) },
    ]);
  };
}

/** Pede confirmação antes de sair da tela enquanto `active` for verdadeiro (ex.: no meio de um teste). */
export function useConfirmExit(active: boolean, title: string, message: string): void {
  const navigation = useNavigation();
  useEffect(() => {
    if (!active) return undefined;
    const guard = makeExitGuard<Parameters<typeof navigation.dispatch>[0]>({
      title,
      message,
      alert: (t, m, buttons) => Alert.alert(t, m, buttons),
      dispatch: (action) => navigation.dispatch(action),
    });
    return navigation.addListener('beforeRemove', guard);
  }, [active, navigation, title, message]);
}
