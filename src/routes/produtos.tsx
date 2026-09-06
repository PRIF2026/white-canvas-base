import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader, SectionCard, Selo, SeloLegenda } from "@/components/cgs/ui-bits";
import { BarcodeScanner } from "@/components/cgs/barcode-scanner";
import { brl, SELOS, seloPorPreco } from "@/lib/cgs-data";
import { supabase } from "@/integrations/supabase/client";
import { cgsKeys, getErrorMessage, useLojas, useProdutos } from "@/lib/cgs-db";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Cadastro de produtos de perfumaria com leitor de código de barras e selo calculado automaticamente pelo preço." },
      { property: "og:title", content: "Produtos · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Cadastro de produtos com leitor de código de barras e selo automático." },
    ],
  }),
  component: Produtos,
});

const vazio = { ean: "", nome: "", marca: "", categoria: "", preco: "", estoque: "", loja: "" };

const CAMPOS_BUSCA = [
  { key: "ean", label: "Código de barras" },
  { key: "nome", label: "Nome do produto" },
  { key: "marca", label: "Marca" },
  { key: "categoria", label: "Categoria" },
  { key: "preco", label: "Preço (R$)" },
  { key: "estoque", label: "Estoque" },
  { key: "loja", label: "Loja" },
] as const;
type CampoBusca = (typeof CAMPOS_BUSCA)[number]["key"];


