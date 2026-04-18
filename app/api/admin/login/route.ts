import { NextResponse } from "next/server";
import { sendAdminMagicLink } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/env";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const redirectUrl = new URL("/admin", request.url);

  if (!isSupabaseConfigured) {
    redirectUrl.searchParams.set("state", "missing-config");
    return NextResponse.redirect(redirectUrl);
  }

  try {
    await sendAdminMagicLink(email);
    redirectUrl.searchParams.set("state", "link-sent");
  } catch (error) {
    redirectUrl.searchParams.set(
      "state",
      error instanceof Error ? error.message : "Could not send sign-in link.",
    );
  }

  return NextResponse.redirect(redirectUrl);
}
