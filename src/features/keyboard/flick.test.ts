import { FLICK_KEYS, SIMULATOR_WORDS, TYPING_CHALLENGES } from '@/data/keyboard';
import {
  applyMod,
  baseOf,
  charFor,
  checkTyping,
  FLICK_THRESHOLD,
  howTo,
  resolveDirection,
  simulatorProgress,
} from './flick';

const key = (label: string) => {
  const k = FLICK_KEYS.find((x) => x.label === label);
  if (!k) throw new Error(`tecla ${label} não existe`);
  return k;
};

describe('resolveDirection', () => {
  it('toque curto ou parado é o centro', () => {
    expect(resolveDirection(0, 0)).toBe(0);
    expect(resolveDirection(10, 10)).toBe(0);
    expect(resolveDirection(FLICK_THRESHOLD, 0)).toBe(0);
  });

  it('o eixo com mais movimento decide a direção', () => {
    expect(resolveDirection(-30, 5)).toBe(1); // esquerda
    expect(resolveDirection(4, -40)).toBe(2); // cima
    expect(resolveDirection(35, -10)).toBe(3); // direita
    expect(resolveDirection(-8, 50)).toBe(4); // baixo
  });
});

describe('charFor', () => {
  it('a tecla か: toque か, esquerda き, cima く, direita け, baixo こ', () => {
    const ka = key('か');
    expect([0, 1, 2, 3, 4].map((d) => charFor(ka, d as 0 | 1 | 2 | 3 | 4))).toEqual(['か', 'き', 'く', 'け', 'こ']);
  });

  it('a regra vale para todas as teclas: centro a, esquerda i, cima u, direita e, baixo o', () => {
    for (const k of FLICK_KEYS.filter((x) => ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'ら'].includes(x.label))) {
      const sounds = [0, 1, 2, 3, 4].map((d) => charFor(k, d as 0 | 1 | 2 | 3 | 4));
      expect(sounds).toHaveLength(5);
      expect(new Set(sounds).size).toBe(5);
    }
  });
});

describe('baseOf / applyMod', () => {
  it('acha a letra base e quantos toques em 小゛゜', () => {
    expect(baseOf('か')).toEqual(['か', 0]);
    expect(baseOf('が')).toEqual(['か', 1]);
    expect(baseOf('ぱ')).toEqual(['は', 2]);
    expect(baseOf('っ')).toEqual(['つ', 1]);
    expect(baseOf('づ')).toEqual(['つ', 2]);
    expect(baseOf('ー')).toEqual(['ー', 0]);
  });

  it('a tecla 小゛゜ percorre o ciclo e volta ao começo', () => {
    expect(applyMod('は')).toBe('ば');
    expect(applyMod('ば')).toBe('ぱ');
    expect(applyMod('ぱ')).toBe('は');
    expect(applyMod('つ')).toBe('っ');
    expect(applyMod('っ')).toBe('づ');
    expect(applyMod('づ')).toBe('つ');
    expect(applyMod('や')).toBe('ゃ');
  });

  it('só mexe na última letra e ignora o que não tem variação', () => {
    expect(applyMod('かき')).toBe('かぎ');
    expect(applyMod('ん')).toBe('ん');
    expect(applyMod('')).toBe('');
  });
});

describe('howTo', () => {
  it('toque, deslize e a tecla de modificação', () => {
    expect(howTo('か')?.text).toBe('か: tecla か, toque e solte');
    expect(howTo('き')?.text).toBe('き: tecla か, deslize para a esquerda ←');
    expect(howTo('が')?.text).toBe('が: tecla か, toque e solte, depois toque em 小゛゜');
    expect(howTo('ぱ')?.text).toBe('ぱ: tecla は, toque e solte, depois toque em 小゛゜ 2 vezes');
  });

  it('o traço longo fica na tecla わ, deslizando para a direita', () => {
    expect(howTo('ー')).toMatchObject({ key: 'わ', direction: 3 });
    expect(howTo('を')).toMatchObject({ key: 'わ', direction: 1 });
    expect(howTo('ん')).toMatchObject({ key: 'わ', direction: 2 });
  });

  it('caractere que o teclado não tem devolve null', () => {
    expect(howTo('日')).toBeNull();
    expect(howTo('A')).toBeNull();
  });
});

