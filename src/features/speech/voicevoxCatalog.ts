// Gerado por scripts/voicevox/catalog.mjs (não edite à mão): as vozes do VOICEVOX para baixar.
// Fontes: https://github.com/VOICEVOX/voicevox_vvm/releases/tag/0.17.0 e as páginas de personagem de https://voicevox.hiroshiba.jp/product/.

/** Um personagem, como o site oficial o apresenta. */
export interface VoiceSpeaker {
  /** Nome em japonês, igual ao que o motor devolve. */
  name: string;
  /** Endereço no site oficial (/product/<slug>/); o nome romanizado sai dele. */
  slug: string;
  /** Descrição da voz, em japonês, como no site (vazia ou só "声" quando o site ainda não tem). */
  voiceJa: string;
  /** Termos de uso do personagem, do site oficial. */
  termsUrl: string;
}

export interface VoicePack {
  /** Nome do arquivo na release, por exemplo "0.vvm". */
  file: string;
  /** Tamanho exato, conferido depois do download. */
  bytes: number;
  /** SHA-256 publicado pela release oficial, conferido depois do download (hexadecimal, minúsculas). */
  sha256: string;
  /** Os personagens do arquivo e os estilos de cada um ([id, nome em japonês]). */
  voices: readonly { speaker: string; styles: readonly (readonly [number, string])[] }[];
}

export const VOICE_PACKS_RELEASE = '0.17.0';

