// Gerado por `npm run build-kanji` (scripts/kanji). Não edite à mão.
// Leituras: KANJIDIC2 (EDRDG, CC BY-SA 4.0). Significados em português e categorias: escritos para este app (a revisar).
// Traços: ver src/data/strokes (KanjiVG, CC BY-SA 3.0). Ver src/content/LICENSE.md.
import type { Kanji, KanjiCategory, Lesson } from '@/data/types';

/** O último kanji do N5, os do N4 e os 193 do N3 (mais frequentes) que não estavam nos 102 iniciais. */
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
  },
  {
    "char": "政",
    "meaning": "política, governo",
    "on": [
      "セイ",
      "ショウ"
    ],
    "kun": [
      "まつりごと",
      "まん"
    ],
    "category": "n3gov"
  },
  {
    "char": "党",
    "meaning": "partido",
    "on": [
      "トウ"
    ],
    "kun": [
      "なかま",
      "むら"
    ],
    "category": "n3gov"
  },
  {
    "char": "府",
    "meaning": "prefeitura (府), órgão do governo",
    "on": [
      "フ"
    ],
    "kun": [],
    "category": "n3gov"
  },
  {
    "char": "官",
    "meaning": "funcionário público, governo",
    "on": [
      "カン"
    ],
    "kun": [],
    "category": "n3gov"
  },
  {
    "char": "局",
    "meaning": "repartição, departamento",
    "on": [
      "キョク"
    ],
    "kun": [
      "つぼね"
    ],
    "category": "n3gov"
  },
  {
    "char": "軍",
    "meaning": "exército",
    "on": [
      "グン"
    ],
    "kun": [
      "いくさ"
    ],
    "category": "n3gov"
  },
  {
    "char": "公",
    "meaning": "público, oficial",
    "on": [
      "コウ",
      "ク"
    ],
    "kun": [
      "おおやけ"
    ],
    "category": "n3gov"
  },
  {
    "char": "権",
    "meaning": "direito, poder",
    "on": [
      "ケン",
      "ゴン"
    ],
    "kun": [
      "おもり",
      "かり",
      "はか(る)"
    ],
    "category": "n3gov"
  },
  {
    "char": "税",
    "meaning": "imposto",
    "on": [
      "ゼイ"
    ],
    "kun": [],
    "category": "n3gov"
  },
  {
    "char": "制",
    "meaning": "sistema, regra",
    "on": [
      "セイ"
    ],
    "kun": [],
    "category": "n3gov"
  },
  {
    "char": "法",
    "meaning": "lei, método",
    "on": [
      "ホウ",
      "ハッ",
      "ホッ"
    ],
    "kun": [
      "のり"
    ],
    "category": "n3gov"
  },
  {
    "char": "州",
    "meaning": "estado, província",
    "on": [
      "シュウ",
      "ス"
    ],
    "kun": [
      "す"
    ],
    "category": "n3gov"
  },
  {
    "char": "武",
    "meaning": "guerreiro, militar",
    "on": [
      "ブ",
      "ム"
    ],
    "kun": [
      "たけ",
      "たけ(し)"
    ],
    "category": "n3gov"
  },
  {
    "char": "戦",
    "meaning": "guerra, lutar",
    "on": [
      "セン"
    ],
    "kun": [
      "いくさ",
      "たたか(う)",
      "おのの(く)"
    ],
    "category": "n3gov"
  },
  {
    "char": "争",
    "meaning": "disputar, brigar",
    "on": [
      "ソウ"
    ],
    "kun": [
      "あらそ(う)",
      "いか(でか)"
    ],
    "category": "n3gov"
  },
  {
    "char": "勢",
    "meaning": "força, ímpeto",
    "on": [
      "セイ",
      "ゼイ"
    ],
    "kun": [
      "いきお(い)",
      "はずみ"
    ],
    "category": "n3gov"
  },
  {
    "char": "務",
    "meaning": "tarefa, dever",
    "on": [
      "ム"
    ],
    "kun": [
      "つと(める)"
    ],
    "category": "n3org"
  },
  {
    "char": "職",
    "meaning": "ofício, emprego",
    "on": [
      "ショク",
      "ソク"
    ],
    "kun": [],
    "category": "n3org"
  },
  {
    "char": "役",
    "meaning": "função, papel",
    "on": [
      "ヤク",
      "エキ"
    ],
    "kun": [],
    "category": "n3org"
  },
  {
    "char": "係",
    "meaning": "encarregado, relação",
    "on": [
      "ケイ"
    ],
    "kun": [
      "かか(る)",
      "かかり",
      "がかり"
    ],
    "category": "n3org"
  },
  {
    "char": "委",
    "meaning": "confiar, comissão",
    "on": [
      "イ"
    ],
    "kun": [
      "ゆだ(ねる)"
    ],
    "category": "n3org"
  },
  {
    "char": "営",
    "meaning": "gerir, administrar",
    "on": [
      "エイ"
    ],
    "kun": [
      "いとな(む)",
      "いとな(み)"
    ],
    "category": "n3org"
  },
  {
    "char": "部",
    "meaning": "seção, parte",
    "on": [
      "ブ"
    ],
    "kun": [
      "べ"
    ],
    "category": "n3org"
  },
  {
    "char": "副",
    "meaning": "vice, auxiliar",
    "on": [
      "フク"
    ],
    "kun": [],
    "category": "n3org"
  },
  {
    "char": "設",
    "meaning": "estabelecer, instalar",
    "on": [
      "セツ"
    ],
    "kun": [
      "もう(ける)"
    ],
    "category": "n3org"
  },
  {
    "char": "任",
    "meaning": "encargo, confiar",
    "on": [
      "ニン"
    ],
    "kun": [
      "まか(せる)",
      "まか(す)"
    ],
    "category": "n3org"
  },
  {
    "char": "団",
    "meaning": "grupo, associação",
    "on": [
      "ダン",
      "トン"
    ],
    "kun": [
      "かたまり",
      "まる(い)"
    ],
    "category": "n3org"
  },
  {
    "char": "組",
    "meaning": "grupo, turma",
    "on": [
      "ソ"
    ],
    "kun": [
      "く(む)",
      "くみ",
      "ぐみ"
    ],
    "category": "n3org"
  },
  {
    "char": "機",
    "meaning": "máquina, ocasião",
    "on": [
      "キ"
    ],
    "kun": [
      "はた"
    ],
    "category": "n3org"
  },
  {
    "char": "構",
    "meaning": "estrutura, preparar",
    "on": [
      "コウ"
    ],
    "kun": [
      "かま(える)",
      "かま(う)"
    ],
    "category": "n3org"
  },
  {
    "char": "資",
    "meaning": "recursos, capital",
    "on": [
      "シ"
    ],
    "kun": [],
    "category": "n3org"
  },
  {
    "char": "費",
    "meaning": "gasto, custo",
    "on": [
      "ヒ"
    ],
    "kun": [
      "つい(やす)",
      "つい(える)"
    ],
    "category": "n3org"
  },
  {
    "char": "備",
    "meaning": "preparar, equipar",
    "on": [
      "ビ"
    ],
    "kun": [
      "そな(える)",
      "そな(わる)",
      "つぶさ(に)"
    ],
    "category": "n3org"
  },
  {
    "char": "輸",
    "meaning": "transportar",
    "on": [
      "ユ",
      "シュ"
    ],
    "kun": [],
    "category": "n3org"
  },
  {
    "char": "農",
    "meaning": "agricultura",
    "on": [
      "ノウ"
    ],
    "kun": [],
    "category": "n3org"
  },
  {
    "char": "労",
    "meaning": "trabalho, esforço",
    "on": [
      "ロウ"
    ],
    "kun": [
      "ろう(する)",
      "いたわ(る)",
      "いた(ずき)"
    ],
    "category": "n3org"
  },
  {
    "char": "議",
    "meaning": "debate, discussão",
    "on": [
      "ギ"
    ],
    "kun": [],
    "category": "n3com"
  },
  {
    "char": "談",
    "meaning": "conversar",
    "on": [
      "ダン"
    ],
    "kun": [],
    "category": "n3com"
  },
  {
    "char": "論",
    "meaning": "argumento, teoria",
    "on": [
      "ロン"
    ],
    "kun": [
      "あげつら(う)"
    ],
    "category": "n3com"
  },
  {
    "char": "述",
    "meaning": "expor, dizer",
    "on": [
      "ジュツ"
    ],
    "kun": [
      "の(べる)"
    ],
    "category": "n3com"
  },
  {
    "char": "告",
    "meaning": "comunicar, anunciar",
    "on": [
      "コク"
    ],
    "kun": [
      "つ(げる)"
    ],
    "category": "n3com"
  },
  {
    "char": "報",
    "meaning": "notícia, informar",
    "on": [
      "ホウ"
    ],
    "kun": [
      "むく(いる)"
    ],
    "category": "n3com"
  },
  {
    "char": "信",
    "meaning": "acreditar, confiar",
    "on": [
      "シン"
    ],
    "kun": [],
    "category": "n3com"
  },
  {
    "char": "念",
    "meaning": "pensamento, desejo",
    "on": [
      "ネン"
    ],
    "kun": [],
    "category": "n3com"
  },
  {
    "char": "認",
    "meaning": "reconhecer",
    "on": [
      "ニン"
    ],
    "kun": [
      "みと(める)",
      "したた(める)"
    ],
    "category": "n3com"
  },
  {
    "char": "示",
    "meaning": "mostrar",
    "on": [
      "ジ",
      "シ"
    ],
    "kun": [
      "しめ(す)"
    ],
    "category": "n3com"
  },
  {
    "char": "表",
    "meaning": "superfície, tabela, expressar",
    "on": [
      "ヒョウ"
    ],
    "kun": [
      "おもて",
      "あらわ(す)",
      "あらわ(れる)"
    ],
    "category": "n3com"
  },
  {
    "char": "記",
    "meaning": "anotar, registrar",
    "on": [
      "キ"
    ],
    "kun": [
      "しる(す)"
    ],
    "category": "n3com"
  },
  {
    "char": "疑",
    "meaning": "duvidar",
    "on": [
      "ギ"
    ],
    "kun": [
      "うたが(う)"
    ],
    "category": "n3com"
  },
  {
    "char": "案",
    "meaning": "plano, proposta",
    "on": [
      "アン"
    ],
    "kun": [
      "つくえ"
    ],
    "category": "n3com"
  },
  {
    "char": "想",
    "meaning": "pensamento, imaginar",
    "on": [
      "ソウ",
      "ソ"
    ],
    "kun": [
      "おも(う)"
    ],
    "category": "n3com"
  },
  {
    "char": "判",
    "meaning": "julgar, carimbo",
    "on": [
      "ハン",
      "バン"
    ],
    "kun": [
      "わか(る)"
    ],
    "category": "n3com"
  },
  {
    "char": "調",
    "meaning": "investigar, tom",
    "on": [
      "チョウ"
    ],
    "kun": [
      "しら(べる)",
      "しら(べ)",
      "ととの(う)"
    ],
    "category": "n3com"
  },
  {
    "char": "査",
    "meaning": "investigar",
    "on": [
      "サ"
    ],
    "kun": [],
    "category": "n3com"
  },
  {
    "char": "検",
    "meaning": "examinar",
    "on": [
      "ケン"
    ],
    "kun": [
      "しら(べる)"
    ],
    "category": "n3com"
  },
  {
    "char": "協",
    "meaning": "cooperar",
    "on": [
      "キョウ"
    ],
    "kun": [],
    "category": "n3rel"
  },
  {
    "char": "共",
    "meaning": "juntos, comum",
    "on": [
      "キョウ"
    ],
    "kun": [
      "とも",
      "とも(に)",
      "ども"
    ],
    "category": "n3rel"
  },
  {
    "char": "供",
    "meaning": "oferecer, acompanhar",
    "on": [
      "キョウ",
      "ク",
      "クウ"
    ],
    "kun": [
      "そな(える)",
      "とも",
      "ども"
    ],
    "category": "n3rel"
  },
  {
    "char": "交",
    "meaning": "cruzar, trocar",
    "on": [
      "コウ"
    ],
    "kun": [
      "まじ(わる)",
      "まじ(える)",
      "ま(じる)"
    ],
    "category": "n3rel"
  },
  {
    "char": "連",
    "meaning": "levar junto, ligar",
    "on": [
      "レン"
    ],
    "kun": [
      "つら(なる)",
      "つら(ねる)",
      "つ(れる)"
    ],
    "category": "n3rel"
  },
  {
    "char": "相",
    "meaning": "mútuo, aspecto",
    "on": [
      "ソウ",
      "ショウ"
    ],
    "kun": [
      "あい"
    ],
    "category": "n3rel"
  },
  {
    "char": "対",
    "meaning": "contra, oposto, par",
    "on": [
      "タイ",
      "ツイ"
    ],
    "kun": [
      "あいて",
      "こた(える)",
      "そろ(い)"
    ],
    "category": "n3rel"
  },
  {
    "char": "助",
    "meaning": "ajudar",
    "on": [
      "ジョ"
    ],
    "kun": [
      "たす(ける)",
      "たす(かる)",
      "す(ける)"
    ],
    "category": "n3rel"
  },
  {
    "char": "与",
    "meaning": "dar",
    "on": [
      "ヨ"
    ],
    "kun": [
      "あた(える)",
      "あずか(る)",
      "くみ(する)"
    ],
    "category": "n3rel"
  },
  {
    "char": "受",
    "meaning": "receber",
    "on": [
      "ジュ"
    ],
    "kun": [
      "う(ける)",
      "う(け)",
      "う(かる)"
    ],
    "category": "n3rel"
  },
  {
    "char": "支",
    "meaning": "sustentar, ramo",
    "on": [
      "シ"
    ],
    "kun": [
      "ささ(える)",
      "つか(える)",
      "か(う)"
    ],
    "category": "n3rel"
  },
  {
    "char": "保",
    "meaning": "proteger, manter",
    "on": [
      "ホ",
      "ホウ"
    ],
    "kun": [
      "たも(つ)"
    ],
    "category": "n3rel"
  },
  {
    "char": "補",
    "meaning": "completar, suprir",
    "on": [
      "ホ"
    ],
    "kun": [
      "おぎな(う)"
    ],
    "category": "n3rel"
  },
  {
    "char": "取",
    "meaning": "pegar",
    "on": [
      "シュ"
    ],
    "kun": [
      "と(る)",
      "と(り)",
      "とり"
    ],
    "category": "n3rel"
  },
  {
    "char": "付",
    "meaning": "anexar, grudar",
    "on": [
      "フ"
    ],
    "kun": [
      "つ(ける)",
      "づ(ける)",
      "つ(け)"
    ],
    "category": "n3rel"
  },
  {
    "char": "配",
    "meaning": "distribuir",
    "on": [
      "ハイ"
    ],
    "kun": [
      "くば(る)"
    ],
    "category": "n3rel"
  },
  {
    "char": "投",
    "meaning": "lançar, jogar",
    "on": [
      "トウ"
    ],
    "kun": [
      "な(げる)",
      "な(げ)"
    ],
    "category": "n3rel"
  },
  {
    "char": "打",
    "meaning": "bater",
    "on": [
      "ダ",
      "ダース"
    ],
    "kun": [
      "う(つ)",
      "う(ち)",
      "ぶ(つ)"
    ],
    "category": "n3rel"
  },
  {
    "char": "導",
    "meaning": "guiar",
    "on": [
      "ドウ"
    ],
    "kun": [
      "みちび(く)"
    ],
    "category": "n3rel"
  },
  {
    "char": "得",
    "meaning": "obter, ganhar",
    "on": [
      "トク"
    ],
    "kun": [
      "え(る)",
      "う(る)"
    ],
    "category": "n3rel"
  },
  {
    "char": "演",
    "meaning": "apresentar, encenar",
    "on": [
      "エン"
    ],
    "kun": [],
    "category": "n3rel"
  },
  {
    "char": "応",
    "meaning": "responder, corresponder",
    "on": [
      "オウ",
      "ヨウ",
      "-ノウ"
    ],
    "kun": [
      "あた(る)",
      "まさに",
      "こた(える)"
    ],
    "category": "n3rel"
  },
  {
    "char": "能",
    "meaning": "capacidade",
    "on": [
      "ノウ"
    ],
    "kun": [
      "よ(く)",
      "あた(う)"
    ],
    "category": "n3rel"
  },
  {
    "char": "当",
    "meaning": "acertar, este (próprio)",
    "on": [
      "トウ"
    ],
    "kun": [
      "あ(たる)",
      "あ(たり)",
      "あ(てる)"
    ],
    "category": "n3rel"
  },
  {
    "char": "変",
    "meaning": "mudar, estranho",
    "on": [
      "ヘン"
    ],
    "kun": [
      "か(わる)",
      "か(わり)",
      "か(える)"
    ],
    "category": "n3mud"
  },
  {
    "char": "化",
    "meaning": "mudar, transformar",
    "on": [
      "カ",
      "ケ"
    ],
    "kun": [
      "ば(ける)",
      "ば(かす)",
      "ふ(ける)"
    ],
    "category": "n3mud"
  },
  {
    "char": "改",
    "meaning": "renovar, mudar",
    "on": [
      "カイ"
    ],
    "kun": [
      "あらた(める)",
      "あらた(まる)"
    ],
    "category": "n3mud"
  },
  {
    "char": "加",
    "meaning": "somar, acrescentar",
    "on": [
      "カ"
    ],
    "kun": [
      "くわ(える)",
      "くわ(わる)"
    ],
    "category": "n3mud"
  },
  {
    "char": "増",
    "meaning": "aumentar",
    "on": [
      "ゾウ"
    ],
    "kun": [
      "ま(す)",
      "ま(し)",
      "ふ(える)"
    ],
    "category": "n3mud"
  },
  {
    "char": "減",
    "meaning": "diminuir",
    "on": [
      "ゲン"
    ],
    "kun": [
      "へ(る)",
      "へ(らす)"
    ],
    "category": "n3mud"
  },
  {
    "char": "残",
    "meaning": "sobrar, restar",
    "on": [
      "ザン",
      "サン"
    ],
    "kun": [
      "のこ(る)",
      "のこ(す)",
      "そこな(う)"
    ],
    "category": "n3mud"
  },
  {
    "char": "続",
    "meaning": "continuar",
    "on": [
      "ゾク",
      "ショク",
      "コウ"
    ],
    "kun": [
      "つづ(く)",
      "つづ(ける)",
      "つぐ(ない)"
    ],
    "category": "n3mud"
  },
  {
    "char": "済",
    "meaning": "terminar, acabado",
    "on": [
      "サイ",
      "セイ"
    ],
    "kun": [
      "す(む)",
      "ず(み)",
      "ずみ"
    ],
    "category": "n3mud"
  },
  {
    "char": "初",
    "meaning": "primeiro, início",
    "on": [
      "ショ"
    ],
    "kun": [
      "はじ(め)",
      "はじ(めて)",
      "はつ"
    ],
    "category": "n3mud"
  },
  {
    "char": "最",
    "meaning": "o mais, extremo",
    "on": [
      "サイ",
      "シュ"
    ],
    "kun": [
      "もっと(も)",
      "つま"
    ],
    "category": "n3mud"
  },
  {
    "char": "再",
    "meaning": "de novo",
    "on": [
      "サイ",
      "サ"
    ],
    "kun": [
      "ふたた(び)"
    ],
    "category": "n3mud"
  },
  {
    "char": "次",
    "meaning": "seguinte, próximo",
    "on": [
      "ジ",
      "シ"
    ],
    "kun": [
      "つ(ぐ)",
      "つぎ"
    ],
    "category": "n3mud"
  },
  {
    "char": "向",
    "meaning": "voltar-se para, direção",
    "on": [
      "コウ"
    ],
    "kun": [
      "む(く)",
      "む(い)",
      "む(き)"
    ],
    "category": "n3mud"
  },
  {
    "char": "参",
    "meaning": "comparecer, ir",
    "on": [
      "サン",
      "シン"
    ],
    "kun": [
      "まい(る)",
      "まい",
      "まじわる"
    ],
    "category": "n3mud"
  },
  {
    "char": "訪",
    "meaning": "visitar",
    "on": [
      "ホウ"
    ],
    "kun": [
      "おとず(れる)",
      "たず(ねる)",
      "と(う)"
    ],
    "category": "n3mud"
  },
  {
    "char": "防",
    "meaning": "defender, prevenir",
    "on": [
      "ボウ"
    ],
    "kun": [
      "ふせ(ぐ)"
    ],
    "category": "n3mud"
  },
  {
    "char": "放",
    "meaning": "soltar, liberar",
    "on": [
      "ホウ"
    ],
    "kun": [
      "はな(す)",
      "っぱな(し)",
      "はな(つ)"
    ],
    "category": "n3mud"
  },
  {
    "char": "流",
    "meaning": "fluir, corrente",
    "on": [
      "リュウ",
      "ル"
    ],
    "kun": [
      "なが(れる)",
      "なが(れ)",
      "なが(す)"
    ],
    "category": "n3mud"
  },
  {
    "char": "難",
    "meaning": "difícil",
    "on": [
      "ナン"
    ],
    "kun": [
      "かた(い)",
      "がた(い)",
      "むずか(しい)"
    ],
    "category": "n3qua"
  },
  {
    "char": "違",
    "meaning": "diferente, errado",
    "on": [
      "イ"
    ],
    "kun": [
      "ちが(う)",
      "ちが(い)",
      "ちが(える)"
    ],
    "category": "n3qua"
  },
  {
    "char": "確",
    "meaning": "certo, confirmar",
    "on": [
      "カク",
      "コウ"
    ],
    "kun": [
      "たし(か)",
      "たし(かめる)"
    ],
    "category": "n3qua"
  },
  {
    "char": "常",
    "meaning": "sempre, comum",
    "on": [
      "ジョウ"
    ],
    "kun": [
      "つね",
      "とこ"
    ],
    "category": "n3qua"
  },
  {
    "char": "平",
    "meaning": "plano, paz",
    "on": [
      "ヘイ",
      "ビョウ",
      "ヒョウ"
    ],
    "kun": [
      "たい(ら)",
      "たい(らげる)",
      "ひら"
    ],
    "category": "n3qua"
  },
  {
    "char": "独",
    "meaning": "sozinho, único",
    "on": [
      "ドク",
      "トク"
    ],
    "kun": [
      "ひと(り)"
    ],
    "category": "n3qua"
  },
  {
    "char": "無",
    "meaning": "sem, nada",
    "on": [
      "ム",
      "ブ"
    ],
    "kun": [
      "な(い)"
    ],
    "category": "n3qua"
  },
  {
    "char": "全",
    "meaning": "todo, inteiro",
    "on": [
      "ゼン"
    ],
    "kun": [
      "まった(く)",
      "すべ(て)"
    ],
    "category": "n3qua"
  },
  {
    "char": "各",
    "meaning": "cada",
    "on": [
      "カク"
    ],
    "kun": [
      "おのおの"
    ],
    "category": "n3qua"
  },
  {
    "char": "総",
    "meaning": "total, geral",
    "on": [
      "ソウ"
    ],
    "kun": [
      "す(べて)",
      "すべ(て)",
      "ふさ"
    ],
    "category": "n3qua"
  },
  {
    "char": "要",
    "meaning": "necessário, essencial",
    "on": [
      "ヨウ"
    ],
    "kun": [
      "い(る)",
      "かなめ"
    ],
    "category": "n3qua"
  },
  {
    "char": "必",
    "meaning": "sem falta, necessário",
    "on": [
      "ヒツ"
    ],
    "kun": [
      "かなら(ず)"
    ],
    "category": "n3qua"
  },
  {
    "char": "可",
    "meaning": "possível, aprovar",
    "on": [
      "カ",
      "コク"
    ],
    "kun": [
      "べ(き)",
      "べ(し)"
    ],
    "category": "n3qua"
  },
  {
    "char": "優",
    "meaning": "gentil, excelente",
    "on": [
      "ユウ",
      "ウ"
    ],
    "kun": [
      "やさ(しい)",
      "すぐ(れる)",
      "まさ(る)"
    ],
    "category": "n3qua"
  },
  {
    "char": "位",
    "meaning": "posição, grau",
    "on": [
      "イ"
    ],
    "kun": [
      "くらい",
      "ぐらい"
    ],
    "category": "n3abs"
  },
  {
    "char": "域",
    "meaning": "região, área",
    "on": [
      "イキ"
    ],
    "kun": [],
    "category": "n3abs"
  },
  {
    "char": "育",
    "meaning": "criar, crescer",
    "on": [
      "イク"
    ],
    "kun": [
      "そだ(つ)",
      "そだ(ち)",
      "そだ(てる)"
    ],
    "category": "n3abs"
  },
  {
    "char": "果",
    "meaning": "fruto, resultado",
    "on": [
      "カ"
    ],
    "kun": [
      "は(たす)",
      "はた(す)",
      "は(てる)"
    ],
    "category": "n3abs"
  },
  {
    "char": "過",
    "meaning": "passar, exceder",
    "on": [
      "カ"
    ],
    "kun": [
      "す(ぎる)",
      "す(ごす)",
      "あやま(ち)"
    ],
    "category": "n3abs"
  },
  {
    "char": "解",
    "meaning": "soltar, explicar",
    "on": [
      "カイ",
      "ゲ"
    ],
    "kun": [
      "と(く)",
      "と(かす)",
      "と(ける)"
    ],
    "category": "n3abs"
  },
  {
    "char": "害",
    "meaning": "dano",
    "on": [
      "ガイ"
    ],
    "kun": [],
    "category": "n3abs"
  },
  {
    "char": "格",
    "meaning": "categoria, padrão",
    "on": [
      "カク",
      "コウ",
      "キャク"
    ],
    "kun": [],
    "category": "n3abs"
  },
  {
    "char": "革",
    "meaning": "couro, reformar",
    "on": [
      "カク"
    ],
    "kun": [
      "かわ"
    ],
    "category": "n3abs"
  },
  {
    "char": "割",
    "meaning": "dividir, proporção",
    "on": [
      "カツ"
    ],
    "kun": [
      "わ(る)",
      "わり",
      "わ(り)"
    ],
    "category": "n3abs"
  },
  {
    "char": "活",
    "meaning": "vivo, ativo",
    "on": [
      "カツ"
    ],
    "kun": [
      "い(きる)",
      "い(かす)",
      "い(ける)"
    ],
    "category": "n3abs"
  },
  {
    "char": "感",
    "meaning": "sentir, sentimento",
    "on": [
      "カン"
    ],
    "kun": [],
    "category": "n3abs"
  },
  {
    "char": "関",
    "meaning": "ligação, barreira",
    "on": [
      "カン"
    ],
    "kun": [
      "せき",
      "ぜき",
      "かか(わる)"
    ],
    "category": "n3abs"
  },
  {
    "char": "基",
    "meaning": "base",
    "on": [
      "キ"
    ],
    "kun": [
      "もと",
      "もとい"
    ],
    "category": "n3abs"
  },
  {
    "char": "期",
    "meaning": "período, época",
    "on": [
      "キ",
      "ゴ"
    ],
    "kun": [],
    "category": "n3abs"
  },
  {
    "char": "規",
    "meaning": "regra, norma",
    "on": [
      "キ"
    ],
    "kun": [],
    "category": "n3abs"
  },
  {
    "char": "求",
    "meaning": "pedir, procurar",
    "on": [
      "キュウ",
      "グ"
    ],
    "kun": [
      "もと(める)"
    ],
    "category": "n3abs"
  },
  {
    "char": "境",
    "meaning": "fronteira, limite",
    "on": [
      "キョウ",
      "ケイ"
    ],
    "kun": [
      "さかい"
    ],
    "category": "n3abs"
  },
  {
    "char": "経",
    "meaning": "passar (tempo), sutra",
    "on": [
      "ケイ",
      "キョウ",
      "キン"
    ],
    "kun": [
      "へ(る)",
      "た(つ)",
      "たていと"
    ],
    "category": "n3abs"
  },
  {
    "char": "警",
    "meaning": "avisar, alertar",
    "on": [
      "ケイ"
    ],
    "kun": [
      "いまし(める)"
    ],
    "category": "n3abs"
  },
  {
    "char": "件",
    "meaning": "caso, assunto",
    "on": [
      "ケン"
    ],
    "kun": [
      "くだん"
    ],
    "category": "n3abs"
  },
  {
    "char": "原",
    "meaning": "origem, campo",
    "on": [
      "ゲン"
    ],
    "kun": [
      "はら"
    ],
    "category": "n3abs"
  },
  {
    "char": "現",
    "meaning": "atual, aparecer",
    "on": [
      "ゲン"
    ],
    "kun": [
      "あらわ(れる)",
      "あらわ(す)",
      "うつつ"
    ],
    "category": "n3abs"
  },
  {
    "char": "際",
    "meaning": "ocasião, momento",
    "on": [
      "サイ"
    ],
    "kun": [
      "きわ",
      "ぎわ"
    ],
    "category": "n3abs"
  },
  {
    "char": "在",
    "meaning": "estar, existir",
    "on": [
      "ザイ"
    ],
    "kun": [
      "あ(る)"
    ],
    "category": "n3abs"
  },
  {
    "char": "昨",
    "meaning": "passado (ontem)",
    "on": [
      "サク"
    ],
    "kun": [],
    "category": "n3abs"
  },
  {
    "char": "算",
    "meaning": "calcular",
    "on": [
      "サン"
    ],
    "kun": [
      "そろ"
    ],
    "category": "n3abs"
  },
  {
    "char": "価",
    "meaning": "valor, preço",
    "on": [
      "カ",
      "ケ"
    ],
    "kun": [
      "あたい"
    ],
    "category": "n3abs"
  },
  {
    "char": "条",
    "meaning": "artigo, item",
    "on": [
      "ジョウ",
      "チョウ",
      "デキ"
    ],
    "kun": [
      "えだ",
      "すじ"
    ],
    "category": "n3abs"
  },
  {
    "char": "的",
    "meaning": "alvo, \"-tico\"",
    "on": [
      "テキ"
    ],
    "kun": [
      "まと"
    ],
    "category": "n3abs"
  },
  {
    "char": "由",
    "meaning": "motivo",
    "on": [
      "ユ",
      "ユウ",
      "ユイ"
    ],
    "kun": [
      "よし",
      "よ(る)"
    ],
    "category": "n3abs"
  },
  {
    "char": "例",
    "meaning": "exemplo",
    "on": [
      "レイ"
    ],
    "kun": [
      "たと(える)"
    ],
    "category": "n3abs"
  },
  {
    "char": "予",
    "meaning": "de antemão",
    "on": [
      "ヨ",
      "シャ"
    ],
    "kun": [
      "あらかじ(め)"
    ],
    "category": "n3abs"
  },
  {
    "char": "利",
    "meaning": "lucro, eficaz",
    "on": [
      "リ"
    ],
    "kun": [
      "き(く)"
    ],
    "category": "n3abs"
  },
  {
    "char": "率",
    "meaning": "taxa, proporção",
    "on": [
      "ソツ",
      "リツ",
      "シュツ"
    ],
    "kun": [
      "ひき(いる)"
    ],
    "category": "n3abs"
  },
  {
    "char": "領",
    "meaning": "território",
    "on": [
      "リョウ"
    ],
    "kun": [
      "えり"
    ],
    "category": "n3abs"
  },
  {
    "char": "反",
    "meaning": "contra, oposto",
    "on": [
      "ハン",
      "ホン",
      "タン"
    ],
    "kun": [
      "そ(る)",
      "そ(らす)",
      "かえ(す)"
    ],
    "category": "n3abs"
  },
  {
    "char": "比",
    "meaning": "comparar",
    "on": [
      "ヒ"
    ],
    "kun": [
      "くら(べる)"
    ],
    "category": "n3abs"
  },
  {
    "char": "約",
    "meaning": "promessa, cerca de",
    "on": [
      "ヤク"
    ],
    "kun": [
      "つづ(まる)",
      "つづ(める)",
      "つづま(やか)"
    ],
    "category": "n3abs"
  },
  {
    "char": "容",
    "meaning": "conter, aparência",
    "on": [
      "ヨウ"
    ],
    "kun": [
      "い(れる)"
    ],
    "category": "n3abs"
  },
  {
    "char": "両",
    "meaning": "ambos",
    "on": [
      "リョウ"
    ],
    "kun": [
      "てる",
      "ふたつ"
    ],
    "category": "n3abs"
  },
  {
    "char": "和",
    "meaning": "harmonia, estilo japonês",
    "on": [
      "ワ",
      "オ",
      "カ"
    ],
    "kun": [
      "やわ(らぐ)",
      "やわ(らげる)",
      "なご(む)"
    ],
    "category": "n3abs"
  },
  {
    "char": "球",
    "meaning": "bola, esfera",
    "on": [
      "キュウ"
    ],
    "kun": [
      "たま"
    ],
    "category": "n3coi"
  },
  {
    "char": "石",
    "meaning": "pedra",
    "on": [
      "セキ",
      "シャク",
      "コク"
    ],
    "kun": [
      "いし"
    ],
    "category": "n3coi"
  },
  {
    "char": "島",
    "meaning": "ilha",
    "on": [
      "トウ"
    ],
    "kun": [
      "しま"
    ],
    "category": "n3coi"
  },
  {
    "char": "点",
    "meaning": "ponto",
    "on": [
      "テン"
    ],
    "kun": [
      "つ(ける)",
      "つ(く)",
      "た(てる)"
    ],
    "category": "n3coi"
  },
  {
    "char": "線",
    "meaning": "linha",
    "on": [
      "セン"
    ],
    "kun": [
      "すじ"
    ],
    "category": "n3coi"
  },
  {
    "char": "席",
    "meaning": "assento, lugar",
    "on": [
      "セキ"
    ],
    "kun": [
      "むしろ"
    ],
    "category": "n3coi"
  },
  {
    "char": "宅",
    "meaning": "casa, residência",
    "on": [
      "タク"
    ],
    "kun": [],
    "category": "n3coi"
  },
  {
    "char": "米",
    "meaning": "arroz, EUA",
    "on": [
      "ベイ",
      "マイ",
      "メエトル"
    ],
    "kun": [
      "こめ",
      "よね"
    ],
    "category": "n3coi"
  },
  {
    "char": "夫",
    "meaning": "marido",
    "on": [
      "フ",
      "フウ",
      "ブ"
    ],
    "kun": [
      "おっと",
      "それ"
    ],
    "category": "n3coi"
  },
  {
    "char": "身",
    "meaning": "corpo, si mesmo",
    "on": [
      "シン"
    ],
    "kun": [
      "み"
    ],
    "category": "n3coi"
  },
  {
    "char": "神",
    "meaning": "deus, espírito",
    "on": [
      "シン",
      "ジン"
    ],
    "kun": [
      "かみ",
      "かん",
      "こう"
    ],
    "category": "n3coi"
  },
  {
    "char": "象",
    "meaning": "elefante, imagem",
    "on": [
      "ショウ",
      "ゾウ"
    ],
    "kun": [
      "かたど(る)"
    ],
    "category": "n3coi"
  },
  {
    "char": "状",
    "meaning": "situação, carta",
    "on": [
      "ジョウ"
    ],
    "kun": [],
    "category": "n3coi"
  },
  {
    "char": "情",
    "meaning": "sentimento, situação",
    "on": [
      "ジョウ",
      "セイ"
    ],
    "kun": [
      "なさ(け)"
    ],
    "category": "n3coi"
  },
  {
    "char": "式",
    "meaning": "cerimônia, fórmula",
    "on": [
      "シキ"
    ],
    "kun": [],
    "category": "n3coi"
  },
  {
    "char": "実",
    "meaning": "real, fruto",
    "on": [
      "ジツ",
      "シツ"
    ],
    "kun": [
      "み",
      "みの(る)",
      "まこと"
    ],
    "category": "n3coi"
  },
  {
    "char": "数",
    "meaning": "número, contar",
    "on": [
      "スウ",
      "ス",
      "サク"
    ],
    "kun": [
      "かず",
      "かぞ(える)",
      "しばしば"
    ],
    "category": "n3coi"
  },
  {
    "char": "性",
    "meaning": "natureza, sexo",
    "on": [
      "セイ",
      "ショウ"
    ],
    "kun": [
      "さが"
    ],
    "category": "n3coi"
  },
  {
    "char": "成",
    "meaning": "tornar-se, realizar",
    "on": [
      "セイ",
      "ジョウ"
    ],
    "kun": [
      "な(る)",
      "な(す)"
    ],
    "category": "n3coi"
  },
  {
    "char": "治",
    "meaning": "governar, curar",
    "on": [
      "ジ",
      "チ"
    ],
    "kun": [
      "おさ(める)",
      "おさ(まる)",
      "なお(る)"
    ],
    "category": "n3coi"
  },
  {
    "char": "術",
    "meaning": "técnica, arte",
    "on": [
      "ジュツ"
    ],
    "kun": [
      "すべ"
    ],
    "category": "n3coi"
  },
  {
    "char": "歳",
    "meaning": "anos (idade)",
    "on": [
      "サイ",
      "セイ"
    ],
    "kun": [
      "とし",
      "とせ",
      "よわい"
    ],
    "category": "n3coi"
  },
  {
    "char": "指",
    "meaning": "dedo, apontar",
    "on": [
      "シ"
    ],
    "kun": [
      "ゆび",
      "さ(す)",
      "さ(し)"
    ],
    "category": "n3coi"
  },
  {
    "char": "側",
    "meaning": "lado",
    "on": [
      "ソク"
    ],
    "kun": [
      "かわ",
      "がわ",
      "そば"
    ],
    "category": "n3coi"
  },
  {
    "char": "第",
    "meaning": "ordinal (nº)",
    "on": [
      "ダイ",
      "テイ"
    ],
    "kun": [],
    "category": "n3coi"
  },
  {
    "char": "内",
    "meaning": "dentro",
    "on": [
      "ナイ",
      "ダイ"
    ],
    "kun": [
      "うち"
    ],
    "category": "n3coi"
  },
  {
    "char": "番",
    "meaning": "vez, número",
    "on": [
      "バン"
    ],
    "kun": [
      "つが(い)"
    ],
    "category": "n3coi"
  },
  {
    "char": "面",
    "meaning": "rosto, superfície",
    "on": [
      "メン",
      "ベン"
    ],
    "kun": [
      "おも",
      "おもて",
      "つら"
    ],
    "category": "n3coi"
  },
  {
    "char": "決",
    "meaning": "decidir",
    "on": [
      "ケツ"
    ],
    "kun": [
      "き(める)",
      "ぎ(め)",
      "き(まる)"
    ],
    "category": "n3dec"
  },
  {
    "char": "結",
    "meaning": "atar, concluir",
    "on": [
      "ケツ",
      "ケチ"
    ],
    "kun": [
      "むす(ぶ)",
      "ゆ(う)",
      "ゆ(わえる)"
    ],
    "category": "n3dec"
  },
  {
    "char": "選",
    "meaning": "escolher",
    "on": [
      "セン"
    ],
    "kun": [
      "えら(ぶ)",
      "え(る)",
      "よ(る)"
    ],
    "category": "n3dec"
  },
  {
    "char": "断",
    "meaning": "cortar, recusar",
    "on": [
      "ダン"
    ],
    "kun": [
      "た(つ)",
      "ことわ(る)",
      "さだ(める)"
    ],
    "category": "n3dec"
  },
  {
    "char": "定",
    "meaning": "fixar, determinar",
    "on": [
      "テイ",
      "ジョウ"
    ],
    "kun": [
      "さだ(める)",
      "さだ(まる)",
      "さだ(か)"
    ],
    "category": "n3dec"
  },
  {
    "char": "勝",
    "meaning": "vencer",
    "on": [
      "ショウ"
    ],
    "kun": [
      "か(つ)",
      "が(ち)",
      "まさ(る)"
    ],
    "category": "n3dec"
  },
  {
    "char": "収",
    "meaning": "recolher, guardar",
    "on": [
      "シュウ"
    ],
    "kun": [
      "おさ(める)",
      "おさ(まる)"
    ],
    "category": "n3dec"
  },
  {
    "char": "消",
    "meaning": "apagar, sumir",
    "on": [
      "ショウ"
    ],
    "kun": [
      "き(える)",
      "け(す)"
    ],
    "category": "n3dec"
  },
  {
    "char": "直",
    "meaning": "reto, consertar",
    "on": [
      "チョク",
      "ジキ",
      "ジカ"
    ],
    "kun": [
      "ただ(ちに)",
      "なお(す)",
      "なお(る)"
    ],
    "category": "n3dec"
  },
  {
    "char": "置",
    "meaning": "colocar, deixar",
    "on": [
      "チ"
    ],
    "kun": [
      "お(く)",
      "お(き)"
    ],
    "category": "n3dec"
  },
  {
    "char": "展",
    "meaning": "expandir, exibir",
    "on": [
      "テン"
    ],
    "kun": [],
    "category": "n3dec"
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
  },
  {
    "id": "n3gov",
    "label": "N3: Governo e leis",
    "chars": "政党府官局軍公権税制法州武戦争勢"
  },
  {
    "id": "n3org",
    "label": "N3: Trabalho e organização",
    "chars": "務職役係委営部副設任団組機構資費備輸農労"
  },
  {
    "id": "n3com",
    "label": "N3: Comunicação e ideias",
    "chars": "議談論述告報信念認示表記疑案想判調査検"
  },
  {
    "id": "n3rel",
    "label": "N3: Relações e ações",
    "chars": "協共供交連相対助与受支保補取付配投打導得演応能当"
  },
  {
    "id": "n3mud",
    "label": "N3: Mudança e movimento",
    "chars": "変化改加増減残続済初最再次向参訪防放流"
  },
  {
    "id": "n3qua",
    "label": "N3: Qualidades e estados",
    "chars": "難違確常平独無全各総要必可優"
  },
  {
    "id": "n3abs",
    "label": "N3: Coisas e situações",
    "chars": "位域育果過解害格革割活感関基期規求境経警件原現際在昨算価条的由例予利率領反比約容両和"
  },
  {
    "id": "n3coi",
    "label": "N3: Objetos, lugares e pessoas",
    "chars": "球石島点線席宅米夫身神象状情式実数性成治術歳指側第内番面"
  },
  {
    "id": "n3dec",
    "label": "N3: Decisões e resultados",
    "chars": "決結選断定勝収消直置展"
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
  },
  {
    "id": "kanji:L54",
    "title": "Governo e leis 1",
    "items": [
      "政",
      "党",
      "府",
      "官",
      "局",
      "軍"
    ]
  },
  {
    "id": "kanji:L55",
    "title": "Governo e leis 2",
    "items": [
      "公",
      "権",
      "税",
      "制",
      "法",
      "州"
    ]
  },
  {
    "id": "kanji:L56",
    "title": "Governo e leis 3",
    "items": [
      "武",
      "戦",
      "争",
      "勢"
    ]
  },
  {
    "id": "kanji:L57",
    "title": "Trabalho e organização 1",
    "items": [
      "務",
      "職",
      "役",
      "係",
      "委"
    ]
  },
  {
    "id": "kanji:L58",
    "title": "Trabalho e organização 2",
    "items": [
      "営",
      "部",
      "副",
      "設",
      "任"
    ]
  },
  {
    "id": "kanji:L59",
    "title": "Trabalho e organização 3",
    "items": [
      "団",
      "組",
      "機",
      "構",
      "資"
    ]
  },
  {
    "id": "kanji:L60",
    "title": "Trabalho e organização 4",
    "items": [
      "費",
      "備",
      "輸",
      "農",
      "労"
    ]
  },
  {
    "id": "kanji:L61",
    "title": "Comunicação e ideias 1",
    "items": [
      "議",
      "談",
      "論",
      "述",
      "告"
    ]
  },
  {
    "id": "kanji:L62",
    "title": "Comunicação e ideias 2",
    "items": [
      "報",
      "信",
      "念",
      "認",
      "示"
    ]
  },
  {
    "id": "kanji:L63",
    "title": "Comunicação e ideias 3",
    "items": [
      "表",
      "記",
      "疑",
      "案",
      "想"
    ]
  },
  {
    "id": "kanji:L64",
    "title": "Comunicação e ideias 4",
    "items": [
      "判",
      "調",
      "査",
      "検"
    ]
  },
  {
    "id": "kanji:L65",
    "title": "Relações e ações 1",
    "items": [
      "協",
      "共",
      "供",
      "交",
      "連",
      "相"
    ]
  },
  {
    "id": "kanji:L66",
    "title": "Relações e ações 2",
    "items": [
      "対",
      "助",
      "与",
      "受",
      "支",
      "保"
    ]
  },
  {
    "id": "kanji:L67",
    "title": "Relações e ações 3",
    "items": [
      "補",
      "取",
      "付",
      "配",
      "投",
      "打"
    ]
  },
  {
    "id": "kanji:L68",
    "title": "Relações e ações 4",
    "items": [
      "導",
      "得",
      "演",
      "応",
      "能",
      "当"
    ]
  },
  {
    "id": "kanji:L69",
    "title": "Mudança e movimento 1",
    "items": [
      "変",
      "化",
      "改",
      "加",
      "増"
    ]
  },
  {
    "id": "kanji:L70",
    "title": "Mudança e movimento 2",
    "items": [
      "減",
      "残",
      "続",
      "済",
      "初"
    ]
  },
  {
    "id": "kanji:L71",
    "title": "Mudança e movimento 3",
    "items": [
      "最",
      "再",
      "次",
      "向",
      "参"
    ]
  },
  {
    "id": "kanji:L72",
    "title": "Mudança e movimento 4",
    "items": [
      "訪",
      "防",
      "放",
      "流"
    ]
  },
  {
    "id": "kanji:L73",
    "title": "Qualidades e estados 1",
    "items": [
      "難",
      "違",
      "確",
      "常",
      "平"
    ]
  },
  {
    "id": "kanji:L74",
    "title": "Qualidades e estados 2",
    "items": [
      "独",
      "無",
      "全",
      "各",
      "総"
    ]
  },
  {
    "id": "kanji:L75",
    "title": "Qualidades e estados 3",
    "items": [
      "要",
      "必",
      "可",
      "優"
    ]
  },
  {
    "id": "kanji:L76",
    "title": "Coisas e situações 1",
    "items": [
      "位",
      "域",
      "育",
      "果",
      "過",
      "解"
    ]
  },
  {
    "id": "kanji:L77",
    "title": "Coisas e situações 2",
    "items": [
      "害",
      "格",
      "革",
      "割",
      "活",
      "感"
    ]
  },
  {
    "id": "kanji:L78",
    "title": "Coisas e situações 3",
    "items": [
      "関",
      "基",
      "期",
      "規",
      "求",
      "境"
    ]
  },
  {
    "id": "kanji:L79",
    "title": "Coisas e situações 4",
    "items": [
      "経",
      "警",
      "件",
      "原",
      "現",
      "際"
    ]
  },
  {
    "id": "kanji:L80",
    "title": "Coisas e situações 5",
    "items": [
      "在",
      "昨",
      "算",
      "価",
      "条",
      "的"
    ]
  },
  {
    "id": "kanji:L81",
    "title": "Coisas e situações 6",
    "items": [
      "由",
      "例",
      "予",
      "利",
      "率",
      "領"
    ]
  },
  {
    "id": "kanji:L82",
    "title": "Coisas e situações 7",
    "items": [
      "反",
      "比",
      "約",
      "容",
      "両",
      "和"
    ]
  },
  {
    "id": "kanji:L83",
    "title": "Objetos, lugares e pessoas 1",
    "items": [
      "球",
      "石",
      "島",
      "点",
      "線",
      "席"
    ]
  },
  {
    "id": "kanji:L84",
    "title": "Objetos, lugares e pessoas 2",
    "items": [
      "宅",
      "米",
      "夫",
      "身",
      "神",
      "象"
    ]
  },
  {
    "id": "kanji:L85",
    "title": "Objetos, lugares e pessoas 3",
    "items": [
      "状",
      "情",
      "式",
      "実",
      "数",
      "性"
    ]
  },
  {
    "id": "kanji:L86",
    "title": "Objetos, lugares e pessoas 4",
    "items": [
      "成",
      "治",
      "術",
      "歳",
      "指",
      "側"
    ]
  },
  {
    "id": "kanji:L87",
    "title": "Objetos, lugares e pessoas 5",
    "items": [
      "第",
      "内",
      "番",
      "面"
    ]
  },
  {
    "id": "kanji:L88",
    "title": "Decisões e resultados 1",
    "items": [
      "決",
      "結",
      "選",
      "断",
      "定",
      "勝"
    ]
  },
  {
    "id": "kanji:L89",
    "title": "Decisões e resultados 2",
    "items": [
      "収",
      "消",
      "直",
      "置",
      "展"
    ]
  }
];
