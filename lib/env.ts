const getEnv = (key: string) => process.env[key]?.trim() || "";

export const env = {
  supabaseUrl: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  siteUrl: getEnv("NEXT_PUBLIC_SITE_URL"),
  supabaseStorageBucket: getEnv("SUPABASE_STORAGE_BUCKET"),
  adminEmailAllowlist: getEnv("ADMIN_EMAIL_ALLOWLIST"),
};

export const isSupabaseConfigured =
  Boolean(env.supabaseUrl) &&
  Boolean(env.supabaseAnonKey) &&
  Boolean(env.supabaseServiceRoleKey);

export const getBaseUrl = () => env.siteUrl || "http://localhost:3000";

export const getStaticAdminAllowlist = () =>
  env.adminEmailAllowlist
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
