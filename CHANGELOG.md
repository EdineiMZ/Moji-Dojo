# Changelog

Cada versão do app tem uma entrada aqui. A política de versões (quando aumentar MAIOR, MENOR ou CORREÇÃO) está em `scripts/versioning.cjs`, e um teste falha se a versão, o `versionCode` e este arquivo divergirem. Para uma versão nova: `npm run version:bump -- <patch|minor|major>`.

## [1.11.0] - 2026-10-23

Fase 6 quase completa (só falta trocar o algoritmo por FSRS) e conferência da Fase 7. Tudo no aparelho.

- **Revisão mista:** kana, palavras e verbos vencidos intercalados em uma sessão de 20 perguntas, em vez de blocos longos do mesmo tipo. O primeiro passo da Sessão de hoje leva para ela quando há mais de um tipo vencido.
- **Por habilidade** (Meu Mochi → Resumo): acertos em kana e kanji, vocabulário, gramática, escuta, fala e tom, e frases. A contagem começa nesta versão.
- **Retenção:** % de acertos nos cartões maduros (os que só voltam depois de 2 semanas ou mais), a partir de 10 respostas.
- **Caminho por nível:** agora com verbos em estudo e tópicos de gramática dominados, além de kana, palavras e kanji.
- **Teste de nivelamento** (Meu Mochi → Metas → Caminho por nível): 20 kana e 15 palavras; o que você acertar de primeira pode entrar na revisão como firme, só depois de você confirmar.
- Fase 7 conferida: todos os itens já estavam entregues na 1.8.0 e 1.9.0 (Mochi, conquistas, desafio da semana, recomeço sem culpa e resumo).

## [1.10.0] - 2026-10-23

Fase 6 (em parte): o app passa a organizar o dia e a perceber o que você não está fixando. Tudo no aparelho.

- **Sessão de hoje** (tela inicial): quatro passos de uns 15 a 20 minutos (revisar o que venceu, algo novo, ouvir, produzir uma frase), marcados pelo que você já fez no dia. Cada passo leva à tela certa.
- **Revisão que aprende com os erros:** cada item guarda quantas vezes foi esquecido. O que você esquece volta mais cedo (o intervalo encolhe até 40%), e quem chega à caixa 3 sem tropeçar "perdoa" um esquecimento. Entra no backup; backups antigos continuam valendo. As caixas continuam, não é o FSRS completo.
- **Itens teimosos:** o que você esquece 4 vezes ou mais e ainda está nas caixas 1 e 2 aparece num card com outra abordagem para cada tipo (kana, palavra, verbo, partícula).
- **Caminho por nível** (Meu Mochi → Metas): marcos do N5 (kana, palavras e kanji firmes) e do N4 (kanji firmes).

## [1.9.0] - 2026-10-23

Vocabulário, kanji, gramática, áudio nativo, leitura e treinos de fluência. Tudo funciona no aparelho, sem servidor.

