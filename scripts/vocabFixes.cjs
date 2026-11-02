// Correções das listas JLPT (scripts/vocab-n*/), conferidas contra o JMdict (EDRDG, CC BY-SA 4.0) na auditoria de 2026-11-01
// (docs/auditoria-opus.md). Os CSVs vêm de uma lista aberta e não são editados; as correções ficam aqui e são aplicadas por
// scripts/build-n1.mjs a build-n5.mjs. É CommonJS de propósito: os builders e os testes (Jest) usam o mesmo código.
//
// Chave = a palavra como vem da lista. `jp` troca a escrita (e a palavra ganha outro id: ver RENAMED_WORDS, que migra o progresso),
// `reading` troca a leitura. O que não aparece aqui sai como veio da lista.

const FIXES = {
  // JMdict: おじさん é 伯父さん/叔父さん/小父さん. 伯父 sozinho lê-se おじ; a lista tirou o さん da escrita e deixou o da leitura.
  伯父: { jp: '伯父さん' },
  // JMdict: お金持ち lê-se おかねもち (a lista tirou o お da leitura).
  お金持ち: { reading: 'おかねもち' },
  // JMdict: 堅 sozinho lê-se けん; o adjetivo かたい é 堅い (a lista tirou o い).
  堅: { jp: '堅い' },
  // JMdict: さする é 摩る/擦る. 摩する (まする) é outra palavra, "esfregar" no sentido de "roçar/atritar".
  摩する: { jp: '摩る' },
  // JMdict: たんぼ é 田んぼ (田ぼ é só forma de busca).
  田ぼ: { jp: '田んぼ' },
  // JMdict: 主人 é o chefe da casa, o dono (de loja), o senhorio, o marido, o patrão e o anfitrião; a lista só trazia "marido".
  主人: { meaning: 'marido (próprio); dono; patrão; anfitrião' },
};

/** Palavras que mudaram de escrita (e portanto de id) por causa das correções: id antigo → id novo. */
const RENAMED_WORDS = Object.fromEntries(Object.entries(FIXES).filter(([, f]) => f.jp).map(([from, f]) => [from, f.jp]));

/** Aplica a correção (se houver) a `{ jp, reading, ... }`; devolve um objeto novo. */
function applyFix(word) {
  const fix = Object.prototype.hasOwnProperty.call(FIXES, word.jp) ? FIXES[word.jp] : undefined;
  return fix ? { ...word, ...fix } : word;
}

/**
 * A escrita que a lista tinha antes da correção. Os builders de N3 a N1 deixam de fora o que já está nas listas de baixo, e os
 * números de linha das traduções (pt-*.txt) contam com isso: sem desfazer a correção aqui, a palavra 堅い do N3 sairia da lista
 * e as linhas seguintes deslocariam. A palavra repetida (堅い no N4 e no N3) vira uma só em mergeVocabulary.
 */
const BEFORE_FIX = Object.fromEntries(Object.entries(RENAMED_WORDS).map(([from, to]) => [to, from]));
const undoFix = (jp) => (Object.prototype.hasOwnProperty.call(BEFORE_FIX, jp) ? BEFORE_FIX[jp] : jp);

module.exports = { FIXES, RENAMED_WORDS, applyFix, undoFix };
