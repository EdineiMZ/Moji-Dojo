# Nihongo Dojo 🌸

App pessoal de estudo de japonês (hiragana, katakana e kanji N5), feito com React Native e Expo, só para Android por enquanto. Visual kawaii, com um mascote gatinho, o **Mochi**, que reage aos acertos e erros.

O protótipo web `Nihongo Dojo.html` (na raiz do repositório) é a especificação: todo o conteúdo em japonês vem dele, nada foi inventado.

## O que já funciona (Fase 1)

- **Início:** "Estudar hoje" com as revisões pendentes, a próxima lição, os dias seguidos e o aviso de quando vence a próxima revisão (e quantas).
- **Trilha:** lições de hiragana, katakana e kanji em sequência, com bloqueio progressivo e o atalho "Já sei: fazer o teste".
- **Lição:** passo **Conhecer** (caractere com os traços se desenhando, som, exemplo e dica de memorização) e passo **Testar** (quiz de alternativas nos dois sentidos; passa com 80% de acerto na primeira tentativa, 90% no "Já sei"; as erradas voltam). O passo **Escrever** é só um espaço reservado.
- **Revisão espaçada:** caixas de 1, 3, 7, 14, 30 e 60 dias, como no protótipo, mais a "Revisão extra" com os caracteres mais fracos.
- **Ajustes:** importar o código de backup do protótipo (`NDJ1:`), status e teste da voz japonesa, zerar progresso.
- **Animações:** cartões que entram com mola, botões que afundam ao tocar, barra de progresso animada, pétalas de sakura e confete no resultado. Tudo respeita a opção "reduzir movimento" do Android.
- **Modo claro e escuro** (céu noturno de Tóquio), seguindo o sistema.
- O progresso fica salvo no celular.

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
| `npx expo-doctor` | Confere se as dependências são compatíveis com o SDK |

Antes de commitar, vale rodar `npm run typecheck`, `npm test` e `npx expo-doctor`.

> **Sobre o `.npmrc`:** ele define `legacy-peer-deps=true`. O Expo fixa o React em 19.2.x, mas o npm tenta puxar um `react-dom` 19.3 como peer dependency. O app é só Android e não usa `react-dom`, então o conflito é ignorado. O `package-lock.json` foi gerado assim; sem essa configuração o `npm ci` recusa o lockfile.

## Estrutura de pastas

```
app/                      Rotas do expo-router (uma tela por arquivo)
  _layout.tsx             Fontes, tema, gestos e a pilha de telas
  (tabs)/                 Abas: index (Início), trail (Trilha), settings (Ajustes)
  lesson/[id].tsx         Lição: Conhecer → Escrever (reservado) → Testar
  review.tsx              Revisão espaçada (e revisão extra)

src/
  data/                   Dados extraídos do HTML (arquivos gerados, não edite à mão)
    strokes/              Traços do KanjiVG + LICENSE.md (CC BY-SA 3.0)
  features/               Regras do app e as telas de cada assunto
    catalog/              Lista de caracteres estudáveis e busca
    lessons/              Trilha, bloqueio, passos da lição (Conhecer, Escrever, Testar)
    quiz/                 Motor do quiz, tela do quiz, feedback e cartão de resultado
    review/               Repetição espaçada (SRS), sessão de revisão, formatação de datas
    streak/               Dias de estudo e dias seguidos
    home/                 Resumo "Estudar hoje" e cartões da tela Início
    backup/               Validação e importação do código NDJ1
    speech/               Voz japonesa (detecção ja-JP, aviso, teste)
    strokes/              Comprimento dos caminhos SVG, usado na animação dos traços
    progress/             Tipos do progresso e cartões de Ajustes (zerar, sobre)
  components/             UI reutilizável (Card, Button, ProgressBar, Mascot, animações...)
  store/                  Zustand + armazenamento persistente do progresso
  theme/                  Cores (claro/escuro), fontes e espaçamentos
  hooks/, lib/            Utilitários pequenos (relógio da tela, vibração, plural)

scripts/extract-data.mjs  Lê o HTML e gera os arquivos de src/data/
```

A lógica das regras (SRS, trilha, quiz, backup, dias seguidos) é feita de **funções puras**, sem React, com o relógio e a aleatoriedade passados de fora. Por isso são testáveis com datas fixas e sorteios determinísticos. Os arquivos `*.test.ts` ficam ao lado do código que testam.

## Dados do HTML

