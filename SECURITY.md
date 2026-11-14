# Política de segurança

## Versões que recebem correção

Só a **última versão** publicada em [Releases](https://github.com/EdineiMZ/Moji-Dojo/releases/latest) recebe correções de segurança. O app avisa quando sai uma versão nova (Ajustes → Avançado → Atualizações).

## Como relatar uma falha

**Não abra uma issue pública** para uma vulnerabilidade. Use o relato privado do GitHub:

1. Abra a aba **[Security](https://github.com/EdineiMZ/Moji-Dojo/security)** do repositório.
2. Escolha **Report a vulnerability** (relato privado de vulnerabilidade).
3. Descreva o problema, como reproduzir e o que um atacante conseguiria.

Responderei assim que puder; é um projeto pessoal, então não prometo prazo, mas toda falha real é levada a sério e quem relatar recebe o crédito, se quiser.

## O que interessa

- Vazamento de dados do aluno (progresso, nome, chaves de IA) para fora do aparelho.
- A checagem de atualização abrir ou baixar algo que não seja do repositório oficial.
- Execução de código por um backup, um link ou um arquivo importado.
- Segredos publicados por engano no repositório.

## Bom saber

- Os dados de estudo ficam **só no aparelho**. A chave de IA, se você usar o recurso, fica no armazenamento seguro do Android e **fora do backup**.
- O app faz uma consulta anônima por dia ao GitHub para saber se há versão nova (dá para desligar). O recurso de IA, se ligado por você, envia o texto do exercício ao provedor que você escolheu, com a sua chave.
- Os APKs das Releases são assinados com a **chave de depuração padrão do Android**, e não com uma chave privada do projeto. Confira sempre o **SHA-256** nas notas da versão e baixe só desta página.
