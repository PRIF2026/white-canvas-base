import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    return next({
      sendContext: token ? { authToken: token } : undefined,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  },
);
