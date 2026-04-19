import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmailAllowed } from "@/lib/content-store";
import { isSupabaseConfigured } from "@/lib/env";
import { setRedirectToast } from "@/lib/redirect-toast";
import { supabaseConfig } from "@/lib/supabase/config";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const redirectUrl = new URL("/admin", request.url);

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "warn",
        "Supabase is not configured yet. Add the required environment variables first.",
        "admin-auth",
      ),
    );
  }

  if (!email || !password) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "error",
        "Enter your email and password to continue.",
        "admin-auth",
      ),
    );
  }

  if (!(await isAdminEmailAllowed(email))) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "error",
        "This account is not approved for the admin dashboard.",
        "admin-auth",
      ),
    );
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "error",
        mapAdminLoginError(error.message),
        "admin-auth",
      ),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !(await isAdminEmailAllowed(user.email))) {
    await supabase.auth.signOut();
    response.headers.set(
      "Location",
      setRedirectToast(
        new URL("/admin", request.url),
        "error",
        "This account is not approved for the admin dashboard.",
        "admin-auth",
      ).toString(),
    );
    return response;
  }

  response.headers.set(
    "Location",
    setRedirectToast(new URL("/admin", request.url), "success", "Signed in.", "admin-auth")
      .toString(),
  );
  return response;
}

function mapAdminLoginError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email or password was not recognized.";
  }

  if (normalized.includes("email not confirmed")) {
    return "This account still needs email confirmation in Supabase Auth.";
  }

  if (normalized.includes("rate limit")) {
    return "Too many sign-in attempts. Wait a moment and try again.";
  }

  if (normalized.includes("email")) {
    return "We could not sign in with that email address.";
  }

  return "Could not sign you in right now.";
}
