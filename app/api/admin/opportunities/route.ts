import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { createOpportunity, parseOpportunityAdminForm } from "@/lib/opportunities";

export async function POST(request: Request) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const formData = await request.formData();
  const parsed = parseOpportunityAdminForm(formData);

  if (!parsed.ok) {
    return NextResponse.redirect(
      new URL(`/admin/opportunities?state=${encodeURIComponent(parsed.error)}`, request.url),
    );
  }

  const opportunity = await createOpportunity(parsed.values);
  return NextResponse.redirect(
    new URL(`/admin/opportunities/${opportunity.id}?state=created`, request.url),
  );
}
