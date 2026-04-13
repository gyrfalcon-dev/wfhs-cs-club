import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import { requireAdminUser } from "@/lib/supabase-auth";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/devlogs", label: "Dev Logs" },
  { href: "/admin/submissions", label: "Join Inbox" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">WFHS CS Club</p>
          <h2 className="admin-sidebar-title">Content Studio</h2>
          <p className="admin-muted">{user.email}</p>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="admin-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAdmin}>
          <button type="submit" className="btn-secondary admin-logout">
            Sign out
          </button>
        </form>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
