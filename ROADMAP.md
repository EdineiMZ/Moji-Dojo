# Moji Dojo: roadmap

Versão atual: **2.8.1** (2026-10-27). Este documento diz **onde o app está**, **o que falta antes de divulgá-lo** e **o que vem depois, por prioridade**. O detalhe de tudo o que já foi entregue em cada fase está em [`docs/roadmap-historico.md`](docs/roadmap-historico.md), e o histórico por versão, no [`CHANGELOG.md`](CHANGELOG.md).

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
| Distribuição | 🟡 | APK de demonstração (chave de depuração); página de Releases a publicar |

### Princípios

1. **Recuperar da memória, não reler:** tudo o que é novo vira cartão de revisão.
2. **Significado antes de forma:** palavra nova vem com exemplo e áudio.
3. **Produzir cedo:** montar, digitar e falar desde o começo, mesmo errando.
4. **Pouco por dia, todo dia:** sessão diária de 15 a 20 minutos, com fim claro.
5. **Conteúdo confiável:** nada de japonês inventado. Vem de fonte aberta com licença conferida, ou é marcado como escrito por IA e revisado por um falante.
6. **Funciona offline e é leve:** sem conta, sem servidor, sem telemetria.

## 2. Antes de divulgar

O que ainda impede ou deveria impedir a publicação do projeto e a distribuição do APK. Os dois primeiros bloqueiam; os demais precisam estar claros para quem usar.

| # | Pendência | Por quê | Esforço |
| --- | --- | --- | --- |
| 1 | **Licença do projeto.** Não há `LICENSE`. Proposta: código sob MIT e dados derivados sob CC BY-SA 4.0 | KanjiVG, JMdict e Kanjium exigem compartilhar igual; publicar sem declarar a licença deixa isso em aberto | P |
| 2 | **Assinar o APK com chave própria.** Hoje ele usa a chave de depuração padrão do Android | Qualquer pessoa pode gerar um APK "atualização" com a mesma assinatura. Trocar a chave exige reinstalar: avise antes e use o backup | P |
| 3 | **Revisão do japonês escrito por IA por um falante:** explicações, diálogos, textos de leitura, frases de viagem, moldes, dicas dos kanji, significados em português e as descrições das vozes | É o maior risco de ensinar algo errado. Está avisado no app e no README | G |
| 4 | **Testar no aparelho** o que só foi verificado por testes e empacotamento: síntese do VOICEVOX (ONNX), câmera, reconhecimento de fala, gravação, teclado 3 × 4 | Dependem do hardware e do Android | P |
| 5 | **Ler os termos do site do VOICEVOX sobre reutilizar as amostras** (ou trocar o botão "Amostra" por um link para a página do personagem) | O app toca a amostra que o site publica; os termos do site sobre isso não foram lidos | P |
| 6 | **Acessibilidade:** passada com TalkBack e fonte grande; alternativa ao flick por deslize | O flick só funciona por gesto | M |
| 7 | **Para a loja:** confirmar o `applicationId` (`com.edi.mojidojo`), política de privacidade (microfone, câmera, IA), ícone e splash no aparelho, AAB | Depois de publicado, o `applicationId` não muda | M |

## 3. Próximas versões

Cada bloco abaixo conta como uma "fase" para a regra de versão do `AGENTS.md` (concluída, sobe a versão).

### 2.8.x: correções e acabamento

Pequenas, de baixo risco, achadas ao revisar as telas.

- ⬜ **Baú do primeiro dia:** ele diz "um presente por você ter voltado hoje", o que não faz sentido na primeira abertura. Trocar por uma mensagem de boas-vindas. *(P)*
- ⬜ **Tela Sobre muito longa:** os créditos viraram um bloco de texto grande no fim dos Ajustes. Levar para uma tela "Créditos" com seções (escrita, vocabulário, frases, áudio, vozes). *(P)*
- ⬜ **Download de voz mais robusto:** retomar um download interrompido, avisar quando estiver em dados móveis, conferir o SHA-256 do arquivo (a API do GitHub publica) e mostrar o espaço usado, com "apagar todas as vozes". *(M)*
- ✅ **Voz sintetizada quase inaudível (2.8.1):** o motor entregava cada personagem num volume diferente (o ずんだもん saía uns 12 dB abaixo das amostras do site); agora o áudio é nivelado pelo pico. Falta confirmar no aparelho.
- ⬜ **Amostra frágil:** ela lê o endereço da página do personagem no site oficial; se o site mudar, o botão só avisa. Ter um plano B (link para a página, ou clipes curtos no app, se os termos permitirem). *(P)*
- ⬜ **Testes de tela:** a lista de vozes e o painel de termos só têm teste da lógica; faltam testes de componente. *(M)*

### 2.9: UX e design (navegação e Ajustes)

O app cresceu por camadas e a interface não acompanhou. A queixa é geral, e é mais forte nos **Ajustes**. Vale começar por uma auditoria de UX e de design (com o app aberto no aparelho, tela por tela) e só depois redesenhar. O que já se vê nas telas:

