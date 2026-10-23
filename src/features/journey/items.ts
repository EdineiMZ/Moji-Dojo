/**
 * Catálogo dos itens do Mochi. Cada item ocupa um espaço (slot): só um por espaço fica equipado.
 * Os itens vêm de quatro fontes: loja (pétalas), conquista, recompensa semanal e temporada (loja, só em certas datas).
 */

export type Slot = 'head' | 'face' | 'neck' | 'back' | 'tint';

export const SLOTS: readonly Slot[] = ['head', 'face', 'neck', 'back', 'tint'];

export const SLOT_LABELS: Readonly<Record<Slot, string>> = {
  head: 'Cabeça',
  face: 'Rosto',
  neck: 'Pescoço',
  back: 'Fundo',
  tint: 'Cor',
};

export type ItemSource =
  | { kind: 'shop'; price: number }
  | { kind: 'achievement'; achievement: string }
  | { kind: 'weekly' }
  /** Na loja só dentro da janela de datas (mês e dia, inclusive). */
  | { kind: 'season'; price: number; from: readonly [number, number]; to: readonly [number, number] };

export interface Item {
  id: string;
  name: string;
  slot: Slot;
  source: ItemSource;
  /** Uma linha sobre o item. */
  description: string;
}

const shop = (id: string, name: string, slot: Slot, price: number, description: string): Item => ({
  id,
  name,
  slot,
  source: { kind: 'shop', price },
  description,
});

const reward = (id: string, name: string, slot: Slot, achievement: string, description: string): Item => ({
  id,
  name,
  slot,
  source: { kind: 'achievement', achievement },
  description,
});

const season = (
  id: string,
  name: string,
  slot: Slot,
  from: readonly [number, number],
  to: readonly [number, number],
  description: string,
): Item => ({ id, name, slot, source: { kind: 'season', price: 150, from, to }, description });

export const ITEMS: readonly Item[] = [
  // Loja: cabeça
  shop('chapeu-palha', 'Chapéu de palha', 'head', 80, 'Para um passeio de verão.'),
  shop('boina', 'Boina', 'head', 100, 'Um ar de artista.'),
  shop('gorro-la', 'Gorro de lã', 'head', 100, 'Quentinho para o inverno.'),
  shop('fita-cabelo', 'Fita de cabelo', 'head', 60, 'Um lacinho simples.'),
  shop('chapeu-chef', 'Chapéu de chef', 'head', 150, 'Para quem estuda com fome.'),
  shop('hachimaki-ninja', 'Faixa ninja', 'head', 120, 'Treino silencioso.'),
  shop('coroa-flores', 'Coroa de flores', 'head', 200, 'Feita de flores do jardim.'),
  shop('chapeu-bruxo', 'Chapéu de bruxo', 'head', 180, 'Mochi, o mago.'),
  // Loja: rosto
  shop('oculos-redondos', 'Óculos redondos', 'face', 80, 'Para ler melhor.'),
  shop('oculos-escuros', 'Óculos escuros', 'face', 120, 'Muito estilo.'),
  shop('mascara-raposa', 'Máscara de raposa', 'face', 250, 'Uma kitsune de festival.'),
  shop('bigode', 'Bigode', 'face', 60, 'Respeitável.'),
  // Loja: pescoço
  shop('cachecol-vermelho', 'Cachecol vermelho', 'neck', 100, 'Aquece e combina.'),
  shop('gravata-borboleta', 'Gravata borboleta', 'neck', 80, 'Elegância de gato.'),
  shop('lenco', 'Lenço', 'neck', 80, 'Um lenço azul no pescoço.'),
  shop('sininho', 'Sininho', 'neck', 60, 'Tilim, tilim.'),
  // Loja: fundos
  shop('fundo-cerejeira', 'Jardim de cerejeira', 'back', 200, 'Pétalas caindo.'),
  shop('fundo-quarto', 'Quarto aconchegante', 'back', 200, 'Um cantinho de estudo.'),
  shop('fundo-noite', 'Noite estrelada', 'back', 250, 'Lua e estrelas.'),
  shop('fundo-festival', 'Festival', 'back', 300, 'Lanternas de matsuri.'),
  // Loja: cores do Mochi
  shop('cor-sakura', 'Mochi sakura', 'tint', 120, 'Um tom rosado.'),
  shop('cor-matcha', 'Mochi matcha', 'tint', 120, 'Um tom verde-chá.'),
  shop('cor-ceu', 'Mochi céu', 'tint', 120, 'Um tom azulado.'),
  shop('cor-lavanda', 'Mochi lavanda', 'tint', 120, 'Um tom lilás.'),
  // Temporada (loja, só em datas)
  season('chapeu-natal', 'Gorro de fim de ano', 'head', [12, 1], [1, 6], 'Dezembro e começo de janeiro.'),
  season('mascara-oni', 'Máscara de oni', 'face', [1, 25], [2, 5], 'Setsubun: fora o azar!'),
  season('flor-sakura', 'Flor de sakura', 'head', [3, 10], [4, 20], 'Época de hanami.'),
  season('fita-tanabata', 'Fita de Tanabata', 'neck', [6, 25], [7, 15], 'Para pendurar um desejo.'),
  season('chapeu-abobora', 'Chapéu de abóbora', 'head', [10, 10], [11, 2], 'Doce ou travessura.'),
  // Só por conquista
  reward('hachimaki-ganbare', 'Faixa Ganbare', 'head', 'streak-7', 'Sete dias seguidos: ganbare!'),
  reward('coroa-dourada', 'Coroa dourada', 'head', 'streak-30', 'Trinta dias seguidos.'),
  reward('capa-heroi', 'Capa de herói', 'neck', 'streak-100', 'Cem dias seguidos.'),
  reward('oculos-sabio', 'Óculos de sábio', 'face', 'words-100', 'Cem palavras aprendidas.'),
  reward('chapeu-formatura', 'Chapéu de formatura', 'head', 'topics-10', 'Dez tópicos de gramática dominados.'),
  reward('lanterna', 'Lanterna', 'neck', 'perfect-run-10', 'Dez lições perfeitas seguidas.'),
  reward('medalha-sol', 'Medalha do sol nascente', 'neck', 'hira-all', 'Todo o hiragana.'),
  reward('gorro-carpa', 'Gorro de carpa', 'head', 'kata-all', 'Todo o katakana.'),
  reward('faixa-preta', 'Faixa preta', 'neck', 'correct-1000', 'Mil respostas certas.'),
  reward('fones-ouvido', 'Fones de ouvido', 'head', 'dictations-10', 'Dez ditados feitos.'),
  reward('microfone', 'Microfone', 'face', 'recordings-1', 'Sua primeira gravação.'),
  reward('pincel-caligrafia', 'Pincel de caligrafia', 'face', 'phrases-20', 'Vinte frases suas escritas.'),
  reward('fundo-torii', 'Portão torii', 'back', 'dialog-perfect', 'Uma cena de diálogo sem erro.'),
  reward('fundo-fuji', 'Monte Fuji', 'back', 'weeks-5', 'Cinco semanas de meta cumprida.'),
  reward('cor-ouro', 'Mochi dourado', 'tint', 'weeks-10', 'Dez semanas de meta cumprida.'),
  // Recompensa semanal
  { id: 'laco-semana', name: 'Laço da semana', slot: 'head', source: { kind: 'weekly' }, description: 'Da primeira meta semanal.' },
];

