import { redirect } from "next/navigation";
import { loginAdmin } from "@/app/admin/actions";
import { getAdminEmails, getAdminUser } from "@/lib/supabase-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const user = await getAdminUser();
  if (user) {
    redirect("/admin");
  }

  const params = await searchParams;
  const error =
    typeof params.error === "string" ? decodeURIComponent(params.error) : null;

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-kicker">WFHS CS Club Admin</p>
        <h1>Sign in to manage content</h1>
        <p className="admin-muted">
          Projects, events, dev logs, media uploads, and join submissions now
          flow through Supabase.
        </p>

        {error ? <p className="admin-error">{error}</p> : null}
        {getAdminEmails().length === 0 ? (
          <p className="admin-warning">
            Set <code>ADMIN_EMAILS</code> in <code>.env.local</code> before
            using the admin.
          </p>
        ) : null}
        <p className="admin-muted">
          Required setup: <code>SUPABASE_URL</code>,{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code>, and{" "}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>. Apply{" "}
          <code>supabase/schema.sql</code> before creating projects, events, or
          dev logs.
        </p>

        <form action={loginAdmin} className="admin-form-stack">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
            />
          </div>
          <button className="btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
