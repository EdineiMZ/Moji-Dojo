# Changelog

Cada versão do app tem uma entrada aqui. A política de versões (quando aumentar MAIOR, MENOR ou CORREÇÃO) está em `scripts/versioning.cjs`, e um teste falha se a versão, o `versionCode` e este arquivo divergirem. Para uma versão nova: `npm run version:bump -- <patch|minor|major>`.

## [2.42.2] - 2026-11-01

Ajustes no treino "Ler palavras": só o que você já aprendeu, as básicas primeiro e uma dica quando o sinal pede.

- **Kana pequenos só depois da lição:** palavras com ゃ/ゅ/ょ só entram depois de concluída a lição da trilha daquele grupo (Combinações 1 a 4, em hiragana e em katakana). O っ/ッ, que nenhuma lição ensina sozinho, só entra depois da lição "Combinações 1" da escrita. Antes, bastava saber o つ, e いっそ aparecia para quem só tinha vogais, K, S, T e N. A mesma regra vale para as palavras misturadas na revisão.
- **Básicas primeiro:** as palavras são ordenadas por nível JLPT (N5, depois N4, N3...) e, dentro do nível, pelas mais usadas (frequência em frases do Tatoeba). Cada rodada sorteia entre as 30 do topo, então ねこ, いぬ e さかな vêm antes das raras. As alternativas erradas ainda podem vir de qualquer palavra que você consegue ler.
- **Dica depois da resposta:** quando a palavra tem っ, kana pequeno ou ー, a explicação traz uma dica curta (ex.: "o っ dobra a consoante seguinte (isso)").
- **Testes:** `practice.test.ts` cobre a liberação por lição, a prioridade por nível e as dicas.

## [2.42.1] - 2026-11-01

Tela de exercício mais limpa, sem rolar a página.

- **Removido o "Avançar sozinho"** (da 2.42.0): estava instável. A opção em Ajustes > Revisões saiu e tudo volta ao que era: o acerto passa sozinho, e depois de errar (e no ouvido e no desenho) a próxima pergunta vem no toque em "Continuar".
- **Sem texto de introdução acima das perguntas:** o parágrafo sob o título da revisão ("Treino extra com os caracteres mais fracos...", "Caracteres de várias lições...") e os dos treinos extras (Pares confusos, Ler palavras) saíram, para a pergunta e as alternativas caberem na tela sem rolar. A tela "Salvar a sequência" mantém a linha com a meta de acerto.
- **Testes:** ajustados para a ausência do texto e da opção.

## [2.42.0] - 2026-11-01

Avançar sozinho nas trilhas e nas revisões: sem rolar a tela para achar o "Continuar".

- **Avançar sozinho:** depois de errar, a próxima pergunta aparece sozinha depois de um tempo para ler a explicação (de 3 a 9 segundos, maior quando o texto é longo; no desenho, mais 2 s para olhar o seu traço ao lado do certo). No ouvido, o acerto avança depois de 2 s (dá para ouvir de novo antes). O acerto já avançava sozinho nos outros exercícios.
- **Sem pressa quando você mexe:** tocar na explicação (escrever a sua historinha, chamar a IA) cancela a espera, e o botão "Continuar" continua lá para pular a espera.
- **Ajustes > Revisões > Avançar sozinho:** liga ou desliga (vem ligado). Entra no backup das configurações.
- **Testes:** `explain.test.ts` cobre o tempo de leitura (mínimo, máximo, texto longo e tempo extra).

## [2.41.1] - 2026-11-01

Correção de layout e ajuda de pronúncia no treino "Ler palavras".

- **Layout das alternativas:** o texto de uma alternativa longa (ex.: "kotatsu (mesa baixa com cobertor aquecido)") passava da borda do cartão e ficava cortado. Agora o texto quebra em linhas dentro do botão, em todos os exercícios de múltipla escolha do app.
- **Ler palavras com pronúncia:** o cartão da palavra ganhou "🔊 Ouvir" (a voz fala a leitura, na velocidade dos Ajustes) e "Ver romaji" (mostra a leitura em romaji se você não souber, sem mexer na nota). Depois da resposta, a explicação traz o romaji da palavra (こたつ (kotatsu) = ...).
- **Testes:** `practice.test.ts` confere o romaji e a explicação de cada palavra.

## [2.41.0] - 2026-11-01

Acabamento das melhorias da 2.40.0: elas passam a aparecer em mais lugares do app.

- **Palavras na revisão:** a revisão normal mistura até 3 palavras curtas (feitas só de kana que você já conhece) entre as perguntas de kana. As palavras não têm cartão no SRS: contam só no histórico do dia.
- **Sósias nas lições, no ouvido e nos cartões:** o teste das lições e o treino de ouvido também priorizam alternativas parecidas com o caractere (só de kana já conhecidos).
- **Confusão no desenho:** quando o desenho errado lembra claramente outro kana (com folga sobre o pedido), o par entra na lista de pares confusos, como nos erros de múltipla escolha.
- **Historinha nos cartões:** ao virar um cartão de kana, aparece o mnemônico (o seu, se você escreveu um).
- **Freio:** o aviso de "revisar antes de uma lição nova" aparece também dentro da lição.
- **Testes:** `newFeatures.test.ts` cobre as palavras na revisão e o palpite do desenho.

## [2.40.0] - 2026-11-01

Seis melhorias para fixar os kana, a maioria montada com o que a pessoa realmente erra.

- **Pares confusos (treino extra):** o app passa a guardar "o que era" e "o que você marcou" quando um kana é trocado por outro, e monta sozinho a lista dos pares que você mais troca (さ e ち). Um exercício só deles, lado a lado: escute o som e escolha qual é qual. Aparece na Trilha, em "Treinos extras", quando há pares. As confusões entram no backup.
- **Desenho com rodinhas:** o modo "Desenhe o símbolo" acompanha a caixa do SRS. Caixa 1 (caractere novo): o modelo aparece em transparência para traçar por cima. Caixa 2: o primeiro traço já vem feito. Caixa 3 em diante: de memória, com o botão "Dica". As rodinhas são apoio automático e acertar com elas ainda avança a caixa (a "Dica" manual continua sem avançar).
- **Mnemônico na hora do erro, que você reescreve:** ao errar um caractere, aparece a historinha dele e o botão "Escrever a minha historinha". A sua passa a valer no lugar da pronta nos erros seguintes; dá para voltar à do app. Entra no backup.
- **Ler palavras:** depois de cerca de três linhas de kana, um treino com palavras curtas feitas só dos kana que você já aprendeu (ねこ, さかな...): leia e escolha o significado. Não mexe no agendamento.
- **Alternativas parecidas:** os sósias visuais (さ com ち e き, ぬ com め etc.) entram primeiro entre as alternativas, desde que você já conheça o caractere. Lista de sósias ganhou o par さ e ち.
- **Freio quando o acerto cai:** se o acerto dos últimos 3 dias fica abaixo de 60% (com pelo menos 20 respostas) ou há 6 itens teimosos ou mais, a Trilha sugere revisar antes de uma lição nova. É só uma sugestão: nunca bloqueia.
- **Testes:** `practice.test.ts` e `newFeatures.test.ts` cobrem confusões, palavras legíveis, sósias, mnemônico próprio, rodinhas e o freio.

## [2.39.0] - 2026-11-01

Modo "Desenhe o símbolo" (revisão write) com ajudas para quem não lembra o caractere.

- **Não lembro:** botão ao lado de Desfazer/Limpar. Conta como erro no SRS (a mesma regra do erro normal: volta para a caixa 1 e a pergunta reaparece 2 ou 3 depois), mostra a animação da ordem dos traços e pede um traçado guiado por cima do modelo em transparência. O traçado guiado não vale nota.
- **Dica:** revela só o primeiro traço (animado) e o resto é de memória. Acertar com a dica conta como acerto, mas a caixa não avança nem o agendamento muda. Usar a dica e errar é erro normal.
- **Erro mostra o desenho ao lado do certo:** depois de qualquer erro (inclusive nota abaixo do corte), o desenho do usuário aparece lado a lado com o caractere certo animado.
- **Testes:** `writeAssist.test.ts` cobre a regra do SRS do "Não lembro" e da "Dica" com relógio congelado (fake timers).

## [2.38.3] - 2026-11-01

Passada visual dos 8 temas no celular (4 cores, claro e escuro): todos legíveis.

- **Seletor de cores (Ajustes > Aparência):** o emoji ficava ao lado do nome na opção selecionada e em cima nas outras, apertado e inconsistente. Agora o emoji fica sempre em cima do texto, em todas as opções, e o leitor de tela fala só o nome.

## [2.38.2] - 2026-11-01

- **Chips e controle segmentado:** as opções não selecionadas (meta por dia, dia de folga, filtros) só tinham a borda fraca como limite; agora usam o contorno `field` (3:1), conferido no celular.

## [2.38.1] - 2026-11-01

Auditoria de design (acessibilidade e consistência), com as skills de design.

- **Contorno dos campos de texto:** os 20 campos do app tinham borda com 1,2 a 1,5 de contraste sobre o fundo, quase invisível, principalmente no tema claro. Agora usam um token novo, `field`, calculado para cada um dos 8 temas (claro e escuro dos 4 temas de cor) para dar pelo menos 3:1 com o fundo e com o cartão (WCAG 1.4.11), mantendo o tom suave.
- **Âmbar como texto:** a dica da palavra errada na Casa e o aviso dos termos das vozes usavam o âmbar puro (2,7:1 no tema claro). Texto `warn` agora usa `warnText` (6:1 no claro; no escuro continua o mesmo).
- **Alvos de toque de 44 pt:** o alto-falante dos exemplos (40), os botões pequenos de lição, de frase e de leitura (40 a 42) foram para 44.
- **Letras da sequência semanal:** de 10 para 12 pt.
- **Testes:** o teste de contraste dos temas agora também confere o contorno dos campos (3:1) e o âmbar de texto (4,5:1) nos 10 temas.

## [2.38.0] - 2026-11-01

Vocabulário N1: 2.641 palavras novas.

- **Palavras do N1:** a lista N1 do *open-anki-jlpt-decks* (MIT) entra com leitura, significado em português, classe (JMdict), tom (Kanjium), frequência e frases do Tatoeba, em grupos "N1: ...". Ficaram de fora as que já estão nas outras listas.
- **Não é o N1 oficial:** o JLPT não publica lista. Os significados foram escritos por IA e **ainda precisam de revisão por um falante**.
- **Metas e simulado:** o caminho "Nível N1" mostra as palavras do N1 aprendidas, e o simulado ganhou o N1 (só com vocabulário e leitura das palavras, porque o N1 ainda não tem gramática nem kanji próprios).
- O app passa a ter cerca de 7.800 palavras; as do N1 aparecem por último na trilha e ficam fora das contas dos outros níveis.

