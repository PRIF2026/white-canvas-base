import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader, ProgressoPontos, SectionCard, Selo, StatusPill } from "@/components/cgs/ui-bits";
import { brl, dataBr, pontosDaVenda, SELOS, type Cliente, type SeloNumber, type Venda, type Sorteio } from "@/lib/cgs-data";
import { supabase } from "@/integrations/supabase/client";
import { cgsKeys, getErrorMessage, useClientes, useSorteios, useVendas } from "@/lib/cgs-db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Cadastro de clientes, carteira programada, pontos acumulados e histórico de compras e sorteios." },
      { property: "og:title", content: "Clientes · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Carteira programada, pontos e histórico de cada cliente." },
    ],
  }),
  component: Clientes,
});

const formVazio = {
  nome: "", associado: "", cpf: "", telefone: "", email: "",
  nascimento: "", endereco: "", carteira: "",
};

const CAMPOS_BUSCA = [
  { key: "nome", label: "Nome completo" },
  { key: "associado", label: "Associado número" },
  { key: "cpf", label: "CPF" },
  { key: "telefone", label: "Telefone" },
  { key: "email", label: "E-mail" },
  { key: "nascimento", label: "Data de nascimento" },
  { key: "endereco", label: "Endereço" },
  { key: "carteira", label: "Número da carteira" },
] as const;
type CampoBusca = (typeof CAMPOS_BUSCA)[number]["key"];

