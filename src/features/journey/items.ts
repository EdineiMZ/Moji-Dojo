/**
 * Catálogo dos itens do Mochi. Cada item ocupa um espaço (slot): só um por espaço fica equipado.
 * Os itens vêm de cinco fontes: loja (pétalas), conquista, recompensa semanal, temporada (loja, só em certas datas) e baú
 * (sorteio dos baús diário e semanal: itens que não se compram).
 */

export type Slot = 'head' | 'face' | 'neck' | 'back' | 'tint' | 'skin';

export const SLOTS: readonly Slot[] = ['head', 'face', 'neck', 'back', 'tint', 'skin'];

export const SLOT_LABELS: Readonly<Record<Slot, string>> = {
  head: 'Cabeça',
  face: 'Rosto',
  neck: 'Pescoço',
  back: 'Fundo',
  tint: 'Cor',
  skin: 'Pele',
};

/** Quão difícil é ter o item: comum, raro, épico ou lendário. Aparece na loja, no armário e no baú. */
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export const RARITIES: readonly Rarity[] = ['common', 'rare', 'epic', 'legendary'];

export const RARITY_LABELS: Readonly<Record<Rarity, string>> = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Lendário',
};

export type ItemSource =
  | { kind: 'shop'; price: number }
  | { kind: 'achievement'; achievement: string }
  | { kind: 'weekly' }
  /** Na loja só dentro da janela de datas (mês e dia, inclusive). */
  | { kind: 'season'; price: number; from: readonly [number, number]; to: readonly [number, number] }
  /** Só sai nos baús (diário e semanal), por sorteio. */
  | { kind: 'loot' };

export interface Item {
  id: string;
  name: string;
  slot: Slot;
  rarity: Rarity;
  source: ItemSource;
  /** Uma linha sobre o item. */
  description: string;
}

/** Os preços da loja, em pétalas. Os de antes da 1.14 eram 2,5 vezes menores: ganhar pétalas estava fácil demais. */
const shopRarity = (price: number): Rarity => (price >= 800 ? 'epic' : price >= 400 ? 'rare' : 'common');

const shop = (id: string, name: string, slot: Slot, price: number, description: string): Item => ({
  id,
  name,
  slot,
  rarity: shopRarity(price),
  source: { kind: 'shop', price },
  description,
});

const reward = (id: string, name: string, slot: Slot, achievement: string, description: string, rarity: Rarity = 'rare'): Item => ({
  id,
  name,
  slot,
  rarity,
  source: { kind: 'achievement', achievement },
  description,
});

const drop = (id: string, name: string, slot: Slot, rarity: Rarity, description: string): Item => ({
  id,
  name,
  slot,
  rarity,
  source: { kind: 'loot' },
  description,
});

const season = (
  id: string,
  name: string,
  slot: Slot,
  from: readonly [number, number],
  to: readonly [number, number],
  description: string,
): Item => ({ id, name, slot, rarity: 'rare', source: { kind: 'season', price: 380, from, to }, description });