describe('simulatorProgress', () => {
  it('prefixo certo, próxima letra e conclusão', () => {
    expect(simulatorProgress('', 'ねこ')).toEqual({ correct: 0, done: false, next: 'ね' });
    expect(simulatorProgress('ね', 'ねこ')).toEqual({ correct: 1, done: false, next: 'こ' });
    expect(simulatorProgress('ねこ', 'ねこ')).toEqual({ correct: 2, done: true, next: null });
  });

  it('uma letra errada para a dica até apagar', () => {
    expect(simulatorProgress('ぬ', 'ねこ')).toEqual({ correct: 0, done: false, next: null });
    expect(simulatorProgress('ねす', 'ねこ')).toEqual({ correct: 1, done: false, next: null });
  });
});

describe('o simulador consegue digitar todas as palavras', () => {
  /** Digita um caractere como a pessoa faria: tecla na direção certa e, se preciso, 小゛゜. */
  function type(buffer: string, char: string): string {
    const plan = howTo(char);
    if (!plan) throw new Error(`sem como digitar ${char}`);
    let next = buffer + charFor(key(plan.key), plan.direction);
    for (let i = 0; i < plan.modPresses; i++) next = applyMod(next);
    return next;
  }

  it.each(SIMULATOR_WORDS.map((w) => [w.word]))('%s', (word) => {
    const typed = [...word].reduce(type, '');
    expect(typed).toBe(word);
    expect(simulatorProgress(typed, word).done).toBe(true);
  });
});

describe('checkTyping', () => {
  it('acerta ignorando espaços comuns e de largura total', () => {
    expect(checkTyping('わたし は ブラジルじん です', 'わたしはブラジルじんです')).toEqual({ ok: true, message: 'Certo!' });
    expect(checkTyping('ねこ　', 'ねこ').ok).toBe(true);
  });

  it('campo vazio pede para digitar', () => {
    expect(checkTyping('   ', 'ねこ')).toEqual({ ok: false, message: 'Digite algo antes de conferir.' });
  });

  it('teclado em letras: manda trocar para o japonês', () => {
    expect(checkTyping('neko', 'ねこ').message).toContain('teclado está em letras');
  });

  it('faltou converter para katakana ou escolher o kanji', () => {
    expect(checkTyping('らーめん', 'ラーメン').message).toContain('katakana');
    expect(checkTyping('にほん', '日本').message).toContain('kanji');
    expect(checkTyping('とうきょう', '東京').message).toContain('kanji');
  });

  it('outro erro: compara letra por letra e mostra o que saiu e o esperado', () => {
    const result = checkTyping('ありがとお', 'ありがとう');
    expect(result.ok).toBe(false);
    expect(result.message).toBe('Saiu ありがとお. O esperado é ありがとう. Compare letra por letra.');
  });

  it('os 9 desafios iniciais são resolvíveis com o texto exato', () => {
    for (const c of TYPING_CHALLENGES) expect(checkTyping(c.word, c.word).ok).toBe(true);
  });
});

describe('checkTyping: o traço longo ー não conta como katakana', () => {
  it('"こーひー" (hiragana com ー) para コーヒー ainda recebe a dica de converter', () => {
    expect(checkTyping('こーひー', 'コーヒー').message).toContain('katakana');
  });

  it('digitar o katakana certo, mas errado numa letra, não pede para converter', () => {
    expect(checkTyping('コーヒ', 'コーヒー').message).toBe('Saiu コーヒ. O esperado é コーヒー. Compare letra por letra.');
  });
});
