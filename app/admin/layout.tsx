import Link from "next/link";
import { ToastForm } from "@/app/_components/toast-form";
import { QuickActionsMenu } from "@/app/admin/_components/quick-actions-menu";
import { AdminSidebarNav } from "@/app/admin/_components/admin-sidebar-nav";
import { getAdminIdentity } from "@/lib/admin-auth";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminIdentity();

  if (!admin) {
    return children;
  }

  const adminHandle = admin.email.split("@")[0] || admin.email;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link href="/admin" className="admin-sidebar-home">
            <span className="admin-command-label">WFHS CS Club</span>
            <h2 className="admin-sidebar-title">Admin</h2>
            <p className="admin-muted admin-sidebar-meta">{adminHandle}</p>
          </Link>

          <AdminSidebarNav />

          <div className="admin-sidebar-create">
            <QuickActionsMenu
              label="Create"
              groups={[
                {
                  label: "Content",
                  items: [
                    { href: "/admin/new?type=project", label: "New project" },
                    { href: "/admin/new?type=event", label: "New event" },
                    { href: "/admin/new?type=devlog", label: "New devlog" },
                  ],
                },
                {
                  label: "Opportunities",
                  items: [
                    { href: "/admin/opportunities/new", label: "New opportunity" },
                    {
                      href: "/admin/opportunities/new?preset=project_showcase",
                      label: "Showcase call",
                    },
                    {
                      href: "/admin/opportunities/new?preset=devlog_submission",
                      label: "Devlog call",
                    },
                  ],
                },
              ]}
            />
          </div>
        </div>

        <div className="admin-sidebar-bottom">
          <ToastForm
            action="/api/admin/logout"
            method="post"
            pendingMessage="Signing you out..."
            toastScope="admin-auth"
          >
            <button type="submit" className="btn-secondary admin-logout">
              Sign out
            </button>
          </ToastForm>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-page">{children}</div>
      </main>
    </div>
  );
}
