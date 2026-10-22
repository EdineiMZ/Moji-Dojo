import type { AlertButton } from 'react-native';
import { makeExitGuard } from './useConfirmExit';

// O hook usa a navegação do app; o que importa testar é a decisão, que é a função pura.
jest.mock('expo-router', () => ({ useNavigation: jest.fn() }));

function setup() {
  const alert = jest.fn<void, [string, string, AlertButton[]]>();
  const dispatch = jest.fn();
  const preventDefault = jest.fn();
  const guard = makeExitGuard({ title: 'Sair?', message: 'Você ainda não terminou.', alert, dispatch });
  guard({ preventDefault, data: { action: { type: 'GO_BACK' } } });
  const buttons = alert.mock.calls[0]?.[2] ?? [];
  return { alert, dispatch, preventDefault, buttons };
}

describe('makeExitGuard', () => {
  it('segura a saída e pergunta, com o título e a mensagem recebidos', () => {
    const { alert, preventDefault, dispatch } = setup();
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(alert).toHaveBeenCalledWith('Sair?', 'Você ainda não terminou.', expect.any(Array));
    expect(dispatch).not.toHaveBeenCalled(); // ainda não saiu
  });

  it('oferece continuar (cancela) e sair (destrutivo)', () => {
    const { buttons } = setup();
    expect(buttons.map((b) => [b.text, b.style])).toEqual([
      ['Continuar estudando', 'cancel'],
      ['Sair', 'destructive'],
    ]);
  });

  it('só sai se a pessoa confirmar, repetindo a navegação que foi interrompida', () => {
    const { buttons, dispatch } = setup();
    buttons[1]?.onPress?.();
    expect(dispatch).toHaveBeenCalledWith({ type: 'GO_BACK' });
  });

  it('continuar estudando não navega', () => {
    const { buttons, dispatch } = setup();
    buttons[0]?.onPress?.();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
