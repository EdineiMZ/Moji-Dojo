import { VOCAB } from '@/content';
import { SOUND_TOPICS } from '@/data/sounds';
import { ALL_ITEMS, pronunciationText } from '@/features/catalog';
import { MIN_SPOKEN_LENGTH, speechText, spokenLength } from './voices';

/** Tudo o que o app manda para a voz: a voz do Android fica muda com textos curtos demais, então nenhum pode chegar assim. */
const speakable: { source: string; text: string }[] = [
  ...SOUND_TOPICS.flatMap((t) => t.examples.map((e) => ({ source: `sons: ${t.title}`, text: e.say ?? e.jp }))),
  ...ALL_ITEMS.map((item) => ({ source: `catálogo: ${item.char}`, text: pronunciationText(item) })),
  ...VOCAB.map((w) => ({ source: `palavra: ${w.id}`, text: w.reading })),
];

describe('textos que o app fala', () => {
  it('há textos de todas as fontes', () => {
    expect(speakable.length).toBeGreaterThan(1300);
  });

  it('nenhum chega à voz com menos de três letras, e nenhum fica vazio', () => {
    const short = speakable.filter(({ text }) => spokenLength(speechText(text)) < MIN_SPOKEN_LENGTH);
    expect(short.map((s) => `${s.source} → "${s.text}"`)).toEqual([]);
  });

  it('nenhum leva letras latinas, números ou parênteses (a voz japonesa lê isso em inglês)', () => {
    const odd = speakable.filter(({ text }) => /[A-Za-z0-9()（）]/.test(speechText(text)));
    expect(odd.map((s) => `${s.source} → "${s.text}"`)).toEqual([]);
  });
});