- **Prévia da compra:** na loja do Mochi, o cartão do item mostra o Mochi vestido com ele e pede confirmação antes de gastar as pétalas.
- **Desenho de caracteres mais gentil:** a nota mínima para acertar sobe com a prática. Num caractere novo basta 50%, e a régua sobe 5 pontos por caixa de revisão até os 70% de quem já domina. Errar derruba a caixa e a régua volta a ser mais branda.
- **Vocabulário:** classe gramatical de 829 das 837 palavras (JMdict), ordenação por frequência de uso (Tatoeba) e estudo por situação de viagem.
- **Kanji:** de 102 para 284 (N5 completo e N4), com leituras do KANJIDIC2, ordem dos traços do KanjiVG e 35 lições novas. Os significados em português dos kanji novos foram escritos para o app e precisam de revisão.
- **Gramática:** tópicos novos de forma simples e de dar e receber (あげる, もらう, くれる), e mais exemplos de ながら e だけ.
- **Limites por dia** de palavras novas e de respostas de revisão (Meu Mochi → Metas), macios: o app avisa e deixa continuar. O humor do Mochi agora reflete a constância (estudou hoje, sequência, dias sem estudar).
- **Áudio de falantes nativos:** 360 gravações do Lingua Libre (Wikimedia Commons, CC0, CC BY e CC BY-SA) tocam no lugar da voz do aparelho nas palavras que as têm, inclusive em velocidade lenta. Opção em Ajustes → Sons e vibração; créditos em Ajustes → Sobre. Falta testar no aparelho.
- **Leitura (Frases → Leitura):** 5 textos curtos e 3 leituras do dia a dia (cardápio, aviso e horário de estação, biblioteca), com toque na palavra (leitura, significado e classe), leitura sobre o kanji opcional, destaque do que você já estuda, tradução por frase, áudio e "Aprender esta palavra" (a frase vira nota da palavra). Textos escritos por IA, a revisar por um falante.
- **Katakana (Frases → Katakana):** treino com as palavras do vocabulário escritas em katakana: escolher o romaji (alternativas erradas são os tropeços típicos, シ/ツ, ソ/ン, ー e ッ) ou o significado.
- **Velocidade (Teclado → Velocidade):** 20 kana seguidos com a média de tempo dos acertos e recorde pessoal.
- Leitura por câmera (OCR) foi avaliada e não foi feita: precisa de um aparelho de teste.

## [1.8.0] - 2026-10-23

Mochi, pétalas e hábito: a parte do app que ajuda a voltar todo dia. Tudo funciona no aparelho, sem servidor.

- **Meu Mochi** (toque no Mochi da tela inicial ou em Ajustes): o Mochi grande com a roupa atual, nível e pontos; armário, loja, conquistas, metas e resumo.
- **45 itens para o Mochi:** chapéus, óculos, máscaras, cachecóis, fundos e cores. 24 na loja, 16 só por conquista ou baú, e 5 de temporada (fim de ano, Setsubun, sakura, Tanabata e abóbora), que só se compram na época. O Mochi aparece vestido em todas as telas, e a roupa de época pode ser vestida sozinha.
- **Pétalas:** ganhas ao abrir o app (baú do dia), concluir lições (quanto mais perfeita e quanto mais lições perfeitas seguidas, mais), revisões, missões, desafios e conquistas. Há um teto diário para lição e revisão, e repetir a mesma lição vale metade.
- **Sequência:** abrir o app ou estudar conta como dia. Quem perde de 1 a 3 dias de uma sequência de 3 ou mais pode **salvá-la** com uma revisão de 25 perguntas sobre o que errou há pouco: com 70% a sequência continua (uma vez por semana). Dias de descanso escolhidos não quebram a sequência, e o recorde fica guardado.
- **Metas:** meta diária de respostas (5 a 40), três missões por dia, meta semanal de 4 dias com baú (e um item em semanas alternadas), e um desafio temático por semana.
- **Conquistas e níveis:** 42 conquistas (algumas escondidas) com pétalas e, em 15 delas, um item exclusivo; níveis com título, de Broto a Mestre do Dojo, com pétalas de presente a cada nível.
- **Resumo:** calendário de estudo, recorde, retrospectiva da semana e do mês, e texto para compartilhar (só números).
- **Recomeço sem culpa:** depois de 4 dias ou mais sem estudar, o app recebe você com uma revisão leve de 10 itens.
- **Lembretes:** notificações locais em Ajustes → Lembretes, com horário, dias da semana, aviso da noite se a sequência está em risco, horário de silêncio e um teste. Quem passa dias sem abrir recebe menos avisos, nunca cobrança.
- **Backup:** o código MDJ1 leva a jornada (pétalas, itens, conquistas, metas); códigos antigos continuam valendo.
- **Pendências:** os desenhos dos itens, o visual das telas e as notificações precisam ser conferidos no aparelho (permissão de notificação no Android 13+, e celulares que cortam alarmes em segundo plano). Push remoto (com servidor) ficou de fora.

