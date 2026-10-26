import { VOCAB } from '@/content';
import { conversionPool, lookupReading, pickConversion, suggestionBar } from './conversion';
import { basePool, buildPracticePool, highestUnlocked, isUnlocked, levelOf, LEVELS, pickPractice, typeable, UNLOCK_AFTER } from './practice';
import { itemResult, startTrack, trackStep } from './tracker';
import { averageCpm, EMPTY_TYPING, keyHeat, recordItem, recordKey, sanitizeTyping, weakChars, type TypingKeyEvent, type TypingProgress } from './typingStats';

describe('typeable e levelOf', () => {
  it('aceita o que o teclado de flick digita e recusa o resto', () => {
    expect(typeable('ありがとう。')).toBe(true);
    expect(typeable('日本')).toBe(false);
    expect(typeable('コーヒー')).toBe(false);
    expect(typeable('')).toBe(false);
  });

  it('classifica pela letra mais difícil e pelo tamanho', () => {
    expect(levelOf('あかさ')).toBe(1);
    expect(levelOf('はは')).toBe(2);
    expect(levelOf('がく')).toBe(3);
    expect(levelOf('きって')).toBe(4);
    expect(levelOf('ありがとう')).toBe(3);
    expect(levelOf('わたしのなまえは')).toBe(5);
    expect(levelOf('わたしはぶらじるじんです')).toBe(6);
  });
});

describe('conjunto de treino', () => {
  it('todo item é digitável, sem espaços, e há itens nos 6 níveis', () => {
    const pool = basePool();
    expect(pool.length).toBeGreaterThan(500);
    for (const item of pool) {
      expect(typeable(item.text)).toBe(true);
      expect(item.text).not.toMatch(/\s/);
      expect(item.level).toBe(levelOf(item.text));
    }
    for (const level of LEVELS) expect(pool.some((i) => i.level === level.id)).toBe(true);
  });

  it('inclui as frases extras (sem repetir e só as digitáveis)', () => {
    const pool = buildPracticePool([
      { jp: 'ねこが すき', pt: 'gosto de gato', source: 'mine' },
      { jp: '猫が好き', pt: 'tem kanji', source: 'ai' },
    ]);
    expect(pool.find((i) => i.text === 'ねこがすき')?.source).toBe('mine');
    expect(pool.some((i) => i.meaning === 'tem kanji')).toBe(false);
  });

  it('escolhe o que tem mais letras fracas e evita repetir', () => {
    const pool = buildPracticePool();
    const pick = pickPractice(pool, () => 0, { weak: new Set(['ぎ']) });
    expect(pick?.text).toContain('ぎ');
    const again = pickPractice(pool.slice(0, 2), () => 0, { avoid: pool[0]?.text ?? '' });
    expect(again?.text).toBe(pool[1]?.text);
  });
});

describe('níveis', () => {
  it('o primeiro é livre e cada um libera depois de itens concluídos no anterior', () => {
    expect(isUnlocked(1, EMPTY_TYPING)).toBe(true);
    expect(isUnlocked(2, EMPTY_TYPING)).toBe(false);
    const done: TypingProgress = { ...EMPTY_TYPING, levelDone: { '1': UNLOCK_AFTER, '2': 3 } };
    expect(isUnlocked(2, done)).toBe(true);
    expect(isUnlocked(3, done)).toBe(false);
    expect(highestUnlocked(done)).toBe(2);
  });
});

