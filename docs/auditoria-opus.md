# Auditoria do Moji Dojo (revisão, sem alterar código)

Data: 2026-11-01 · Versão auditada: 2.42.2 + commits `62474be`, `c463a3c`, `9a39f20` (itens 1a, 1b e 4 do plano em andamento).
Revisor: Claude (Opus 5.5). Nenhum arquivo do app foi alterado; só este relatório foi criado.

## Como ler este relatório

- **Gravidade dos problemas de conteúdo:** **errado** (ensina algo falso), **impreciso** (meia verdade ou falta algo importante), **estranho** (correto, mas pouco natural ou confuso para um brasileiro iniciante).
- **Certeza:** alta / média / baixa. Onde a certeza é baixa, digo isso em vez de afirmar. Não sou falante nativo: tudo marcado como "errado" no japonês tem fonte (JMdict, KANJIDIC2, Tatoeba) ou é regra de gramática bem estabelecida.
- **Cobertura:** o que foi conferido por script cobre **100%** do conjunto indicado. A revisão manual do grupo (b) é **por amostragem**, e cada seção diz quanto foi lido. Ela não substitui a revisão por um falante nativo, que continua sendo a pendência nº 1 do ROADMAP.

## Resumo priorizado

### Corrigir já (errado)

> **Status (2026-11-01): E1 a E6 corrigidos** no commit "fix(content): leituras e ordem…". As correções de vocabulário ficam em `scripts/vocabFixes.cjs` (aplicadas pelos `build-n*.mjs`, que não editam os CSVs da lista aberta); o progresso de quem já estudava 伯父, 堅, 摩する ou 田ぼ migra para o id novo ao abrir o app e ao importar backup. F11–F17 (lógica) e F3, F4, F5, F6, F7, F10 (conteúdo) foram tratados depois, em commits próprios; ver a tabela "Status das melhorias" no fim do arquivo.

| # | Onde | Problema | Certeza |
|---|---|---|---|
| E1 | `src/content/n5.ts:420` | 伯父 com leitura **おじさん**. Sozinho, 伯父 lê-se **おじ**; おじさん é **伯父さん** (JMdict: 伯父さん/叔父さん/小父さん). A lista aberta tirou o さん da escrita e deixou na leitura. **Correção ao que escrevi antes:** o significado "tio; senhor de meia-idade" está certo, porque no JMdict as duas coisas são a mesma entrada (小父さん); não é palavra separada. | alta (JMdict) |
| E2 | `src/content/n4.ts:417` | お金持ち com leitura **かねもち**. Com o お, a leitura é **おかねもち**. A voz e o cartão de leitura ("rd") cobram a leitura errada. | alta (JMdict) |
| E3 | `src/content/n4.ts:431` | 堅 com leitura **かたい**, como adjetivo. Sozinho, 堅 é **けん**. O adjetivo é **堅い** (かたい). Falta o い na escrita. | alta (JMdict) |
| E4 | `src/content/n1.ts:191` | 摩する com leitura **さする**. O JMdict dá **まする** para 摩する. "Esfregar" com さする escreve-se 擦る/摩る. | alta (JMdict) |
| E5 | `src/content/n2.ts:1027` | 田ぼ (たんぼ, "arrozal"): a escrita padrão é **田んぼ**. O JMdict marca 田ぼ como forma só de busca (`sK`, uma escrita que não se usa) e restringe a leitura たんぼ a 田んぼ e 田圃. | alta (JMdict) |
| E6 | Gramática N5: `g16` (`scripts/grammar-n5/topics.mjs:115`) e o tópico de が | **Ordem de dependência:** "〜ないでください" (tópico nº 16) usa a forma ない, que só é ensinada em "Forma simples" (nº 40). が aparece em exemplos desde o g7 (ねこが います), mas o tópico "Quem faz: a partícula が" é o nº 39. O iniciante vê a forma antes da explicação. | alta |

### Melhorar (fraco ou impreciso)

