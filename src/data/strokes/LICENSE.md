# Dados de ordem dos traços: KanjiVG

O arquivo `strokes.json` deste diretório contém dados de ordem dos traços do projeto **KanjiVG**.

## Crédito (atribuição)

- Obra original: **KanjiVG**
- Autor: **Ulrich Apel** e colaboradores do KanjiVG
- Fonte: https://kanjivg.tagaini.net
- Licença: **Creative Commons Atribuição-CompartilhaIgual 3.0 (CC BY-SA 3.0)**
  - Resumo: https://creativecommons.org/licenses/by-sa/3.0/deed.pt_BR
  - Texto completo: https://creativecommons.org/licenses/by-sa/3.0/legalcode

## Licença deste arquivo

`strokes.json` é distribuído sob a **CC BY-SA 3.0**, a mesma licença do material original. Quem reutilizar
este arquivo, ou dados derivados dele, deve manter este crédito, indicar as alterações feitas e compartilhar o
resultado sob a mesma licença (CC BY-SA 3.0 ou uma licença compatível).

## Alterações feitas (a licença exige indicá-las)

- **Origem imediata:** os dados foram extraídos do protótipo `Nihongo Dojo.html` (na raiz deste repositório),
  que declara tê-los obtido do KanjiVG (o crédito aparece no rodapé da página).
- **O que este projeto fez:** o script `scripts/extract-data.mjs` copiou, para um único arquivo JSON, os caminhos
  SVG de cada traço (`p`) e a posição do número de cada traço (`n`). Ou seja, o **formato** mudou (de SVG para
  JSON); o script não altera os valores.
- **O que não foi verificado:** estes dados não foram comparados com os arquivos originais do KanjiVG. Se o
  protótipo os alterou de alguma forma, essa alteração também está presente aqui.

## Onde mais o crédito aparece

- No rodapé de `Nihongo Dojo.html`, que também contém esses dados.
- No `README.md` e na tela **Ajustes → Sobre** do app.

## Escopo

Este arquivo trata apenas do **material do KanjiVG** contido em `strokes.json`. A licença do restante do código
deste repositório é definida à parte e ainda não foi escolhida.