describe('estatísticas', () => {
  it('registra acertos com tempo limitado e erros', () => {
    let t = recordKey(EMPTY_TYPING, 'か', true, 500);
    t = recordKey(t, 'か', true, 99999);
    t = recordKey(t, 'か', false, 0);
    expect(t.keys['か']).toEqual({ ok: 2, bad: 1, ms: 500 + 6000 });
    expect(recordKey(t, '日', false, 0)).toBe(t);
  });

  it('mede a velocidade e o recorde só com 4 letras ou mais', () => {
    let t = recordItem(EMPTY_TYPING, 1, 5, 3000);
    expect(t.best).toBe(100);
    t = recordItem(t, 1, 2, 100);
    expect(t.best).toBe(100);
    expect(t.levelDone['1']).toBe(2);
    expect(averageCpm(t)).toBe(Math.round((7 / 3100) * 60000));
  });

  it('acha as letras fracas e agrupa por tecla', () => {
    let t = recordKey(EMPTY_TYPING, 'が', false, 0);
    t = recordKey(t, 'が', true, 800);
    t = recordKey(t, 'あ', true, 300);
    t = recordKey(t, 'き', false, 0);
    t = recordKey(t, 'き', false, 0);
    expect(weakChars(t)).toEqual(['き', 'が']);
    const heat = keyHeat(t);
    expect(heat).toHaveLength(12);
    expect(heat.find((h) => h.label === 'か')).toMatchObject({ bad: 3, tries: 4 });
    expect(heat.find((h) => h.label === 'あ')?.avgMs).toBe(300);
  });

  it('lê dados ruins sem quebrar', () => {
    expect(sanitizeTyping(null)).toBe(EMPTY_TYPING);
    const clean = sanitizeTyping({ keys: { か: { ok: 2, bad: -1, ms: 'x' }, 日: { ok: 1 }, ab: { ok: 1 } }, levelDone: { '1': 4, '12': 3, x: 1 }, chars: 10, ms: 5, best: 'a' });
    expect(clean.keys).toEqual({ か: { ok: 2, bad: 0, ms: 0 } });
    expect(clean.levelDone).toEqual({ '1': 4 });
    expect(clean).toMatchObject({ chars: 10, ms: 5, best: 0 });
  });
});

describe('trackStep', () => {
  const run = (target: string, presses: string[]) => {
    let state = startTrack(0);
    const events: TypingKeyEvent[] = [];
    presses.forEach((next, i) => {
      const step = trackStep(state, next, target, (i + 1) * 1000);
      state = step.state;
      events.push(...step.events);
    });
    return { state, events };
  };

  it('credita as letras certas com o tempo entre elas', () => {
    const { events } = run('ねこ', ['ね', 'ねこ']);
    expect(events).toEqual([
      { char: 'ね', ok: true, ms: 1000 },
      { char: 'こ', ok: true, ms: 1000 },
    ]);
  });

  it('conta o erro uma vez, na letra esperada', () => {
    const { events } = run('ねこ', ['の', 'のあ']);
    expect(events).toEqual([{ char: 'ね', ok: false, ms: 0 }]);
  });

  it('não conta como erro a letra que vira a certa com 小゛゜', () => {
    expect(run('が', ['か', 'が']).events).toEqual([{ char: 'が', ok: true, ms: 2000 }]);
    expect(run('っ', ['つ', 'っ']).events.every((e) => e.ok)).toBe(true);
    expect(run('が', ['き']).events).toEqual([{ char: 'が', ok: false, ms: 0 }]);
  });

  it('o resultado do item usa a primeira tecla e ignora palavras de 2 letras', () => {
    const { state } = run('ありがとう', ['あ', 'あり']);
    expect(itemResult(state, 'ありがとう', 5000)).toEqual({ chars: 4, ms: 4000 });
    expect(itemResult(state, 'ねこ', 5000)).toEqual({ chars: 0, ms: 0 });
  });
});

describe('conversão', () => {
  it('a barra tem a escrita certa, no máximo 4 sugestões, sem repetir', () => {
    const pool = conversionPool();
    expect(pool.length).toBeGreaterThan(100);
    for (const item of pool.slice(0, 80)) {
      const bar = suggestionBar(item);
      expect(bar).toContain(item.target);
      expect(bar.length).toBeLessThanOrEqual(4);
      expect(new Set(bar).size).toBe(bar.length);
    }
  });

  it('oferece a própria leitura em kana, como os teclados reais', () => {
    const item = conversionPool()[0];
    if (!item) throw new Error('sem palavras');
    expect(suggestionBar(item, () => 0.5, [item])).toContain(item.reading);
    expect(pickConversion(() => 0, item.target)?.target).not.toBe(item.target);
  });

  it('procura palavras pela leitura digitada', () => {
    const word = VOCAB.find((w) => w.jp !== w.reading);
    if (!word) throw new Error('sem palavras');
    expect(lookupReading(word.reading).some((w) => w.jp === word.jp)).toBe(true);
    expect(lookupReading('')).toEqual([]);
  });
});