| # | Onde | Problema | Certeza |
|---|---|---|---|
| F1 | `src/content/n4.ts:582`, `src/content/n2.ts:47`, `:58`, `:767` | Leituras "de sufixo" ou escrita incomum: 真中 (escrita padrão 真ん中), 沿い **そい** (como sufixo o JMdict dá **ぞい**), 遣い **づかい** (o JMdict dá **つかい**; づかい só com rendaku em 〜遣い), 初 **しょ** (sem entrada no JMdict com essa leitura isolada). | média |
| F2 | `src/data/examples.ts` (`KANJI_EXAMPLES`) | **15 das 31** palavras de exemplo dos kanji usam um kanji que só é ensinado depois ou que o app não ensina. Exemplos: 日 → 日本 (本 vem na L17), 月/火 → 月曜日/火曜日 (曜 na L27), 友 → 友達 (達 nunca), 山 → 富士山 (富 e 士 nunca), 空 → 空港 (港 nunca). Lista completa no Anexo B. | alta |
| F3 | `src/data/grammar.ts:5` (g1) | "です… quer dizer 'é', 'sou' ou '**está**'". です não indica lugar ("está na sala" = います/あります). Vale só para estado (げんきです). Convém dizer isso para não induzir *トイレはそこです como "está ali" (que até funciona) e *ねこはそこです. | média |
| F4 | `src/data/grammar.ts:13` (g9) | Lista きれい entre os exemplos de な **sem avisar** que termina em い. O aviso só aparece no g13 e em `pitfalls.ts:81`. É a armadilha nº 1 dos adjetivos. Uma frase no g9 resolve. | alta |
| F5 | `src/data/grammar.ts` (g7) | O exemplo ねこが います usa が sem explicação. O padrão do tópico mostra は. Ver E6. | alta |
| F6 | Traduções do Tatoeba nos exemplos de gramática (lista no Anexo C) | Português de Portugal ou pouco natural para um brasileiro: "Não te preocupes" (n5 g16), "Não podes estar a falar a sério" (n3-8), "Comamos enquanto esteja quente" (n3-10). Há também traduções que mudam o sentido: "Vou ir ao cinema" para 映画に行くつもりです perde o "pretendo"; "Eu vim conhecê-lo" para 知るようになった; "Ele foi feito para ir lá" (calco do inglês); "Gostaria de trocar de lugar" para 席を変えてほしいのですが (o japonês pede que **o outro** troque). A licença CC BY permite adaptar desde que se indique a alteração. | alta (português) / média (japonês) |
| F7 | `src/content/n2.ts:754` | 主人 = "marido (próprio)". Falta o sentido principal, "dono; patrão; chefe da casa". | média |
| F8 | `src/content/kanjiHints.ts:42` | 姉 explicado como 女 + 市 ("mercado"). Pela etimologia, o lado direito é outro componente, só parecido com 市: no 姉 o traço vertical atravessa o topo. Os traços batem (3 + 5 = 8), então como mnemônico funciona. Só não é a decomposição real. | baixa (não conferi em dicionário de etimologia) |
| F9 | `src/content/kanjiHints.ts:11` | 九: "como um 9 de cabeça para baixo". A imagem é confusa: um 9 de cabeça para baixo é um 6. | baixa (é gosto) |
| F10 | `src/data/sounds.ts:6` | Exemplo **らーめん** em hiragana com ー. A escrita normal é ラーメン. らーめん existe em letreiros, mas para um iniciante passa a ideia errada de que ー é comum em hiragana. | média |
| F11 | Revisão espaçada: `src/features/review/srs.ts` (função `dueChars`) | O vencimento é ao milissegundo. Um cartão aprendido às 23h vence às 23h do dia seguinte, e quem revisa de manhã só o vê no dia depois. Na prática, metade dos cartões atrasa até um dia. O Anki usa a virada do dia (4h) como corte. Sugestão: considerar vencido tudo que vence até o fim do dia local, ou até as 4h do dia seguinte. | alta (é como o código funciona); média (quanto isso pesa no aprendizado) |
| F12 | `src/features/leeches/leeches.ts:44` | O item teimoso conta **por cartão**. Uma palavra tem até 3 cartões (jm, mj, au/rd), então 2 palavras difíceis já podem disparar o freio (6 teimosos, `brake.ts:12`) e inflar o "crescimento" do item 8. Sugestão: contar palavras distintas. | alta |
| F13 | `src/features/leeches/leeches.ts:38-40` | Os kanji teimosos entram com `area: 'kana'` (vem do `findItem`), e a dica fala de "compare com um parecido" como se fosse kana. | alta |
| F14 | `src/features/review/confusions.ts:63` | Pares com o mesmo som (じ/ぢ, ず/づ) são descartados no treino, mas continuam ocupando as 8 vagas de `confusedPairs`. Se forem os mais trocados, o treino fica com menos de 8 pares ou vazio. Sugestão: filtrar antes do `slice`, ou treinar esses pares pela escrita (desenho), não pelo som. | alta |
| F15 | `src/features/review/brake.ts:25` | `new Date(now - i * DAY_MS)` para recuar dias: num fuso com horário de verão, pular 24h pode saltar ou repetir um dia. O Brasil não tem horário de verão desde 2019, então hoje não afeta. Os testes passam em Nova York, Tóquio e Auckland porque não caem na data da troca. Sugestão: recuar com `setDate(d - 1)`, como `streakDays` já faz. | alta (código) / baixa (impacto) |
| F16 | `src/features/backup/backup.ts:27-38` | O import aceita `due` e `t` em qualquer data futura (até 1e15). Um backup de um aparelho com o relógio errado pode jogar cartões para anos à frente, ou zerar o tempo decorrido (`elapsed` = 0, crescimento suprimido no FSRS). Sugestão: limitar `due` a agora + 365 dias e `t` a no máximo agora. | alta |
| F17 | `src/features/reminders/scheduler.ts`, `useReminderSync.ts` | **0% de cobertura** de testes; `reminders/context.ts` tem 38% dos ramos. É a parte que fala com o sistema (expo-notifications), justamente a que o item 9 vai verificar. O aviso de risco ainda exige 3 dias de sequência (`plan.ts:80`); a mudança para 1 foi aprovada e está pendente. | alta |
| F18 | Ordem da trilha | Hiragana, katakana e kanji são trilhas independentes, e a gramática não tem trava. O g1 já usa katakana (ブラジル), e os exemplos do Tatoeba usam kanji com furigana. Não é erro, mas não há um caminho sugerido "kana → gramática N5 → kanji" para quem começa do zero. | média |

