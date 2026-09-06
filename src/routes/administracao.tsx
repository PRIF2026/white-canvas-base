import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard, SeloLegenda } from "@/components/cgs/ui-bits";
import { brl, dataBr, LOGS, LOJAS, META_PONTOS, MINIMO_VALOR_CARTELA, MINIMO_VALOR_CARTELA_PADRAO, USUARIOS } from "@/lib/cgs-data";

export const Route = createFileRoute("/administracao")({
  head: () => ({
    meta: [
      { title: "Administração · PROJETO 7 CORES – CGS" },
      { name: "description", content: "Configuração de regras, filiais, usuários, níveis de acesso e log de operações da promoção." },
      { property: "og:title", content: "Administração · PROJETO 7 CORES – CGS" },
      { property: "og:description", content: "Regras, filiais, perfis de acesso e logs administrativos." },
    ],
  }),
  component: Administracao,
});

function Administracao() {
  return (
    <>
      <PageHeader titulo="Administração" descricao="Configure regras, filiais e usuários sem alterar o código do sistema." />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard titulo="Regras da promoção">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Meta de pontos da cartela", `${META_PONTOS} pontos`],
              ["Mínimo para sorteio", `${META_PONTOS} pontos`],
              ["Percentual destinado ao prêmio", "10%"],
              ["Somatório mínimo da cartela", brl(MINIMO_VALOR_CARTELA_PADRAO)],
              ["Unidades iguais que pontuam", "no máximo 2 selos"],
              ["Validade da apresentação", "somente no dia sorteado"],
            ].map(([k, v]) => (
              <label key={k} className="block text-xs text-muted-foreground">
                {k}
                <input defaultValue={v} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground" />
              </label>
            ))}
          </div>
          <button className="mt-4 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Salvar regras</button>

          <div className="mt-6 rounded-lg border border-border p-3">
            <h3 className="text-sm font-bold text-foreground">Regras da cartela programada</h3>
            <label className="mt-3 block text-xs text-muted-foreground">
              Mínimo acumulado no fundo (10% das compras) para a cartela programada
              <input defaultValue={brl(MINIMO_VALOR_CARTELA)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground" />
            </label>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>Com {brl(MINIMO_VALOR_CARTELA)} acumulados no fundo — ou seja, 10% do valor das compras — o cliente pode optar pela cartela programada e realizar o sorteio.</li>
              <li>Ao sortear a data, ele tem até o dia sorteado para completar os {META_PONTOS} pontos.</li>
              <li>Se não completar os pontos, não gostar do dia sorteado ou desistir, perde todos os pontos que já possui.</li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard titulo="Lojas / filiais">
          <ul className="space-y-2">
            {LOJAS.map((l, i) => (
              <li key={l} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3">
                <span className="min-w-0 truncate text-sm font-medium text-foreground">{l}</span>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: `var(--selo-${i + 1})` }}>ativa</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <SeloLegenda />
          </div>
        </SectionCard>
      </div>

      <SectionCard titulo="Usuários e níveis de acesso">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-3">Nome</th><th className="py-2 pr-3">Login</th><th className="py-2 pr-3">Perfil</th><th className="py-2">Permissões</th>
              </tr>
            </thead>
            <tbody>
              {USUARIOS.map((u) => (
                <tr key={u.email} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 pr-3 font-medium">{u.nome}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                  <td className="py-2.5 pr-3 font-semibold">{u.perfil}</td>
                  <td className="py-2.5 text-muted-foreground">{u.acessos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard titulo="Log de operações administrativas">
        <ul className="space-y-2">
          {LOGS.map((l) => (
            <li key={l.data} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border p-3 text-sm">
              <div className="min-w-0">
                <p className="truncate text-foreground">{l.acao}</p>
                <p className="text-xs text-muted-foreground">{dataBr(l.data)} · {l.usuario}</p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{l.nivel}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}
