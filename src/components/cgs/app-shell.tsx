import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Package, Users, ShoppingCart, Grid3x3, Dices,
  CalendarDays, Trophy, PiggyBank, FileBarChart, Settings, Menu, X, Bell, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/vendas", label: "Vendas", icon: ShoppingCart },
  { to: "/cartelas", label: "Cartelas", icon: Grid3x3 },
  { to: "/bingo", label: "Bingo", icon: Dices },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/premios", label: "Prêmios", icon: Trophy },
  { to: "/receita", label: "Fonte de Receita", icon: PiggyBank },
  { to: "/relatorios", label: "Relatórios", icon: FileBarChart },
  { to: "/administracao", label: "Administração", icon: Settings },
] as const;

function Marca() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <span className="grid shrink-0 grid-cols-4 gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <span
            key={n}
            className={cn("h-2 w-2 rounded-[2px]", `bg-selo-${n}`)}
          />
        ))}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-sm font-bold leading-tight text-sidebar-foreground">
          PROJETO 7 CORES
        </span>
        <span className="block truncate text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">
          CGS · Compre e Ganhe Sempre
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="h-1 w-full rainbow-bar" />
        <div className="border-b border-sidebar-border px-4 py-4">
          <Marca />
        </div>
        <div className="flex-1 overflow-y-auto">{links}</div>
        <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/60">
          ONG FARMACÊUTICA
          <div className="mt-1 text-sidebar-foreground/40">v1.0 · versão visual</div>
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar">
            <div className="h-1 w-full rainbow-bar" />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-sidebar-border px-4 py-4">
              <Marca />
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-md p-1 text-sidebar-foreground/70"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{links}</div>
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-border p-2 lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              ONG Farmacêutica · Promoção <span className="font-semibold text-foreground">Compre e Ganhe Sempre</span>
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <span className="relative hidden rounded-md border border-border p-2 sm:block">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-selo-1" />
              </span>
              <Button variant="ghost" size="icon" aria-label="Sair" title="Sair" onClick={() => void supabase.auth.signOut()}><LogOut /></Button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] space-y-6 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