Tudo em `src/data/` é **gerado** por `scripts/extract-data.mjs`. O script executa só os trechos de dados do próprio HTML num contexto isolado, então os ids de lição (`hira:L0`, `kanji:L3`...) e as listas de caracteres saem idênticos aos do protótipo. Isso é essencial para o backup `NDJ1:` funcionar.

Se alterar o HTML, rode `npm run extract-data` e depois `npm test` (um teste confere a consistência dos dados: caracteres únicos, lições que só citam caracteres existentes, traços para todo kanji...).

Extraídos agora: kana, kanji, exemplos, dicas de memorização, lições e traços. **Ainda não extraídos** (ficam para a fase que precisar deles): as explicações de gramática, a seção Sons, as regras e dicas de pares parecidos, os pares difíceis e as frases de viagem. Esses textos têm HTML dentro das strings (`<b>`, `<span>`), que deve virar texto estruturado.

## Backup do protótipo

O código de backup do protótipo tem o formato `NDJ1:` + base64 de um JSON em UTF-8. Em **Ajustes → Importar backup**, o código é validado, o app mostra um resumo (lições, revisões, caracteres e dias) e só substitui o progresso depois da confirmação. São importados `srs`, `lessons`, `stats` e `days`; a melhor sequência de acertos (`best`) e as notas de desenho não entram. Itens que não existem mais neste app são ignorados.

Ainda **não há exportação** de backup neste app.

## Decisões técnicas

- **Expo SDK 57**, TypeScript `strict` e `expo-router`.
- **Zustand + `expo-sqlite/kv-store`** para o progresso. O MMKV foi descartado por exigir build nativo (não roda no Expo Go); um SQLite completo seria exagero para um JSON pequeno. A API síncrona do `kv-store` faz o progresso já estar carregado na primeira tela.
- **Reanimated + SVG** para as animações; os traços são desenhados com `strokeDashoffset`.
- **M PLUS Rounded 1c**, só os pesos Regular e Bold (importados pelos caminhos `.../400Regular` e `.../700Bold`; o índice do pacote carregaria todos os pesos).
- **Voz:** `expo-speech` com a voz do Android. O app procura uma voz `ja-JP` e, se não achar, mostra como instalar.
- O mascote e toda a arte são originais, feitos em SVG. Não há imagens de terceiros.

## Licenças e créditos

- **Ordem dos traços:** [KanjiVG](https://kanjivg.tagaini.net), de Ulrich Apel, licença **CC BY-SA 3.0**. O crédito está em `src/data/strokes/LICENSE.md` e na tela Ajustes. Por ser CC BY-SA, o arquivo de traços (e obras derivadas dele) deve manter o crédito e a mesma licença.
- **Fonte:** M PLUS Rounded 1c (SIL Open Font License).

## O que fica para as próximas fases

**Fase 2 (do pedido original):**
- **Escrever:** desenho livre com o dedo por cima do modelo, com conferência de ordem e direção dos traços (hoje é só um espaço reservado dentro da lição).
- Teclado (digitar romaji), frases (gramática e viagem) e as abas de ouvir (sons, treino de ouvido e repetição).
- As outras abas do protótipo: tabela de caracteres, treino livre e dicas de pares parecidos.

**Polimento final (pedidos já combinados):**
- Tela de carregamento animada com o Mochi.
- Painel inicial com métricas: sequência de dias e evolução ao longo do tempo. A evolução provavelmente exige guardar um histórico novo, porque hoje o app só guarda a lista de dias e o estado atual.

**Ideias em aberto:**
- Exportar o backup do próprio app.
- Dicas de memorização para os kana com dakuten (o HTML não tem).

## Problemas conhecidos

- O `npm install` mostra dezenas de avisos de vulnerabilidade (`npm audit`). Vêm de dependências internas do Expo e do React Native, não do código do app. **Não rode `npm audit fix --force`**: ele costuma quebrar as versões compatíveis com o SDK.
- A animação dos traços, a vibração e a voz foram verificadas por testes e pelo empacotamento, mas dependem do aparelho. Se algo se comportar diferente no seu Android, anote o sintoma.
- O app carrega só as fontes M PLUS Regular e Bold, mas o pacote final inclui uma terceira fonte, a Material Symbols (cerca de 1 MB), que vem de dentro do `expo-router` (`expo-router → expo-symbols`). Ela não é usada pelo código do app e não dá para removê-la sem alterar o pacote.
- O ajuste "reduzir movimento" do Android é lido ao abrir o app: depois de mudá-lo, reabra o Expo Go.
