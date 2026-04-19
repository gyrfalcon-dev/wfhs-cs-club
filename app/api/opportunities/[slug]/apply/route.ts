import { NextResponse } from "next/server";
import { getRequestIp, rateLimitSubmission } from "@/lib/rate-limit";
import {
  createOpportunityResponse,
  getPublishedOpportunityBySlug,
  isOpportunityOpen,
  parseOpportunityResponseForm,
} from "@/lib/opportunities";
import { setRedirectToast } from "@/lib/redirect-toast";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const opportunity = await getPublishedOpportunityBySlug(slug);
  const redirectUrl = new URL(`/opportunities/${slug}`, request.url);

  if (!opportunity) {
    return NextResponse.redirect(
      setRedirectToast(redirectUrl, "error", "Opportunity not found.", `opportunity-${slug}`),
    );
  }

  if (!isOpportunityOpen(opportunity)) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "warn",
        "This opportunity is not accepting responses right now.",
        `opportunity-${slug}`,
      ),
    );
  }

  const formData = await request.formData();
  const parsed = parseOpportunityResponseForm(opportunity, formData);

  if (!parsed.ok) {
    return NextResponse.redirect(
      setRedirectToast(redirectUrl, "error", parsed.error, `opportunity-${slug}`),
    );
  }

  const ip = getRequestIp(request);
  const limit = rateLimitSubmission(`${ip}:opportunity:${opportunity.id}`);
  if (!limit.ok) {
    return NextResponse.redirect(
      setRedirectToast(
        redirectUrl,
        "error",
        "Too many responses from this network. Try again later.",
        `opportunity-${slug}`,
      ),
    );
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
    return NextResponse.redirect(
      setRedirectToast(redirectUrl, "error", message, `opportunity-${slug}`),
    );
  }

  return NextResponse.redirect(
    setRedirectToast(
      redirectUrl,
      "success",
      opportunity.success_message,
      `opportunity-${slug}`,
    ),
  );
}
