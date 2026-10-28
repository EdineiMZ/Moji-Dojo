# Arquitetura e decisões técnicas

Este documento reúne o que está por baixo do app: a estrutura do código, como os dados são gerados, como a escrita é conferida, o formato do backup e as decisões técnicas. O resumo e o guia de uso estão no [README](../README.md); o estado de cada funcionalidade, no [ROADMAP](../ROADMAP.md).

## Estrutura de pastas

```
app/                      Rotas do expo-router (uma tela por arquivo)
  _layout.tsx             Fontes, tema, gestos e a pilha de telas
  (tabs)/                 Abas: index (Início), trail, listen, phrases, keyboard
  lesson/[id].tsx         Lição: Conhecer → Escrever → Testar
  review.tsx              Revisão espaçada (e revisão extra)
  settings.tsx            Ajustes (aberta pela engrenagem na Início)

src/
  content/                Vocabulário, frases, textos e diálogos (de fontes abertas ou escritos para o app) e LICENSE.md das fontes
  data/                   Dados-base de escrita, gramática inicial e teclado (vieram do protótipo original; mantidos à mão)
    strokes/              Traços do KanjiVG + LICENSE.md (CC BY-SA 3.0)
  features/               Regras do app e as telas de cada assunto
    catalog/              Lista de caracteres estudáveis e busca
    lessons/              Trilha, bloqueio, passos da lição (Conhecer, Escrever, Testar)
    quiz/                 Motor do quiz (k2r, r2k, audio, write), telas e cartão de resultado
    review/               Repetição espaçada (SRS), sessão de revisão, formatação de datas
    vocab/                Cartões de vocabulário (SRS por palavra), perguntas e telas da sub-aba Palavras
    writing/              Conferência da escrita (geometria por traço) e o pad de desenho
    strokes/              Caminhos SVG: comprimento, amostragem e extremidades
    streak/               Dias de estudo e dias seguidos
    home/                 Resumo "Estudar hoje" e cartões da tela Início
    listen/               Sons, treino de ouvido e Repetir
    phrases/              Gramática, Montar e Viagem
    keyboard/             Guia, simulador de flick e desafios de digitação
    speech/               Voz japonesa (detecção ja-JP, aviso, teste, velocidade)
    backup/               Exportação (MDJ1) e validação/importação dos códigos MDJ1 e NDJ1
    progress/             Tipos do progresso e cartões de Ajustes (zerar, sobre)
  components/             UI reutilizável (Card, Button, ProgressBar, Mascot, animações...)
  store/                  Zustand + armazenamento persistente (progresso e preferências)
  theme/                  Cores (claro/escuro), fontes e espaçamentos
  hooks/, lib/            Utilitários pequenos (relógio da tela, vibração, plural)

assets/sfx/               Efeitos sonoros (WAV), gerados por scripts/generate-sounds.mjs
scripts/                  Geradores e verificadores de dados (vocabulário, frases, tom, kanji, áudio, VOICEVOX), versionamento e o sintetizador de sons
```

A lógica das regras (SRS, trilha, quiz, escrita, montar, teclado, backup, dias seguidos) é feita de **funções puras**, sem React, com o relógio e a aleatoriedade passados de fora. Por isso são testáveis com datas fixas e sorteios determinísticos. Os arquivos `*.test.ts` ficam ao lado do código que testam.

## Dados-base (`src/data/`)

Os dados de escrita, a gramática inicial e o teclado em `src/data/` vieram do protótipo web original (`Nihongo Dojo.html`), extraídos por um script que executava só os trechos de dados do próprio HTML. O protótipo e o script foram **removidos do repositório em 2026-10-27** (continuam no histórico do git); desde então `src/data/` é mantido à mão, como o resto do conteúdo.

Os ids de lição (`hira:L0`, `kanji:L3`...) são os mesmos do protótipo, e isso é essencial: é o que mantém importável o backup `NDJ1:`, o formato do protótipo.

Os testes de `src/data/*.test.ts` conferem a consistência: caracteres únicos, lições que só citam caracteres existentes, traços para todo kanji, textos sem marcas de HTML, palavras do simulador digitáveis...

