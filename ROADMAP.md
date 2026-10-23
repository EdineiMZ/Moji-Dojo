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
  - Feito: japonês → significado, significado → japonês e ouvir → palavra escrita (só palavras de kana). A direção "leitura" (kanji → como se lê) ainda não existe.
- [x] **Palavra ligada ao kanji:** ao estudar um kanji, mostrar as palavras que o usam; ao aprender uma palavra, destacar os kanji que a formam. *(M)*
- [~] **Cada palavra com:** leitura, significado em português, classe (substantivo, verbo, adjetivo), uma frase de exemplo com tradução e áudio. *(M)*
  - Feito: leitura, significado, romaji (quando a fonte traz), kanji da palavra e áudio. Falta: classe gramatical e frase de exemplo, que dependem de uma fonte nova.
- [ ] **Palavras mais úteis primeiro:** ordenar por frequência e por situações reais (restaurante, transporte, compras, apresentação). *(P)*
- [ ] **Mnemônicos e notas:** campo para o aluno escrever a própria dica de memória em cada palavra. *(P)*
- [ ] **Expandir kanji:** completar o N5 e avançar para o N4, com as mesmas lições de traços, leituras e exemplos. *(G)*

### Antes de publicar (pendência registrada)

O app é de **uso pessoal e privado**, então as licenças de conteúdo ainda não foram validadas. Antes de distribuir o app para outras pessoas, seguir a lista "Antes de publicar" em [`src/content/LICENSE.md`](src/content/LICENSE.md): confirmar a licença das listas do Tanos (ou trocar a fonte), cumprir o crédito do JMdict se for usado, **revisar as traduções com um falante** e escolher a licença do projeto.

### Fase 2: gramática ativa

Objetivo: transformar "li sobre は e が" em "uso は e が sem pensar".

- [~] **Completar o N5 gramatical** (cerca de 40 pontos): partículas, formas do verbo, adjetivos, pedidos, permissão, desejo, comparação, contadores. Hoje são 10 tópicos. *(G)*
  - Feito (30 tópicos): +20 tópicos (11 a 30) com explicação própria e 80 frases reais do **Tatoeba** (CC BY 2.0 FR) conferidas na fonte (`npm run verify-grammar`): でした/ではありません, adjetivos い e な no negativo e no passado, 〜てください, 〜ています, 〜ないでください, 〜てもいい, 〜てはいけません, 〜ましょう/ませんか, がほしい, より, いちばん, すき/じょうず, から/まで, から (motivo), palavras interrogativas, もう/まだ, posições, になる, できる. Fonte e crédito em `src/content/LICENSE.md`. Os exemplos viraram 59 exercícios de Montar e de Lacunas (todos os tópicos novos, menos o 19, têm o botão Praticar). Falta: ~10 pontos (contadores, ～前に/～後で, ～ながら, forma simples...) e a revisão das explicações por um falante.
- [~] **Exercícios de lacuna (cloze):** frases com um espaço para a partícula ou a forma correta, com explicação do erro. *(M)*
  - Feito: sub-aba **Lacunas** em Frases, com as frases do Montar (26) viradas em ~40 lacunas de partícula e de final da frase, tradução embaixo e a regra ao errar. Aceita as variações (に/へ, を/が). As frases do Tatoeba entraram nas lacunas (cerca de 100 no total, com から/まで/より também).
- [~] **Treinador de conjugação:** o app mostra o verbo e a forma pedida (ます, ない, て, た...) e o aluno escolhe ou digita. Revisão espaçada por verbo e por forma. *(M)*
  - Feito: sub-aba **Conjugar** em Frases, com ~110 verbos do vocabulário, 4 formas (ます, ない, て, た) geradas por regra, alternativas com os erros típicos (regra de outro grupo, final de て errado) e revisão espaçada por verbo e forma (`progress.conj`, também no backup). Falta: digitar a resposta, e as formas ませんでした, たい, ている e a de dicionário.
- [~] **Treinador de partículas:** は/が, に/で, を, へ, と, も, de/para. É onde brasileiros mais erram, com treino de pares confusos. *(M)*
  - Feito: o filtro "Partículas" das Lacunas, com os pares confusos (は/を/も, に/で/を). Falta: が (precisa do tópico de gramática antes) e a revisão espaçada por partícula.
