import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader, SectionCard, Selo } from "@/components/cgs/ui-bits";
import { brl, dataBr, SELOS, type SeloNumber } from "@/lib/cgs-data";
import { useClientes, useLojas, useProdutos, useSorteios, useVendas } from "@/lib/cgs-db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Relatórios de vendas, clientes, produtos, pontos, cartelas, sorteios, premiações e receita com filtros e exportação." },
      { property: "og:title", content: "Relatórios · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Relatórios completos da promoção com filtros e exportação." },
    ],
  }),
  component: Relatorios,
});

const RELATORIOS = ["Vendas", "Clientes", "Produtos", "Pontos", "Cartelas", "Sorteios", "Premiações", "Pagamentos", "Receita", "Receita por filial", "Produtos por faixa", "Desempenho"];

function Relatorios() {
  const [tipo, setTipo] = useState("Vendas");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [loja, setLoja] = useState("");
  const [cliente, setCliente] = useState("");
  const [selo, setSelo] = useState("");
  const [produto, setProduto] = useState("");
  const clientes = useClientes().data ?? [];
  const lojas = useLojas().data ?? [];
  const produtos = useProdutos().data ?? [];
  const vendas = useVendas().data ?? [];
  const sorteios = useSorteios().data ?? [];

  const vendasFiltradas = useMemo(() => vendas.filter((v) =>
    (!inicio || v.data >= inicio) && (!fim || v.data <= fim) && (!loja || v.loja_id === loja) &&
    (!cliente || v.cliente_id === cliente) && (!produto || v.produto_id === produto) && (!selo || v.selo === Number(selo)),
  ), [vendas, inicio, fim, loja, cliente, produto, selo]);

  const porSelo = SELOS.map((s) => ({
    selo: s.n as SeloNumber,
    produtos: produtos.filter((p) => p.selo === s.n).length,
    pontos: vendasFiltradas.filter((v) => v.selo === s.n).reduce((a, v) => a + v.pontos, 0),
  }));

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        descricao="Filtre por data, cliente, loja, produto, número do selo, situação e período."
        acoes={
          <>
            <Button variant="outline">
              <FileText className="h-4 w-4" /> PDF
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
          </>
        }
      />

      <SectionCard titulo="Filtros">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs text-muted-foreground">Relatório
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
              {RELATORIOS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label className="block text-xs text-muted-foreground">Período inicial
            <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
          </label>
          <label className="block text-xs text-muted-foreground">Período final
            <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
          </label>
          <label className="block text-xs text-muted-foreground">Loja
            <select value={loja} onChange={(e) => setLoja(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option value="">Todas</option>{lojas.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
            </select>
          </label>
          <label className="block text-xs text-muted-foreground">Cliente
            <select value={cliente} onChange={(e) => setCliente(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option value="">Todos</option>{clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </label>
          <label className="block text-xs text-muted-foreground">Número do selo
            <select value={selo} onChange={(e) => setSelo(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option value="">Todos</option>{SELOS.map((s) => <option key={s.n}>{s.n}</option>)}
            </select>
          </label>
          <label className="block text-xs text-muted-foreground">Situação
            <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option>Todas</option><option>Em andamento</option><option>Premiada</option><option>Expirada</option>
            </select>
          </label>
          <label className="block text-xs text-muted-foreground">Produto
            <select value={produto} onChange={(e) => setProduto(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option value="">Todos</option>{produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </label>
        </div>
      </SectionCard>

      <SectionCard titulo={`Relatório de ${tipo.toLowerCase()}`}>
        {tipo === "Clientes" || tipo === "Pontos" || tipo === "Cartelas" ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground"><th className="py-2 pr-3">Cliente</th><th>Cartela</th><th>Pontos</th><th>Valor gasto</th><th>Cadastro</th></tr></thead><tbody>{clientes.filter((c) => !cliente || c.id === cliente).map((c) => <tr key={c.id} className="border-b border-border/60"><td className="py-2.5 pr-3">{c.nome}</td><td>{c.carteira ?? "—"}</td><td>{c.pontos}</td><td>{brl(Number(c.valor_gasto))}</td><td>{dataBr(c.cadastro)}</td></tr>)}</tbody></table></div>
        : tipo === "Produtos" || tipo === "Produtos por faixa" ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground"><th className="py-2 pr-3">Produto</th><th>Categoria</th><th>Preço</th><th>Selo</th><th>Estoque</th></tr></thead><tbody>{produtos.filter((p) => !produto || p.id === produto).map((p) => <tr key={p.id} className="border-b border-border/60"><td className="py-2.5 pr-3">{p.nome}</td><td>{p.categoria ?? "—"}</td><td>{brl(Number(p.preco))}</td><td>{p.selo}</td><td>{p.estoque}</td></tr>)}</tbody></table></div>
        : tipo === "Sorteios" || tipo === "Premiações" || tipo === "Pagamentos" ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground"><th className="py-2 pr-3">Data</th><th>Cliente</th><th>Dia</th><th>Modalidade</th><th>Prêmio</th></tr></thead><tbody>{sorteios.filter((s) => !cliente || s.cliente_id === cliente).map((s) => <tr key={s.id} className="border-b border-border/60"><td className="py-2.5 pr-3">{dataBr(s.data_sorteio)}</td><td>{s.clientes?.nome ?? "—"}</td><td>{s.numero}</td><td>{s.modalidade}</td><td>{brl(Number(s.valor_original))}</td></tr>)}</tbody></table></div>
        : <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">Data</th><th className="py-2 pr-3">Loja</th><th className="py-2 pr-3">Cliente</th>
                <th className="py-2 pr-3">Produto</th><th className="py-2 pr-3">Valor</th><th className="py-2 pr-3">Selo</th><th className="py-2">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map((v) => (
                <tr key={v.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3">{dataBr(v.data)}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{v.lojas?.nome ?? "—"}</td>
                  <td className="py-2.5 pr-3">{v.clientes?.nome ?? "—"}</td>
                  <td className="py-2.5 pr-3">{v.produtos?.nome ?? "—"}</td>
                  <td className="py-2.5 pr-3">{brl(Number(v.valor_unitario) * v.quantidade)}</td>
                  <td className="py-2.5 pr-3"><Selo n={v.selo as SeloNumber} size="sm" /></td>
                  <td className="py-2.5 font-semibold">{v.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </SectionCard>

      <SectionCard titulo="Produtos e pontos por faixa de preço (selos 1 a 7)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {porSelo.map((s) => (
            <div key={s.selo} className="rounded-lg border border-border p-3 text-center">
              <Selo n={s.selo} />
              <p className="mt-2 font-display text-lg font-bold text-foreground">{s.produtos}</p>
              <p className="text-[11px] text-muted-foreground">produtos</p>
              <p className="mt-1 text-xs font-semibold text-foreground">{s.pontos} pts</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
