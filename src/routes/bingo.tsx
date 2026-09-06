import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader, SectionCard, StatusPill } from "@/components/cgs/ui-bits";
import { brl, dataBr, elegibilidade, fundoCliente, META_PONTOS, MINIMO_VALOR_CARTELA, MINIMO_VALOR_CARTELA_PADRAO, type ModoSorteio, VALORES_DIA_PADRAO } from "@/lib/cgs-data";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { cgsKeys, getErrorMessage, useClientes, useSorteios } from "@/lib/cgs-db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/bingo")({
  head: () => ({
    meta: [
      { title: "Bingo · PROJETO 7 CORES – CGS" },
      { name: "description", content: "O cliente sorteia um dia do mês posterior e descobre o valor do prêmio correspondente." },
      { property: "og:title", content: "Bingo · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Sorteio de datas do mês posterior e seus prêmios." },
    ],
  }),
  component: Bingo,
});

const diasDoMes = (mes: number, ano: number) => new Date(ano, mes, 0).getDate();

function mesPosterior(base = new Date()) {
  const d = new Date(base);
  d.setMonth(d.getMonth() + 1);
  return { mes: d.getMonth() + 1, ano: d.getFullYear() };
}

function Bingo() {
  const queryClient = useQueryClient();
  const clientes = useClientes().data ?? [];
  const sorteios = useSorteios().data ?? [];
  const [clienteId, setClienteId] = useState("");
  const [numero, setNumero] = useState<number | null>(null);
  const [girando, setGirando] = useState(false);
  const [modo, setModo] = useState<ModoSorteio>("50-pontos");

  const cliente = clientes.find((c) => c.id === clienteId) ?? clientes[0];
  const apto = elegibilidade(cliente?.pontos ?? 0, Number(cliente?.valor_gasto ?? 0));
  const habilitado = modo === "50-pontos" ? apto.meta : apto.programada;

  const prox = mesPosterior();
  const total = diasDoMes(prox.mes, prox.ano);
  const mesPosteriorLabel = `${String(prox.mes).padStart(2, "0")}/${prox.ano}`;
  const valor = numero ? (VALORES_DIA_PADRAO[numero] ?? 0) : 0;

  const gravar = useMutation({
    mutationFn: async (dia: number) => {
      if (!cliente) throw new Error("Selecione um cliente.");
      const dataSorteada = `${prox.ano}-${String(prox.mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const { error: sorteioError } = await supabase.from("sorteios").insert({
        cliente_id: cliente.id, carteira: cliente.carteira, numero: dia, mes_referencia: mesPosteriorLabel,
        modalidade: modo, valor_original: VALORES_DIA_PADRAO[dia] ?? 0,
      });
      if (sorteioError) throw sorteioError;
      const { error: clienteError } = await supabase.from("clientes").update({
        programada: modo === "programada", data_sorteada: dataSorteada, numero_sorteado: dia,
      }).eq("id", cliente.id);
      if (clienteError) throw clienteError;
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: cgsKeys.all }); toast.success("Sorteio salvo."); },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const sortear = () => {
    if (!habilitado || girando) return;
    setGirando(true);
    let i = 0;
    const t = setInterval(() => {
      setNumero(Math.floor(Math.random() * total) + 1);
      if (++i > 14) {
        clearInterval(t);
        setGirando(false);
        setNumero((dia) => { if (dia) gravar.mutate(dia); return dia; });
      }
    }, 70);
  };

  return (
    <>
      <PageHeader titulo="Bingo dos dias" descricao={`O número sorteado corresponde a um dia do mês posterior (${mesPosteriorLabel}).`} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard titulo={`Dias do mês posterior · ${total} dias`}>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-10">
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setNumero(n)}
                className={cn(
                  "aspect-square rounded-lg border text-sm font-display font-bold transition-transform hover:scale-105",
                  n === numero
                    ? "border-transparent text-white shadow-lg"
                    : "border-border bg-card text-foreground",
                )}
                style={n === numero ? { background: `var(--selo-${(n % 7) + 1})` } : undefined}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Dias 29, 30 e 31 são desabilitados automaticamente em meses que não os possuem.
          </p>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard titulo="Sortear dia">
            <label className="text-xs font-medium text-muted-foreground">Cliente / cartela</label>
            <select
              value={clienteId}
              onChange={(e) => { setClienteId(e.target.value); setNumero(null); }}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione</option>{clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome} — {c.pontos} pts · {brl(Number(c.valor_gasto))}</option>
              ))}
            </select>

            <fieldset className="mt-4 space-y-2">
              <legend className="text-xs font-medium text-muted-foreground">Modalidade do sorteio</legend>
              {([
                { v: "50-pontos" as ModoSorteio, t: `${META_PONTOS} pontos`, d: `meta de ${META_PONTOS} pontos e ${brl(MINIMO_VALOR_CARTELA_PADRAO)} somados`, ok: apto.meta },
                { v: "programada" as ModoSorteio, t: "Cartela programada", d: `mínimo de ${brl(MINIMO_VALOR_CARTELA)} acumulados no fundo (10% das compras)`, ok: apto.programada },
              ]).map((o) => (
                <label
                  key={o.v}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2.5 text-xs ${modo === o.v ? "border-primary bg-accent" : "border-border"}`}
                >
                  <input type="radio" name="modo" className="mt-0.5" checked={modo === o.v} onChange={() => setModo(o.v)} />
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{o.t}</span>
                    <span className="block text-muted-foreground">{o.d}</span>
                    <span className={o.ok ? "font-semibold text-selo-4" : "font-semibold text-selo-1"}>
                      {o.ok ? "cliente enquadrado" : "cliente não enquadrado"}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="mt-4 grid place-items-center rounded-xl border border-border p-6">
              <span
                className="grid h-28 w-28 place-items-center rounded-full font-display text-4xl font-bold text-white"
                style={{ background: numero ? `var(--selo-${(numero % 7) + 1})` : "var(--muted)" }}
              >
                {numero ?? "—"}
              </span>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {numero ? <>Dia {numero} de {mesPosteriorLabel} · prêmio <strong className="text-foreground">{brl(valor)}</strong></> : "Nenhum dia sorteado"}
              </p>
            </div>

            {!habilitado ? (
              <p className="mt-3 rounded-md bg-selo-1/12 px-2 py-2 text-xs font-medium text-selo-1">
                Sem sorteio nesta modalidade. {modo === "50-pontos"
                  ? `Exige ${META_PONTOS} pontos e ${brl(MINIMO_VALOR_CARTELA_PADRAO)} somados${(cliente?.pontos ?? 0) < META_PONTOS ? ` (faltam ${META_PONTOS - (cliente?.pontos ?? 0)} pontos)` : ""}.`
                   : `A cartela programada exige ${brl(MINIMO_VALOR_CARTELA)} no fundo de 10%. Acumulado: ${brl(fundoCliente(Number(cliente?.valor_gasto ?? 0)))} (faltam ${brl(Math.max(0, MINIMO_VALOR_CARTELA - fundoCliente(Number(cliente?.valor_gasto ?? 0))))}).`}
              </p>
            ) : null}

            <Button
              onClick={sortear}
              disabled={!cliente || !habilitado || girando || gravar.isPending}
              className="mt-3 w-full"
            >
              {girando ? "Sorteando..." : "Sortear dia"}
            </Button>
            <p className="mt-2 text-[11px] text-muted-foreground">
              O cliente deve apresentar a cartela exatamente na data sorteada, sob pena de perda do prêmio.
              {modo === "programada" ? ` Na cartela programada é preciso completar os ${META_PONTOS} pontos até o dia sorteado; em caso de desistência, todos os pontos são perdidos.` : ""}
            </p>
          </SectionCard>
        </div>
      </div>

      <SectionCard titulo="Registro de sorteios">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">ID</th><th className="py-2 pr-3">Cliente</th><th className="py-2 pr-3">Cartela</th>
                <th className="py-2 pr-3">Nº</th><th className="py-2 pr-3">Data do sorteio</th><th className="py-2 pr-3">Mês ref.</th>
                <th className="py-2 pr-3">Valor do dia</th><th className="py-2 pr-3">Ganhadores</th><th className="py-2 pr-3">Valor individual</th>
                <th className="py-2 pr-3">Previsão</th><th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorteios.map((s) => (
                <tr key={s.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3 font-mono text-xs">{s.id}</td>
                  <td className="py-2.5 pr-3">{s.clientes?.nome ?? "—"}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">{s.carteira ?? "—"}</td>
                  <td className="py-2.5 pr-3 font-display font-bold">{s.numero}</td>
                  <td className="py-2.5 pr-3">{dataBr(s.data_sorteio)}</td>
                  <td className="py-2.5 pr-3">{s.mes_referencia ?? "—"}</td>
                  <td className="py-2.5 pr-3">{brl(Number(s.valor_original))}</td>
                  <td className="py-2.5 pr-3">{s.ganhadores}</td>
                  <td className="py-2.5 pr-3 font-semibold">{brl(Number(s.valor_original) / s.ganhadores)}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{dataBr(s.previsao_pagamento)}</td>
                  <td className="py-2.5"><StatusPill status={s.status_premio as Parameters<typeof StatusPill>[0]["status"]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}
