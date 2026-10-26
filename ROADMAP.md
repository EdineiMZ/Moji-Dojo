# Moji Dojo: roadmap rumo à fluência 🌸

Este documento propõe o que construir depois da versão atual, na ordem em que mais ajuda a **aprender japonês de verdade**: entender o significado das coisas, montar frases, ouvir, falar, ler e continuar estudando por meses. É uma proposta para revisar e priorizar, não um compromisso.

## 1. Onde o app está hoje

O Moji Dojo é muito bom em **ensinar a escrita**: hiragana, katakana e cerca de 100 kanji do N5, com traços, desenho, revisão espaçada, ouvido, 10 tópicos de gramática, frases de viagem, montagem de frases e simulador do teclado de flick.

Mas a escrita é só a porta de entrada. Para falar e entender japonês faltam, em ordem de impacto:

| Habilidade | Situação hoje | Lacuna |
| --- | --- | --- |
| **Vocabulário** | Só palavras de exemplo dentro das lições e frases de viagem | Não há um estudo de vocabulário próprio, que é o que mais pesa na compreensão |
| **Gramática** | 10 tópicos para ler, mais exercícios de montar | Pouca prática ativa (conjugar, escolher partícula, completar lacunas) |
| **Produção de frases** | Montar com blocos prontos | Não se escreve nem se fala uma frase do zero |
| **Escuta** | Sons, pares difíceis, shadowing | Sem ditado nem compreensão de frases e diálogos |
| **Fala** | Autoavaliação (Igual, Quase, Diferente) | Sem gravação nem feedback externo |
| **Leitura** | Só kana e kanji isolados | Sem textos curtos para ler com apoio |
| **Constância** | Sequência de dias, painel de métricas | Sem plano diário, sem metas, sem lembretes |

**Honestidade sobre "fluência":** nenhum app sozinho leva à fluência. O que um app pode fazer é tirar o atrito do estudo diário, garantir revisão no momento certo e empurrar o aluno para *usar* o idioma (ouvir, ler, escrever, falar). O roadmap abaixo segue essa ideia, e a Fase 8 trata do que precisa acontecer fora do app.

## 2. Princípios que guiam as escolhas

1. **Recuperar da memória, não reler.** Cada novidade vira cartão de revisão espaçada; nada é "estudado" só por ter sido lido.
2. **Significado antes de forma.** Toda palavra nova vem com exemplo, áudio e imagem mental, nunca solta.
3. **Entrada compreensível.** Textos e áudios um pouco acima do nível atual, com apoio (furigana, tradução ao toque).
4. **Produzir cedo.** Montar, digitar e falar frases desde o começo, mesmo erradas, com correção.
5. **Pouco por dia, todo dia.** Sessão diária de 15 a 20 minutos, com fim claro.
6. **Conteúdo confiável.** Regra do projeto: nada de japonês inventado. Todo conteúdo novo vem de fonte aberta com licença conferida (seção 6) ou é revisado por um falante.
7. **Funciona offline e é leve.** Uso pessoal, no celular, sem depender de conta ou internet.

## 3. Fase 0: correções e base (curto prazo)

Itens já conhecidos que devem ser resolvidos antes de crescer o app. Legenda: `[x]` feito, `[~]` feito em parte, `[ ]` pendente.

- [ ] **Teclado de flick:** a grade 3 × 4 foi corrigida (largura medida com `onLayout`). **Falta você confirmar no aparelho** se ficou 3 × 4 e se o flick em な ainda cai em ま. *(P)*
- [x] **Testes do cartão:** o `Card.test.tsx` agora roda (mocks do Reanimated e do Worklets), e o teste revelou um problema real de opacity com animação de layout, corrigido no `Card`. *(P)*
- [x] **Lint:** zerado (0 erros, 0 avisos) e `npm run lint` entrou no projeto. *(P)*
- [x] **Exportar o progresso:** Ajustes → Exportar backup gera um código `MDJ1:` versionado (progresso completo, com histórico), compartilhável pelo Android. O importador aceita `MDJ1:` e `NDJ1:`. *(M)*
- [x] **Tamanho do APK:** de 118 MB para cerca de 50 MB, gerando só `arm64-v8a` (celulares de 32 bits antigos exigem incluir `armeabi-v7a`, explicado no `gerar-apk.bat`). *(P)*
- [ ] **applicationId:** **depende de você**: confirmar o prefixo `com.edi.mojidojo` (hoje provisório) antes de qualquer publicação. Depois de publicado, não dá para trocar. *(P)*
- [ ] **Ícone e splash no aparelho:** o ícone do Mochi está pronto e no APK. **Falta você conferir** no celular o adaptativo, o monocromático (Android 13+) e a splash nos temas claro e escuro. *(P)*
- [x] **Acessibilidade (primeira passada):** contraste do tema claro corrigido e travado por teste (WCAG AA, 4,5:1), alvos de toque de 48 dp, ícone da aba fora do leitor de tela, dica do simulador anunciada. *(M)*
  - Ainda aberto: testar com TalkBack e com fonte do sistema grande **no aparelho**, e o teclado de flick, que só funciona por deslize e não tem alternativa para leitor de tela.
- [~] **Dados fora do HTML:** convenção registrada no README (conteúdo novo em `src/content/`, escrito à mão ou de fonte aberta, com testes de consistência, nunca em `src/data/`). O esquema concreto nasce com o vocabulário da Fase 1, para não ser desenhado no escuro. *(M)*

## 4. Fases de evolução

Esforço: **P** = dias, **M** = 1 a 2 semanas, **G** = várias semanas.

### Fase 1: vocabulário (maior ganho, começar por aqui)

Objetivo: saber o que as palavras *significam* e reconhecê-las ao ouvir e ler.

- [x] **Decks de vocabulário N5** (cerca de 600 a 800 palavras), organizados por tema (comida, família, tempo, lugares, verbos do dia a dia...) e por frequência de uso. *(G)*
  - Feito (1.3.0): a estrutura toda, as 179 palavras da especificação e **700 palavras da lista JLPT N5**, com significados traduzidos (revisão por um falante ainda pendente) e a fonte/licença documentadas em `src/content/LICENSE.md`. Falta confirmar a licença antes de publicar.
