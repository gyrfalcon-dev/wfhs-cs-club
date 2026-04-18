import { NextResponse } from "next/server";
import { getRequestIp, rateLimitSubmission } from "@/lib/rate-limit";
import {
  createOpportunityResponse,
  getPublishedOpportunityBySlug,
  isOpportunityOpen,
  parseOpportunityResponseForm,
} from "@/lib/opportunities";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const opportunity = await getPublishedOpportunityBySlug(slug);
  const redirectUrl = new URL(`/opportunities/${slug}`, request.url);

  if (!opportunity) {
    redirectUrl.searchParams.set("error", encodeURIComponent("Opportunity not found."));
    return NextResponse.redirect(redirectUrl);
  }

  if (!isOpportunityOpen(opportunity)) {
    redirectUrl.searchParams.set(
      "error",
      encodeURIComponent("This opportunity is not accepting responses right now."),
    );
    return NextResponse.redirect(redirectUrl);
  }

  const formData = await request.formData();
  const parsed = parseOpportunityResponseForm(opportunity, formData);

  if (!parsed.ok) {
    redirectUrl.searchParams.set("error", encodeURIComponent(parsed.error));
    return NextResponse.redirect(redirectUrl);
  }

  const ip = getRequestIp(request);
  const limit = rateLimitSubmission(`${ip}:opportunity:${opportunity.id}`);
  if (!limit.ok) {
    redirectUrl.searchParams.set(
      "error",
      encodeURIComponent("Too many responses from this network. Try again later."),
    );
    return NextResponse.redirect(redirectUrl);
  }

  try {
    await createOpportunityResponse({
      opportunityId: opportunity.id,
      name: parsed.values.name,
      email: parsed.values.email,
      payload: parsed.values.payload,
      sourceMetadata: {
        ip,
        userAgent: request.headers.get("user-agent") || "",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save your response.";
    redirectUrl.searchParams.set("error", encodeURIComponent(message));
    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.searchParams.set("state", "submitted");
  return NextResponse.redirect(redirectUrl);
}
