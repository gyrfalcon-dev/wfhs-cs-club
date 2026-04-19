import { isSupabaseConfigured } from "@/lib/env";
import { isAdminEmailAllowed } from "@/lib/content-store";
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
