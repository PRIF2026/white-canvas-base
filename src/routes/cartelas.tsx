import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, ProgressoPontos, Selo } from "@/components/cgs/ui-bits";
import { dataBr, SELOS, type SeloNumber } from "@/lib/cgs-data";
import { useClientes } from "@/lib/cgs-db";

export const Route = createFileRoute("/cartelas")({
  head: () => ({
    meta: [
      { title: "Cartelas · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Cartela digital com selos de 1 a 7, pontos acumulados, status e data programada de sorteio." },
      { property: "og:title", content: "Cartelas · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Cartela digital com selos de 1 a 7 e progresso até 50 pontos." },
    ],
  }),
  component: Cartelas,
});

const STATUS = ["Todas", "Meta atingida", "Cartela programada", "Sem sorteio"] as const;

function Cartelas() {
  const [filtro, setFiltro] = useState("Todas");
  const clientes = useClientes().data ?? [];
  const lista = clientes.filter((c) => {
    if (filtro === "Meta atingida") return c.pontos >= 50;
    if (filtro === "Cartela programada") return c.pontos < 50 && c.programada;
    if (filtro === "Sem sorteio") return c.pontos < 50 && !c.programada;
    return true;
  });

  return (
    <>
      <PageHeader
        titulo="Cartela digital"
        descricao="Meta de 50 pontos."
        acoes={
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {STATUS.map((s) => <option key={s}>{s}</option>)}
          </select>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lista.map((c) => {
           const contagem = SELOS.map((s) => c.selos_cliente.filter((x) => x.selo === s.n).length);
          const meta = c.pontos >= 50;
          const mostraData = meta || c.programada;
          return (
            <article key={c.id} className="card-soft overflow-hidden rounded-xl border border-border bg-card">
              <div className="h-1.5 w-full rainbow-bar" />
              <div className="space-y-3 p-4">
                <div className="min-w-0">
                    <h2 className="truncate text-sm font-bold text-foreground">{c.nome}</h2>
                    <p className="truncate text-xs text-muted-foreground">{c.carteira ?? "—"} · criada em {dataBr(c.cadastro)}</p>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {SELOS.map((s, i) => (
                    <div key={s.n} className="flex flex-col items-center gap-1">
                      <Selo n={s.n as SeloNumber} faded={contagem[i] === 0} />
                      <span className="text-[10px] font-semibold text-muted-foreground">x{contagem[i]}</span>
                    </div>
                  ))}
                </div>

                <ProgressoPontos pontos={c.pontos} />

                {meta ? (
                  <p className="rounded-md bg-selo-4/15 px-2 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-selo-4">
                    Meta atingida
                  </p>
                ) : c.programada ? (
                  <p className="rounded-md bg-selo-6/15 px-2 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-selo-6">
                    Cartela programada
                  </p>
                ) : (
                  <p className="rounded-md bg-muted px-2 py-1.5 text-center text-xs text-muted-foreground">
                    Faltam {50 - c.pontos} pontos para a meta de 50
                  </p>
                )}

                <dl className="grid grid-cols-2 gap-2 text-xs">
                   <div><dt className="text-muted-foreground">Selos</dt><dd className="font-semibold text-foreground">{c.selos_cliente.length}</dd></div>
                  <div><dt className="text-muted-foreground">Restantes</dt><dd className="font-semibold text-foreground">{Math.max(0, 50 - c.pontos)} pts</dd></div>
                   <div><dt className="text-muted-foreground">Data sorteada</dt><dd className="font-semibold text-foreground">{mostraData ? dataBr(c.data_sorteada) : "—"}</dd></div>
                   <div><dt className="text-muted-foreground">Nº sorteado</dt><dd className="font-semibold text-foreground">{mostraData ? (c.numero_sorteado ?? "—") : "—"}</dd></div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
