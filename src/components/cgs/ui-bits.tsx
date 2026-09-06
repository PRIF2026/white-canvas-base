import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SELOS, META_PONTOS, type SeloNumber } from "@/lib/cgs-data";

const SELO_BG: Record<number, string> = {
  1: "bg-selo-1", 2: "bg-selo-2", 3: "bg-selo-3", 4: "bg-selo-4",
  5: "bg-selo-5", 6: "bg-selo-6", 7: "bg-selo-7",
};

export function Selo({
  n,
  size = "md",
  faded = false,
  titulo,
}: {
  n: SeloNumber;
  size?: "sm" | "md" | "lg";
  faded?: boolean;
  titulo?: string;
}) {
  const sizes = {
    sm: "h-6 w-6 text-[11px]",
    md: "h-9 w-9 text-sm",
    lg: "h-14 w-14 text-lg",
  } as const;
  return (
    <span
      title={titulo ?? `Selo ${n} — ${SELOS[n - 1]?.nome} (${SELOS[n - 1]?.faixa})`}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-display font-bold text-white ring-2 ring-white/70",
        SELO_BG[n],
        sizes[size],
        faded && "opacity-25 grayscale",
      )}
    >
      {n}
    </span>
  );
}

export function SeloLegenda() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {SELOS.map((s) => (
        <div
          key={s.n}
          className="flex min-w-0 items-center gap-2 rounded-full border border-border bg-card px-2 py-1"
        >
          <Selo n={s.n} size="sm" />
          <span className="truncate text-xs text-muted-foreground">{s.faixa}</span>
        </div>
      ))}
    </div>
  );
}

export function ProgressoPontos({ pontos }: { pontos: number }) {
  const pct = Math.min(100, (pontos / META_PONTOS) * 100);
  const done = pontos >= META_PONTOS;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">
          {pontos} / {META_PONTOS} pontos
        </span>
        <span className={cn("font-semibold", done ? "text-success" : "text-muted-foreground")}>
          {done ? "META ATINGIDA" : `faltam ${META_PONTOS - pontos}`}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full rainbow-bar transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PageHeader({
  titulo,
  descricao,
  acoes,
}: {
  titulo: string;
  descricao: string;
  acoes?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border pb-5 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">{titulo}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
      </div>
      {acoes ? <div className="flex shrink-0 items-center gap-2">{acoes}</div> : null}
    </header>
  );
}

export function StatCard({
  label,
  valor,
  detalhe,
  accent = 6,
  icon,
}: {
  label: string;
  valor: string;
  detalhe?: string;
  accent?: SeloNumber;
  icon?: ReactNode;
}) {
  return (
    <div className="card-soft relative overflow-hidden rounded-xl border border-border bg-card p-4">
      <span className={cn("absolute inset-x-0 top-0 h-1", SELO_BG[accent])} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 font-display text-2xl font-bold text-foreground">{valor}</p>
          {detalhe ? <p className="mt-1 text-xs text-muted-foreground">{detalhe}</p> : null}
        </div>
        {icon ? <div className="shrink-0 text-muted-foreground">{icon}</div> : null}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Em andamento": "bg-selo-5/15 text-selo-6",
    "Pronta para sorteio": "bg-selo-4/15 text-selo-4",
    Sorteada: "bg-selo-6/15 text-selo-6",
    Premiada: "bg-selo-7/15 text-selo-7",
    "Prêmio recebido": "bg-selo-4/20 text-selo-4",
    Expirada: "bg-muted text-muted-foreground",
    Cancelada: "bg-selo-1/15 text-selo-1",
    Pago: "bg-selo-4/20 text-selo-4",
    "Aguardando pagamento": "bg-selo-2/20 text-selo-2",
    "Aguardando apresentação": "bg-selo-3/25 text-selo-2",
    Expirado: "bg-muted text-muted-foreground",
    Cancelado: "bg-selo-1/15 text-selo-1",
  };
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        map[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function SectionCard({
  titulo,
  acao,
  children,
  className,
}: {
  titulo: string;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-soft rounded-xl border border-border bg-card", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
        <h2 className="truncate text-sm font-semibold text-foreground">{titulo}</h2>
        {acao}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
