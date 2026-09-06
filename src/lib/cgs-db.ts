import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const cgsKeys = {
  all: ["cgs"] as const,
  clientes: ["cgs", "clientes"] as const,
  produtos: ["cgs", "produtos"] as const,
  lojas: ["cgs", "lojas"] as const,
  vendas: ["cgs", "vendas"] as const,
  sorteios: ["cgs", "sorteios"] as const,
};

async function selectOrThrow<T>(request: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await request;
  if (error) throw new Error(error.message);
  return data ?? ([] as T);
}

export function useLojas() {
  return useQuery({
    queryKey: cgsKeys.lojas,
    queryFn: () => selectOrThrow(supabase.from("lojas").select("*").order("numero")),
  });
}

export function useProdutos() {
  return useQuery({
    queryKey: cgsKeys.produtos,
    queryFn: () => selectOrThrow(supabase.from("produtos").select("*, lojas(nome)").order("created_at", { ascending: false })),
  });
}

export function useClientes() {
  return useQuery({
    queryKey: cgsKeys.clientes,
    queryFn: () => selectOrThrow(supabase.from("clientes").select("*, selos_cliente(selo, data)").order("created_at", { ascending: false })),
  });
}

export function useVendas() {
  return useQuery({
    queryKey: cgsKeys.vendas,
    queryFn: () => selectOrThrow(supabase.from("vendas").select("*, clientes(nome), produtos(nome), lojas(nome)").order("created_at", { ascending: false })),
  });
}

export function useSorteios() {
  return useQuery({
    queryKey: cgsKeys.sorteios,
    queryFn: () => selectOrThrow(supabase.from("sorteios").select("*, clientes(nome)").order("created_at", { ascending: false })),
  });
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível concluir a operação.";
}