export const ITEMS: readonly Item[] = [
  // ---- Loja: cabeça
  shop('chapeu-palha', 'Chapéu de palha', 'head', 200, 'Para um passeio de verão.'),
  shop('boina', 'Boina', 'head', 250, 'Um ar de artista.'),
  shop('gorro-la', 'Gorro de lã', 'head', 250, 'Quentinho para o inverno.'),
  shop('fita-cabelo', 'Fita de cabelo', 'head', 150, 'Um lacinho simples.'),
  shop('chapeu-chef', 'Chapéu de chef', 'head', 380, 'Para quem estuda com fome.'),
  shop('hachimaki-ninja', 'Faixa ninja', 'head', 300, 'Treino silencioso.'),
  shop('coroa-flores', 'Coroa de flores', 'head', 500, 'Feita de flores do jardim.'),
  shop('chapeu-bruxo', 'Chapéu de bruxo', 'head', 450, 'Mochi, o mago.'),
  shop('chapeu-festa', 'Chapéu de festa', 'head', 250, 'Hoje tem comemoração.'),
  shop('orelhas-coelho', 'Orelhas de coelho', 'head', 350, 'Pula, pula!'),
  shop('chapeu-cowboy', 'Chapéu de cowboy', 'head', 450, 'Yee-haw, mas em japonês.'),
  shop('chapeu-pirata', 'Chapéu de pirata', 'head', 550, 'À procura do tesouro de kanji.'),
  shop('kabuto', 'Capacete de samurai', 'head', 750, 'Um kabuto de respeito.'),
  shop('capacete-astronauta', 'Capacete de astronauta', 'head', 850, 'Estudando em órbita.'),
  shop('tiara', 'Tiara', 'head', 900, 'Brilha mais que a revisão do dia.'),
  // ---- Loja: rosto
  shop('oculos-redondos', 'Óculos redondos', 'face', 200, 'Para ler melhor.'),
  shop('oculos-escuros', 'Óculos escuros', 'face', 300, 'Muito estilo.'),
  shop('mascara-raposa', 'Máscara de raposa', 'face', 630, 'Uma kitsune de festival.'),
  shop('bigode', 'Bigode', 'face', 150, 'Respeitável.'),
  shop('oculos-coracao', 'Óculos de coração', 'face', 350, 'Amor pelo japonês.'),
  shop('oculos-3d', 'Óculos 3D', 'face', 350, 'Direto do cinema.'),
  shop('monoculo', 'Monóculo', 'face', 450, 'Um toque de cavalheiro.'),
  shop('mascara-heroi', 'Máscara de herói', 'face', 550, 'Identidade secreta: aluno de japonês.'),
  // ---- Loja: pescoço
  shop('cachecol-vermelho', 'Cachecol vermelho', 'neck', 250, 'Aquece e combina.'),
  shop('gravata-borboleta', 'Gravata borboleta', 'neck', 200, 'Elegância de gato.'),
  shop('lenco', 'Lenço', 'neck', 200, 'Um lenço azul no pescoço.'),
  shop('sininho', 'Sininho', 'neck', 150, 'Tilim, tilim.'),
  shop('cachecol-listrado', 'Cachecol listrado', 'neck', 350, 'Listras alegres.'),
  shop('gravata-longa', 'Gravata', 'neck', 350, 'Para a reunião de negócios em japonês.'),
  shop('colar-perola', 'Colar de pérolas', 'neck', 650, 'Das pérolas de Mikimoto.'),
  shop('colar-havaiano', 'Colar de flores', 'neck', 500, 'Um verão eterno.'),
  // ---- Loja: fundos
  shop('fundo-cerejeira', 'Jardim de cerejeira', 'back', 500, 'Pétalas caindo.'),
  shop('fundo-quarto', 'Quarto aconchegante', 'back', 500, 'Um cantinho de estudo.'),
  shop('fundo-noite', 'Noite estrelada', 'back', 630, 'Lua e estrelas.'),
  shop('fundo-festival', 'Festival', 'back', 750, 'Lanternas de matsuri.'),
  shop('fundo-praia', 'Praia', 'back', 600, 'Sol, mar e kanji.'),
  shop('fundo-biblioteca', 'Biblioteca', 'back', 600, 'Estantes até o teto.'),
  shop('fundo-onsen', 'Onsen', 'back', 700, 'Águas termais e vapor.'),
  shop('fundo-ramen', 'Casa de lámen', 'back', 700, 'Cheirinho de caldo.'),
  shop('fundo-metro', 'Estação de trem', 'back', 650, 'Próximo trem: Shinjuku.'),
  shop('fundo-neve', 'Dia de neve', 'back', 650, 'Silêncio e flocos.'),
  // ---- Loja: cores do Mochi
  shop('cor-sakura', 'Mochi sakura', 'tint', 300, 'Um tom rosado.'),
  shop('cor-matcha', 'Mochi matcha', 'tint', 300, 'Um tom verde-chá.'),
  shop('cor-ceu', 'Mochi céu', 'tint', 300, 'Um tom azulado.'),
  shop('cor-lavanda', 'Mochi lavanda', 'tint', 300, 'Um tom lilás.'),
  shop('cor-laranja', 'Mochi laranja', 'tint', 350, 'Cor de caqui maduro.'),
  shop('cor-pink', 'Mochi pink', 'tint', 350, 'Rosa bem vivo.'),
  shop('cor-cinza', 'Mochi cinza', 'tint', 350, 'Um gato de pelo prata.'),
  shop('cor-carvao', 'Mochi carvão', 'tint', 500, 'Escuro como a noite de Tóquio.'),
  // ---- Loja: peles (o jeito do corpo do Mochi)
  shop('pele-listras', 'Mochi listrado', 'skin', 700, 'Listras de gato tigrado.'),
  shop('pele-manchas', 'Mochi manchado', 'skin', 700, 'Manchas de gato tricolor.'),
  shop('pele-estrelas', 'Mochi estrelado', 'skin', 800, 'Pintinhas de estrela.'),
  shop('pele-coracoes', 'Mochi de corações', 'skin', 800, 'Cheio de carinho.'),
  shop('pele-onda', 'Mochi de ondas', 'skin', 900, 'Uma grande onda, estilo ukiyo-e.'),
  // ---- Temporada (loja, só em datas)
  season('chapeu-natal', 'Gorro de fim de ano', 'head', [12, 1], [1, 6], 'Dezembro e começo de janeiro.'),
  season('mascara-oni', 'Máscara de oni', 'face', [1, 25], [2, 5], 'Setsubun: fora o azar!'),
  season('flor-sakura', 'Flor de sakura', 'head', [3, 10], [4, 20], 'Época de hanami.'),
  season('fita-tanabata', 'Fita de Tanabata', 'neck', [6, 25], [7, 15], 'Para pendurar um desejo.'),
  season('chapeu-abobora', 'Chapéu de abóbora', 'head', [10, 10], [11, 2], 'Doce ou travessura.'),
  // ---- Só por conquista
  reward('hachimaki-ganbare', 'Faixa Ganbare', 'head', 'streak-7', 'Sete dias seguidos: ganbare!'),
  reward('coroa-dourada', 'Coroa dourada', 'head', 'streak-30', 'Trinta dias seguidos.', 'epic'),
  reward('capa-heroi', 'Capa de herói', 'neck', 'streak-100', 'Cem dias seguidos.', 'epic'),
  reward('oculos-sabio', 'Óculos de sábio', 'face', 'words-100', 'Cem palavras aprendidas.'),
  reward('chapeu-formatura', 'Chapéu de formatura', 'head', 'topics-10', 'Dez tópicos de gramática dominados.'),
  reward('lanterna', 'Lanterna', 'neck', 'perfect-run-10', 'Dez lições perfeitas seguidas.'),
  reward('medalha-sol', 'Medalha do sol nascente', 'neck', 'hira-all', 'Todo o hiragana.'),
  reward('gorro-carpa', 'Gorro de carpa', 'head', 'kata-all', 'Todo o katakana.'),
  reward('faixa-preta', 'Faixa preta', 'neck', 'correct-1000', 'Mil respostas certas.', 'epic'),
  reward('fones-ouvido', 'Fones de ouvido', 'head', 'dictations-10', 'Dez ditados feitos.'),
  reward('microfone', 'Microfone', 'face', 'recordings-1', 'Sua primeira gravação.'),
  reward('pincel-caligrafia', 'Pincel de caligrafia', 'face', 'phrases-20', 'Vinte frases suas escritas.'),
  reward('fundo-torii', 'Portão torii', 'back', 'dialog-perfect', 'Uma cena de diálogo sem erro.'),
  reward('fundo-fuji', 'Monte Fuji', 'back', 'weeks-5', 'Cinco semanas de meta cumprida.', 'epic'),
  reward('cor-ouro', 'Mochi dourado', 'tint', 'weeks-10', 'Dez semanas de meta cumprida.', 'legendary'),
  reward('bandana-vermelha', 'Bandana vermelha', 'head', 'streak-14', 'Duas semanas seguidas.'),
  reward('coroa-imperial', 'Coroa imperial', 'head', 'streak-365', 'Um ano inteiro de estudo.', 'legendary'),
  reward('oculos-leitor', 'Óculos de leitor', 'face', 'words-300', 'Trezentas palavras aprendidas.'),
  reward('chapeu-viajante', 'Chapéu de viajante', 'head', 'words-600', 'Vocabulário de viagem: 600 palavras.', 'epic'),
  reward('capa-mestre', 'Capa do mestre', 'neck', 'topics-25', 'Vinte e cinco tópicos de gramática.', 'epic'),
  reward('faixa-azul', 'Faixa azul', 'neck', 'lessons-50', 'Cinquenta lições concluídas.'),
  reward('brilho-estrela', 'Brilho de estrela', 'face', 'perfect-run-5', 'Cinco lições perfeitas seguidas.'),
  reward('aureola-prata', 'Auréola de prata', 'head', 'correct-5000', 'Cinco mil respostas certas.', 'epic'),
  reward('megafone', 'Megafone', 'neck', 'speak-10', 'Dez frases ditas em voz alta.'),
  reward('fundo-dojo', 'Dojo', 'back', 'level-5', 'Nível 5.'),
  reward('pele-sensei', 'Mochi sensei', 'skin', 'level-10', 'Nível 10.', 'epic'),
  reward('cor-prisma', 'Mochi prisma', 'tint', 'items-25', 'Vinte e cinco itens no armário.', 'legendary'),
  reward('fundo-amanhecer', 'Amanhecer', 'back', 'early-bird', 'Estudou de madrugada.'),
  reward('pele-coruja', 'Mochi coruja', 'skin', 'night-owl', 'Estudou de madrugada, bem tarde.'),
  // ---- Recompensa semanal
  { id: 'laco-semana', name: 'Laço da semana', slot: 'head', rarity: 'rare', source: { kind: 'weekly' }, description: 'Da primeira meta semanal.' },
  // ---- Só nos baús (sorteio): raros
  drop('fita-sakura', 'Fita de sakura', 'head', 'rare', 'Das pétalas do baú.'),
  drop('oculos-estrela', 'Óculos de estrela', 'face', 'rare', 'Cada lente, uma estrela.'),
  drop('lenco-seda', 'Lenço de seda', 'neck', 'rare', 'Macio como um mochi.'),
  drop('fundo-pagode', 'Pagode', 'back', 'rare', 'Um templo entre as nuvens.'),
  drop('cor-menta', 'Mochi menta', 'tint', 'rare', 'Fresquinho.'),
  drop('pele-panda', 'Mochi panda', 'skin', 'rare', 'Manchas de panda.'),
  drop('pele-robo', 'Mochi robô', 'skin', 'rare', 'Beep, boop, ひらがな.'),
  // ---- Só nos baús: épicos
  drop('halo-dourado', 'Halo dourado', 'head', 'epic', 'Um anjinho de estudos.'),
  drop('chifres-oni', 'Chifres de oni', 'head', 'epic', 'Um oni bonzinho.'),
  drop('oculos-cyber', 'Visor cyber', 'face', 'epic', 'Do futuro de Akihabara.'),
  drop('asas-anjo', 'Asas de anjo', 'neck', 'epic', 'Para voar alto.'),
  drop('fundo-aurora', 'Aurora', 'back', 'epic', 'Luzes verdes e rosas no céu.'),
  drop('fundo-sakura-noite', 'Sakura à noite', 'back', 'epic', 'Pétalas sob a lua.'),
  drop('cor-cristal', 'Mochi cristal', 'tint', 'epic', 'Quase transparente.'),
  drop('pele-dragao', 'Mochi dragão', 'skin', 'epic', 'Escamas verdes e chifrinhos.'),
  drop('pele-fantasma', 'Mochi fantasma', 'skin', 'epic', 'Uu-uuuh!'),
  // ---- Só nos baús: lendários
  drop('coroa-arco-iris', 'Coroa arco-íris', 'head', 'legendary', 'Todas as cores do dojo.'),
  drop('mascara-kitsune-ouro', 'Kitsune dourada', 'face', 'legendary', 'A raposa lendária.'),
  drop('capa-estrelada', 'Capa estrelada', 'neck', 'legendary', 'Feita do céu da noite.'),
  drop('fundo-galaxia', 'Galáxia', 'back', 'legendary', 'Um redemoinho de estrelas.'),
  drop('cor-galaxia', 'Mochi galáxia', 'tint', 'legendary', 'Um tom de noite profunda.'),
  drop('pele-galaxia', 'Mochi cósmico', 'skin', 'legendary', 'O universo na barriguinha.'),
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

/** Os itens que só saem nos baús, de uma raridade. */
export const lootItems = (rarity?: Rarity): Item[] => ITEMS.filter((i) => i.source.kind === 'loot' && (rarity === undefined || i.rarity === rarity));

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
    case 'loot':
      return `Sai nos baús do dia e da semana (${RARITY_LABELS[item.rarity].toLowerCase()})`;
  }
}

const pad = ([month, day]: readonly [number, number]): string => `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
