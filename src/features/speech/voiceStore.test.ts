import * as Speech from 'expo-speech';
import { useSettingsStore } from '@/store';
import { recentSpeech, speakJapanese } from './voiceStore';

jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItemSync: (k: string) => data.get(k) ?? null,
      setItemSync: (k: string, v: string) => void data.set(k, v),
      removeItemSync: (k: string) => void data.delete(k),
    },
  };
});
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
  getAvailableVoicesAsync: jest.fn(() => Promise.resolve([])),
}));
jest.mock('./nativeAudio', () => ({
  playFile: jest.fn(() => true),
  playRecording: jest.fn(() => true),
  recordingFor: jest.fn(() => null),
  stopRecording: jest.fn(),
}));
jest.mock('./voicevox', () => ({
  synthesizeFile: jest.fn(),
  voicevoxActive: jest.fn(() => false),
  warmUpVoicevox: jest.fn(),
}));

const speak = Speech.speak as jest.Mock;
const lastOptions = () => speak.mock.calls[speak.mock.calls.length - 1][1] as { onStart: () => void; onDone: () => void };

describe('voz do Android', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    speak.mockClear();
    useSettingsStore.setState({ nativeAudio: false });
  });
  afterEach(() => jest.useRealTimers());

  it('não repete a fala quando o motor fala sem avisar o início', () => {
    speakJapanese('あ');
    expect(speak).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(900); // a fala durou 900 ms
    lastOptions().onDone();
    expect(speak).toHaveBeenCalledTimes(1);
    expect(recentSpeech()[0]?.note).toMatch(/^ok/);
  });

  it('repete só quando a fala acabou na hora, sem ter começado (voz silenciosa)', () => {
    speakJapanese('いえ');
    jest.advanceTimersByTime(100);
    lastOptions().onDone();
    expect(speak).toHaveBeenCalledTimes(2);
  });

  it('para a fala anterior antes de começar a próxima', () => {
    speakJapanese('はし');
    jest.advanceTimersByTime(100);
    (Speech.stop as jest.Mock).mockClear();
    speakJapanese('かみ');
    expect(Speech.stop).toHaveBeenCalled();
  });
});
