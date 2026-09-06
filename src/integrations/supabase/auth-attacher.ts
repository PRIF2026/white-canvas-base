import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    const sendContext: { authToken: string } | undefined = token
      ? { authToken: token }
      : undefined;
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    return next({ sendContext, headers });
  },
);
