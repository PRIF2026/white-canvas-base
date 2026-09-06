# CGS

Crie um sistema web responsivo chamado “PROJETO 7 CORES – CGS”, desenvolvido para administrar uma promoção comercial de uma ONG, cujo objetivo é aumentar as vendas de produtos de perfumaria, fidelizar clientes e gerar benefícios aos consumidores.

O conceito da promoção é simples:

Cada produto de perfumaria participante recebe um selo numerado de 1 a 7, de acordo com a faixa de preço do produto. Cada número representa uma quantidade de pontos.

========================

1. IDENTIDADE DO PROJETO

========================

Nome: PROJETO 7 CORES

Sigla: CGS

Slogan: “COMPRE E GANHE SEMPRE”

A identidade visual deve utilizar as 7 cores correspondentes aos números:

1 – Vermelho

2 – Laranja

3 – Amarelo

4 – Verde

5 – Ciano/Azul-claro

6 – Azul

7 – Roxo

O sistema deve possuir uma aparência moderna, profissional, intuitiva e agradável, utilizando essas sete cores de forma organizada, sem poluir visualmente a interface.

A ONG responsável pelo projeto é a ONG FARMACÊUTICA.

========================

2. FAIXAS DE PREÇO E PONTUAÇÃO

========================

Cada produto recebe um número de 1 a 7 conforme seu preço:

1 = R$ 1,00 até R$ 2,99

2 = R$ 3,00 até R$ 4,99

3 = R$ 5,00 até R$ 6,99

4 = R$ 7,00 até R$ 8,99

5 = R$ 9,00 até R$ 10,99

6 = R$ 11,00 até R$ 12,99

7 = acima de R$ 13,00

O número correspondente à faixa de preço será considerado a pontuação daquele produto.

Exemplo:

Um sabonete vendido por R$ 1,30 recebe o número 1.

Um shampoo vendido por R$ 5,20 recebe o número 3.

Portanto, cada produto participante deve possuir automaticamente um “selo correspondente” de acordo com seu preço.

========================

3. OBJETIVO DO CLIENTE

========================

O cliente deve acumular 50 pontos.

Ao atingir 50 pontos, ele estará habilitado a participar do benefício/prêmio correspondente ao sistema.

O sistema deve possuir uma “CARTEIRA PROGRAMADA” para cada cliente, permitindo acompanhar:

- Nome do cliente

- CPF ou identificador

- Número da carteira

- Data de cadastro

- Pontos acumulados

- Pontos restantes para chegar a 50

- Produtos adquiridos

- Valor de cada produto

- Número/selo de cada produto

- Data da compra

- Data programada para participação

- Histórico de pontos

- Situação da carteira

Criar uma barra de progresso visual mostrando:

0 / 50 pontos

10 / 50 pontos

25 / 50 pontos

40 / 50 pontos

50 / 50 pontos

Ao atingir 50 pontos, destacar a carteira como “META ATINGIDA”.

========================

4. CARTELA PROGRAMADA

========================

O cliente receberá uma cartela onde serão colocados os selos correspondentes aos produtos adquiridos.

Cada selo deve possuir um número de 1 a 7.

O sistema deve permitir registrar digitalmente cada selo colocado na cartela.

A cartela somente poderá participar do sorteio quando possuir pelo menos 15 pontos.

Entretanto, o objetivo normal da promoção é atingir 50 pontos.

O sistema deve permitir que o cliente participe utilizando a “Cartela Programada”.

No sistema, o cliente poderá sortear uma data, mesmo que ainda não tenha completado 50 pontos.

Quando a data sorteada chegar:

- verificar a pontuação da cartela;

- verificar se a cartela está válida;

- verificar se possui pelo menos 15 pontos;

- verificar o número sorteado;

- verificar o valor correspondente àquele dia;

- registrar o resultado.

Se o cliente não apresentar a cartela no dia exato do sorteio, perderá o prêmio referente àquela data e os selos/cartela deverão ser considerados descartados conforme as regras da promoção.

========================

5. SORTEIO DOS DIAS DO MÊS

========================

Cada dia do mês possui um valor em dinheiro.

O sistema deverá possuir uma tabela configurável com os valores de cada dia.

Exemplo de valores:

Dia 1 – R$ 250,00

Dia 2 – R$ 32,00

Dia 3 – R$ 148,00

Dia 4 – R$ 935,00

Dia 5 – R$ 720,00

Dia 6 – R$ 400,00

Dia 7 – R$ 97,00

Dia 8 – R$ 1.125,00

Dia 9 – R$ 129,00

Dia 10 – R$ 78,00

Dia 11 – R$ 167,00

Dia 12 – R$ 222,00

Dia 13 – R$ 104,00

Dia 14 – R$ 820,00

Dia 15 – R$ 504,00

Dia 16 – R$ 200,00