## [2.37.0] - 2026-11-01

Vocabulário N2: 1.730 palavras novas.

- **Palavras do N2:** a lista N2 do *open-anki-jlpt-decks* (MIT) entra com leitura, significado em português, classe (JMdict), tom (Kanjium), frequência e frases do Tatoeba, em grupos "N2: ...". Ficaram de fora as que já estão no N5, N4, N3 e na Casa do Mochi.
- **A lista tem de tudo:** além de palavras, vem com sufixos, contadores e expressões prontas (para os quais o significado explica o uso), e **não é o N2 oficial** (o JLPT não publica lista). Os significados foram escritos por IA e **ainda precisam de revisão por um falante**.
- **Metas e simulado:** o caminho "Nível N2" mostra as palavras do N2 aprendidas, e o simulado ganhou o N2 (por enquanto só com vocabulário e leitura das palavras, porque o N2 ainda não tem kanji nem gramática próprios).
- As palavras do N2 ficam fora das contas do N5, N4 e N3.

## [2.36.0] - 2026-11-01

Gramática: 4 tópicos novos no N4 e 4 no N3 (e um tópico repetido sai).

- **N4 (agora 31 tópicos):** 〜てある (já está feito), 〜までに (prazo), 〜なさい (ordem firme) e pedir um favor com 〜てくれませんか e 〜ていただけませんか.
- **N3 (agora 31 tópicos):** 〜にとって, 〜ずにはいられない, ほか (〜のほか e ほかに) e 〜なんて. O tópico 〜やすい e 〜にくい do N3 (que o N5 já tinha) saiu e deu lugar a 〜てたまらない.
- **Frases reais conferidas:** as 41 frases novas são do Tatoeba (CC BY 2.0 FR), todas conferidas na fonte (id, texto, licença, leitura, furigana e tradução).
- **N4 e N3 fechados no que dá fazer sem um falante:** vocabulário, kanji, gramática, leitura, metas e simulado. O que falta é a revisão por um falante, que o ROADMAP segue marcando.

## [2.35.0] - 2026-11-01

Casa do Mochi, fase 3: decorações de datas e clima.

- **12 decorações de datas**, uma para cada data comemorativa dos cosméticos, cada uma em um cômodo: guirlanda de Natal (Sala), daruma (Escritório, Ano-Novo), máscara de oni (Quarto, Setsubun), varal de corações (Cozinha, Namorados), hinadan (Escritório, Hinamatsuri), galho de sakura e koinobori (Jardim, Hanami e Dia das Crianças), bandeirinhas e bambu de Tanabata (Varanda), lanternas de festival (Sala, Natsu-matsuri), lua de Tsukimi (Ofurô) e abóbora de Halloween (Cozinha). Cada uma só **se compra na época** (as mesmas janelas dos cosméticos), precisa do cômodo comprado e fica na casa para sempre. Fora da época a lista diz em quantos dias ela volta.
- **Luz da hora do dia:** a casa muda sozinha conforme o relógio do celular: amanhecer (5h às 7h), dia, entardecer (17h às 19h) e noite (com estrelas nos cômodos de fora). A descrição da cena para o leitor de tela também diz a hora e o clima.
- **Clima:** em "Clima da casa", Automático (só a luz) ou **chuva** (120 pétalas), **neve** (180), **pétalas de sakura** (150) e **vaga-lumes** (150), que se compram uma vez e ficam em todos os cômodos. Comprar já liga; dá para voltar ao automático.
- Tudo vai junto no backup do progresso, e backups antigos continuam abrindo.
- Os desenhos foram conferidos numa prévia no computador; ainda não foram vistos no aparelho.

## [2.34.0] - 2026-10-31

Casa do Mochi: skins de móveis e cômodos liberados por metas de estudo.

- **Skins de móveis:** 19 móveis (cama, tapete, abajur, sofá, kotatsu, geladeira, banheira, mesa...) têm 3 skins de cor: **Oceano**, **Matcha** e **Lavanda**. Cada skin custa metade do preço do móvel (no mínimo 60 pétalas), vale só para um móvel que você já tem, e depois de comprada dá para trocar de cor, ou voltar ao original, sem custo. Móveis de cor própria (a água do lago, a tela da TV, a árvore) não têm skin. A cor muda só no tom: branco, cinza e traços escuros ficam.
- **Metas de estudo:** os cômodos agora pedem pétalas **e** uma meta. Quarto e Jardim continuam livres; Escritório pede 20 palavras aprendidas, Varanda 3 tópicos de gramática dominados, Sala 100 palavras aprendidas, Cozinha 7 dias seguidos de estudo e Ofurô 30 dias de estudo. O cômodo trancado mostra a meta, a barra de progresso e só libera o botão de compra quando ela estiver cumprida.
- **Backup:** as skins vão junto com o progresso; backups antigos sem skins continuam abrindo.

## [2.33.0] - 2026-10-31

Casa do Mochi: cada peça é uma palavra de japonês.

- **Palavra para comprar:** cada cômodo e cada móvel tem uma palavra (cama = ベッド, mesa = 机, geladeira = 冷蔵庫, banheira = 浴槽...). Antes de a compra se concluir, você vê o japonês grande, a leitura, o romaji (conforme os Ajustes), ouve e escolhe o significado. Errar só deixa tentar de novo; acertar conclui a compra.
- **Direto para as revisões:** a palavra aprendida entra nos cartões de vocabulário (como qualquer palavra nova), então volta na revisão espaçada. Na linha de cada móvel comprado aparece a palavra, com a leitura e o significado.
- **Visita guiada:** com 3 palavras da casa, um botão leva a uma rodada de 5 perguntas (japonês → significado e significado → japonês), com som. Cada primeira resposta vale como uma revisão do vocabulário, com as mesmas regras (pétalas, sequência, desafio da semana).
- **16 palavras novas no vocabulário** (grupo "Casa do Mochi"): 寝室, ベランダ, 絨毯, 手すり, 風鈴, 植木鉢, 灯籠, こたつ, 座布団, 竹, アヒル, 浴槽, 桶, 花壇, ランプ e 提灯. Significados escritos por IA, a revisar por um falante.
- **Ainda não visto no aparelho:** a visita e o desafio foram cobertos por testes, mas não abri esta versão em tela.

## [2.32.0] - 2026-10-31

Casa do Mochi, fase 2: quatro cômodos novos.

- **Varanda** (700 pétalas, de fora), **Sala** (800), **Cozinha** (1.000) e **Ofurô** (1.200): cada um com cenário próprio e 5 móveis, 20 móveis novos no total (de 80 a 300 pétalas). Varanda: grade, sininho de vento, vasos, mesinha de chá e lanterna de pedra. Sala: sofá, kotatsu, televisão, almofadas e relógio. Cozinha: geladeira, fogão com panela, prateleira de louças, cesta de frutas e banqueta. Ofurô: banheira de madeira, banquinho com balde, toalhas, bambuzal e patinho de borracha.
- Agora são **7 cômodos e 35 móveis**. Cada cômodo ganhou um emoji próprio nos botões (🛏️ 🌳 📚 🎐 🛋️ 🍳 ♨️).
- As regras não mudam: o cômodo vem antes dos móveis, e a casa vai junto do backup do progresso.
- **Ainda não foi visto em aparelho:** os desenhos foram conferidos numa prévia no computador (e ajustei bambu, toalhas, cesta de frutas e banqueta, que se sobrepunham).

## [2.31.0] - 2026-10-31

Mais leitura do N3.

- **Três leituras do dia a dia:** "Aviso do prédio: obra na rede de água", "Regras da biblioteca" e "Anúncio na estação: trem parado", com o lugar onde se vê cada uma.
- **Dois textos corridos novos:** "Como eu estudo japonês" e "Um dia de chuva", com os pontos de gramática do N3 que entraram na 2.30.0 (〜ようとする, 〜てほしい, 〜ずに, 〜とおり, 〜かどうか, 〜たびに, 〜だらけ...).
- Como nos outros textos do N3, cada frase tem tradução e pedaços tocáveis com leitura e significado. **Escritos por IA, a revisar por um falante.** O teste confere que cada pedaço fecha com a frase e que todo kanji tem leitura.

## [2.30.0] - 2026-10-31

Gramática N3: de 15 para 27 tópicos.

- **Doze pontos novos:** 〜やすい e 〜にくい, 〜かどうか, 〜べき, 〜ずに, 〜てほしい, 〜ようとする, 〜とおり, 〜たびに e 〜ごとに, 〜ように, 〜ことはない, 〜ものだ e 〜だらけ. Cada um com explicação em português, tabela, exercícios de Montar e Lacunas e notas de erros comuns.
- **46 frases novas do Tatoeba** (CC BY 2.0 FR), todas conferidas na fonte (id, texto, licença, leitura, furigana e tradução). A conferência achou um erro meu: 日ごとに lê-se **ひごとに**, e não にちごとに; já corrigido no exemplo e no texto.
- Os textos ainda precisam da revisão de um falante.

## [2.29.0] - 2026-10-31

Japonês com leitura nas telas de explicação.

- **Como se lê, em todo texto de explicação:** nos textos que explicam a gramática (explicação, tabelas, padrão, "Cuidado, quem fala português costuma errar aqui" e erros comuns), nos guias de pronúncia e na consulta de números, horas e datas, cada trecho em japonês agora vem seguido de como se lê, em romaji, entre colchetes. Os kanji que o app ensina também ganham a leitura.
- **O que significa:** quando o trecho é uma palavra do vocabulário, o significado em português vem junto (a menos que o texto já traduza logo depois, para não repetir).
- **Segue o ajuste de romaji** (Ajustes → Estudo e leitura): "sempre" mostra tudo, "só ao tocar" mostra um ⓘ que abre a leitura daquele trecho, e "nunca" deixa como era. Um kanji que o app não conhece fica sem leitura, em vez de mostrar uma leitura errada.
- **O mapa da frase japonesa** (Estrutura) ganhou o romaji de cada bloco.
- **Limite:** a leitura de trechos soltos em kana pode sair um pouco diferente do jeito de falar (por exemplo, a partícula に colada na palavra); o significado só aparece para palavras do vocabulário, não para pedaços de gramática.

## [2.28.0] - 2026-10-31

Leitura do N3.

- **Quatro textos do N3:** "Mudança de cidade", "Um resfriado", "Professor de japonês" e "A promessa esquecida", com 〜ことになる, 〜らしい, 〜ところ, 〜について, 〜おかげ e os outros pontos da gramática do N3. Cada frase tem tradução e os pedaços tocáveis, com a leitura e o significado.
- **Seletor N3 na Leitura** (Frases → Palavras → Leitura), ao lado do N5 e do N4, e a meta "Textos de leitura do N3 lidos" no caminho do N3.
- **Escritos por IA:** os textos usam só a gramática e o vocabulário que o app ensina e **ainda precisam da revisão de um falante**.
- **Correção:** no tópico 〜っぽい o exemplo "こども っぽい" tinha um espaço a mais.

