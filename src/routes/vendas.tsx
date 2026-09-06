import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader, SectionCard, Selo } from "@/components/cgs/ui-bits";
import { brl, dataBr, MINIMO_VALOR_CARTELA, type SeloNumber } from "@/lib/cgs-data";
import { supabase } from "@/integrations/supabase/client";
import { cgsKeys, getErrorMessage, useClientes, useLojas, useProdutos, useVendas } from "@/lib/cgs-db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/vendas")({
  head: () => ({
    meta: [
      { title: "Vendas · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Registro de vendas com cálculo automático de selos e pontos, incluindo a regra de 4+ unidades." },
      { property: "og:title", content: "Vendas · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Registro de vendas com cálculo automático de selos e pontos." },
    ],
  }),
  component: Vendas,
});

function Vendas() {
  const queryClient = useQueryClient();
  const clientes = useClientes().data ?? [];
  const lojas = useLojas().data ?? [];
  const produtos = useProdutos().data ?? [];
  const vendas = useVendas().data ?? [];
  const [produto, setProduto] = useState("");
  const [qtd, setQtd] = useState(1);
  const [cliente, setCliente] = useState("");
  const [loja, setLoja] = useState("");

  const p = produtos.find((x) => x.id === produto) ?? produtos[0];
  const selo = (p?.selo ?? 1) as SeloNumber;
  const pontos = selo * Math.min(qtd, 2);
  const total = Number(p?.preco ?? 0) * qtd;

  const totais = useMemo(
    () => ({
      valor: vendas.reduce((a, v) => a + Number(v.valor_unitario) * v.quantidade, 0),
      pontos: vendas.reduce((a, v) => a + v.pontos, 0),
    }),
    [vendas],
  );

  const registro = useMutation({
    mutationFn: async () => {
      if (!cliente || !loja || !p) throw new Error("Selecione cliente, loja e produto.");
      const { error } = await supabase.rpc("registrar_venda", { p_cliente_id: cliente, p_loja_id: loja, p_produto_id: p.id, p_quantidade: qtd });
      if (error) throw error;
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: cgsKeys.all }); setQtd(1); toast.success("Venda, pontos e selos registrados."); },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <>
      <PageHeader titulo="Controle de vendas" descricao="Fluxo: venda → produto → selo → pontos → cartela." />

      <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard titulo="Nova venda">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Cliente</label>
              <select value={cliente} onChange={(e) => setCliente(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione</option>{clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Loja / filial</label>
              <select value={loja} onChange={(e) => setLoja(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione</option>{lojas.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Produto</label>
              <select value={produto} onChange={(e) => setProduto(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                 <option value="">Selecione</option>{produtos.map((x) => (
                   <option key={x.id} value={x.id}>{x.nome} — {brl(Number(x.preco))}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Quantidade</label>
              <input type="number" min={1} value={qtd} onChange={(e) => setQtd(Math.max(1, Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                <Selo n={selo} size="lg" />
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-foreground">Total {brl(total)}</p>
                  <p className="text-muted-foreground">Pontuação gerada: <strong className="text-foreground">{pontos}</strong></p>
                </div>
              </div>
              {qtd >= 3 ? (
                <p className="mt-3 rounded-md bg-selo-3/25 px-2 py-1.5 text-xs font-medium text-foreground">
                  Regra aplicada: a partir de 3 unidades iguais na mesma compra e no mesmo dia, a pontuação fica limitada a 2 selos.
                </p>
              ) : null}
              <p className="mt-2 rounded-md bg-muted px-2 py-1.5 text-xs text-muted-foreground">
                A cartela programada exige {brl(MINIMO_VALOR_CARTELA)} acumulados no fundo de prêmios (10% do valor das compras).
              </p>
            </div>

             <Button onClick={() => registro.mutate()} disabled={!cliente || !loja || !p || registro.isPending} className="w-full">{registro.isPending ? "Registrando..." : "Registrar venda e lançar selo"}</Button>
          </div>
        </SectionCard>

        <SectionCard titulo={`Vendas registradas · ${brl(totais.valor)} · ${totais.pontos} pontos`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3">Venda</th><th className="py-2 pr-3">Data</th><th className="py-2 pr-3">Hora</th>
                  <th className="py-2 pr-3">Loja</th><th className="py-2 pr-3">Funcionário</th><th className="py-2 pr-3">Cliente</th>
                  <th className="py-2 pr-3">Produto</th><th className="py-2 pr-3">Qtd</th><th className="py-2 pr-3">Unit.</th>
                  <th className="py-2 pr-3">Total</th><th className="py-2 pr-3">Selo</th><th className="py-2">Pontos</th>
                </tr>
              </thead>
              <tbody>
              {vendas.map((v) => (
                  <tr key={v.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-3 font-mono text-xs">{v.id}</td>
                    <td className="py-2.5 pr-3">{dataBr(v.data)}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{v.created_at.slice(11, 16)}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{v.lojas?.nome ?? "—"}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">Operador</td>
                    <td className="py-2.5 pr-3">{v.clientes?.nome ?? "—"}</td>
                    <td className="py-2.5 pr-3">{v.produtos?.nome ?? "—"}</td>
                    <td className="py-2.5 pr-3">{v.quantidade}</td>
                    <td className="py-2.5 pr-3">{brl(Number(v.valor_unitario))}</td>
                    <td className="py-2.5 pr-3 font-medium">{brl(Number(v.valor_unitario) * v.quantidade)}</td>
                    <td className="py-2.5 pr-3"><Selo n={v.selo as SeloNumber} size="sm" /></td>
                    <td className="py-2.5 font-semibold">{v.pontos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