- [x] **Cartões em várias direções:** japonês → significado, significado → japonês, leitura, e ouvir → significado. Cada direção revisada separadamente. *(M)*
  - Feito: japonês → significado, significado → japonês, ouvir → palavra escrita (só kana) e **leitura** (palavra com kanji → como se lê, 4 opções). Para quem já tinha palavras aprendidas, os cartões de leitura chegam 6 por dia.
- [x] **Palavra ligada ao kanji:** ao estudar um kanji, mostrar as palavras que o usam; ao aprender uma palavra, destacar os kanji que a formam. *(M)*
- [x] **Cada palavra com:** leitura, significado em português, classe (substantivo, verbo, adjetivo), uma frase de exemplo com tradução e áudio. *(M)*
  - Feito: leitura, significado, romaji (quando a fonte traz), kanji da palavra, áudio, **tom** (gráfico), **classe** dos verbos (com o grupo) e dos adjetivos (い ou な) e até 2 **frases de exemplo** reais do Tatoeba (mais de 200 palavras têm). Depois (1.9.0): a **classe de 829 das 837 palavras** (substantivo, pronome, advérbio, numeral...) vem do JMdict.
- [x] **Palavras mais úteis primeiro:** ordenar por frequência e por situações reais (restaurante, transporte, compras, apresentação). *(P)*
  - Feito (1.9.0): em Palavras, a **ordem** pode ser a do livro ou **as mais usadas primeiro** (frequência medida em ~243 mil frases do Tatoeba), e dá para filtrar por **situação de viagem** (apresentação, restaurante, compras, transporte, hotel, ajuda e saúde), com a lista de palavras escolhida à mão entre as do vocabulário.
- [x] **Mnemônicos e notas:** campo para o aluno escrever a própria dica de memória em cada palavra. *(P)*
  - Feito: no cartão de cada palavra, **Escrever uma dica de memória** (até 200 letras, `progress.wordNotes`, também no backup).
- [x] **Expandir kanji:** completar o N5 e avançar para o N4, com as mesmas lições de traços, leituras e exemplos. *(G)*
  - Feito (1.9.0): de 102 para **284 kanji** (o N5 fica completo com 魚, e entram os 181 do N4), com leituras do KANJIDIC2, ordem dos traços do KanjiVG, 35 lições novas na trilha e o modo de escrita, tudo conferido por teste (os 427 itens com traços passam no corte do desenho). **Significados em português escritos por IA, a revisar.**

### Antes de publicar (pendência registrada)

O app é de **uso pessoal e privado**, então as licenças de conteúdo ainda não foram validadas. Antes de distribuir o app para outras pessoas, seguir a lista "Antes de publicar" em [`src/content/LICENSE.md`](src/content/LICENSE.md): confirmar a licença das listas do Tanos (ou trocar a fonte), cumprir o crédito do JMdict se for usado, **revisar as traduções com um falante** e escolher a licença do projeto.

### Fase 2: gramática ativa

Objetivo: transformar "li sobre は e が" em "uso は e が sem pensar".

- [~] **Completar o N5 gramatical** (cerca de 40 pontos): partículas, formas do verbo, adjetivos, pedidos, permissão, desejo, comparação, contadores. Hoje são 10 tópicos. *(G)*
  - Feito (30 tópicos): +20 tópicos (11 a 30) com explicação própria e 80 frases reais do **Tatoeba** (CC BY 2.0 FR) conferidas na fonte (`npm run verify-grammar`): でした/ではありません, adjetivos い e な no negativo e no passado, 〜てください, 〜ています, 〜ないでください, 〜てもいい, 〜てはいけません, 〜ましょう/ませんか, がほしい, より, いちばん, すき/じょうず, から/まで, から (motivo), palavras interrogativas, もう/まだ, posições, になる, できる. Fonte e crédito em `src/content/LICENSE.md`. Os exemplos viraram 59 exercícios de Montar e de Lacunas (todos os tópicos novos, menos o 19, têm o botão Praticar). Falta: ~10 pontos (contadores, ～前に/～後で, ～ながら, forma simples...) e a revisão das explicações por um falante. Depois: **+8 tópicos (31 a 38)**, também com frases do Tatoeba conferidas: 〜まえに, 〜てから e あとで, 〜ながら, 〜に いきます, frequência (いつも, よく, ときどき, あまり, ぜんぜん), 〜ましょうか (oferecer), だけ e なにか/だれか. Total: 38 tópicos. Depois (1.9.0): **tópico 40 (forma simples: dicionário, ない e た)** e **41 (dar e receber: あげる, もらう, くれる)**, achados com uma busca nas 249 mil frases do Tatoeba e conferidos na fonte; 〜ながら ganhou 2 exemplos e だけ ganhou 1. Total: **41 tópicos**.
- [~] **Exercícios de lacuna (cloze):** frases com um espaço para a partícula ou a forma correta, com explicação do erro. *(M)*
  - Feito: sub-aba **Lacunas** em Frases, com as frases do Montar (26) viradas em ~40 lacunas de partícula e de final da frase, tradução embaixo e a regra ao errar. Aceita as variações (に/へ, を/が). As frases do Tatoeba entraram nas lacunas (cerca de 100 no total, com から/まで/より também).
- [x] **Treinador de conjugação:** o app mostra o verbo e a forma pedida (ます, ない, て, た...) e o aluno escolhe ou digita. Revisão espaçada por verbo e por forma. *(M)*
  - Feito: sub-aba **Conjugar** em Frases, com ~110 verbos do vocabulário, 4 formas (ます, ない, て, た) geradas por regra, alternativas com os erros típicos (regra de outro grupo, final de て errado) e revisão espaçada por verbo e forma (`progress.conj`, também no backup). Depois: **digitar a resposta** (kanji ou kana, ao lado de "Escolher") e as formas **ませんでした, たい, ている e ましょう**, que entram na revisão aos poucos (6 cartões por dia) para os verbos já aprendidos. Falta só a forma de dicionário como pergunta.
- [~] **Treinador de partículas:** は/が, に/で, を, へ, と, も, de/para. É onde brasileiros mais erram, com treino de pares confusos. *(M)*
  - Feito: o filtro "Partículas" das Lacunas, com os pares confusos (は/を/も, に/で/を). Depois: **revisão espaçada por partícula** (`progress.particles`, também no backup): cada uma das 12 partículas é um cartão, a pergunta é uma lacuna de uma frase sorteada. Também há o tópico 39, **que faz**: a partícula が (sujeito novo, perguntas com だれ/なに, あります/います).
