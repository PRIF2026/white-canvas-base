CREATE TABLE public.lojas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  numero int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lojas TO authenticated;
GRANT ALL ON public.lojas TO service_role;
ALTER TABLE public.lojas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lojas_auth_all" ON public.lojas FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_barras text UNIQUE,
  nome text NOT NULL,
  categoria text,
  preco numeric(10,2) NOT NULL DEFAULT 0,
  selo int NOT NULL DEFAULT 1 CHECK (selo BETWEEN 1 AND 7),
  estoque int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "produtos_auth_all" ON public.produtos FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  associado text,
  cpf text,
  telefone text,
  email text,
  nascimento date,
  endereco text,
  carteira text UNIQUE,
  cadastro date NOT NULL DEFAULT current_date,
  pontos int NOT NULL DEFAULT 0,
  valor_gasto numeric(10,2) NOT NULL DEFAULT 0,
  programada boolean NOT NULL DEFAULT false,
  data_sorteada date,
  numero_sorteado int CHECK (numero_sorteado BETWEEN 1 AND 31),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clientes_auth_all" ON public.clientes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.vendas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL,
  produto_id uuid REFERENCES public.produtos(id) ON DELETE SET NULL,
  loja_id uuid REFERENCES public.lojas(id) ON DELETE SET NULL,
  data date NOT NULL DEFAULT current_date,
  quantidade int NOT NULL DEFAULT 1,
  valor_unitario numeric(10,2) NOT NULL DEFAULT 0,
  selo int NOT NULL DEFAULT 1 CHECK (selo BETWEEN 1 AND 7),
  pontos int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendas TO authenticated;
GRANT ALL ON public.vendas TO service_role;
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vendas_auth_all" ON public.vendas FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.selos_cliente (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  venda_id uuid REFERENCES public.vendas(id) ON DELETE SET NULL,
  selo int NOT NULL CHECK (selo BETWEEN 1 AND 7),
  data date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.selos_cliente TO authenticated;
GRANT ALL ON public.selos_cliente TO service_role;
ALTER TABLE public.selos_cliente ENABLE ROW LEVEL SECURITY;
CREATE POLICY "selos_auth_all" ON public.selos_cliente FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.sorteios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL,
  carteira text,
  numero int NOT NULL CHECK (numero BETWEEN 1 AND 31),
  mes_referencia text,
  modalidade text NOT NULL DEFAULT '50-pontos',
  data_sorteio date NOT NULL DEFAULT current_date,
  valor_original numeric(10,2) NOT NULL DEFAULT 0,
  ganhadores int NOT NULL DEFAULT 1,
  previsao_pagamento date,
  status_premio text NOT NULL DEFAULT 'Aguardando pagamento',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sorteios TO authenticated;
GRANT ALL ON public.sorteios TO service_role;
ALTER TABLE public.sorteios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sorteios_auth_all" ON public.sorteios FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.valores_dia (
  dia int PRIMARY KEY CHECK (dia BETWEEN 1 AND 31),
  valor numeric(10,2) NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.valores_dia TO authenticated;
GRANT ALL ON public.valores_dia TO service_role;
ALTER TABLE public.valores_dia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "valores_auth_all" ON public.valores_dia FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.configuracoes (
  chave text PRIMARY KEY,
  valor text NOT NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.configuracoes TO authenticated;
GRANT ALL ON public.configuracoes TO service_role;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config_auth_all" ON public.configuracoes FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.lojas (nome, numero) VALUES ('Loja 1',1),('Loja 2',2),('Loja 3',3),('Loja 4',4);
INSERT INTO public.configuracoes (chave, valor) VALUES
 ('meta_pontos','50'),
 ('minimo_valor_cartela','35.00'),
 ('percentual_receita','10');
INSERT INTO public.valores_dia (dia, valor) VALUES
 (1,250),(2,32),(3,148),(4,935),(5,720),(6,400),(7,97),(8,1125),(9,129),(10,78),
 (11,300),(12,215),(13,64),(14,880),(15,1500),(16,120),(17,340),(18,95),(19,410),(20,760),
 (21,180),(22,55),(23,990),(24,270),(25,133),(26,620),(27,88),(28,450),(29,205),(30,710),(31,160);