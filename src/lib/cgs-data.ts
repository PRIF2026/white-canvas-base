export type SeloNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const SELOS: { n: SeloNumber; nome: string; faixa: string; className: string; text: string }[] = [
  { n: 1, nome: "Vermelho", faixa: "R$ 1,00 – R$ 2,99", className: "bg-selo-1", text: "text-selo-1" },
  { n: 2, nome: "Laranja", faixa: "R$ 3,00 – R$ 4,99", className: "bg-selo-2", text: "text-selo-2" },
  { n: 3, nome: "Amarelo", faixa: "R$ 5,00 – R$ 6,99", className: "bg-selo-3", text: "text-selo-3" },
  { n: 4, nome: "Verde", faixa: "R$ 7,00 – R$ 8,99", className: "bg-selo-4", text: "text-selo-4" },
  { n: 5, nome: "Ciano", faixa: "R$ 9,00 – R$ 10,99", className: "bg-selo-5", text: "text-selo-5" },
  { n: 6, nome: "Azul", faixa: "R$ 11,00 – R$ 12,99", className: "bg-selo-6", text: "text-selo-6" },
  { n: 7, nome: "Roxo", faixa: "acima de R$ 13,00", className: "bg-selo-7", text: "text-selo-7" },
];

export function seloPorPreco(preco: number): SeloNumber {
  if (preco < 3) return 1;
  if (preco < 5) return 2;
  if (preco < 7) return 3;
  if (preco < 9) return 4;
  if (preco < 11) return 5;
  if (preco < 13) return 6;
  return 7;
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Formata datas para dd/mm/aaaa (aceita "2026-08-12" ou "2026-08-12 10:22"). */
export function dataBr(valor: string | null | undefined): string {
  if (!valor) return "—";
  const [dataParte, horaParte] = valor.trim().split(" ");
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataParte ?? "");
  if (!m) return valor;
  const base = `${m[3]}/${m[2]}/${m[1]}`;
  return horaParte ? `${base} ${horaParte}` : base;
}

export const META_PONTOS = 50;
/** Somatório mínimo em produtos da cartela comum (meta de 50 pontos). */
export const MINIMO_VALOR_CARTELA_PADRAO = 50;
/** Percentual das vendas destinado ao fundo de prêmios. */
export const PERCENTUAL_FUNDO = 0.1;
/** Mínimo acumulado no fundo (10% das compras) para a cartela programada. */
export const MINIMO_VALOR_CARTELA = 35;

export type ModoSorteio = "50-pontos" | "programada";

/** Valor acumulado no fundo de prêmios pelo cliente (10% do que ele gastou). */
export const fundoCliente = (valorGasto: number) => valorGasto * PERCENTUAL_FUNDO;

/** Elegibilidade: 50 pontos OU cartela programada (R$ 35,00 acumulados no fundo de 10%). */
export function elegibilidade(pontos: number, valorGasto: number) {
  return {
    meta: pontos >= META_PONTOS && valorGasto >= MINIMO_VALOR_CARTELA_PADRAO,
    programada: fundoCliente(valorGasto) >= MINIMO_VALOR_CARTELA,
  };
}

export function cartelaApta(pontos: number, valorGasto: number) {
  const e = elegibilidade(pontos, valorGasto);
  return e.meta || e.programada;
}

export type Produto = {
  codigo: string;
  ean: string;
  nome: string;
  marca: string;
  categoria: string;
  preco: number;
  estoque: number;
  loja: string;
};

export const LOJAS = ["Loja 1", "Loja 2", "Loja 3", "Loja 4"];

