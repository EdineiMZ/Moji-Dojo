# Sistema de design do Moji Dojo

Regras curtas para que as telas novas nasçam consistentes. Tudo vem de `src/theme` e `src/components`; não use números soltos.

## Espaçamento e cantos

| Token | Valor | Uso |
|---|---|---|
| `spacing.xs` | 4 | folga entre título e legenda |
| `spacing.sm` | 8 | entre botões e itens de lista |
| `spacing.md` | 12 | dentro de cartões, entre linhas de um formulário |
| `spacing.lg` | 16 | margem lateral das telas, entre cartões |
| `spacing.xl` / `xxl` | 24 / 32 | blocos grandes |
| `radii.md` / `lg` / `xl` / `pill` | 16 / 24 / 32 / 999 | linhas de lista, cartões, destaques, chips |

## Tipografia (`AppText`)

`headline` para o título da tela (um por tela), `title` para o título de um cartão ou linha, `body` para o texto, `caption` para apoio e legendas. Texto de apoio usa `color="muted"`. Frase longa de explicação **não** fica solta no cartão: uma linha à vista e o resto em `LearnMore` ("Saiba mais").

## Botões (`Button`)

Um **primário** por tela (a ação que a pessoa mais quer). O resto é `soft` (alternativas) ou `ghost` (cancelar, voltar, ações raras). Ação que apaga dados vai com confirmação.

## Escolhas

- Poucas opções (até uns 6): `ChipRow wrap` (mostra tudo de uma vez) ou `SegmentedControl`.
- Muitas opções de navegação (abas de conteúdo): `ChipRow` que rola, que avisa com seta e névoa quando há mais.
- Liga/desliga: `Switch` com `accessibilityLabel`.

## Listas e áreas

Uma tela com várias áreas usa `ListRow`: ícone, título, **resumo do estado** (uma linha) e seta. Cada área abre numa tela própria (ver `src/features/settings/areas.ts`). Seções raras ficam em `Collapsible`.

## Estados

| Estado | Como mostrar |
|---|---|
| Carregando | `AppText color="muted"` com reticências ("Verificando…"); botão desabilitado com o verbo no gerúndio |
| Vazio | uma frase que diz o que fazer ("Nenhuma voz baixada. Baixe uma abaixo."), nunca uma tela em branco |
| Erro | `color="bad"` e `accessibilityLiveRegion="polite"`, dizendo o que aconteceu e o que tentar |
| Sucesso | selo `✓` em `color="primary"` ou `ok`; nada de diálogo para confirmar o que deu certo |

## Texto

Frases humanas, em português, sem nome técnico na frente da pessoa (identificadores de voz, caminhos, códigos de erro vão para **Ajustes → Avançado**). Nunca peça captura de tela ao usuário.

## Acessibilidade

- Alvo de toque de pelo menos 48 dp (`minHeight: 48`), com `hitSlop` quando o visual for menor.
- Todo botão sem texto tem `accessibilityLabel`; a linha de lista junta título e resumo no rótulo.
- Estado de aberto/fechado e de escolhido em `accessibilityState`.
- Cor nunca é o único sinal (use também `✓`, texto ou borda).