## [2.27.0] - 2026-10-31

Gramática N3: 15 tópicos.

- **Quinze pontos do N3:** 〜らしい, 〜について, 〜として, 〜に対して, 〜によって, 〜ほど (incluindo 〜ば〜ほど), 〜わけ (わけがない e わけではない), 〜はずがない, 〜ところだ, 〜うちに, 〜おかげ e 〜せい, 〜まま, 〜さえ, 〜っぽい e 〜ことになる. Cada um tem a explicação em português, tabela, exercícios de Montar e de Lacunas e notas de erros comuns.
- **Frases reais conferidas:** 55 frases do Tatoeba (CC BY 2.0 FR), conferidas na fonte (id, texto, licença, leitura, furigana e tradução). O furigana segue o do Tatoeba, por kanji.
- **Fonte da lista:** não existe lista oficial do JLPT; só os nomes dos padrões partem do Guia JLPT do Wikibooks (CC BY-SA) e do que os cursos ensinam no N3. O texto é próprio e **ainda precisa da revisão de um falante**.
- **Metas e simulado:** o caminho do N3 ganhou a meta de gramática (com o teste de cada tópico), e o simulado do N3 passou a ter as quatro seções.

## [2.26.0] - 2026-10-31

Caminho de metas e simulado do N3, e tom, frequência e frases para as palavras do N3.

- **Simulado do N3:** em Frases → Gramática → Simulado há um terceiro nível. A prova do N3 tem vocabulário, leitura e kanji (a gramática do N3 ainda não existe, então são três seções) e só pergunta o conteúdo do N3.
- **Metas do N3:** o cartão "Nível" ganhou o caminho do N3, com as palavras do N3 aprendidas e os kanji do N3 firmes.
- **Tom das palavras do N3:** o acento (Kanjium, CC BY-SA 4.0) agora cobre também o vocabulário do N3.
- **Frequência e "mais usadas primeiro":** a contagem nas frases do Tatoeba foi refeita com o vocabulário inteiro, então o N3 também pode ser ordenado por uso.
- **Frases de exemplo:** o banco de frases passou de 3.5 mil para 4.155 frases do Tatoeba (CC BY 2.0 FR), tiradas do banco local, e 819 das 2.072 palavras do N3 já têm ao menos uma frase.
- **Ainda falta no N3:** gramática, textos de leitura e a revisão por um falante.

## [2.25.0] - 2026-10-31

Vocabulário N3: 2.072 palavras novas.

- **Palavras do N3:** a lista do *open-anki-jlpt-decks* (MIT) entra com leitura, significado em português e classe (JMdict), em 13 grupos "N3: ..." (verbos, adjetivos, ideias e sentimentos, sociedade e trabalho, natureza e corpo, e outros). Ficaram de fora as 28 que já estão no N5 e no N4, e três variantes de palavras que já existem.
- **Atenção ao recorte:** a lista junta as marcas `JLPT_2` e `JLPT_3` da lista antiga do JLPT, então traz o N3 **e uma parte do N2**; não é o N3 oficial (o JLPT não publica lista). Os significados foram escritos por IA e **ainda precisam de revisão por um falante**.
- **Sem misturar com o N5 e o N4:** as palavras do N3 ficam fora do simulado e das metas do N5 e do N4 (que antes contavam como N5 tudo o que não era "N4:"). Elas aparecem por último na trilha de estudo, depois do N5 e do N4.
- **Para depois:** tom, frequência e frases do Tatoeba para estas palavras, e o caminho de metas e o simulado do N3.
- **Dentro do app:** `scripts/build-n3.mjs` gera `src/content/n3.ts`; a classe gramatical foi regerada com `npm run build-pos`.

## [2.24.0] - 2026-10-31

Gramática N4: de 23 para 27 tópicos.

- **Quatro tópicos novos:** 〜のが e 〜のは (transformar o verbo em substantivo), 〜という ("chamado", "dizem que" e ということ), 〜させられる (ser obrigado a fazer) e a linguagem de respeito (お〜になります, verbos especiais como いらっしゃる, めしあがる e おっしゃる, e o humilde もうします, はいけんします, いたします).
- **Frases reais conferidas:** 17 frases novas do Tatoeba (CC BY 2.0 FR), todas conferidas na fonte (id, texto, licença, leitura, furigana e tradução). A conferência achou um erro meu: 何という lê-se なんという, e não なにという; já corrigido nos exemplos e no texto. Cada tópico tem tabela, exercícios de Montar e Lacunas e notas de erros comuns.
- **Atenção:** as explicações em português foram escritas por IA e ainda não passaram por um falante de japonês. Ficam marcadas "a revisar" no ROADMAP.

## [2.23.0] - 2026-10-31

A Casa do Mochi (primeira fase).

- **Nova aba "Casa" em Meu Mochi:** três cômodos que se compram com pétalas: Quarto (250), Jardim (400, do lado de fora) e Escritório (600). Cada cômodo trancado aparece esmaecido, com o preço e a confirmação de compra.
- **Móveis:** cada cômodo tem 5 móveis (15 no total), de 90 a 260 pétalas, que só se compram depois do cômodo: caminha, tapete, abajur, estante e janela no Quarto; cerca, canteiro, árvore, laguinho e banco no Jardim; mesa de estudo, quadro de kanji, livros, lanterna de papel e planta no Escritório.
- **O Mochi mora na casa:** ele aparece no meio do cômodo que você está vendo, com a roupa que está vestindo (o fundo do armário não entra, porque o cômodo já é o cenário).
- **Backup:** a casa vai junto com o progresso; backups antigos, sem casa, continuam abrindo. Ids desconhecidos e móveis de cômodos que você não tem são descartados.
- **Ainda não tem:** skins de móveis, mais cômodos e decoração por data ficam para as próximas fases. Os desenhos foram conferidos só numa pré-visualização de navegador.

## [2.22.0] - 2026-10-31

Cosméticos de 12 datas comemorativas para o Mochi.

- **67 itens novos de época (72 com os 5 que já existiam):** 12 datas com seis itens cada, um por espaço (cabeça, rosto, pescoço, fundo, cor e pele): Natal, Ano-Novo, Setsubun, Dia dos Namorados, Hinamatsuri, Hanami, Kodomo no Hi e Koinobori, Festa Junina, Tanabata, Natsu-matsuri e Obon, Tsukimi e Halloween. O Mochi passa a ter 178 itens.
- **Só na época:** cada item só se compra dentro das datas da comemoração (por exemplo, o Halloween de 10/10 a 2/11). Quem já comprou continua com o item o ano todo, e o Mochi veste sozinho os itens de época que você tem quando a data chega, se a opção estiver ligada.
- **Loja:** nova categoria "Datas", com o que está à venda hoje no começo. Preços: 380 pétalas (cabeça, rosto e pescoço), 450 (cor), 520 (fundo) e 800 (pele, épica).
- **Ajustes de datas existentes:** o gorro de Natal passa a valer de 15/12 a 26/12 (antes, de 1/12 a 6/1; o Ano-Novo agora tem os próprios itens) e se chama "Gorro de Natal".
- **Desenhos:** conferidos numa pré-visualização no navegador; o acabamento no aparelho ainda precisa ser visto.

## [2.21.0] - 2026-10-31

Nove pontos novos de gramática do N4.

- **Gramática N4: de 14 para 23 tópicos.** Novos: ながら (ao mesmo tempo), すぎる (demais), そう (aparência), そうだ (ouvi dizer), ようだ e みたい, あげる/くれる/もらう (e os favores com a forma て), てみる, ないで e と思う. Cada tópico tem tabela, 4 ou 5 frases reais do Tatoeba (CC BY 2.0 FR) com leitura e tradução, exercícios de Montar e Lacunas e notas de erros comuns. Os 90 exemplos do N4 foram conferidos um a um no Tatoeba (id, texto, licença, leitura e tradução).
- **Revisão pendente:** as explicações são texto próprio, escrito por IA, e continuam a revisar por um falante de japonês.

## [2.20.0] - 2026-10-31

Esqueleto de carregamento, guia de imersão e de conversa, pacote menor e ferramentas de build e de capturas.

- **Fora do app (Frases):** guia de imersão por nível (N5, N4 e N3) com o que ouvir, assistir e ler e como usar as legendas, e um guia de conversa com formas de achar tutor ou parceiro de intercâmbio e o roteiro da primeira conversa. Escrito por IA, a revisar por um falante.
- **Esqueleto de carregamento:** Palavras, Katakana, Banco e Explorar mostram cartões cinzentos pulsando enquanto a lista é montada, em vez de tela em branco. Fica parado com "reduzir movimento".
- **Sequência sem contradição:** o cartão de resgate diz "Sua sequência de N dias foi interrompida" e que, sem o resgate, a contagem recomeça do 1; a linha da semana diz "Esta semana (seg. a dom.)".
- **Pacote menor:** a fonte de cerca de 1 MB do `expo-symbols`, que só as abas nativas do expo-router usam, saiu do pacote.
- **Build:** `gerar-apk-emulador.bat` gera o APK x86_64 para o emulador sem copiá-lo para `versoes`; com `set ARCHS=armeabi-v7a` o `gerar-apk.bat` gera o APK de 32 bits (`-32bits`).
- **Capturas:** `npm run screenshots` fotografa as telas principais pelo adb, com `--font 1.5` para fonte grande.
- **Testes:** teto de escala da fonte nos chips, no guia do flick e no esqueleto a 1,5× e 2×, o `Deferred`, as rotas do script de capturas e o guia de imersão.

## [2.19.0] - 2026-10-31

Passada de layout e design da auditoria no emulador: chips, ícones, trilha, Início e fonte grande.

- **Chip escolhido sempre à vista:** nas linhas de chips que rolam, o chip ativo rola para o meio, inteiro, fora da névoa e da seta. Em Meu Mochi, Resumo, Frases, Teclado e Vocabulário as linhas passam a quebrar em várias linhas.
- **Fonte grande:** a tecla central do guia do flick não estoura mais, e o rótulo da barra de abas tem tamanho fixo ("Teclado" não encosta mais na borda a 1,5×).
- **Baú do dia:** tocar em "Depois" adia o baú até o dia seguinte, mesmo fechando e abrindo o app. O cartão do Início e a aba de metas ainda o abrem.
- **Início:** "Revisar o que venceu" sem nada vencido aparece em cinza como "Nada para revisar hoje", fora da conta de passos; a engrenagem de Ajustes ganhou um ícone de traço; "Sua evolução" sem dados vira uma linha só.
- **Velocidade de fala:** o seletor sai do topo de Ouvir e de Frases e vira uma pílula ao lado do título; o controle completo fica em Ajustes.
- **Trilha:** o kanji se agrupa por N5, N4 e N3, cada um com a sua barra de progresso; o "Já sei" de cada lição dá lugar a um só botão de nivelamento; a lição bloqueada é lida como um item só.
- **Ícones:** emoji no começo de botões e chips (🔒, 🎁, 📷, 🔊) vira ícone de traço da cor do botão. O botão "ghost" usa a cor principal do texto, com mais contraste.
- **Mochi:** o fundo vestido fica parado e só o personagem se anima por cima.
- **Ainda em aberto (ver ROADMAP 2.19):** a definição única de "dias seguidos" e o excesso de botões primários no Início.

