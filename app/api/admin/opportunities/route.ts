import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { createOpportunity, parseOpportunityAdminForm } from "@/lib/opportunities";
import { setRedirectToast } from "@/lib/redirect-toast";

export async function POST(request: Request) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const formData = await request.formData();
  const parsed = parseOpportunityAdminForm(formData);

  if (!parsed.ok) {
    return NextResponse.redirect(
      setRedirectToast(
        new URL("/admin/opportunities", request.url),
        "error",
        parsed.error,
      ),
    );
  }

  const opportunity = await createOpportunity(parsed.values);
  return NextResponse.redirect(
    setRedirectToast(
      new URL(`/admin/opportunities/${opportunity.id}`, request.url),
      "success",
      "Opportunity created.",
    ),
  );
}
