/**
 * Conjugação dos verbos japoneses por regra (nada aqui é digitado à mão por verbo):
 * a forma sai do tipo do verbo (grupo) e do final dele. Funciona na escrita com kanji
 * ("食べる" → "食べない") e na leitura em kana ("たべる" → "たべない") com a mesma função.
 */

/** Grupos de verbos: godan = grupo 1 (final em -u), ichidan = grupo 2 (る depois de i/e), suru e kuru = irregulares. */
export type VerbGroup = 'godan' | 'ichidan' | 'suru' | 'kuru';

/** masu = educada, nai = negativa, te = forma て, ta = passado (forma た). */
export type VerbForm = 'masu' | 'nai' | 'te' | 'ta';

export const VERB_FORMS: readonly VerbForm[] = ['masu', 'nai', 'te', 'ta'];

/**
 * Formas que entram depois das quatro primeiras: masendeshita = ませんでした (passado negativo), tai = たい (querer),
 * teiru = ている (em andamento), mashou = ましょう (vamos).
 */
export type ExtraForm = 'masendeshita' | 'tai' | 'teiru' | 'mashou';

export const EXTRA_FORMS: readonly ExtraForm[] = ['masendeshita', 'tai', 'teiru', 'mashou'];

/** Qualquer forma treinável. */
export type AnyForm = VerbForm | ExtraForm;

export const ALL_FORMS: readonly AnyForm[] = [...VERB_FORMS, ...EXTRA_FORMS];

export const isExtraForm = (form: AnyForm): form is ExtraForm => (EXTRA_FORMS as readonly string[]).includes(form);

export interface VerbSpec {
  /** Forma do dicionário, com kanji ou só em kana. */
  jp: string;
  group: VerbGroup;
  /** Verbos cuja conjugação foge da regra do grupo (ver `conjugate`). */
  irregular?: 'iku' | 'aru';
}

/** Linhas do kana usadas pelos verbos do grupo 1: final do dicionário → [a, i] da mesma linha. */
const GODAN_ROWS: Readonly<Record<string, readonly [string, string]>> = {
  う: ['わ', 'い'],
  く: ['か', 'き'],
  ぐ: ['が', 'ぎ'],
  す: ['さ', 'し'],
  つ: ['た', 'ち'],
  ぬ: ['な', 'に'],
  ぶ: ['ば', 'び'],
  む: ['ま', 'み'],
  る: ['ら', 'り'],
};

/** Final do verbo do grupo 1 → final das formas て e た (て, た). */
const GODAN_TE: Readonly<Record<string, readonly [string, string]>> = {
  う: ['って', 'った'],
  つ: ['って', 'った'],
  る: ['って', 'った'],
  む: ['んで', 'んだ'],
  ぶ: ['んで', 'んだ'],
  ぬ: ['んで', 'んだ'],
  く: ['いて', 'いた'],
  ぐ: ['いで', 'いだ'],
  す: ['して', 'した'],
};

const ENDING: Readonly<Record<VerbForm, string>> = { masu: 'ます', nai: 'ない', te: 'て', ta: 'た' };

/** Texto sem a última letra e a última letra. */
const splitLast = (text: string): [string, string] => {
  const chars = [...text];
  const last = chars.pop() ?? '';
  return [chars.join(''), last];
};

/**
 * Conjuga `text` (a forma do dicionário, em kanji ou em kana) na forma pedida.
 * Lança erro se o final não combina com o grupo: é um erro nos dados, não do aluno.
 */
export function conjugate(text: string, spec: Pick<VerbSpec, 'group' | 'irregular'>, form: AnyForm): string {
  // As formas extras saem das básicas: o radical do ます, ou a forma て.
  switch (form) {
    case 'masendeshita':
      return conjugate(text, spec, 'masu').slice(0, -2) + 'ませんでした';
    case 'tai':
      return conjugate(text, spec, 'masu').slice(0, -2) + 'たい';
    case 'mashou':
      return conjugate(text, spec, 'masu').slice(0, -2) + 'ましょう';
    case 'teiru':
      return conjugate(text, spec, 'te') + 'いる';
  }
  const { group, irregular } = spec;

  if (group === 'suru') {
    if (!text.endsWith('する')) throw new Error(`"${text}" não termina em する`);
    const base = text.slice(0, -2);
    return base + { masu: 'します', nai: 'しない', te: 'して', ta: 'した' }[form];
  }

  if (group === 'kuru') {
    // "来る" fica com o kanji; "くる" muda de som (き nas formas ます, て e た; こ na negativa).
    if (text.endsWith('来る')) return text.slice(0, -2) + '来' + ENDING[form];
    if (!text.endsWith('くる')) throw new Error(`"${text}" não termina em 来る/くる`);
    const base = text.slice(0, -2);
    return base + (form === 'nai' ? 'こ' : 'き') + ENDING[form];
  }

  const [stem, last] = splitLast(text);

  if (group === 'ichidan') {
    if (last !== 'る') throw new Error(`"${text}" não termina em る`);
    return stem + ENDING[form];
  }

  const row = GODAN_ROWS[last];
  const te = GODAN_TE[last];
  if (!row || !te) throw new Error(`"${text}" não termina como um verbo do grupo 1`);

  switch (form) {
    case 'masu':
      return stem + row[1] + ENDING.masu;
    case 'nai':
      // ある não tem negativa regular: usa "ない".
      return irregular === 'aru' ? 'ない' : stem + row[0] + ENDING.nai;
    case 'te':
      // 行く foge da regra do く: 行って, não 行いて.
      return irregular === 'iku' ? stem + 'って' : stem + te[0];
    case 'ta':
      return irregular === 'iku' ? stem + 'った' : stem + te[1];
  }
}