export const PRODUTOS: Produto[] = [
  { codigo: "P-001", ean: "7891000100101", nome: "Sabonete Erva Doce 90g", marca: "Flora", categoria: "Higiene", preco: 1.3, estoque: 420, loja: "Loja 1" },
  { codigo: "P-002", ean: "7891000100118", nome: "Creme Dental Menta 90g", marca: "OralPlus", categoria: "Higiene", preco: 2.0, estoque: 380, loja: "Loja 1" },
  { codigo: "P-003", ean: "7891000100125", nome: "Desodorante Roll-on 50ml", marca: "Puravita", categoria: "Perfumaria", preco: 4.2, estoque: 210, loja: "Loja 2" },
  { codigo: "P-004", ean: "7891000100132", nome: "Shampoo Cachos 350ml", marca: "Belle", categoria: "Cabelos", preco: 5.2, estoque: 160, loja: "Loja 1" },
  { codigo: "P-005", ean: "7891000100149", nome: "Condicionador Liso 350ml", marca: "Belle", categoria: "Cabelos", preco: 6.9, estoque: 145, loja: "Loja 3" },
  { codigo: "P-006", ean: "7891000100156", nome: "Hidratante Corporal 200ml", marca: "Derma7", categoria: "Corpo", preco: 8.4, estoque: 98, loja: "Loja 4" },
  { codigo: "P-007", ean: "7891000100163", nome: "Óleo Capilar Argan 60ml", marca: "Belle", categoria: "Cabelos", preco: 9.9, estoque: 74, loja: "Loja 1" },
  { codigo: "P-008", ean: "7891000100170", nome: "Protetor Solar FPS 50", marca: "Derma7", categoria: "Corpo", preco: 12.5, estoque: 62, loja: "Loja 2" },
  { codigo: "P-009", ean: "7891000100187", nome: "Perfume Floral 100ml", marca: "Essence", categoria: "Perfumaria", preco: 19.6, estoque: 40, loja: "Loja 4" },
  { codigo: "P-010", ean: "7891000100194", nome: "Colônia Cítrica 75ml", marca: "Essence", categoria: "Perfumaria", preco: 15.9, estoque: 55, loja: "Loja 3" },
  { codigo: "P-011", ean: "7891000100200", nome: "Talco Refrescante 100g", marca: "Flora", categoria: "Higiene", preco: 3.4, estoque: 190, loja: "Loja 3" },
  { codigo: "P-012", ean: "7891000100217", nome: "Sabonete Líquido 250ml", marca: "Flora", categoria: "Higiene", preco: 7.3, estoque: 133, loja: "Loja 1" },
];

export type StatusCartela =
  | "Em andamento"
  | "Pronta para sorteio"
  | "Sorteada"
  | "Premiada"
  | "Prêmio recebido"
  | "Expirada"
  | "Cancelada";

export type Cliente = {
  id: string;
  nome: string;
  associado: string;
  cpf: string;
  telefone: string;
  email: string;
  nascimento: string;
  endereco: string;
  carteira: string;
  cadastro: string;
  pontos: number;
  selos: SeloNumber[];
  selosDetalhe: { n: SeloNumber; data: string }[];
  status: StatusCartela;
  dataSorteada: string | null;
  numeroSorteado: number | null;
  valorGasto: number;
  /** Optou pela modalidade "cartela programada" no sorteio. */
  programada: boolean;
};

const selosFake = (pontos: number): SeloNumber[] => {
  const out: SeloNumber[] = [];
  let acc = 0;
  let i = 0;
  while (acc < pontos) {
    const n = ((i * 3 + 1) % 7 + 1) as SeloNumber;
    const v = Math.min(n, pontos - acc);
    out.push((v || 1) as SeloNumber);
    acc += v || 1;
    i++;
  }
  return out;
};

/** Datas de conquista dos selos, em ordem cronológica a partir do cadastro. */
const selosComData = (cadastro: string, selos: SeloNumber[]) => {
  const base = new Date(`${cadastro}T12:00:00`);
  return selos.map((n, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + (i + 1) * 6 + (i % 3));
    return { n, data: d.toISOString().slice(0, 10) };
  });
};

