import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { setRedirectToast } from "@/lib/redirect-toast";

export async function GET(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.redirect(
    setRedirectToast(
      new URL("/admin", request.url),
      "warn",
      "Admin sign-in now uses email and password instead of email links.",
      "admin-auth",
    ),
  );
}