- [x] **Contadores e números:** leitura, datas, horas e preços, com áudio. *(M)*
  - Feito: sub-aba **Contar** em Frases. Números de 1 a 99.999, horas (よじ, しちじ, くじ, ふん/ぷん, はん), datas (ついたち... はつか), preços (よえん) e 11 contadores (人, つ, 本, 枚, 冊, 台, 匹, 個, 歳, 階, 回) de 1 a 10, tudo gerado por regra e tabela e conferido por testes. Dois modos: ler (ver a escrita, escolher a leitura) e ouvir. As respostas erradas são a regra sem a exceção (さんびゃく → さんひゃく). Inclui tabela de consulta.
- [x] **"Erros comuns de quem fala português":** notas curtas (ordem das palavras, sujeito omitido, falta de artigos e plural). *(P)*
  - Feito: 10 dicas gerais no topo da Gramática (verbo no fim, sujeito omitido, sem artigos, を não é "o", sim/não em pergunta negativa...) e notas por tópico (28 dos 30). Escritas por IA, **a revisar por um falante** antes de publicar (`src/content/pitfalls.ts`).
- [x] **Mini-teste por tópico:** só libera "dominado" depois de acertar sem consultar a explicação. *(P)*
  - Feito: botão em cada tópico, até 5 perguntas ("o que quer dizer?" com os exemplos e lacunas com as frases do Montar), sem a explicação à vista; 80% de acertos de primeira marcam o tópico como dominado (✓ na lista, contador no topo, `progress.mastered` e backup).

### Fase 3: montar e produzir frases

Objetivo: sair de reconhecer para **produzir**.

- [x] **Montar evoluído:** além de blocos prontos, escolher entre várias respostas válidas, com feedback do que mudou o sentido. Já aceita mais de uma ordem; ampliar a variedade. *(M)*
  - Feito: ao errar no Montar, **"O que mudou"** diz a causa (partícula trocada e o que cada uma faz, final do verbo trocado, bloco que sobra ou falta, ordem) e mostra as outras ordens que valem. Novo modo **Qual está certa?**: escolher entre frases parecidas, cada errada com um tipo de erro e a explicação de por que muda o sentido. As trocas de は/が/も ficam de fora, porque podem estar certas.
- [x] **Traduzir digitando:** do português para o japonês usando o teclado de flick do app ou o do celular, com correção tolerante (kana ou kanji, espaços, pontuação). *(G)*
  - Feito: sub-aba **Traduzir → Escrever**. Teclado do app (flick) ou do celular, à escolha. A conferência ignora espaços, pontuação, largura e hiragana/katakana, aceita kana ou kanji e as outras ordens do Montar, e mostra o que sobrou na digitação. Frases: ~130, da gramática, do Montar e de Viagem.
- [x] **Traduzir do japonês:** mostrar uma frase e pedir o sentido, com opções e depois resposta livre. *(M)*
  - Feito: **Traduzir → Entender (opções)** e **Entender (livre)**. No modo livre a pessoa escreve o que entendeu (opcional), vê a tradução e diz se acertou, porque português livre não dá para corrigir sozinho.
- [x] **Banco de frases com tradução:** frases de um corpus aberto (seção 6), filtradas pelo vocabulário que o aluno já conhece. Cada frase nova pode virar cartão. *(G)*
  - Feito: aba **Banco**. Frases reais do Tatoeba (CC BY 2.0 FR), cortadas em palavras por um léxico do app (vocabulário, verbos e adjetivos conjugados, partículas) e guardadas com as palavras que usam. Filtros: **que eu sei ler** (todas as palavras já aprendidas), **uma palavra nova** (com botão para aprender a palavra) e **qualquer uma**. Cada frase pode ser ouvida, praticada (Entender e Escrever, como em Traduzir) e **salva em Minhas frases** para entrar na revisão espaçada. `npm run collect-sentences` e `npm run build-sentences` refazem o banco.
- [x] **Minhas frases:** o aluno escreve frases próprias sobre a sua vida (eu moro em..., eu gosto de...). O app guarda e revisa. *(M)*
  - Feito: sub-aba **Minhas frases**. Escreve o japonês (teclado do app ou do celular) e o sentido em português, com ideias do que escrever; salva, edita, apaga e ouve. A revisão é espaçada e pede para escrever de memória, com a mesma conferência tolerante (`progress.myPhrases`, também no backup, até 300 frases). O app **não corrige** o japonês escrito pela pessoa: só confere se ela lembra.
- [x] **Diálogos curtos com escolhas:** cenas de restaurante, estação, hotel, loja. Em cada turno, o aluno escolhe ou monta a resposta. *(G)*
  - Feito: aba **Diálogos**, com 4 cenas (restaurante, loja, estação, hotel) e 20 respostas. Em cada turno o aluno escolhe a fala que cabe; as erradas dizem por que não servem naquele momento. Ajuda nas respostas (só japonês, romaji ou tradução). No fim da cena, dá para **escrever as próprias falas de memória**. As falas do aluno são as frases de Viagem; as do atendente são frases fixas de atendimento escritas para o app (**pendente de revisão por um falante**). `npm run build-dialogs` refaz `dialogs.ts`.
- [x] **Furigana e romaji ajustáveis:** mostrar, ocultar ou só ao toque, por nível de confiança. *(P)*
  - Feito: Ajustes → Leitura das frases. Romaji (sempre, ao tocar, nunca), escrever com kanji (liga a escrita normal nas frases da gramática, 76 delas) e furigana (sempre, ao tocar, nunca), com prévia. Vale para os exemplos da gramática, as frases de Viagem e as palavras. O furigana vem do Tatoeba e é conferido por `npm run verify-grammar`.

### Fase 4: escuta e fala

Objetivo: entender o japonês falado e conseguir se fazer entender.

- [x] **Ditado:** ouvir uma palavra ou frase e digitar. Corrige em kana e mostra a diferença. *(M)*
  - Feito: Ouvir → **Ditado**. Palavras (as que você já aprendeu, ou todas no começo) ou frases; a voz toca sozinha, com botão Devagar; digita com o teclado do app ou do celular; a conferência aceita kana ou kanji e mostra o que sobrou ou faltou; o sentido em português só aparece depois.