const mk = (
  id: string, nome: string, cpf: string, tel: string, email: string, nasc: string,
  end: string, carteira: string, cadastro: string, pontos: number,
  status: StatusCartela, dataSorteada: string | null, numeroSorteado: number | null, valorGasto: number,
): Cliente => {
  const selos = selosFake(pontos);
  return {
    id, nome, associado: `AS-${id.slice(1).padStart(4, "0")}`, cpf, telefone: tel, email,
    nascimento: nasc, endereco: end, carteira, cadastro, pontos, selos,
    selosDetalhe: selosComData(cadastro, selos), status, dataSorteada, numeroSorteado, valorGasto,
    programada: dataSorteada !== null && pontos < META_PONTOS,
  };
};

export const CLIENTES: Cliente[] = [
  mk("C1", "Maria Aparecida Souza", "123.456.789-01", "(11) 98812-4410", "maria.souza@email.com", "1982-03-14", "Rua das Acácias, 120 – Centro", "CGS-000123", "2026-01-12", 50, "Premiada", "2026-09-15", 15, 412.7),
  mk("C2", "João Batista Lima", "987.654.321-00", "(11) 99711-2233", "joao.lima@email.com", "1975-11-02", "Av. Brasil, 890 – Norte", "CGS-000124", "2026-02-03", 42, "Pronta para sorteio", "2026-09-24", 24, 361.2),
  mk("C3", "Ana Clara Ferreira", "456.789.123-22", "(11) 99120-8877", "ana.ferreira@email.com", "1994-06-27", "Rua Amazonas, 33 – Sul", "CGS-000125", "2026-02-19", 27, "Sorteada", "2026-09-08", 8, 214.9),
  mk("C4", "Carlos Eduardo Pinto", "321.654.987-45", "(11) 98444-1200", "carlos.pinto@email.com", "1988-09-09", "Rua Ipê, 501 – Centro", "CGS-000126", "2026-03-07", 15, "Pronta para sorteio", "2026-09-30", 30, 128.4),
  mk("C5", "Fernanda Ribeiro", "159.753.486-10", "(11) 98111-9090", "fernanda.r@email.com", "1991-12-21", "Av. das Nações, 77 – Shopping", "CGS-000127", "2026-03-22", 9, "Em andamento", null, null, 74.3),
  mk("C6", "Roberto Almeida", "753.951.852-33", "(11) 97777-3311", "roberto.a@email.com", "1969-04-05", "Rua Bahia, 15 – Norte", "CGS-000128", "2026-04-02", 50, "Prêmio recebido", "2026-08-04", 4, 505.0),
  mk("C7", "Juliana Martins", "852.741.963-77", "(11) 98555-6644", "juliana.m@email.com", "1999-08-30", "Rua Minas, 240 – Sul", "CGS-000129", "2026-04-18", 33, "Em andamento", "2026-10-12", 12, 268.8),
  mk("C8", "Paulo Henrique Dias", "741.852.963-08", "(11) 98222-1177", "paulo.dias@email.com", "1980-01-25", "Av. Central, 1000 – Centro", "CGS-000130", "2026-05-06", 6, "Em andamento", null, null, 51.1),
  mk("C9", "Beatriz Nogueira", "369.258.147-90", "(11) 99666-2020", "bia.n@email.com", "2000-02-11", "Rua Goiás, 60 – Shopping", "CGS-000131", "2026-05-27", 21, "Expirada", "2026-07-21", 21, 176.5),
  mk("C10", "Sérgio Tavares", "258.147.369-51", "(11) 98090-4545", "sergio.t@email.com", "1972-07-19", "Rua Ceará, 12 – Norte", "CGS-000132", "2026-06-14", 47, "Em andamento", null, null, 398.0),
];

export const VALORES_DIA_PADRAO: Record<number, number> = {
  1: 250, 2: 32, 3: 148, 4: 935, 5: 720, 6: 400, 7: 97, 8: 1125, 9: 129, 10: 78,
  11: 167, 12: 222, 13: 104, 14: 820, 15: 504, 16: 200, 17: 100, 18: 412, 19: 197,
  20: 70, 21: 95, 22: 111, 23: 573, 24: 1300, 25: 166, 26: 308, 27: 255, 28: 77,
  29: 61, 30: 600, 31: 354,
};

