# Validação das traduções (japonês → português)

Feita na versão 1.16.0, no computador, com modelos abertos (`scripts/validate-translations/`). Nada disso roda no app e nenhum texto dos modelos entra nele.

## Como funciona

1. **LaBSE** (Google, Apache-2.0) transforma o japonês e o português em vetores e mede o quanto "dizem a mesma coisa". A **nota de margem** (Artetxe e Schwenk, 2019) compara o par com os vizinhos mais parecidos, e é mais confiável que um limite fixo de similaridade.
2. **NLLB-200 distilled 600M** (Meta, CC-BY-NC 4.0, só para conferir) traduz o japonês para o português, e a tradução dele é comparada com a do app.

Os dois **apontam suspeitas**. Nota baixa não prova erro, e nota alta não prova que o japonês está certo. Quem decide é um falante.

## Banco de frases do Explorar (30.000 frases)

- A nota de margem separou bem as ruins: no 1% mais baixo estão pares claramente desencontrados ("何してるの？" = "O que faremos?", "なにちんたら歩いてんだ。" = "Avante!", "ちゃんと座ってろ。" = "Peraí.") e **traduções livres** de provérbios e expressões ("痘痕も靨。" = "O amor é cego.").
- **1.475 frases (5%) com margem abaixo de 0,8 foram tiradas do banco**; ficaram 28.525. Os números das tiradas estão em `scripts/validate-translations/removed-ids.json`. Para um aluno, uma tradução livre confunde mais do que ajuda.
- Limites: o corte de 0,8 é uma escolha (a mediana é 1,05). Abaixo dele há erros e há traduções livres corretas; acima dele ainda pode haver frases erradas (o que o modelo não vê). O NLLB só foi rodado nas 1.200 de menor nota.

## Frases escritas por IA (viagem, atendente, moldes, leituras): 403 pares

- **O teste não serve para elas.** Os dois modelos funcionam mal com frases curtas escritas só em kana e separadas por espaços: o NLLB devolveu lixo em vários casos ("Não, não, não…") e as notas ficaram baixas mesmo para traduções certas (por exemplo, "せんごひゃくえん です" = "São 1.500 ienes" ficou com 0,26).
- Por isso o resultado foi lido à mão: entre as 45 de menor nota (li as traduções de cerca de metade com atenção), nenhuma tinha tradução errada (por exemplo, "ごちゅうもんは おきまり ですか" = "Já decidiu o pedido?", "しゅうでんは なんじ ですか" = "Que horas é o último trem?", "わりかんで おねがいします" = "Dividir a conta, por favor").
- **Conclusão:** a conferência dessas frases continua sendo a do 1.14.1 (Tatoeba, Wikivoyage, JMdict) e a revisão por um falante segue pendente.

## O que ainda dá para fazer

- Rodar o NLLB no banco inteiro (cerca de 8 horas num PC sem GPU) para pegar mais discordâncias.
- Para as frases escritas por IA, escrevê-las também com kanji antes de testar (o NLLB entende bem melhor), ou usar uma tradução automática de outra fonte como segunda opinião.
- Um falante de japonês revisando os 400 pares e uma amostra do banco.
