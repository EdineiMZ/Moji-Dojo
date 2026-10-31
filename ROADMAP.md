# Moji Dojo: roadmap

Versão atual: **2.18.0** (2026-10-30). Este documento diz **onde o app está**, **o que falta validar** e **o que vem depois, por prioridade**. O histórico por versão está no [`CHANGELOG.md`](CHANGELOG.md).

Legenda: ✅ feito · 🟡 em parte · ⬜ pendente. Esforço: **P** = dias, **M** = 1 a 2 semanas, **G** = várias semanas.

## 1. Onde estamos

O Moji Dojo ensina a escrita e leva o aluno até a produção de frases, a escuta, a leitura e a digitação, tudo com revisão espaçada e funcionando sem internet. A IA e as vozes de anime são opcionais.

| Área | Estado | Hoje |
| --- | --- | --- |
| Escrita (kana e kanji) | ✅ | Hiragana, katakana e 477 kanji (N5, N4 e parte do N3), traços animados, desenho conferido por geometria |
| Revisão espaçada | ✅ | FSRS 5 com retenção desejada ajustável (80 a 95%), caixas como estágio, itens teimosos, revisão mista; falta calibrar os pesos com o seu histórico |
| Vocabulário | ✅ | Cerca de 800 palavras do N5, com tom, classe, frases de exemplo, cartões e exportação para o Anki; N4 só nos kanji |
| Gramática | 🟡 | 51 tópicos do N5 e 23 do N4, mini-testes, lacunas, conjugação, contadores; faltam os pontos restantes do N4, sobretudo os de registro formal e honorífico (veja "Fechar o N4"). |
| Produção de frases | ✅ | Montar, traduzir, modelos, 13 diálogos, 188 frases de viagem, 30 mil frases para explorar |
| Escuta e fala | ✅ | Ditado, compreensão, tom, shadowing com gravação, reconhecimento de fala |
| Leitura | ✅ | Textos graduados e do dia a dia (N5 e N4), toque na palavra, câmera que lê texto |
| Teclado de flick | ✅ | Simulador com níveis, séries de pontuação e números, conversão, mapa de calor, revisão espaçada por tecla e meta diária |
| Motivação | ✅ | Mochi, 178 itens (72 de 12 datas), 42 conquistas, missões, baús, metas e lembretes |
| IA opcional | ✅ | Gemini, Claude e GPT com chave própria, cache, fila offline, 13 recursos |
| Voz de anime | ✅ | 43 personagens, vozes baixadas pelo app com aceite dos termos de cada um, "Minhas vozes" para escolher e ouvir (2.8.1) |
| Dados e backup | ✅ | Backup `MDJ1:`, importação do formato antigo, exportação para o Anki |

### Princípios

1. **Recuperar da memória, não reler:** tudo o que é novo vira cartão de revisão.
2. **Significado antes de forma:** palavra nova vem com exemplo e áudio.
3. **Produzir cedo:** montar, digitar e falar desde o começo, mesmo errando.
4. **Pouco por dia, todo dia:** sessão diária de 15 a 20 minutos, com fim claro.
5. **Conteúdo confiável:** nada de japonês inventado. Vem de fonte aberta com licença conferida, ou é marcado como escrito por IA e revisado por um falante.
6. **Funciona offline e é leve:** sem conta, sem servidor, sem telemetria.

## 2. O que falta validar

O que ainda precisa ser conferido para confiar no app e no conteúdo.

| # | Pendência | Por quê | Esforço |
| --- | --- | --- | --- |
| 1 | **Revisão do japonês escrito por IA por um falante:** explicações, diálogos, textos de leitura, frases de viagem, moldes, dicas dos kanji, significados em português e as descrições das vozes | É o maior risco de ensinar algo errado. Está avisado no app e no README | G |
| 2 | **Testar no aparelho** o que só foi verificado por testes e empacotamento: síntese do VOICEVOX (ONNX), câmera, reconhecimento de fala, gravação, teclado 3 × 4 | Dependem do hardware e do Android | P |
| 3 | **Conferir o nome "Moji Dojo" no banco de marcas do INPI** (classes de software e de educação) | Não achei nenhum "Moji Dojo" na internet, mas há apps do mesmo ramo com nomes parecidos (MOJi, MOJi辞書, "Moji - Learn Japanese") | P |
| 4 | **Origem dos dados de tom (Kanjium):** o Kanjium declara CC BY-SA 4.0 e credita o autor, mas não dá para verificar de onde ele tirou os dados; aceitar esse risco (é fonte comum em apps de dicionário) ou trocar a fonte. **Checado em 2026-10-28:** contra o UniDic, o acento principal coincide em 96,9% de 912 palavras; só 4 divergem (所, 余り, 結構, 大体), a conferir num dicionário de referência. Detalhes em `src/content/LICENSE.md` | A cadeia anterior à do Kanjium não é verificável | P |
| 5 | **Acessibilidade:** passada com TalkBack e fonte grande; alternativa ao flick por deslize | O flick só funciona por gesto | M |

