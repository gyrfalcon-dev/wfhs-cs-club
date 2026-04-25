"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

type SiteNavMenuProps = {
  groups: NavGroup[];
};

export function SiteNavMenu({ groups }: SiteNavMenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const menuIdBase = useId();

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openIndex]);

  return (
    <div className="nav-primary-links" ref={navRef}>
      {groups.map((group, index) => {
        const open = openIndex === index;
        const menuId = `${menuIdBase}-${index}`;

        return (
          <div
            key={group.label}
            className={`nav-dropdown ${open ? "is-open" : ""}`}
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex((current) => (current === index ? null : current))}
          >
            <button
              type="button"
              className="nav-link nav-menu-trigger"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
            >
              <span>{group.label}</span>
              <em aria-hidden="true">{open ? "-" : "+"}</em>
            </button>

            {open ? (
              <div className="nav-menu-popover" id={menuId} role="menu">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-menu-link"
                    role="menuitem"
                    onClick={() => setOpenIndex(null)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