### Está ok

- **Kanji (100% dos 477) contra o KANJIDIC2:** todas as leituras on e kun e todos os números de traços (KanjiVG) batem. Nenhuma divergência.
- **Vocabulário (100% das 7.788 entradas de lista) contra o JMdict:** 7.753 batem em escrita e leitura (99,5%). Só 9 leituras divergem (E1–E5 e F1). Outras 26 não têm entrada no JMdict, mas não são erro: são expressões e verbos com する (コピーする, お世話になりました, ゆっくりと).
- **Mnemônicos dos kana (todos os 227 lidos):** corretos e coerentes com a forma. Os de katakana apontam bem a diferença シ/ツ e ソ/ン. A observação menor fica no Anexo D.
- **Guias de pronúncia (`src/data/sounds.ts`, todos lidos):** vogais, R, ふ/つ/し/ち/じ, vogal que some, ん assimilado, vogal longa, っ, tom (箸 HL × 橋 LH; 雨 × 飴) e は/へ/を como partícula. Tudo correto e bem explicado para um brasileiro.
- **Gramática g1–g10 (todos lidos) e 22 tópicos N4/N3 por amostragem:** as explicações estão corretas, salvo F3, F4 e F6. Os tópicos de passiva, causativa passiva, 〜てみる, 〜ようになる, によって, うちに, ことになる, てほしい e ことはない estão certos e claros.
- **Traduções do vocabulário (amostra de 110 palavras, 22 por nível):** cerca de 98% corretas. A única imprecisão relevante é F7.
- **Leituras e diálogos (amostra de 3 textos e 1 diálogo):** japonês natural, traduções corretas.
- **Lógica:** a suíte inteira passa (1.750 testes, 5 pulados de propósito), (a conferência em outros fusos que fiz na primeira versão deste relatório **não valia**: no Git Bash do Windows a variável `TZ` com nome de região não é aplicada, e tudo rodou em horário de São Paulo; refeita pelo PowerShell em 5 fusos, ver a seção 2.1). A cobertura dos módulos de aprendizado é de 93% das linhas e 86% dos ramos. Desenho sem dados de traço é tratado: os 82 kana combinados/estrangeiros sem traço são filtrados por `isWritable` (`src/features/writing/model.ts:6`). O import de backup valida tipos e faixa de `b`, `s` e `d`.