## 3. Próximas versões

Cada bloco abaixo conta como uma "fase" para a regra de versão do `AGENTS.md` (concluída, sobe a versão).

### 2.8.x: correções e acabamento

Feito entre a 2.8.1 e a 2.8.3, a partir da revisão das telas e das licenças. O que ainda falta é confirmar no aparelho.

- ✅ **Voz sintetizada quase inaudível (2.8.1):** o motor entregava cada personagem num volume diferente; agora o áudio é nivelado pelo pico. Falta medir no aparelho.
- ✅ **Escolher a voz (2.8.1):** "Minhas vozes", com "Usar esta voz", selo "Em uso" e amostra com retorno visível.
- ✅ **Baú do primeiro dia (2.8.3):** a primeira abertura dá boas-vindas, em vez de agradecer uma volta que não houve.
- ✅ **Créditos e licenças em tela própria (2.8.3):** os créditos de cada fonte (inclusive o aviso da EDRDG e a atribuição ao Kanjium, que faltavam), o aviso do ML Kit e o texto de licença de 336 componentes de terceiros (pacotes do app, bibliotecas Android e componentes nativos, com os avisos do ONNX Runtime). A tela Sobre ficou curta.
- ✅ **Download de voz mais robusto (2.8.3):** continua de onde parou, confere o SHA-256 oficial de cada arquivo, avisa em dados móveis, mostra o espaço usado e tem "Apagar todas as vozes".
- ✅ **Amostra com plano B (2.8.3):** se o site mudar ou cair, o botão oferece abrir a página do personagem; ao tocar, mostra o crédito "VOICEVOX:nome".
- ✅ **Testes de tela (2.8.3):** a lista de vozes (termos, aceite, continuar, dados móveis) e "Minhas vozes" (usar a voz, voltar ao Android, espaço usado).
- 🟡 **Confirmar no aparelho:** ✅ o volume da voz (2.8.1) está funcionando, confirmado pelo usuário em 2026-10-31. ⬜ Falta o download novo com a rede caindo no meio. *(P)*
- ✅ **Telemetria do ML Kit (avaliada em 2026-10-28): aceitar e manter o aviso.** Pelo que a documentação do Google diz, o ML Kit não tem opção para desligar o envio de dados técnicos (modelo do aparelho, versão do app, identificador da instalação, métricas), e o conteúdo da foto e o texto lido não estão na lista do que ele coleta. Só há gambiarras não suportadas, que podem quebrar a cada versão. O aviso agora está na própria tela da câmera. A alternativa realista é o PaddleOCR (PP-OCR) rodando em ONNX, com licença Apache 2.0, mas exige um motor próprio (detecção, reconhecimento e pós-processamento) e uma medição de acerto em fotos reais de placas e cardápios antes de trocar; fica como ideia, só se a privacidade virar prioridade. *(G)*

### 2.9: UX e design (navegação e Ajustes) ✅

Concluída na 2.9.0 e na 2.9.1. As regras ficaram em [`docs/DESIGN.md`](docs/DESIGN.md).

- ✅ **Ajustes em áreas (2.9.0):** uma linha por área, com ícone e o resumo do estado, e uma tela para cada: Perfil e metas, Lembretes, Voz japonesa, Estudo e leitura, Sons e vibração, IA, Dados e backup, Avançado.
- ✅ **Texto técnico fora da frente do usuário (2.9.0):** o nome da voz do aparelho e o diagnóstico de som foram para Avançado.
- ✅ **Opções à vista (2.9.0):** os chips dos Ajustes quebram em linhas em vez de rolar.
- ✅ **Menos parágrafo (2.9.0):** uma linha à vista e o resto em "Saiba mais".
- ✅ **Hierarquia de botões (2.9.0 e 2.9.1):** um primário por tela.
- ✅ **Sistema de design documentado (2.9.0).**
- ✅ **Aba Frases (2.9.1):** grupo e recurso, com uma linha explicando cada grupo. Um "Praticar" com atalhos fica para quando houver dados de uso.
- ✅ **Início (2.9.1):** "Estudar hoje" e "Sessão de hoje" viraram um cartão.
- ✅ **Primeira abertura (2.9.0):** cai na primeira lição.
- ✅ **Acessibilidade de toque e contraste (2.9.0 e 2.9.1).** A passada com TalkBack continua na seção 2.
- ✅ **Escolha da voz de anime (2.8.1).**

### 2.10: tamanho e desempenho

O APK tem **112,5 MB** na 2.12.0 (era 112,3 MB na 2.8.3): o N4, o FSRS e as telas novas somaram só 0,2 MB. Onde está o peso (comprimido): bibliotecas nativas 51 MB (ONNX Runtime, VOICEVOX, ML Kit), dicionário do Open JTalk 22,5 MB (98 MB sem compressão), banco de frases 8 MB, cinco arquivos de código (classes.dex) com 50 MB.

