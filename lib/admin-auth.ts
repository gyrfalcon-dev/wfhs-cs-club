import { NextResponse } from "next/server";
import { getBaseUrl, isSupabaseConfigured } from "@/lib/env";
import { isAdminEmailAllowed } from "@/lib/content-store";
import { createSupabasePublicClient } from "@/lib/supabase/client";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export type AdminIdentity = {
  email: string;
  userId: string;
};

export const getAdminIdentity = async (): Promise<AdminIdentity | null> => {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.trim().toLowerCase();
  if (!user?.id || !email) {
    return null;
  }

  if (!(await isAdminEmailAllowed(email))) {
    return null;
  }

  return {
    email,
    userId: user.id,
  };
};

export const sendAdminMagicLink = async (email: string) => {
  const normalized = email.trim().toLowerCase();

  if (!(await isAdminEmailAllowed(normalized))) {
    throw new Error("That email is not approved for the admin dashboard.");
  }

  const supabase = createSupabasePublicClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback?next=/admin`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const redirectToAdminLogin = (request: Request, message = "signin") => {
  const url = new URL("/admin", request.url);
  url.searchParams.set("state", message);
  return NextResponse.redirect(url);
};