export type Sorteio = {
  id: string;
  cliente: string;
  carteira: string;
  numero: number;
  dataSorteio: string;
  mesReferencia: string;
  valorOriginal: number;
  ganhadores: number;
  statusPremio: "Aguardando apresentação" | "Aguardando pagamento" | "Pago" | "Cancelado" | "Expirado";
  previsaoPagamento: string;
  pagamento: string | null;
};

export const SORTEIOS: Sorteio[] = [
  { id: "S-1042", cliente: "Maria Aparecida Souza", carteira: "CGS-000123", numero: 15, dataSorteio: "2026-08-15", mesReferencia: "09/2026", valorOriginal: 504, ganhadores: 2, statusPremio: "Aguardando pagamento", previsaoPagamento: "2026-09-20", pagamento: null },
  { id: "S-1043", cliente: "João Batista Lima", carteira: "CGS-000124", numero: 24, dataSorteio: "2026-08-16", mesReferencia: "09/2026", valorOriginal: 1300, ganhadores: 4, statusPremio: "Aguardando apresentação", previsaoPagamento: "2026-09-29", pagamento: null },
  { id: "S-1044", cliente: "Ana Clara Ferreira", carteira: "CGS-000125", numero: 8, dataSorteio: "2026-08-01", mesReferencia: "09/2026", valorOriginal: 1125, ganhadores: 3, statusPremio: "Aguardando pagamento", previsaoPagamento: "2026-09-13", pagamento: null },
  { id: "S-1045", cliente: "Roberto Almeida", carteira: "CGS-000128", numero: 4, dataSorteio: "2026-07-04", mesReferencia: "08/2026", valorOriginal: 935, ganhadores: 1, statusPremio: "Pago", previsaoPagamento: "2026-08-09", pagamento: "2026-08-09" },
  { id: "S-1046", cliente: "Beatriz Nogueira", carteira: "CGS-000131", numero: 21, dataSorteio: "2026-06-21", mesReferencia: "07/2026", valorOriginal: 95, ganhadores: 1, statusPremio: "Expirado", previsaoPagamento: "2026-07-26", pagamento: null },
  { id: "S-1047", cliente: "Carlos Eduardo Pinto", carteira: "CGS-000126", numero: 30, dataSorteio: "2026-08-11", mesReferencia: "09/2026", valorOriginal: 600, ganhadores: 2, statusPremio: "Aguardando apresentação", previsaoPagamento: "2026-10-05", pagamento: null },
  { id: "S-1048", cliente: "Juliana Martins", carteira: "CGS-000129", numero: 12, dataSorteio: "2026-08-12", mesReferencia: "10/2026", valorOriginal: 222, ganhadores: 1, statusPremio: "Aguardando pagamento", previsaoPagamento: "2026-10-17", pagamento: null },
];

export type Venda = {
  id: string;
  data: string;
  hora: string;
  loja: string;
  funcionario: string;
  cliente: string;
  produto: string;
  qtd: number;
  unitario: number;
  selo: SeloNumber;
};