---

## 1. Conteúdo em japonês

### 1.1 Separação por origem

| Grupo | Conteúdo | Tamanho |
|---|---|---|
| (a) de fonte | Escrita e leitura das listas JLPT (`n1.ts`–`n5.ts`: escrita/leitura da lista; inglês do JMdict/listas abertas) | 7.788 palavras |
| (a) | Kanji: leituras on/kun (KANJIDIC2/JMdict) e ordem dos traços (KanjiVG) | 477 kanji, 227 kana |
| (a) | Frases de exemplo da gramática N5 (tópicos 11+), N4 e N3, do banco de frases (5.231) e dos sufixos: texto e tradução do Tatoeba | ver 1.2.3 |
| (a) | Tom (Kanjium), frequência (Tatoeba), áudio (Lingua Libre) | não auditados aqui (o tom já foi checado contra o UniDic, ROADMAP item 4) |
| (b) à mão / IA | Significados em português do vocabulário (traduzidos do inglês) | 7.788 |
| (b) | Explicações de gramática (113 tópicos), armadilhas (`pitfalls.ts`), exercícios "Montar" (376) | |
| (b) | Mnemônicos dos kana e dicas dos kanji (`hints.ts`, `kanjiHints.ts`: 477) | |
| (b) | Exemplos dos kana e dos kanji (`examples.ts`), guias de som (`sounds.ts`), textos de leitura (40), diálogos (13), frases de viagem | |
| (b) | Leitura em kana de 4 exemplos de sufixo (`wordExtras.ts`, marcadas "à mão") | 4 |

### 1.2 Grupo (a): conferência por script

Scripts (fora do repositório, na pasta temporária da sessão): `jmdict.cjs`, `kanjidic.cjs` e `tatoeba.mjs`. Fontes oficiais baixadas em 2026-11-01: `JMdict_e.gz` (219.002 entradas) e `kanjidic2.xml.gz`, do EDRDG.

#### 1.2.1 Vocabulário × JMdict

- **Conferido:** a escrita existe no JMdict, e a leitura do app pertence à mesma entrada, respeitando `re_restr`.
- **Leitura diferente (9):** 伯父, お金持ち, 堅, 真中, 沿い, 遣い, 初, 田ぼ, 摩する. Estão em E1–E5 e F1.
- **Sem entrada (26, não são erro):** コピーする, ゆっくりと, けんかする, けがする, チェックする, びっくりする, よると, 一段と, 行っていらっしゃい, お元気で, お世話になりました, お待ちください, しいんと, それはいけませんね, 傾らか, 生意気な, 防, 惨めな, やたらに, 煌々と, さっぱりする, 営, おおまかな, 合せ, 生ける, 活ける, だと.
  - **Revisar no texto:** 傾らか (なだらか é quase sempre em kana) e "生ける, 活ける" (duas escritas no mesmo campo `jp`, que viram uma "palavra" só).
