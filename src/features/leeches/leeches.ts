import { findItem } from '@/features/catalog';
import { FORM_LABELS, parseCardKey as parseVerbKey } from '@/features/conjugation/cards';
import { isLeech, type SrsState } from '@/features/review/srs';
import { parseCardKey as parseWordKey } from '@/features/vocab/cards';

export type LeechArea = 'kana' | 'vocab' | 'conj' | 'particle';

export interface Leech {
  area: LeechArea;
  /** O que aparece para o aluno ("あ (a)", "学校 · escola", "食べる · forma て"). */
  label: string;
  lapses: number;
  /** Id da palavra, nos itens de vocabulário (para guardar a dica de memória). */
  id?: string;
  /** Outra abordagem para esse item. */
  tip: string;
}

const TIPS: Readonly<Record<LeechArea, string>> = {
  kana: 'Desenhe o caractere devagar três vezes e invente uma imagem para ele (o que a forma lembra?). Depois compare com um parecido.',
  vocab: 'Em vez de repetir a tradução, escreva uma frase sua com a palavra ou veja as frases do Banco. Anote o que a confunde com outra.',
  conj: 'Volte à regra do grupo do verbo e conjugue em voz alta, devagar, antes de revisar de novo.',
  particle: 'Leia a explicação da partícula e releia os exemplos: o que ela marca na frase, e o que a separa da vizinha?',
};

interface Sources {
  srs: SrsState;
  vocab: SrsState;
  conj: SrsState;
  particles: SrsState;
}

/** Os itens que o aluno esquece sempre (4 esquecimentos ou mais e ainda nas primeiras caixas), os mais esquecidos primeiro. */
export function findLeeches({ srs, vocab, conj, particles }: Sources): Leech[] {
  const out: Leech[] = [];
  const add = (area: LeechArea, label: string, lapses: number, id?: string) => out.push({ area, label, lapses, tip: TIPS[area], ...(id ? { id } : {}) });
  for (const [char, entry] of Object.entries(srs)) {
    const item = findItem(char);
    if (item && isLeech(entry)) add('kana', `${char} (${item.label})`, entry.l ?? 0);
  }
  for (const [key, entry] of Object.entries(vocab)) {
    const card = parseWordKey(key);
    if (card && isLeech(entry)) add('vocab', `${card.word.jp} · ${card.word.meaning}`, entry.l ?? 0, card.word.id);
  }
  for (const [key, entry] of Object.entries(conj)) {
    const card = parseVerbKey(key);
    if (card && isLeech(entry)) add('conj', `${card.verb.word.jp} · ${FORM_LABELS[card.form]}`, entry.l ?? 0);
  }
  for (const [particle, entry] of Object.entries(particles)) {
    if (isLeech(entry)) add('particle', particle, entry.l ?? 0);
  }
  return out.sort((a, b) => b.lapses - a.lapses);
}