Dia 17 – R$ 100,00

Dia 18 – R$ 412,00

Dia 19 – R$ 197,00

Dia 20 – R$ 70,00

Dia 21 – R$ 95,00

Dia 22 – R$ 111,00

Dia 23 – R$ 573,00

Dia 24 – R$ 1.300,00

Dia 25 – R$ 166,00

Dia 26 – R$ 308,00

Dia 27 – R$ 255,00

Dia 28 – R$ 77,00

Dia 29 – R$ 61,00

Dia 30 – R$ 600,00

Dia 31 – R$ 354,00

IMPORTANTE:

O sistema deve permitir alterar esses valores através do painel administrativo.

Nos meses com 28 dias, o dia 29, 30 e 31 não devem existir.

Nos meses com 30 dias, o dia 31 não deve existir.

========================

6. MECANISMO DO BINGO

========================

O sistema deverá possuir um módulo chamado “BINGO”.

O bingo será composto por números correspondentes aos dias do calendário.

O cliente sorteia um número.

Exemplo:

O cliente sorteou o número 15.

O número 15 corresponde ao dia 15 do mês seguinte.

Se o dia 15 estiver configurado com prêmio de R$ 504,00, esse será o valor do prêmio.

O sistema deverá registrar:

- Cliente

- Número sorteado

- Data do sorteio

- Dia correspondente

- Mês de referência

- Valor do prêmio

- Status do prêmio

- Data prevista para pagamento

- Data efetiva de pagamento

O sistema deverá impedir duplicidade ou inconsistência no controle dos sorteios.

========================

7. REGRA DO PRÊMIO

========================

Quando o número for sorteado, o sistema deverá localizar automaticamente o valor correspondente ao dia.

Exemplo:

Número sorteado: 15

Dia correspondente: 15

Valor: R$ 504,00

O prêmio deverá ser dividido pelo número de cartelas premiadas daquele dia, conforme a regra da promoção.

O sistema deverá calcular automaticamente essa divisão.

========================

8. FONTE DE RECEITA

========================

Criar um módulo administrativo chamado “FONTE DE RECEITA”.

As regras são:

1. 10% de todas as vendas dos artigos de perfumaria realizadas no dia serão destinadas ao prêmio do mesmo dia do mês posterior.

2. Caso a ONG FARMACÊUTICA possua mais de uma loja/filial, todas as vendas de artigos de perfumaria realizadas nas filiais naquele dia deverão ser somadas.

3. Ao adquirir 4 ou mais unidades do mesmo produto na mesma compra, deverá ser computada somente uma pontuação/selo para aquele produto.

4. A cartela deve possuir no mínimo um somatório de R$ 35,00 em produtos para determinadas regras de participação.

O sistema deverá permitir controlar e auditar todas essas informações.

========================

9. CADASTRO DE PRODUTOS

========================

Criar cadastro completo de produtos:

- Código

- Código de barras

- Nome

- Marca

- Categoria

- Preço

- Faixa de preço

- Número do selo

- Cor do selo

- Pontuação

- Quantidade disponível

- Loja/filial

- Status

O número do selo deve ser calculado automaticamente pelo preço.

Exemplo:

Produto: Creme dental

Preço: R$ 2,00

Selo: 1

Pontuação: 1

Produto: Produto de R$ 19,60

Selo: 7

Pontuação: 7

========================

10. CONTROLE DE VENDAS

========================

Criar módulo de vendas.

Registrar:

- Data

- Hora

- Loja

- Funcionário

- Cliente

- Produto

- Quantidade

- Valor unitário

- Valor total

- Número do selo

- Pontuação gerada

O sistema deverá calcular automaticamente os pontos.

Também deverá aplicar a regra:

Se o cliente comprar 4 ou mais unidades do mesmo produto na mesma compra, contabilizar apenas um selo/pontuação para aquele produto.

========================

11. CARTELA DIGITAL

========================

Criar uma representação visual da cartela.

A cartela deverá mostrar os selos de 1 a 7 em suas respectivas cores.

Exemplo:

[1] [2] [3] [4] [5] [6] [7]

Cada selo registrado deverá aparecer na cartela.

Mostrar:

Pontos acumulados

Pontos restantes

Quantidade de selos

Data de criação

Data sorteada

Status

Estados possíveis:

- Em andamento

- Pronta para sorteio

- Sorteada

- Premiada

- Prêmio recebido

- Expirada

- Cancelada

========================

12. CALENDÁRIO

========================

Criar um calendário visual do mês.

Cada dia deverá mostrar:

- Número do dia

- Valor do prêmio

- Status

- Se já houve sorteio

- Quantidade de cartelas premiadas

- Valor disponível

- Valor distribuído

Utilizar cores para facilitar a visualização.

========================

13. PAINEL ADMINISTRATIVO

