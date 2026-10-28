# Avisos de terceiros

O código, a arte e os sons originais do Moji Dojo são distribuídos sob a licença MIT (ver [`LICENSE`](LICENSE), em português e em inglês). Este arquivo lista o que o app usa de terceiros, com a licença de cada um. O detalhe de origem, alterações feitas e pendências está em [`src/content/LICENSE.md`](src/content/LICENSE.md) e em [`src/data/strokes/LICENSE.md`](src/data/strokes/LICENSE.md).

## Conteúdo e dados

| O quê | Fonte | Licença |
| --- | --- | --- |
| Ordem e números dos traços dos kana e kanji | [KanjiVG](https://kanjivg.tagaini.net), Ulrich Apel | CC BY-SA 3.0 |
| Classe gramatical das palavras, leituras e kanji (N5 e N4) | JMdict e KANJIDIC2, [EDRDG](https://www.edrdg.org/edrdg/licence.html) | CC BY-SA 4.0 |
| Tom das palavras (pitch accent) | [Kanjium](https://github.com/mifunetoshiro/kanjium) | CC BY-SA 4.0 |
| Frases de exemplo, banco de frases e "Explorar frases" | [Tatoeba](https://tatoeba.org) (autores nas páginas de cada frase) | CC BY 2.0 FR |
| Lista de vocabulário JLPT N5 | Jonathan Waller ([tanos.co.uk](https://www.tanos.co.uk/jlpt/)), pelo projeto [open-anki-jlpt-decks](https://github.com/jamsinclair/open-anki-jlpt-decks) (MIT) | CC BY |
| Áudio das palavras (360 gravações) | [Lingua Libre](https://lingualibre.org), Wikimedia Commons (falantes e páginas em `src/content/wordAudio.ts`) | CC0, CC BY 4.0 e CC BY-SA 4.0 |
| Fonte M PLUS Rounded 1c | Coji Morishita e colaboradores | SIL Open Font License 1.1 |

Os significados em português do vocabulário, as explicações, os diálogos, os textos de leitura, as frases de viagem e as descrições das vozes foram escritos para este app, em parte por IA, e **não foram revisados por um falante nativo**.

## Voz de anime (VOICEVOX)

- **VOICEVOX CORE** ([VOICEVOX/voicevox_core](https://github.com/VOICEVOX/voicevox_core)) e **ONNX Runtime** (Microsoft): licença MIT.
- **Dicionário do Open JTalk** (incluído no APK, em `assets/voicevox/dict`): Copyright (c) 2009, Nara Institute of Science and Technology, Japan. Licença BSD de 3 cláusulas, com o aviso completo no arquivo `COPYING` que acompanha o dicionário.
- **Vozes (`.vvm`):** não fazem parte do APK nem do repositório. O app as baixa da [release oficial](https://github.com/VOICEVOX/voicevox_vvm/releases) a pedido da pessoa, depois de mostrar os termos de cada personagem. Toda voz usada exige o crédito **"VOICEVOX:nome do personagem"**, que o app mostra. Termos gerais: [TERMS.txt](https://github.com/VOICEVOX/voicevox_vvm/blob/main/TERMS.txt); os de cada personagem têm link na própria tela de download.

## Bibliotecas e serviços

- **Google ML Kit** (reconhecimento de texto japonês, modelo dentro do app): [termos do ML Kit](https://developers.google.com/ml-kit/terms).
- **Reconhecimento de fala:** `expo-speech-recognition` (MIT), que usa o serviço de fala do Android; o áudio não é guardado pelo app.
- **Expo, React Native, Zustand, Reanimated e demais dependências:** ver `package.json`; todas sob licenças permissivas (MIT ou Apache-2.0), conforme cada pacote.

## Arte e som

O Mochi, os itens da loja e os efeitos sonoros são originais deste projeto (arte em SVG; sons sintetizados por código) e seguem a mesma licença do código.