- [x] **Compreensão de frases e diálogos:** ouvir e responder perguntas de sentido, com velocidade normal e lenta. *(M)*
  - Feito (frases): Ouvir → **Compreensão**. A frase toca sem texto e você escolhe o sentido entre quatro traduções; velocidade normal ou lenta pelo controle do topo. Depois: em **Diálogos**, o modo **Só ouvir** esconde o texto da fala do atendente (ela toca sozinha) e a pessoa escolhe a resposta; o texto aparece ao toque.
- [x] **Áudio de melhor qualidade:** hoje a voz é a síntese do sistema. Avaliar áudio gravado por falantes nativos com licença livre, que também mostra o sotaque melhor. *(G)*
  - Feito: Ajustes → Voz japonesa lista as vozes japonesas do aparelho (as de melhor qualidade primeiro, marcando as online) e deixa **escolher e testar**; a escolha vale em todo o app. A voz automática passa a preferir a de melhor qualidade. Depois (1.9.0): **360 gravações de falantes nativos** do Lingua Libre (Wikimedia Commons; só CC0, CC BY e CC BY-SA, 9 falantes), cerca de metade do vocabulário, em mp3 mono pequeno (~3 MB). Tocam no lugar da voz do aparelho quando o texto é uma palavra gravada, também em velocidade lenta; opção em Ajustes → Sons e vibração; créditos em Ajustes → Sobre. As demais palavras e as frases seguem com a voz do aparelho. **Falta testar no aparelho.**
- [x] **Tom das palavras (pitch accent):** indicar a queda de tom das palavras mais comuns, com exemplos de pares. *(M)*
  - Feito: dados do **Kanjium** (CC BY-SA 4.0) para 538 palavras do N5. O cartão da palavra mostra o gráfico do tom (barra alta e baixa por mora, mais a partícula depois). Ouvir → **Tom**: explicação, 12 pares que só o tom separa (はし, あめ...) e um quiz de onde o tom cai. O app não afirma que a voz do sistema marca o tom.
- [x] **Gravar e comparar (shadowing):** gravar a própria voz e ouvir ao lado do modelo, com a forma de onda. É a evolução do "Repetir" atual, que só tem autoavaliação. *(M)*
  - Feito: em Ouvir → Repetir, cada frase tem **Gravar a minha voz e comparar** (`expo-audio`, pede a permissão do microfone). Mostra a onda do que você gravou (ritmo e pausas, não pronúncia) e botões para ouvir o modelo e a sua voz, um depois do outro. A gravação fica só no aparelho e não entra no backup. O modelo é a voz do sistema, que não gera arquivo, por isso a onda é só da sua voz. **Falta testar no aparelho.**
- [x] **Reconhecimento de fala em japonês:** pedir ao aluno para dizer a frase e conferir com o reconhecimento do Android. Exige módulo nativo, que o build local já suporta. Resultado aproximado, usado como guia e não como nota. *(G)*
  - Feito (precisa ser testado no aparelho): Ouvir → **Falar**, com `expo-speech-recognition` (MIT, usa o reconhecimento do Google no Android). Mostra o sentido em português, você diz a frase e o app compara o que ouviu (até 5 alternativas) com as formas aceitas, com o mesmo critério tolerante da digitação. Só entram frases com a escrita em kanji, porque o reconhecedor devolve kanji. O resultado é guia, não nota, e a tela avisa que a voz vai ao serviço de reconhecimento do aparelho.

### Fase 5: leitura

Objetivo: ler textos reais e ganhar vocabulário em contexto.

- [x] **Textos graduados:** historinhas e diálogos curtos escritos para o nível (N5, depois N4), com áudio. *(G)*
  - Feito (1.9.0): Frases → **Leitura**, com 5 textos curtos (N5) escritos por IA só com palavras do vocabulário (um teste confere que todo texto é cortado pelo léxico do app), tradução por frase e áudio. **Escritos por IA, a revisar por um falante.** N4 e áudio gravado por texto ficam para depois.
- [x] **Toque na palavra:** mostra leitura, significado e classe a partir de um dicionário offline (seção 6). *(G)*
- [x] **Palavra desconhecida vira cartão** com um toque, já com a frase de onde veio. *(M)*
- [x] **Furigana opcional** e destaque das palavras já aprendidas, para o aluno enxergar o quanto já entende. *(M)*
- [x] **Leitura do dia a dia:** cardápios, placas, avisos e horários de trem, para treinar o que se encontra em viagem. *(M)*
  - Feito (1.9.0): cardápio, aviso e horário de estação e horário de biblioteca, com o lugar onde se vê cada um (escritos por IA, a revisar). Faltam mais exemplos (placas, preços em lojas).
- [ ] **Câmera para ler (opcional):** apontar para um texto e ver as leituras. Depende de OCR no aparelho e deve ser avaliado com cuidado. *(G)*
  - Avaliado e **não feito**: exige OCR de japonês no aparelho (módulo nativo e modelo grande) e não há como testar sem um celular conectado. Fica para quando houver aparelho de teste.

### Fase 5b: fluidez de leitura de kana

- [x] **Treino cronometrado de kana:** ler e reconhecer rápido, o que separa "sei" de "leio sem pensar". *(P)*
  - Feito (1.9.0): Teclado → **Velocidade**, 20 kana seguidos (os que você já estuda; se forem poucos, os básicos), com a média de tempo dos acertos e um recorde pessoal (só vale com mais de 80% de acertos).
- [x] **Katakana de palavras estrangeiras:** treinar com palavras de origem inglesa (コーヒー, ホテル) para ligar a escrita ao som. *(P)*
  - Feito (1.9.0): Frases → **Katakana**, com as palavras do vocabulário escritas só em katakana: escolher o romaji (as erradas são os tropeços típicos, シ/ツ, ソ/ン, ー e ッ) ou o significado.

### Foco: estrutura da frase, viagem e dia a dia (1.12.0)

Pedido do aluno: aprender como a frase se monta, montar frases e ter frases e diálogos para a viagem e para o dia a dia.

