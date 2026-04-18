import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/env";
import { supabaseConfig } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") || "/admin";

  if (!isSupabaseConfigured || (!code && !tokenHash)) {
    return NextResponse.redirect(new URL("/admin?state=invalid-link", request.url));
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookieList) {
        cookieList.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type:
          type === "recovery" ||
          type === "invite" ||
          type === "email_change"
            ? type
            : "email",
      });

  if (error) {
    return NextResponse.redirect(new URL("/admin?state=invalid-link", request.url));
  }

  return response;
}
