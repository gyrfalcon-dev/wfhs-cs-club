"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Home" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/opportunities", label: "Opportunities" },
  { href: "/admin/responses", label: "Responses" },
  { href: "/admin/submissions", label: "Join Inbox" },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {navItems.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link ${active ? "is-active" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