- [x] **Contadores e números:** leitura, datas, horas e preços, com áudio. *(M)*
  - Feito: sub-aba **Contar** em Frases. Números de 1 a 99.999, horas (よじ, しちじ, くじ, ふん/ぷん, はん), datas (ついたち... はつか), preços (よえん) e 11 contadores (人, つ, 本, 枚, 冊, 台, 匹, 個, 歳, 階, 回) de 1 a 10, tudo gerado por regra e tabela e conferido por testes. Dois modos: ler (ver a escrita, escolher a leitura) e ouvir. As respostas erradas são a regra sem a exceção (さんびゃく → さんひゃく). Inclui tabela de consulta.
- [x] **"Erros comuns de quem fala português":** notas curtas (ordem das palavras, sujeito omitido, falta de artigos e plural). *(P)*
  - Feito: 10 dicas gerais no topo da Gramática (verbo no fim, sujeito omitido, sem artigos, を não é "o", sim/não em pergunta negativa...) e notas por tópico (28 dos 30). Escritas por IA, **a revisar por um falante** antes de publicar (`src/content/pitfalls.ts`).
- [x] **Mini-teste por tópico:** só libera "dominado" depois de acertar sem consultar a explicação. *(P)*
  - Feito: botão em cada tópico, até 5 perguntas ("o que quer dizer?" com os exemplos e lacunas com as frases do Montar), sem a explicação à vista; 80% de acertos de primeira marcam o tópico como dominado (✓ na lista, contador no topo, `progress.mastered` e backup).

### Fase 3: montar e produzir frases

Objetivo: sair de reconhecer para **produzir**.

- [ ] **Montar evoluído:** além de blocos prontos, escolher entre várias respostas válidas, com feedback do que mudou o sentido. Já aceita mais de uma ordem; ampliar a variedade. *(M)*
- [ ] **Traduzir digitando:** do português para o japonês usando o teclado de flick do app ou o do celular, com correção tolerante (kana ou kanji, espaços, pontuação). *(G)*
- [ ] **Traduzir do japonês:** mostrar uma frase e pedir o sentido, com opções e depois resposta livre. *(M)*
- [ ] **Banco de frases com tradução:** frases de um corpus aberto (seção 6), filtradas pelo vocabulário que o aluno já conhece. Cada frase nova pode virar cartão. *(G)*
- [ ] **Minhas frases:** o aluno escreve frases próprias sobre a sua vida (eu moro em..., eu gosto de...). O app guarda e revisa. *(M)*
- [ ] **Diálogos curtos com escolhas:** cenas de restaurante, estação, hotel, loja. Em cada turno, o aluno escolhe ou monta a resposta. *(G)*
- [x] **Furigana e romaji ajustáveis:** mostrar, ocultar ou só ao toque, por nível de confiança. *(P)*
  - Feito: Ajustes → Leitura das frases. Romaji (sempre, ao tocar, nunca), escrever com kanji (liga a escrita normal nas frases da gramática, 76 delas) e furigana (sempre, ao tocar, nunca), com prévia. Vale para os exemplos da gramática, as frases de Viagem e as palavras. O furigana vem do Tatoeba e é conferido por `npm run verify-grammar`.

### Fase 4: escuta e fala

Objetivo: entender o japonês falado e conseguir se fazer entender.

- [ ] **Ditado:** ouvir uma palavra ou frase e digitar. Corrige em kana e mostra a diferença. *(M)*
- [ ] **Compreensão de frases e diálogos:** ouvir e responder perguntas de sentido, com velocidade normal e lenta. *(M)*
- [ ] **Áudio de melhor qualidade:** hoje a voz é a síntese do sistema. Avaliar áudio gravado por falantes nativos com licença livre, que também mostra o sotaque melhor. *(G)*
- [ ] **Tom das palavras (pitch accent):** indicar a queda de tom das palavras mais comuns, com exemplos de pares. *(M)*
- [ ] **Gravar e comparar (shadowing):** gravar a própria voz e ouvir ao lado do modelo, com a forma de onda. É a evolução do "Repetir" atual, que só tem autoavaliação. *(M)*
- [ ] **Reconhecimento de fala em japonês:** pedir ao aluno para dizer a frase e conferir com o reconhecimento do Android. Exige módulo nativo, que o build local já suporta. Resultado aproximado, usado como guia e não como nota. *(G)*

### Fase 5: leitura

Objetivo: ler textos reais e ganhar vocabulário em contexto.