## [1.7.0] - 2026-10-23

Fecha a Fase 4 do [ROADMAP](ROADMAP.md) (escuta e fala) no que é possível hoje, corrige o layout e completa itens abertos do vocabulário e da gramática.

- **Layout:** o conteúdo das telas não passa mais por trás da barra de status ao rolar; botões em fileira (como Gravar / Modelo / Minha voz) agora dividem a largura em vez de estourar a tela, em todo o app; os chips que rolam na horizontal mostram uma seta e uma névoa na borda quando há mais para ver.
- **Tom das palavras:** o cartão da palavra mostra o gráfico do tom (alto e baixo por mora, e a partícula depois), com dados do Kanjium para 538 palavras do N5. Em Ouvir → Tom: explicação, pares que só o tom separa (はし, あめ...) e um quiz de onde o tom cai.
- **Falar:** em Ouvir → Falar, você diz a frase em japonês e o reconhecimento de fala do Android confere (resultado aproximado, como guia). Pede microfone e a voz vai ao serviço de reconhecimento do aparelho.
- **Diálogos:** novo modo **Só ouvir**, em que a fala do atendente toca sozinha e o texto fica escondido até você tocar.
- **Voz japonesa:** em Ajustes dá para escolher e testar entre as vozes do aparelho; a automática prefere a de melhor qualidade.
- **Palavras:** cada cartão mostra a classe (verbo com o grupo, adjetivo い ou な) e até 2 frases de exemplo do Tatoeba; dá para escrever a sua dica de memória (entra no backup); palavras com kanji ganham o cartão de **leitura** (kanji → como se lê), 6 por dia para quem já tinha palavras aprendidas.
- **Gramática:** novo tópico 39, a partícula が (39 tópicos no total).
- **Pendências:** o áudio de falantes nativos ficou de fora (as fontes abertas cobrem pouco e pedem checar a licença de cada gravação). O tom, o reconhecimento de fala, a gravação e os ajustes de layout ainda precisam ser testados no aparelho. Os dados do Kanjium (CC BY-SA 4.0) entram na lista de licenças a validar antes de publicar.

## [1.6.0] - 2026-10-23

Fecha as pendências da Fase 2 e abre a Fase 4 do [ROADMAP](ROADMAP.md): escuta e fala.

- **Conjugar:** agora dá para **digitar** a forma (kanji ou kana) além de escolher, e entram as formas **ませんでした, たい, ている e ましょう**. Para os verbos que você já aprendeu, os cartões novos chegam aos poucos (6 por dia), sem encher a revisão de uma vez.
- **Revisão por partícula:** em Lacunas, cada uma das 12 partículas é um cartão com revisão espaçada (entra no backup).
- **Gramática de 30 para 38 tópicos:** 〜まえに, 〜てから e あとで, 〜ながら, 〜に いきます, frequência (いつも, よく, ときどき, あまり, ぜんぜん), 〜ましょうか, だけ e なにか/だれか, com frases do Tatoeba conferidas na fonte e notas de erros comuns.
- **Ditado:** em Ouvir, ouça uma palavra ou frase e escreva. A conferência aceita kana ou kanji e mostra o que sobrou ou faltou; o sentido só aparece depois.
- **Compreensão:** a frase toca sem texto e você escolhe o que ela quer dizer; a velocidade lenta ou normal vem do controle do topo.
- **Gravar e comparar:** em Ouvir → Repetir, grave a sua voz, veja a onda (ritmo e pausas, não pronúncia) e ouça o modelo e a sua voz em seguida. Pede a permissão do microfone; a gravação não sai do aparelho.
- **Ouvir:** as seções viraram chips que rolam na horizontal (são cinco).
- **Pendências:** os novos tópicos, notas e a conferência de cada tópico foram escritos por IA e precisam de revisão por um falante. Gravar e comparar ainda não foi testado no aparelho.

## [1.5.0] - 2026-10-23

