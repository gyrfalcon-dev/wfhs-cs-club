import { env, isSupabaseConfigured } from "@/lib/env";

export const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase environment variables are not configured.");
  }
};

export const supabaseConfig = {
  url: env.supabaseUrl,
  anonKey: env.supabaseAnonKey,
  serviceRoleKey: env.supabaseServiceRoleKey,
};
