import { VOCAB } from '@/content';
import { WORD_RECORDINGS } from '@/content/wordAudio';
import { KANA } from '@/data/kana';
import { MIN_READING_LENGTH, recordingFor } from './nativeAudio';

jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(), setAudioModeAsync: jest.fn() }));

/** A palavra que consta no nome do arquivo da gravação no Wikimedia Commons ("LL-Q5287 (jpn)-Falante-PALAVRA.wav"). */
const labelOf = (page: string): string => /LL-Q5287_\(jpn\)-[^-]+-(.+)\.wav$/.exec(decodeURIComponent(page))?.[1] ?? '';

describe('gravações de falantes nativos', () => {
  it('o nome do arquivo de cada gravação é a palavra da chave (os dados não trocaram gravações)', () => {
    const wrong = Object.entries(WORD_RECORDINGS).filter(([word, rec]) => labelOf(rec.page).normalize('NFC') !== word.normalize('NFC')).map(([word]) => word);
    expect(wrong).toEqual([]);
  });

  it('uma letra da tabela nunca toca a gravação de outra palavra: ou é a gravação da própria letra, ou não há gravação', () => {
    const offenders: string[] = [];
    for (const k of KANA.filter((x) => [...x.char].length === 1)) {
      const rec = recordingFor(k.char);
      if (rec && labelOf(rec.page) !== k.char) offenders.push(`${k.char} → ${labelOf(rec.page)}`);
    }
    expect(offenders).toEqual([]);
  });

  it('as letras do caso reportado (し e じ) e as homófonas curtas não tocam gravação de kanji', () => {
    for (const char of ['し', 'じ', 'き', 'は', 'ご', 'に', 'か', 'いち']) expect(recordingFor(char)).toBeNull();
  });

  it('a palavra escrita sempre acha a sua própria gravação', () => {
    for (const [word, rec] of Object.entries(WORD_RECORDINGS)) expect(recordingFor(word)).toBe(rec);
  });

  it('toda gravação achada pela leitura vem de uma leitura longa e sem homófonas de significado diferente', () => {
    const readings = [...new Set(VOCAB.map((w) => w.reading))];
    let viaReading = 0;
    for (const reading of readings) {
      const rec = recordingFor(reading);
      if (!rec || WORD_RECORDINGS[reading]) continue;
      viaReading++;
      expect([...reading].length).toBeGreaterThanOrEqual(MIN_READING_LENGTH);
      const words = VOCAB.filter((w) => w.reading === reading);
      expect(new Set(words.map((w) => w.meaning)).size).toBe(1);
      // E a gravação é mesmo de uma das palavras com essa leitura.
      expect(words.some((w) => WORD_RECORDINGS[w.jp] === rec)).toBe(true);
    }
    expect(viaReading).toBeGreaterThan(50);
  });

  it('palavras longas com kanji ainda tocam a gravação quando o texto vem escrito só em kana', () => {
    expect(recordingFor('がくせい')).toBe(WORD_RECORDINGS['学生']);
  });
});