- **Vocabulário inicial (kana, kanji, teclado):** só 東京駅 não tem entrada (é composto). Não há nenhuma leitura errada.
- **Inglês do app × glosas do JMdict:** 226 sem palavra em comum. Na amostra que conferi, são diferenças de redação ("junior high school **pupil**" para 中学校, por exemplo) e não afetam o português. Não tratei como erro.

#### 1.2.2 Kanji × KANJIDIC2 e KanjiVG

- **477 de 477 conferidos:** leituras on (normalizadas para katakana), leituras kun (sem a marca do okurigana) e número de traços dos dados do KanjiVG × `stroke_count` do KANJIDIC2. **Zero divergências.**
- **Kana:** os 82 combinados (きゃ…) e sons estrangeiros (ファ…) não têm traços, como esperado. O modo desenho os filtra.

#### 1.2.3 Frases × Tatoeba (API ao vivo)

- **Amostra conferida na API do Tatoeba (ao vivo, 2026-11-01): 631 frases.** Todas as 242 frases de exemplo da gramática N5 (tópicos 11+), N4 e N3 e os 10 exemplos de sufixos (`wordExtras.ts`) mais 1 frase em cada 25 do banco de frases (210).
- **Resultado:** 0 frases inexistentes, **0 divergências no japonês**, **0 divergências na tradução** (cada tradução do app é uma das traduções em português da frase no Tatoeba) e **0 licenças diferentes de CC BY 2.0 FR**. 3 consultas falharam por rede e não foram repetidas.
- **O que isso não prova:** que o texto do Tatoeba é natural ou que a tradução escolhida é a melhor. É o que os itens F6 e o Anexo C apontam (tradução em português de Portugal ou que muda o sentido, embora seja fiel ao Tatoeba).
- **Banco de frases:** só 1/25 foi conferido (210 de 5.231); as outras 5.021 são do mesmo gerador e não foram checadas uma a uma.

### 1.3 Grupo (b): revisão manual

**Quanto foi lido:**

| Conteúdo | Lido |
|---|---|
| Mnemônicos e exemplos dos kana | 227 de 227 |
| Guias de som | 9 de 9 |
| Gramática g1–g10 | 10 de 10 |
| Gramática N5 g11–g16 e g44–g45 | 8 |
| Gramática N4 e N3 | 22 de 62 |
| Dicas dos kanji | 110 de 477 |
| Vocabulário | 110 de 7.788 |
| Leituras | 3 de 40 |
| Diálogos | 1 de 13 |

O que não foi lido fica como pendência para o falante, com o grupo (b) acima como lista.

#### Problemas encontrados

| Item | Onde | Gravidade | Certeza | Nota |
|---|---|---|---|---|
| です = "está" | `src/data/grammar.ts:5` | impreciso | média | F3 |
| きれい sem aviso no g9 | `src/data/grammar.ts:13` | impreciso | alta | F4 |
| が sem explicação no g7 | `src/data/grammar.ts` (g7) | estranho | alta | F5 |
| ないで antes da forma ない | gramática N5 g16 | errado (ordem) | alta | E6 |
| Tradução "Vou ir ao cinema" (つもり) | `scripts/grammar-n5/topics.mjs:650` | impreciso | alta | perde a intenção |
| "Eu vim conhecê-lo" | `scripts/grammar-n4/topics.mjs:264` | estranho | alta | sentido: "passei a conhecê-lo" |
| "Ele foi feito para ir lá" | `scripts/grammar-n4/topics.mjs:624` | estranho | alta | calco do inglês; "Fizeram ele ir lá" |
| させられる: forma curta | gramática n4-26 | impreciso | média | "〜される é a mais usada no grupo 1": não vale para verbos em す (話させられる, nunca *話さされる) |
| "Gostaria de trocar de lugar" | `scripts/grammar-n3/topics.mjs:1146` | impreciso | alta | てほしい: quem troca é o outro |
| "Comamos enquanto esteja quente" | `scripts/grammar-n3/topics.mjs:577` | estranho | alta | "enquanto está quente" |
| "Não podes estar a falar a sério" | `scripts/grammar-n3/topics.mjs:446` | estranho | alta | português de Portugal |
| "Não te preocupes" | `scripts/grammar-n5/topics.mjs:124` | estranho | alta | português de Portugal |
| 主人 só "marido" | `src/content/n2.ts:754` | impreciso | média | F7 |
| 姉 = 女 + 市 | `src/content/kanjiHints.ts:42` | impreciso | média | F8 |
| 九 "9 de cabeça para baixo" | `src/content/kanjiHints.ts:11` | estranho | baixa | F9 |
| らーめん | `src/data/sounds.ts:6` | estranho | média | F10 |
| ん "nunca começa palavra" | `src/data/examples.ts` (exemplo de ん) | impreciso | média | quase nunca; há exceções raras (ンゴロンゴロ, falas como んだ). Para o iniciante, "quase nunca" basta. |
| ん "o único som que é só consoante" | `src/data/hints.ts` (mnemônico de ん) | impreciso | média | っ também não tem vogal; tudo bem para o iniciante, mas "o único" não é exato |
| ヅ: mnemônico com exemplo em hiragana (つづく) | `src/data/dakutenHints.ts:29` | estranho | alta | no katakana, o exemplo não usa ヅ |

