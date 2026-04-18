import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { convertResponseToDraftContent } from "@/lib/opportunities";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { id } = await params;

  try {
    const entry = await convertResponseToDraftContent(id);
    return NextResponse.redirect(
      new URL(`/admin/entries/${entry.id}?state=converted`, request.url),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not convert response.";
    return NextResponse.redirect(
      new URL(`/admin/opportunities?state=${encodeURIComponent(message)}`, request.url),
    );
  }
}
