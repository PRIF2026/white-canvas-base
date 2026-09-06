export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          associado: string | null
          cadastro: string
          carteira: string | null
          cpf: string | null
          created_at: string
          data_sorteada: string | null
          email: string | null
          endereco: string | null
          id: string
          nascimento: string | null
          nome: string
          numero_sorteado: number | null
          pontos: number
          programada: boolean
          telefone: string | null
          valor_gasto: number
        }
        Insert: {
          associado?: string | null
          cadastro?: string
          carteira?: string | null
          cpf?: string | null
          created_at?: string
          data_sorteada?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nascimento?: string | null
          nome: string
          numero_sorteado?: number | null
          pontos?: number
          programada?: boolean
          telefone?: string | null
          valor_gasto?: number
        }
        Update: {
          associado?: string | null
          cadastro?: string
          carteira?: string | null
          cpf?: string | null
          created_at?: string
          data_sorteada?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nascimento?: string | null
          nome?: string
          numero_sorteado?: number | null
          pontos?: number
          programada?: boolean
          telefone?: string | null
          valor_gasto?: number
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          valor: string
        }
        Insert: {
          chave: string
          valor: string
        }
        Update: {
          chave?: string
          valor?: string
        }
        Relationships: []
      }
      lojas: {
        Row: {
          created_at: string
          id: string
          nome: string
          numero: number
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          numero: number
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          numero?: number
        }
        Relationships: []
      }
      produtos: {
        Row: {
          categoria: string | null
          codigo_barras: string | null
          created_at: string
          estoque: number
          id: string
          loja_id: string | null
          marca: string | null
          nome: string
          preco: number
          selo: number
        }
        Insert: {
          categoria?: string | null
          codigo_barras?: string | null
          created_at?: string
          estoque?: number
          id?: string
          loja_id?: string | null
          marca?: string | null
          nome: string
          preco?: number
          selo?: number
        }
        Update: {
          categoria?: string | null
          codigo_barras?: string | null
          created_at?: string
          estoque?: number
          id?: string
          loja_id?: string | null
          marca?: string | null
          nome?: string
          preco?: number
          selo?: number
        }
        Relationships: [
          {
            foreignKeyName: "produtos_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
          },
        ]
      }
      selos_cliente: {
        Row: {
          cliente_id: string
          created_at: string
          data: string
          id: string
          selo: number
          venda_id: string | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data?: string
          id?: string
          selo: number
          venda_id?: string | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data?: string
          id?: string
          selo?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "selos_cliente_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "selos_cliente_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      sorteios: {
        Row: {
          carteira: string | null
          cliente_id: string | null
          created_at: string
          data_sorteio: string
          ganhadores: number
          id: string
          mes_referencia: string | null
          modalidade: string
          numero: number
          previsao_pagamento: string | null
          status_premio: string
          valor_original: number
        }
        Insert: {
          carteira?: string | null
          cliente_id?: string | null
          created_at?: string
          data_sorteio?: string
          ganhadores?: number
          id?: string
          mes_referencia?: string | null
          modalidade?: string
          numero: number
          previsao_pagamento?: string | null
          status_premio?: string
          valor_original?: number
        }
        Update: {
          carteira?: string | null
          cliente_id?: string | null
          created_at?: string
          data_sorteio?: string
          ganhadores?: number
          id?: string
          mes_referencia?: string | null
          modalidade?: string
          numero?: number
          previsao_pagamento?: string | null
          status_premio?: string
          valor_original?: number
        }
        Relationships: [
          {
            foreignKeyName: "sorteios_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      valores_dia: {
        Row: {
          dia: number
          valor: number
        }
        Insert: {
          dia: number
          valor?: number
        }
        Update: {
          dia?: number
          valor?: number
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente_id: string | null
          created_at: string
          data: string
          id: string
          loja_id: string | null
          pontos: number
          produto_id: string | null
          quantidade: number
          selo: number
          valor_unitario: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data?: string
          id?: string
          loja_id?: string | null
          pontos?: number
          produto_id?: string | null
          quantidade?: number
          selo?: number
          valor_unitario?: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data?: string
          id?: string
          loja_id?: string | null
          pontos?: number
          produto_id?: string | null
          quantidade?: number
          selo?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_loja_id_fkey"
            columns: ["loja_id"]
            isOneToOne: false
            referencedRelation: "lojas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      registrar_venda: {
        Args: {
          p_cliente_id: string
          p_loja_id: string
          p_produto_id: string
          p_quantidade: number
        }
        Returns: {
          cliente_id: string | null
          created_at: string
          data: string
          id: string
          loja_id: string | null
          pontos: number
          produto_id: string | null
          quantidade: number
          selo: number
          valor_unitario: number
        }
        SetofOptions: {
          from: "*"
          to: "vendas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