## [2.18.0] - 2026-10-29

Kanji N3, modo Atendente nos moldes, mais leituras do dia a dia e correção do áudio da tabela.

- **Correção do áudio da tabela de caracteres:** tocar し falava a gravação da palavra 四, じ falava 時, き falava 木, e assim por diante (た, に, は, ご, え, て, と, め também). O índice ligava a leitura curta de uma palavra à gravação de outra; agora só vale para leituras de 3 letras ou mais com um único significado. Testado com os dados; **não ouvido no aparelho**.
- **Moldes com a fala do atendente:** novo modo "Atendente" em Frases → Moldes. O atendente diz uma fala, você escolhe o molde que responde e completa a lacuna. 5 moldes novos (29 no total, 14 com fala do atendente).
- **Mais leituras do dia a dia:** ofertas e promoções, no caixa, mesas e reservas, placas de serviços (27 placas e avisos, com leitura e significado de cada pedaço). Escritas por IA, a revisar por um falante.
- **Kanji N3 (parcial):** 193 kanji com ordem dos traços, leituras, significado, dica de memória, palavra de exemplo (JMdict) e lições. São os mais frequentes dentre os do nível 2 da lista antiga do JLPT, **não o N3 inteiro**. Ficam fora das metas e das provas do N5 e do N4. Significados e dicas escritos por IA, a revisar por um falante.

## [2.17.0] - 2026-10-29

Compartilhar texto para a IA, simulado com tempo de prova e widget para o Niagara.

- **Compartilhar do Android:** o Moji Dojo aparece em Compartilhar para texto. O app abre em Frases → IA → Explicar com o campo preenchido; nada é enviado à IA até você tocar em "Explicar". O texto de fora é limpo e limitado. Sem a IA configurada, o cartão mostra o texto recebido e o guarda para depois.
- **Tempo de prova:** nos simulados (o offline e o da IA), a opção "Tempo de prova" põe um cronômetro regressivo de 45 segundos por pergunta para a prova toda; ao acabar, a prova encerra e as perguntas sem resposta contam como erradas.
- **Widget para o Niagara Launcher e outros:** duas disposições (compacta e larga e baixa), escolhidas pelo tamanho que o lançador dá e refeitas quando ele muda; canto arredondado do sistema e pré-visualização no seletor (Android 12 em diante); orientação em Ajustes para lançadores que não abrem a confirmação do Android. Verificado no emulador (redimensionando o widget); **não testado no Niagara**.
- **OpenAI:** teste com a resposta real da API para chave recusada (HTTP 401). A chamada completa segue sem teste por falta de chave.

## [2.16.0] - 2026-10-29

As ideias em aberto do roadmap: tabela de kana, missões novas, widget, temas de cor e backup de configurações.

- **Tabela de kana (Ouvir → Tabela):** a tabela do hiragana e do katakana, com e sem ten-ten e maru, que toca o som e mostra o exemplo e a dica; **treino livre** (pergunta o som de cada letra, sem mexer nas revisões); e **pares parecidos** (ぬ e め, ね, れ e わ, シ e ツ, ソ e ン...) com o detalhe que separa cada um e um atalho para treinar só aquelas letras.
- **Dicas dos kana com ten-ten e maru:** as 50 letras que não tinham dica agora têm (o kana base, a troca de som e as exceções じ/ぢ e ず/づ).
- **Missões mais variadas:** as missões das habilidades fracas (menos de 80% de acerto) aparecem mais; há missões de horário ("de manhã", "à noite") e missões em cadeia (cada passo só conta depois do anterior). As três missões do dia ficam fixadas no começo do dia.
- **Widget "Revisão do dia":** novo widget da tela inicial com as revisões vencidas e os dias seguidos; o número continua certo mesmo com o app fechado. Adicione em Ajustes → Lembretes. Verificado no emulador; ainda não testado em aparelho real.
- **Temas de cor:** Sakura, Matcha, Oceano e Lavanda, cada um claro e escuro, em Ajustes → Aparência.
- **Backup só das configurações:** em Ajustes → Dados e backup, um código "MDJC1:" com as preferências (sem a chave da IA, o seu nome e a voz do Android escolhida).

## [2.15.0] - 2026-10-28

Simulado offline, servidor de IA próprio, voz na conversa e mais treino de teclado.

- **Simulado offline:** em Frases → Gramática → Simulado. Provas de N5 e N4 com vocabulário, leitura, kanji e gramática, montadas só com o conteúdo do app (sem IA e sem internet), com 5, 8 ou 10 perguntas por seção, gabarito comentado e **nota por seção**.
- **Servidor de IA próprio:** novo provedor "Servidor próprio (compatível com a OpenAI)" em Ajustes → IA: Ollama, LM Studio, llama.cpp ou vLLM, com chave opcional. Só aceita endereços **https**; o http (sem criptografia) exigiria liberar esse tráfego no app inteiro e ficou de fora de propósito.
- **Conversa com a voz:** o botão "Falar em japonês" transforma a fala em texto no campo da conversa com a IA, para você conferir antes de enviar. Usa o serviço de fala do Android, que pode enviar o áudio ao Google.
- **Teclado:** séries "Pontuação" (frases com o sinal do fim) e "Números" (contar em kana) e meta diária de letras certas (50, 100 ou 200), com o contador de hoje.
- **Leitura:** botão "Marcar como lido" em cada texto e novos marcos "Textos de leitura lidos" no caminho do N5 e do N4 (o progresso entra no backup).
- **Vocabulário N4:** a frequência de uso, calculada com as frases do Tatoeba, passou a cobrir 618 das 629 palavras (antes, nenhuma).

## [2.14.0] - 2026-10-28

Gramática e leitura do N4, revisão espaçada por tecla e retenção ajustável.

- **Gramática N4, segunda leva:** 7 tópicos novos (causativa 〜させる, 〜たら, 〜と, 〜ようになる, 〜ために, 〜のに e 〜ても), agora 14 no total, com 53 frases do Tatoeba (CC BY 2.0 FR) conferidas na fonte (id, texto, leitura, furigana e tradução), mini-testes e notas de erros comuns. As explicações foram escritas por IA e ainda não foram revisadas por um falante. As frases vieram do banco local de 30 mil frases; descartei as com furigana errada no Tatoeba e a que lia 何 como "なん".
- **Leitura N4:** 8 textos corridos e 3 leituras do dia a dia (aviso de atraso do trem, hotel, elevador e terremoto), com seletor N5/N4 na tela de Leitura. As frases com palavras fora do vocabulário trazem a leitura e o significado de cada pedaço. Escritos por IA, a revisar por um falante.
- **Revisão espaçada por tecla:** cada letra do teclado de flick ganha um agendamento FSRS (errou: volta em 10 minutos; acertou: o intervalo cresce; várias letras na mesma sessão contam uma vez). "Pontos fracos" começa pelas letras vencidas e o desempenho mostra o que vence agora e quando volta a próxima. O agendamento entra no backup.
- **Retenção desejada:** em Ajustes → Revisões, escolha 80, 85, 90 (padrão) ou 95%. Vale para as próximas respostas.
- **ML Kit:** avaliado e mantido. Pelo que o Google documenta, não há como desligar o envio de dados técnicos; o aviso passou a aparecer na tela da câmera ("Sobre a privacidade do leitor"), com o que é enviado e o que não consta da lista.
- **Ferramentas:** o verificador de frases do Tatoeba tenta de novo quando a rede falha e confere pelo id quando a busca por texto não traz a frase.

## [2.13.2] - 2026-10-28

Correção do travamento ao baixar vozes do VOICEVOX.

- **Travava ao tocar em "Baixar":** o painel de termos lia o tipo de rede durante a renderização, o que muda a loja do VOICEVOX; como o cartão assinava a loja inteira, cada mudança redesenhava a lista, que lia a rede de novo, num laço sem fim (o app ficava a 100% de CPU, parado). Reproduzido no emulador e corrigido: a rede só é lida ao tocar, e o cartão e as linhas assinam só o que usam.
- **Download mais leve:** a barra de progresso é um componente à parte e a loja só é atualizada a cada 1% (antes, umas 5 vezes por segundo redesenhando todas as linhas). Por isso o aviso de leitor de tela "Baixando... N%" deixou de ser anunciado a cada atualização.
- Teste novo que falha no código antigo e passa no novo.
- **Licença:** o `LICENSE` ficou só com a MIT em inglês (o GitHub passa a reconhecê-la); a versão em português e os esclarecimentos sob a lei brasileira foram para `LICENCA.pt-BR.md`, com o art. 50 tratado como cautela (a licença não é cessão), "ícones originais", o aviso de que o ONNX Runtime do VOICEVOX e o Google ML Kit não são código aberto, e a aceitação ligada à cópia e à distribuição, não ao uso. No `NOTICE.md`: o ONNX Runtime deixou de ser listado como MIT, o aviso do reconhecimento de fala diz que o serviço do Android pode enviar o áudio ao Google, e a versão da CC BY do Waller consta como não informada pela fonte.

## [2.13.1] - 2026-10-28

Conferência dos dados de tom.

- **Tom (pitch accent):** o `build-pitch` guarda cada acento uma vez (a fonte repetia o número em palavras como 大事, "3,3"). Os dados do Kanjium foram comparados com o UniDic: o acento principal coincide em 96,9% de 912 palavras, e só 4 divergem (所, 余り, 結構, 大体). O resultado está em `src/content/LICENSE.md` e no ROADMAP.

## [2.13.0] - 2026-10-28

Correção dos áudios das palavras e símbolos, e tema claro/escuro nos Ajustes.

