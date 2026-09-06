import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { ShoppingCart, Users, Grid3x3, Trophy, TriangleAlert } from "lucide-react";
import { PageHeader, StatCard, SectionCard, SeloLegenda, ProgressoPontos } from "@/components/cgs/ui-bits";
import {
  brl, CLIENTES, PRODUTOS_MAIS_VENDIDOS, SORTEIOS, VENDAS_POR_DIA, VENDAS_POR_FILIAL,
} from "@/lib/cgs-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Indicadores de vendas, pontos, cartelas e prêmios da promoção Compre e Ganhe Sempre." },
      { property: "og:title", content: "Dashboard · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Indicadores de vendas, pontos, cartelas e prêmios da promoção." },
    ],
  }),
  component: Dashboard,
});

const SELO_FILL = [
  "var(--selo-1)", "var(--selo-2)", "var(--selo-3)", "var(--selo-4)",
  "var(--selo-5)", "var(--selo-6)", "var(--selo-7)",
];

function Dashboard() {
  const vendasDia = VENDAS_POR_DIA[VENDAS_POR_DIA.length - 1]?.valor ?? 0;
  const vendasMes = VENDAS_POR_DIA.reduce((a, b) => a + b.valor, 0);
  const cheias = CLIENTES.filter((c) => c.pontos >= 50).length;
  const pagos = SORTEIOS.filter((s) => s.statusPremio === "Pago");
  const pendentes = SORTEIOS.filter((s) => s.statusPremio !== "Pago" && s.statusPremio !== "Expirado");

  return (
    <>
      <PageHeader
        titulo="Painel administrativo"
        descricao="Visão geral da promoção Compre e Ganhe Sempre — ONG Farmacêutica."
        acoes={
          <Link
            to="/vendas"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
          >
            Registrar venda
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vendas do dia" valor={brl(vendasDia)} detalhe="4 lojas somadas" accent={1} icon={<ShoppingCart className="h-5 w-5" />} />
        <StatCard label="Vendas do mês" valor={brl(vendasMes)} detalhe="Agosto/2026" accent={2} icon={<ShoppingCart className="h-5 w-5" />} />
        <StatCard label="Total de clientes" valor={String(CLIENTES.length)} detalhe="cadastrados com carteira" accent={4} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Cartelas ativas" valor={String(CLIENTES.filter((c) => c.status !== "Expirada" && c.status !== "Cancelada").length)} detalhe={`${cheias} com 50 pontos`} accent={6} icon={<Grid3x3 className="h-5 w-5" />} />
        <StatCard label="Valor destinado aos prêmios" valor={brl(vendasMes * 0.1)} detalhe="10% das vendas de perfumaria" accent={5} />
        <StatCard label="Prêmios pagos" valor={brl(pagos.reduce((a, s) => a + s.valorOriginal, 0))} detalhe={`${pagos.length} pagamento(s)`} accent={4} icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Prêmios pendentes" valor={String(pendentes.length)} detalhe="aguardando apresentação/pagamento" accent={7} icon={<Trophy className="h-5 w-5" />} />
      </div>

      <SectionCard titulo="Selos e faixas de preço">
        <SeloLegenda />
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard titulo="Vendas por dia" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VENDAS_POR_DIA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip formatter={(v: number) => brl(v)} />
                <Line type="monotone" dataKey="valor" stroke="var(--selo-6)" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pontos" stroke="var(--selo-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard titulo="Vendas por loja">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VENDAS_POR_FILIAL} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="loja" width={96} fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip formatter={(v: number) => brl(v)} />
                <Bar dataKey="valor" radius={6}>
                  {VENDAS_POR_FILIAL.map((_, i) => (
                    <Cell key={i} fill={SELO_FILL[i % 7]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard titulo="Produtos mais vendidos" className="xl:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRODUTOS_MAIS_VENDIDOS}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="nome" fontSize={10} stroke="var(--muted-foreground)" interval={0} height={48} />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="qtd" radius={6}>
                  {PRODUTOS_MAIS_VENDIDOS.map((_, i) => (
                    <Cell key={i} fill={SELO_FILL[i % 7]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard titulo="Alertas do sistema">
          <ul className="space-y-3 text-sm">
            {[
              { c: "text-selo-4", t: `${cheias} cartela(s) atingiram 50 pontos` },
              { c: "text-selo-2", t: `${pendentes.length} prêmio(s) pendentes de pagamento` },
              { c: "text-selo-6", t: "3 cartelas com sorteio nos próximos 7 dias" },
              { c: "text-selo-1", t: "1 cartela expirada por não apresentação" },
            ].map((a) => (
              <li key={a.t} className="flex items-start gap-2">
                <TriangleAlert className={`mt-0.5 h-4 w-4 shrink-0 ${a.c}`} />
                <span className="min-w-0 text-muted-foreground">{a.t}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard
        titulo="Cartelas em destaque"
        acao={<Link to="/cartelas" className="text-xs font-semibold text-primary">Ver todas</Link>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CLIENTES.slice(0, 6).map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-3">
              <p className="truncate text-sm font-semibold text-foreground">{c.nome}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.carteira}</p>
              <div className="mt-3">
                <ProgressoPontos pontos={c.pontos} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
