"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ToastForm } from "@/app/_components/toast-form";

type QuickActionItem = {
  href: string;
  label: string;
};

type QuickActionGroup = {
  label: string;
  items: QuickActionItem[];
};

type QuickActionsMenuProps = {
  items?: QuickActionItem[];
  groups?: QuickActionGroup[];
  includeSignOut?: boolean;
  label?: string;
};

export function QuickActionsMenu({
  items = [],
  groups = [],
  includeSignOut = false,
  label = "Quick actions",
}: QuickActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const actionGroups = groups.length > 0 ? groups : [{ label: "Actions", items }];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="admin-action-menu-inline">
      <div className={`admin-action-menu ${open ? "is-open" : ""}`} ref={menuRef}>
        <button
          type="button"
          className="admin-action-trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{label}</span>
          <em aria-hidden="true">{open ? "-" : "+"}</em>
        </button>

        {open ? (
          <div className="admin-action-popover admin-action-popover-rect" id={menuId} role="menu">
            {actionGroups.map((group) => (
              <div key={group.label} className="admin-action-group">
                <span className="admin-action-group-label">{group.label}</span>
                <div className="admin-action-group-items">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="admin-menu-link admin-menu-link-rect"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {includeSignOut ? (
        <ToastForm
          action="/api/admin/logout"
          method="post"
          pendingMessage="Signing you out..."
          toastScope="admin-auth"
        >
          <button type="submit" className="btn-secondary admin-action-btn">
            Sign out
          </button>
        </ToastForm>
      ) : null}
    </div>
  );
}
