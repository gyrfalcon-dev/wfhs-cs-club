import { NextResponse } from "next/server";
import { getAdminIdentity } from "@/lib/admin-auth";
import { deleteOpportunityById, setOpportunityState } from "@/lib/opportunities";
import { setRedirectToast } from "@/lib/redirect-toast";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : "Action failed.";
  const lower = message.toLowerCase();

  if (lower.includes("violates foreign key")) {
    return "Cannot delete this opportunity while responses exist. Archive it instead.";
  }

  if (lower.includes("not found")) {
    return "Opportunity not found.";
  }

  return message;
}

export async function POST(request: Request, { params }: RouteProps) {
  const admin = await getAdminIdentity();
  if (!admin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const { id } = await params;
  const formData = await request.formData();
  const action = String(formData.get("action") || "");
  const redirectTo = String(formData.get("redirectTo") || "/admin/opportunities");
  const destination = new URL(redirectTo, request.url);

  try {
    if (action === "delete") {
      await deleteOpportunityById(id);
      return NextResponse.redirect(
        setRedirectToast(destination, "success", "Opportunity deleted.", "opportunity-editor"),
      );
    }

    if (action === "open" || action === "close" || action === "archive") {
      await setOpportunityState(id, action);
      const message =
        action === "open"
          ? "Opportunity opened."
          : action === "close"
            ? "Opportunity closed."
            : "Opportunity archived.";

      return NextResponse.redirect(
        setRedirectToast(destination, "success", message, "opportunity-editor"),
      );
    }

    return NextResponse.redirect(
      setRedirectToast(destination, "error", "Invalid action.", "opportunity-editor"),
    );
  } catch (error) {
    return NextResponse.redirect(
      setRedirectToast(destination, "error", friendlyError(error), "opportunity-editor"),
    );
  }
}