Fase 3 do [ROADMAP](ROADMAP.md): montar e produzir frases. A aba Frases agora tem doze seções.

- **Leitura ajustável:** romaji e furigana sempre, só ao toque ou nunca (Ajustes → Leitura das frases), e frases da gramática escritas com kanji.
- **Traduzir:** do japonês (escolhendo entre quatro opções ou em resposta livre) e do português para o japonês, digitando com o teclado de flick do app ou o do celular. A conferência aceita kana ou kanji e ignora espaços e pontuação.
- **Minhas frases:** escreva frases sobre a sua vida; o app guarda, edita e revisa com repetição espaçada, pedindo para escrever de memória. Entram no backup.
- **Montar evoluído:** ao errar, "O que mudou" explica a causa (partícula trocada, final do verbo, bloco que sobra ou falta, ordem) e lista as outras ordens que valem. Novo modo "Qual está certa?" com frases parecidas e a explicação de cada erro.
- **Banco de frases:** cerca de 1.600 frases reais do Tatoeba (CC BY 2.0 FR) com tradução, filtradas pelas palavras que você já aprendeu (que eu sei ler, uma palavra nova, qualquer uma). Dá para ouvir, praticar e salvar em Minhas frases.
- **Diálogos:** quatro cenas (restaurante, loja, estação, hotel) em que você escolhe a fala certa em cada turno, com o motivo de cada erro, e no fim escreve as suas falas de memória.
- **Pendências para publicar:** o corte das frases em palavras é automático e pode errar; as falas do atendente, os motivos dos diálogos e as explicações do Montar foram escritos por IA e precisam de revisão por um falante.

## [1.4.0] - 2026-10-23

Fase 2 do [ROADMAP](ROADMAP.md): gramática ativa. A aba Frases agora tem sete seções (os chips rolam na horizontal).

- **Conjugar:** treinador de conjugação com cerca de 110 verbos do vocabulário. Aprenda 3 por vez e treine as formas ます, ない, て e た (geradas por regra, com os grupos 1, 2 e os irregulares). As respostas erradas são os erros típicos (regra de outro grupo, final de て errado) e a revisão é espaçada por verbo e forma.
- **Lacunas:** frases com um espaço para a partícula certa (は, を, に, で, の, も, と, が, から, まで, より) ou para a forma do final da frase, com a tradução embaixo e a regra ao errar.
- **Gramática de 10 para 30 tópicos:** 20 tópicos novos (でした/ではありません, adjetivos no negativo e no passado, 〜てください, 〜ています, 〜ないでください, 〜てもいい, 〜てはいけません, 〜ましょう/ませんか, ほしい, より, いちばん, すき/じょうず, から/まで, から (motivo), palavras interrogativas, もう/まだ, posições, になる, できる). As explicações são originais e os exemplos são 80 frases reais do Tatoeba (CC BY 2.0 FR), conferidas na fonte com `npm run verify-grammar`.
- **Praticar:** os exemplos novos viraram 59 exercícios de Montar e de Lacunas.
- **Contar:** números de 1 a 99.999, horas, datas, preços e 11 contadores, gerados por regra, em dois modos (ler e ouvir), com tabela de consulta.
- **Erros comuns de quem fala português:** 10 dicas gerais e notas em 28 dos 30 tópicos (ordem das palavras, sujeito omitido, sem artigos, を não é "o"...).
- **Mini-teste por tópico:** até 5 perguntas sem a explicação à vista; 80% de acertos de primeira marcam o tópico como dominado (✓ na lista e contador no topo).
- **Backup:** o código `MDJ1:` inclui a conjugação e os tópicos dominados; códigos antigos continuam valendo.
- **Pendências para publicar:** as explicações, as notas de erros comuns e as traduções do vocabulário foram escritas por IA e precisam de revisão por um falante; o crédito do Tatoeba está em Ajustes → Sobre e em `src/content/LICENSE.md`.

## [1.3.0] - 2026-10-23