- ⬜ **Ajustes como uma lista de áreas, não uma rolagem longa.** Hoje são cartões soltos (Você, Lembretes, Meu Mochi) misturados com seções que abrem (Estudo e exibição, IA, Sons, Seus dados) e um bloco de créditos enorme no fim. Proposta: uma tela inicial com uma linha por área, cada uma com ícone, título e um resumo do estado ("Lembretes: leves, 20:00"), e uma subtela para cada: Perfil e metas, Lembretes, Voz e áudio, Estudo, IA, Dados e backup, Créditos. *(G)*
- ⬜ **Texto técnico na frente do usuário:** "Pronta: ja-jp-x-jab-network", "Diagnóstico de som… me mande uma captura desta lista". É informação de desenvolvedor: levar para uma área "Avançado" e trocar por frases humanas. *(P)*
- ⬜ **Opções escondidas em carrosséis de chips** (meta por dia, dia de folga, abas): o "›" no canto esconde escolhas. Preferir seletores que mostrem tudo (grade, lista ou um seletor próprio). *(M)*
- ⬜ **Parágrafos explicativos longos dentro dos cartões** (voz, revisões, leitura): mostrar uma linha e deixar o resto num "Saiba mais". *(M)*
- ⬜ **Hierarquia de botões:** há telas com dois botões primários (rosa) lado a lado. Definir um primário por tela e usar suave e discreto para o resto. *(P)*
- ⬜ **Sistema de design documentado:** escala de espaçamento e de tipografia, estados (carregando, vazio, erro, sucesso) e padrões de cartão e de formulário, para as telas novas nascerem consistentes. *(M)*
- ⬜ **Aba Frases com três níveis de chips** (Frases → Frases → Modelos, Traduzir, Montar, Banco, Diálogos, Viagem, Explorar, Minhas frases, ✨IA → Conversa, Explicar, Diário…). Repensar: um "Praticar" com atalhos, busca por recurso, ou agrupar o que é avançado. Medir o uso antes de decidir. *(G)*
- ⬜ **Início:** "Estudar hoje" e "Sessão de hoje" mostram a mesma revisão em dois cartões. Avaliar juntar os dois. *(M)*
- ⬜ **Primeira abertura:** um primeiro passo guiado (a primeira lição) logo depois da introdução, em vez de cair numa tela cheia de opções. *(M)*
- ⬜ **Acessibilidade:** o item 6 da seção 2, mais contraste e alvos de toque revisados nas telas novas. *(M)*
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

### Engenharia e distribuição

- ⬜ **Integração contínua** (GitHub Actions) rodando `tsc`, lint, Jest e `expo-doctor` em cada alteração. *(P)*
- ⬜ **Releases automáticas:** APK assinado com a chave própria e o SHA-256 nas notas. *(M)*
- ⬜ **Checagem de atualização dentro do app**, pelo endpoint já decidido (`https://api.github.com/repos/EdineiMZ/Moji-Dojo/releases/latest`, tratando 404 como "sem atualização"), com aviso discreto e opção em Ajustes. *(M)*
- ⬜ **Testes de ponta a ponta** (por exemplo com Maestro) dos fluxos críticos: primeira abertura, uma lição, uma revisão, a compra na loja. *(M)*
- ⬜ **Dependências em dia:** Dependabot ou Renovate, e subir para o Expo SDK 58 quando ele virar `latest` (hoje é `next`; o projeto está no 57.0.31, e o React Native mais novo é o 0.88). *(M)*
- ⬜ **Capturas de tela automatizadas** para o README a cada versão. *(P)*

### Fora do app (a fluência acontece lá)

- ⬜ **Guia de imersão por nível:** que áudio, vídeo e leitura consumir em cada etapa e como usar legendas em japonês. *(P)*
- ⬜ **Hábito de conversa:** como achar tutor ou parceiro de intercâmbio e um roteiro para a primeira conversa. *(P)*

## 4. Ideias em aberto

Sem prioridade nem decisão; entram nas versões acima quando fizerem sentido.

- As abas do protótipo que não entraram: tabela de caracteres, treino livre e dicas de pares parecidos.
- Dicas de memória para os kana com dakuten (o protótipo original não tinha).
- Moldes de frase com a fala do atendente para escolher, e mais moldes.
- Mais exemplos de leitura do dia a dia (placas, preços em lojas).
- Missões mais variadas: em cadeia, por horário e pesadas pelas áreas mais fracas.
- Widget de tela inicial com a revisão do dia.
- Exportar e importar só as configurações.
- Temas de cor além do claro e do escuro.

## 5. Fora do escopo por enquanto

- Contas, nuvem, sincronização entre aparelhos e rankings (o app é offline; o backup cobre a troca de celular).
- iPhone (e, junto, a publicação em loja, até o `applicationId` estar decidido).
- Conteúdo acima do N3.

## 6. Como saber se está funcionando

- **Retenção real:** dos itens revisados depois de 30 dias, quantos o aluno ainda acerta (meta inicial: acima de 80%).
- **Constância:** dias estudados por semana e sessões diárias concluídas.
- **Cobertura:** vocabulário e gramática dominados em relação ao nível-alvo.
- **Uso ativo:** frases produzidas por semana (montadas, digitadas e faladas), não só reconhecidas.
- **Teste externo:** simulados do JLPT e conversas reais dizem mais do que qualquer métrica interna.
