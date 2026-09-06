import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/cgs/ui-bits";
import { brl, SORTEIOS, VALORES_DIA_PADRAO } from "@/lib/cgs-data";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Calendário de prêmios por dia do mês, com valores configuráveis, cartelas premiadas e valor distribuído." },
      { property: "og:title", content: "Calendário · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Valores de prêmio por dia do mês, configuráveis pelo administrador." },
    ],
  }),
  component: Calendario,
});

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function Calendario() {
  const [mes, setMes] = useState(8);
  const [ano] = useState(2026);
  const [valores, setValores] = useState<Record<number, number>>({ ...VALORES_DIA_PADRAO });
  const [edit, setEdit] = useState<number | null>(null);

  const total = new Date(ano, mes + 1, 0).getDate();
  const dias = Array.from({ length: total }, (_, i) => i + 1);
  const premiadosPorDia = (d: number) => SORTEIOS.filter((s) => s.numero === d).reduce((a, s) => a + s.ganhadores, 0);
  const distribuido = dias.reduce((a, d) => a + (premiadosPorDia(d) > 0 ? (valores[d] ?? 0) : 0), 0);

  return (
    <>
      <PageHeader
        titulo="Calendário de prêmios"
        descricao="Cada dia do mês possui um valor em dinheiro configurável pelo painel administrativo."
        acoes={
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {MESES.map((m, i) => <option key={m} value={i}>{m}/{ano}</option>)}
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SectionCard titulo="Total programado"><p className="font-display text-2xl font-bold">{brl(dias.reduce((a, d) => a + (valores[d] ?? 0), 0))}</p></SectionCard>
        <SectionCard titulo="Valor distribuído"><p className="font-display text-2xl font-bold text-selo-4">{brl(distribuido)}</p></SectionCard>
        <SectionCard titulo="Dias com sorteio"><p className="font-display text-2xl font-bold text-selo-6">{dias.filter((d) => premiadosPorDia(d) > 0).length}</p></SectionCard>
      </div>

      <SectionCard titulo={`${MESES[mes]} de ${ano} · ${total} dias`}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {dias.map((d) => {
            const premiados = premiadosPorDia(d);
            const cor = `var(--selo-${((d - 1) % 7) + 1})`;
            return (
              <div key={d} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="h-1.5 w-full" style={{ background: cor }} />
                <div className="space-y-1 p-2.5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1">
                    <span className="font-display text-lg font-bold text-foreground">{d}</span>
                    {premiados > 0 ? (
                      <span className="shrink-0 rounded-full bg-selo-4/15 px-1.5 py-0.5 text-[10px] font-semibold text-selo-4">sorteado</span>
                    ) : null}
                  </div>
                  {edit === d ? (
                    <input
                      autoFocus
                      type="number"
                      defaultValue={valores[d]}
                      onBlur={(e) => { setValores({ ...valores, [d]: Number(e.target.value) || 0 }); setEdit(null); }}
                      className="w-full rounded border border-input bg-background px-1.5 py-1 text-xs"
                    />
                  ) : (
                    <button onClick={() => setEdit(d)} className="block w-full truncate text-left text-sm font-semibold text-foreground hover:underline">
                      {brl(valores[d] ?? 0)}
                    </button>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    {premiados > 0 ? `${premiados} cartela(s) · ${brl((valores[d] ?? 0) / premiados)} cada` : "disponível"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Clique em um valor para editá-lo. Meses de 28 ou 30 dias não exibem os dias 29, 30 e 31.
        </p>
      </SectionCard>
    </>
  );
}