**Português de Portugal no banco de frases:** a busca automática por marcas (tu/podes/estás a + infinitivo/te preocupes…) achou **28** frases no banco e 2 nos exemplos de gramática. É o Tatoeba: aceitável, mas vale um filtro "prefira tradução brasileira" no build.

### 1.4 Ordem das lições

- **Kana:** segue o gojūon: vogais → K → S … → W/ん → revisão → dakuten → handakuten → combinações. É a ordem clássica e funciona.
  - **Falta uma lição própria para っ e ー.** Hoje っ só é "liberado" pela lição Combinações 1 e explicado no guia de sons. Ele aparece em palavras do N5 desde cedo (きって, がっこう, que é o exemplo de が).
- **Kanji:** N5 primeiro, por tema; N4 e N3 depois. Ver F2: metade dos exemplos usa kanji que ainda não foram ensinados.
- **Gramática N5:** a sequência g1–g10 é boa para viagem. Os dois saltos de dependência estão em E6:
  - が é usado desde o g7 e explicado no nº 39;
  - ないで (nº 16) e つもり/なければ (nº 44–45) dependem da "Forma simples" (nº 40). つもり e なければ vêm depois dela, então estão certos; só ないで está antes.
  - A forma て (nº 14) manda treinar no "Conjugar", mas não explica a formação no próprio tópico.
- **Sugestão de ordem:** mover "Forma simples" e "Quem faz: が" para antes do nº 14. Também cabe uma frase em g7 ("aqui が apresenta algo novo; veremos no tópico X").

## 2. Lógica de aprendizado e testes

### 2.1 Suíte

- `npx jest`: **1.750 passaram, 5 pulados, 0 falhas** (173 suítes).
- **Correção:** a primeira conferência em outros fusos estava errada (a variável `TZ` com nome de região é ignorada no Git Bash do Windows; os testes rodaram sempre em São Paulo). Definindo o fuso pelo PowerShell (`$env:TZ = 'America/New_York'`), a suíte passou em São Paulo, Nova York, Auckland, Tóquio e Londres depois das correções F11 e F15; o teste novo do freio **falha no código antigo** em Nova York e em Auckland, o que confirma o F15.
- Os avisos de `act(...)` aparecem nas suítes de HomeView, ShopView, Mascot, RoomScene, ChestHost e JpInline. Não quebram nada, mas escondem avisos novos.

### 2.2 Cobertura dos módulos de aprendizado

Módulos medidos: `review`, `leeches`, `writing`, `streak`, `reminders`, `backup` e `vocab`.

| Métrica | Valor |
|---|---|
| Linhas | 93,4% |
| Ramos | 85,6% |
| Funções | 90,9% |

