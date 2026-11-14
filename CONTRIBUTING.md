# Como contribuir com o Moji Dojo

Obrigado pelo interesse! O Moji Dojo é um app de estudo de japonês feito em Expo/React Native, só para Android. É um projeto pessoal e de portfólio, então o ritmo é calmo, mas toda ajuda bem-vinda é lida.

## O que mais ajuda

1. **Revisão do japonês por um falante.** Todas as explicações, diálogos, textos de leitura e significados escritos aqui foram feitos com ajuda de IA e **ainda não foram revisados por um falante**. É o maior risco do projeto. Se você fala japonês, abrir uma issue com a correção (o texto, o que está errado e o que seria certo) vale mais que qualquer código.
2. **Erros de conteúdo e de tradução** em português.
3. **Testes em aparelhos diferentes** (voz de anime, câmera, teclado de flick, TalkBack e fonte grande). Diga o modelo do celular e a versão do Android.
4. **Correções e melhorias no código.**

Antes de uma mudança grande, abra uma issue para conversarmos: assim ninguém perde tempo com algo que não encaixa.

## Preparando o ambiente

Você precisa do Node 22 e do Android Studio (ou de um celular com depuração USB).

```bash
npm ci                     # instala as dependências
npx expo start             # servidor de desenvolvimento
npx expo run:android       # build de desenvolvimento (há código nativo: o Expo Go não basta)
```

Se for mexer na voz de anime, rode também `npm run voicevox:setup` (baixa o motor VOICEVOX; as vozes são baixadas dentro do app).

A estrutura das pastas e as decisões técnicas estão em [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md); as regras de visual, em [`docs/DESIGN.md`](docs/DESIGN.md).

## Antes de abrir o pull request

Rode e corrija tudo o que falhar. O CI roda os mesmos comandos:

```bash
npx tsc --noEmit    # tipos (modo estrito, sem `any`)
npm run lint
npx jest
```

- **Teste o que você muda.** Lógica de estudo, agendamento e conteúdo têm testes; mude junto.
- **Tela nova ou alterada:** siga o [`docs/DESIGN.md`](docs/DESIGN.md) (um botão primário por tela, área de toque de 48 dp, contraste dos quatro temas) e confira nos temas claro e escuro.
- **Textos do app em português do Brasil.** Comentários no código em português, só onde a lógica não é óbvia.
- **Não invente japonês.** Use fontes abertas com licença conferida (Tatoeba, JMdict, KanjiVG...) e registre a fonte e a licença em [`NOTICE.md`](NOTICE.md). Conteúdo copiado de apps ou sites comerciais (Bunpro, JLPT Sensei, Duolingo...) **não é aceito**.
- **Commits** no estilo `tipo(área): o que mudou`, em português: `fix(srs): ...`, `feat(writing): ...`, `docs: ...`, `chore(release): ...`.

### Versão e changelog

A versão do app fica em `app.json`, `package.json` e `package-lock.json`, e tem de bater com o [`CHANGELOG.md`](CHANGELOG.md) (um teste falha se não bater). Quem mantém o projeto sobe a versão ao publicar; em um pull request, **não mexa na versão**, só descreva a mudança no texto do PR.

## Licença das contribuições

Ao enviar uma contribuição, você concorda que ela seja distribuída sob a licença do projeto (MIT, veja [`LICENSE`](LICENSE)). Não envie nada que você não tenha o direito de licenciar.

## Conduta

Leia o [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Para falhas de segurança, **não abra uma issue pública**: veja o [`SECURITY.md`](SECURITY.md).
