import { createClient } from "@supabase/supabase-js";
import {
  assertSupabaseConfigured,
  supabaseConfig,
} from "@/lib/supabase/config";

export const createSupabaseAdminClient = () => {
  assertSupabaseConfigured();

  return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const createSupabasePublicClient = () => {
  assertSupabaseConfigured();

  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
