export type Database = {
  public: {
    Tables: {
      // Adicione suas tabelas aqui conforme necessário
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T];
