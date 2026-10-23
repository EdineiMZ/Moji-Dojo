# Fontes e licenças do vocabulário

> **Status: uso pessoal e privado. As licenças abaixo NÃO foram validadas para publicação.**
> Antes de distribuir o app (loja, APK para outras pessoas, repositório com os dados), siga a lista
> "Antes de publicar" no fim deste arquivo.

## Lista JLPT N5 (`n5.ts`, gerado em `scripts/vocab-n5/`)

- **Origem direta:** projeto *open-anki-jlpt-decks*, arquivo `src/n5.csv`
  (https://github.com/jamsinclair/open-anki-jlpt-decks). O repositório está sob a **licença MIT**
  (Copyright (c) 2020 Jamie Sinclair), que cobre o trabalho dele.
- **Origem dos dados:** segundo o próprio README desse projeto, os dados originais vieram de
  https://github.com/chyyran/jlpt-anki-decks, "baseados nos decks de tanos.co.uk" (listas JLPT de
  **Jonathan Waller**). O repositório `chyyran/jlpt-anki-decks` aparece no GitHub com licença
  `NOASSERTION` (sem licença declarada), e **a licença original das listas do site Tanos não foi confirmada**
  (o site não pôde ser acessado na verificação, em 2026-10-22).
- **Não existe lista oficial do JLPT** desde 2010: toda lista N5 é uma compilação não oficial.
- **Alterações feitas neste projeto:** formas alternativas reduzidas à primeira; símbolos "～" e "(する)"
  removidos; palavras repetidas e itens que não são palavras (ex.: o sufixo `がる`) descartados;
  ordenação pelas lições do livro Genki quando a lista as indica; **significados traduzidos do inglês para o
  português** (o original em inglês fica no dado, campo `en`, para conferência); classificação por assunto.
- **As traduções e a classificação por assunto são minhas (de um assistente de IA) e não foram revisadas por
  um falante.** Podem conter erros ou escolhas discutíveis.

## Vocabulário da especificação (HTML)

A palavra de exemplo de cada kana e kanji e as palavras do simulador de teclado vêm do protótipo
`Nihongo Dojo.html` (a especificação do projeto), já presentes em `src/data/`.

## Antes de publicar

1. **Confirmar a licença das listas do Tanos** (https://www.tanos.co.uk/jlpt/) e se ela permite o uso e a
   redistribuição neste app (e se exige crédito). Se não permitir, trocar a fonte (ex.: montar a lista a
   partir do JMdict por frequência, com a licença do EDRDG abaixo) e refazer `n5.ts`.
2. **Se usar dados do JMdict/KANJIDIC (EDRDG):** a licença é **CC BY-SA 4.0** e exige crédito, inclusive em
   apps (https://www.edrdg.org/edrdg/licence.html); os dados derivados ficam sob a mesma licença.
3. **Revisar as traduções** com um falante (no mínimo uma amostra grande) e corrigir `scripts/vocab-n5/pt-*.txt`;
   depois `npm run build-n5`.
4. **Escolher a licença do restante do projeto** (hoje não há `LICENSE` na raiz) de forma compatível com o
   CC BY-SA do KanjiVG e com o que ficar decidido acima.
5. Conferir a tela **Ajustes → Sobre** (créditos) e este arquivo, e atualizar o texto se a fonte mudar.
