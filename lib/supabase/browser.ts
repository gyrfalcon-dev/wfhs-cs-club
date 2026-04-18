"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseConfigured, supabaseConfig } from "@/lib/supabase/config";

export const createSupabaseBrowserClient = () => {
  assertSupabaseConfigured();
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
};
