import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, SectionCard, StatCard } from "@/components/cgs/ui-bits";
import { brl, LOJAS, VENDAS_POR_DIA, VENDAS_POR_FILIAL } from "@/lib/cgs-data";

export const Route = createFileRoute("/receita")({
  head: () => ({
    meta: [
      { title: "Fonte de Receita · PROJETO 7 CORES – CGS" },
      { name: "description", content: "10% das vendas diárias de perfumaria destinadas ao prêmio do mesmo dia do mês posterior, somando todas as filiais." },
      { property: "og:title", content: "Fonte de Receita · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Apuração de 10% das vendas de perfumaria destinadas aos prêmios." },
    ],
  }),
  component: Receita,
});

const FILL = ["var(--selo-1)", "var(--selo-2)", "var(--selo-3)", "var(--selo-4)", "var(--selo-5)", "var(--selo-6)", "var(--selo-7)"];

function Receita() {
  const dados = VENDAS_POR_DIA.map((d) => ({ ...d, fundo: d.valor * 0.1 }));
  const totalVendas = dados.reduce((a, d) => a + d.valor, 0);
  const totalFundo = totalVendas * 0.1;

  return (
    <>
      <PageHeader titulo="Fonte de receita" descricao="Regra: 10% de todas as vendas de perfumaria do dia formam o prêmio do mesmo dia do mês posterior." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vendas de perfumaria" valor={brl(totalVendas)} detalhe="últimos 7 dias · todas as filiais" accent={6} />
        <StatCard label="Fundo de prêmios (10%)" valor={brl(totalFundo)} detalhe="destinado ao mês posterior" accent={4} />
        <StatCard label="Filiais consolidadas" valor={String(LOJAS.length)} detalhe="vendas somadas por dia" accent={5} />
        <StatCard label="Ticket mínimo da cartela" valor={brl(35)} detalhe="somatório mínimo em produtos" accent={2} />
      </div>

      <SectionCard titulo="Apuração diária e destinação de 10%">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="dia" fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Bar dataKey="valor" radius={6} fill="var(--selo-6)" />
              <Bar dataKey="fundo" radius={6} fill="var(--selo-4)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard titulo="Receita por loja">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VENDAS_POR_FILIAL} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="loja" width={100} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip formatter={(v: number) => brl(v)} />
                <Bar dataKey="valor" radius={6}>
                  {VENDAS_POR_FILIAL.map((_, i) => <Cell key={i} fill={FILL[i % 7]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard titulo="Regras auditáveis da fonte de receita">
          <ol className="space-y-3 text-sm text-muted-foreground">
            {[
              "10% de todas as vendas de artigos de perfumaria do dia são destinados ao prêmio do mesmo dia do mês posterior.",
              "Havendo mais de uma loja, todas as vendas de perfumaria do dia são somadas na apuração.",
              "A partir de 3 unidades do mesmo produto na mesma compra e no mesmo dia, a pontuação fica limitada a 2 selos.",
              "A cartela deve possuir no mínimo R$ 35,00 em produtos para determinadas regras de participação.",
            ].map((r, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-display text-xs font-bold text-white" style={{ background: FILL[i] }}>{i + 1}</span>
                <span className="min-w-0">{r}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <SectionCard titulo="Detalhamento diário">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">Dia</th><th className="py-2 pr-3">Vendas perfumaria</th>
                <th className="py-2 pr-3">10% destinado</th>
                <th className="py-2">Prêmio no mês posterior</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((d) => (
                <tr key={d.dia} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3 font-medium">{d.dia}</td>
                  <td className="py-2.5 pr-3">{brl(d.valor)}</td>
                  <td className="py-2.5 pr-3 font-semibold text-selo-4">{brl(d.fundo)}</td>
                  <td className="py-2.5 text-muted-foreground">{d.dia.slice(0, 2)}/09</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}
