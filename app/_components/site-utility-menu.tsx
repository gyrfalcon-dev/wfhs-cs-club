"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ThemeToggle } from "@/app/_components/theme-toggle";

type UtilityLink = {
  href: string;
  label: string;
};

type SiteUtilityMenuProps = {
  links: UtilityLink[];
};

export function SiteUtilityMenu({ links }: SiteUtilityMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

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
    <div className={`site-utility-menu ${open ? "is-open" : ""}`} ref={menuRef}>
      <button
        type="button"
        className="site-utility-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        More
        <span aria-hidden="true">+</span>
      </button>

      {open ? (
        <div className="site-utility-popover" id={menuId} role="menu">
          <div className="site-utility-group">
            <span className="site-utility-label">Explore</span>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-utility-link"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="site-utility-group">
            <span className="site-utility-label">Theme</span>
            <ThemeToggle onToggle={() => setOpen(false)} compact />
          </div>
        </div>
      ) : null}
    </div>
  );
}
