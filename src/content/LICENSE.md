# Fontes e licenças do vocabulário

> **Status (2026-10-27):** a licença das listas do Tanos foi validada (CC BY) e o crédito do VOICEVOX foi conferido (exceto 雨晴はう,
> sem seção nos termos oficiais). Seguem pendentes a **revisão do conteúdo escrito por IA por um falante** e a escolha da licença do
> projeto. Siga a lista "Antes de publicar" no fim deste arquivo.

## Lista JLPT N5 (`n5.ts`, gerado em `scripts/vocab-n5/`)

- **Origem direta:** projeto *open-anki-jlpt-decks*, arquivo `src/n5.csv`
  (https://github.com/jamsinclair/open-anki-jlpt-decks). O repositório está sob a **licença MIT**
  (Copyright (c) 2020 Jamie Sinclair), que cobre o trabalho dele.
- **Origem dos dados:** segundo o próprio README desse projeto, os dados originais vieram de
  https://github.com/chyyran/jlpt-anki-decks, "baseados nos decks de tanos.co.uk" (listas JLPT de
  **Jonathan Waller**). O repositório `chyyran/jlpt-anki-decks` aparece no GitHub com licença
  `NOASSERTION` (sem licença declarada).
- **Licença das listas do Tanos, VALIDADA em 2026-10-27:** o domínio `tanos.co.uk` não resolve mais, mas a Wayback Machine guarda a página
  "Use my data! / Sharing and copyrights" (https://web.archive.org/web/20231128200421/https://www.tanos.co.uk/jlpt/sharing/, © Jonathan
  Waller, atualizada em 12/10/2011). Ela diz, no original: *"Everything on this site (that I'm not selling), is licenced under Creative
  Commons "BY". Basically this means... use anything here however you like (commercial or non-commercial), but credit my site."* As
  listas de vocabulário são gratuitas (só o áudio "Grammar Plus" é vendido e não é usado aqui), então estão cobertas. **Obrigação:
  creditar Jonathan Waller / tanos.co.uk**, o que está em Ajustes → Sobre e aqui. Limites: a página não diz a versão da CC BY, e a
  confirmação vem de uma cópia arquivada, não do site ativo.
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

## Explorar frases (`assets/sentences.db`, gerado em `scripts/example-sentences/`)

