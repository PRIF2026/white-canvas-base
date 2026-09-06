# Corrigir persistência e relatórios do CGS

## Objetivo
Substituir os dados demonstrativos em memória pelo banco já criado, para que clientes, produtos, vendas, selos e sorteios sejam realmente salvos e reapareçam nas demais telas.

## Implementação
- Criar uma camada compartilhada de leitura e gravação para clientes, produtos, lojas, vendas, selos e sorteios.
- Carregar os dados reais nas telas **Controle de clientes**, **Produtos**, **Vendas**, **Cartelas**, **Bingo** e **Relatórios**, com estados de carregamento, vazio e erro.
- Ao registrar uma venda, gravar a venda e seus selos, atualizar pontos/valor gasto do cliente e estoque do produto de forma consistente no banco.
- Ao concluir o giro do bingo, gravar o sorteio e atualizar a cartela do cliente com modalidade, dia e data sorteada.
- Tornar todos os filtros de Relatórios funcionais e adaptar a tabela ao relatório selecionado.
- Trocar “Número da carteira” por “Número da cartela” na tela de clientes.

## Segurança e validação
- Manter acesso protegido pelas regras atuais do banco e exigir sessão autenticada para ler/gravar os dados administrativos.
- Validar gravações, exibir mensagens de sucesso/erro e atualizar as listas após cada operação.
- Verificar no navegador os fluxos públicos possíveis. Como a sessão de teste está desconectada, a validação autenticada ponta a ponta ficará marcada como não verificada até haver login ativo no preview.