========================

Criar um dashboard administrativo com indicadores:

- Vendas do dia

- Vendas do mês

- Total de clientes

- Cartelas ativas

- Cartelas com 50 pontos

- Pontos distribuídos

- Prêmios disponíveis

- Prêmios pagos

- Valor arrecadado

- Valor destinado aos prêmios

- Quantidade de sorteios

- Quantidade de premiados

Criar gráficos para:

- Vendas por dia

- Vendas por filial

- Produtos mais vendidos

- Pontos gerados

- Prêmios pagos

- Receita destinada aos prêmios

========================

14. CONTROLE DE CLIENTES

========================

Cadastro:

- Nome

- CPF

- Telefone

- E-mail

- Data de nascimento

- Endereço

- Número da carteira

- Pontuação atual

- Histórico de compras

- Histórico de sorteios

- Histórico de prêmios

Permitir pesquisar clientes pelo nome, CPF ou número da carteira.

========================

15. CONTROLE DE PRÊMIOS

========================

Criar módulo de pagamento dos prêmios.

Cada prêmio deverá possuir:

- Cliente

- Cartela

- Número sorteado

- Dia correspondente

- Valor original

- Quantidade de ganhadores

- Valor individual

- Data do sorteio

- Data de pagamento

- Status

Status:

- Aguardando apresentação

- Aguardando pagamento

- Pago

- Cancelado

- Expirado

========================

16. REGRAS E ALERTAS

========================

O sistema deverá impedir erros automaticamente.

Exemplos:

- Não permitir registrar selo sem produto válido.

- Não permitir alterar pontuação manualmente sem autorização administrativa.

- Não permitir sorteio com cartela inválida.

- Alertar quando a cartela atingir 50 pontos.

- Alertar quando o cliente atingir o mínimo de 15 pontos.

- Alertar sobre prêmios pendentes.

- Alertar sobre cartelas próximas da data do sorteio.

- Impedir pagamento duplicado.

- Registrar log de todas as alterações administrativas.

========================

17. RELATÓRIOS

========================

Criar relatórios para:

- Vendas

- Clientes

- Produtos

- Pontos

- Cartelas

- Sorteios

- Premiações

- Pagamentos

- Receita

- Receita por filial

- Produtos por faixa de preço

- Quantidade de selos 1 a 7

- Desempenho da promoção

Todos os relatórios deverão permitir filtros por:

- Data

- Cliente

- Loja

- Produto

- Número do selo

- Situação

- Período

Permitir exportação para PDF e Excel.

========================

18. INTERFACE

========================

A interface deve ser moderna, profissional e extremamente intuitiva.

Utilizar cards, ícones, gráficos, tabelas e indicadores.

A identidade principal deverá utilizar as sete cores:

1 vermelho

2 laranja

3 amarelo

4 verde

5 ciano

6 azul

7 roxo

O número 1 sempre deverá utilizar vermelho.

O número 2 sempre deverá utilizar laranja.

O número 3 sempre deverá utilizar amarelo.

O número 4 sempre deverá utilizar verde.

O número 5 sempre deverá utilizar ciano.

O número 6 sempre deverá utilizar azul.

O número 7 sempre deverá utilizar roxo.

Criar uma experiência visual semelhante a um sistema profissional de gestão de promoções comerciais.

========================

19. SEGURANÇA

========================

Criar diferentes níveis de acesso:

ADMINISTRADOR

- Acesso total.

GERENTE

- Produtos

- Vendas

- Clientes

- Cartelas

- Relatórios

OPERADOR

- Cadastro de clientes

- Registro de vendas

- Registro de selos

FINANCEIRO

- Prêmios

- Pagamentos

- Receita

- Relatórios financeiros

Cada usuário deverá possuir login e senha.

Registrar logs de operações importantes.

========================

20. REGRA FUNDAMENTAL

========================

O sistema deve separar claramente:

VENDA → PRODUTO → SELO → PONTOS → CARTELA → SORTEIO → PRÊMIO → PAGAMENTO.

Toda a lógica deve ser automatizada para reduzir erros humanos.

O administrador deverá conseguir configurar preços, produtos, valores dos dias, filiais, usuários e regras da promoção sem precisar alterar o código do sistema.

Criar banco de dados estruturado e preparado para múltiplas lojas/filiais.

O sistema deve ser responsivo e funcionar perfeitamente em computador, tablet e celular.

Criar primeiro uma versão visual completa do sistema, com dashboard, cadastro de produtos, clientes, vendas, cartelas, bingo, calendário, sorteios, prêmios, pagamentos, fonte de receita e relatórios.

A aparência deve transmitir confiança, organização, inovação e uma forte identidade visual baseada nas 7 cores do projeto.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://seven-hues-win.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/06278bd3-e329-45dc-96d4-9b328bf36103).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
