# Conferência do japonês do app

O japonês das frases de viagem, das falas do atendente e dos moldes foi escrito por IA. Esta conferência procura respaldo em fontes abertas
e diz o que já foi confirmado e o que ainda precisa de um falante. Gerada por `node scripts/verify-japanese/confirm.mjs <pasta>`.

## Fontes

- **Tatoeba** (frases de falantes, CC BY 2.0 FR): 249 mil frases em japonês. Cada frase do app é procurada escrita em kana e com kanji
  (as grafias comuns vêm do JMdict). "Frase confirmada" = ela aparece inteira em uma frase do Tatoeba. "Construção confirmada" = só o
  fecho dela aparece (a frase sem o primeiro bloco, que é a palavra trocável).
- **Wikivoyage** (guia de frases em inglês, CC BY-SA 4.0): as frases básicas de viagem (ver `wikivoyage.txt`).
- **JMdict** (EDRDG, CC BY-SA 4.0): todas as palavras das frases existem no dicionário (as únicas fora são conjugações, nomes próprios e
  compostos), e **59 dos 62** pares kanji + leitura dos textos de placas e cardápios conferem exatamente (os outros 3 são um nome
  próprio, um composto e uma conjugação, todos corretos).
- Buscas na web para as construções menos comuns (ônibus que "para" na estação, "qual plataforma", pedido de mais uma noite no hotel).

## Resultado

| Tipo | Frase confirmada | Construção confirmada | Sem confirmação |
| --- | ---: | ---: | ---: |
| Frases de viagem (do protótipo) | 22 | 7 | 8 |
| Frases de viagem e dia a dia (escritas por IA) | 80 | 39 | 32 |
| Falas do atendente nos diálogos (escritas por IA) | 15 | 5 | 13 |
| Frases-modelo (escritas por IA) | 45 | 53 | 9 |

"Sem confirmação" **não quer dizer errada**: quer dizer que nenhuma fonte aberta tinha a frase. Foi lida uma a uma por quem fez a conferência
(IA) e todas são japonês corrente. Mas só um falante pode dar o selo final. No app, cada frase mostra uma linha com o estado dela.

As **traduções em português** e o "palavra por palavra" não foram conferidos contra fonte externa (só lidos); as das frases do Tatoeba e da
Wikivoyage têm o sentido confirmado pelas fontes.

## Ainda sem confirmação em fontes (para revisão por um falante)

### Frases de viagem (do protótipo)

- はい / いいえ — Sim / não
- カードで はらえますか — Posso pagar com cartão?
- この でんしゃは しんじゅくに いきますか — Este trem vai para Shinjuku?
- つぎの えきは なんですか — Qual é a próxima estação?
- よやくして います — Tenho reserva
- にもつを あずかって もらえますか — Pode guardar minha bagagem?
- ワイファイの パスワードは なんですか — Qual é a senha do Wi-Fi?
- みちに まよいました — Estou perdido

### Frases de viagem e dia a dia (escritas por IA)

- にほんごは すこし だけ はなせます — Só falo um pouco de japonês
- これは にほんごで なん ですか — Como se diz isto em japonês?
- さんにん です — Somos três
- これを ひとつ ください — Um destes, por favor
- ベジタリアンの りょうりは ありますか — Tem pratos vegetarianos?
- もっと おおきい のは ありますか — Tem um maior?
- もっと ちいさい のは ありますか — Tem um menor?
- ほかの いろは ありますか — Tem outra cor?
- なんばんせん ですか — Qual é a plataforma?
- アイシーカードに チャージ したい です — Quero carregar o meu cartão IC (faça nas máquinas de bilhete)
- この バスは えきに とまりますか — Este ônibus para na estação?
- タオルを もう ひとつ ください — Mais uma toalha, por favor
- へやを かえて もらえますか — Pode trocar de quarto?
- となりが うるさい です — O vizinho do lado está barulhento
- もう いっぱく したい です — Quero ficar mais uma noite
- タクシーを よんで もらえますか — Pode chamar um táxi para mim?
- わたしの なまえは ジョアン です — Meu nome é João (troque pelo seu)
- あつい ですね — Está calor, né?
- パスポートを どうぞ — Aqui está o meu passaporte
- いっしゅうかん ほど います — Vou ficar cerca de uma semana
- にもつは どこで うけとれますか — Onde posso retirar a bagagem?
- にもつが みつかりません — Não encontro a minha bagagem
- リムジンバスは どこから のれますか — De onde sai o ônibus do aeroporto?
- ちずに かいて もらえますか — Pode desenhar no mapa para mim?
- この じゅうしょは どこ ですか — Onde fica este endereço?
- この カードで おろせますか — Dá para sacar com este cartão?
- こまかい おかねは ありますか — Tem trocado?
- ネットが つながりません — A internet não conecta
- スマホの でんちが きれました — A bateria do celular acabou
- ここで じゅうでん できますか — Posso carregar o celular aqui?
- スマホを おとしました — Deixei cair / perdi o meu celular
- おとな ひとり おねがいします — Um adulto, por favor

### Falas do atendente nos diálogos (escritas por IA)

- いらっしゃいませ なんめいさま ですか — Bem-vindo! Quantas pessoas?
- こちらへ どうぞ おのみものは いかが ですか — Por aqui, por favor. Aceita algo para beber?
- いらっしゃいませ なにか おさがし ですか — Bem-vindo! Está procurando algo?
- せんごひゃくえん です — São 1.500 ienes.
- ふくろは ごりよう ですか — Vai querer sacola?
- きっぷは あそこの きかいで かえます — Os bilhetes se compram naquela máquina ali.
- はい しんじゅくに いきます — Sim, vai para Shinjuku.
- せんはっぴゃくえん です — São 1.800 ienes.
- いらっしゃいませ ふくろは ごりよう ですか — Bem-vindo! Vai querer sacola?
- おはしは おつけ しますか — Quer que eu coloque pauzinhos (hashi)?
- ポイントカードは おもち ですか — Tem cartão de pontos?
- あそこの かどを みぎに まがって ください — Vire à direita naquela esquina.

### Frases-modelo (escritas por IA)

- おおきい ですね — Está grande, né?
- クレジットカードで はらえますか — Posso pagar com cartão de crédito?
- げんきんで はらえますか — Posso pagar com dinheiro vivo?
- アイシーカードで はらえますか — Posso pagar com cartão IC?
- スマホで はらえますか — Posso pagar com o celular?
- デビットカードで はらえますか — Posso pagar com cartão de débito?