Dados do protótipo que nunca entraram no app: as regras e dicas de pares parecidos da aba Dicas. Além disso, 3 ordens alternativas do Montar usam um bloco que não é oferecido (por exemplo `へ` em "Vou para o Japão") e por isso nunca poderiam ser montadas; os dados ficam fiéis ao original, sem blocos inventados.

## Como a escrita é conferida

O protótipo compara imagens (canvas). Medimos que isso não separa caracteres parecidos: um 水 perfeito contra o modelo de 日 dava 81%, e pares como ぬ/め ou は/ほ davam mais de 90%. Por isso o app compara **por geometria, traço a traço**:

1. alinha o desenho ao modelo em posição e escala (escrever menor ou fora do centro não prejudica);
2. reamostra cada traço em 24 pontos;
3. casa cada traço do modelo com o desenho mais parecido (algoritmo húngaro), sem depender da ordem;
4. a nota é a média das semelhanças, dividida pelo maior número de traços (modelo ou desenho), então faltar ou sobrar traço custa nota.

Só a forma decide o resultado; direção e ordem aparecem como feedback. Os limites ficam em `src/features/writing/score.ts` (`MAX_STROKE_DISTANCE`, `OK_STROKE_DISTANCE`, `WRITE_PASS_SCORE`) e foram calibrados com erros de mão **simulados**: ajuste-os com o seu desenho real se a nota parecer exigente ou frouxa demais. Só 245 itens têm traços (143 kana de um símbolo e 102 kanji); as 84 combinações e sons estrangeiros (きゃ, ファ…) não têm, e seguem só com perguntas de alternativas.

### Conteúdo novo (fora do protótipo)

Os dados-base não vão crescer com o app. O conteúdo que vier depois (vocabulário, frases, textos; ver o [ROADMAP](../ROADMAP.md)) **não** entra em `src/data/`, e sim em `src/content/`:

- Vive em arquivos de dados próprios, **escritos à mão** (ou importados de fonte aberta), num diretório separado (`src/content/`), com tipos TypeScript.
- Cada coleção tem **testes de consistência**, como os de `src/data/*.test.ts`: toda palavra tem leitura e significado, todo kanji citado existe no catálogo, sem duplicatas, sem marcas de HTML.
- Regra do projeto: **nada de japonês inventado**. Todo item vem de fonte com licença conferida (e creditada, como o KanjiVG em `src/data/strokes/LICENSE.md`) ou foi revisado por um falante.
- Hoje o vocabulário é o da especificação (`src/content/vocab.ts`) mais a lista JLPT N5: o CSV e as traduções ficam em `scripts/vocab-n5/` e `npm run build-n5` gera `src/content/n5.ts` (veja `scripts/build-n5.mjs`). Fontes, alterações e a lista "Antes de publicar" estão em [`src/content/LICENSE.md`](../src/content/LICENSE.md): a licença das listas do Tanos foi conferida em 2026-10-27 (Creative Commons BY, com crédito); **restam a revisão do conteúdo escrito por IA por um falante e a escolha da licença do projeto**.

## Backup

Há dois formatos, os dois "prefixo" + base64 de um JSON em UTF-8, e ambos são importados em **Ajustes → Importar backup**:

- **`MDJ1:` (do próprio app).** Em **Ajustes → Exportar backup** o app gera o código com todo o progresso: `srs`, `lessons`, `stats`, `days`, o histórico por dia (painel de evolução), a autoavaliação do Repetir e os desafios de digitação. O código pode ser compartilhado pelo Android ou copiado, e serve para trocar de celular ou reinstalar o app. Tem um campo `v` de versão: um código gerado por uma versão mais nova do app é recusado com uma mensagem clara.
- **`NDJ1:` (do protótipo HTML).** São importados só `srs`, `lessons`, `stats` e `days`; a melhor sequência de acertos (`best`), as notas de desenho e os demais campos do protótipo não entram. Essa importação existe para migrar o progresso do protótipo.

Em qualquer um, o código é validado, o app mostra um resumo (lições, revisões, caracteres e dias) e só substitui o progresso depois da confirmação. Itens que não existem mais neste app são ignorados.

## Decisões técnicas

