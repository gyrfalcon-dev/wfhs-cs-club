import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { convertResponseToDraftContent } from "@/lib/opportunities";
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
  const redirectTo = String(formData.get("redirectTo") || "/admin/responses");

  try {
    const entry = await convertResponseToDraftContent(id);
    return NextResponse.redirect(
      setRedirectToast(
        new URL(`/admin/entries/${entry.id}`, request.url),
        "success",
        "Response converted to a draft entry.",
        "opportunity-editor",
      ),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not convert response.";
    return NextResponse.redirect(
      setRedirectToast(
        new URL(redirectTo, request.url),
        "error",
        message,
        "response-review",
      ),
    );
  }
}
