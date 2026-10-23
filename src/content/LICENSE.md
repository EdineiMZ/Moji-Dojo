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

## Gramática N5, tópicos 11 a 30 (`grammarN5.ts`, gerado em `scripts/grammar-n5/`)

- **Explicações, esquemas e tabelas:** texto próprio, escrito para este app em português.
- **Frases de exemplo:** 80 frases reais do **Tatoeba** (https://tatoeba.org), todas sob a licença
  **CC BY 2.0 FR** (Creative Commons Atribuição 2.0 França), que permite uso e redistribuição **com crédito**.
  Cada exemplo guarda o id da frase em `scripts/grammar-n5/topics.mjs`, e `GRAMMAR_N5_SENTENCE_IDS` lista os ids;
  o link de cada uma é `https://tatoeba.org/sentences/show/<id>`. Os autores individuais de cada frase estão
  nas páginas do Tatoeba.
- **A tradução em português** de cada exemplo é uma das traduções que o próprio Tatoeba lista para a frase.
- **Alterações feitas neste projeto:** a frase é mostrada **só em kana** (a leitura vem do Tatoeba) e o **romaji
  foi gerado por regra** a partir dela, com a marcação das partículas feita à mão. `npm run verify-grammar`
  confere, na internet, que cada exemplo é a frase original (id, texto, leitura e tradução).
- **Pendência:** as explicações em português foram escritas por um assistente de IA e **não foram revisadas por um
  falante**. Vale o mesmo cuidado das traduções do vocabulário.

## Banco de frases (`sentenceBank.ts`, gerado em `scripts/sentence-bank/`)

- **Origem:** frases do **Tatoeba** (https://tatoeba.org) sob **CC BY 2.0 FR**, buscadas pela API a partir das palavras
  do N5 (`npm run collect-sentences`). Só entram frases com essa licença, com tradução em português e leitura.
  Cada frase guarda o id do Tatoeba (`https://tatoeba.org/sentences/show/<id>`); os autores estão nas páginas do Tatoeba.
- **Alterações feitas neste projeto:** a frase é cortada em palavras por um léxico do próprio app
  (`src/features/bank/lexicon.ts`), só ficam as que o léxico cobre por inteiro e cuja leitura confere com a do Tatoeba
  (`npm run build-sentences`). O kana com espaços e o romaji são gerados por regra. A tradução é uma das do Tatoeba.
- **Pendência:** o corte em palavras é automático e pode errar (palavras só em kana com mais de um sentido). A lista
  "palavras que a frase usa" (que decide o filtro "frases que eu sei ler") não foi revisada por um falante.

## Diálogos (`dialogs.ts`, gerado em `scripts/dialogs/`)

- **Falas do aluno:** frases de Viagem, vindas do protótipo HTML. Nada novo.
- **Falas do atendente** (ex.: "いらっしゃいませ", "ご注文はお決まりですか"), **narração e motivos das respostas
  erradas:** texto próprio, escrito para este app por um assistente de IA, com frases fixas de atendimento.
- **Pendência:** as falas do atendente e as explicações **não foram revisadas por um falante**. Revisar junto com o resto.

## Tom das palavras (`pitch.ts`, gerado em `scripts/pitch/`)

- **Origem:** projeto **Kanjium** (https://github.com/mifunetoshiro/kanjium), arquivo `data/source_files/raw/accents.txt`.
  O projeto declara a licença **CC BY-SA 4.0** (exige crédito e que os dados derivados fiquem sob a mesma licença) e diz que
  a maior parte dos dados vem do EDRDG (EDICT/KANJIDIC), usados conforme a licença do grupo.
- **Alterações feitas neste projeto:** só as 538 palavras do vocabulário N5 que têm acento na fonte (`npm run build-pitch`).
- **Pendência:** confirmar a cadeia de licenças (Kanjium → EDRDG → fontes originais do acento) antes de publicar. O
  CC BY-SA é o mesmo do KanjiVG, então a escolha da licença do projeto (item 4 de "Antes de publicar") já precisa dele.

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
5. **Crédito do Tatoeba** (CC BY 2.0 FR): manter a menção em **Ajustes → Sobre** e, se as frases saírem do app
   (repositório público, site), incluir o crédito e o link junto delas.
6. Conferir a tela **Ajustes → Sobre** (créditos) e este arquivo, e atualizar o texto se a fonte mudar.
