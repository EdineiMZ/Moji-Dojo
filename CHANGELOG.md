# Changelog

Cada versão do app tem uma entrada aqui. A política de versões (quando aumentar MAIOR, MENOR ou CORREÇÃO) está em `scripts/versioning.cjs`, e um teste falha se a versão, o `versionCode` e este arquivo divergirem. Para uma versão nova: `npm run version:bump -- <patch|minor|major>`.

## [1.5.0] - 2026-10-23

Fase 3 do [ROADMAP](ROADMAP.md): montar e produzir frases. A aba Frases agora tem doze seções.

- **Leitura ajustável:** romaji e furigana sempre, só ao toque ou nunca (Ajustes → Leitura das frases), e frases da gramática escritas com kanji.
- **Traduzir:** do japonês (escolhendo entre quatro opções ou em resposta livre) e do português para o japonês, digitando com o teclado de flick do app ou o do celular. A conferência aceita kana ou kanji e ignora espaços e pontuação.
- **Minhas frases:** escreva frases sobre a sua vida; o app guarda, edita e revisa com repetição espaçada, pedindo para escrever de memória. Entram no backup.
- **Montar evoluído:** ao errar, "O que mudou" explica a causa (partícula trocada, final do verbo, bloco que sobra ou falta, ordem) e lista as outras ordens que valem. Novo modo "Qual está certa?" com frases parecidas e a explicação de cada erro.
- **Banco de frases:** cerca de 1.600 frases reais do Tatoeba (CC BY 2.0 FR) com tradução, filtradas pelas palavras que você já aprendeu (que eu sei ler, uma palavra nova, qualquer uma). Dá para ouvir, praticar e salvar em Minhas frases.
- **Diálogos:** quatro cenas (restaurante, loja, estação, hotel) em que você escolhe a fala certa em cada turno, com o motivo de cada erro, e no fim escreve as suas falas de memória.
- **Pendências para publicar:** o corte das frases em palavras é automático e pode errar; as falas do atendente, os motivos dos diálogos e as explicações do Montar foram escritos por IA e precisam de revisão por um falante.

## [1.4.0] - 2026-10-23

Fase 2 do [ROADMAP](ROADMAP.md): gramática ativa. A aba Frases agora tem sete seções (os chips rolam na horizontal).

- **Conjugar:** treinador de conjugação com cerca de 110 verbos do vocabulário. Aprenda 3 por vez e treine as formas ます, ない, て e た (geradas por regra, com os grupos 1, 2 e os irregulares). As respostas erradas são os erros típicos (regra de outro grupo, final de て errado) e a revisão é espaçada por verbo e forma.
- **Lacunas:** frases com um espaço para a partícula certa (は, を, に, で, の, も, と, が, から, まで, より) ou para a forma do final da frase, com a tradução embaixo e a regra ao errar.
- **Gramática de 10 para 30 tópicos:** 20 tópicos novos (でした/ではありません, adjetivos no negativo e no passado, 〜てください, 〜ています, 〜ないでください, 〜てもいい, 〜てはいけません, 〜ましょう/ませんか, ほしい, より, いちばん, すき/じょうず, から/まで, から (motivo), palavras interrogativas, もう/まだ, posições, になる, できる). As explicações são originais e os exemplos são 80 frases reais do Tatoeba (CC BY 2.0 FR), conferidas na fonte com `npm run verify-grammar`.
- **Praticar:** os exemplos novos viraram 59 exercícios de Montar e de Lacunas.
- **Contar:** números de 1 a 99.999, horas, datas, preços e 11 contadores, gerados por regra, em dois modos (ler e ouvir), com tabela de consulta.
- **Erros comuns de quem fala português:** 10 dicas gerais e notas em 28 dos 30 tópicos (ordem das palavras, sujeito omitido, sem artigos, を não é "o"...).
- **Mini-teste por tópico:** até 5 perguntas sem a explicação à vista; 80% de acertos de primeira marcam o tópico como dominado (✓ na lista e contador no topo).
- **Backup:** o código `MDJ1:` inclui a conjugação e os tópicos dominados; códigos antigos continuam valendo.
- **Pendências para publicar:** as explicações, as notas de erros comuns e as traduções do vocabulário foram escritas por IA e precisam de revisão por um falante; o crédito do Tatoeba está em Ajustes → Sobre e em `src/content/LICENSE.md`.

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
