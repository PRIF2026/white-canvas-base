import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "./client";

export const attachSupabaseAuth = createMiddleware().client(async ({ next }) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    return next({
      sendContext: {
        authToken: session.access_token,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  }

  return next();
});
