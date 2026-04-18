import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/env";
import { setRedirectToast } from "@/lib/redirect-toast";
import { supabaseConfig } from "@/lib/supabase/config";

export async function POST(request: Request) {
  const redirectUrl = setRedirectToast(
    new URL("/admin", request.url),
    "success",
    "Signed out.",
  );

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(redirectUrl);
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(redirectUrl);
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

  await supabase.auth.signOut();
  return response;
}