Arquivos abaixo da média:

| Arquivo | Linhas | Ramos |
|---|---|---|
| `reminders/scheduler.ts` | 0% | 0% |
| `reminders/useReminderSync.ts` | 0% | 0% |
| `writing/canvas.ts` | 0% | — |
| `reminders/context.ts` | 100% | 38% |
| `leeches/leeches.ts` | 87% | 58% |
| `review/mixed.ts` | — | 79% |
| `review/session.ts` | — | 78% |

### 2.3 Casos de borda sem teste (ou com comportamento discutível)

1. **Virada de dia no SRS (F11):**
   - Nenhum teste fixa o que acontece com um cartão que vence às 23h quando a pessoa revisa às 8h.
   - Também falta teste do aprendizado perto da meia-noite: `learnItems` às 23:59 vence às 23:59 do dia seguinte.
2. **Horário de verão no freio (F15):** não há teste com um fuso que tenha DST na data da troca. `metrics.test.ts:62` cobre isso só para o gráfico.
3. **Fuso trocado com a sequência ativa:** quem viaja para o Japão adianta 12h, e um dia some ou repete em `streakDays`. Nenhum teste cobre.
4. **Backup importado:**
   - Não há teste com `due` ou `t` no futuro (F16).
   - Não há teste com um cartão de vocabulário de uma palavra que mudou de leitura ou foi removida. O `parseCardKey` descarta; está ok, mas sem teste explícito.
   - Após os itens 1a/1b, a chave segue o `jp`. Se a correção de E3 trocar 堅 por 堅い, **os cartões antigos de 堅 somem no import** (o id muda). Ao corrigir E1–E5, é preciso migrar as chaves.
5. **Teimosos:** não há teste para a palavra com 3 cartões teimosos (F12) nem para o kanji teimoso rotulado como kana (F13).
6. **Pares confusos:** não há teste com os pares de mesmo som no topo da lista (F14).
7. **Desenho:**
   - Não há teste do fluxo "Não lembro" → animação → traçado guiado **sem nota**. O `assist.ts` define o veredito, mas o traçado guiado está na tela (`WriteQuestion.tsx`).
   - `guessDrawn` não é testado com um desenho vazio vindo de um caractere sem modelo.
8. **Lembretes (F17):** o agendamento real (`scheduler.ts`) não tem teste nenhum. Um teste com `expo-notifications` mockado, mais `jest.useFakeTimers` e `setSystemTime`, pegaria:
   - horário de silêncio atravessando a meia-noite;
   - dias de folga;
   - o aviso de risco com sequência 1.
9. **Confusões no backup:** `sanitizeConfusions` é testado, mas não com chaves de kanji ou palavras. Isso vai importar no item 2 estendido, que guarda confusões de palavras.

## Anexo A: divergências de leitura (JMdict)

| Palavra | Leitura no app | JMdict | Arquivo |
|---|---|---|---|
| 伯父 | おじさん | おじ (はくふ, しゅくふ) | n5 |
| お金持ち | かねもち | おかねもち | n4 |
| 堅 | かたい | けん | n4 |
| 真中 | まんなか | まなか, com remissão a 真ん中 (まんなか é a leitura de 真ん中) | n4 |
| 沿い | そい | ぞい | n2 |
| 遣い | づかい | つかい | n2 |
| 初 | しょ | はつ, うい, うぶ, ぞめ | n2 |
| 田ぼ | たんぼ | forma só de busca (sK); たんぼ vale para 田んぼ e 田圃 | n2 |
| 摩する | さする | まする | n1 |

## Anexo B: exemplos de kanji que usam kanji ainda não ensinados