- [x] **Mais frases de viagem e de dia a dia:** de 37 para 188, em 15 categorias (Básico, Apresentação, Dia a dia, Aeroporto, Direções, Transporte, Restaurante, Compras, Conbini, Hotel, Dinheiro, Saúde, Telefone e internet, Atrações, Ajuda). Todas com romaji, tradução e "Palavra por palavra"; entram também em Ouvir → Repetir e em Traduzir. Fonte: `scripts/travel/phrases.mjs` (`npm run build-travel`). **Escritas por IA, a revisar por um falante.**
- [x] **Mais diálogos:** de 4 para 13 cenas (imigração, táxi, conbini, pedindo o caminho, farmácia, comprando roupa, conhecendo alguém, bar japonês, problema no quarto), cada uma com respostas erradas que explicam o porquê. As falas do aluno vêm das frases de viagem; as do atendente são escritas por IA, a revisar.
- [x] **Montar com frases de viagem:** Frases → Montar ganhou uma segunda fileira com as categorias de viagem (147 exercícios, blocos tirados do "Palavra por palavra", sem japonês novo).
- [x] **Estrutura da frase** (Frases → Estrutura): o mapa da frase (blocos "palavra + partícula", verbo no fim), as frases de viagem abertas em blocos coloridos pelo papel (tema, objeto, lugar, alvo, fim da frase...) e um treino "Qual é o papel?".
- [x] **Frases-modelo** (Frases → Modelos): 13 moldes com uma lacuna ([coisa] を ください, [lugar] は どこ ですか, [comida] の アレルギーが あります...) e um desafio de escolher a frase certa para uma tradução.
- [x] **Textos de leitura de placas, avisos e cardápios reais** (1.13.0): Frases → Leitura → Dia a dia ganhou 9 textos (placas da estação, avisos e proibições, horários de loja, cardápio de lámen, preços e impostos, banheiros e onsen, regras no transporte, conbini e supermercado). Usam kanji de verdade; cada pedaço da frase é tocável e mostra a leitura e o significado. Escritos por IA, a revisar por um falante.
- [ ] **Para depois:** mais moldes (horas, datas, pedidos mais longos), diálogos com a fala do atendente também para escolher e vozes diferentes por papel.

### Perfil, introdução e lembretes (1.13.0)

- [x] **Introdução na primeira abertura** (e na primeira depois da atualização): nome de usuário, apresentação das funções, meta de minutos por dia, dia de folga e lembretes. Pode ser pulada; dá para rever em Ajustes → Você → Rever a introdução.
- [x] **Meta de minutos por dia:** o app conta o tempo de uso ativo (toques nos últimos 60 s, só com o app aberto) e mostra o progresso em "Sessão de hoje". A meta de minutos também ajusta a meta diária de respostas.
- [x] **Lembretes com a meta:** "Você ainda não completou seus 20 minutos hoje! Faltam X min.", "Não esqueça de aprender algo novo hoje!", com o nome da pessoa. O aviso da noite só sai se a meta ainda não foi batida; o dia de folga não tem lembrete.
- [x] **Ajustes mais simples:** lembretes viraram três jeitos prontos (sem, leves, normais) e horários prontos, com o resto em "Personalizar"; o perfil (nome, meta, folga) fica no topo; voz, revisão, exibição, sons e dados ficam em seções que abrem com um toque.
- Limite conhecido: o tempo de uso não conta o que a pessoa faz fora do app, e o nome e a meta não entram no backup (são preferências do aparelho).


### Mochi: loja, baús e raridades (1.14.0)

- [x] **Economia mais difícil:** o teto diário de pétalas de lição e revisão caiu de 150 para 60, lições e revisões pagam cerca de metade, missões 6 (antes 10), o desafio da semana 25 (antes 40) e subir de nível dá menos. Os preços da loja subiram 2,5 vezes (150 a 900 pétalas).
- [x] **Baú do dia:** ao abrir o app pela primeira vez no dia aparece o baú, com revelação animada: pétalas (8 a 80, mais um bônus pela sequência) e, às vezes, um item exclusivo. Se a pessoa fechar com "Depois", o baú continua esperando (cartão na tela inicial). Sem item por 6 dias seguidos, o próximo traz um item raro ou melhor.
- [x] **Baú da semana:** quando a meta de 4 dias é batida, abre com o mesmo efeito, sempre com pétalas e um item exclusivo (raro, épico ou lendário), e nunca repete um item que já se tem.
- [x] **Raridades:** comum, raro, épico e lendário em todos os itens, com cores e estrelinhas.
- [x] **111 itens** (eram 45): novos acessórios de cabeça, rosto e pescoço, 10 fundos, 8 cores e uma categoria nova, as **peles** (listras, manchas, estrelas, corações, ondas e as raras: panda, robô, dragão, fantasma, cósmico, coruja, sensei). 22 itens só saem de baú e 29 só por conquista (14 conquistas ganharam item).
- [x] **Loja redesenhada:** categorias (cabeça, rosto, pescoço, fundos, cores, peles e coleção rara), filtros (todos, posso comprar, meus), ordem (padrão, menor preço, raridade), cartões com o Mochi vestido com cada item, raridade e preço, prévia grande com confirmação de compra e chuva de pétalas ao comprar. Os itens de baú e de conquista aparecem trancados.
- [x] **Mochi com mais vida:** 7 humores novos (com sono, surpreso, apaixonado, pensando, orgulhoso, piscando, animado), piscadas, animações próprias por humor e reações ao toque (pula, gira, se espreme e muda de humor por um instante).
- [x] **Humor pela situação:** com sono de madrugada, orgulhoso quando a meta de minutos é batida, apaixonado com sequência de 30 dias ou mais, pensativo quando a sequência espera.

### Fase 6: motor de aprendizado e plano diário

Objetivo: o app decide o que estudar hoje e mede o que realmente ficou.

- [~] **Algoritmo de revisão melhor:** trocar as caixas fixas (1, 3, 7, 14, 30 e 60 dias) por um modelo que ajusta o intervalo à dificuldade de cada item (como o FSRS, de código aberto). Mantém a importação do progresso antigo. *(G)*
  - Feito em parte (1.10.0): cada item guarda quantas vezes foi **esquecido**; o intervalo encolhe 10% por esquecimento (até 40%) e quem chega à caixa 3 sem tropeçar "perdoa" um esquecimento. Entra no backup (campo opcional, backups antigos continuam valendo). **Não é o FSRS completo** (as caixas continuam): trocar por um modelo de estabilidade/dificuldade fica para depois, com dados reais de uso para calibrar.
