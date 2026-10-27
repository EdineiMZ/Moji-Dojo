import { VOCAB } from '@/content';
import { cardKey } from '@/features/vocab/cards';
import { ankiField, ankiRows, buildAnkiFile, toAnkiText } from './anki';
import { buildDeck, deckCount, DECKS, wordCard, type DeckSources } from './decks';

const first = VOCAB[0]!;
const second = VOCAB[1]!;

const sources = (over: Partial<DeckSources> = {}): DeckSources => ({
  vocab: { [cardKey(first.id, 'jm')]: { b: 1, due: 0 }, [cardKey(first.id, 'mj')]: { b: 1, due: 0 } },
  srs: {},
  conj: {},
  particles: {},
  myPhrases: { p1: { jp: 'ありがとう', pt: 'Obrigado', at: 1, b: 0, due: 0 } },
  ...over,
});

describe('wordCard', () => {
  it('japonês → português mostra a palavra na frente e o significado com a leitura atrás', () => {
    const card = wordCard(first, 'jp-pt', true);
    expect(card.front).toBe(first.jp);
    expect(card.back).toBe(first.meaning);
    expect(card.say).toBe(first.reading);
    expect(card.grade).toEqual({ kind: 'vocab', key: cardKey(first.id, 'jm') });
  });

  it('português → japonês inverte os lados e usa o cartão certo da revisão', () => {
    const card = wordCard(first, 'pt-jp', true);
    expect(card.front).toBe(first.meaning);
    expect(card.back).toBe(first.jp);
    expect(card.grade).toEqual({ kind: 'vocab', key: cardKey(first.id, 'mj') });
  });

  it('palavra que ainda não é estudada vira "aprender", sem mexer na revisão', () => {
    expect(wordCard(second, 'jp-pt', false).grade).toEqual({ kind: 'learn', wordId: second.id });
  });
});

describe('buildDeck', () => {
  it('"Palavras que estudo" só traz as que já têm cartões, e "novas" só as que não têm', () => {
    const studied = buildDeck('words', sources(), { direction: 'jp-pt', size: 1000 });
    expect(studied.map((c) => c.id)).toEqual([`${first.id}|jp-pt`]);
    const fresh = buildDeck('new-words', sources(), { direction: 'jp-pt', size: 1000 });
    expect(fresh.length).toBe(VOCAB.length - 1);
    expect(fresh.some((c) => c.id.startsWith(`${first.id}|`))).toBe(false);
  });

  it('respeita o tamanho da rodada e não repete cartões', () => {
    const cards = buildDeck('new-words', sources(), { direction: 'mixed', size: 15 });
    expect(cards).toHaveLength(15);
    expect(new Set(cards.map((c) => c.id)).size).toBe(15);
  });

  it('o modo misturado sorteia a direção de cada cartão', () => {
    const cards = buildDeck('new-words', sources(), { direction: 'mixed', size: 200 });
    const dirs = new Set(cards.map((c) => c.id.split('|').pop()));
    expect(dirs).toEqual(new Set(['jp-pt', 'pt-jp']));
  });

  it('as frases do aluno viram cartões, em qualquer direção', () => {
    const [card] = buildDeck('mine', sources(), { direction: 'pt-jp', size: 5 });
    expect(card).toMatchObject({ front: 'Obrigado', back: 'ありがとう', say: 'ありがとう' });
  });

  it('kana e kanji começam por tudo quando nada foi estudado, e tem som para a voz', () => {
    const kana = buildDeck('kana', sources(), { direction: 'jp-pt', size: 500 });
    expect(kana.length).toBeGreaterThan(100);
    expect(kana.every((c) => c.grade?.kind === 'kana')).toBe(true);
    expect(buildDeck('kanji', sources(), { direction: 'jp-pt', size: 500 }).length).toBeGreaterThan(50);
  });

  it('só os itens estudados entram no kana quando já há progresso', () => {
    const cards = buildDeck('kana', sources({ srs: { あ: { b: 1, due: 0 } } }), { direction: 'jp-pt', size: 500 });
    expect(cards.map((c) => c.front)).toEqual(['あ']);
  });

  it('deckCount bate com o tamanho do baralho, e todo baralho tem nome', () => {
    expect(deckCount('mine', sources())).toBe(1);
    expect(deckCount('words', sources())).toBe(1);
    expect(DECKS.map((d) => d.id)).toHaveLength(7);
  });
});

describe('Anki', () => {
  it('escapa HTML e quebras de linha dos campos', () => {
    expect(ankiField('a & b <i>\tc\nd')).toBe('a &amp; b &lt;i&gt; c<br>d');
  });

  it('o arquivo traz os cabeçalhos, uma linha por cartão e não repete a mesma frente', () => {
    const text = toAnkiText([
      { front: '猫', back: 'gato', tags: 'MojiDojo::Palavras' },
      { front: '猫', back: 'outro gato', tags: 'MojiDojo::Palavras' },
      { front: '犬', back: 'cachorro', tags: 'MojiDojo::Palavras' },
    ]);
    expect(text.split('\n')).toEqual(['#separator:tab', '#html:true', '#tags column:3', '猫\tgato\tMojiDojo::Palavras', '犬\tcachorro\tMojiDojo::Palavras', '']);
  });

  it('palavras estudadas e todas as palavras são conjuntos diferentes', () => {
    const learned = ankiRows('words-learned', sources());
    const all = ankiRows('words-all', sources());
    expect(learned).toHaveLength(1);
    expect(all).toHaveLength(VOCAB.length);
    expect(learned[0]?.front).toBe(first.jp);
  });

  it('etiquetas não têm espaços (o Anki as separa por espaço) e cada linha tem 3 colunas', () => {
    const { text, count } = buildAnkiFile(['words-all', 'kanji', 'travel', 'mine'], sources());
    const body = text.split('\n').filter((l) => l !== '' && !l.startsWith('#'));
    expect(body).toHaveLength(count);
    for (const line of body) {
      const cols = line.split('\t');
      expect(cols).toHaveLength(3);
      expect(cols[2]).not.toMatch(/\s/);
      expect(cols[0]).not.toBe('');
    }
  });
});