- **Áudio sem repetir:** o modo de áudio das gravações de falantes nativos (`duckOthers`) pedia o foco de áudio; quando a voz do Android tomava o foco, o player pausava a gravação e a retomava sozinho ao devolvê-lo, repetindo o som antigo. Agora as gravações usam `mixWithOthers`, o mesmo modo dos efeitos sonoros (antes os dois se alternavam no estado global do módulo), e tocam mesmo com o celular no silencioso.
- **Voz do Android:** o `Speech.speak` enfileira falas, e só se parava a anterior quando já tinha começado; toques rápidos acumulavam falas antigas. Agora a fala anterior é sempre cancelada ao trocar para uma gravação ou para o VOICEVOX. As novas tentativas automáticas (para voz silenciosa) também não repetem mais uma fala que saiu normalmente mas cujo motor não avisou o início.
- **Tema:** em Ajustes → Aparência, escolha Automático (segue o sistema), Claro ou Escuro. A escolha fica salva e entra no backup das preferências.
- Conferi as 360 gravações incluídas: todas existem, têm volume audível e nenhuma é duplicada. As palavras sem gravação usam a voz do Android ou o VOICEVOX.

## [2.12.0] - 2026-10-28

Gramática do N4 e o N4 nas metas.

- **7 tópicos novos de gramática (N4):** かもしれません, ことにしました, てしまいます, ておきます, はずです, a forma passiva e a forma ば, cada um com explicação em português, o que costuma confundir quem fala português, 3 a 4 frases reais do Tatoeba (conferidas na fonte) e exercícios de Montar e Lacunas. As explicações foram escritas por IA e ainda não foram revisadas por um falante.
- **Metas do N4:** a meta "Tópicos de gramática do N4 dominados" entrou no caminho do N4, e a do N5 passou a contar só os tópicos do N5.

## [2.11.0] - 2026-10-28

Revisão espaçada com FSRS e o vocabulário do N4.

- **FSRS no lugar das caixas:** o agendamento agora usa o FSRS (versão 5, pesos padrão): cada cartão tem estabilidade e dificuldade, e a revisão volta quando a chance de lembrar cai a 90%. Revisar antes ou depois do dia rende o intervalo certo, e cartão difícil volta mais cedo. A "caixa" (1 a 6) continua como estágio do cartão: firme, maduro e teimoso funcionam como antes. Cartões antigos seguem de onde estavam (a estabilidade parte do intervalo da caixa), e a memória do FSRS entra no backup. Os pesos são os do algoritmo, ainda sem ajuste aos seus dados.
- **Vocabulário do N4:** 629 palavras novas (lista JLPT N4 aberta, mesma fonte do N5), com leitura, significado em português, tom (Kanjium) e classe (JMdict), em grupos "N4: ...". Os significados foram escritos por IA e ainda não foram revisados por um falante. As palavras novas vêm depois das do N5.
- **Metas por nível:** o N4 ganhou a meta "Palavras do N4 aprendidas", separada da do N5.

## [2.10.0] - 2026-10-28

Vozes de anime: mais controle e mais fácil de achar.

- **Altura e entonação:** em Minhas vozes, três opções de altura (mais grave, normal, mais aguda) e três de entonação (suave, normal, expressiva). Valem para toda a fala em voz de anime; o áudio guardado antes é refeito.
- **Voz do atendente nos diálogos:** escolha outro personagem para o atendente; a sua fala e as dos exercícios continuam na voz em uso.
- **Buscar e favoritar:** busca por nome ou descrição (sem acento e sem maiúsculas) em Minhas vozes e na lista para baixar, estrela para favoritar (os favoritos vêm primeiro) e o filtro "Favoritas".
- **Comparar as vozes:** toca a mesma frase (cumprimento, pergunta ou curta) com cada voz baixada, uma depois da outra, com "Parar".
- **Botões:** "Usar" é secundário e "Ouvir" discreto, para não haver um botão rosa por personagem.

## [2.9.2] - 2026-10-28

Contagem própria da escrita e integração contínua.

- **Escrita nas estatísticas:** em "Por habilidade", uma linha à parte mostra o acerto dos símbolos que você desenhou (revisão, revisão mista, resgate e teste da lição). Eles continuam contando em "Kana e kanji". A contagem começa nesta versão.
- **Integração contínua:** o repositório ganhou o GitHub Actions (tipos, lint, testes e `expo-doctor` a cada push) e o Dependabot (o Expo em grupo, o SDK só à mão).

## [2.9.1] - 2026-10-28

Fecha a fase 2.9 (navegação e design).

- **Início:** "Estudar hoje" e "Sessão de hoje" viraram um cartão só: o botão de revisar e, logo abaixo, os passos do dia. O passo "Revisar" não se repete quando o botão de cima já cobre o kana.
- **Aba Frases:** cada grupo ganhou uma linha que diz do que se trata, e a segunda fileira mostra todas as opções de uma vez, sem rolar para o lado.
- **Acessibilidade:** alvo de toque ampliado no contador de pétalas (48 dp) e nos textos que tocam (romaji, exemplos das lições).
- **Botões:** em Ajustes → Dados, "Verificar código" é secundário, e o baú da semana cede o destaque ao do dia quando os dois aparecem. Um único botão rosa por tela.

## [2.9.0] - 2026-10-28

Ajustes e navegação mais claros (primeira parte da fase 2.9).

- **Ajustes em áreas:** a tela inicial virou uma lista com uma linha por área (Perfil e metas, Lembretes, Voz japonesa, Estudo e leitura, Sons e vibração, Inteligência artificial, Dados e backup, Avançado), cada uma com ícone e o resumo do que está ligado ("Leves · Noite (20h)"). Cada área abre numa tela própria. "Sobre e créditos" ganhou uma linha, e a versão passou para a tela de créditos.
- **Sem texto de desenvolvedor:** o nome técnico da voz do aparelho e o teste de som foram para Avançado; a voz mostra só "está pronta". O pedido para mandar captura da lista saiu.
- **Opções à vista:** nos Ajustes, meta por dia, dia de folga, horários, provedor da IA e limites mostram todas as opções de uma vez, em vez de rolar para o lado.
- **Menos parágrafo:** voz, revisões e o cartão "Estudar hoje" mostram uma linha, com o resto atrás de "Saiba mais".
- **Primeira abertura:** quem termina a introdução sem ter estudado nada cai direto na primeira lição.
- **Acessibilidade:** a engrenagem do Início e as linhas de Ajustes têm alvo de toque de pelo menos 48 dp.
- **Sistema de design:** novo `docs/DESIGN.md` (espaçamento, tipografia, botões, escolhas, estados, acessibilidade) e componentes `ListRow`, `LearnMore` e `ChipRow wrap`.
- **Ficou para depois:** repensar a aba Frases (falta medir o uso), juntar os dois cartões do Início e o restante da revisão de acessibilidade.

## [2.8.3] - 2026-10-28

Créditos e licenças em tela própria, download de voz mais robusto e privacidade descrita com precisão.

- **Créditos e licenças:** nova tela (Ajustes → Sobre → Créditos e licenças) com os créditos de cada fonte e o texto de licença de 336 componentes de terceiros (pacotes do app, bibliotecas Android e componentes nativos, inclusive os avisos do ONNX Runtime do VOICEVOX). Entraram créditos que faltavam: o aviso de uso do JMdict e do KANJIDIC2 (EDRDG) e a atribuição do Kanjium. A lista é gerada por `node scripts/licenses/build.mjs`.
- **Privacidade corrigida:** o README dizia "sem telemetria", mas o Google ML Kit (câmera que lê texto) envia ao Google dados técnicos de uso, e isso agora está dito no README, no `NOTICE.md` e na tela de créditos.
- **Download de voz:** continua de onde parou depois de uma queda ou de "Cancelar" (mostra "Continuar" e quanto já veio), confere o SHA-256 oficial de cada arquivo e descarta o que não confere, avisa quando a rede for de dados móveis, mostra o espaço usado e ganhou "Apagar todas as vozes".
- **Amostra:** se o site do VOICEVOX mudar ou cair, o botão oferece abrir a página do personagem; ao tocar, aparece o crédito "VOICEVOX:nome".
- **Baú do primeiro dia:** a primeira abertura dá boas-vindas, em vez de dizer que você "voltou".
- **Conferências:** os 460 itens de traços (176 kana e 284 kanji) foram comparados com o KanjiVG original (r20260714) e são idênticos; a cadeia de licença do tom (Kanjium) foi lida e documentada; os termos do site do VOICEVOX foram lidos. Novos testes de tela (11) e de dados. Não foi testado no aparelho depois do download novo.

## [2.8.2] - 2026-10-28

Limpeza dos textos do app e licença do projeto.

- **Importar backup:** a tela e a mensagem de erro passam a chamar o código `NDJ1:` de "formato antigo", em vez de explicar de onde ele vinha. O código continua sendo aceito como antes.
- **Licença:** o `LICENSE` agora traz a licença MIT em português e em inglês, com o que a lei brasileira pede que uma licença diga de forma expressa (objeto, modalidades de uso, prazo, território, gratuidade, direitos morais e o que fica de fora). O `NOTICE.md` lista as licenças de terceiros.
- **Documentação:** README reorganizado como página de portfólio, roadmap reorganizado por prioridade e por versão, e as seções técnicas longas foram para `docs/ARQUITETURA.md`. Comentários e testes deixaram de citar materiais de origem que não fazem mais parte do projeto.

## [2.8.1] - 2026-10-28

Corrige o volume baixo da voz de anime e deixa a escolha da voz clara.

- **Voz de anime sintetizada estava quase inaudível (corrigido).** O motor entrega cada personagem num volume diferente: medindo no celular, o ずんだもん saía uns 12 dB abaixo das amostras do site (cerca de um quarto do volume), o que fazia "Ouvir" e a amostra parecerem mudas. Agora todo áudio sintetizado é nivelado pelo pico (perto de -2 dBFS, como as amostras do site, com ganho máximo de 8 vezes). Os áudios guardados antes são refeitos sozinhos na primeira vez.
- **Escolher a voz ficou direto.** O cartão ganhou **"Minhas vozes"**: cada personagem baixado aparece com a descrição, o selo **"✓ Em uso"**, os tons (no personagem em uso) e os botões **"Ouvir"** e **"Usar esta voz"**. Usar uma voz já liga o VOICEVOX sozinho; some o passo separado de escolher o motor. "Voltar para a voz do Android" desliga. A lista de download passou a se chamar "Baixar vozes" e diz que a voz baixada aparece em "Minhas vozes".
- **Amostra com retorno visível:** o botão mostra "Carregando..." enquanto baixa ou sintetiza e "Tocando..." durante o áudio, e mostra o erro se falhar. Antes ele ficava mudo.
- **Projeto:** o roadmap foi reorganizado, o README virou uma página de portfólio com a seção de download e entraram o `LICENSE` e o `NOTICE.md` com as licenças de terceiros. Não foi testado no aparelho depois da correção do volume.

## [2.8.0] - 2026-10-27

A lista de vozes do VOICEVOX ficou mais clara: nomes em letras latinas, descrição em português e amostra para ouvir antes de baixar.

