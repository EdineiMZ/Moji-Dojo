// Palavras da Casa do Mochi que as listas do N5, do N4 e do N3 ainda não tinham (cômodos e móveis). Escritas à mão a partir de
// palavras comuns do dia a dia; a classe vem do JMdict (npm run build-pos). Os significados em português foram escritos por IA e
// ainda não foram revisados por um falante. Ver src/content/LICENSE.md.
import type { SourceWord } from './types';

const GROUP = 'Casa do Mochi';

const word = (jp: string, reading: string, meaning: string, en: string): SourceWord => ({ jp, reading, meaning, en, group: GROUP });

export const HOUSE_WORDS: readonly SourceWord[] = [
  word('寝室', 'しんしつ', 'quarto de dormir', 'bedroom'),
  word('ベランダ', 'ベランダ', 'varanda', 'veranda, balcony'),
  word('絨毯', 'じゅうたん', 'tapete', 'carpet, rug'),
  word('手すり', 'てすり', 'corrimão; grade de apoio', 'handrail, railing'),
  word('風鈴', 'ふうりん', 'sininho de vento', 'wind chime'),
  word('植木鉢', 'うえきばち', 'vaso de planta', 'flowerpot'),
  word('灯籠', 'とうろう', 'lanterna de pedra', 'lantern (stone, hanging)'),
  word('こたつ', 'こたつ', 'kotatsu (mesa baixa com cobertor aquecido)', 'kotatsu'),
  word('座布団', 'ざぶとん', 'almofada de chão', 'floor cushion'),
  word('竹', 'たけ', 'bambu', 'bamboo'),
  word('アヒル', 'アヒル', 'pato', 'duck'),
  word('浴槽', 'よくそう', 'banheira', 'bathtub'),
  word('桶', 'おけ', 'balde de madeira', 'bucket, tub'),
  word('花壇', 'かだん', 'canteiro de flores', 'flower bed'),
  word('ランプ', 'ランプ', 'lâmpada; abajur', 'lamp'),
  word('提灯', 'ちょうちん', 'lanterna de papel', 'paper lantern'),
];
