import { NextResponse } from "next/server";
import { sendAdminMagicLink } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/env";
import { setRedirectToast } from "@/lib/redirect-toast";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const redirectUrl = new URL("/admin", request.url);

  if (!isSupabaseConfigured) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "warn",
        "Supabase is not configured yet. Add the required environment variables first.",
      ),
    );
  }

  try {
    await sendAdminMagicLink(email);
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "success",
        "Magic link sent. Check your inbox for the sign-in email.",
      ),
    );
  } catch (error) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "error",
        error instanceof Error ? error.message : "Could not send sign-in link.",
      ),
    );
  }
}