- [x] **Sessão diária guiada** de 15 a 20 minutos: revisões, 1 conteúdo novo, 1 exercício de escuta, 1 frase para produzir. Tem começo, meio e fim. *(M)*
  - Feito (1.10.0): card **Sessão de hoje** na tela inicial, em quatro passos (revisar o que venceu, algo novo, ouvir, uma frase), marcados pelo que já foi feito hoje; cada passo leva à tela certa.
- [x] **Limites e metas:** quantos itens novos por dia, revisões máximas, meta semanal. Evita acumular uma pilha desanimadora de revisões. *(P)*
  - Feito em parte (1.8.0): **meta diária de respostas** (5, 10, 20 ou 40) e **meta semanal de dias** (4 de 7). Depois (1.9.0): **limites por dia** de itens novos (5, 10, 20) e de respostas de revisão (30, 60, 100), em Meu Mochi → Metas. São limites macios: ao chegar neles o app avisa e deixa continuar se a pessoa quiser.
- [x] **Mistura de tipos de exercício** (intercalar kana, vocabulário, gramática) em vez de blocos longos do mesmo tipo. *(M)*
  - Feito (1.11.0): **Revisão mista** (rota `/mixed`, aberta pelo primeiro passo da Sessão de hoje quando há kana e outros tipos vencidos): kana, palavras e verbos vencidos intercalados em rodízio, 20 perguntas, cada resposta reagenda o cartão dela. Partículas ficam de fora por enquanto.
- [x] **Itens "teimosos" (leeches):** detectar o que o aluno erra sempre e propor outra abordagem (mnemônico, exemplo novo, quebrar em partes). *(M)*
  - Feito (1.10.0): com 4 esquecimentos ou mais e ainda nas caixas 1 e 2, o item aparece no card **Itens teimosos** (kana, palavras, verbos e partículas) com uma outra abordagem por tipo, e volta mais cedo na revisão.
- [x] **Estatísticas por habilidade:** leitura, escrita, escuta, fala e vocabulário, com retenção real (% que continua lembrando após semanas). *(M)*
  - Feito (1.11.0): Meu Mochi → Resumo → **Por habilidade** (kana e kanji, vocabulário, gramática, escuta, fala e tom, frases) e **Retenção**: % de acertos em cartões maduros (caixa 4 ou mais, ou seja, que só voltam depois de 2 semanas), mostrada a partir de 10 respostas. A contagem começa na 1.10/1.11, não há histórico anterior. Escrita (desenho) ainda não tem contagem própria.
- [x] **Metas por nível:** caminho N5 → N4 → N3 com marcos claros ("sabe 800 palavras e 40 pontos de gramática"). *(M)*
  - Feito em parte (1.10.0): Meu Mochi → Metas → **Caminho por nível**, com marcos N5 (kana, palavras, kanji firmes) e N4 (kanji firmes). Depois (1.11.0): marcos de **verbos** com a conjugação em estudo e de **tópicos de gramática dominados** (mini-teste).
- [x] **Teste de nivelamento** para quem já sabe parte do conteúdo e quer pular. *(M)*
  - Feito (1.11.0): 20 kana e 15 palavras; o que for acertado de primeira pode entrar na revisão como firme (caixa 3, primeira revisão em uma semana), só depois de confirmar. Não pula lições da trilha nem cobre kanji, verbos e gramática. Botão em Meu Mochi → Metas → Caminho por nível.
- [x] **Lembretes** no horário que o aluno escolher, sem insistir demais. *(P)*
  - Feito (1.8.0): lembretes **locais** (sem servidor) em Ajustes → Lembretes: horário, dias, aviso da noite quando a sequência está em risco, horário de silêncio e teste. Quem passa dias sem abrir recebe menos avisos, nunca cobrança. Precisa de permissão de notificação (Android 13+).

### Fase 7: motivação e vínculo com o Mochi

Objetivo: dar vontade de voltar, sem pressão tóxica.

- [x] **Mochi que acompanha o progresso:** muda de humor com a constância, ganha acessórios ao atingir marcos. *(M)*
  - Feito em parte (1.8.0): **45 itens** (acessórios na cabeça, no rosto e no pescoço, fundos e cores), vestidos em todas as telas, com **armário, loja** (pétalas), itens de temporada e roupa de época automática. Depois (1.9.0): o **humor do Mochi** acompanha a constância (festa com 7+ dias seguidos, feliz depois de estudar, tranquilo antes, um pouco de saudade depois de 4 dias sem estudar), com uma frase na tela Meu Mochi, sem cobrança.
- [x] **Conquistas** ligadas a hábitos bons (7 dias seguidos, 100 palavras, primeira frase própria). *(P)*
  - Feito (1.8.0): **42 conquistas** (algumas escondidas) com pétalas e 15 itens exclusivos, estante com progresso, e **níveis** com título (Broto a Mestre do Dojo).
- [x] **Desafio da semana:** pequena meta temática (por exemplo, vocabulário de comida). *(P)*
  - Feito (1.8.0): um grupo de vocabulário por semana (30 acertos); mais as **missões do dia** (3) e o **baú da semana**.
- [x] **Recomeço sem culpa:** depois de uma pausa, o app reduz a pilha de revisões e ajuda a retomar. *(M)*
  - Feito (1.8.0): boas-vindas e **revisão leve** (10 itens) para quem volta depois de 4 dias ou mais, e **salvar a sequência** com uma revisão de 25 perguntas (70% mantém), uma vez por semana. Dias de descanso não quebram a sequência.
- [x] **Resumo semanal** do que foi aprendido e do que precisa de atenção. *(P)*
  - Feito (1.8.0): Meu Mochi → Resumo, com calendário, recorde, retrospectiva da semana e do mês e texto para compartilhar.

### Extra: Explorar frases (1.15.0)

- [x] **Banco de 30 mil frases de falantes para folhear e buscar, tudo no aparelho.** *(G)*
  - Feito (1.15.0): em Frases → Explorar, 30 mil frases do Tatoeba com tradução em português (diretas ou pelo inglês), no nível do vocabulário do app, com furigana, romaji e voz. Busca por palavra (kanji, kana ou katakana, até conjugada) ou por um trecho em português, "Sortear frases" e "Salvar nas minhas frases". O banco é um SQLite de 9 MB empacotado no app (`assets/sentences.db`, gerado por `scripts/example-sentences/build.mjs`); não há servidor. Fonte e limites em `src/content/LICENSE.md`. Falta: revisão por um falante das leituras e das traduções livres.

