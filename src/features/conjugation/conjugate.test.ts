import { VOCAB } from '@/content';
import { conjugate, VERB_FORMS, type VerbForm, type VerbSpec } from './conjugate';
import { findVerb, missingVerbIds, VERBS } from './verbs';

const forms = (text: string, spec: Pick<VerbSpec, 'group' | 'irregular'>): Record<VerbForm, string> => ({
  masu: conjugate(text, spec, 'masu'),
  nai: conjugate(text, spec, 'nai'),
  te: conjugate(text, spec, 'te'),
  ta: conjugate(text, spec, 'ta'),
});

describe('conjugate', () => {
  it('grupo 2 só troca o る', () => {
    expect(forms('たべる', { group: 'ichidan' })).toEqual({ masu: 'たべます', nai: 'たべない', te: 'たべて', ta: 'たべた' });
    expect(forms('見る', { group: 'ichidan' })).toEqual({ masu: '見ます', nai: '見ない', te: '見て', ta: '見た' });
  });

  it.each([
    ['かう', 'かいます', 'かわない', 'かって', 'かった'],
    ['まつ', 'まちます', 'またない', 'まって', 'まった'],
    ['のる', 'のります', 'のらない', 'のって', 'のった'],
    ['よむ', 'よみます', 'よまない', 'よんで', 'よんだ'],
    ['あそぶ', 'あそびます', 'あそばない', 'あそんで', 'あそんだ'],
    ['しぬ', 'しにます', 'しなない', 'しんで', 'しんだ'],
    ['かく', 'かきます', 'かかない', 'かいて', 'かいた'],
    ['およぐ', 'およぎます', 'およがない', 'およいで', 'およいだ'],
    ['はなす', 'はなします', 'はなさない', 'はなして', 'はなした'],
  ])('grupo 1: %s', (dict, masu, nai, te, ta) => {
    expect(forms(dict, { group: 'godan' })).toEqual({ masu, nai, te, ta });
  });

  it('conjuga a escrita com kanji do mesmo jeito', () => {
    expect(conjugate('飲む', { group: 'godan' }, 'te')).toBe('飲んで');
    expect(conjugate('泳ぐ', { group: 'godan' }, 'ta')).toBe('泳いだ');
  });

  it('行く é irregular só em て e た', () => {
    const iku = { group: 'godan', irregular: 'iku' } as const;
    expect(forms('いく', iku)).toEqual({ masu: 'いきます', nai: 'いかない', te: 'いって', ta: 'いった' });
    expect(forms('行く', iku).te).toBe('行って');
  });

  it('ある tem a negativa ない', () => {
    const aru = { group: 'godan', irregular: 'aru' } as const;
    expect(forms('ある', aru)).toEqual({ masu: 'あります', nai: 'ない', te: 'あって', ta: 'あった' });
  });

  it('する, 来る e os compostos com する', () => {
    expect(forms('する', { group: 'suru' })).toEqual({ masu: 'します', nai: 'しない', te: 'して', ta: 'した' });
    expect(forms('コピーする', { group: 'suru' }).nai).toBe('コピーしない');
    expect(forms('くる', { group: 'kuru' })).toEqual({ masu: 'きます', nai: 'こない', te: 'きて', ta: 'きた' });
    expect(forms('来る', { group: 'kuru' })).toEqual({ masu: '来ます', nai: '来ない', te: '来て', ta: '来た' });
  });

  it('erra alto quando o final não combina com o grupo', () => {
    expect(() => conjugate('のむ', { group: 'ichidan' }, 'masu')).toThrow();
    expect(() => conjugate('たべる', { group: 'suru' }, 'masu')).toThrow();
    expect(() => conjugate('ねこ', { group: 'godan' }, 'masu')).toThrow();
  });
});

describe('verbos do vocabulário', () => {
  it('todos os verbos listados existem no vocabulário', () => {
    expect(missingVerbIds()).toEqual([]);
  });

  it('há verbos de todos os grupos', () => {
    const groups = new Set(VERBS.map((v) => v.spec.group));
    expect([...groups].sort()).toEqual(['godan', 'ichidan', 'kuru', 'suru']);
  });

  it('todo verbo conjuga na escrita e na leitura nas 4 formas', () => {
    for (const { word, spec } of VERBS) {
      for (const form of VERB_FORMS) {
        expect(() => conjugate(word.jp, spec, form)).not.toThrow();
        expect(() => conjugate(word.reading, spec, form)).not.toThrow();
      }
    }
  });

  it('os verbos em る do grupo 2 têm i ou e antes do る (na leitura)', () => {
    for (const { word } of VERBS.filter((v) => v.spec.group === 'ichidan')) {
      const beforeRu = [...word.reading].at(-2) ?? '';
      expect('いきしちにひみりぎじびぴえけせてねへめれげぜでべぺ').toContain(beforeRu);
    }
  });

  it('o grupo 1 em る inclui as exceções conhecidas', () => {
    for (const id of ['切る', '知る', '帰る', '入る', '走る']) expect(findVerb(id)?.spec.group).toBe('godan');
  });

  it('cada palavra aparece uma vez', () => {
    expect(new Set(VERBS.map((v) => v.word.id)).size).toBe(VERBS.length);
    expect(VERBS.length).toBeGreaterThan(80);
    expect(VOCAB.length).toBeGreaterThan(VERBS.length);
  });
});