- **Nomes traduzidos:** cada personagem aparece como "Zundamon (ずんだもん)", com o nome romanizado a partir do endereço oficial dele no site do VOICEVOX. Os nomes que já são em letras latinas (WhiteCUL, Voidoll, No.7) não se repetem. Vale também para os chips de personagem do cartão de voz.
- **Descrição de cada voz em português:** as 43 frases que o site oficial usa para descrever a voz ("優しく可愛い声" → "Voz gentil e fofa") foram traduzidas, e os 63 tons de voz também ("あまあま" → "Doce", "ささやき" → "Sussurro"), na lista de download e nos chips de tom. Tradução feita por IA, a revisar por um falante.
- **Ouvir amostra:** cada personagem tem o botão "Ouvir amostra". Se a voz já foi baixada, o app a sintetiza no aparelho com uma frase de teste; senão, toca a amostra que o site oficial publica na página do personagem (precisa de internet; fica em cache e só é buscada quando você toca). Se o site mudar ou estiver fora do ar, o botão avisa em vez de falhar em silêncio.
- **Aceite dos termos de cada personagem, a cada download:** ao tocar em "Baixar", a tela mostra um aviso com o resumo das regras, o link dos termos de **cada personagem do arquivo** (o `0.vvm` tem quatro) e o dos termos gerais; só o botão "Li e aceito os termos de ... e quero baixar" começa o download, e "Cancelar" volta atrás. O aceite vale para aquele download (apagar a voz e baixar de novo pede de novo). Isso substitui o aceite único que a 2.7.0 pedia na entrada da lista, e a regra também está no código: sem o aceite, `downloadPack` não baixa nada (um teste confere).
- **Termos de cada personagem:** o botão "Termos" ao lado de cada voz abre a página de termos do próprio personagem, o endereço que o site oficial publica. Isso fechou a pendência da 雨晴はう, que não tem seção no arquivo geral de termos (ver `src/content/LICENSE.md`).
- O catálogo de vozes (`npm run voicevox:catalog`) agora também lê as 43 páginas de personagem do site oficial, e testes travam que todo personagem tenha descrição e todo tom tenha tradução.
- A tela Sobre deixa de dizer "uso pessoal: licenças a validar": a licença das listas do Tanos foi conferida (Creative Commons BY, com crédito). Continuam pendentes a revisão do conteúdo escrito por IA e a escolha da licença do projeto. Não foi testado no aparelho.

## [2.7.0] - 2026-10-27

As vozes do VOICEVOX deixam de ir dentro do APK: quem quer, baixa dentro do app.

- **Baixar vozes pelo app:** Ajustes → "Voz de anime (VOICEVOX)" → "Vozes para baixar". São 25 arquivos de voz de fala (de 55 a 65 MB cada, com um ou mais personagens), baixados direto da release oficial do VOICEVOX no GitHub. Há barra de progresso, "Cancelar" e "Apagar"; o arquivo só é aceito se o tamanho bate com o esperado, e uma voz que não abre é descartada. Depois de baixada, funciona sem internet. O 0.vvm (ずんだもん, 四国めたん, 春日部つむぎ, 雨晴はう) vem sugerido.
- **Termos de uso antes do primeiro download:** um resumo em português, o link para os termos completos e o botão "Li e aceito os termos". Sem o aceite, nenhum download começa (o aceite fica só no aparelho).
- **APK bem menor:** o `setup` agora baixa só o ONNX Runtime e o dicionário (`npm run voicevox:setup`), sem o `.vvm`. As vozes ficam numa pasta própria do app e **sobrevivem às atualizações**.
- **Sem recarregar o motor:** baixar ou apagar uma voz carrega ou descarrega só aquele arquivo; a lista de personagens se atualiza na hora.
- Corrige o motivo de o VOICEVOX nunca ter tocado na 2.6.0: o APK saiu sem o ONNX Runtime, o dicionário e as vozes (o `setup` ainda não tinha sido rodado) e o app caía em silêncio na voz do Android. Agora o estado "nenhuma voz baixada" aparece na tela, com o caminho para baixar.
- `npm run voicevox:catalog` regenera a lista de vozes (`voicevoxCatalog.ts`) a partir da tabela e da release oficiais. Não foi testado no aparelho.

## [2.6.0] - 2026-10-27

Voz de anime, câmera para ler, cartões, mais moldes e mais gramática. O app agora exige **Android 8.0 ou mais** (antes, 7.0), por causa do motor de voz.

- **Voz de anime (VOICEVOX):** Ajustes → "Voz de anime (VOICEVOX)". O motor VOICEVOX CORE roda dentro do aparelho, sem internet, com personagem e tom à escolha (四国めたん, ずんだもん, 春日部つむぎ, 雨晴はう no `0.vvm`). Os áudios ficam em cache, e se algo falhar o app volta sozinho para a voz do Android. O crédito "VOICEVOX:nome do personagem" aparece em Ajustes. As gravações de falantes nativos continuam tendo prioridade nas palavras que as têm (desligue-as em Sons e vibração para ouvir só o VOICEVOX). As vozes não vão no git: `npm run voicevox:setup` baixa o ONNX Runtime, o dicionário e as vozes pelo downloader oficial, onde você aceita os termos de uso. Sem isso o app funciona como antes. Não foi testado no aparelho.
- **Câmera para ler:** Frases → Palavras → 📷 Câmera. Fotografe (com recorte) ou escolha uma foto; o texto é lido no aparelho, sem internet (Google ML Kit, modelo japonês embutido). Você corrige o que veio errado, toca nas palavras para ver leitura e significado, ouve, e com a IA ligada traduz e explica o texto todo. Não foi testado no aparelho.
- **Cartões (flash cards):** Frases → Palavras → Cartões. Baralhos de palavras que você estuda, palavras novas, itens teimosos, kana, kanji, frases de viagem e Minhas frases; direção japonês → português, o contrário ou misturado; rodadas de 10, 20 ou 40, com "repetir os que errei". As respostas entram na revisão espaçada de forma cuidadosa: acertar só conta se o cartão já estava vencido, errar sempre conta.
- **Exportar para o Anki:** na mesma tela, gera um arquivo para importar no Anki (palavras, kanji, frases de viagem e Minhas frases), com cabeçalhos do Anki e etiquetas MojiDojo::....
- **Mais moldes (de 13 para 24):** horas ("às 3 horas, vamos nos encontrar"), check-in e check-out, meses ("em março vou ao Japão"), quando ("amanhã, semana que vem"), dias de folga, uma unidade e "mais um", permissão ("posso tirar uma foto?"), "eu quero + verbo", proibição ("não toque") e mais pedidos com a forma て ("fale devagar", "me ensine o caminho").
- **Gramática: 10 tópicos novos (de 41 para 51)** com frases reais do Tatoeba conferidas por script: 〜と おもいます, 〜でしょう, 〜つもりです, 〜なければ なりません, 〜た ほうが いい, 〜なくても いい, 〜すぎます, 〜やすい e 〜にくい, 〜たことが あります e os contadores. Cada um tem as notas de "erros comuns de quem fala português" e entra no Montar e nas Lacunas.
- O romaji dos moldes agora lê は, へ e を colados no fim da palavra como partículas (wa, e, o).

## [2.5.0] - 2026-10-27

Fecha a Fase 10: os itens que faltavam da IA, mais alguns extras. Tudo continua opcional e só funciona com a chave cadastrada em Ajustes.

- **GPT (OpenAI) como terceiro provedor:** Ajustes → Inteligência artificial agora aceita Gemini, Claude ou GPT, cada um com a sua chave (fora do backup) e o campo de modelo livre. O padrão do GPT é `gpt-4.1-mini`; se a OpenAI mudar os nomes, troque no campo. Não foi testado com uma chave da OpenAI.
- **Fila de pedidos sem internet:** quando um pedido de criação (frases do simulador, texto de leitura, cena de diálogo ou simulado) falha por falta de internet, aparece "Guardar o pedido para quando tiver internet". O app faz os pedidos da fila sozinho quando abre ou volta para a tela, ou pelo botão Fazer agora (Frases → ✨ IA). A fila guarda até 8 pedidos, não repete o mesmo e para na primeira falha passageira (sem internet, limite do dia, provedor fora do ar); pedidos que não têm como dar certo saem da fila.
- **Coach da semana (Frases → ✨ IA → Coach):** mostra os seus números da semana (dias estudados, respostas, acertos, sequência, retenção, itens teimosos) e, se você pedir, a IA monta o foco e três passos para a próxima semana. Só contagens e porcentagens saem do aparelho: nenhuma frase, palavra ou nota sua é enviada (um teste garante).
- **Feedback de fala (Falar):** quando uma frase não bate, "Por que não bateu? (IA)" compara o texto esperado com o que o reconhecimento de fala escreveu e explica o provável motivo, separando som difícil para brasileiros de simples erro do reconhecedor, com um treino curto. A IA não ouve o seu áudio, só compara textos.
- **Toque na palavra nos textos da IA:** nas frases da Leitura sob medida, cada palavra do vocabulário do app é tocável: mostra leitura e significado, toca o áudio e deixa aprender a palavra.
- **Cena de conversa inventada por você:** na Conversa, descreva a situação (por exemplo, pedir informação numa farmácia) e a IA faz o personagem. A descrição vai como dado seu, nunca como instrução.
- **Simulado com seção de Kanji** (escrita e leitura dos kanji mais comuns do N5), além de Vocabulário, Gramática e Leitura.
- **Meu Mochi → Por habilidade:** passa a mostrar a velocidade de digitação (média e recorde) e as notas dos simulados (tentativas, média e melhor nota).

## [2.4.0] - 2026-10-27

Dois recursos de IA (opcionais, com a chave cadastrada em Ajustes). Testados contra o Gemini de verdade com o `gemini-3.5-flash-lite` e o `gemini-3.5-flash`.

- **Diálogos novos (aba Diálogos → ✨ Cena nova com IA):** escolha um tema e a IA monta uma cena no mesmo formato das fixas: o atendente fala, você escolhe a resposta certa entre três, e cada errada explica por que não serve ali. Tudo em kana com romaji calculado pelo app (partículas lidas como wa, e, o), sem kanji e sem pontuação. A cena só entra se tiver pelo menos 2 turnos seus, uma única resposta certa por turno e o porquê de cada errada. As cenas ficam guardadas (até 12) na lista, com "Apagar", e rodam sem internet; a cena nova abre na hora.
- **Simulado estilo JLPT (Frases → ✨ IA → Simulado):** nível N5 ou N4, seção de vocabulário, gramática ou leitura, com 5 ou 10 questões de quatro alternativas, no formato do exame (leitura de kanji, lacuna ＿＿＿, texto curto com pergunta). Depois de cada resposta aparece o gabarito comentado (por que a certa serve e as outras não) e a tradução. No fim, nota, o que rever e "Refazer" (as alternativas são embaralhadas de novo). Os simulados ficam guardados (até 10) com a melhor nota, para refazer sem internet.
- **Contra erro de gabarito da IA:** a IA precisa copiar o texto da alternativa certa, e a questão é descartada se a cópia não bater com a posição indicada; também saem as questões com alternativas repetidas ou vazias e as cujo comentário cita "alternativa 2" ou "a terceira opção" (as alternativas são embaralhadas, e a citação ficaria errada). Mesmo assim a IA pode errar: o aviso "Gerado por IA. Pode errar" aparece em tudo, e não é uma prova oficial.
- Limite de saída maior nesses pedidos, para modelos que "pensam" antes de responder não terem a resposta cortada.
- A aba de IA ganhou o chip "Simulado".

