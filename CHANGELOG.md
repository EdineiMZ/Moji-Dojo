# Changelog

Cada versão do app tem uma entrada aqui. A política de versões (quando aumentar MAIOR, MENOR ou CORREÇÃO) está em `scripts/versioning.cjs`, e um teste falha se a versão, o `versionCode` e este arquivo divergirem. Para uma versão nova: `npm run version:bump -- <patch|minor|major>`.

## [1.1.0] - 2026-10-22

Fase 0 do [ROADMAP](ROADMAP.md): correções e base para crescer.

- **Backup:** novo "Exportar backup" em Ajustes gera um código `MDJ1:` com todo o progresso (inclusive histórico, Repetir e desafios). O importador aceita `MDJ1:` e `NDJ1:` (do protótipo).
- **Teclado:** a grade do simulador é sempre 3 colunas × 4 linhas (a largura agora é medida na tela), e ⌫ e Limpar ficam numa barra abaixo.
- **Acessibilidade:** contraste do tema claro corrigido (WCAG AA), alvos de toque de 48 dp e ícones das abas fora do leitor de tela.
- **Visual e som:** ícone, ícone adaptativo e splash com o Mochi; animações mais suaves; som de abertura e som de toque nos botões.
- **Correção:** lições bloqueadas deixam de disparar o aviso de opacidade com animação de layout.
- **Build:** o APK sai como `MojiDojo-<versão>.apk`, só para arm64 (de 118 MB para cerca de 50 MB).
- **Projeto:** `npm run lint` sem erros e testes do `Card` funcionando.

## [1.0.0] - 2026-10-22

Primeira versão completa: Fases 1 e 2 mais o polimento.

- **Estudo:** trilha de hiragana, katakana e kanji N5, lições em três passos (conhecer, escrever, testar), escrita com o dedo conferida por geometria e revisão espaçada com modo "write".
- **Ouvir:** guia de sons, treino de ouvido e Repetir (shadowing).
- **Frases:** gramática, montar frases e frases de viagem.
- **Teclado:** guia, simulador de flick e desafios.
- **Início:** painel de constância e evolução. **Ajustes:** voz, importação de backup do protótipo, som e vibração.
- **Geral:** tela de carregamento com o Mochi, efeitos sonoros e vibração, temas claro e escuro.