| Kanji (lição) | Exemplo | Usa |
|---|---|---|
| 日 (L3) | 日本 | 本 (L17) |
| 月 (L3) | 月曜日 | 曜 (L27) |
| 火 (L3) | 火曜日 | 曜 (L27) |
| 東 (L9) | 東京 | 京 (L23) |
| 北 (L9) | 北海道 | 海 (L25), 道 (L18) |
| 人 (L6) | 日本人 | 本 (L17) |
| 友 (L7) | 友達 | 達 (não ensinado) |
| 山 (L10) | 富士山 | 富, 士 (não ensinados) |
| 気 (L10) | 元気 | 元 (L51) |
| 空 (L11) | 空港 | 港 (não ensinado) |
| 食 (L12) | 食べ物 | 物 (L49) |
| 行 (L12) | 銀行 | 銀 (L25) |
| 話 (L13) | 電話 | 電 (L17) |
| 会 (L14) | 会社 | 社 (L18) |
| 駅 (L18) | 東京駅 | 京 (L23) |

## Anexo C: traduções a revisar nos exemplos de gramática

| Tópico | Japonês | Tradução no app | Problema |
|---|---|---|---|
| n5 g16 | 心配しないでください。 | Não te preocupes. | português de Portugal ("Não se preocupe") |
| n5 つもり | 映画に行くつもりです。 | Vou ir ao cinema. | perde a intenção ("Pretendo ir ao cinema") |
| n4-11 | 私は彼を知るようになった。 | Eu vim conhecê-lo. | sentido: "Passei a conhecê-lo" |
| n4-26 | 彼はそこに行かされた。 | Ele foi feito para ir lá. | calco do inglês ("Fizeram ele ir lá") |
| n3-8 | 本気のはずがないわ。 | Não podes estar a falar a sério. | português de Portugal |
| n3-10 | あたたかいうちにたべよう。 | Comamos enquanto esteja quente. | "Vamos comer enquanto está quente" |
| n3-20 | 席を変えてほしいのですが。 | Gostaria de trocar de lugar. | quem troca é o outro ("Gostaria que trocasse meu lugar") |

## Anexo D: observações menores (não pedem ação)

- ポテト = "batata frita": em japonês, ポテト sozinho costuma ser batata frita mesmo; ok.
- Kana: キス ("beijo") como exemplo de キ é correto; só escolha de palavra.
- 来 descrito com 米 ("grãos caindo"): é mnemônico, não etimologia; ok.

## Status das melhorias (F1 a F18)

| # | Estado | Como |
|---|---|---|
| F1 | aberto | 真中, 沿い, 遣い, 初: leituras de sufixo ou escrita incomum, a decidir com um falante |
| F2 | aberto | exemplos de kanji com kanji ainda não ensinados |
| F3 | feito | g1: "está" só para estado, lugar remete ao tópico 7 |
| F4 | feito | g9: aviso de que きれい termina em い mas é do tipo な |
| F5 | feito | g7 avisa do が e o tópico 11 o explica (g39 movido) |
| F6 | parcial | trocadas por outras traduções do próprio Tatoeba: "Não se preocupe.", "Planejo ir ao cinema.", "Você não pode estar falando sério.", "Vamos comer enquanto a comida está quente.". Ficam as que têm uma só tradução no Tatoeba ("Eu vim conhecê-lo", "Ele foi feito para ir lá") e "Gostaria de trocar de lugar" |
| F7 | feito | 主人: "marido (próprio); dono; patrão; anfitrião" (JMdict) |
| F8, F9 | aberto | mnemônicos de 姉 e 九: gosto, decidir com um falante |
| F10 | feito | らーめん → ラーメン no guia de sons |
| F11 | feito | vencimento por dia de estudo (virada às 4h); testes com fake timers e em 5 fusos |
| F12 | feito | palavra conta uma vez só nos teimosos |
| F13 | feito | kanji teimoso aparece como kanji |
| F14 | feito | pares de mesmo som fora das vagas do treino |
| F15 | feito | freio recua por dia de calendário; teste falha no código antigo em Nova York e Auckland |
| F16 | feito | datas absurdas do backup são limitadas |
| F17 | feito | aviso de risco com 1 dia; scheduler e sync agora têm testes |
| F18 | aberto | caminho sugerido kana → gramática → kanji |