const vendasRaw: [string, string, string, string, string, string, number, number][] = [
  ["V-9001", "2026-08-12", "09:14", "Loja 1", "Renata Alves", "Maria Aparecida Souza", 2, 0],
  ["V-9002", "2026-08-12", "10:02", "Loja 2", "Diego Souza", "João Batista Lima", 1, 8],
  ["V-9003", "2026-08-12", "11:37", "Loja 3", "Camila Reis", "Ana Clara Ferreira", 5, 1],
  ["V-9004", "2026-08-12", "13:05", "Loja 4", "Tiago Lopes", "Fernanda Ribeiro", 1, 8],
  ["V-9005", "2026-08-11", "15:44", "Loja 1", "Renata Alves", "Sérgio Tavares", 3, 6],
  ["V-9006", "2026-08-11", "16:20", "Loja 2", "Diego Souza", "Paulo Henrique Dias", 4, 3],
  ["V-9007", "2026-08-11", "17:58", "Loja 3", "Camila Reis", "Juliana Martins", 1, 9],
  ["V-9008", "2026-08-10", "09:41", "Loja 4", "Tiago Lopes", "Beatriz Nogueira", 2, 5],
  ["V-9009", "2026-08-10", "12:12", "Loja 1", "Renata Alves", "Carlos Eduardo Pinto", 1, 11],
  ["V-9010", "2026-08-10", "18:31", "Loja 2", "Diego Souza", "Roberto Almeida", 6, 2],
];

export const VENDAS: Venda[] = vendasRaw.map(([id, data, hora, loja, func, cliente, qtd, pidx]) => {
  const p = PRODUTOS[pidx]!;
  return { id, data, hora, loja, funcionario: func, cliente, produto: p.nome, qtd, unitario: p.preco, selo: seloPorPreco(p.preco) };
});

/** Regra: a partir de 3 unidades iguais na mesma compra/dia, pontua no máximo 2 selos. */
export function pontosDaVenda(v: Venda) {
  return v.selo * Math.min(v.qtd, 2);
}

export const VENDAS_POR_DIA = [
  { dia: "06/08", valor: 2410, pontos: 318 },
  { dia: "07/08", valor: 3180, pontos: 402 },
  { dia: "08/08", valor: 2895, pontos: 371 },
  { dia: "09/08", valor: 4120, pontos: 505 },
  { dia: "10/08", valor: 3760, pontos: 468 },
  { dia: "11/08", valor: 4480, pontos: 552 },
  { dia: "12/08", valor: 5210, pontos: 631 },
];

export const VENDAS_POR_FILIAL = LOJAS.map((l, i) => ({
  loja: l,
  valor: [18420, 12310, 9870, 14260][i],
}));

export const PRODUTOS_MAIS_VENDIDOS = [
  { nome: "Sabonete Erva Doce", qtd: 812 },
  { nome: "Creme Dental Menta", qtd: 664 },
  { nome: "Shampoo Cachos", qtd: 431 },
  { nome: "Desodorante Roll-on", qtd: 397 },
  { nome: "Perfume Floral", qtd: 218 },
];

export const LOGS = [
  { data: "2026-08-12 10:22", usuario: "admin@ong", acao: "Alterou valor do dia 24 de R$ 1.200,00 para R$ 1.300,00", nivel: "ADMINISTRADOR" },
  { data: "2026-08-12 09:05", usuario: "financeiro@ong", acao: "Pagamento do prêmio S-1045 confirmado", nivel: "FINANCEIRO" },
  { data: "2026-08-11 18:47", usuario: "operador3@ong", acao: "Registrou 3 selos na cartela CGS-000132", nivel: "OPERADOR" },
  { data: "2026-08-11 14:10", usuario: "gerente@ong", acao: "Cadastrou produto P-012 Sabonete Líquido 250ml", nivel: "GERENTE" },
  { data: "2026-08-10 08:33", usuario: "admin@ong", acao: "Criou usuário operador4@ong", nivel: "ADMINISTRADOR" },
];

export const USUARIOS = [
  { nome: "Paulo R. Ferreira", email: "admin@ong", perfil: "ADMINISTRADOR", acessos: "Acesso total" },
  { nome: "Renata Alves", email: "gerente@ong", perfil: "GERENTE", acessos: "Produtos, Vendas, Clientes, Cartelas, Relatórios" },
  { nome: "Diego Souza", email: "operador3@ong", perfil: "OPERADOR", acessos: "Clientes, Vendas, Selos" },
  { nome: "Cláudia Prado", email: "financeiro@ong", perfil: "FINANCEIRO", acessos: "Prêmios, Pagamentos, Receita, Relatórios financeiros" },
];
