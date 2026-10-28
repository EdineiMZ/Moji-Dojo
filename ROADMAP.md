# Moji Dojo: roadmap

Versão atual: **2.8.3** (2026-10-27). Este documento diz **onde o app está**, **o que falta validar** e **o que vem depois, por prioridade**. O histórico por versão está no [`CHANGELOG.md`](CHANGELOG.md).

Legenda: ✅ feito · 🟡 em parte · ⬜ pendente. Esforço: **P** = dias, **M** = 1 a 2 semanas, **G** = várias semanas.

## 1. Onde estamos

O Moji Dojo ensina a escrita e leva o aluno até a produção de frases, a escuta, a leitura e a digitação, tudo com revisão espaçada e funcionando sem internet. A IA e as vozes de anime são opcionais.

| Área | Estado | Hoje |
| --- | --- | --- |
| Escrita (kana e kanji) | ✅ | Hiragana, katakana e 284 kanji (N5 e N4), traços animados, desenho conferido por geometria |
| Revisão espaçada | 🟡 | Caixas com ajuste por esquecimento, itens teimosos, revisão mista; falta o modelo completo (FSRS) |
| Vocabulário | ✅ | Cerca de 800 palavras do N5, com tom, classe, frases de exemplo, cartões e exportação para o Anki; N4 só nos kanji |
| Gramática | 🟡 | 51 tópicos do N5, mini-testes, lacunas, conjugação, contadores; falta o N4 |
| Produção de frases | ✅ | Montar, traduzir, modelos, 13 diálogos, 188 frases de viagem, 30 mil frases para explorar |
| Escuta e fala | ✅ | Ditado, compreensão, tom, shadowing com gravação, reconhecimento de fala |
| Leitura | 🟡 | Textos graduados e do dia a dia do N5, toque na palavra, câmera que lê texto; falta o N4 |
| Teclado de flick | 🟡 | Simulador com níveis, conversão, mapa de calor; falta agendar a revisão por tecla |
| Motivação | ✅ | Mochi, 111 itens, 42 conquistas, missões, baús, metas e lembretes |
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
| 4 | **Origem dos dados de tom (Kanjium):** o Kanjium declara CC BY-SA 4.0 e credita o autor, mas não dá para verificar de onde ele tirou os dados; aceitar esse risco (é fonte comum em apps de dicionário) ou trocar a fonte | A cadeia anterior à do Kanjium não é verificável | P |
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
- ⬜ **Confirmar no aparelho:** o volume da voz (2.8.1) e o download novo com a rede caindo no meio. *(P)*
- ⬜ **Telemetria do ML Kit:** a câmera que lê texto usa o ML Kit, que envia dados técnicos ao Google (está avisado). Avaliar um reconhecimento de texto que não envie nada, ou aceitar e manter o aviso. *(M)*

### 2.9: UX e design (navegação e Ajustes)

O app cresceu por camadas e a interface não acompanhou. A queixa é geral, e é mais forte nos **Ajustes**. Vale começar por uma auditoria de UX e de design (com o app aberto no aparelho, tela por tela) e só depois redesenhar. O que já se vê nas telas:

- ✅ **Ajustes como uma lista de áreas, não uma rolagem longa (2.9.0).** Hoje são cartões soltos (Você, Lembretes, Meu Mochi) misturados com seções que abrem (Estudo e exibição, IA, Sons, Seus dados) e um bloco de créditos enorme no fim. Proposta: uma tela inicial com uma linha por área, cada uma com ícone, título e um resumo do estado ("Lembretes: leves, 20:00"), e uma subtela para cada: Perfil e metas, Lembretes, Voz e áudio, Estudo, IA, Dados e backup, Créditos. *(G)*
- ✅ **Texto técnico na frente do usuário (2.9.0):** "Pronta: ja-jp-x-jab-network", "Diagnóstico de som… me mande uma captura desta lista". É informação de desenvolvedor: levar para uma área "Avançado" e trocar por frases humanas. *(P)*
- ✅ **Opções escondidas em carrosséis de chips (2.9.0, nos Ajustes):** (meta por dia, dia de folga, abas): o "›" no canto esconde escolhas. Preferir seletores que mostrem tudo (grade, lista ou um seletor próprio). *(M)*
- ✅ **Parágrafos explicativos longos dentro dos cartões (2.9.0, voz, revisões e Início):** (voz, revisões, leitura): mostrar uma linha e deixar o resto num "Saiba mais". *(M)*
- ✅ **Hierarquia de botões (2.9.0 e 2.9.1, regra no docs/DESIGN.md):** há telas com dois botões primários (rosa) lado a lado. Definir um primário por tela e usar suave e discreto para o resto. *(P)*
- ✅ **Sistema de design documentado (2.9.0, docs/DESIGN.md):** escala de espaçamento e de tipografia, estados (carregando, vazio, erro, sucesso) e padrões de cartão e de formulário, para as telas novas nascerem consistentes. *(M)*
- ✅ **Aba Frases (2.9.1):** dois níveis (grupo e recurso), com uma linha explicando cada grupo e todas as opções à vista. Um "Praticar" com atalhos fica para quando houver dados de uso. (Frases → Frases → Modelos, Traduzir, Montar, Banco, Diálogos, Viagem, Explorar, Minhas frases, ✨IA → Conversa, Explicar, Diário…). Repensar: um "Praticar" com atalhos, busca por recurso, ou agrupar o que é avançado. Medir o uso antes de decidir. *(G)*
- ✅ **Início (2.9.1, os dois cartões viraram um):** "Estudar hoje" e "Sessão de hoje" mostram a mesma revisão em dois cartões. Avaliar juntar os dois. *(M)*
- ✅ **Primeira abertura (2.9.0):** um primeiro passo guiado (a primeira lição) logo depois da introdução, em vez de cair numa tela cheia de opções. *(M)*
- ✅ **Acessibilidade (2.9.0 e 2.9.1: alvos de toque revisados; o contraste do tema já é testado):** o item 4 da seção 2, mais contraste e alvos de toque revisados nas telas novas. *(M)*
- ✅ **Escolha da voz de anime (2.8.1):** "Minhas vozes" com "Usar esta voz", selo "Em uso" e amostra com retorno visível. Serve de modelo para os outros ajustes.

