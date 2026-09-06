import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisivel(sessionStorage.getItem("cgs-install-dismissed") !== "1");
    };
    const onInstalled = () => setVisivel(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visivel || !deferred) return null;

  const instalar = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisivel(false);
  };

  const fechar = () => {
    sessionStorage.setItem("cgs-install-dismissed", "1");
    setVisivel(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cgs-install-titulo"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-xl border border-border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4"
    >
      <div className="h-1 w-full rounded-full rainbow-bar" />
      <div className="mt-3 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p id="cgs-install-titulo" className="font-display text-sm font-bold text-foreground">
            Instalar o CGS
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Adicione o PROJETO 7 CORES à tela inicial e abra como aplicativo.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={instalar}
              className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Instalar app
            </button>
            <button
              onClick={fechar}
              className="rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-accent"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
          onClick={fechar}
          aria-label="Fechar aviso de instalação"
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}