- **Origem:** 28 mil frases do **Tatoeba** (https://tatoeba.org), sob **CC BY 2.0 FR**, tiradas do dump público de frases em
  japonês e em português. Cada frase mostra o número no Tatoeba (`https://tatoeba.org/sentences/show/<id>`) como crédito; os autores
  estão nas páginas do Tatoeba.
- **Traduções:** a ligação do Tatoeba entre uma frase em japonês e uma em português é direta ou pelo inglês (japonês → inglês →
  português). As indiretas podem ser **livres**, e o aviso está na tela. Quando há mais de uma tradução, fica a mais curta.
- **Filtros (feitos no computador):** 4 a 32 caracteres, sem números nem letras latinas, sem nomes de pessoas, sem uma lista curta
  de temas (violência, sexo, palavrões, religião, bebida, cigarro), sem repetidas, só com palavras do vocabulário do app
  (N5 + palavras dos kanji + lista N4 do *open-anki-jlpt-decks*, MIT), com no máximo 1 palavra fora dele (marcada como "palavra nova").
- **Leitura (furigana e kana):** gerada pelo analisador **kuromoji** (Apache-2.0, dicionário IPADIC) e pelas leituras do JMdict
  (EDRDG, CC BY-SA 4.0). **É automática e pode errar** (por exemplo, a leitura de números e de palavras com mais de uma leitura).
  O romaji é gerado por regra a partir do kana.
- **Pendência:** a lista de temas excluídos é curta e a filtragem é automática; nada foi lido frase por frase, e as leituras e as
  traduções livres **não foram revisadas por um falante**.

## Validação das traduções (`scripts/validate-translations/`, 1.16.0)

- **LaBSE** (`sentence-transformers/LaBSE`, Apache-2.0) e **NLLB-200 distilled 600M** (`facebook/nllb-200-distilled-600M`, **CC-BY-NC 4.0**, "para pesquisa") rodaram **só no computador**, para apontar traduções que não batem. Nenhum texto nem modelo deles vai no app. Por causa da licença do NLLB, esse passo é só para conferência pessoal e não deve virar parte de um produto comercial.
- 1.475 frases do Explorar foram tiradas por terem nota de margem baixa (`removed-ids.json`). Relatório e limites em `docs/validacao-traducoes.md`.

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

## Voz VOICEVOX (módulo `modules/voicevox`, opcional)

- **VOICEVOX CORE** (https://github.com/VOICEVOX/voicevox_core, MIT) roda dentro do app Android pelo AAR oficial. Os binários, o
  **ONNX Runtime** e o **dicionário do Open JTalk** **não ficam no git**: `npm run voicevox:setup` baixa tudo pelo downloader oficial,
  que mostra os termos e pede o aceite.
- **Vozes (`.vvm`):** **não vão no APK nem no git.** O app as baixa, a pedido da pessoa, da release oficial
  (`https://github.com/VOICEVOX/voicevox_vvm/releases`, versão em `voicevoxCatalog.ts`), mostrando, a cada download, os termos de cada personagem do arquivo (com o link de cada um) e pedindo o
  aceite. A lista (arquivo → personagens → estilos → tamanho) vem da tabela do README oficial e é gerada por `npm run voicevox:catalog`.
  Assim o projeto não redistribui nenhuma voz.
- **Termos das vozes:** "VOICEVOX 音声モデル 利用規約" (`TERMS.txt` do repositório `voicevox_vvm`) permite uso comercial e não comercial e
  embutir em aplicativos, **com o crédito** "VOICEVOX:<nome do personagem>", e proíbe engenharia reversa dos arquivos, prejudicar o autor
  ou terceiros e atos contra a ordem pública. Cada personagem tem termos próprios, no mesmo arquivo (conferido em 2026-10-27, cruzando os 43
  personagens do catálogo com os títulos do `TERMS.txt`: **42 têm seção própria** com o crédito `VOICEVOX:<nome>`, por exemplo 四国めたん,
  ずんだもん e 春日部つむぎ, que pedem só o crédito e remetem aos termos do autor). **Exceção: 雨晴はう (arquivo `0.vvm`) não tem seção
  no `TERMS.txt` da release 0.17.0**, mas o site oficial do VOICEVOX aponta os termos dela (https://amehau.com/?page_id=225), lidos em
  2026-10-27: uso comercial e não comercial dentro dos termos do VOICEVOX; o crédito do VOICEVOX é obrigatório (exemplo
  `VOICEVOX:雨晴はう`; o crédito com o nome dela é bem-vindo, não exigido); proíbem conteúdo R18, modelos de troca de voz feitos com
  áudio do VOICEVOX e uso contra a lei ou para enganar terceiros. O app só lê frases de estudo e mostra o crédito, o que se enquadra.
  **Quem usar outras vozes deve ler os termos do personagem** (alguns têm restrições).
- **Link dos termos de cada personagem:** o catálogo guarda o `policyUrl` que o site oficial publica na página de cada um, e a tela
  de download mostra o botão "Termos" ao lado de cada voz. O link da 波音リツ é `http://`, como no `TERMS.txt` oficial.
- **Nomes e descrições em português:** o nome romanizado vem do endereço oficial de cada personagem (`/product/<slug>/`) e a descrição
  da voz é a frase japonesa que o site mostra ("優しく可愛い声"), **traduzida por IA** (`voicevoxText.ts`, a revisar por um falante), assim
  como o nome dos 63 estilos de voz. 里石ユカ ainda não tem descrição no site.
- **Amostras (preview):** "Ouvir amostra" toca a voz do aparelho quando ela já foi baixada; senão o app lê a página do personagem no
  site oficial e toca a amostra de voz que o site publica ali (arquivo WAV), só quando a pessoa toca no botão, guardando-a no cache do
  app. O app **não redistribui** as amostras (não vão no git nem no APK). Os termos do site sobre reutilizar as amostras **não foram
  lidos**: se isso for um problema, basta trocar o botão por um link para a página do personagem.
- **Crédito no app:** Ajustes → Sobre e Ajustes → "Voz de anime (VOICEVOX)" mostram o crédito da voz em uso.

## Câmera para ler (módulo `modules/textscan`)

- **Google ML Kit** (`com.google.mlkit:text-recognition-japanese`), com o modelo japonês dentro do app: a imagem não sai do aparelho.
  Os termos do ML Kit estão em https://developers.google.com/ml-kit/terms. Confira-os antes de publicar.

## Reconhecimento de fala (biblioteca)

- **`expo-speech-recognition`** (MIT) usa o reconhecimento de fala do Android (serviço do Google). O app não guarda o áudio,
  mas a voz é enviada a esse serviço. Antes de publicar: incluir isso numa política de privacidade e conferir as regras da
  loja para o uso do microfone e do reconhecimento de fala.

## Classe gramatical, frequência e kanji novos (`wordClass.ts`, `frequency.ts`, `kanjiExtra.ts`)

- **Classe gramatical das palavras** (`wordClass.ts`, `npm run build-pos`): vem do **JMdict** (EDRDG, **CC BY-SA 4.0**,
  https://www.edrdg.org/jmdict/j_jmdict.html). Para cada palavra do vocabulário, a entrada mais comum com a mesma escrita e leitura.
- **Frequência** (`frequency.ts`, `npm run build-frequency`): em quantas das ~243 mil frases curtas do **Tatoeba** (CC BY 2.0 FR)
  cada palavra aparece. Só os números ficam no app, não as frases.
- **Kanji novos** (`kanjiExtra.ts`, `npm run build-kanji`): o último kanji do N5 (魚) e os **181 do N4**, pela lista antiga do JLPT
  no campo `jlpt` do **KANJIDIC2** (EDRDG, CC BY-SA 4.0), de onde também vêm as leituras on e kun. A ordem dos traços vem do
  **KanjiVG** (CC BY-SA 3.0, ver `src/data/strokes/LICENSE.md`). Os **significados em português e a divisão em categorias foram escritos
  por IA para este app** (`scripts/kanji/pt.json`) e **precisam de revisão por um falante**.
- **Situações de viagem** (`src/features/vocab/order.ts`): a escolha de quais palavras do vocabulário servem em cada situação é uma
  curadoria feita para este app (nenhuma palavra nova).
- **Pendência:** todas essas fontes são CC BY-SA, então o item 4 de "Antes de publicar" (licença do projeto) vale para elas.

## Vocabulário da especificação (HTML)

A palavra de exemplo de cada kana e kanji e as palavras do simulador de teclado vêm do protótipo
`Nihongo Dojo.html` (a especificação do projeto), já presentes em `src/data/`.

## Áudio nativo das palavras (Lingua Libre)

- `assets/audio/words/*.mp3` e `src/content/wordAudio.ts` (gerados por `scripts/audio/convert.mjs`, a partir da coleta de
  `scripts/audio/collect.mjs`): **360 gravações** de falantes nativos do Lingua Libre (Wikimedia Commons), só com licença
  **CC0, CC BY 4.0 ou CC BY-SA 4.0**. Cada gravação guarda o falante, a licença e a página de origem em `wordAudio.ts`.
- Foram convertidas para mp3 mono (22 kHz, 40 kbps), o que é uma adaptação: com CC BY-SA, o áudio do app segue a mesma licença.
- Crédito em **Ajustes → Sobre**. Cobertura: cerca de metade das palavras do vocabulário; as outras usam a voz do aparelho.

## Textos de leitura (Fase 5)

- `src/content/readings.ts`: textos curtos e leituras do dia a dia **escritos por IA** para este app, só com palavras do
  vocabulário (um teste confere). Não vêm de fonte externa. **Escritos por IA, a revisar por um falante de japonês**
  (japonês e traduções).

## Palavras de exemplo extras dos kanji (1.11.1)

- `src/content/kanjiMoreWords.ts`: uma palavra de exemplo para cada um dos 43 kanji sem palavra no vocabulário. Palavra e leitura
  vêm do **JMdict** (EDRDG, **CC BY-SA 4.0**, entre as de uso comum; conferidas contra o dump). O **significado em português foi escrito por IA**
  e precisa de revisão por um falante. Só aparecem na lição do kanji.

## Dicas dos kanji (1.11.2)

- `src/content/kanjiHints.ts`: dicas de memorização para os 216 kanji que o protótipo não trazia, **escritas por IA** a partir dos
  componentes de cada kanji no KanjiVG (CC BY-SA 3.0). São imagens para lembrar a forma, não a origem histórica do caractere.
  **Escritas por IA, a revisar por um falante.**

## Frases de viagem, diálogos, moldes e estrutura (1.12.0)

- `scripts/travel/phrases.mjs` → `src/content/travelExtra.ts`: 151 frases de viagem e de dia a dia **escritas por IA** (japonês de uso corrente, tradução em português e "palavra por palavra"). **A revisar por um falante.**
- `scripts/dialogs/scenes.mjs` → `src/content/dialogs.ts`: 9 cenas novas. As falas do aluno são frases de Viagem; as do atendente e os motivos das respostas erradas são **escritos por IA, a revisar por um falante.**
- `src/features/frames/frames.ts`: moldes de frase e as listas de palavras de cada um, **escritos por IA, a revisar.**
- `src/features/structure/`: as descrições dos papéis (tema, objeto...) e a frase de exemplo do mapa (わたしは きのう えきで ともだちに ほんを あげました) são **escritas por IA, a revisar.**
- Nada disso vem de fonte externa: não há licença de terceiros a creditar, mas também não há revisão humana ainda.

## Textos de placas e cardápios reais (1.13.0)

- `src/content/readings.ts` (textos do dia a dia com `parts`): placas, avisos, horários, cardápio, preços, onsen, regras de transporte e conbini, **escritos por IA** com expressões de uso corrente no Japão. A leitura em kana e o significado em português de cada pedaço também foram escritos por IA. **A revisar por um falante.**

## Arte dos itens do Mochi (1.14.0)

- `src/components/mascot/artWear.tsx` e `artScenes.tsx`: os 66 desenhos novos (acessórios, fundos, cores e peles) são **originais**, feitos em SVG para este app. Não há licença de terceiros a creditar.

## Conferência do japonês (1.14.1)

- `scripts/verify-japanese/` e `src/content/confirmed.ts`: as frases do app foram comparadas com o **Tatoeba** (CC BY 2.0 FR; os números das frases estão em `confirmed.ts`, para crédito), com o **JMdict** (EDRDG, CC BY-SA 4.0) e com o guia de frases da **Wikivoyage** em inglês (CC BY-SA 4.0; `wikivoyage.txt` guarda só a romanização, para comparar). Nenhum texto dessas fontes é exibido no app além do número de referência. O selo diz o que foi confirmado; a revisão por um falante continua pendente para o resto.

## Antes de publicar

1. ~~Confirmar a licença das listas do Tanos~~ **Feito em 2026-10-27** (CC BY, com crédito; ver a seção da lista JLPT N5 acima).
2. **Se usar dados do JMdict/KANJIDIC (EDRDG):** a licença é **CC BY-SA 4.0** e exige crédito, inclusive em
   apps (https://www.edrdg.org/edrdg/licence.html); os dados derivados ficam sob a mesma licença.
3. **Revisar as traduções** com um falante (no mínimo uma amostra grande) e corrigir `scripts/vocab-n5/pt-*.txt`;
   depois `npm run build-n5`.
4. **Escolher a licença do restante do projeto** (hoje não há `LICENSE` na raiz) de forma compatível com o
   CC BY-SA do KanjiVG e com o que ficar decidido acima.
5. **Crédito do Tatoeba** (CC BY 2.0 FR): manter a menção em **Ajustes → Sobre** e, se as frases saírem do app
   (repositório público, site), incluir o crédito e o link junto delas.
6. Conferir a tela **Ajustes → Sobre** (créditos) e este arquivo, e atualizar o texto se a fonte mudar.
