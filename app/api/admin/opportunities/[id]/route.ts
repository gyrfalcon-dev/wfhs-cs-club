import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { parseOpportunityAdminForm, updateOpportunity } from "@/lib/opportunities";
import { setRedirectToast } from "@/lib/redirect-toast";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { id } = await params;
  const formData = await request.formData();
  const parsed = parseOpportunityAdminForm(formData);

  if (!parsed.ok) {
    return NextResponse.redirect(
      setRedirectToast(
        new URL(`/admin/opportunities/${id}`, request.url),
        "error",
        parsed.error,
      ),
    );
  }

  await updateOpportunity(id, parsed.values);
  return NextResponse.redirect(
    setRedirectToast(
      new URL(`/admin/opportunities/${id}`, request.url),
      "success",
      "Opportunity saved.",
    ),
  );
}