Conferido em 2026-10-28: o dicionário só é copiado para a pasta do app quando o VOICEVOX é ativado (nada a fazer nesse ponto), e o APK não cresce com o conteúdo novo. Falta tudo o que depende de aparelho ou de uma entrega nativa nova:

- ⬜ **Dicionário do Open JTalk como download opcional**, junto da primeira voz: tira cerca de 22 MB do APK. Hoje ele também é copiado para a pasta do app na primeira vez (98 MB sem compressão); só copiar quando o VOICEVOX for ativado. *(M)*
- ⬜ **Medir** a abertura a frio e a memória em aparelho de entrada, e carregar sob demanda os conteúdos grandes. *(M)*
- ✅ **32 bits:** hoje o APK é só `arm64-v8a`. Avaliar um APK `armeabi-v7a` separado para aparelhos antigos. *(P)* *(2.20.0: `set ARCHS=armeabi-v7a` antes do `gerar-apk.bat` gera `MojiDojo-<versão>-32bits.apk`; falta testar num aparelho de 32 bits.)*
- ✅ **Analisar o pacote:** a fonte do `expo-symbols` (cerca de 1 MB) vem de dentro do `expo-router` e não é usada. *(P)* *(2.20.0: o `metro.config.js` troca o `expo-symbols` por um módulo vazio; o export do Android passou a sair sem a fonte de 971 KB.)*

### 2.13: áudio e tema

- ✅ **Áudio sem repetição (2.13.0):** gravações em `mixWithOthers` (sem foco de áudio, que as retomava sozinhas) e fala do Android sempre cancelada antes da próxima. As 360 gravações foram conferidas (existem, têm volume, nenhuma duplicada).
- ✅ **Tema claro, escuro ou automático (2.13.0):** em Ajustes → Aparência.
- ⬜ **Confirmar no aparelho** que sumiram o som repetido e as palavras mudas; quais palavras ainda ficarem mudas aparecem em Ajustes → Avançado. *(P)*

### 2.16: ideias entregues

- ✅ **Tabela de caracteres, treino livre e pares parecidos:** em Ouvir → Tabela. A tabela do hiragana e do katakana (com e sem ten-ten e maru) toca o som e mostra o exemplo e a dica; o treino livre pergunta o som de cada letra sem mexer nas revisões; "Parecidos" traz 13 grupos de letras que se confundem (ぬ e め, ね, れ e わ, シ e ツ, ソ e ン...) com o detalhe que as separa, e leva ao treino só daquelas letras.
- ✅ **Dicas de memória dos kana com ten-ten e maru:** as 50 letras (25 de hiragana e 25 de katakana) ganharam dica, com o kana base, a troca de som e as exceções (じ e ぢ, ず e づ).
- ✅ **Missões mais variadas:** (1) o sorteio dá preferência às missões das habilidades fracas (menos de 80% de acerto, com ao menos 10 respostas); (2) duas missões de horário, "de manhã" e "à noite", que só entram quando ainda dá tempo; (3) duas missões em cadeia, em que cada passo só conta depois do anterior. As três missões do dia ficam fixadas na primeira vez que o app abre no dia.
- ✅ **Widget "Revisão do dia" (2.16):** módulo nativo Android (`modules/homewidget`). Mostra as revisões vencidas e os dias seguidos; o app envia o que vence nas próximas 36 horas, então o número continua certo mesmo com o app fechado. Tocar abre o app; o botão em Ajustes → Lembretes pede ao Android para adicioná-lo. **Verificado no emulador** (x86_64): o receiver registra, o Android mostra a confirmação, o widget aparece com os dados do app, no tema escuro, e o toque abre o app. Não testado em aparelho real nem com revisões vencidas no emulador.
- ✅ **Exportar e importar só as configurações:** em Ajustes → Dados e backup, um código "MDJC1:" com tema, voz, leitura, lembretes, metas e IA. Ficam de fora a chave da IA, o uso do dia, o seu nome e a voz do Android escolhida.
- ✅ **Temas de cor:** Sakura, Matcha, Oceano e Lavanda, cada um claro e escuro, em Ajustes → Aparência. O contraste de todas as paletas é conferido por teste (WCAG AA).

### 2.19: auditoria de layout e design (emulador, 2026-10-30; entregue na 2.19.0, faltam a sequência e o Início)

Passada de design no emulador (Pixel de 1080 × 2400, Android 16, tema escuro, fonte normal e 1,5×) sobre o APK 2.18.0: Início, Trilha (kana e kanji), uma lição de kanji, Ouvir, Frases, Teclado e Meu Mochi. **Não foram vistos:** tema claro e os outros temas de cor, telas de desenho e de teste, ditado, simulado, loja, câmera, IA e as telas dentro de Ajustes. O número entre parênteses é a prioridade (1 = mais urgente).

**Correções (o que está quebrado ou confuso):**