- [ ] **Textos graduados:** historinhas e diálogos curtos escritos para o nível (N5, depois N4), com áudio. *(G)*
- [ ] **Toque na palavra:** mostra leitura, significado e classe a partir de um dicionário offline (seção 6). *(G)*
- [ ] **Palavra desconhecida vira cartão** com um toque, já com a frase de onde veio. *(M)*
- [ ] **Furigana opcional** e destaque das palavras já aprendidas, para o aluno enxergar o quanto já entende. *(M)*
- [ ] **Leitura do dia a dia:** cardápios, placas, avisos e horários de trem, para treinar o que se encontra em viagem. *(M)*
- [ ] **Câmera para ler (opcional):** apontar para um texto e ver as leituras. Depende de OCR no aparelho e deve ser avaliado com cuidado. *(G)*

### Fase 5b: fluidez de leitura de kana

- [ ] **Treino cronometrado de kana:** ler e reconhecer rápido, o que separa "sei" de "leio sem pensar". *(P)*
- [ ] **Katakana de palavras estrangeiras:** treinar com palavras de origem inglesa (コーヒー, ホテル) para ligar a escrita ao som. *(P)*

### Fase 6: motor de aprendizado e plano diário

Objetivo: o app decide o que estudar hoje e mede o que realmente ficou.

- [ ] **Algoritmo de revisão melhor:** trocar as caixas fixas (1, 3, 7, 14, 30 e 60 dias) por um modelo que ajusta o intervalo à dificuldade de cada item (como o FSRS, de código aberto). Mantém a importação do progresso antigo. *(G)*
- [ ] **Sessão diária guiada** de 15 a 20 minutos: revisões, 1 conteúdo novo, 1 exercício de escuta, 1 frase para produzir. Tem começo, meio e fim. *(M)*
- [ ] **Limites e metas:** quantos itens novos por dia, revisões máximas, meta semanal. Evita acumular uma pilha desanimadora de revisões. *(P)*
- [ ] **Mistura de tipos de exercício** (intercalar kana, vocabulário, gramática) em vez de blocos longos do mesmo tipo. *(M)*
- [ ] **Itens "teimosos" (leeches):** detectar o que o aluno erra sempre e propor outra abordagem (mnemônico, exemplo novo, quebrar em partes). *(M)*
- [ ] **Estatísticas por habilidade:** leitura, escrita, escuta, fala e vocabulário, com retenção real (% que continua lembrando após semanas). *(M)*
- [ ] **Metas por nível:** caminho N5 → N4 → N3 com marcos claros ("sabe 800 palavras e 40 pontos de gramática"). *(M)*
- [ ] **Teste de nivelamento** para quem já sabe parte do conteúdo e quer pular. *(M)*
- [ ] **Lembretes** no horário que o aluno escolher, sem insistir demais. *(P)*

### Fase 7: motivação e vínculo com o Mochi

Objetivo: dar vontade de voltar, sem pressão tóxica.

- [ ] **Mochi que acompanha o progresso:** muda de humor com a constância, ganha acessórios ao atingir marcos. *(M)*
- [ ] **Conquistas** ligadas a hábitos bons (7 dias seguidos, 100 palavras, primeira frase própria). *(P)*
- [ ] **Desafio da semana:** pequena meta temática (por exemplo, vocabulário de comida). *(P)*
- [ ] **Recomeço sem culpa:** depois de uma pausa, o app reduz a pilha de revisões e ajuda a retomar. *(M)*
- [ ] **Resumo semanal** do que foi aprendido e do que precisa de atenção. *(P)*

### Fase 8: fora do app (onde a fluência acontece de verdade)

O app prepara, mas a fluência vem de **usar** o japonês. Esta fase é mais um guia do que código.

- [ ] **Guia de imersão por nível:** que tipo de áudio, vídeo e leitura consumir a cada nível, e como usar legendas em japonês. *(P)*
- [ ] **Hábito de conversa:** como encontrar tutor ou parceiro de intercâmbio, e um roteiro de apresentação e perguntas para a primeira conversa. *(P)*
- [ ] **Diário em japonês:** uma frase por dia, guardada no app e revisada depois. *(M)*
- [ ] **Exportar cartões** (por exemplo, para Anki) para quem quiser continuar em outra ferramenta. *(M)*
- [ ] **Conversa com o Mochi (experimental):** treino de conversa com um modelo de linguagem. Exige internet, tem custo e pode errar o japonês, então só entra como opcional, com aviso claro e revisão do conteúdo. *(G)*

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
