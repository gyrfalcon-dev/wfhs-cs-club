import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  assertSupabaseConfigured,
  supabaseConfig,
} from "@/lib/supabase/config";

export const createSupabaseServerComponentClient = async () => {
  assertSupabaseConfigured();
  const cookieStore = await cookies();

  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookieList) {
        try {
          cookieList.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can't always write cookies; Proxy/Route Handlers handle refreshes.
        }
      },
    },
  });
};