## [2.3.0] - 2026-10-26

Quatro novidades de IA (todas opcionais, com a chave cadastrada em Ajustes) e mais lugares com o "Por quê?".

- **Dica de memória para itens teimosos:** no card Itens teimosos, "Dica de memória (IA)" cria uma imagem ou historinha para o kana, a palavra, a forma de verbo ou a partícula que você esquece sempre, mais um treino diferente de repetir. Nas palavras, "Usar como minha dica" guarda o texto na nota de memória da palavra.
- **Por quê? e avaliação em mais telas:** no Montar, a IA explica por que a frase certa é a certa. Em Traduzir → Entender (livre), "A IA avalia o que você escreveu" diz se o seu português bate com o sentido (certo, quase ou outro), o que fecha a lacuna de não dar para corrigir português livre. As Lacunas, a Conjugação e o Contar já tinham o "Por quê?" pelos quizzes.
- **Registro (Frases → ✨ IA → Registro):** escreva uma frase em português ou em japonês e veja a mesma ideia em casual, educado e formal, com leitura, áudio, quando usar cada uma e a diferença principal.
- **Leitura sob medida (Frases → ✨ IA → Leitura):** escolha um tema e o tamanho (4 ou 7 frases) e a IA escreve um texto de leitura N5 com as palavras que você já aprendeu. Tem leitura em hiragana, tradução sob demanda, áudio de cada frase e do texto todo, "Salvar a frase" e o aviso de quantas frases só usam palavras do app. Os textos ficam guardados (até 20) para ler sem internet.
- As abas da área IA viraram uma fileira de chips: Conversa, Explicar, Diário, Registro e Leitura.

## [2.2.0] - 2026-10-26

Conversa por texto com a IA (Frases → ✨ IA → Conversa). Precisa da chave cadastrada em Ajustes; sem ela, o resto do app não muda.

- **6 cenas:** restaurante, loja, estação de trem, hotel, conhecer alguém e bate-papo com amigo. A primeira fala é do app (sem gastar a IA); depois a IA faz o personagem em japonês simples (N5), com no máximo uma pergunta por vez.
- **Você digita, ela fala:** a resposta é lida pela voz japonesa do aparelho (dá para desligar), com botão para ouvir de novo e tradução sob demanda. Você responde com o teclado do app (flick) ou o do celular.
- **Correção a cada frase sua:** se havia o que melhorar, aparece "Melhor:" com a versão corrigida e uma explicação curta em português.
- **Ideias de resposta:** três sugestões curtas, com tradução, para quem trava; um toque preenche o campo.
- **Resumo:** ao terminar, as frases corrigidas aparecem para salvar em Minhas frases (entram na revisão). Máximo de 12 falas por conversa, para controlar o custo.
- Se a IA falhar (sem internet, limite, chave), a sua fala volta para o campo para tentar de novo.

## [2.1.0] - 2026-10-26

Mais recursos de IA em Frases → ✨ IA: explicar qualquer texto japonês e um diário corrigido. Só aparecem com a IA ligada e a chave cadastrada em Ajustes.

- **Explicar texto:** cole uma fala de anime, uma mensagem ou uma frase. A IA devolve a tradução, a leitura em hiragana, as palavras importantes (com leitura e significado), os pontos de gramática e uma observação quando há gíria ou dúvida. Tem áudio e "Salvar a frase" (vai para Minhas frases, na revisão).
- **Diário:** escreva de 1 a 3 frases sobre o seu dia (com o teclado do app ou o do celular). A IA corrige cada uma, explica o que mudou, traduz e dá um comentário geral. Dá para ouvir e salvar as corrigidas em Minhas frases. Os diários anteriores ficam guardados no aparelho (fora do backup).
- **Frases da IA do simulador:** cada frase guardada ganhou "Salvar em Minhas frases".
- **Roadmap:** itens 3, 5 e 6 da Fase 10 marcados como feitos; falta receber o texto pelo compartilhar do Android.

## [2.0.0] - 2026-10-26

Simulador de teclado completo e IA opcional: você cadastra a sua chave (Gemini ou Claude) e a IA ajuda a corrigir, explicar e criar frases. A IA só gera texto; o áudio continua sendo a voz do aparelho. Sem chave ou sem internet, tudo continua funcionando.

- **Simulador de teclado refeito (Teclado → Simulador):** em vez de 14 palavras fixas, milhares de itens tirados do vocabulário, das frases do app, das suas frases e das da IA, só com o que o teclado de flick consegue digitar.
  - **Níveis:** 6 níveis, das primeiras fileiras até frases inteiras; cada um libera depois de 8 itens no anterior.
  - **Pontos fracos:** escolhe itens com as letras em que você mais erra.
  - **Conversão:** digite a leitura e escolha o kanji ou o katakana na barra de sugestões simulada (com as palavras de mesma leitura entre as opções).
  - **Livre:** escreva o que quiser e veja o romaji e as palavras conhecidas.
  - **Desempenho:** mapa de calor por tecla (erros e tempo médio), letras por minuto, média e recorde. Entra no backup (campo opcional `typing`; códigos antigos continuam valendo).
- **IA opcional (Ajustes → Inteligência artificial):** provedor Gemini ou Claude, chave guardada no armazenamento seguro do Android e **fora do backup**, modelo editável (padrão barato), limite de pedidos por dia, uso do dia à vista e teste de conexão. Erros em português (chave recusada, limite, sem internet, resposta fora do formato). Respostas repetidas vêm do cache e não gastam a IA.
- **Corrigir minhas frases:** em Frases → Minhas frases, "Corrigir com IA" mostra a correção, uma forma mais natural e o porquê, e deixa usar a frase corrigida.
- **Por quê?:** nos erros dos quizzes e dos exercícios de escrita, e em cada tópico de gramática (com campo para a sua dúvida).
- **Frases com IA no simulador:** escolha um tema (viagem, dia a dia, trabalho, comida, família, anime), a IA cria 6 frases em hiragana com as palavras que você já aprendeu, avisa de palavra fora do vocabulário e as frases ficam guardadas para treinar offline.
- **Cuidados:** todo texto da IA vem marcado como "gerado por IA, pode errar", nada entra na revisão sem você salvar, e a IA não foi revisada por um falante nativo.
- **Roadmap:** novas Fase 9 (simulador) e Fase 10 (IA) com todas as melhorias planejadas.

## [1.16.0] - 2026-10-24

Sons que não tocavam, missões novas (com dificuldade e desempenho) e a validação das frases do Explorar com modelos abertos.

- **Áudio mudo corrigido na raiz:** a voz do Android calava com textos de uma ou duas letras (vogais, あい, いえ, kanji sozinho). Agora toda fala chega com pelo menos três letras (repetida com pausa, como "あ、あ、あ"), o apoio entre parênteses não é falado, e a fala não é mais cortada na mesma hora em que outra começa. Se a voz der erro ou terminar sem começar, o app tenta de novo (texto reforçado e depois sem a voz escolhida). Um teste confere os mais de 1.300 textos que o app fala (sons, kana, kanji, palavras).
- **Diagnóstico de som (Ajustes → Voz japonesa):** toca 8 textos de teste (do mais curto à frase), em velocidade normal e devagar, direto na voz do aparelho, e mostra quais saíram, com o tempo de cada um, mais as últimas falas do app. Se algo ainda ficar mudo, a captura dessa lista mostra por quê.
- **Missões do dia, agora 24 (eram 10):** todo dia vêm uma **fácil, uma média e uma difícil** (4, 6 e 9 pétalas), sem repetir as de ontem. Novas: revisão com 90% de acerto, revisão em até 5 minutos com 80%, 8 ou 15 acertos seguidos, 85% de acerto em 30 respostas, treinar 3 ou 5 áreas diferentes, acertar itens que você tinha errado, estudar 10, 20 ou 30 minutos, folhear 20 frases do Explorar e 20 exercícios de gramática. As de tempo e desempenho se resgatam sozinhas.
- **Itens errados saem da lista de erros** quando você os acerta (contam para a missão de "itens que errou").
- **Validação das traduções (`docs/validacao-traducoes.md`):** LaBSE (nota de margem) e NLLB-200, rodando no computador, apontaram traduções desencontradas no banco do Explorar: 1.475 frases (5%) saíram, ficaram 28.525. Nas frases escritas por IA (viagem, atendente, moldes) o teste não serve (frases curtas em kana), então valem a conferência do 1.14.1 e a revisão por um falante.

## [1.15.0] - 2026-10-24

Explorar frases: 30 mil frases de falantes, com tradução em português, para buscar uma palavra em uso. Tudo no aparelho, sem servidor.

- **Nova tela Frases → Explorar:** busca por uma palavra em japonês (em kanji, hiragana ou katakana, e também conjugada) ou por um trecho em português, e o botão "Sortear frases" para folhear. As frases vêm das mais curtas para as mais longas, com furigana, romaji, voz e a opção "Salvar nas minhas frases" (entram na revisão).
- **De onde vêm:** frases do Tatoeba (CC BY 2.0 FR), escolhidas para o seu nível: só com palavras do vocabulário do app, no máximo uma palavra nova (avisada na frase), sem números, nomes de pessoas e alguns temas. Cada frase mostra o número no Tatoeba. Algumas traduções são livres, porque o Tatoeba as liga pelo inglês.
- **Como funciona:** um banco SQLite de 9 MB vai dentro do app (`assets/sentences.db`, gerado no computador por `scripts/example-sentences/build.mjs`). O APK ficou maior por isso.
- **Limites:** as leituras (furigana) são automáticas e podem errar; nada disso foi revisado por um falante. Detalhes em `src/content/LICENSE.md`.

## [1.14.1] - 2026-10-23

Conferência do japonês do app em fontes abertas, com um selo de confirmação em cada frase e algumas correções.

