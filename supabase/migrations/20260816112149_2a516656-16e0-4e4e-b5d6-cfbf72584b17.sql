ALTER TABLE public.produtos
  ADD COLUMN marca text,
  ADD COLUMN loja_id uuid REFERENCES public.lojas(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.registrar_venda(
  p_cliente_id uuid,
  p_produto_id uuid,
  p_loja_id uuid,
  p_quantidade integer
)
RETURNS public.vendas
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_produto public.produtos%ROWTYPE;
  v_pontos integer;
  v_venda public.vendas%ROWTYPE;
  v_total numeric(10,2);
  v_quantidade_selos integer;
BEGIN
  IF p_quantidade < 1 THEN
    RAISE EXCEPTION 'A quantidade deve ser maior que zero';
  END IF;

  SELECT * INTO v_produto
  FROM public.produtos
  WHERE id = p_produto_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Produto não encontrado';
  END IF;

  IF v_produto.estoque < p_quantidade THEN
    RAISE EXCEPTION 'Estoque insuficiente';
  END IF;

  PERFORM 1 FROM public.clientes WHERE id = p_cliente_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cliente não encontrado';
  END IF;

  PERFORM 1 FROM public.lojas WHERE id = p_loja_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Loja não encontrada';
  END IF;

  v_quantidade_selos := CASE WHEN p_quantidade >= 4 THEN 1 ELSE p_quantidade END;
  v_pontos := v_produto.selo * v_quantidade_selos;
  v_total := v_produto.preco * p_quantidade;

  INSERT INTO public.vendas (
    cliente_id, produto_id, loja_id, quantidade, valor_unitario, selo, pontos
  ) VALUES (
    p_cliente_id, p_produto_id, p_loja_id, p_quantidade, v_produto.preco, v_produto.selo, v_pontos
  ) RETURNING * INTO v_venda;

  INSERT INTO public.selos_cliente (cliente_id, venda_id, selo, data)
  SELECT p_cliente_id, v_venda.id, v_produto.selo, v_venda.data
  FROM generate_series(1, v_quantidade_selos);

  UPDATE public.clientes
  SET pontos = pontos + v_pontos,
      valor_gasto = valor_gasto + v_total
  WHERE id = p_cliente_id;

  UPDATE public.produtos
  SET estoque = estoque - p_quantidade
  WHERE id = p_produto_id;

  RETURN v_venda;
END;
$$;

GRANT EXECUTE ON FUNCTION public.registrar_venda(uuid, uuid, uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.registrar_venda(uuid, uuid, uuid, integer) TO service_role;