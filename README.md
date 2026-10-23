# Moji Dojo 🌸

App pessoal de estudo de japonês (hiragana, katakana e kanji N5), feito com React Native e Expo, só para Android por enquanto. Visual kawaii, com um mascote gatinho, o **Mochi**, que reage aos acertos e erros.

> **Créditos:** a ordem dos traços vem do [KanjiVG](https://kanjivg.tagaini.net), de Ulrich Apel, licença **CC BY-SA 3.0**. O crédito, a licença e as alterações feitas estão em [`src/data/strokes/LICENSE.md`](src/data/strokes/LICENSE.md).

O protótipo web `Nihongo Dojo.html` (na raiz do repositório; é o nome antigo do projeto, e o arquivo foi mantido como está) é a especificação: todo o conteúdo em japonês vem dele, nada foi inventado.

## O que já funciona

O app tem cinco abas (**Início, Trilha, Ouvir, Frases, Teclado**) e uma tela de **Ajustes**, aberta pela engrenagem na Início.

**Estudo (Fase 1)**
- **Início:** "Estudar hoje" com as revisões pendentes, a próxima lição, os dias seguidos e o aviso de quando vence a próxima revisão (e quantas). Abaixo, o painel:
  - **Sua constância:** dias seguidos, melhor sequência, dias estudados, precisão e uma faixa dos últimos 14 dias.
  - **Sua evolução:** caracteres aprendidos nos últimos 30 dias e respostas por dia nos últimos 14, com os valores também em lista. A evolução só existe a partir de quando o app passou a registrar o histórico; antes disso, a linha mostra o que você já tinha (ex.: um backup importado).
  - **Seu progresso:** quanto de cada escrita já entrou na revisão.
- **Trilha:** lições de hiragana, katakana e kanji em sequência, com bloqueio progressivo e o atalho "Já sei: fazer o teste".
- **Lição em três passos:**
  - **Conhecer:** caractere com os traços se desenhando, som, exemplo e dica de memorização.
  - **Escrever:** desenho com o dedo, em modo Decalcar (modelo cinza com números) ou Livre. A conferência mostra a nota e o que cada traço fez (certo, invertido, ordem, errado, faltou). A nota é só um guia e não bloqueia a lição.
  - **Testar:** quiz de alternativas nos dois sentidos; passa com 80% de acerto na primeira tentativa (90% no "Já sei"); as erradas voltam.
- **Revisão espaçada:** caixas de 1, 3, 7, 14, 30 e 60 dias, como no protótipo, mais a "Revisão extra" com os caracteres mais fracos.
- **Modo "write" nas revisões:** em cerca de 20% das perguntas dos caracteres que têm traços, o app mostra o significado e o som (nunca o símbolo) e você **desenha** o caractere. Nota de 70% ou mais conta como acerto (sobe de caixa); abaixo disso, volta à caixa 1. Pode ser desligado em Ajustes.

**Ouvir**
- **Sons:** guia de pronúncia para quem fala português, com exemplos em áudio.
- **Ouvido:** toca um som e você escolhe o que foi dito (kana aprendidos, ou palavras dos "pares difíceis", que só mudam pela duração do som).
- **Repetir:** frases de viagem para treinar a fala (shadowing), com ouvir normal/devagar e autoavaliação salva (Igual, Quase, Diferente).

**Frases**
- **Gramática:** 10 tópicos expansíveis, com tabela de verbos, esquema da frase e exemplos em áudio.
- **Montar:** monte a frase em japonês tocando nos blocos (sobram blocos de propósito; algumas frases aceitam mais de uma ordem).
- **Viagem:** frases por categoria, com áudio e "Palavra por palavra".
- **Palavras (vocabulário):** 837 palavras (179 da especificação e 658 da lista JLPT N5), aprendidas 5 por vez, por assunto, com leitura, significado, kanji da palavra e som. Cada palavra vira cartões de revisão espaçada (japonês → significado, significado → japonês e, nas palavras só de kana, ouvir → palavra).

**Teclado**
- **Guia:** como funciona o teclado japonês de 12 teclas com deslize (flick).
- **Simulador:** teclas de verdade que você segura e arrasta, com a cruz de opções e a dica de qual tecla e direção usar.
- **Desafio:** digitar com o seu teclado real (Gboard em japonês); se errar, o app diz o que provavelmente faltou.

**Ajustes**
- **Exportar e importar backup** (códigos `MDJ1:` do app e `NDJ1:` do protótipo), status e teste da voz japonesa, escrever nas revisões (liga/desliga), **efeitos sonoros e vibração** (liga/desliga), zerar progresso e créditos.

**Geral:** tela de carregamento animada com o Mochi; **efeitos sonoros** (acerto, erro, conclusão, 100% e toque nas teclas) e vibração leve; transições suaves entre abas, passos e perguntas; confirmação ao sair de um teste em andamento; animações (cartões com mola, botões que afundam, barra de progresso animada, pétalas de sakura e confete) que respeitam o "reduzir movimento" do Android; modo claro e escuro (céu noturno de Tóquio); progresso salvo no celular.

## Como rodar

### Requisitos

- **Node.js LTS** (testado com a versão 22) e **Git**. No Windows: `node --version` e `git --version` devem responder.
- O app **Expo Go** instalado no Android (Play Store).
- O celular e o PC na **mesma rede Wi-Fi**.

### Passo a passo

```bash
npm install          # baixa as dependências (usa o package-lock.json)
npx expo start       # inicia o servidor de desenvolvimento
```

No Expo Go, escaneie o QR code mostrado no terminal. Se o QR não funcionar, use **Enter URL manually** e digite o endereço `exp://<IP-do-PC>:8081` (o IP aparece no terminal, algo como `192.168.0.10`).

- Se algo ficar estranho depois de mudar de versão ou de arquivo de configuração: `npx expo start -c` (limpa o cache).
- Se o celular não conectar, o Firewall do Windows costuma estar bloqueando a porta 8081 para a rede privada.
- **O Expo Go precisa suportar o SDK do projeto.** Este projeto usa o **Expo SDK 57**, que é o que o Expo Go da Play Store suporta. Ao atualizar o SDK, confirme antes que o Expo Go público já o suporta.

### Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Inicia o servidor do Expo |
| `npm run typecheck` | Checa os tipos (TypeScript em modo `strict`) |
| `npm test` | Roda os testes (Jest com `jest-expo`) |
| `npm run extract-data` | Regera `src/data/` a partir de `Nihongo Dojo.html` |
| `npm run generate-sounds` | Regera os efeitos sonoros em `assets/sfx/` (sintetizados por código) |
| `npx expo-doctor` | Confere se as dependências são compatíveis com o SDK |

Antes de commitar, vale rodar `npm run typecheck`, `npm test` e `npx expo-doctor`.

> **Sobre o `.npmrc`:** ele define `legacy-peer-deps=true`. O Expo fixa o React em 19.2.x, mas o npm tenta puxar um `react-dom` 19.3 como peer dependency. O app é só Android e não usa `react-dom`, então o conflito é ignorado. O `package-lock.json` foi gerado assim; sem essa configuração o `npm ci` recusa o lockfile.

## Gerar o APK e a versão

No Windows, dê dois cliques em `gerar-apk.bat` (precisa de Node, JDK 17 ou 21 e Android SDK). Ele gera o projeto Android, compila e copia o APK para a raiz com **nome + versão**, por exemplo `MojiDojo-1.1.0.apk`. Só arm64 (celulares de 64 bits); para aparelhos antigos de 32 bits, veja o comentário no próprio script.

A versão fica em `app.json` (`expo.version`), espelhada em `package.json` e `package-lock.json`; o `android.versionCode` é derivado dela (1.2.3 → 10203), então o Android aceita instalar a atualização por cima. Cada versão tem uma entrada no [CHANGELOG](CHANGELOG.md).

```bash
npm run version:show             # versão atual
npm run version:bump -- minor    # fase concluída (patch = correções; major = virada grande)
npm run version:sync             # depois de editar a versão no app.json à mão
```

O `bump` abre a entrada do changelog com um texto provisório, que precisa ser escrito. Um teste falha se a versão, o `versionCode` e o changelog divergirem, e a regra de aumentar a versão a cada fase concluída está no `AGENTS.md`.

## Estrutura de pastas

```
app/                      Rotas do expo-router (uma tela por arquivo)
  _layout.tsx             Fontes, tema, gestos e a pilha de telas
  (tabs)/                 Abas: index (Início), trail, listen, phrases, keyboard
  lesson/[id].tsx         Lição: Conhecer → Escrever → Testar
  review.tsx              Revisão espaçada (e revisão extra)
  settings.tsx            Ajustes (aberta pela engrenagem na Início)

src/
  content/                Vocabulário (dados do HTML + lista JLPT N5 gerada) e LICENSE.md das fontes
  data/                   Dados extraídos do HTML (arquivos gerados, não edite à mão)
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
scripts/                  extract-data.mjs (lê o HTML e gera src/data/), o conversor de HTML e o sintetizador de sons
```

A lógica das regras (SRS, trilha, quiz, escrita, montar, teclado, backup, dias seguidos) é feita de **funções puras**, sem React, com o relógio e a aleatoriedade passados de fora. Por isso são testáveis com datas fixas e sorteios determinísticos. Os arquivos `*.test.ts` ficam ao lado do código que testam.

## Dados do HTML

Tudo em `src/data/` é **gerado** por `scripts/extract-data.mjs`. O script executa só os trechos de dados do próprio HTML num contexto isolado, então os ids de lição (`hira:L0`, `kanji:L3`...) e as listas de caracteres saem idênticos aos do protótipo. Isso é essencial para o backup `NDJ1:` funcionar. Os textos que no HTML têm marcação (`<b>`, `<span lang="ja">`, a tabela de verbos) passam por um conversor que gera texto estruturado, para o app não interpretar HTML.

O `src/data/strokes/LICENSE.md` é texto jurídico escrito à mão: o script não o gera nem o sobrescreve, apenas confere que ele existe.

Se alterar o HTML, rode `npm run extract-data` e depois `npm test` (testes conferem a consistência dos dados: caracteres únicos, lições que só citam caracteres existentes, traços para todo kanji, textos sem marcas de HTML, palavras do simulador digitáveis...).

Extraídos: kana, kanji, exemplos, dicas de memorização, lições, traços, gramática, exercícios do Montar, sons, pares difíceis, frases de viagem e dados do teclado. **Não extraídos** (abas do protótipo que não entraram no app): as regras e dicas de pares parecidos da aba Dicas.

O script avisa de 3 ordens alternativas do protótipo, no Montar, que usam um bloco que não é oferecido (por exemplo `へ` em "Vou para o Japão") e por isso nunca poderiam ser montadas. Os dados ficam fiéis ao HTML; não inventamos blocos.

## Como a escrita é conferida

O protótipo compara imagens (canvas). Medimos que isso não separa caracteres parecidos: um 水 perfeito contra o modelo de 日 dava 81%, e pares como ぬ/め ou は/ほ davam mais de 90%. Por isso o app compara **por geometria, traço a traço**:

1. alinha o desenho ao modelo em posição e escala (escrever menor ou fora do centro não prejudica);
2. reamostra cada traço em 24 pontos;
3. casa cada traço do modelo com o desenho mais parecido (algoritmo húngaro), sem depender da ordem;
4. a nota é a média das semelhanças, dividida pelo maior número de traços (modelo ou desenho), então faltar ou sobrar traço custa nota.

Só a forma decide o resultado; direção e ordem aparecem como feedback. Os limites ficam em `src/features/writing/score.ts` (`MAX_STROKE_DISTANCE`, `OK_STROKE_DISTANCE`, `WRITE_PASS_SCORE`) e foram calibrados com erros de mão **simulados**: ajuste-os com o seu desenho real se a nota parecer exigente ou frouxa demais. Só 245 itens têm traços (143 kana de um símbolo e 102 kanji); as 84 combinações e sons estrangeiros (きゃ, ファ…) não têm, e seguem só com perguntas de alternativas.

### Conteúdo novo (fora do protótipo)

O HTML é a fonte do conteúdo **atual**, mas não vai crescer com o app. O conteúdo que vier depois (vocabulário, frases, textos; ver o [ROADMAP](ROADMAP.md)) **não** entra em `src/data/`, para o `extract-data` nunca sobrescrevê-lo:

- Vive em arquivos de dados próprios, **escritos à mão** (ou importados de fonte aberta), num diretório separado (`src/content/`), com tipos TypeScript.
- Cada coleção tem **testes de consistência**, como os de `src/data/*.test.ts`: toda palavra tem leitura e significado, todo kanji citado existe no catálogo, sem duplicatas, sem marcas de HTML.
- Regra do projeto: **nada de japonês inventado**. Todo item vem de fonte com licença conferida (e creditada, como o KanjiVG em `src/data/strokes/LICENSE.md`) ou foi revisado por um falante.
- Hoje o vocabulário é o da especificação (`src/content/vocab.ts`) mais a lista JLPT N5: o CSV e as traduções ficam em `scripts/vocab-n5/` e `npm run build-n5` gera `src/content/n5.ts` (veja `scripts/build-n5.mjs`). Fontes, alterações e a lista "Antes de publicar" estão em [`src/content/LICENSE.md`](src/content/LICENSE.md): o app é de uso pessoal e **as licenças de conteúdo ainda não foram validadas para publicação**.

## Backup

Há dois formatos, os dois "prefixo" + base64 de um JSON em UTF-8, e ambos são importados em **Ajustes → Importar backup**:

- **`MDJ1:` (do próprio app).** Em **Ajustes → Exportar backup** o app gera o código com todo o progresso: `srs`, `lessons`, `stats`, `days`, o histórico por dia (painel de evolução), a autoavaliação do Repetir e os desafios de digitação. O código pode ser compartilhado pelo Android ou copiado, e serve para trocar de celular ou reinstalar o app. Tem um campo `v` de versão: um código gerado por uma versão mais nova do app é recusado com uma mensagem clara.
- **`NDJ1:` (do protótipo HTML).** São importados só `srs`, `lessons`, `stats` e `days`; a melhor sequência de acertos (`best`), as notas de desenho e os demais campos do protótipo não entram. Essa importação existe para migrar o progresso do protótipo.

Em qualquer um, o código é validado, o app mostra um resumo (lições, revisões, caracteres e dias) e só substitui o progresso depois da confirmação. Itens que não existem mais neste app são ignorados.

## Decisões técnicas

- **Expo SDK 57**, TypeScript `strict` e `expo-router`.
- **Zustand + `expo-sqlite/kv-store`** para o progresso e as preferências, em duas stores separadas (zerar ou importar o progresso não mexe nas preferências). O MMKV foi descartado por exigir build nativo (não roda no Expo Go); um SQLite completo seria exagero para um JSON pequeno. A API síncrona do `kv-store` faz os dados já estarem carregados na primeira tela.
- **Reanimated + gesture-handler + SVG** para animações e desenho; os traços são desenhados com `strokeDashoffset` e o traço ao vivo do pad é montado na thread de UI. Não há Skia nem outra dependência nativa.
- **M PLUS Rounded 1c**, só os pesos Regular e Bold (importados pelos caminhos `.../400Regular` e `.../700Bold`; o índice do pacote carregaria todos os pesos).
- **Efeitos sonoros:** `expo-audio` (com `expo-asset`, que ele exige). Os cinco sons são **sintetizados por código** (`scripts/sfxSynth.cjs`: notas com harmônicos de sino e decaimento exponencial), então são originais e sem licença de terceiros; um teste confere que os arquivos versionados são exatamente o que o gerador produz. Tocam no modo `mixWithOthers`, sem interromper a música de quem usa o celular. O plugin do `expo-audio` traz por padrão a permissão de **microfone** (`RECORD_AUDIO`) e a de reprodução em segundo plano; o app não grava nem toca em segundo plano, então elas foram desligadas em `app.json`, e as permissões de armazenamento externo do template do Expo foram bloqueadas.
- **Voz:** `expo-speech` com a voz do Android. O app procura uma voz `ja-JP` e, se não achar, mostra como instalar.
- O mascote e toda a arte são originais, feitos em SVG. Não há imagens de terceiros.
- **Nome:** o projeto se chamava Nihongo Dojo e foi renomeado para **Moji Dojo** (o mascote continua Mochi). O `slug` é `moji-dojo`, o esquema de links é `mojidojo` e o `applicationId` do Android é `com.edi.mojidojo`, com o prefixo `com.edi` **provisório** (nenhuma build foi publicada, então dá para trocar sem consequências; confirme o prefixo antes da primeira build para a loja). As chaves de armazenamento antigas (`nihongo-dojo-*`) são migradas sozinhas para `moji-dojo-*` na primeira abertura, então o progresso já salvo é mantido.

## Licenças e créditos

- **Ordem dos traços:** [KanjiVG](https://kanjivg.tagaini.net), de Ulrich Apel, licença **CC BY-SA 3.0**. O crédito está em `src/data/strokes/LICENSE.md` e na tela Ajustes. Por ser CC BY-SA, o arquivo de traços (e obras derivadas dele) deve manter o crédito e a mesma licença.
- **Fonte:** M PLUS Rounded 1c (SIL Open Font License).
- **Efeitos sonoros:** gerados por código neste projeto (originais).

## O que fica para depois

**Antes de publicar na loja:**
- Trocar os **ícones e a imagem de splash**: `assets/icon.png`, os `android-icon-*.png` e `splash-icon.png` ainda são os do template do Expo. Eles só aparecem em builds (o Expo Go não os usa).
- Confirmar o prefixo do `applicationId` (`com.edi.mojidojo`, provisório).
- Conferir o `AndroidManifest.xml` da primeira build: o app só deve pedir `INTERNET`, `VIBRATE` e `MODIFY_AUDIO_SETTINGS` (a `SYSTEM_ALERT_WINDOW` do template vale apenas para builds de desenvolvimento).

**Ideias em aberto:**
- As abas do protótipo que não entraram: tabela de caracteres, treino livre e dicas de pares parecidos.
- Dicas de memorização para os kana com dakuten (o HTML não tem).

## Problemas conhecidos

- **Verificado por testes e empacotamento, não no aparelho:** o gesto de desenho (e se a rolagem trava mesmo enquanto se desenha), a "sensação" do corte de 70% do write, o teclado de flick, a vibração e a voz dependem do aparelho. Se algo se comportar diferente no seu Android, anote o sintoma.
- O `npm install` mostra dezenas de avisos de vulnerabilidade (`npm audit`). Vêm de dependências internas do Expo e do React Native, não do código do app. **Não rode `npm audit fix --force`**: ele costuma quebrar as versões compatíveis com o SDK.
- O app carrega só as fontes M PLUS Regular e Bold, mas o pacote final inclui uma terceira fonte, a Material Symbols (cerca de 1 MB), que vem de dentro do `expo-router` (`expo-router → expo-symbols`). Ela não é usada pelo código do app e não dá para removê-la sem alterar o pacote.
- O ajuste "reduzir movimento" do Android é lido ao abrir o app: depois de mudá-lo, reabra o Expo Go.
- No Simulador de teclado, o dia de estudo é marcado ao completar uma palavra (o protótipo marcava a cada tecla).