### 2.10: tamanho e desempenho

O APK tem 112 MB. Onde está o peso (comprimido): bibliotecas nativas 51 MB (ONNX Runtime, VOICEVOX, ML Kit), dicionário do Open JTalk 22,5 MB, banco de frases 8 MB.

- ⬜ **Dicionário do Open JTalk como download opcional**, junto da primeira voz: tira cerca de 22 MB do APK. Hoje ele também é copiado para a pasta do app na primeira vez (98 MB sem compressão); só copiar quando o VOICEVOX for ativado. *(M)*
- ⬜ **Medir** a abertura a frio e a memória em aparelho de entrada, e carregar sob demanda os conteúdos grandes. *(M)*
- ⬜ **32 bits:** hoje o APK é só `arm64-v8a`. Avaliar um APK `armeabi-v7a` separado para aparelhos antigos. *(P)*
- ⬜ **Analisar o pacote:** a fonte do `expo-symbols` (cerca de 1 MB) vem de dentro do `expo-router` e não é usada. *(P)*

### 3.0: conteúdo do N4

A maior entrega de aprendizado que falta. Exige conferência de fonte e de licença, e revisão por falante.

- ⬜ **Gramática N4:** condicionais, passiva, causativa, os contrastes (けど, が) e o tempo (とき). Falta fonte de frases curtas boas no Tatoeba para alguns pontos. *(G)*
- ⬜ **Vocabulário N4** (cerca de 600 palavras), com tom, classe e frases. *(G)*
- ⬜ **Leitura N4:** textos graduados e do dia a dia. *(M)*
- ⬜ **Kanji N3**, no mesmo formato (traços, leituras, exemplos). *(G)*
- ⬜ **Simulado offline** (sem IA) por nível, com nota por seção. *(M)*

### Motor de aprendizado

- 🟡 **FSRS completo** no lugar das caixas, calibrado com dados reais de uso, mantendo a importação do progresso antigo. *(G)*
- ⬜ **Contagem própria para a escrita (desenho)** nas estatísticas por habilidade, que hoje não a medem. *(P)*
- ⬜ **Metas por nível** N5 → N4 → N3 com marcos de gramática e de leitura, não só de kana e palavras. *(M)*

### Vozes (VOICEVOX)

- ⬜ **Voz por papel nos diálogos:** o atendente numa voz e o aluno em outra. *(P)*
- ⬜ **Lista de vozes mais fácil de usar:** busca por nome, favoritos, filtro por tipo de voz; são 43 personagens em 25 arquivos. *(M)*
- ⬜ **Ajustes de fala:** altura e entonação, além da velocidade. *(P)*
- ⬜ **"Ouvir esta frase com cada voz"** para comparar. *(P)*

### IA opcional

- ⬜ **Modelos locais:** aceitar um endereço próprio compatível com a OpenAI. *(P)*
- ⬜ **Receber texto pelo "compartilhar" do Android** na tela Explicar texto. *(M)*
- ⬜ **Conversa com a voz como entrada** (reconhecimento de fala), não só texto. *(M)*
- ⬜ **Simulado com tempo de prova**, missões em cadeia e adaptadas aos pontos fracos, cenas escolhidas pelo aluno. *(M)*
- ⬜ Testar com uma chave real da OpenAI (o provedor GPT foi escrito, mas não foi exercitado). *(P)*

### Teclado

- 🟡 **Revisão espaçada por tecla e direção:** o modo "Pontos fracos" já escolhe as letras mais erradas; falta agendar a volta de cada uma. *(M)*
- ⬜ **Séries dirigidas** de pontuação e números, e uma meta diária de digitação. *(P)*

### Engenharia

- ⬜ **Integração contínua** (GitHub Actions) rodando `tsc`, lint, Jest e `expo-doctor` em cada alteração. *(P)*
- ⬜ **Testes de ponta a ponta** (por exemplo com Maestro) dos fluxos críticos: primeira abertura, uma lição, uma revisão, a compra na loja. *(M)*
- ⬜ **Dependências em dia:** Dependabot ou Renovate, e subir para o Expo SDK 58 quando ele virar `latest` (hoje é `next`; o projeto está no 57.0.31, e o React Native mais novo é o 0.88). *(M)*
- ⬜ **Capturas de tela automatizadas** para o README a cada versão. *(P)*

### Fora do app (a fluência acontece lá)

- ⬜ **Guia de imersão por nível:** que áudio, vídeo e leitura consumir em cada etapa e como usar legendas em japonês. *(P)*
- ⬜ **Hábito de conversa:** como achar tutor ou parceiro de intercâmbio e um roteiro para a primeira conversa. *(P)*

## 4. Ideias em aberto

Sem prioridade nem decisão; entram nas versões acima quando fizerem sentido.

- Tabela de caracteres, treino livre e dicas de pares parecidos.
- Dicas de memória para os kana com dakuten.
- Moldes de frase com a fala do atendente para escolher, e mais moldes.
- Mais exemplos de leitura do dia a dia (placas, preços em lojas).
- Missões mais variadas: em cadeia, por horário e pesadas pelas áreas mais fracas.
- Widget de tela inicial com a revisão do dia.
- Exportar e importar só as configurações.
- Temas de cor além do claro e do escuro.

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