export const VOICE_PACKS: readonly VoicePack[] = [
  { file: '0.vvm', bytes: 59308488, sha256: 'ecd35374d4182cd883cba5040376f7f888cc6ba248b1c2f4cea07cdb34bb1318', voices: [{ speaker: "四国めたん", styles: [[2, "ノーマル"], [0, "あまあま"], [6, "ツンツン"], [4, "セクシー"]] }, { speaker: "ずんだもん", styles: [[3, "ノーマル"], [1, "あまあま"], [7, "ツンツン"], [5, "セクシー"]] }, { speaker: "春日部つむぎ", styles: [[8, "ノーマル"]] }, { speaker: "雨晴はう", styles: [[10, "ノーマル"]] }] },
  { file: '1.vvm', bytes: 60571189, sha256: 'e16ffb6fc3e13e1be4ebc3831cc39df019cbac96b28bbed7653a4bb51c4d7d5d', voices: [{ speaker: "冥鳴ひまり", styles: [[14, "ノーマル"]] }] },
  { file: '2.vvm', bytes: 59308683, sha256: '2eb9a67e3bce09a7f209eb21a56926fa94476352b6ce874c9acd8f465871a4f4', voices: [{ speaker: "九州そら", styles: [[16, "ノーマル"], [15, "あまあま"], [18, "ツンツン"], [17, "セクシー"]] }] },
  { file: '3.vvm', bytes: 63346737, sha256: '54aeea4aa51c56e87acc1d406fafc2bd980414c36ebceae0830340b83791d3d7', voices: [{ speaker: "波音リツ", styles: [[9, "ノーマル"], [65, "クイーン"]] }, { speaker: "中国うさぎ", styles: [[61, "ノーマル"], [62, "おどろき"], [63, "こわがり"], [64, "へろへろ"]] }] },
  { file: '4.vvm', bytes: 59304904, sha256: '716d2900f6b93ba22119af0e236c32fdbf6fea81c519b5d4830afcb2db349522', voices: [{ speaker: "玄野武宏", styles: [[11, "ノーマル"]] }, { speaker: "剣崎雌雄", styles: [[21, "ノーマル"]] }] },
  { file: '5.vvm', bytes: 57611312, sha256: '67451cdbc3e473dba4d09c878903a656be9e7030cb5901155e5a51634ed8b318', voices: [{ speaker: "四国めたん", styles: [[36, "ささやき"], [37, "ヒソヒソ"]] }, { speaker: "ずんだもん", styles: [[22, "ささやき"], [38, "ヒソヒソ"]] }, { speaker: "九州そら", styles: [[19, "ささやき"]] }] },
  { file: '6.vvm', bytes: 59304854, sha256: '975d29f225cf605b0e75a0bb66f3f952821b16bbfa49a3a9b96a7688bf21abbe', voices: [{ speaker: "No.7", styles: [[29, "ノーマル"], [30, "アナウンス"], [31, "読み聞かせ"]] }] },
  { file: '7.vvm', bytes: 58326212, sha256: 'd8e3bc97610805901fb7647226a233fe15056f30d1f91d270895c60198625569', voices: [{ speaker: "後鬼", styles: [[27, "人間ver."], [28, "ぬいぐるみver."]] }] },
  { file: '8.vvm', bytes: 59304782, sha256: '0625c497f1f22be87d03281676c0292d834e262338e70ccaf83af7f34aa83b99', voices: [{ speaker: "WhiteCUL", styles: [[23, "ノーマル"], [24, "たのしい"], [25, "かなしい"], [26, "びえーん"]] }] },
  { file: '9.vvm', bytes: 58328935, sha256: '3dca586c0aa553772419bdc090045f9ea73bd9ed82b88b7dd5737bdd6eddee29', voices: [{ speaker: "白上虎太郎", styles: [[12, "ふつう"], [32, "わーい"], [33, "びくびく"], [34, "おこ"], [35, "びえーん"]] }] },
  { file: '10.vvm', bytes: 58327087, sha256: 'dea2104b05391fdc37d8c27b4104569d5bff3a52bcb9e4077bb2b1f951c7524a', voices: [{ speaker: "玄野武宏", styles: [[39, "喜び"], [40, "ツンギレ"], [41, "悲しみ"]] }, { speaker: "ちび式じい", styles: [[42, "ノーマル"]] }] },
  { file: '11.vvm', bytes: 61687324, sha256: '3fb0c0f12ec37fda568020509d6e63a0a6b5d6edf3c2330508c6bf4e3eeb8b82', voices: [{ speaker: "櫻歌ミコ", styles: [[43, "ノーマル"], [44, "第二形態"], [45, "ロリ"]] }, { speaker: "ナースロボ＿タイプＴ", styles: [[47, "ノーマル"], [48, "楽々"], [49, "恐怖"], [50, "内緒話"]] }] },
  { file: '12.vvm', bytes: 59305189, sha256: '894464a6cbf59bdf930b8406097f44d2f25bb762db5bc71c9e9c31e1f904c715', voices: [{ speaker: "†聖騎士 紅桜†", styles: [[51, "ノーマル"]] }, { speaker: "雀松朱司", styles: [[52, "ノーマル"]] }, { speaker: "麒ヶ島宗麟", styles: [[53, "ノーマル"]] }] },
  { file: '13.vvm', bytes: 61686018, sha256: 'df381d94df92992c4170017d2f1ca386f7a5c3cb559e1bd0578f899910529e29', voices: [{ speaker: "春歌ナナ", styles: [[54, "ノーマル"]] }, { speaker: "猫使アル", styles: [[55, "ノーマル"], [56, "おちつき"], [57, "うきうき"]] }, { speaker: "猫使ビィ", styles: [[58, "ノーマル"], [59, "おちつき"], [60, "人見知り"]] }] },
  { file: '14.vvm', bytes: 66281498, sha256: '63cbabeb29ee9a4837a2462c77fc5cecd380abb5bdbcda4c40b3c34f8f2f9d38', voices: [{ speaker: "栗田まろん", styles: [[67, "ノーマル"]] }, { speaker: "あいえるたん", styles: [[68, "ノーマル"]] }, { speaker: "満別花丸", styles: [[69, "ノーマル"], [70, "元気"], [71, "ささやき"], [72, "ぶりっ子"], [73, "ボーイ"]] }, { speaker: "琴詠ニア", styles: [[74, "ノーマル"]] }] },
  { file: '15.vvm', bytes: 67265793, sha256: 'c29b0c0f8e332fcedc2a5de4b4426feb75fc9f587c314da99af8dbc964287221', voices: [{ speaker: "ずんだもん", styles: [[75, "ヘロヘロ"], [76, "なみだめ"]] }, { speaker: "青山龍星", styles: [[13, "ノーマル"], [81, "熱血"], [82, "不機嫌"], [83, "喜び"], [84, "しっとり"], [85, "かなしみ"], [86, "囁き"]] }, { speaker: "もち子さん", styles: [[20, "ノーマル"], [66, "セクシー／あん子"], [77, "泣き"], [78, "怒り"], [79, "喜び"], [80, "のんびり"]] }, { speaker: "小夜/SAYO", styles: [[46, "ノーマル"]] }] },
  { file: '16.vvm', bytes: 59303880, sha256: '545a2365dbb3f457d2ee9e24b45313968aa4c8351d513f3a79d9922a17569cab', voices: [{ speaker: "後鬼", styles: [[87, "人間（怒り）ver."], [88, "鬼ver."]] }] },
  { file: '17.vvm', bytes: 59304258, sha256: 'eb96b6c71fa80f905a86ec7f221f10fbf31f84c0675f919a25d198d8561e3f9a', voices: [{ speaker: "Voidoll", styles: [[89, "ノーマル"]] }] },
  { file: '18.vvm', bytes: 62519486, sha256: '33e5177ebbe1ec5829769c1017f1294641dbf22c43cd2af4896ae0738a14ed13', voices: [{ speaker: "ぞん子", styles: [[90, "ノーマル"], [91, "低血圧"], [92, "覚醒"], [93, "実況風"]] }, { speaker: "中部つるぎ", styles: [[94, "ノーマル"], [95, "怒り"], [96, "ヒソヒソ"], [97, "おどおど"], [98, "絶望と敗北"]] }] },
  { file: '19.vvm', bytes: 60021787, sha256: 'b9e1c5ddd5b418a6f1d6377d7d00df32c682b580ac9d326675ba4e0b7bb4fc3d', voices: [{ speaker: "離途", styles: [[99, "ノーマル"], [101, "シリアス"]] }, { speaker: "黒沢冴白", styles: [[100, "ノーマル"]] }] },
  { file: '20.vvm', bytes: 60535324, sha256: 'fcfa6438d71df86c2013a8f285224fb96b632c4f07486d9855474f3df9a50a09', voices: [{ speaker: "ユーレイちゃん", styles: [[102, "ノーマル"], [103, "甘々"], [104, "哀しみ"], [105, "ささやき"], [106, "ツクモちゃん"]] }] },
  { file: '21.vvm', bytes: 63195138, sha256: 'f6b937e953409a65f3d7609335a4dfd19fdd9458be27d988bdd8296034adfaf6', voices: [{ speaker: "猫使アル", styles: [[110, "つよつよ"], [111, "へろへろ"]] }, { speaker: "猫使ビィ", styles: [[112, "つよつよ"]] }, { speaker: "東北ずん子", styles: [[107, "ノーマル"]] }, { speaker: "東北きりたん", styles: [[108, "ノーマル"]] }, { speaker: "東北イタコ", styles: [[109, "ノーマル"]] }] },
  { file: '22.vvm', bytes: 63409684, sha256: '1c580f93caaa89f517d2431ee82519eab39c389d1bfb8791035f5c5af71eb17d', voices: [{ speaker: "あんこもん", styles: [[113, "ノーマル"], [114, "つよつよ"], [115, "よわよわ"], [116, "けだるげ"]] }] },
  { file: '23.vvm', bytes: 60022581, sha256: '4e09d14a73e5c3e6ec237cf37aae1ce44464e0d4b8a36e7580cb7b475f494dda', voices: [{ speaker: "あんこもん", styles: [[117, "ささやき"]] }] },
  { file: '24.vvm', bytes: 60024319, sha256: '3e62f5ce0ac345ed74c0e3bc9051cd99baaed37389e33f64195c9e0e49f34594', voices: [{ speaker: "夜語トバリ", styles: [[118, "ノーマル"], [119, "明るい"], [120, "哀しみ"], [121, "呆れ"]] }, { speaker: "暁記ミタマ", styles: [[122, "ノーマル"], [123, "怒り"], [124, "哀しみ"], [125, "ささやき"]] }, { speaker: "里石ユカ", styles: [[126, "つぼみ"]] }] },
];

