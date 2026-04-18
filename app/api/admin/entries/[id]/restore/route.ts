import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { restoreEntryVersion } from "@/lib/content-store";
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
  const versionId = String(formData.get("versionId") || "");

  if (!versionId) {
    return NextResponse.redirect(
      setRedirectToast(
        new URL(`/admin/entries/${id}`, request.url),
        "error",
        "Select a version to restore.",
      ),
    );
  }

  await restoreEntryVersion(id, versionId, admin.email);
  return NextResponse.redirect(
    setRedirectToast(
      new URL(`/admin/entries/${id}`, request.url),
      "success",
      "Version restored.",
    ),
  );
}