- ✅ **(1) Chip selecionado escondido sob o degradê de rolagem:** em Meu Mochi o chip ativo "Metas" fica cortado pelo degradê e pela seta `›`; o mesmo acontece com os chips de "Meta do dia" (`20 re›`). O aluno não vê qual aba está aberta. Ao selecionar, rolar a linha até o chip ficar inteiro à vista, ou quebrar em linhas (como já se faz nos Ajustes). *(P)*
- ✅ **(1) Linhas de chips cortadas em Frases e Teclado:** "Frases" (fonte 1,5×), "Katakana", "Apresentação e bá›", "Mais usadas primeiro›", "Velocid›" aparecem pela metade, e a seta cobre o texto. Mesma regra: quebrar em linhas ou ajustar a rolagem para mostrar o chip ativo. *(P)*
- ✅ **(1) Tecla central do guia do flick estoura com fonte grande:** "toque · a" quebra e sai da tecla de tamanho fixo (fonte 1,5×). Teclas e rótulos do guia precisam crescer com o texto ou limitar a escala. *(P)*
- ✅ **(1) Baú do dia reaparece a cada abertura do app:** depois de "Depois", fechar e abrir o app mostrou o mesmo baú outra vez. "Depois" deve adiar até o dia seguinte ou ao menos até a próxima hora. Conferir também se a primeira abertura do dia some depois de aberto. *(P)*
- ✅ **(2) Sequência contraditória no Início:** o cartão mostra "1 dia seguido", "Sua sequência de 3 dias está em risco" e "Semana: 4 de 4 dias" ao mesmo tempo. Escolher uma definição, usar o mesmo número nos três lugares e explicar o resto em "Saiba mais". *(P)* *(2.20.0: o cartão de resgate diz que a sequência foi interrompida e que a contagem recomeça do 1; a semana vira "Esta semana (seg. a dom.)".)*
- ✅ **(2) "Revisar o que venceu: feito" numa conta sem nada vencido:** o passo vem marcado como feito antes de o aluno fazer qualquer coisa, e isso confunde o primeiro dia. Mostrar "Nada para revisar hoje" em cinza, sem o selo verde. *(P)*
- ✅ **(2) Telas sem margem para a barra de gestos:** em Meu Mochi o texto de "Missões de hoje" rola por baixo do indicador de gestos do Android. Telas sem a barra de abas precisam do espaço inferior seguro (`safe area`). *(P)* *(Conferido no código na 2.20.0: o `Screen` já soma o espaço inferior seguro; falta só rever no aparelho.)*
- ✅ **(2) Seletor "Velocidade normal / Devagar" no topo de Ouvir e de Frases:** ocupa a primeira linha da tela, quebra em duas linhas com fonte grande e, em Frases, serve só para os áudios. Mover para dentro dos cartões que tocam áudio, ou para uma única opção em Ajustes → Voz. *(P)*
- ✅ **(3) Barra de abas apertada com fonte grande:** "Teclado" encosta na borda direita a 1,5×. Limitar a escala do rótulo ou abreviar. *(P)*

**Melhorias (funciona, mas dá para ficar mais claro):**

- ✅ **Frases gasta quase metade da tela só em navegação:** velocidade, 3 grupos, uma linha de explicação, 5 recursos, e só depois os filtros de assunto, situação e ordem. O conteúdo começa em 44% da altura. Juntar grupo e recurso numa única linha de abas e mover os filtros para uma folha "Filtrar". *(M)*
- ✅ **Início longo e com vários botões primários:** "Salvar a sequência", "Ativar lembretes" e "Abrir o baú do dia" são todos rosa cheios na mesma rolagem, contra a regra de um primário por tela do `docs/DESIGN.md`. Só um destaque por vez; lembretes e baú viram cartões secundários. Considerar uma ordem fixa: estudar → sequência → metas. *(M)* *(2.19.0 e 2.20.0: lembretes e baús viraram botões secundários; a ordem fixa do Início ficou para depois.)*
- ✅ **Estados vazios que ocupam espaço:** "Sua evolução" mostra dois parágrafos de explicação quando ainda não há dado. Trocar por uma linha ou esconder até haver o primeiro dia. *(P)*
- ✅ **Trilha repete "Bloqueada: conclua a anterior" e "Já sei: fazer o teste" em cada lição:** vira ruído e o link sublinhado tem área de toque pequena. Mostrar o cadeado sozinho e colocar o teste de nivelamento num único botão no topo da trilha. *(P)*
- ✅ **Trilha de kanji sem separação por nível:** 90 lições numa lista só, e os 193 kanji do N3 ainda não aparecem. Agrupar por N5, N4 e N3, com a barra de progresso de cada nível. *(M)*
- ✅ **Emoji misturado com ícones de traço:** 🔒, 🎁, 📷 e 🔊 convivem com os ícones de linha da barra de abas e dos Ajustes, e o emoji muda de aparência a cada versão do Android. Trocar por um conjunto único de ícones (por exemplo `@expo/vector-icons`) e manter emoji só no Mochi. *(M)*
- ✅ **Contraste:** o botão "Deixar recomeçar" e a engrenagem do cabeçalho (azul-petróleo sobre azul-marinho) ficam fracos no escuro. Conferir pelo contraste WCAG já testado nas paletas. *(P)*
- ✅ **Cabeçalho do Início com vazio no meio:** título à esquerda, Mochi à direita e um espaço grande entre eles. Aproveitar o espaço (saudação ou a meta do dia) ou aproximar o Mochi do título. *(P)*
- ✅ **Rolagem horizontal escondida:** os chips de rolagem não avisam que há mais itens além de uma seta pequena. Usar o degradê só nas bordas e mostrar sempre o chip ativo (ver acima). *(P)*