Fecha o vocabulário da Fase 1 do [ROADMAP](ROADMAP.md): de 179 para **837 palavras**.

- **Lista JLPT N5:** 658 palavras novas (a lista tem 700; 42 já existiam), com leitura, significado em português, assunto e ordem de estudo pelas lições do Genki. Aprenda por assunto: verbos, adjetivos, comida e bebida, roupas e compras, transporte e viagem, expressões e outros.
- **Traduções:** os significados foram traduzidos do inglês para o português e **ainda não foram revisados por um falante**; o original em inglês fica guardado no dado para conferência.
- **Créditos e licença:** Ajustes → Sobre cita a fonte, e `src/content/LICENSE.md` documenta origem, alterações e a lista "Antes de publicar" (as licenças não foram validadas: uso pessoal por enquanto).
- **Projeto:** `npm run build-n5` regenera `src/content/n5.ts` a partir do CSV e das traduções; a limpeza do CSV tem testes.

## [1.2.0] - 2026-10-22

Primeira parte da Fase 1 do [ROADMAP](ROADMAP.md): vocabulário.

- **Palavras:** nova sub-aba em Frases. Aprenda 5 palavras por vez, por assunto (cartão com leitura, romaji, significado, kanji da palavra e som), pratique na hora e revise os cartões vencidos.
- **Revisão espaçada por palavra:** cada palavra vira cartões (japonês → significado, significado → japonês e, nas palavras só de kana, ouvir → palavra), com as mesmas caixas dos caracteres e progresso guardado à parte.
- **Vocabulário inicial:** 179 palavras que já vinham da especificação (exemplos de kana e kanji e palavras do simulador). Nenhuma palavra nova foi inventada; a ampliação para centenas de palavras depende de uma fonte aberta com licença conferida.
- **Kanji:** o passo Conhecer mostra "também aparece em" com outras palavras que usam o kanji.
- **Backup:** o código `MDJ1:` inclui o vocabulário; códigos antigos continuam valendo.
- **Quiz:** o enunciado ajusta o tamanho do texto ao comprimento da palavra.

## [1.1.0] - 2026-10-22

Fase 0 do [ROADMAP](ROADMAP.md): correções e base para crescer.

- **Backup:** novo "Exportar backup" em Ajustes gera um código `MDJ1:` com todo o progresso (inclusive histórico, Repetir e desafios). O importador aceita `MDJ1:` e `NDJ1:` (do protótipo).
- **Teclado:** a grade do simulador é sempre 3 colunas × 4 linhas (a largura agora é medida na tela), e ⌫ e Limpar ficam numa barra abaixo.
- **Acessibilidade:** contraste do tema claro corrigido (WCAG AA), alvos de toque de 48 dp e ícones das abas fora do leitor de tela.
- **Visual e som:** ícone, ícone adaptativo e splash com o Mochi; animações mais suaves; som de abertura e som de toque nos botões.
- **Correção:** lições bloqueadas deixam de disparar o aviso de opacidade com animação de layout.
- **Build:** o APK sai como `MojiDojo-<versão>.apk`, só para arm64 (de 118 MB para cerca de 50 MB).
- **Projeto:** `npm run lint` sem erros e testes do `Card` funcionando.

## [1.0.0] - 2026-10-22

Primeira versão completa: Fases 1 e 2 mais o polimento.

- **Estudo:** trilha de hiragana, katakana e kanji N5, lições em três passos (conhecer, escrever, testar), escrita com o dedo conferida por geometria e revisão espaçada com modo "write".
- **Ouvir:** guia de sons, treino de ouvido e Repetir (shadowing).
- **Frases:** gramática, montar frases e frases de viagem.
- **Teclado:** guia, simulador de flick e desafios.
- **Início:** painel de constância e evolução. **Ajustes:** voz, importação de backup do protótipo, som e vibração.
- **Geral:** tela de carregamento com o Mochi, efeitos sonoros e vibração, temas claro e escuro.
