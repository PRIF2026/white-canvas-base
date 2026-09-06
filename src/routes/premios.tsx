import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard, StatCard, StatusPill } from "@/components/cgs/ui-bits";
import { brl, dataBr, SORTEIOS } from "@/lib/cgs-data";

export const Route = createFileRoute("/premios")({
  head: () => ({
    meta: [
      { title: "Prêmios · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Controle de prêmios e pagamentos: valor original, divisão por ganhadores, status e datas." },
      { property: "og:title", content: "Prêmios · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Controle de prêmios, divisão por ganhadores e pagamentos." },
    ],
  }),
  component: Premios,
});

const STATUS = ["Todos", "Aguardando apresentação", "Aguardando pagamento", "Pago", "Cancelado", "Expirado"];

function Premios() {
  const [filtro, setFiltro] = useState("Todos");
  const lista = SORTEIOS.filter((s) => filtro === "Todos" || s.statusPremio === filtro);
  const pagos = SORTEIOS.filter((s) => s.statusPremio === "Pago");
  const aPagar = SORTEIOS.filter((s) => s.statusPremio === "Aguardando pagamento");

  return (
    <>
      <PageHeader
        titulo="Controle de prêmios e pagamentos"
        descricao="O valor do dia é dividido automaticamente pelo número de cartelas premiadas."
        acoes={
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {STATUS.map((s) => <option key={s}>{s}</option>)}
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Prêmios pagos" valor={brl(pagos.reduce((a, s) => a + s.valorOriginal, 0))} detalhe={`${pagos.length} registro(s)`} accent={4} />
        <StatCard label="Aguardando pagamento" valor={brl(aPagar.reduce((a, s) => a + s.valorOriginal, 0))} detalhe={`${aPagar.length} registro(s)`} accent={2} />
        <StatCard label="Aguardando apresentação" valor={String(SORTEIOS.filter((s) => s.statusPremio === "Aguardando apresentação").length)} detalhe="cartelas a apresentar na data" accent={3} />
        <StatCard label="Expirados" valor={String(SORTEIOS.filter((s) => s.statusPremio === "Expirado").length)} detalhe="cartelas descartadas" accent={1} />
      </div>

      <SectionCard titulo={`Prêmios (${lista.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">Cliente</th><th className="py-2 pr-3">Cartela</th><th className="py-2 pr-3">Nº</th>
                <th className="py-2 pr-3">Dia</th><th className="py-2 pr-3">Valor original</th><th className="py-2 pr-3">Ganhadores</th>
                <th className="py-2 pr-3">Valor individual</th><th className="py-2 pr-3">Sorteio</th><th className="py-2 pr-3">Pagamento</th>
                <th className="py-2 pr-3">Status</th><th className="py-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((s) => (
                <tr key={s.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3 font-medium">{s.cliente}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">{s.carteira}</td>
                  <td className="py-2.5 pr-3 font-display font-bold">{s.numero}</td>
                  <td className="py-2.5 pr-3">{s.numero}/{s.mesReferencia}</td>
                  <td className="py-2.5 pr-3">{brl(s.valorOriginal)}</td>
                  <td className="py-2.5 pr-3">{s.ganhadores}</td>
                  <td className="py-2.5 pr-3 font-semibold">{brl(s.valorOriginal / s.ganhadores)}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{dataBr(s.dataSorteio)}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{dataBr(s.pagamento ?? s.previsaoPagamento)}</td>
                  <td className="py-2.5 pr-3"><StatusPill status={s.statusPremio} /></td>
                  <td className="py-2.5">
                    <button
                      disabled={s.statusPremio !== "Aguardando pagamento"}
                      className="rounded-md border border-border px-2 py-1 text-xs font-semibold disabled:opacity-35"
                    >
                      Pagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          O sistema bloqueia pagamento duplicado e registra log de toda liberação financeira.
        </p>
      </SectionCard>
    </>
  );
}