**Adições futuras (ideias vindas da passada, sem prioridade):**

- ✅ **Teste automatizado de layout com fonte 1,5× e 2×** nas telas principais (capturas comparadas ou testes de tela com `fontScale`), para pegar quebras como as de cima antes de virar APK. *(M)* *(2.20.0: teste de Jest que garante teto de escala nos textos de chips, guia do flick e esqueleto a 1,5× e 2×; ele não mede quebra de linha de verdade, que só aparece em captura (veja `npm run screenshots --font 1.5`).)*
- ⬜ **Modo paisagem e tablet:** as telas só foram vistas em retrato; a lista de Frases e o simulador pedem duas colunas em tela larga. *(M)*
- ✅ **Esqueleto de carregamento** em Frases e Vocabulário (listas grandes), no lugar de tela em branco por um instante. *(P)* *(2.20.0: componentes `Skeleton` e `Deferred`, usados em Palavras, Katakana, Banco e Explorar.)*
- ✅ **Ajuste de "Reduzir movimento" no sistema** respeitado também no Mochi e nas animações dos traços (hoje o Mochi só lê o ajuste do app). *(P)* *(Conferido na 2.20.0: o Mochi, os traços e as demais animações já leem o ajuste do sistema pelo Reanimated.)*
- ⬜ **Passada do tema claro e dos 4 temas de cor** com as mesmas capturas, e o resultado guardado em `docs/screenshots`. *(P)*
- ✅ **Script de capturas para o emulador:** as capturas desta passada foram à mão com `adb`; vale transformar em `scripts/screenshots` (ver "Capturas de tela automatizadas" em Engenharia). *(P)* *(2.20.0: `npm run screenshots` (`scripts/screenshots`), com `--font` e `--serial`; ainda não testado num aparelho.)*
- ✅ **APK para o emulador:** o `gerar-apk.bat` gera só `arm64-v8a`, que não abre no emulador x86_64 (o app fecha com `couldn't find DSO to load: libreactnative.so`). Para testar no emulador é preciso `gradlew assembleRelease -PreactNativeArchitectures=x86_64`; criar um `gerar-apk-emulador.bat` com isso, que não copia o resultado para `versoes`. *(P)* *(2.20.0: `gerar-apk-emulador.bat` (x86_64, sem copiar para `versoes`).)*

### 2.22: cosméticos de datas e a Casa do Mochi (2026-10-31)

- ✅ **Cosméticos de datas comemorativas (2.22.0):** 12 datas com seis itens cada, um por espaço (cabeça, rosto, pescoço, fundo, cor e pele), 72 itens no total: Natal (15/12 a 26/12), Ano-Novo (28/12 a 7/1), Setsubun (25/1 a 5/2), Dia dos Namorados (7/2 a 14/2), Hinamatsuri (20/2 a 3/3), Hanami (10/3 a 20/4), Kodomo no Hi e Koinobori (25/4 a 5/5), Festa Junina (1/6 a 30/6), Tanabata (25/6 a 15/7), Natsu-matsuri e Obon (15/7 a 20/8), Tsukimi (10/9 a 5/10) e Halloween (10/10 a 2/11). Só se compram dentro da janela; quem já tem o item o mantém. Na loja há a categoria "Datas", com o que está à venda hoje primeiro. Os desenhos foram conferidos numa pré-visualização no navegador, **não no aparelho**: falta ver o acabamento no celular. *(M)*
- ⬜ **Datas móveis:** o Carnaval, a Páscoa e o Dia das Crianças brasileiro (12/10) não entraram; as datas móveis pedem um cálculo por ano. *(P)*
- 🟡 **Casa do Mochi (fase 1 feita na 2.23.0: Quarto, Jardim e Escritório com 5 móveis cada; faltam as fases 2 e 3) (ideia, análise em 2026-10-31):** cômodos internos (Quarto, Sala, Cozinha, Ofurô, Escritório) e externos (Jardim, Engawa, Lago de carpas) que se compram, e depois móveis, skins de móveis e cenários. Ordem sugerida: (1) casa mínima com 3 cômodos (Quarto, Jardim e Escritório) e móveis sem skins; (2) mais cômodos e skins; (3) clima e decoração por data. Riscos: a economia (hoje os itens custam de 150 a 900 pétalas; cômodos custariam milhares), o desempenho de várias cenas em SVG em aparelhos fracos e a compatibilidade do backup. Ligar o desbloqueio de cômodos às metas de estudo (o Escritório pelo N5 completo, por exemplo). *(G)*