### Extra: áudio, missões e validação (1.16.0)

- [x] **Áudio que não toca:** toda fala chega à voz com pelo menos 3 letras, repete se a voz falhar, e há um diagnóstico de som nos Ajustes. Falta confirmar no aparelho; se algo ainda ficar mudo, o próximo passo é gravações de falante nativo para os kana e as palavras curtas. *(M)*
- [x] **Missões mais variadas:** 24 missões em 3 dificuldades (desempenho, ritmo, variedade, itens errados, tempo). Falta: missões em cadeia, peso pelas áreas em que você está mais fraco e missões por horário. *(M)*
- [x] **Validar traduções online:** LaBSE + NLLB-200 no computador (`scripts/validate-translations/`), relatório em `docs/validacao-traducoes.md`. Tirou 5% das frases do Explorar; não serve para as frases curtas em kana. *(M)*

### Fase 9: simulador de teclado 2.0 (2.0.0)

Objetivo: digitar japonês de verdade, com conteúdo ilimitado e treino do que cada pessoa mais erra. Tudo offline.

- [x] **Fonte de conteúdo automática:** o simulador sorteia leituras do vocabulário, frases do app (gramática, Montar, viagem), Minhas frases e frases da IA, só as que o teclado de flick consegue digitar. De 14 palavras fixas para milhares de itens. *(M)*
- [x] **Níveis de dificuldade:** 6 níveis (primeiras fileiras, todas as fileiras, ゛゜, letras pequenas, palavras longas, frases); cada um libera depois de 8 itens no anterior. *(M)*
- [x] **Modo frase:** frases inteiras com a tradução embaixo, com ou sem dica de tecla. *(P)*
- [x] **Barra de sugestões simulada (Conversão):** digite a leitura e escolha o kanji ou o katakana certo, com as palavras de mesma leitura entre as opções, como no Gboard. *(M)*
- [x] **Mapa de calor por tecla:** erros e tempo médio por tecla (Desempenho). *(M)*
- [~] **Revisão espaçada por tecla e direção:** feita em parte, no modo **Pontos fracos**, que escolhe itens com as letras em que você mais erra. Falta agendar a volta de cada letra como cartão da revisão. *(M)*
- [~] **Métricas:** letras por minuto (média e recorde) e precisão por tecla, no simulador. Falta levar para Meu Mochi → Por habilidade e criar uma meta diária de digitação. *(P)*
- [x] **Digitação livre:** escreva o que quiser e veja o romaji e as palavras que o vocabulário conhece com aquela leitura. *(P)*
- [~] **Mais variedade:** pares confusos (シ/ツ, ソ/ン) já aparecem nas frases e na conversão; faltam séries dirigidas de pontuação e números. *(P)*

### Fase 10: IA opcional (2.0.0)

Objetivo: usar IA para o que o app não consegue sozinho (corrigir, explicar, criar conteúdo sob medida), **sem nunca depender dela**. Regras: a pessoa cadastra a própria chave (Gemini ou Claude) em Ajustes → IA; a chave fica no armazenamento seguro do aparelho e **fora do backup**; a IA gera só texto (o áudio continua sendo a voz do aparelho); sem chave ou sem internet o app funciona como sempre; todo conteúdo gerado é marcado como "gerado por IA, pode errar" e nada entra no conteúdo base nem na revisão sem a pessoa salvar.

**Infraestrutura**

- [x] **Provedores:** Gemini e Claude, por `fetch` direto (modelos baratos por padrão, campo de modelo livre). *(M)*
- [x] **Chave segura:** `expo-secure-store`, fora do backup `MDJ1:` (um teste garante). *(P)*
- [x] **Cache e limite diário:** respostas repetidas não gastam a IA; limite de pedidos por dia e contagem de tokens à vista. *(P)*
- [x] **Erros claros:** chave recusada, limite, sem internet, tempo esgotado, resposta fora do formato, tudo em português. *(P)*
- [ ] **Mais provedores:** OpenAI/GPT e modelos locais, cada um é só um adaptador novo em `providers.ts`. *(P)*
- [ ] **Fila offline:** guardar pedidos feitos sem internet e enviar quando voltar. *(M)*

**Funcionalidades**

| # | Funcionalidade | Estado |
| --- | --- | --- |
| 1 | **Corrigir minhas frases** | [~] Feito em Minhas frases (correção, versão mais natural e o porquê, com "usar a frase corrigida"). Falta em Traduzir → Entender (livre) e no diário. |
| 2 | **Botão "Por quê?"** | [~] Feito nos erros dos quizzes de alternativas, nos exercícios de escrita e, com campo de dúvida livre, em cada tópico de gramática. Falta no Montar, nas Lacunas e na Conjugação. |
| 3 | **Frases sob medida para o simulador** | [x] Simulador → IA: tema à escolha, frases em hiragana validadas para o teclado de flick, usando o vocabulário que você já aprendeu e avisando de palavra fora dele; ficam guardadas para treinar offline. Cada frase guardada tem "Salvar em Minhas frases". |
| 4 | **Conversa por texto (roleplay)** | [x] Frases → ✨ IA → Conversa: 6 cenas (restaurante, loja, estação, hotel, conhecer alguém, bate-papo), a IA responde em japonês simples, a voz do aparelho fala, você digita no teclado do app ou do celular. Cada frase sua é corrigida na hora, há ideias de resposta, tradução sob demanda e um resumo final para salvar as corrigidas. Limite de 12 falas por conversa. Falta: cenas escolhidas pelo aluno e reconhecimento de fala como entrada. |
| 5 | **Explicar qualquer texto japonês colado** | [x] Frases → ✨ IA → Explicar texto: tradução, leitura, palavras e gramática, com áudio e "Salvar a frase" (vira cartão em Minhas frases). Falta receber o texto direto pelo compartilhar do Android. |
| 6 | **Diário curto** | [x] Frases → ✨ IA → Diário: de 1 a 3 frases por dia, corrigidas com o porquê, tradução e áudio; "Salvar" leva a corrigida para Minhas frases (revisão). Os diários anteriores ficam guardados. (Cumpre o "Diário em japonês" da Fase 8.) |
| 7 | **Textos graduados sob medida** | [ ] Historinhas com seus temas e só com palavras que você conhece, com tradução por frase. |
| 8 | **Mnemônico para itens teimosos** | [ ] A IA escreve a dica de memória em português para o kana, kanji ou palavra que você sempre esquece. |
| 9 | **Feedback de fala em texto** | [ ] A IA compara o que o reconhecimento de fala entendeu com a frase-alvo e explica o provável erro, sem gerar áudio. |
| 10 | **Diálogos novos** | [ ] Gerador de cenas além das 13 atuais, com respostas erradas que explicam o porquê. |
| 11 | **Treinador de registro** | [ ] Reescreve a mesma frase em casual, educado e formal e explica quando usar cada uma. |
| 12 | **Resumo semanal do coach** | [ ] Lê só as estatísticas agregadas (retenção, habilidades, teimosos) e sugere o foco da semana. Nenhum conteúdo pessoal sai do aparelho. |
| 13 | **Simulado estilo JLPT** | [ ] Questões de gramática e vocabulário por nível, com gabarito comentado. |

