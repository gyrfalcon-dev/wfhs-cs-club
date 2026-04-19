import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { createOpportunity, parseOpportunityAdminForm } from "@/lib/opportunities";
import { setRedirectToast } from "@/lib/redirect-toast";

function getFriendlyOpportunityError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Unable to create opportunity.";
  const lower = message.toLowerCase();

  if (lower.includes("duplicate key") || lower.includes("opportunities_slug_key")) {
    return "That slug is already in use. Choose a different slug.";
  }

  if (lower.includes("violates") || lower.includes("constraint")) {
    return "Some values are invalid. Check required fields and try again.";
  }

  if (lower.includes("supabase")) {
    return "Could not reach the database. Please try again in a moment.";
  }

  return message;
}

export async function POST(request: Request) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const formData = await request.formData();
  const parsed = parseOpportunityAdminForm(formData);

  if (!parsed.ok) {
    const retryUrl = new URL("/admin/opportunities/new", request.url);
    retryUrl.searchParams.set("restoreDraft", "1");
    return NextResponse.redirect(
      setRedirectToast(
        retryUrl,
        "error",
        parsed.error,
        "opportunity-editor",
      ),
    );
  }

  try {
    const opportunity = await createOpportunity(parsed.values);
    return NextResponse.redirect(
      setRedirectToast(
        new URL("/admin/opportunities", request.url),
        "success",
        `Opportunity created: ${opportunity.title}`,
        "opportunity-editor",
      ),
    );
  } catch (error) {
    const retryUrl = new URL("/admin/opportunities/new", request.url);
    retryUrl.searchParams.set("restoreDraft", "1");
    return NextResponse.redirect(
      setRedirectToast(
        retryUrl,
        "error",
        getFriendlyOpportunityError(error),
        "opportunity-editor",
      ),
    );
  }
}