### 3.0: conteúdo do N4

A maior entrega de aprendizado que falta. Exige conferência de fonte e de licença, e revisão por falante.

- 🟡 **Gramática N4 (2.12.0, 2.14.0, 2.21.0 e 2.24.0):** 27 tópicos, todos com frases do Tatoeba conferidas na fonte (`npm run verify-grammar -- n4`): かもしれません, ことにした, てしまう, ておく, はずだ, passiva, ば (2.12.0), causativa, たら, と, ように なる, ために, のに e ても (2.14.0) e, na 2.21.0, ながら, すぎる, そう (aparência e "ouvi dizer"), ようだ e みたい, あげる/くれる/もらう, てみる, ないで e と思う e, na 2.24.0, のが/のは, という, させられる e o honorífico e humilde. Os pontos principais do N4 estão cobertos; novos tópicos só se aparecerem lacunas. Explicações escritas por IA, a revisar por um falante. *(G)*
- 🟡 **Vocabulário N4 (2.11.0 e 2.15.0):** 629 palavras com leitura, significado, tom (504) e classe (621). A frequência de uso (2.15.0) cobre 618 delas, e 533 têm ao menos uma frase no banco local de frases do Tatoeba. Faltam os áudios de falantes nativos (nenhuma das 360 gravações é do N4) e a revisão dos significados por um falante. *(M)*
- ✅ **Leitura N4 (2.14.0):** 8 textos corridos e 3 leituras do dia a dia (atraso de trem, hotel, elevador e terremoto), com a gramática do N4 e seletor N5/N4. Escritos por IA, a revisar por um falante; as frases com palavras fora do vocabulário trazem a leitura e o significado de cada pedaço. *(M)*
- 🟡 **Kanji N3 (2.18.0):** 193 kanji no mesmo formato do N4 (ordem dos traços, leituras on e kun, significado, dica de memória, palavra de exemplo e lições). São os mais frequentes em jornais dentre os do nível 2 da lista antiga do JLPT (KANJIDIC2), que reúne N3 e N2, **não o N3 inteiro**: o JLPT não publica lista oficial e o N3 moderno tem cerca de 370 kanji. Significados, categorias e dicas escritos por IA, a revisar por um falante; as palavras de exemplo e as leituras vêm do JMdict. **Falta:** vocabulário, gramática e simulado do N3, e o caminho de metas do N3 (por isso os kanji N3 ficam fora das metas e das provas do N5 e do N4). *(G)*
- ⬜ **Fechar o N4 (2026-10-30, plano):** o vocabulário (629), os kanji e a leitura do N4 estão feitos; o que falta é a **gramática** (27 tópicos feitos, com os pontos principais do N4) e a **revisão dos significados por um falante**. Fontes e regra: japonês só de fonte aberta com licença conferida (Tatoeba, CC BY 2.0 FR, como nos 14 tópicos atuais) e explicação em português escrita aqui e marcada como "escrita por IA, a revisar". *(G)*
- 🟡 **Vocabulário N3 (2.25.0):** 2.072 palavras novas (fora as que já estão no N5 e no N4) em 13 grupos "N3: ...", com leitura, significado em português e classe (JMdict). **O recorte é a lista inteira**, que mistura as marcas `JLPT_2` e `JLPT_3` da lista antiga: traz o N3 e parte do N2, não o N3 oficial. Traduções escritas por IA, a revisar por um falante. Na 2.26.0 ganharam tom (Kanjium), frequência e frases do Tatoeba (819 das 2.072 têm frase), além do caminho de metas e do simulado do N3 (sem gramática, que não existe ainda). Plano original: **(2026-10-30)** a lista de partida já está baixada em `scripts/vocab-n3/n3.csv` (2.140 linhas, do mesmo repositório *open-anki-jlpt-decks*, licença MIT, com dados das listas de Jonathan Waller, CC BY; a cadeia de licenças é a do N5 e do N4, descrita em `src/content/LICENSE.md`). Falta repetir o método do N4: limpar e remover duplicados com `scripts/n5Clean.cjs` (no N4, 668 linhas viraram 629 palavras), traduzir para o português em `pt-*.txt`, gerar `src/content/n3.ts` com um `build-n3.mjs`, e acrescentar tom (Kanjium), classe, frequência e frases do Tatoeba. Atenção: a lista mistura as marcas `JLPT_2` e `JLPT_3` da lista antiga, então o recorte "só N3" precisa de uma decisão (ver o aviso nos kanji N3 acima). *(G)*
- 🟡 **Gramática N3 (2.27.0):** 15 tópicos (らしい, について, として, に対して, によって, ほど, わけ, はずがない, ところ, うちに, おかげ e せい, まま, さえ, っぽい, ことになる) com 55 frases do Tatoeba conferidas na fonte, tabela, exercícios de Montar e Lacunas e notas de erros comuns. Só os nomes dos padrões vêm do Wikibooks (CC BY-SA); o texto é próprio. **Faltam** os demais pontos do N3 (をはじめ, ばかり, がち, ついでに, くせに, たとたん...), para os quais o Tatoeba tem poucas frases em português. Plano anterior **(2026-10-30):** não achei lista aberta e completa. O que foi conferido: o OpenJLPT (`evanclan/OpenJLPT`, CC BY-SA 4.0 segundo o PyPI) tem só cerca de 20 pontos por nível; o JLPT Sensei e o Bunpro são comerciais e **não podem ser copiados**; o Guia JLPT do Wikibooks lista os pontos do N3 a partir de Jonathan Waller, mas a licença **não foi conferida** (Wikibooks costuma ser CC BY-SA). Caminho: usar só a **lista de nomes dos pontos** (fatos, não texto de ninguém), escrever a explicação em português e buscar as frases no Tatoeba, como no N5 e no N4. Antes de começar, confirmar a licença do Wikibooks. *(G)*
- 🟡 **Caminho de metas e simulado do N3 (2.26.0):** metas de palavras e de kanji do N3, e simulado do N3 com vocabulário, leitura e kanji. Faltam as metas de gramática e de leitura, que dependem de conteúdo que ainda não existe. *(M)*
- ✅ **Simulado offline (2.15.0):** em Frases → Gramática → Simulado. Provas de N5 e N4 com vocabulário, leitura, kanji e gramática, montadas só com o conteúdo do app (sem IA, sem internet), 5, 8 ou 10 perguntas por seção e nota por seção. Falta um simulado de compreensão de texto e o tempo de prova. *(M)*