### Fase 8: fora do app (onde a fluência acontece de verdade)

O app prepara, mas a fluência vem de **usar** o japonês. Esta fase é mais um guia do que código.

- [ ] **Guia de imersão por nível:** que tipo de áudio, vídeo e leitura consumir a cada nível, e como usar legendas em japonês. *(P)*
- [ ] **Hábito de conversa:** como encontrar tutor ou parceiro de intercâmbio, e um roteiro de apresentação e perguntas para a primeira conversa. *(P)*
- [ ] **Diário em japonês:** uma frase por dia, guardada no app e revisada depois. *(M)* Ver também a Fase 10 (item 6), com correção por IA.
- [ ] **Exportar cartões** (por exemplo, para Anki) para quem quiser continuar em outra ferramenta. *(M)*
- [ ] **Conversa com o Mochi (experimental)** (agora planejada na Fase 10, item 4): treino de conversa com um modelo de linguagem. Exige internet, tem custo e pode errar o japonês, então só entra como opcional, com aviso claro e revisão do conteúdo. *(G)*

## 5. Ordem sugerida

Se for preciso escolher, esta ordem dá o maior ganho de aprendizado por esforço:

1. **Fase 0:** corrigir o que está quebrado e proteger o progresso (exportar backup).
2. **Fase 1:** vocabulário, o maior buraco do app hoje.
3. **Fase 2 (partículas e conjugação):** gramática que se pratica, não só se lê.
4. **Fase 6 (sessão diária e metas):** transforma tudo em hábito. Quanto antes, melhor, porque organiza o que vem depois.
5. **Fase 3 (produzir frases) e Fase 4 (ditado, gravar e comparar).**
6. **Fase 5 (leitura)** e o restante.

Uma versão enxuta que já mudaria bastante o aprendizado: **Fase 0 + vocabulário N5 + treinador de partículas e conjugação + sessão diária.**

## 6. Conteúdo, fontes e licenças

O app só deve ter conteúdo cuja origem seja conhecida. Fontes abertas costumam servir, **mas a licença e o crédito precisam ser conferidos e registrados antes do uso** (como já é feito com o KanjiVG em `src/data/strokes/LICENSE.md`).

| Necessidade | Fontes possíveis | Atenção |
| --- | --- | --- |
| Dicionário e vocabulário | JMdict e KANJIDIC2 (projeto EDRDG) | Licença que exige crédito e compartilhamento igual; conferir os termos exatos |
| Frases com tradução | Tatoeba | Licença de crédito; filtrar por qualidade e por tradução para o português |
| Listas por nível JLPT | Listas abertas da comunidade | Não há lista oficial; checar a licença de cada lista |
| Traços de kanji | KanjiVG (já usado) | CC BY-SA 3.0, já creditado |
| Áudio nativo | Gravações com licença livre | Conferir licença e se permitem uso em app |

Qualquer texto em japonês **escrito por nós** (explicações, diálogos, leituras) precisa de revisão por um falante ou por uma fonte confiável antes de entrar, para não ensinar erros.

## 7. Notas técnicas para quando for implementar

- **Dados:** mover o conteúdo novo para arquivos próprios com esquema tipado e testes de consistência (por exemplo: toda palavra tem leitura, todo kanji citado existe no catálogo).
- **Armazenamento:** o progresso hoje é chave-valor. Vocabulário, frases próprias e histórico de revisões pedem tabelas em SQLite (`expo-sqlite` já está no projeto).
- **Migração segura:** qualquer mudança no formato do progresso precisa migrar o que já existe (como foi feito na troca de nome do app) e manter o backup antigo importável.
- **Módulos nativos:** gravação de áudio, reconhecimento de fala e lembretes exigem build nativo. O build local já existe (`gerar-apk.bat`); o Expo Go não basta.
- **Desempenho:** dicionário completo é grande. Avaliar um recorte (só o vocabulário até o N4) ou um banco comprimido carregado sob demanda.
- **Testes:** manter a regra de rodar `tsc`, Jest e lint antes de cada commit, e adicionar testes para toda lógica nova de revisão e correção.
- **Mudanças grandes** (algoritmo de revisão, novo formato de progresso) merecem uma etapa própria, com um commit por etapa, como já é o fluxo do projeto.

## 8. Como saber se está funcionando

- **Retenção real:** dos itens revisados depois de 30 dias, quantos o aluno ainda acerta (meta inicial: acima de 80%).
- **Constância:** dias estudados por semana e quantas sessões diárias foram concluídas.
- **Cobertura:** vocabulário e gramática dominados em relação ao nível-alvo.
- **Uso ativo:** frases produzidas por semana (montadas, digitadas e faladas), não só reconhecidas.
- **Teste externo:** simulados do JLPT N5 e N4 e conversas reais, que dizem mais do que qualquer métrica interna.

## 9. Fora do escopo por enquanto

- Versão para iPhone e publicação em loja (pendente da confirmação do `applicationId`).
- Contas, nuvem e sincronização entre aparelhos (o app é pessoal e offline; a exportação de progresso cobre a troca de celular).
- Competição entre usuários e rankings.
- Conteúdo de níveis acima do N3.
