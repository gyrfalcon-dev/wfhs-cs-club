"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToastForm } from "@/app/_components/toast-form";

type QuickActionItem = {
  href: string;
  label: string;
};

type QuickActionsMenuProps = {
  items: QuickActionItem[];
  includeSignOut?: boolean;
  label?: string;
};

export function QuickActionsMenu({
  items,
  includeSignOut = false,
  label = "Quick actions",
}: QuickActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointer);
    window.addEventListener("touchstart", handlePointer);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("touchstart", handlePointer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`admin-action-menu ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="btn-primary admin-action-btn admin-action-btn-primary"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </button>

      {open ? (
        <div className="admin-action-popover" role="menu">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="admin-menu-link"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {includeSignOut ? (
            <ToastForm
              action="/api/admin/logout"
              method="post"
              pendingMessage="Signing you out..."
              toastScope="admin-auth"
            >
              <button
                type="submit"
                className="admin-menu-button"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                Sign out
              </button>
            </ToastForm>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
