// Gerado por scripts/voicevox/catalog.mjs (não edite à mão): arquivos de voz do VOICEVOX para baixar.
// Fonte: https://github.com/VOICEVOX/voicevox_vvm/releases/tag/0.17.0

export interface VoicePack {
  /** Nome do arquivo na release, por exemplo "0.vvm". */
  file: string;
  /** Tamanho exato, conferido depois do download. */
  bytes: number;
  /** Personagens que têm algum estilo neste arquivo. */
  speakers: readonly string[];
  /** Ids dos estilos (personagem + tom) que o arquivo traz. */
  styles: readonly number[];
}

export const VOICE_PACKS_RELEASE = '0.17.0';

export const VOICE_PACKS: readonly VoicePack[] = [
  { file: '0.vvm', bytes: 59308488, speakers: ["四国めたん","ずんだもん","春日部つむぎ","雨晴はう"], styles: [2, 0, 6, 4, 3, 1, 7, 5, 8, 10] },
  { file: '1.vvm', bytes: 60571189, speakers: ["冥鳴ひまり"], styles: [14] },
  { file: '2.vvm', bytes: 59308683, speakers: ["九州そら"], styles: [16, 15, 18, 17] },
  { file: '3.vvm', bytes: 63346737, speakers: ["波音リツ","中国うさぎ"], styles: [9, 65, 61, 62, 63, 64] },
  { file: '4.vvm', bytes: 59304904, speakers: ["玄野武宏","剣崎雌雄"], styles: [11, 21] },
  { file: '5.vvm', bytes: 57611312, speakers: ["四国めたん","ずんだもん","九州そら"], styles: [36, 37, 22, 38, 19] },
  { file: '6.vvm', bytes: 59304854, speakers: ["No.7"], styles: [29, 30, 31] },
  { file: '7.vvm', bytes: 58326212, speakers: ["後鬼"], styles: [27, 28] },
  { file: '8.vvm', bytes: 59304782, speakers: ["WhiteCUL"], styles: [23, 24, 25, 26] },
  { file: '9.vvm', bytes: 58328935, speakers: ["白上虎太郎"], styles: [12, 32, 33, 34, 35] },
  { file: '10.vvm', bytes: 58327087, speakers: ["玄野武宏","ちび式じい"], styles: [39, 40, 41, 42] },
  { file: '11.vvm', bytes: 61687324, speakers: ["櫻歌ミコ","ナースロボ＿タイプＴ"], styles: [43, 44, 45, 47, 48, 49, 50] },
  { file: '12.vvm', bytes: 59305189, speakers: ["†聖騎士 紅桜†","雀松朱司","麒ヶ島宗麟"], styles: [51, 52, 53] },
  { file: '13.vvm', bytes: 61686018, speakers: ["春歌ナナ","猫使アル","猫使ビィ"], styles: [54, 55, 56, 57, 58, 59, 60] },
  { file: '14.vvm', bytes: 66281498, speakers: ["栗田まろん","あいえるたん","満別花丸","琴詠ニア"], styles: [67, 68, 69, 70, 71, 72, 73, 74] },
  { file: '15.vvm', bytes: 67265793, speakers: ["ずんだもん","青山龍星","もち子さん","小夜/SAYO"], styles: [75, 76, 13, 81, 82, 83, 84, 85, 86, 20, 66, 77, 78, 79, 80, 46] },
  { file: '16.vvm', bytes: 59303880, speakers: ["後鬼"], styles: [87, 88] },
  { file: '17.vvm', bytes: 59304258, speakers: ["Voidoll"], styles: [89] },
  { file: '18.vvm', bytes: 62519486, speakers: ["ぞん子","中部つるぎ"], styles: [90, 91, 92, 93, 94, 95, 96, 97, 98] },
  { file: '19.vvm', bytes: 60021787, speakers: ["離途","黒沢冴白"], styles: [99, 101, 100] },
  { file: '20.vvm', bytes: 60535324, speakers: ["ユーレイちゃん"], styles: [102, 103, 104, 105, 106] },
  { file: '21.vvm', bytes: 63195138, speakers: ["猫使アル","猫使ビィ","東北ずん子","東北きりたん","東北イタコ"], styles: [110, 111, 112, 107, 108, 109] },
  { file: '22.vvm', bytes: 63409684, speakers: ["あんこもん"], styles: [113, 114, 115, 116] },
  { file: '23.vvm', bytes: 60022581, speakers: ["あんこもん"], styles: [117] },
  { file: '24.vvm', bytes: 60024319, speakers: ["夜語トバリ","暁記ミタマ","里石ユカ"], styles: [118, 119, 120, 121, 122, 123, 124, 125, 126] },
];