export const VOICE_SPEAKERS: readonly VoiceSpeaker[] = [
  { name: "四国めたん", slug: 'shikoku_metan', voiceJa: "はっきりした芯のある声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "ずんだもん", slug: 'zundamon', voiceJa: "子供っぽい高めの声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "春日部つむぎ", slug: 'kasukabe_tsumugi', voiceJa: "元気な明るい声", termsUrl: "https://tsumugi-official.studio.site/rule" },
  { name: "雨晴はう", slug: 'amehare_hau', voiceJa: "優しく可愛い声", termsUrl: "https://amehau.com/?page_id=225" },
  { name: "冥鳴ひまり", slug: 'meimei_himari', voiceJa: "柔らかく温かい声", termsUrl: "https://meimeihimari.wixsite.com/himari/terms-of-use" },
  { name: "九州そら", slug: 'kyushu_sora', voiceJa: "気品のある大人な声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "波音リツ", slug: 'namine_ritsu', voiceJa: "低めのクールな声", termsUrl: "http://canon-voice.com/kiyaku.html" },
  { name: "中国うさぎ", slug: 'chugoku_usagi', voiceJa: "幽玄で初々しい声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "玄野武宏", slug: 'kurono_takehiro', voiceJa: "爽やかな青年の声", termsUrl: "https://www.virvoxproject.com/voicevoxの利用規約" },
  { name: "剣崎雌雄", slug: 'kenzaki_mesuo', voiceJa: "安心感のある落ち着いた声", termsUrl: "https://frontier.creatia.cc/fanclubs/413/posts/4507" },
  { name: "No.7", slug: 'number_seven', voiceJa: "しっかりした凛々しい声", termsUrl: "https://voiceseven.com/#j0200" },
  { name: "後鬼", slug: 'goki', voiceJa: "包容力のある奥ゆかしい声", termsUrl: "https://ついなちゃん.com/voicevox_terms/" },
  { name: "WhiteCUL", slug: 'white_cul', voiceJa: "聞き心地のよい率直な声", termsUrl: "https://www.whitecul.com/guideline" },
  { name: "白上虎太郎", slug: 'shirakami_kotarou', voiceJa: "声変わり直後の少年の声", termsUrl: "https://www.virvoxproject.com/voicevoxの利用規約" },
  { name: "ちび式じい", slug: 'chibishikiji', voiceJa: "親しみのある嗄れ声", termsUrl: "https://docs.google.com/presentation/d/1AcD8zXkfzKFf2ertHwWRwJuQXjNnijMxhz7AJzEkaI4" },
  { name: "櫻歌ミコ", slug: 'ouka_miko', voiceJa: "かわいらしい少女の声", termsUrl: "https://voicevox35miko.studio.site/rule" },
  { name: "ナースロボ＿タイプＴ", slug: 'nurserobo_typet', voiceJa: "冷静で慎み深い声", termsUrl: "https://www.krnr.top/rules" },
  { name: "†聖騎士 紅桜†", slug: 'horinaito_benizakura', voiceJa: "快活でハキハキした声", termsUrl: "https://commons.nicovideo.jp/material/nc296132" },
  { name: "雀松朱司", slug: 'wakamatsu_akashi', voiceJa: "物静かで安定した声", termsUrl: "https://www.virvoxproject.com/voicevoxの利用規約" },
  { name: "麒ヶ島宗麟", slug: 'kigashima_sourin', voiceJa: "渋いおじさん声", termsUrl: "https://www.virvoxproject.com/voicevoxの利用規約" },
  { name: "春歌ナナ", slug: 'haruka_nana', voiceJa: "はつらつとした力強い声", termsUrl: "https://nanahira.jp/haruka_nana/guideline.html" },
  { name: "猫使アル", slug: 'nekotsuka_aru', voiceJa: "厚みのある気さくな声", termsUrl: "https://nekotukarb.wixsite.com/nekonohako/利用規約" },
  { name: "猫使ビィ", slug: 'nekotsuka_bi', voiceJa: "ピュアであどけない声", termsUrl: "https://nekotukarb.wixsite.com/nekonohako/利用規約" },
  { name: "栗田まろん", slug: 'kurita_maron', voiceJa: "深みのある中性的な声", termsUrl: "https://aivoice.jp/character/maron/" },
  { name: "あいえるたん", slug: 'aierutan', voiceJa: "心地よい物柔らかな声", termsUrl: "https://www.infiniteloop.co.jp/special/iltan/terms/" },
  { name: "満別花丸", slug: 'manbetsu_hanamaru', voiceJa: "生き生きとした際立つ声", termsUrl: "https://100hanamaru.wixsite.com/manbetsu-hanamaru/rule" },
  { name: "琴詠ニア", slug: 'kotoyomi_nia', voiceJa: "滑らかで無機質な声", termsUrl: "https://commons.nicovideo.jp/works/nc315435" },
  { name: "青山龍星", slug: 'aoyama_ryusei', voiceJa: "重厚で低音な声", termsUrl: "https://www.virvoxproject.com/voicevoxの利用規約" },
  { name: "もち子さん", slug: 'mochikosan', voiceJa: "明瞭で穏やかな声", termsUrl: "https://vtubermochio.wixsite.com/mochizora/利用規約" },
  { name: "小夜/SAYO", slug: 'sayo', voiceJa: "和やかで温厚な声", termsUrl: "https://316soramegu.wixsite.com/sayo-official/guideline" },
  { name: "Voidoll", slug: 'voidoll', voiceJa: "慎ましやかで電子的な声", termsUrl: "https://blog.nicovideo.jp/niconews/224589.html" },
  { name: "ぞん子", slug: 'zonko', voiceJa: "熱血的でありありとした声", termsUrl: "https://zonko.zone-energy.jp/guideline" },
  { name: "中部つるぎ", slug: 'chubu_tsurugi', voiceJa: "凛然とした存在感のある声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "離途", slug: 'rito', voiceJa: "包み込む息遣いな声", termsUrl: "https://litmus9.com/#/voicebank#rules" },
  { name: "黒沢冴白", slug: 'kurosawa_kohaku', voiceJa: "強気で張りのある声", termsUrl: "https://www.virvoxproject.com/voicevoxの利用規約" },
  { name: "ユーレイちゃん", slug: 'yureichan', voiceJa: "柔和な揺蕩う声", termsUrl: "https://u-stella.co.jp/voicevox-ure-chan-tucumo-terms-of-use/" },
  { name: "東北ずん子", slug: 'tohoku_zunko', voiceJa: "しとやかで愛嬌のある声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "東北きりたん", slug: 'tohoku_kiritan', voiceJa: "淡麗でつづまやかな声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "東北イタコ", slug: 'tohoku_itako', voiceJa: "雅やかで余韻のある声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "あんこもん", slug: 'ankomon', voiceJa: "抑えめで負けず嫌いな声", termsUrl: "https://zunko.jp/con_ongen_kiyaku.html" },
  { name: "夜語トバリ", slug: 'yogatari_tobari', voiceJa: "理知的で輪郭のある声", termsUrl: "https://yogataritobari.studio.site/#rules" },
  { name: "暁記ミタマ", slug: 'akatsuki_mitama', voiceJa: "儚げで浮遊感のある声", termsUrl: "https://yogataritobari.studio.site/#rules" },
  { name: "里石ユカ", slug: 'satoishi_yuka', voiceJa: "声", termsUrl: "https://satoishiyuka.wixsite.com/satoishi/kiyaku" },
];