- **Conferência em várias fontes:** as frases de viagem, as falas do atendente e os moldes (escritos por IA) foram comparados com 249 mil frases de falantes do Tatoeba (escritas em kana e com kanji, pelas grafias do JMdict), com o guia de frases da Wikivoyage e com o dicionário JMdict (todas as palavras e 59 dos 62 pares kanji + leitura dos textos de placas e cardápios conferem; os 3 restantes são um nome próprio, um composto e uma conjugação, corretos).
- **Selo em cada frase:** sob a frase aparece "✓ Frase confirmada em exemplos de falantes" (com a fonte), "◐ Construção confirmada" (só o fecho da frase aparece nas fontes) ou "Ainda sem confirmação em fontes: revisão de um falante pendente". 148 das 188 frases de viagem e 98 dos 107 moldes têm algum selo. "Sem confirmação" não quer dizer errada, e sim que nenhuma fonte aberta tinha a frase.
- **Correções:** "Onde retiro a bagagem?" passou para a forma de possibilidade (にもつは どこで うけとれますか), "Não encontro a minha bagagem" perdeu o わたしの a mais, "Quero ficar mais um dia" virou "mais uma noite" (もう いっぱく したい です), e a fala do atendente do conbini ficou mais natural (ふくろは ごりよう ですか, おはしは おつけ しますか, ポイントカードは おもち ですか) e a pergunta da imigração também (たいざい します).
- O relatório completo, com a lista do que ainda espera um falante, está em `docs/verificacao-japones.md`.

## [1.14.0] - 2026-10-23

Loja, baús e raridades: ganhar pétalas ficou mais difícil, o baú diário de verdade, 66 itens novos e um Mochi com mais vida.

- **Pétalas mais difíceis de ganhar:** o teto diário de lições e revisões caiu de 150 para 60, lições e revisões pagam cerca de metade, missões valem 6 (antes 10) e o desafio da semana 25 (antes 40). Os preços da loja subiram 2,5 vezes (de 150 a 900 pétalas). Quem já tinha itens e pétalas mantém tudo.
- **Baú do dia:** ao abrir o app pela primeira vez no dia, o baú aparece com uma revelação animada: pétalas e, às vezes, um item exclusivo. Com "Depois" ele fica esperando (botão na tela inicial). Sem item por 6 dias seguidos, o próximo traz um item raro ou melhor.
- **Baú da semana:** ao bater a meta de 4 dias, abre com o mesmo efeito e sempre traz um item exclusivo, sem repetir os que você já tem.
- **Raridades:** comum, raro, épico e lendário, com cores e estrelinhas, na loja, no armário e nos baús.
- **66 itens novos (111 no total):** acessórios de cabeça, rosto e pescoço, 10 fundos, 8 cores e as **peles**, uma categoria nova que muda o jeito do corpo do Mochi (listrado, manchado, estrelado, de ondas, panda, robô, dragão, fantasma, cósmico, coruja, sensei...). 22 itens só saem de baú e 29 só por conquista; 14 conquistas ganharam item.
- **Loja redesenhada:** categorias (cabeça, rosto, pescoço, fundos, cores, peles e coleção rara), filtros (todos, posso comprar, meus), ordem (padrão, menor preço, raridade), cartões com o Mochi vestido com cada item, prévia grande, confirmação de compra e chuva de pétalas ao comprar. O armário também mostra a raridade e quantos itens você tem de cada espaço.
- **Mochi com mais vida:** 7 humores novos (com sono, surpreso, apaixonado, pensando, orgulhoso, piscando, animado), piscadas e movimentos próprios; tocar no Mochi na tela inicial e em Meu Mochi faz ele reagir (pula, gira, se espreme e muda de humor por um instante). O humor também segue a situação: com sono de madrugada, orgulhoso quando a meta de minutos é batida, apaixonado com 30 dias de sequência.
- **Correção de áudio:** os kana soltos (あ, い, う, え, お e outros) não tocavam em várias telas porque a voz japonesa do Android fica muda com um caractere só. Agora o app diz o kana duas vezes ("あ、あ") e ele passa a tocar.

## [1.13.0] - 2026-10-23

Introdução com perfil, ajustes mais simples, lembretes com meta de minutos e textos de placas e cardápios reais. Tudo no aparelho.

- **Introdução na primeira abertura** (também na primeira depois desta atualização): você escolhe um nome de usuário, conhece as funções do app, define quantos minutos quer treinar por dia, se quer um dia de folga e como quer os lembretes. Dá para pular, e para rever em Ajustes → Você → Rever a introdução.
- **Meta de minutos por dia:** o app conta o tempo em que você está usando de verdade (toques nos últimos 60 s, com o app aberto) e mostra o progresso em "Sessão de hoje". A meta também ajusta a meta diária de respostas.
- **Lembretes com a sua meta e o seu nome:** "Você ainda não completou seus 20 minutos hoje! Faltam X min.", "Não esqueça de aprender algo novo hoje!" e outros. O aviso da noite só aparece se a meta ainda não foi batida, e o dia de folga não tem lembrete.
- **Ajustes mais simples:** os lembretes viraram três jeitos prontos (sem lembretes, leves, normais) com horários prontos (manhã, almoço, fim da tarde, noite) e uma prévia de como as mensagens aparecem. Horário exato, dias e silêncio ficam em "Personalizar". O perfil (nome, meta, folga) ficou no topo, e voz, revisão, exibição, sons e dados ficaram em seções que abrem com um toque.
- **Nome na tela inicial** ("Olá, Ana!") e nas mensagens do Mochi.
- **Leitura de placas, avisos e cardápios reais** (Frases → Leitura → Dia a dia): 9 textos novos (estação, proibições, horários de loja, cardápio de lámen, preços e impostos, banheiros e onsen, regras no transporte, conbini). Usam kanji de verdade, e cada pedaço da frase é tocável e mostra a leitura e o significado. Escritos por IA, a revisar por um falante.

## [1.12.0] - 2026-10-23

Foco em viagem e dia a dia: como a frase se monta, montar frases, e frases e diálogos prontos. Tudo no aparelho.

- **151 frases novas** de viagem e de dia a dia (de 37 para 188), em 15 categorias: Apresentação, Dia a dia, Aeroporto, Direções, Conbini, Dinheiro, Saúde, Telefone e internet e Atrações são novas, e Básico, Transporte, Restaurante, Compras e Hotel ganharam mais. Cada uma tem romaji, tradução e "Palavra por palavra", e entram em Ouvir → Repetir e em Traduzir. Escritas por IA, a revisar por um falante.
- **9 diálogos novos** (de 4 para 13): imigração, táxi, conbini, pedindo o caminho, farmácia, comprando roupa, conhecendo alguém, bar japonês e problema no quarto. As respostas erradas explicam o porquê.
- **Estrutura da frase** (Frases → Estrutura): o mapa da frase japonesa (blocos "palavra + partícula", verbo no fim), as frases de viagem abertas em blocos coloridos pelo papel de cada um, e um treino "Qual é o papel?".
- **Frases-modelo** (Frases → Modelos): 13 moldes com uma lacuna ([coisa] を ください, [lugar] は どこ ですか, alergias, de onde você veio, como pagar...) para montar muitas frases trocando só uma palavra, com um desafio de escolher a frase certa.
- **Montar com frases de viagem:** uma segunda fileira de tópicos com as categorias de viagem (147 exercícios).
- A aba Frases agora tem as seções em três grupos (Palavras, Gramática, Frases).
- Corrigido o "Palavra por palavra" de uma frase do original que estava sem o は.

## [1.11.2] - 2026-10-23

Fecha o que a validação geral (1.11.1) deixou aberto.

- **Dicas de memorização:** os 216 kanji que não tinham dica (os do N4 e vários do N5) ganharam uma, escrita por IA a partir dos componentes de cada kanji no KanjiVG. São imagens para lembrar a forma, não a origem histórica do caractere. A revisar por um falante.
- **Frases de exemplo:** 33 palavras que não tinham nenhuma frase no Banco ganharam (153 frases novas do Tatoeba). Ainda faltam frases para 176 palavras, quase todas de uma forma que só aparece em kanji nas frases (くつ, すし) ou palavras raras em frases curtas.
- **Tom:** o script de acento passou a incluir as palavras de exemplo dos kanji (日本語, 東京...): mais 9 palavras com tom. As outras não estão no Kanjium (principalmente palavras em katakana).
- **Permissões:** `SYSTEM_ALERT_WINDOW`, que só serve para ferramentas de desenvolvimento, foi bloqueada no app.

## [1.11.1] - 2026-10-23

Validação geral do app: correções de conteúdo, layout, acessibilidade e desempenho.

- **Palavras repetidas:** 36 palavras apareciam duas vezes no vocabulário (あさ e 朝, いぬ e 犬...), então dava para estudar a mesma palavra duas vezes. Agora só a forma com kanji é oferecida como nova; quem já tinha estudado a outra forma mantém o progresso, e o total e o "aprendidas" contam cada palavra uma vez. Frases de exemplo, tom e classe da forma com kanji valem para a outra.
- **Lições de kanji:** os 43 kanji que não tinham nenhuma palavra de exemplo (員, 民, 市, 県, 森...) ganharam uma, do JMdict (significado em português escrito por IA, a revisar). Kana sem exemplo (が, ぎ, きゃ...) mostram uma palavra do vocabulário.
- **Gramática:** os tópicos de 〜てください, 〜ています, 〜ないでください e convidar (ましょう/ませんか) tinham 0 ou 1 exercício de montar frase; agora têm de 2 a 3, com frases do Tatoeba.
- **Layout:** a aba Frases tinha 13 chips numa fileira só; agora são 3 grupos (Palavras, Gramática, Frases) com uma segunda fileira. A aba Teclado usa chips (4 seções não cabiam bem). Texto grande do sistema não estoura mais cartões e títulos (limite de crescimento por tipo de texto).
- **Acessibilidade:** botões com emoji ("🔊 Ouvir") agora são lidos só como "Ouvir". Tela de erro amigável no lugar de tela em branco se algo quebrar.
- **Desempenho:** telas que não estão à vista ficam congeladas, então responder no quiz não redesenha a tela inicial por trás.
- **Configuração:** o plugin de áudio estava declarado duas vezes com configurações contrárias; ficou um só (sem serviço de áudio em segundo plano, que o app não usa). Instalado `expo-system-ui`: o tema escuro/claro automático passa a valer e o fundo da janela acompanha o tema (sem clarão branco ao abrir o teclado).

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

- **Backup:** novo "Exportar backup" em Ajustes gera um código `MDJ1:` com todo o progresso (inclusive histórico, Repetir e desafios). O importador aceita `MDJ1:` e `NDJ1:` (formato antigo).
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
- **Início:** painel de constância e evolução. **Ajustes:** voz, importação de backup do formato antigo, som e vibração.
- **Geral:** tela de carregamento com o Mochi, efeitos sonoros e vibração, temas claro e escuro.