- **Expo SDK 57**, TypeScript `strict` e `expo-router`.
- **Zustand + `expo-sqlite/kv-store`** para o progresso e as preferências, em duas stores separadas (zerar ou importar o progresso não mexe nas preferências). O MMKV foi descartado por exigir build nativo (não roda no Expo Go); um SQLite completo seria exagero para um JSON pequeno. A API síncrona do `kv-store` faz os dados já estarem carregados na primeira tela.
- **Reanimated + gesture-handler + SVG** para animações e desenho; os traços são desenhados com `strokeDashoffset` e o traço ao vivo do pad é montado na thread de UI. O desenho não usa Skia.
- **M PLUS Rounded 1c**, só os pesos Regular e Bold (importados pelos caminhos `.../400Regular` e `.../700Bold`; o índice do pacote carregaria todos os pesos).
- **Efeitos sonoros:** `expo-audio` (com `expo-asset`, que ele exige). Os cinco sons são **sintetizados por código** (`scripts/sfxSynth.cjs`: notas com harmônicos de sino e decaimento exponencial), então são originais e sem licença de terceiros; um teste confere que os arquivos versionados são exatamente o que o gerador produz. Tocam no modo `mixWithOthers`, sem interromper a música de quem usa o celular. O app não toca em segundo plano (desligado em `app.json`); o microfone é pedido só para gravar a sua voz (Ouvir → Repetir) e para o reconhecimento de fala, com um texto explicando o motivo; as permissões de armazenamento externo do template do Expo foram bloqueadas. As permissões do APK final (conferidas com `aapt2`) incluem internet, câmera, microfone, notificações e vibração, e algumas vêm das bibliotecas.
- **Voz:** `expo-speech` com a voz do Android. O app procura uma voz `ja-JP` e, se não achar, mostra como instalar. Palavras gravadas por falantes nativos (Lingua Libre) têm prioridade, e as vozes de personagem do VOICEVOX são opcionais.
- O mascote e toda a arte são originais, feitos em SVG. Não há imagens de terceiros.
- **Nome:** o projeto se chamava Nihongo Dojo e foi renomeado para **Moji Dojo** (o mascote continua Mochi). O `slug` é `moji-dojo`, o esquema de links é `mojidojo` e o `applicationId` do Android é `com.edi.mojidojo`, com o prefixo `com.edi` **provisório** (nenhuma build foi publicada, então dá para trocar sem consequências; confirme o prefixo antes da primeira build para a loja). As chaves de armazenamento antigas (`nihongo-dojo-*`) são migradas sozinhas para `moji-dojo-*` na primeira abertura, então o progresso já salvo é mantido.

## O que fica para depois

**Antes de publicar na loja:**
- Conferir no aparelho o ícone adaptativo e a splash nos temas claro e escuro (o ícone do Mochi já está no app).
- Confirmar o prefixo do `applicationId` (`com.edi.mojidojo`, provisório).
- Conferir as permissões do APK da primeira build (a `SYSTEM_ALERT_WINDOW` do template já está bloqueada).

**Ideias em aberto:**
- As abas do protótipo que não entraram: tabela de caracteres, treino livre e dicas de pares parecidos.
- Dicas de memorização para os kana com dakuten (o protótipo original não tinha).

## Problemas conhecidos

- **Verificado por testes e empacotamento, não no aparelho:** o gesto de desenho (e se a rolagem trava mesmo enquanto se desenha), a "sensação" do corte de 70% do write, o teclado de flick, a vibração e a voz dependem do aparelho. Se algo se comportar diferente no seu Android, anote o sintoma.
- O `npm install` mostra dezenas de avisos de vulnerabilidade (`npm audit`). Vêm de dependências internas do Expo e do React Native, não do código do app. **Não rode `npm audit fix --force`**: ele costuma quebrar as versões compatíveis com o SDK.
- O app carrega só as fontes M PLUS Regular e Bold, mas o pacote final inclui uma terceira fonte, a Material Symbols (cerca de 1 MB), que vem de dentro do `expo-router` (`expo-router → expo-symbols`). Ela não é usada pelo código do app e não dá para removê-la sem alterar o pacote.
- O ajuste "reduzir movimento" do Android é lido ao abrir o app: depois de mudá-lo, reabra o Expo Go.
- No Simulador de teclado, o dia de estudo é marcado ao completar uma palavra (o protótipo marcava a cada tecla).