const BY_ID: ReadonlyMap<string, Item> = new Map(ITEMS.map((item) => [item.id, item]));

export const findItem = (id: string): Item | undefined => BY_ID.get(id);

export const itemsInSlot = (slot: Slot): Item[] => ITEMS.filter((item) => item.slot === slot);

const dayOfYear = (month: number, day: number): number => month * 100 + day;

/** A data (mês 1 a 12, dia) está dentro da janela, inclusive quando ela atravessa o fim do ano? */
export function inSeason(from: readonly [number, number], to: readonly [number, number], month: number, day: number): boolean {
  const now = dayOfYear(month, day);
  const start = dayOfYear(from[0], from[1]);
  const end = dayOfYear(to[0], to[1]);
  return start <= end ? now >= start && now <= end : now >= start || now <= end;
}

/** O item pode ser comprado agora? (Só os de loja e os de temporada dentro das datas.) */
export function buyable(item: Item, date: Date): boolean {
  if (item.source.kind === 'shop') return true;
  if (item.source.kind === 'season') return inSeason(item.source.from, item.source.to, date.getMonth() + 1, date.getDate());
  return false;
}

/** Preço em pétalas, ou null se o item não se compra. */
export const priceOf = (item: Item): number | null => (item.source.kind === 'shop' || item.source.kind === 'season' ? item.source.price : null);

/** O que mostrar para quem ainda não tem o item: como conseguir. */
export function howToGet(item: Item): string {
  switch (item.source.kind) {
    case 'shop':
      return `${item.source.price} pétalas na loja`;
    case 'season':
      return `${item.source.price} pétalas na loja, só em época (${pad(item.source.from)} a ${pad(item.source.to)})`;
    case 'achievement':
      return `Conquista: ${item.description}`;
    case 'weekly':
      return 'Recompensa da meta semanal';
  }
}

const pad = ([month, day]: readonly [number, number]): string => `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