function Produtos() {
  const queryClient = useQueryClient();
  const produtosQuery = useProdutos();
  const lojasQuery = useLojas();
  const lojas = lojasQuery.data ?? [];
  const produtos = (produtosQuery.data ?? []).map((p) => ({
    id: p.id, codigo: p.id.slice(0, 8).toUpperCase(), ean: p.codigo_barras ?? "—", nome: p.nome,
    marca: p.marca ?? "—", categoria: p.categoria ?? "—", preco: Number(p.preco), estoque: p.estoque,
    loja: p.lojas?.nome ?? "—", lojaId: p.loja_id,
  }));
  const [busca, setBusca] = useState("");
  const [loja, setLoja] = useState("Todas");
  const [preco, setPreco] = useState("2,00");
  const [form, setForm] = useState({ ...vazio });

  const lista = useMemo(
    () =>
      produtos.filter(
        (p) =>
          (loja === "Todas" || p.loja === loja) &&
          (p.nome.toLowerCase().includes(busca.toLowerCase()) ||
            p.codigo.toLowerCase().includes(busca.toLowerCase()) ||
            p.ean.includes(busca)),
      ),
    [produtos, busca, loja],
  );

  const numero = (v: string) => Number(v.replace(/\./g, "").replace(",", ".")) || 0;
  const simulado = seloPorPreco(numero(preco));
  const seloNovo = seloPorPreco(numero(form.preco));
  const podeSalvar = form.nome.trim() !== "" && form.ean.trim() !== "" && numero(form.preco) > 0;

  const cadastro = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("produtos").insert({
        codigo_barras: form.ean.trim(), nome: form.nome.trim(), marca: form.marca.trim() || null,
        categoria: form.categoria.trim() || "Perfumaria", preco: numero(form.preco),
        estoque: Number(form.estoque) || 0, selo: seloNovo, loja_id: form.loja || null,
      });
      if (error) throw error;
    },
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: cgsKeys.produtos }); setForm({ ...vazio }); toast.success("Produto cadastrado."); },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const [painelEdicao, setPainelEdicao] = useState(false);
  const [campoBusca, setCampoBusca] = useState<CampoBusca>("nome");
  const [termo, setTermo] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ ...vazio });
  const seloEdit = seloPorPreco(numero(edit.preco));

  const resultados = useMemo(() => {
    const t = termo.trim().toLowerCase();
    if (t === "") return [];
    return produtos.filter((p) => {
      const valor =
        campoBusca === "preco" ? String(p.preco).replace(".", ",")
        : campoBusca === "estoque" ? String(p.estoque)
        : String(p[campoBusca] ?? "");
      return valor.toLowerCase().includes(t);
    });
  }, [produtos, termo, campoBusca]);

  const abrirFicha = (id: string) => {
    const p = produtos.find((x) => x.id === id);
    if (!p) return;
    setEditId(id);
    setEdit({
      ean: p.ean === "—" ? "" : p.ean,
      nome: p.nome,
      marca: p.marca === "—" ? "" : p.marca,
      categoria: p.categoria === "—" ? "" : p.categoria,
      preco: String(p.preco).replace(".", ","),
      estoque: String(p.estoque),
      loja: p.lojaId ?? "",
    });
  };

  const atualizacao = useMutation({
    mutationFn: async () => {
      if (!editId) return;
      const { error } = await supabase.from("produtos").update({
        codigo_barras: edit.ean.trim() || null, nome: edit.nome.trim(), marca: edit.marca.trim() || null,
        categoria: edit.categoria.trim() || "Perfumaria", preco: numero(edit.preco),
        estoque: Number(edit.estoque) || 0, selo: seloEdit, loja_id: edit.loja || null,
      }).eq("id", editId);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cgsKeys.produtos });
      setEditId(null); setTermo("");
      toast.success("Produto atualizado.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });



  return (
    <>
      <PageHeader titulo="Cadastro de produtos" descricao="Leia o código de barras e o selo/pontuação são calculados automaticamente pelo preço." />

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard titulo="Novo produto" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-xs text-muted-foreground sm:col-span-2">
              Código de barras
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <input
                  value={form.ean}
                  onChange={(e) => setForm({ ...form, ean: e.target.value })}
                  placeholder="Bipe ou digite o código"
                  className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
                <BarcodeScanner onDetect={(c) => setForm((f) => ({ ...f, ean: c }))} />
              </div>
            </label>
            <label className="block text-xs text-muted-foreground">
              Nome do produto
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </label>
            <label className="block text-xs text-muted-foreground">
              Marca
              <input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </label>
            <label className="block text-xs text-muted-foreground">
              Categoria
              <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </label>
            <label className="block text-xs text-muted-foreground">
              Preço (R$)
              <input value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="0,00" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </label>
            <label className="block text-xs text-muted-foreground">
              Estoque
              <input type="number" min={0} value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
            </label>
            <label className="block text-xs text-muted-foreground">
              Loja
              <select value={form.loja} onChange={(e) => setForm({ ...form, loja: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
                <option value="">Selecione</option>{lojas.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <Selo n={seloNovo} size="lg" />
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-foreground">Selo {seloNovo} — {SELOS[seloNovo - 1]?.nome}</p>
                <p className="text-xs text-muted-foreground">{SELOS[seloNovo - 1]?.faixa}</p>
              </div>
            </div>
            <Button onClick={() => cadastro.mutate()} disabled={!podeSalvar || cadastro.isPending}>{cadastro.isPending ? "Salvando..." : "Cadastrar produto"}</Button>
          </div>
        </SectionCard>

        <SectionCard titulo="Simulador de selo">
          <label className="text-xs font-medium text-muted-foreground">Preço do produto (R$)</label>
          <input
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border p-3">
            <Selo n={simulado} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Selo {simulado} — {SELOS[simulado - 1]?.nome}</p>
              <p className="text-xs text-muted-foreground">{SELOS[simulado - 1]?.faixa}</p>
              <p className="text-xs text-muted-foreground">Pontuação gerada: <strong>{simulado}</strong></p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        titulo="Editar produto"
        acao={
          <Button variant={painelEdicao ? "secondary" : "default"} onClick={() => { setPainelEdicao((v) => !v); setEditId(null); }}>
            {painelEdicao ? "Fechar edição" : "Editar produto"}
          </Button>
        }
      >
        {!painelEdicao ? (
          <p className="text-sm text-muted-foreground">Clique em “Editar produto” para pesquisar um produto cadastrado e alterar seus dados.</p>
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
                  <p className="p-3 text-sm text-muted-foreground">Nenhum produto encontrado.</p>
                ) : (
                  resultados.slice(0, 12).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => abrirFicha(p.id)}
                      className="flex w-full items-center justify-between gap-3 border-b border-border/60 px-3 py-2 text-left text-sm last:border-0 hover:bg-muted/60"
                    >
                      <span className="font-medium text-foreground">{p.nome}</span>
                      <span className="text-xs text-muted-foreground">{p.marca} · {p.ean} · {brl(p.preco)} · {p.loja}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {editId && (
              <div className="rounded-lg border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="block text-xs text-muted-foreground sm:col-span-2">
                    Código de barras
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <input value={edit.ean} onChange={(e) => setEdit({ ...edit, ean: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
                      <BarcodeScanner onDetect={(c) => setEdit((f) => ({ ...f, ean: c }))} />
                    </div>
                  </label>
                  <label className="block text-xs text-muted-foreground">
                    Nome do produto
                    <input value={edit.nome} onChange={(e) => setEdit({ ...edit, nome: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="block text-xs text-muted-foreground">
                    Marca
                    <input value={edit.marca} onChange={(e) => setEdit({ ...edit, marca: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="block text-xs text-muted-foreground">
                    Categoria
                    <input value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="block text-xs text-muted-foreground">
                    Preço (R$)
                    <input value={edit.preco} onChange={(e) => setEdit({ ...edit, preco: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="block text-xs text-muted-foreground">
                    Estoque
                    <input type="number" min={0} value={edit.estoque} onChange={(e) => setEdit({ ...edit, estoque: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
                  </label>
                  <label className="block text-xs text-muted-foreground">
                    Loja
                    <select value={edit.loja} onChange={(e) => setEdit({ ...edit, loja: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
                      <option value="">Selecione</option>{lojas.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
                    </select>
                  </label>
                </div>
                <p className="mt-3 rounded-md bg-selo-3/25 px-2 py-1.5 text-xs font-medium text-foreground">
                  O novo preço vale apenas para as compras feitas a partir de agora. As vendas já registradas e os pontos que os clientes receberam antes da alteração permanecem como estavam.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">

                  <div className="flex items-center gap-3">
                    <Selo n={seloEdit} size="lg" />
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold text-foreground">Selo {seloEdit} — {SELOS[seloEdit - 1]?.nome}</p>
                      <p className="text-xs text-muted-foreground">{SELOS[seloEdit - 1]?.faixa}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditId(null)}>Cancelar</Button>
                    <Button onClick={() => atualizacao.mutate()} disabled={edit.nome.trim() === "" || numero(edit.preco) <= 0 || atualizacao.isPending}>
                      {atualizacao.isPending ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      <SectionCard titulo="Faixas de preço e pontuação">

        <SeloLegenda />
      </SectionCard>

      <SectionCard
        titulo={`Produtos participantes (${lista.length})`}
        acao={
          <div className="flex flex-wrap items-center gap-2">
            <input
              placeholder="Buscar nome, código ou EAN"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-44 rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
            />
            <select
              value={loja}
              onChange={(e) => setLoja(e.target.value)}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
            >
              <option>Todas</option>
               {lojas.map((l) => <option key={l.id}>{l.nome}</option>)}
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">Código</th>
                <th className="py-2 pr-3">Cód. barras</th>
                <th className="py-2 pr-3">Produto</th>
                <th className="py-2 pr-3">Marca</th>
                <th className="py-2 pr-3">Categoria</th>
                <th className="py-2 pr-3">Preço</th>
                <th className="py-2 pr-3">Selo</th>
                <th className="py-2 pr-3">Pontos</th>
                <th className="py-2 pr-3">Estoque</th>
                <th className="py-2">Loja</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => {
                const s = seloPorPreco(p.preco);
                return (
                  <tr key={p.codigo} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-3 font-mono text-xs">{p.codigo}</td>
                    <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">{p.ean}</td>
                    <td className="py-2.5 pr-3 font-medium">{p.nome}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{p.marca}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{p.categoria}</td>
                    <td className="py-2.5 pr-3">{brl(p.preco)}</td>
                    <td className="py-2.5 pr-3"><Selo n={s} size="sm" /></td>
                    <td className="py-2.5 pr-3 font-semibold">{s}</td>
                    <td className="py-2.5 pr-3">{p.estoque}</td>
                    <td className="py-2.5 text-muted-foreground">{p.loja}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </>
  );
}
