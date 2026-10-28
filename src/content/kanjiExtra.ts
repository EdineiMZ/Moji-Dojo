// Gerado por `npm run build-kanji` (scripts/kanji). Não edite à mão.
// Leituras: KANJIDIC2 (EDRDG, CC BY-SA 4.0). Significados em português e categorias: escritos para este app (a revisar).
// Traços: ver src/data/strokes (KanjiVG, CC BY-SA 3.0). Ver src/content/LICENSE.md.
import type { Kanji, KanjiCategory, Lesson } from '@/data/types';

/** O último kanji do N5 e os do N4 que não estavam nos 102 iniciais. */
export const KANJI_EXTRA: readonly Kanji[] = [
  {
    "char": "兄",
    "meaning": "irmão mais velho",
    "on": [
      "ケイ",
      "キョウ"
    ],
    "kun": [
      "あに"
    ],
    "category": "n4fam"
  },
  {
    "char": "姉",
    "meaning": "irmã mais velha",
    "on": [
      "シ"
    ],
    "kun": [
      "あね",
      "はは"
    ],
    "category": "n4fam"
  },
  {
    "char": "弟",
    "meaning": "irmão mais novo",
    "on": [
      "テイ",
      "ダイ",
      "デ"
    ],
    "kun": [
      "おとうと"
    ],
    "category": "n4fam"
  },
  {
    "char": "妹",
    "meaning": "irmã mais nova",
    "on": [
      "マイ"
    ],
    "kun": [
      "いもうと"
    ],
    "category": "n4fam"
  },
  {
    "char": "親",
    "meaning": "pais, íntimo",
    "on": [
      "シン"
    ],
    "kun": [
      "おや",
      "した(しい)",
      "した(しむ)"
    ],
    "category": "n4fam"
  },
  {
    "char": "族",
    "meaning": "família, tribo",
    "on": [
      "ゾク"
    ],
    "kun": [],
    "category": "n4fam"
  },
  {
    "char": "者",
    "meaning": "pessoa",
    "on": [
      "シャ"
    ],
    "kun": [
      "もの"
    ],
    "category": "n4fam"
  },
  {
    "char": "医",
    "meaning": "médico, medicina",
    "on": [
      "イ"
    ],
    "kun": [
      "い(やす)",
      "い(する)",
      "くすし"
    ],
    "category": "n4fam"
  },
  {
    "char": "員",
    "meaning": "membro, funcionário",
    "on": [
      "イン"
    ],
    "kun": [],
    "category": "n4fam"
  },
  {
    "char": "民",
    "meaning": "povo",
    "on": [
      "ミン"
    ],
    "kun": [
      "たみ"
    ],
    "category": "n4fam"
  },
  {
    "char": "私",
    "meaning": "eu, particular",
    "on": [
      "シ"
    ],
    "kun": [
      "わたくし",
      "わたし"
    ],
    "category": "n4fam"
  },
  {
    "char": "主",
    "meaning": "senhor, principal",
    "on": [
      "シュ",
      "ス",
      "シュウ"
    ],
    "kun": [
      "ぬし",
      "おも",
      "あるじ"
    ],
    "category": "n4fam"
  },
  {
    "char": "家",
    "meaning": "casa, família",
    "on": [
      "カ",
      "ケ"
    ],
    "kun": [
      "いえ",
      "や",
      "うち"
    ],
    "category": "n4lug"
  },
  {
    "char": "屋",
    "meaning": "loja, casa",
    "on": [
      "オク"
    ],
    "kun": [
      "や"
    ],
    "category": "n4lug"
  },
  {
    "char": "室",
    "meaning": "sala",
    "on": [
      "シツ"
    ],
    "kun": [
      "むろ"
    ],
    "category": "n4lug"
  },
  {
    "char": "館",
    "meaning": "edifício",
    "on": [
      "カン"
    ],
    "kun": [
      "やかた",
      "たて"
    ],
    "category": "n4lug"
  },
  {
    "char": "院",
    "meaning": "instituição",
    "on": [
      "イン"
    ],
    "kun": [],
    "category": "n4lug"
  },
  {
    "char": "堂",
    "meaning": "salão",
    "on": [
      "ドウ"
    ],
    "kun": [],
    "category": "n4lug"
  },
  {
    "char": "町",
    "meaning": "cidade pequena, bairro",
    "on": [
      "チョウ"
    ],
    "kun": [
      "まち"
    ],
    "category": "n4lug"
  },
  {
    "char": "村",
    "meaning": "vila",
    "on": [
      "ソン"
    ],
    "kun": [
      "むら"
    ],
    "category": "n4lug"
  },
  {
    "char": "市",
    "meaning": "cidade, mercado",
    "on": [
      "シ"
    ],
    "kun": [
      "いち"
    ],
    "category": "n4lug"
  },
  {
    "char": "区",
    "meaning": "bairro, distrito",
    "on": [
      "ク",
      "オウ",
      "コウ"
    ],
    "kun": [],
    "category": "n4lug"
  },
  {
    "char": "県",
    "meaning": "província",
    "on": [
      "ケン"
    ],
    "kun": [
      "か(ける)"
    ],
    "category": "n4lug"
  },
  {
    "char": "京",
    "meaning": "capital",
    "on": [
      "キョウ",
      "ケイ",
      "キン"
    ],
    "kun": [
      "みやこ"
    ],
    "category": "n4lug"
  },
  {
    "char": "都",
    "meaning": "capital",
    "on": [
      "ト",
      "ツ"
    ],
    "kun": [
      "みやこ"
    ],
    "category": "n4lug"
  },
  {
    "char": "場",
    "meaning": "local",
    "on": [
      "ジョウ",
      "チョウ"
    ],
    "kun": [
      "ば"
    ],
    "category": "n4lug"
  },
  {
    "char": "所",
    "meaning": "lugar",
    "on": [
      "ショ"
    ],
    "kun": [
      "ところ",
      "どころ",
      "とこ"
    ],
    "category": "n4lug"
  },
  {
    "char": "池",
    "meaning": "lago",
    "on": [
      "チ"
    ],
    "kun": [
      "いけ"
    ],
    "category": "n4lug"
  },
  {
    "char": "森",
    "meaning": "floresta",
    "on": [
      "シン"
    ],
    "kun": [
      "もり"
    ],
    "category": "n4lug"
  },
  {
    "char": "林",
    "meaning": "bosque",
    "on": [
      "リン"
    ],
    "kun": [
      "はやし"
    ],
    "category": "n4lug"
  },
  {
    "char": "田",
    "meaning": "arrozal",
    "on": [
      "デン"
    ],
    "kun": [
      "た"
    ],
    "category": "n4lug"
  },
  {
    "char": "野",
    "meaning": "campo",
    "on": [
      "ヤ",
      "ショ"
    ],
    "kun": [
      "の"
    ],
    "category": "n4lug"
  },
  {
    "char": "海",
    "meaning": "mar",
    "on": [
      "カイ"
    ],
    "kun": [
      "うみ"
    ],
    "category": "n4lug"
  },
  {
    "char": "地",
    "meaning": "terra, solo",
    "on": [
      "チ",
      "ジ"
    ],
    "kun": [],
    "category": "n4lug"
  },
  {
    "char": "界",
    "meaning": "mundo, limite",
    "on": [
      "カイ"
    ],
    "kun": [],
    "category": "n4lug"
  },
  {
    "char": "門",
    "meaning": "portão",
    "on": [
      "モン"
    ],
    "kun": [
      "かど",
      "と"
    ],
    "category": "n4lug"
  },
  {
    "char": "銀",
    "meaning": "prata",
    "on": [
      "ギン"
    ],
    "kun": [
      "しろがね"
    ],
    "category": "n4lug"
  },
  {
    "char": "春",
    "meaning": "primavera",
    "on": [
      "シュン"
    ],
    "kun": [
      "はる"
    ],
    "category": "n4tem"
  },
  {
    "char": "夏",
    "meaning": "verão",
    "on": [
      "カ",
      "ガ",
      "ゲ"
    ],
    "kun": [
      "なつ"
    ],
    "category": "n4tem"
  },
  {
    "char": "秋",
    "meaning": "outono",
    "on": [
      "シュウ"
    ],
    "kun": [
      "あき",
      "とき"
    ],
    "category": "n4tem"
  },
  {
    "char": "冬",
    "meaning": "inverno",
    "on": [
      "トウ"
    ],
    "kun": [
      "ふゆ"
    ],
    "category": "n4tem"
  },
  {
    "char": "朝",
    "meaning": "manhã",
    "on": [
      "チョウ"
    ],
    "kun": [
      "あさ"
    ],
    "category": "n4tem"
  },
  {
    "char": "昼",
    "meaning": "meio-dia, dia",
    "on": [
      "チュウ"
    ],
    "kun": [
      "ひる"
    ],
    "category": "n4tem"
  },
  {
    "char": "夜",
    "meaning": "noite",
    "on": [
      "ヤ"
    ],
    "kun": [
      "よ",
      "よる"
    ],
    "category": "n4tem"
  },
  {
    "char": "夕",
    "meaning": "entardecer",
    "on": [
      "セキ"
    ],
    "kun": [
      "ゆう"
    ],
    "category": "n4tem"
  },
  {
    "char": "曜",
    "meaning": "dia da semana",
    "on": [
      "ヨウ"
    ],
    "kun": [],
    "category": "n4tem"
  },
  {
    "char": "代",
    "meaning": "substituir, era",
    "on": [
      "ダイ",
      "タイ"
    ],
    "kun": [
      "か(わる)",
      "かわ(る)",
      "かわ(り)"
    ],
    "category": "n4tem"
  },
  {
    "char": "度",
    "meaning": "vez, grau",
    "on": [
      "ド",
      "ト",
      "タク"
    ],
    "kun": [
      "たび",
      "た(い)"
    ],
    "category": "n4tem"
  },
  {
    "char": "回",
    "meaning": "vez, girar",
    "on": [
      "カイ",
      "エ"
    ],
    "kun": [
      "まわ(る)",
      "まわ(り)",
      "まわ(す)"
    ],
    "category": "n4tem"
  },
  {
    "char": "世",
    "meaning": "mundo, geração",
    "on": [
      "セイ",
      "セ",
      "ソウ"
    ],
    "kun": [
      "よ"
    ],
    "category": "n4tem"
  },
  {
    "char": "去",
    "meaning": "passado, ir embora",
    "on": [
      "キョ",
      "コ"
    ],
    "kun": [
      "さ(る)"
    ],
    "category": "n4tem"
  },
  {
    "char": "以",
    "meaning": "a partir de, com",
    "on": [
      "イ"
    ],
    "kun": [
      "もっ(て)"
    ],
    "category": "n4tem"
  },
  {
    "char": "光",
    "meaning": "luz",
    "on": [
      "コウ"
    ],
    "kun": [
      "ひか(る)",
      "ひかり"
    ],
    "category": "n4nat"
  },
  {
    "char": "風",
    "meaning": "vento",
    "on": [
      "フウ",
      "フ"
    ],
    "kun": [
      "かぜ",
      "かざ"
    ],
    "category": "n4nat"
  },
  {
    "char": "暗",
    "meaning": "escuro",
    "on": [
      "アン"
    ],
    "kun": [
      "くら(い)",
      "くら(む)",
      "くれ(る)"
    ],
    "category": "n4nat"
  },
  {
    "char": "明",
    "meaning": "claro",
    "on": [
      "メイ",
      "ミョウ",
      "ミン"
    ],
    "kun": [
      "あ(かり)",
      "あか(るい)",
      "あか(るむ)"
    ],
    "category": "n4nat"
  },
  {
    "char": "音",
    "meaning": "som",
    "on": [
      "オン",
      "イン",
      "-ノン"
    ],
    "kun": [
      "おと",
      "ね"
    ],
    "category": "n4nat"
  },
  {
    "char": "魚",
    "meaning": "peixe",
    "on": [
      "ギョ"
    ],
    "kun": [
      "うお",
      "さかな",
      "ざかな"
    ],
    "category": "n4nat"
  },
  {
    "char": "鳥",
    "meaning": "pássaro",
    "on": [
      "チョウ"
    ],
    "kun": [
      "とり"
    ],
    "category": "n4nat"
  },
  {
    "char": "犬",
    "meaning": "cachorro",
    "on": [
      "ケン"
    ],
    "kun": [
      "いぬ"
    ],
    "category": "n4nat"
  },
  {
    "char": "牛",
    "meaning": "vaca",
    "on": [
      "ギュウ"
    ],
    "kun": [
      "うし"
    ],
    "category": "n4nat"
  },
  {
    "char": "肉",
    "meaning": "carne",
    "on": [
      "ニク"
    ],
    "kun": [
      "しし"
    ],
    "category": "n4nat"
  },
  {
    "char": "菜",
    "meaning": "verdura",
    "on": [
      "サイ"
    ],
    "kun": [
      "な"
    ],
    "category": "n4nat"
  },
  {
    "char": "茶",
    "meaning": "chá",
    "on": [
      "チャ",
      "サ"
    ],
    "kun": [],
    "category": "n4nat"
  },
  {
    "char": "飯",
    "meaning": "refeição, arroz cozido",
    "on": [
      "ハン"
    ],
    "kun": [
      "めし"
    ],
    "category": "n4nat"
  },
  {
    "char": "味",
    "meaning": "sabor",
    "on": [
      "ミ"
    ],
    "kun": [
      "あじ",
      "あじ(わう)"
    ],
    "category": "n4nat"
  },
  {
    "char": "薬",
    "meaning": "remédio",
    "on": [
      "ヤク"
    ],
    "kun": [
      "くすり"
    ],
    "category": "n4nat"
  },
  {
    "char": "病",
    "meaning": "doença",
    "on": [
      "ビョウ",
      "ヘイ"
    ],
    "kun": [
      "や(む)",
      "や(み)",
      "やまい"
    ],
    "category": "n4nat"
  },
  {
    "char": "赤",
    "meaning": "vermelho",
    "on": [
      "セキ",
      "シャク"
    ],
    "kun": [
      "あか",
      "あか(い)",
      "あか(らむ)"
    ],
    "category": "n4qua"
  },
  {
    "char": "青",
    "meaning": "azul",
    "on": [
      "セイ",
      "ショウ"
    ],
    "kun": [
      "あお",
      "あお(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "黒",
    "meaning": "preto",
    "on": [
      "コク"
    ],
    "kun": [
      "くろ",
      "くろ(ずむ)",
      "くろ(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "色",
    "meaning": "cor",
    "on": [
      "ショク",
      "シキ"
    ],
    "kun": [
      "いろ"
    ],
    "category": "n4qua"
  },
  {
    "char": "強",
    "meaning": "forte",
    "on": [
      "キョウ",
      "ゴウ"
    ],
    "kun": [
      "つよ(い)",
      "つよ(まる)",
      "つよ(める)"
    ],
    "category": "n4qua"
  },
  {
    "char": "弱",
    "meaning": "fraco",
    "on": [
      "ジャク"
    ],
    "kun": [
      "よわ(い)",
      "よわ(る)",
      "よわ(まる)"
    ],
    "category": "n4qua"
  },
  {
    "char": "太",
    "meaning": "grosso",
    "on": [
      "タイ",
      "タ"
    ],
    "kun": [
      "ふと(い)",
      "ふと(る)"
    ],
    "category": "n4qua"
  },
  {
    "char": "低",
    "meaning": "baixo",
    "on": [
      "テイ"
    ],
    "kun": [
      "ひく(い)",
      "ひく(める)",
      "ひく(まる)"
    ],
    "category": "n4qua"
  },
  {
    "char": "短",
    "meaning": "curto",
    "on": [
      "タン"
    ],
    "kun": [
      "みじか(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "軽",
    "meaning": "leve",
    "on": [
      "ケイ",
      "キョウ",
      "キン"
    ],
    "kun": [
      "かる(い)",
      "かろ(やか)",
      "かろ(んじる)"
    ],
    "category": "n4qua"
  },
  {
    "char": "重",
    "meaning": "pesado, importante",
    "on": [
      "ジュウ",
      "チョウ"
    ],
    "kun": [
      "え",
      "おも(い)",
      "おも(り)"
    ],
    "category": "n4qua"
  },
  {
    "char": "近",
    "meaning": "perto",
    "on": [
      "キン",
      "コン"
    ],
    "kun": [
      "ちか(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "遠",
    "meaning": "longe",
    "on": [
      "エン",
      "オン"
    ],
    "kun": [
      "とお(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "広",
    "meaning": "amplo",
    "on": [
      "コウ"
    ],
    "kun": [
      "ひろ(い)",
      "ひろ(まる)",
      "ひろ(める)"
    ],
    "category": "n4qua"
  },
  {
    "char": "早",
    "meaning": "cedo",
    "on": [
      "ソウ",
      "サッ"
    ],
    "kun": [
      "はや(い)",
      "はや",
      "はや(まる)"
    ],
    "category": "n4qua"
  },
  {
    "char": "暑",
    "meaning": "calor (clima)",
    "on": [
      "ショ"
    ],
    "kun": [
      "あつ(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "寒",
    "meaning": "frio",
    "on": [
      "カン"
    ],
    "kun": [
      "さむ(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "悪",
    "meaning": "mau, ruim",
    "on": [
      "アク",
      "オ"
    ],
    "kun": [
      "わる(い)",
      "わる",
      "あ(し)"
    ],
    "category": "n4qua"
  },
  {
    "char": "好",
    "meaning": "gostar",
    "on": [
      "コウ"
    ],
    "kun": [
      "この(む)",
      "す(く)",
      "よ(い)"
    ],
    "category": "n4qua"
  },
  {
    "char": "楽",
    "meaning": "música, conforto",
    "on": [
      "ガク",
      "ラク",
      "ゴウ"
    ],
    "kun": [
      "たの(しい)",
      "たの(しむ)",
      "この(む)"
    ],
    "category": "n4qua"
  },
  {
    "char": "急",
    "meaning": "pressa, súbito",
    "on": [
      "キュウ"
    ],
    "kun": [
      "いそ(ぐ)",
      "いそ(ぎ)",
      "せ(く)"
    ],
    "category": "n4qua"
  },
  {
    "char": "開",
    "meaning": "abrir",
    "on": [
      "カイ"
    ],
    "kun": [
      "ひら(く)",
      "ひら(き)",
      "びら(き)"
    ],
    "category": "n4mov"
  },
  {
    "char": "起",
    "meaning": "acordar, levantar",
    "on": [
      "キ"
    ],
    "kun": [
      "お(きる)",
      "お(こる)",
      "お(こす)"
    ],
    "category": "n4mov"
  },
  {
    "char": "帰",
    "meaning": "voltar",
    "on": [
      "キ"
    ],
    "kun": [
      "かえ(る)",
      "かえ(す)",
      "おく(る)"
    ],
    "category": "n4mov"
  },
  {
    "char": "歩",
    "meaning": "andar",
    "on": [
      "ホ",
      "ブ",
      "フ"
    ],
    "kun": [
      "ある(く)",
      "あゆ(む)"
    ],
    "category": "n4mov"
  },
  {
    "char": "走",
    "meaning": "correr",
    "on": [
      "ソウ"
    ],
    "kun": [
      "はし(る)"
    ],
    "category": "n4mov"
  },
  {
    "char": "乗",
    "meaning": "subir, andar de",
    "on": [
      "ジョウ",
      "ショウ"
    ],
    "kun": [
      "の(る)",
      "の(り)",
      "の(せる)"
    ],
    "category": "n4mov"
  },
  {
    "char": "送",
    "meaning": "enviar",
    "on": [
      "ソウ"
    ],
    "kun": [
      "おく(る)"
    ],
    "category": "n4mov"
  },
  {
    "char": "運",
    "meaning": "carregar, sorte",
    "on": [
      "ウン"
    ],
    "kun": [
      "はこ(ぶ)"
    ],
    "category": "n4mov"
  },
  {
    "char": "進",
    "meaning": "avançar",
    "on": [
      "シン"
    ],
    "kun": [
      "すす(む)",
      "すす(める)"
    ],
    "category": "n4mov"
  },
  {
    "char": "転",
    "meaning": "girar, rolar",
    "on": [
      "テン"
    ],
    "kun": [
      "ころ(がる)",
      "ころ(げる)",
      "ころ(がす)"
    ],
    "category": "n4mov"
  },
  {
    "char": "止",
    "meaning": "parar",
    "on": [
      "シ"
    ],
    "kun": [
      "と(まる)",
      "ど(まり)",
      "と(める)"
    ],
    "category": "n4mov"
  },
  {
    "char": "待",
    "meaning": "esperar",
    "on": [
      "タイ"
    ],
    "kun": [
      "ま(つ)",
      "ま(ち)"
    ],
    "category": "n4mov"
  },
  {
    "char": "貸",
    "meaning": "emprestar",
    "on": [
      "タイ"
    ],
    "kun": [
      "か(す)",
      "か(し)",
      "かし"
    ],
    "category": "n4mov"
  },
  {
    "char": "借",
    "meaning": "pedir emprestado",
    "on": [
      "シャク"
    ],
    "kun": [
      "か(りる)"
    ],
    "category": "n4mov"
  },
  {
    "char": "売",
    "meaning": "vender",
    "on": [
      "バイ"
    ],
    "kun": [
      "う(る)",
      "う(れる)"
    ],
    "category": "n4mov"
  },
  {
    "char": "通",
    "meaning": "passar, via",
    "on": [
      "ツウ",
      "ツ"
    ],
    "kun": [
      "とお(る)",
      "とお(り)",
      "どお(り)"
    ],
    "category": "n4mov"
  },
  {
    "char": "発",
    "meaning": "partir, emitir",
    "on": [
      "ハツ",
      "ホツ"
    ],
    "kun": [
      "た(つ)",
      "あば(く)",
      "おこ(る)"
    ],
    "category": "n4mov"
  },
  {
    "char": "着",
    "meaning": "chegar, vestir",
    "on": [
      "チャク",
      "ジャク"
    ],
    "kun": [
      "き(る)",
      "き(せる)",
      "つ(く)"
    ],
    "category": "n4mov"
  },
  {
    "char": "旅",
    "meaning": "viagem",
    "on": [
      "リョ"
    ],
    "kun": [
      "たび"
    ],
    "category": "n4mov"
  },
  {
    "char": "作",
    "meaning": "fazer",
    "on": [
      "サク",
      "サ"
    ],
    "kun": [
      "つく(る)",
      "つく(り)",
      "づく(り)"
    ],
    "category": "n4aco"
  },
  {
    "char": "使",
    "meaning": "usar",
    "on": [
      "シ"
    ],
    "kun": [
      "つか(う)",
      "つか(い)",
      "づか(い)"
    ],
    "category": "n4aco"
  },
  {
    "char": "持",
    "meaning": "segurar, ter",
    "on": [
      "ジ"
    ],
    "kun": [
      "も(つ)",
      "も(ち)",
      "も(てる)"
    ],
    "category": "n4aco"
  },
  {
    "char": "洗",
    "meaning": "lavar",
    "on": [
      "セン"
    ],
    "kun": [
      "あら(う)"
    ],
    "category": "n4aco"
  },
  {
    "char": "切",
    "meaning": "cortar",
    "on": [
      "セツ",
      "サイ"
    ],
    "kun": [
      "き(る)",
      "き(り)",
      "ぎ(り)"
    ],
    "category": "n4aco"
  },
  {
    "char": "引",
    "meaning": "puxar",
    "on": [
      "イン"
    ],
    "kun": [
      "ひ(く)",
      "ひ(ける)"
    ],
    "category": "n4aco"
  },
  {
    "char": "習",
    "meaning": "aprender",
    "on": [
      "シュウ",
      "ジュ"
    ],
    "kun": [
      "なら(う)",
      "なら(い)"
    ],
    "category": "n4aco"
  },
  {
    "char": "教",
    "meaning": "ensinar",
    "on": [
      "キョウ"
    ],
    "kun": [
      "おし(える)",
      "おそ(わる)"
    ],
    "category": "n4aco"
  },
  {
    "char": "知",
    "meaning": "saber",
    "on": [
      "チ"
    ],
    "kun": [
      "し(る)",
      "し(らせる)"
    ],
    "category": "n4aco"
  },
  {
    "char": "思",
    "meaning": "pensar",
    "on": [
      "シ"
    ],
    "kun": [
      "おも(う)",
      "おもえら(く)",
      "おぼ(す)"
    ],
    "category": "n4aco"
  },
  {
    "char": "考",
    "meaning": "pensar, considerar",
    "on": [
      "コウ"
    ],
    "kun": [
      "かんが(える)",
      "かんが(え)"
    ],
    "category": "n4aco"
  },
  {
    "char": "答",
    "meaning": "resposta",
    "on": [
      "トウ"
    ],
    "kun": [
      "こた(える)",
      "こた(え)"
    ],
    "category": "n4aco"
  },
  {
    "char": "問",
    "meaning": "pergunta",
    "on": [
      "モン"
    ],
    "kun": [
      "と(う)",
      "と(い)",
      "とん"
    ],
    "category": "n4aco"
  },
  {
    "char": "試",
    "meaning": "testar",
    "on": [
      "シ"
    ],
    "kun": [
      "こころ(みる)",
      "ため(す)"
    ],
    "category": "n4aco"
  },
  {
    "char": "研",
    "meaning": "afiar, estudar a fundo",
    "on": [
      "ケン"
    ],
    "kun": [
      "と(ぐ)"
    ],
    "category": "n4aco"
  },
  {
    "char": "究",
    "meaning": "pesquisar",
    "on": [
      "キュウ",
      "ク"
    ],
    "kun": [
      "きわ(める)"
    ],
    "category": "n4aco"
  },
  {
    "char": "注",
    "meaning": "derramar, atenção",
    "on": [
      "チュウ"
    ],
    "kun": [
      "そそ(ぐ)",
      "さ(す)",
      "つ(ぐ)"
    ],
    "category": "n4aco"
  },
  {
    "char": "集",
    "meaning": "reunir",
    "on": [
      "シュウ"
    ],
    "kun": [
      "あつ(まる)",
      "あつ(める)",
      "つど(う)"
    ],
    "category": "n4aco"
  },
  {
    "char": "合",
    "meaning": "encaixar, juntar",
    "on": [
      "ゴウ",
      "ガッ",
      "カッ"
    ],
    "kun": [
      "あ(う)",
      "あ(い)",
      "あい"
    ],
    "category": "n4aco"
  },
  {
    "char": "住",
    "meaning": "morar",
    "on": [
      "ジュウ",
      "ヂュウ",
      "チュウ"
    ],
    "kun": [
      "す(む)",
      "す(まう)",
      "ず(まい)"
    ],
    "category": "n4aco"
  },
  {
    "char": "動",
    "meaning": "mover",
    "on": [
      "ドウ"
    ],
    "kun": [
      "うご(く)",
      "うご(かす)"
    ],
    "category": "n4aco"
  },
  {
    "char": "働",
    "meaning": "trabalhar",
    "on": [
      "ドウ"
    ],
    "kun": [
      "はたら(く)"
    ],
    "category": "n4aco"
  },
  {
    "char": "始",
    "meaning": "começar",
    "on": [
      "シ"
    ],
    "kun": [
      "はじ(める)",
      "はじ(まる)"
    ],
    "category": "n4aco"
  },
  {
    "char": "終",
    "meaning": "terminar",
    "on": [
      "シュウ"
    ],
    "kun": [
      "お(わる)",
      "おわ(る)",
      "お(える)"
    ],
    "category": "n4aco"
  },
  {
    "char": "建",
    "meaning": "construir",
    "on": [
      "ケン",
      "コン"
    ],
    "kun": [
      "た(てる)",
      "た(て)",
      "だ(て)"
    ],
    "category": "n4aco"
  },
  {
    "char": "計",
    "meaning": "plano, medir",
    "on": [
      "ケイ"
    ],
    "kun": [
      "はか(る)",
      "はか(らう)"
    ],
    "category": "n4aco"
  },
  {
    "char": "字",
    "meaning": "letra, caractere",
    "on": [
      "ジ"
    ],
    "kun": [
      "あざ",
      "あざな",
      "な"
    ],
    "category": "n4est"
  },
  {
    "char": "文",
    "meaning": "frase, texto",
    "on": [
      "ブン",
      "モン"
    ],
    "kun": [
      "ふみ",
      "あや"
    ],
    "category": "n4est"
  },
  {
    "char": "漢",
    "meaning": "chinês (han)",
    "on": [
      "カン"
    ],
    "kun": [],
    "category": "n4est"
  },
  {
    "char": "英",
    "meaning": "inglês",
    "on": [
      "エイ"
    ],
    "kun": [
      "はなぶさ"
    ],
    "category": "n4est"
  },
  {
    "char": "画",
    "meaning": "desenho, traço",
    "on": [
      "ガ",
      "カク",
      "エ"
    ],
    "kun": [
      "えが(く)",
      "かく(する)",
      "かぎ(る)"
    ],
    "category": "n4est"
  },
  {
    "char": "写",
    "meaning": "copiar, fotografar",
    "on": [
      "シャ",
      "ジャ"
    ],
    "kun": [
      "うつ(す)",
      "うつ(る)",
      "うつ"
    ],
    "category": "n4est"
  },
  {
    "char": "図",
    "meaning": "mapa, desenho",
    "on": [
      "ズ",
      "ト"
    ],
    "kun": [
      "え",
      "はか(る)"
    ],
    "category": "n4est"
  },
  {
    "char": "題",
    "meaning": "tema",
    "on": [
      "ダイ"
    ],
    "kun": [],
    "category": "n4est"
  },
  {
    "char": "質",
    "meaning": "qualidade, natureza",
    "on": [
      "シツ",
      "シチ",
      "チ"
    ],
    "kun": [
      "たち",
      "ただ(す)",
      "もと"
    ],
    "category": "n4est"
  },
  {
    "char": "説",
    "meaning": "explicação, opinião",
    "on": [
      "セツ",
      "ゼイ"
    ],
    "kun": [
      "と(く)"
    ],
    "category": "n4est"
  },
  {
    "char": "意",
    "meaning": "ideia, intenção",
    "on": [
      "イ"
    ],
    "kun": [],
    "category": "n4est"
  },
  {
    "char": "勉",
    "meaning": "esforço",
    "on": [
      "ベン"
    ],
    "kun": [
      "つと(める)"
    ],
    "category": "n4est"
  },
  {
    "char": "業",
    "meaning": "negócio, ofício",
    "on": [
      "ギョウ",
      "ゴウ"
    ],
    "kun": [
      "わざ"
    ],
    "category": "n4est"
  },
  {
    "char": "理",
    "meaning": "razão, lógica",
    "on": [
      "リ"
    ],
    "kun": [
      "ことわり"
    ],
    "category": "n4est"
  },
  {
    "char": "用",
    "meaning": "usar, assunto",
    "on": [
      "ヨウ"
    ],
    "kun": [
      "もち(いる)"
    ],
    "category": "n4est"
  },
  {
    "char": "事",
    "meaning": "coisa, assunto",
    "on": [
      "ジ",
      "ズ"
    ],
    "kun": [
      "こと",
      "つか(う)",
      "つか(える)"
    ],
    "category": "n4est"
  },
  {
    "char": "品",
    "meaning": "artigo, qualidade",
    "on": [
      "ヒン",
      "ホン"
    ],
    "kun": [
      "しな"
    ],
    "category": "n4est"
  },
  {
    "char": "験",
    "meaning": "experimento, prova",
    "on": [
      "ケン",
      "ゲン"
    ],
    "kun": [
      "あかし",
      "しるし",
      "ため(す)"
    ],
    "category": "n4est"
  },
  {
    "char": "映",
    "meaning": "refletir, projetar",
    "on": [
      "エイ"
    ],
    "kun": [
      "うつ(る)",
      "うつ(す)",
      "は(える)"
    ],
    "category": "n4est"
  },
  {
    "char": "歌",
    "meaning": "canção, cantar",
    "on": [
      "カ"
    ],
    "kun": [
      "うた",
      "うた(う)"
    ],
    "category": "n4est"
  },
  {
    "char": "紙",
    "meaning": "papel",
    "on": [
      "シ"
    ],
    "kun": [
      "かみ"
    ],
    "category": "n4est"
  },
  {
    "char": "物",
    "meaning": "coisa",
    "on": [
      "ブツ",
      "モツ"
    ],
    "kun": [
      "もの"
    ],
    "category": "n4ideia"
  },
  {
    "char": "不",
    "meaning": "não- (negação)",
    "on": [
      "フ",
      "ブ"
    ],
    "kun": [],
    "category": "n4ideia"
  },
  {
    "char": "特",
    "meaning": "especial",
    "on": [
      "トク"
    ],
    "kun": [],
    "category": "n4ideia"
  },
  {
    "char": "別",
    "meaning": "separado, outro",
    "on": [
      "ベツ"
    ],
    "kun": [
      "わか(れる)",
      "わ(ける)"
    ],
    "category": "n4ideia"
  },
  {
    "char": "正",
    "meaning": "correto",
    "on": [
      "セイ",
      "ショウ"
    ],
    "kun": [
      "ただ(しい)",
      "ただ(す)",
      "まさ"
    ],
    "category": "n4ideia"
  },
  {
    "char": "真",
    "meaning": "verdade",
    "on": [
      "シン"
    ],
    "kun": [
      "ま",
      "まこと"
    ],
    "category": "n4ideia"
  },
  {
    "char": "有",
    "meaning": "ter, existir",
    "on": [
      "ユウ",
      "ウ"
    ],
    "kun": [
      "あ(る)"
    ],
    "category": "n4ideia"
  },
  {
    "char": "自",
    "meaning": "si mesmo",
    "on": [
      "ジ",
      "シ"
    ],
    "kun": [
      "みずか(ら)",
      "おの(ずから)",
      "おの(ずと)"
    ],
    "category": "n4ideia"
  },
  {
    "char": "同",
    "meaning": "igual",
    "on": [
      "ドウ"
    ],
    "kun": [
      "おな(じ)"
    ],
    "category": "n4ideia"
  },
  {
    "char": "方",
    "meaning": "direção, pessoa",
    "on": [
      "ホウ"
    ],
    "kun": [
      "かた",
      "がた"
    ],
    "category": "n4ideia"
  },
  {
    "char": "力",
    "meaning": "força",
    "on": [
      "リョク",
      "リキ",
      "リイ"
    ],
    "kun": [
      "ちから"
    ],
    "category": "n4ideia"
  },
  {
    "char": "工",
    "meaning": "ofício, construção",
    "on": [
      "コウ",
      "ク",
      "グ"
    ],
    "kun": [],
    "category": "n4ideia"
  },
  {
    "char": "産",
    "meaning": "produzir, dar à luz",
    "on": [
      "サン"
    ],
    "kun": [
      "う(む)",
      "う(まれる)",
      "うぶ"
    ],
    "category": "n4ideia"
  },
  {
    "char": "仕",
    "meaning": "servir",
    "on": [
      "シ",
      "ジ"
    ],
    "kun": [
      "つか(える)"
    ],
    "category": "n4ideia"
  },
  {
    "char": "死",
    "meaning": "morte, morrer",
    "on": [
      "シ"
    ],
    "kun": [
      "し(ぬ)",
      "し(に)"
    ],
    "category": "n4ideia"
  },
  {
    "char": "元",
    "meaning": "origem, antes",
    "on": [
      "ゲン",
      "ガン"
    ],
    "kun": [
      "もと"
    ],
    "category": "n4ideia"
  },
  {
    "char": "便",
    "meaning": "conveniência, correio",
    "on": [
      "ベン",
      "ビン"
    ],
    "kun": [
      "たよ(り)"
    ],
    "category": "n4ideia"
  },
  {
    "char": "服",
    "meaning": "roupa",
    "on": [
      "フク"
    ],
    "kun": [],
    "category": "n4ideia"
  },
  {
    "char": "料",
    "meaning": "taxa, material",
    "on": [
      "リョウ"
    ],
    "kun": [],
    "category": "n4ideia"
  },
  {
    "char": "洋",
    "meaning": "oceano, ocidental",
    "on": [
      "ヨウ"
    ],
    "kun": [],
    "category": "n4ideia"
  },
  {
    "char": "台",
    "meaning": "plataforma, contador de máquinas",
    "on": [
      "ダイ",
      "タイ"
    ],
    "kun": [
      "うてな",
      "われ",
      "つかさ"
    ],
    "category": "n4ideia"
  },
  {
    "char": "体",
    "meaning": "corpo",
    "on": [
      "タイ",
      "テイ"
    ],
    "kun": [
      "からだ",
      "かたち"
    ],
    "category": "n4corpo"
  },
  {
    "char": "首",
    "meaning": "pescoço",
    "on": [
      "シュ"
    ],
    "kun": [
      "くび"
    ],
    "category": "n4corpo"
  },
  {
    "char": "顔",
    "meaning": "rosto",
    "on": [
      "ガン"
    ],
    "kun": [
      "かお"
    ],
    "category": "n4corpo"
  },
  {
    "char": "頭",
    "meaning": "cabeça",
    "on": [
      "トウ",
      "ズ",
      "ト"
    ],
    "kun": [
      "あたま",
      "かしら",
      "がしら"
    ],
    "category": "n4corpo"
  },
  {
    "char": "心",
    "meaning": "coração",
    "on": [
      "シン"
    ],
    "kun": [
      "こころ",
      "ごころ"
    ],
    "category": "n4corpo"
  },
  {
    "char": "声",
    "meaning": "voz",
    "on": [
      "セイ",
      "ショウ"
    ],
    "kun": [
      "こえ",
      "こわ"
    ],
    "category": "n4corpo"
  }
];

export const KANJI_EXTRA_CATEGORIES: readonly KanjiCategory[] = [
  {
    "id": "n4fam",
    "label": "N4: Família e pessoas",
    "chars": "兄姉弟妹親族者医員民私主"
  },
  {
    "id": "n4lug",
    "label": "N4: Lugares",
    "chars": "家屋室館院堂町村市区県京都場所池森林田野海地界門銀"
  },
  {
    "id": "n4tem",
    "label": "N4: Tempo",
    "chars": "春夏秋冬朝昼夜夕曜代度回世去以"
  },
  {
    "id": "n4nat",
    "label": "N4: Natureza e comida",
    "chars": "光風暗明音魚鳥犬牛肉菜茶飯味薬病"
  },
  {
    "id": "n4qua",
    "label": "N4: Cores e qualidades",
    "chars": "赤青黒色強弱太低短軽重近遠広早暑寒悪好楽急"
  },
  {
    "id": "n4mov",
    "label": "N4: Movimento",
    "chars": "開起帰歩走乗送運進転止待貸借売通発着旅"
  },
  {
    "id": "n4aco",
    "label": "N4: Ações",
    "chars": "作使持洗切引習教知思考答問試研究注集合住動働始終建計"
  },
  {
    "id": "n4est",
    "label": "N4: Estudo e escrita",
    "chars": "字文漢英画写図題質説意勉業理用事品験映歌紙"
  },
  {
    "id": "n4ideia",
    "label": "N4: Ideias e coisas",
    "chars": "物不特別正真有自同方力工産仕死元便服料洋台"
  },
  {
    "id": "n4corpo",
    "label": "N4: Corpo e sentidos",
    "chars": "体首顔頭心声"
  }
];

export const KANJI_EXTRA_LESSONS: readonly Lesson[] = [
  {
    "id": "kanji:L19",
    "title": "Família e pessoas 1",
    "items": [
      "兄",
      "姉",
      "弟",
      "妹",
      "親",
      "族"
    ]
  },
  {
    "id": "kanji:L20",
    "title": "Família e pessoas 2",
    "items": [
      "者",
      "医",
      "員",
      "民",
      "私",
      "主"
    ]
  },
  {
    "id": "kanji:L21",
    "title": "Lugares 1",
    "items": [
      "家",
      "屋",
      "室",
      "館",
      "院"
    ]
  },
  {
    "id": "kanji:L22",
    "title": "Lugares 2",
    "items": [
      "堂",
      "町",
      "村",
      "市",
      "区"
    ]
  },
  {
    "id": "kanji:L23",
    "title": "Lugares 3",
    "items": [
      "県",
      "京",
      "都",
      "場",
      "所"
    ]
  },
  {
    "id": "kanji:L24",
    "title": "Lugares 4",
    "items": [
      "池",
      "森",
      "林",
      "田",
      "野"
    ]
  },
  {
    "id": "kanji:L25",
    "title": "Lugares 5",
    "items": [
      "海",
      "地",
      "界",
      "門",
      "銀"
    ]
  },
  {
    "id": "kanji:L26",
    "title": "Tempo 1",
    "items": [
      "春",
      "夏",
      "秋",
      "冬",
      "朝"
    ]
  },
  {
    "id": "kanji:L27",
    "title": "Tempo 2",
    "items": [
      "昼",
      "夜",
      "夕",
      "曜",
      "代"
    ]
  },
  {
    "id": "kanji:L28",
    "title": "Tempo 3",
    "items": [
      "度",
      "回",
      "世",
      "去",
      "以"
    ]
  },
  {
    "id": "kanji:L29",
    "title": "Natureza e comida 1",
    "items": [
      "光",
      "風",
      "暗",
      "明",
      "音",
      "魚"
    ]
  },
  {
    "id": "kanji:L30",
    "title": "Natureza e comida 2",
    "items": [
      "鳥",
      "犬",
      "牛",
      "肉",
      "菜",
      "茶"
    ]
  },
  {
    "id": "kanji:L31",
    "title": "Natureza e comida 3",
    "items": [
      "飯",
      "味",
      "薬",
      "病"
    ]
  },
  {
    "id": "kanji:L32",
    "title": "Cores e qualidades 1",
    "items": [
      "赤",
      "青",
      "黒",
      "色",
      "強",
      "弱"
    ]
  },
  {
    "id": "kanji:L33",
    "title": "Cores e qualidades 2",
    "items": [
      "太",
      "低",
      "短",
      "軽",
      "重",
      "近"
    ]
  },
  {
    "id": "kanji:L34",
    "title": "Cores e qualidades 3",
    "items": [
      "遠",
      "広",
      "早",
      "暑",
      "寒",
      "悪"
    ]
  },
  {
    "id": "kanji:L35",
    "title": "Cores e qualidades 4",
    "items": [
      "好",
      "楽",
      "急"
    ]
  },
  {
    "id": "kanji:L36",
    "title": "Movimento 1",
    "items": [
      "開",
      "起",
      "帰",
      "歩",
      "走"
    ]
  },
  {
    "id": "kanji:L37",
    "title": "Movimento 2",
    "items": [
      "乗",
      "送",
      "運",
      "進",
      "転"
    ]
  },
  {
    "id": "kanji:L38",
    "title": "Movimento 3",
    "items": [
      "止",
      "待",
      "貸",
      "借",
      "売"
    ]
  },
  {
    "id": "kanji:L39",
    "title": "Movimento 4",
    "items": [
      "通",
      "発",
      "着",
      "旅"
    ]
  },
  {
    "id": "kanji:L40",
    "title": "Ações 1",
    "items": [
      "作",
      "使",
      "持",
      "洗",
      "切",
      "引"
    ]
  },
  {
    "id": "kanji:L41",
    "title": "Ações 2",
    "items": [
      "習",
      "教",
      "知",
      "思",
      "考",
      "答"
    ]
  },
  {
    "id": "kanji:L42",
    "title": "Ações 3",
    "items": [
      "問",
      "試",
      "研",
      "究",
      "注",
      "集"
    ]
  },
  {
    "id": "kanji:L43",
    "title": "Ações 4",
    "items": [
      "合",
      "住",
      "動",
      "働",
      "始",
      "終"
    ]
  },
  {
    "id": "kanji:L44",
    "title": "Ações 5",
    "items": [
      "建",
      "計"
    ]
  },
  {
    "id": "kanji:L45",
    "title": "Estudo e escrita 1",
    "items": [
      "字",
      "文",
      "漢",
      "英",
      "画",
      "写"
    ]
  },
  {
    "id": "kanji:L46",
    "title": "Estudo e escrita 2",
    "items": [
      "図",
      "題",
      "質",
      "説",
      "意",
      "勉"
    ]
  },
  {
    "id": "kanji:L47",
    "title": "Estudo e escrita 3",
    "items": [
      "業",
      "理",
      "用",
      "事",
      "品",
      "験"
    ]
  },
  {
    "id": "kanji:L48",
    "title": "Estudo e escrita 4",
    "items": [
      "映",
      "歌",
      "紙"
    ]
  },
  {
    "id": "kanji:L49",
    "title": "Ideias e coisas 1",
    "items": [
      "物",
      "不",
      "特",
      "別",
      "正",
      "真"
    ]
  },
  {
    "id": "kanji:L50",
    "title": "Ideias e coisas 2",
    "items": [
      "有",
      "自",
      "同",
      "方",
      "力",
      "工"
    ]
  },
  {
    "id": "kanji:L51",
    "title": "Ideias e coisas 3",
    "items": [
      "産",
      "仕",
      "死",
      "元",
      "便",
      "服"
    ]
  },
  {
    "id": "kanji:L52",
    "title": "Ideias e coisas 4",
    "items": [
      "料",
      "洋",
      "台"
    ]
  },
  {
    "id": "kanji:L53",
    "title": "Corpo e sentidos",
    "items": [
      "体",
      "首",
      "顔",
      "頭",
      "心",
      "声"
    ]
  }
];
