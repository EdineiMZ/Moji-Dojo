# Avisos de terceiros

O código, a arte e os sons originais do Moji Dojo são distribuídos sob a licença MIT (texto original em [`LICENSE`](LICENSE); versão em português e esclarecimentos sob a lei brasileira em [`LICENCA.pt-BR.md`](LICENCA.pt-BR.md)). Este arquivo lista o que o app usa de terceiros, com a licença de cada um. O detalhe de origem, alterações feitas e pendências está em [`src/content/LICENSE.md`](src/content/LICENSE.md) e em [`src/data/strokes/LICENSE.md`](src/data/strokes/LICENSE.md).

## Conteúdo e dados

| O quê | Fonte | Licença |
| --- | --- | --- |
| Ordem e números dos traços dos kana e kanji | [KanjiVG](https://kanjivg.tagaini.net), Ulrich Apel | CC BY-SA 3.0 |
| Classe gramatical das palavras, leituras e kanji (N5 e N4) | JMdict e KANJIDIC2, [EDRDG](https://www.edrdg.org/edrdg/licence.html) | CC BY-SA 4.0 |
| Tom das palavras (pitch accent) | [Kanjium](https://github.com/mifunetoshiro/kanjium) | CC BY-SA 4.0 |
| Frases de exemplo, banco de frases e "Explorar frases" | [Tatoeba](https://tatoeba.org) (autores nas páginas de cada frase) | CC BY 2.0 FR |
| Lista de vocabulário JLPT N5 | Jonathan Waller ([tanos.co.uk](https://www.tanos.co.uk/jlpt/)), pelo projeto [open-anki-jlpt-decks](https://github.com/jamsinclair/open-anki-jlpt-decks) (MIT) | CC BY (a página de origem não informa a versão) |
| Áudio das palavras (360 gravações) | [Lingua Libre](https://lingualibre.org), Wikimedia Commons (falantes e páginas em `src/content/wordAudio.ts`) | CC0, CC BY 4.0 e CC BY-SA 4.0 |
| Fonte M PLUS Rounded 1c | Coji Morishita e colaboradores | SIL Open Font License 1.1 |

Os significados em português do vocabulário, as explicações, os diálogos, os textos de leitura, as frases de viagem e as descrições das vozes foram escritos para este app, em parte por IA, e **não foram revisados por um falante nativo**.

## Avisos dentro do aplicativo

Os avisos que as licenças pedem acompanham o app em **Ajustes → Créditos e licenças**: os créditos exatos (inclusive o aviso de uso do JMdict e do KANJIDIC2 pedido pela EDRDG e a atribuição ao Kanjium) e o texto de licença de cada componente de terceiros (pacotes do app, bibliotecas Android e componentes nativos). Essa lista é gerada por `scripts/licenses/build.mjs` a partir do que entra de fato no pacote.

## Voz de anime (VOICEVOX)

- **VOICEVOX CORE** ([VOICEVOX/voicevox_core](https://github.com/VOICEVOX/voicevox_core)): licença MIT.
- **Dicionário do Open JTalk** (incluído no APK, em `assets/voicevox/dict`): Copyright (c) 2009, Nara Institute of Science and Technology, Japan. Licença BSD de 3 cláusulas, com o aviso completo no arquivo `COPYING` que acompanha o dicionário.
- **ONNX Runtime do VOICEVOX:** o ONNX Runtime que acompanha o app é o build distribuído pelo VOICEVOX, e não o pacote MIT da Microsoft. **Não é código aberto:** ele traz os próprios termos (uso comercial e não comercial e redistribuição em aplicativos permitidos, sem engenharia reversa, crédito "VOICEVOX" obrigatório) e uma lista de avisos de terceiros, que vai inteira na tela de créditos.
- **Vozes (`.vvm`):** não fazem parte do APK nem do repositório. O app as baixa da [release oficial](https://github.com/VOICEVOX/voicevox_vvm/releases) a pedido da pessoa, depois de mostrar os termos de cada personagem. Toda voz usada exige o crédito **"VOICEVOX:nome do personagem"**, que o app mostra. Termos gerais: [TERMS.txt](https://github.com/VOICEVOX/voicevox_vvm/blob/main/TERMS.txt); os de cada personagem têm link na própria tela de download.

## Bibliotecas e serviços

- **Google ML Kit** (proprietário, não é código aberto; reconhecimento de texto japonês, modelo dentro do app): [termos do ML Kit](https://developers.google.com/ml-kit/terms). Segundo o Google, o ML Kit coleta dados técnicos (modelo do aparelho, versão do Android, nome e versão do app, identificador por instalação e métricas de desempenho) e os envia ao Google por HTTPS ([divulgação de dados](https://developers.google.com/ml-kit/android-data-disclosure)); o conteúdo das imagens não está na lista.
- **Reconhecimento de fala:** `expo-speech-recognition` (MIT), que usa o serviço de fala do Android. O app não guarda o áudio, mas o serviço de fala do Android pode processá-lo nos servidores do Google, conforme a configuração do aparelho (modo online ou offline). É diferente do **shadowing**, que grava a sua voz só para você ouvir de volta: o arquivo fica no armazenamento temporário do aparelho e o app não o envia a ninguém.
- **Expo, React Native, Zustand, Reanimated e demais dependências:** ver `package.json`; todas sob licenças permissivas (MIT ou Apache-2.0), conforme cada pacote.

## Arte e som

O Mochi, os itens da loja e os efeitos sonoros são originais deste projeto (arte em SVG; sons sintetizados por código) e seguem a mesma licença do código.
