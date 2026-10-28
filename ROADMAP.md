# Moji Dojo: roadmap

Versão atual: **2.12.0** (2026-10-28). Este documento diz **onde o app está**, **o que falta validar** e **o que vem depois, por prioridade**. O histórico por versão está no [`CHANGELOG.md`](CHANGELOG.md).

Legenda: ✅ feito · 🟡 em parte · ⬜ pendente. Esforço: **P** = dias, **M** = 1 a 2 semanas, **G** = várias semanas.

## 1. Onde estamos

O Moji Dojo ensina a escrita e leva o aluno até a produção de frases, a escuta, a leitura e a digitação, tudo com revisão espaçada e funcionando sem internet. A IA e as vozes de anime são opcionais.

| Área | Estado | Hoje |
| --- | --- | --- |
| Escrita (kana e kanji) | ✅ | Hiragana, katakana e 284 kanji (N5 e N4), traços animados, desenho conferido por geometria |
| Revisão espaçada | ✅ | FSRS 5 com retenção desejada ajustável (80 a 95%), caixas como estágio, itens teimosos, revisão mista; falta calibrar os pesos com o seu histórico |
| Vocabulário | ✅ | Cerca de 800 palavras do N5, com tom, classe, frases de exemplo, cartões e exportação para o Anki; N4 só nos kanji |
| Gramática | 🟡 | 51 tópicos do N5 e 14 do N4, mini-testes, lacunas, conjugação, contadores; faltam outros pontos do N4 (ながら, すぎる, ようだ e そうだ, あげる, もらう e くれる...) |
| Produção de frases | ✅ | Montar, traduzir, modelos, 13 diálogos, 188 frases de viagem, 30 mil frases para explorar |
| Escuta e fala | ✅ | Ditado, compreensão, tom, shadowing com gravação, reconhecimento de fala |
| Leitura | ✅ | Textos graduados e do dia a dia (N5 e N4), toque na palavra, câmera que lê texto |
| Teclado de flick | ✅ | Simulador com níveis, séries de pontuação e números, conversão, mapa de calor, revisão espaçada por tecla e meta diária |
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
- ⬜ **Confirmar no aparelho:** o volume da voz (2.8.1) e o download novo com a rede caindo no meio. *(P)*
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
- ⬜ **32 bits:** hoje o APK é só `arm64-v8a`. Avaliar um APK `armeabi-v7a` separado para aparelhos antigos. *(P)*
- ⬜ **Analisar o pacote:** a fonte do `expo-symbols` (cerca de 1 MB) vem de dentro do `expo-router` e não é usada. *(P)*

### 2.13: áudio e tema

- ✅ **Áudio sem repetição (2.13.0):** gravações em `mixWithOthers` (sem foco de áudio, que as retomava sozinhas) e fala do Android sempre cancelada antes da próxima. As 360 gravações foram conferidas (existem, têm volume, nenhuma duplicada).
- ✅ **Tema claro, escuro ou automático (2.13.0):** em Ajustes → Aparência.
- ⬜ **Confirmar no aparelho** que sumiram o som repetido e as palavras mudas; quais palavras ainda ficarem mudas aparecem em Ajustes → Avançado. *(P)*

### 3.0: conteúdo do N4

A maior entrega de aprendizado que falta. Exige conferência de fonte e de licença, e revisão por falante.

- 🟡 **Gramática N4 (2.12.0 e 2.14.0):** 14 tópicos, todos com frases do Tatoeba conferidas na fonte: かもしれません, ことにした, てしまう, ておく, はずだ, passiva, ば (2.12.0) e causativa, たら, と, ように なる, ために, のに e ても (2.14.0). Faltam outros pontos do N4 (ながら, すぎる, ようだ e そうだ, あげる, もらう e くれる, てみる, ないで, と思う com a forma simples...). *(G)*
- 🟡 **Vocabulário N4 (2.11.0 e 2.15.0):** 629 palavras com leitura, significado, tom (504) e classe (621). A frequência de uso (2.15.0) cobre 618 delas, e 533 têm ao menos uma frase no banco local de frases do Tatoeba. Faltam os áudios de falantes nativos (nenhuma das 360 gravações é do N4) e a revisão dos significados por um falante. *(M)*
- ✅ **Leitura N4 (2.14.0):** 8 textos corridos e 3 leituras do dia a dia (atraso de trem, hotel, elevador e terremoto), com a gramática do N4 e seletor N5/N4. Escritos por IA, a revisar por um falante; as frases com palavras fora do vocabulário trazem a leitura e o significado de cada pedaço. *(M)*
- ⬜ **Kanji N3**, no mesmo formato (traços, leituras, exemplos). *(G)*
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
- ⬜ **Receber texto pelo "compartilhar" do Android** na tela Explicar texto. *(M)*
- ✅ **Conversa com a voz como entrada (2.15.0):** o botão "Falar em japonês" transforma a fala em texto no campo da conversa, para conferir e corrigir antes de enviar. Usa o serviço de fala do Android, com o aviso de que ele pode enviar o áudio ao Google. *(M)*
- ⬜ **Simulado com tempo de prova**, missões em cadeia e adaptadas aos pontos fracos, cenas escolhidas pelo aluno. *(M)*
- ⬜ Testar com uma chave real da OpenAI (o provedor GPT foi escrito, mas não foi exercitado). *(P)*

### Teclado

- ✅ **Revisão espaçada por tecla (2.14.0):** cada letra ganha um agendamento FSRS (errou: volta em 10 minutos; acertou: o intervalo cresce), e o modo "Pontos fracos" começa pelas letras vencidas. O desempenho mostra o que vence agora e quando volta a próxima. ⬜ Falta agendar por direção (ler, digitar e converter separadamente). *(M)*
- ✅ **Séries dirigidas e meta diária (2.15.0):** as séries "Pontuação" (frases com o sinal do fim, 。 ？ ！, pela tradução) e "Números" (contar em kana) no simulador, e a meta diária de letras certas (50, 100 ou 200) no Desempenho. O teclado de flick do app não tem camada de dígitos, então os números são treinados em kana. *(P)*

### Engenharia

- ✅ **Integração contínua:** `.github/workflows/ci.yml` roda `tsc`, lint, Jest e `expo-doctor` a cada push e pull request (conferido numa cópia limpa do repositório).
- ⬜ **Testes de ponta a ponta** (por exemplo com Maestro) dos fluxos críticos: primeira abertura, uma lição, uma revisão, a compra na loja. *(M)*
- 🟡 **Dependências em dia:** o Dependabot está configurado (`.github/dependabot.yml`, o Expo em grupo e o SDK só à mão). Falta subir para o Expo SDK 58 quando ele virar `latest` (hoje é `next`; o projeto está no 57.0.31, e o React Native mais novo é o 0.88). *(M)*
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