### Motor de aprendizado

- ✅ **FSRS no lugar das caixas (2.11.0):** FSRS 5 com os pesos padrão, mantendo a caixa como estágio e a importação do progresso antigo. ✅ A retenção desejada (80, 85, 90 ou 95%) é escolhida em Ajustes → Revisões (2.14.0). ⬜ Falta calibrar os pesos com o histórico de quem usa (exige guardar cada revisão). *(M)*
- ✅ **Contagem própria para a escrita (desenho) (2.9.2):** linha à parte em "Por habilidade"; começa a contar nesta versão.
- 🟡 **Metas por nível (2.12.0 e 2.15.0):** o N5 e o N4 têm as metas de palavras, de gramática, de kanji e, desde a 2.15.0, de textos de leitura lidos (botão "Marcar como lido" em cada texto). Falta o caminho do N3, que depende do conteúdo do N3. *(M)*

### Vozes (VOICEVOX)

- ✅ **Voz por papel nos diálogos (2.10.0):** o atendente numa voz e você em outra.
- ✅ **Lista de vozes mais fácil de usar (2.10.0):** busca por nome ou descrição e favoritos, em Minhas vozes e na lista para baixar. O filtro é por Todas e Favoritas; as descrições não têm tipo (voz feminina, aguda...) para filtrar.
- ✅ **Ajustes de fala (2.10.0):** altura e entonação, além da velocidade.
- ✅ **Comparar as vozes (2.10.0):** a mesma frase com cada voz baixada, em sequência.

### IA opcional

- 🟡 **Modelos locais (2.15.0):** o provedor "Servidor próprio" aceita o endereço de qualquer servidor compatível com a OpenAI (Ollama, LM Studio, llama.cpp, vLLM), com chave opcional. **Só https**: o app não aceita http porque isso exigiria liberar tráfego sem criptografia no app inteiro (ver abaixo). ⬜ Para servidores em rede local por http, falta decidir liberar o tráfego sem criptografia (`usesCleartextTraffic`); hoje a saída é um túnel ou proxy com https. *(P)*
- ✅ **Receber texto pelo "compartilhar" do Android (2.17.0):** o Moji Dojo aparece em Compartilhar para texto; o app abre em Frases → IA → Explicar com o campo preenchido e **nada é enviado à IA** sem você tocar em "Explicar". O texto de fora é limpo (caracteres de controle e de direção) e limitado ao tamanho da tela. Sem a IA configurada, o cartão mostra o texto recebido e o guarda. Verificado no emulador com o app fechado e com ele aberto; o preenchimento do campo com a IA pronta é coberto por teste de tela, não foi visto no emulador (sem chave de IA lá). *(M)*
- ✅ **Conversa com a voz como entrada (2.15.0):** o botão "Falar em japonês" transforma a fala em texto no campo da conversa, para conferir e corrigir antes de enviar. Usa o serviço de fala do Android, com o aviso de que ele pode enviar o áudio ao Google. *(M)*
- ✅ **Simulado com tempo de prova (2.17.0):** no simulado offline e no da IA, a opção "Tempo de prova (45 s por pergunta)" mostra um cronômetro regressivo da prova toda; ao acabar o tempo, a prova encerra e o que ficou sem resposta conta como errado. ✅ **Missões em cadeia e adaptadas aos pontos fracos:** feitas na 2.16 (ver acima). ✅ **Cenas escolhidas pelo aluno:** a conversa por cenas já tinha "Ou invente a sua cena" (você descreve a situação e a IA monta o personagem). *(M)*
- 🟡 **Testar com uma chave real da OpenAI:** não há chave aqui, então a chamada completa continua sem teste. O que foi conferido em 2026-10-28: o endereço `api.openai.com/v1/chat/completions` responde e uma chave **falsa** devolve HTTP 401 com `error.message`, que o app lê e converte em "chave recusada" (teste com a resposta real). **Não confirmado:** que o corpo da chamada (`max_completion_tokens`, `response_format`, o modelo `gpt-4.1-mini`) é aceito, porque a API checa a chave antes. *(P)*

