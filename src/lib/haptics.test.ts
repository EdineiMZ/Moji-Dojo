import * as Haptics from 'expo-haptics';
import { setFeedbackPrefs } from './feedbackPrefs';
import { hapticError, hapticLight, hapticSuccess } from './haptics';

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
  ImpactFeedbackStyle: { Light: 'light' },
}));

const notification = Haptics.notificationAsync as jest.Mock;
const impact = Haptics.impactAsync as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  setFeedbackPrefs({ haptics: true });
});

describe('haptics', () => {
  it('ligado: vibra no sucesso, no erro e no toque leve', () => {
    hapticSuccess();
    hapticError();
    hapticLight();
    expect(notification).toHaveBeenCalledWith('success');
    expect(notification).toHaveBeenCalledWith('error');
    expect(impact).toHaveBeenCalledWith('light');
  });

  it('desligado em Ajustes: não vibra nada', () => {
    setFeedbackPrefs({ haptics: false });
    hapticSuccess();
    hapticError();
    hapticLight();
    expect(notification).not.toHaveBeenCalled();
    expect(impact).not.toHaveBeenCalled();
  });

  it('aparelho sem vibrador (erro na chamada) não derruba o app', async () => {
    notification.mockImplementationOnce(() => Promise.reject(new Error('sem vibrador')));
    expect(() => hapticSuccess()).not.toThrow();
    await Promise.resolve(); // deixa a rejeição ser tratada
  });
});