function Clientes() {
  const queryClient = useQueryClient();
  const clientesQuery = useClientes();
  const vendasQuery = useVendas();
  const sorteiosQuery = useSorteios();
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState("");
  const [form, setForm] = useState({ ...formVazio });

  const clientes: Cliente[] = (clientesQuery.data ?? []).map((c) => ({
    id: c.id, nome: c.nome, associado: c.associado ?? "—", cpf: c.cpf ?? "—",
    telefone: c.telefone ?? "—", email: c.email ?? "—", nascimento: c.nascimento ?? "",
    endereco: c.endereco ?? "—", carteira: c.carteira ?? "—", cadastro: c.cadastro,
    pontos: c.pontos, selos: c.selos_cliente.map((s) => s.selo as SeloNumber),
    selosDetalhe: c.selos_cliente.map((s) => ({ n: s.selo as SeloNumber, data: s.data })),
    status: "Em andamento", dataSorteada: c.data_sorteada, numeroSorteado: c.numero_sorteado,
    valorGasto: Number(c.valor_gasto), programada: c.programada,
  }));

  const lista = useMemo(
    () =>
      clientes.filter((c) =>
        [c.nome, c.cpf, c.carteira, c.associado].join(" ").toLowerCase().includes(busca.toLowerCase()),
      ),
    [clientes, busca],
  );
  const cliente = clientes.find((c) => c.id === sel) ?? clientes[0];
  const compras: Venda[] = cliente ? (vendasQuery.data ?? []).filter((v) => v.cliente_id === cliente.id).map((v) => ({
    id: v.id, data: v.data, hora: v.created_at.slice(11, 16), loja: v.lojas?.nome ?? "—", funcionario: "Operador",
    cliente: v.clientes?.nome ?? "—", produto: v.produtos?.nome ?? "—", qtd: v.quantidade, unitario: Number(v.valor_unitario), selo: v.selo as SeloNumber,
  })) : [];
  const sorteios: Sorteio[] = cliente ? (sorteiosQuery.data ?? []).filter((s) => s.cliente_id === cliente.id).map((s) => ({
    id: s.id, cliente: s.clientes?.nome ?? cliente.nome, carteira: s.carteira ?? cliente.carteira, numero: s.numero,
    mesReferencia: s.mes_referencia ?? "—", dataSorteio: s.data_sorteio, valorOriginal: Number(s.valor_original),
    ganhadores: s.ganhadores, previsaoPagamento: s.previsao_pagamento ?? "", statusPremio: s.status_premio as Sorteio["statusPremio"],
    pagamento: null,
  })) : [];
  const selosOrdenados = cliente ? [...cliente.selosDetalhe].sort((a, b) => a.data.localeCompare(b.data)) : [];

  const podeSalvar = form.nome.trim() !== "" && form.associado.trim() !== "";
  const cadastro = useMutation({
    mutationFn: async () => {
      const carteira = form.carteira.trim() || `CGS-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
      const { data, error } = await supabase.from("clientes").insert({
        nome: form.nome.trim(), associado: form.associado.trim(), cpf: form.cpf.trim() || null,
        telefone: form.telefone.trim() || null, email: form.email.trim() || null,
        nascimento: form.nascimento || null, endereco: form.endereco.trim() || null, carteira,
      }).select("id").single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: async (id) => { await queryClient.invalidateQueries({ queryKey: cgsKeys.clientes }); setSel(id); setForm({ ...formVazio }); toast.success("Cliente cadastrado."); },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [painelEdicao, setPainelEdicao] = useState(false);
  const [campoBusca, setCampoBusca] = useState<CampoBusca>("nome");
  const [termo, setTermo] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ ...formVazio });

  const resultados = useMemo(() => {
    const t = termo.trim().toLowerCase();
    if (t === "") return [];
    return clientes.filter((c) => {
      const valor = campoBusca === "nascimento" ? dataBr(c.nascimento) : String(c[campoBusca] ?? "");
      return valor.toLowerCase().includes(t);
    });
  }, [clientes, termo, campoBusca]);

  const abrirFicha = (id: string) => {
    const c = clientes.find((x) => x.id === id);
    if (!c) return;
    setEditId(id);
    setEdit({
      nome: c.nome,
      associado: c.associado === "—" ? "" : c.associado,
      cpf: c.cpf === "—" ? "" : c.cpf,
      telefone: c.telefone === "—" ? "" : c.telefone,
      email: c.email === "—" ? "" : c.email,
      nascimento: c.nascimento,
      endereco: c.endereco === "—" ? "" : c.endereco,
      carteira: c.carteira === "—" ? "" : c.carteira,
    });
  };

  const atualizacao = useMutation({
    mutationFn: async () => {
      if (!editId) return;
      const { error } = await supabase.from("clientes").update({
        nome: edit.nome.trim(), associado: edit.associado.trim(), cpf: edit.cpf.trim() || null,
        telefone: edit.telefone.trim() || null, email: edit.email.trim() || null,
        nascimento: edit.nascimento || null, endereco: edit.endereco.trim() || null, carteira: edit.carteira.trim() || null,
      }).eq("id", editId);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cgsKeys.clientes });
      setEditId(null); setTermo("");
      toast.success("Cliente atualizado.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <>
      <PageHeader titulo="Controle de clientes" descricao="Cadastre e pesquise clientes por nome, CPF, número de associado ou carteira." />

      <SectionCard titulo="Cadastrar cliente">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(([
            ["nome", "Nome completo", "text"],
            ["associado", "ASSOCIADO NÚMERO", "text"],
            ["cpf", "CPF", "text"],
            ["telefone", "Telefone", "tel"],
            ["email", "E-mail", "email"],
            ["nascimento", "Data de nascimento", "date"],
            ["endereco", "Endereço", "text"],
            ["carteira", "Número da carteira", "text"],
          ] as const)).map(([k, label, tipo]) => (
            <label key={k} className="block text-xs text-muted-foreground">
              {label}
              <input
                type={tipo}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </label>
          ))}
        </div>
        <Button onClick={() => cadastro.mutate()} disabled={!podeSalvar || cadastro.isPending} className="mt-4">{cadastro.isPending ? "Salvando..." : "Cadastrar cliente"}</Button>
      </SectionCard>

      <SectionCard
        titulo="Editar cliente"
        acao={
          <Button variant={painelEdicao ? "secondary" : "default"} onClick={() => { setPainelEdicao((v) => !v); setEditId(null); }}>
            {painelEdicao ? "Fechar edição" : "Editar cliente"}
          </Button>
        }
      >
        {!painelEdicao ? (
          <p className="text-sm text-muted-foreground">Clique em “Editar cliente” para pesquisar um cliente cadastrado e alterar seus dados.</p>
        ) : (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs text-muted-foreground">
                Pesquisar por
                <select
                  value={campoBusca}
                  onChange={(e) => { setCampoBusca(e.target.value as CampoBusca); setTermo(""); setEditId(null); }}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  {CAMPOS_BUSCA.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </label>
              <label className="block text-xs text-muted-foreground">
                Digite os dados de {CAMPOS_BUSCA.find((c) => c.key === campoBusca)?.label}
                <input
                  value={termo}
                  onChange={(e) => { setTermo(e.target.value); setEditId(null); }}
                  placeholder="Digite para pesquisar"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
              </label>
            </div>

            {termo.trim() !== "" && !editId && (
              <div className="rounded-lg border border-border">
                {resultados.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
                ) : (
                  resultados.slice(0, 12).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => abrirFicha(c.id)}
                      className="flex w-full items-center justify-between gap-3 border-b border-border/60 px-3 py-2 text-left text-sm last:border-0 hover:bg-muted/60"
                    >
                      <span className="font-medium text-foreground">{c.nome}</span>
                      <span className="text-xs text-muted-foreground">{c.associado} · {c.cpf} · {c.carteira}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {editId && (
              <div className="rounded-lg border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(([
                    ["nome", "Nome completo", "text"],
                    ["associado", "Associado número", "text"],
                    ["cpf", "CPF", "text"],
                    ["telefone", "Telefone", "tel"],
                    ["email", "E-mail", "email"],
                    ["nascimento", "Data de nascimento", "date"],
                    ["endereco", "Endereço", "text"],
                    ["carteira", "Número da carteira", "text"],
                  ] as const)).map(([k, label, tipo]) => (
                    <label key={k} className="block text-xs text-muted-foreground">
                      {label}
                      <input
                        type={tipo}
                        value={edit[k]}
                        onChange={(e) => setEdit({ ...edit, [k]: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditId(null)}>Cancelar</Button>
                  <Button onClick={() => atualizacao.mutate()} disabled={edit.nome.trim() === "" || edit.associado.trim() === "" || atualizacao.isPending}>
                    {atualizacao.isPending ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <SectionCard titulo={`Clientes (${lista.length})`}>
          <input
            placeholder="Nome, CPF, associado ou carteira"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <ul className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {lista.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSel(c.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${c.id === sel ? "border-primary bg-accent" : "border-border hover:bg-accent/60"}`}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">{c.nome}</span>
                    <span className="shrink-0 font-display text-sm font-bold text-foreground">{c.pontos}</span>
                  </div>
                  <span className="block truncate text-xs text-muted-foreground">{c.associado} · {c.carteira} · {c.cpf}</span>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        {cliente ? <div className="space-y-4">
          <SectionCard titulo="Ficha do cliente">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Nome", cliente.nome],
                ["Associado número", cliente.associado],
                ["CPF", cliente.cpf],
                ["Telefone", cliente.telefone],
                ["E-mail", cliente.email],
                ["Nascimento", dataBr(cliente.nascimento)],
                ["Endereço", cliente.endereco],
                ["Número da cartela", cliente.carteira],
                ["Data de cadastro", dataBr(cliente.cadastro)],
                ["Data programada", cliente.dataSorteada ? dataBr(cliente.dataSorteada) : "Não sorteada"],
              ].map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
                  <p className="truncate text-sm font-medium text-foreground">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-border p-3">
              <ProgressoPontos pontos={cliente.pontos} />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selosOrdenados.map((s, i) => (
                  <Selo
                    key={i}
                    n={s.n}
                    size="sm"
                    titulo={`Selo ${s.n} (${SELOS[s.n - 1]?.nome}) · compra em ${dataBr(s.data)}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Selos em ordem cronológica — passe o mouse para ver a data da compra.
              </p>
            </div>
          </SectionCard>

          <SectionCard titulo="Histórico de compras">
            {compras.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma compra registrada no período.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                      <th className="py-2 pr-3">Data</th><th className="py-2 pr-3">Produto</th>
                      <th className="py-2 pr-3">Qtd</th><th className="py-2 pr-3">Valor</th>
                      <th className="py-2 pr-3">Selo</th><th className="py-2">Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.map((v) => (
                      <tr key={v.id} className="border-b border-border/60 last:border-0">
                        <td className="py-2.5 pr-3">{dataBr(v.data)}</td>
                        <td className="py-2.5 pr-3">{v.produto}</td>
                        <td className="py-2.5 pr-3">{v.qtd}</td>
                        <td className="py-2.5 pr-3">{brl(v.unitario * v.qtd)}</td>
                        <td className="py-2.5 pr-3"><Selo n={v.selo} size="sm" /></td>
                        <td className="py-2.5 font-semibold">{pontosDaVenda(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard titulo="Histórico de sorteios e prêmios">
            {sorteios.length === 0 ? (
              <p className="text-sm text-muted-foreground">Cliente ainda não sorteou nenhuma data.</p>
            ) : (
              <ul className="space-y-2">
                {sorteios.map((s) => (
                  <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        Nº {s.numero} · dia {s.numero} de {s.mesReferencia} · {brl(s.valorOriginal / s.ganhadores)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sorteio {dataBr(s.dataSorteio)} · {s.ganhadores} ganhador(es) · previsão {dataBr(s.previsaoPagamento)}
                      </p>
                    </div>
                    <StatusPill status={s.statusPremio} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div> : <SectionCard titulo="Ficha do cliente"><p className="text-sm text-muted-foreground">Cadastre o primeiro cliente para começar.</p></SectionCard>}
      </div>
    </>
  );
}