### Teclado

- ✅ **Revisão espaçada por tecla (2.14.0):** cada letra ganha um agendamento FSRS (errou: volta em 10 minutos; acertou: o intervalo cresce), e o modo "Pontos fracos" começa pelas letras vencidas. O desempenho mostra o que vence agora e quando volta a próxima. ⬜ Falta agendar por direção (ler, digitar e converter separadamente). *(M)*
- ✅ **Séries dirigidas e meta diária (2.15.0):** as séries "Pontuação" (frases com o sinal do fim, 。 ？ ！, pela tradução) e "Números" (contar em kana) no simulador, e a meta diária de letras certas (50, 100 ou 200) no Desempenho. O teclado de flick do app não tem camada de dígitos, então os números são treinados em kana. *(P)*

### Engenharia

- ✅ **Integração contínua:** `.github/workflows/ci.yml` roda `tsc`, lint, Jest e `expo-doctor` a cada push e pull request (conferido numa cópia limpa do repositório).
- ⬜ **Testes de ponta a ponta** (por exemplo com Maestro) dos fluxos críticos: primeira abertura, uma lição, uma revisão, a compra na loja. *(M)*
- 🟡 **Dependências em dia:** o Dependabot está configurado (`.github/dependabot.yml`, o Expo em grupo e o SDK só à mão). Falta subir para o Expo SDK 58 quando ele virar `latest` (hoje é `next`; o projeto está no 57.0.31, e o React Native mais novo é o 0.88). *(M)*
- ✅ **Capturas de tela automatizadas** para o README a cada versão. *(P)* *(2.20.0: o script existe; falta rodá-lo a cada versão e gerar as imagens do README com ele.)*

### Fora do app (a fluência acontece lá)

- ✅ **Guia de imersão por nível:** que áudio, vídeo e leitura consumir em cada etapa e como usar legendas em japonês. *(P)* *(2.20.0: Frases → Fora do app, com N5, N4 e N3 (áudio, vídeo, leitura e legendas). Escrito por IA, a revisar por um falante.)*
- ✅ **Hábito de conversa:** como achar tutor ou parceiro de intercâmbio e um roteiro para a primeira conversa. *(P)* *(2.20.0: Frases → Fora do app, com formas de achar tutor ou parceiro e o roteiro da primeira conversa. Escrito por IA, a revisar por um falante.)*

## 4. Ideias em aberto

Sem prioridade nem decisão; entram nas versões acima quando fizerem sentido.

- ✅ Moldes de frase com a fala do atendente para escolher, e mais moldes (2.18.0): modo "Atendente" em Frases → Moldes, e 5 moldes novos (29 no total, 14 com fala do atendente).
- ✅ Mais exemplos de leitura do dia a dia (2.18.0): ofertas e promoções, no caixa, mesas e reservas, placas de serviços (27 placas e avisos novos).

As outras ideias desta lista (tabela de caracteres, treino livre e pares parecidos; dicas dos kana com ten-ten; missões em cadeia, por horário e pelas áreas fracas; widget da revisão do dia; exportar só as configurações; temas de cor) foram feitas na 2.16, abaixo.

## 5. Fora do escopo por enquanto

- Contas, nuvem, sincronização entre aparelhos e rankings (o app é offline; o backup cobre a troca de celular).
- iPhone.
- Conteúdo acima do N3.

## 6. Como saber se está funcionando

- **Retenção real:** dos itens revisados depois de 30 dias, quantos o aluno ainda acerta (meta inicial: acima de 80%).
- **Constância:** dias estudados por semana e sessões diárias concluídas.
- **Cobertura:** vocabulário e gramática dominados em relação ao nível-alvo.
- **Uso ativo:** frases produzidas por semana (montadas, digitadas e faladas), não só reconhecidas.
- **Teste externo:** simulados do JLPT e conversas reais dizem mais do que qualquer métrica interna.
