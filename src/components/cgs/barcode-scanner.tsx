import { useEffect, useRef, useState } from "react";
import { Barcode, CameraOff, X } from "lucide-react";

type Props = { onDetect: (codigo: string) => void };

/** Leitor de código de barras: usa a câmera (BarcodeDetector) e aceita leitores USB/teclado. */
export function BarcodeScanner({ onDetect }: Props) {
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!aberto) return;
    let cancelado = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    (async () => {
      const Detector = (window as unknown as { BarcodeDetector?: any }).BarcodeDetector;
      if (!Detector) {
        setErro("Este navegador não suporta leitura por câmera. Use um leitor USB no campo de código de barras.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelado) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new Detector({
          formats: ["ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "itf"],
        });
        timer = setInterval(async () => {
          if (!videoRef.current) return;
          try {
            const found = await detector.detect(videoRef.current);
            const valor = found?.[0]?.rawValue;
            if (valor) {
              onDetect(String(valor));
              setAberto(false);
            }
          } catch {
            /* frame inválido, tenta de novo */
          }
        }, 350);
      } catch {
        setErro("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
      }
    })();

    return () => {
      cancelado = true;
      if (timer) clearInterval(timer);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [aberto, onDetect]);

  return (
    <>
      <button
        type="button"
        onClick={() => { setErro(null); setAberto(true); }}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"
      >
        <Barcode className="h-4 w-4" /> Ler código de barras
      </button>

      {aberto ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Leitor de código de barras</h3>
              <button type="button" onClick={() => setAberto(false)} aria-label="Fechar leitor">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              {erro ? (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CameraOff className="mt-0.5 h-4 w-4 shrink-0 text-selo-1" /> {erro}
                </p>
              ) : (
                <>
                  <video ref={videoRef} playsInline muted className="aspect-video w-full rounded-lg bg-muted object-cover" />
                  <p className="mt-2 text-xs text-muted-foreground">Aponte a câmera para o código de barras do produto.</p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
