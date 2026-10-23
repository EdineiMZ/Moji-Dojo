# Changelog

Cada versão do app tem uma entrada aqui. A política de versões (quando aumentar MAIOR, MENOR ou CORREÇÃO) está em `scripts/versioning.cjs`, e um teste falha se a versão, o `versionCode` e este arquivo divergirem. Para uma versão nova: `npm run version:bump -- <patch|minor|major>`.

## [1.3.0] - 2026-10-23

Fecha o vocabulário da Fase 1 do [ROADMAP](ROADMAP.md): de 179 para **837 palavras**.

- **Lista JLPT N5:** 658 palavras novas (a lista tem 700; 42 já existiam), com leitura, significado em português, assunto e ordem de estudo pelas lições do Genki. Aprenda por assunto: verbos, adjetivos, comida e bebida, roupas e compras, transporte e viagem, expressões e outros.
- **Traduções:** os significados foram traduzidos do inglês para o português e **ainda não foram revisados por um falante**; o original em inglês fica guardado no dado para conferência.
- **Créditos e licença:** Ajustes → Sobre cita a fonte, e `src/content/LICENSE.md` documenta origem, alterações e a lista "Antes de publicar" (as licenças não foram validadas: uso pessoal por enquanto).
- **Projeto:** `npm run build-n5` regenera `src/content/n5.ts` a partir do CSV e das traduções; a limpeza do CSV tem testes.

## [1.2.0] - 2026-10-22

Primeira parte da Fase 1 do [ROADMAP](ROADMAP.md): vocabulário.

- **Palavras:** nova sub-aba em Frases. Aprenda 5 palavras por vez, por assunto (cartão com leitura, romaji, significado, kanji da palavra e som), pratique na hora e revise os cartões vencidos.
- **Revisão espaçada por palavra:** cada palavra vira cartões (japonês → significado, significado → japonês e, nas palavras só de kana, ouvir → palavra), com as mesmas caixas dos caracteres e progresso guardado à parte.
- **Vocabulário inicial:** 179 palavras que já vinham da especificação (exemplos de kana e kanji e palavras do simulador). Nenhuma palavra nova foi inventada; a ampliação para centenas de palavras depende de uma fonte aberta com licença conferida.
- **Kanji:** o passo Conhecer mostra "também aparece em" com outras palavras que usam o kanji.
- **Backup:** o código `MDJ1:` inclui o vocabulário; códigos antigos continuam valendo.
- **Quiz:** o enunciado ajusta o tamanho do texto ao comprimento da palavra.

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
