import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="grid min-h-screen place-items-center bg-background"><LoaderCircle className="h-7 w-7 animate-spin text-primary" /></div>;
  }
  if (session) return children;

  const enviar = async (event: React.FormEvent) => {
    event.preventDefault();
    setEntrando(true);
    setErro("");
    setAviso("");

    if (modo === "criar") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        setErro(error.message);
      } else if (!data.session) {
        setAviso("Conta criada. Verifique seu e-mail para confirmar o acesso.");
        setModo("entrar");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error) {
        setErro(
          error.message.toLowerCase().includes("invalid")
            ? "E-mail ou senha inválidos. Se ainda não tem acesso, crie uma conta."
            : error.message,
        );
      }
    }
    setEntrando(false);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4">
      <section className="w-full max-w-sm border border-border bg-card p-6 shadow-lg">
        <div className="rainbow-bar mb-5 h-1.5 w-full" />
        <h1 className="font-display text-xl font-bold text-foreground">PROJETO 7 CORES – CGS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {modo === "entrar" ? "Acesso ao painel administrativo" : "Criar acesso ao painel administrativo"}
        </p>
        <form className="mt-6 space-y-4" onSubmit={enviar}>
          <label className="block text-xs text-muted-foreground">E-mail
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
          </label>
          <label className="block text-xs text-muted-foreground">Senha
            <input type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" />
          </label>
          {erro ? <p className="text-xs font-medium text-destructive">{erro}</p> : null}
          {aviso ? <p className="text-xs font-medium text-primary">{aviso}</p> : null}
          <Button type="submit" disabled={entrando} className="w-full">
            {modo === "entrar" ? <LogIn /> : <UserPlus />}
            {entrando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
          </Button>
          <button
            type="button"
            className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
            onClick={() => { setModo(modo === "entrar" ? "criar" : "entrar"); setErro(""); setAviso(""); }}
          >
            {modo === "entrar" ? "Não tem acesso? Criar uma conta" : "Já tem acesso? Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}