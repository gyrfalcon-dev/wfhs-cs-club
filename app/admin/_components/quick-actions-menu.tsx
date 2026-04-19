"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <div className="admin-action-menu-inline">
      <label className="admin-action-select-label">
        <span>{label}</span>
        <select
          className="admin-action-select"
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            setValue(next);
            if (next) {
              router.push(next);
              setValue("");
            }
          }}
        >
          <option value="">Choose action</option>
          {groups.length > 0
            ? groups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.items.map((item) => (
                    <option key={item.href} value={item.href}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : items.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
        </select>
      </label>

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
