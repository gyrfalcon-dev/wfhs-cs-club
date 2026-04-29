"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

type SiteNavMenuProps = {
  cta?: NavItem;
  groups: NavGroup[];
};

export function SiteNavMenu({ cta, groups }: SiteNavMenuProps) {
  const pathname = usePathname();
  const [navState, setNavState] = useState<{
    mobileOpen: boolean;
    openIndex: number | null;
    path: string;
  }>({
    mobileOpen: false,
    openIndex: null,
    path: pathname,
  });
  const navRef = useRef<HTMLDivElement | null>(null);
  const menuIdBase = useId();
  const openIndex = navState.path === pathname ? navState.openIndex : null;
  const mobileOpen = navState.path === pathname ? navState.mobileOpen : false;

  const setMenuState = useCallback(
    (nextState: {
      mobileOpen: boolean;
      openIndex: number | null;
    }) => {
      setNavState({
        ...nextState,
        path: pathname,
      });
    },
    [pathname],
  );

  useEffect(() => {
    if (openIndex === null && !mobileOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setMenuState({
          openIndex: null,
          mobileOpen: false,
        });
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuState({
          openIndex: null,
          mobileOpen: false,
        });
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, openIndex, setMenuState]);

  const mobileMenuId = `${menuIdBase}-mobile`;

  return (
    <div className="nav-links" ref={navRef}>
      <div className="nav-desktop-shell">
        <div className="nav-primary-links">
          {groups.map((group, index) => {
            const open = openIndex === index;
            const menuId = `${menuIdBase}-${index}`;

            return (
              <div
                key={group.label}
                className={`nav-dropdown ${open ? "is-open" : ""}`}
                onMouseEnter={() =>
                  setMenuState({
                    openIndex: index,
                    mobileOpen: false,
                  })
                }
                onMouseLeave={() =>
                  setMenuState({
                    openIndex: openIndex === index ? null : openIndex,
                    mobileOpen: false,
                  })
                }
              >
                <button
                  type="button"
                  className="nav-link nav-menu-trigger"
                  aria-haspopup="menu"
                  aria-expanded={open}
                  aria-controls={menuId}
                  onClick={() =>
                    setMenuState({
                      openIndex: openIndex === index ? null : index,
                      mobileOpen: false,
                    })
                  }
                >
                  <span>{group.label}</span>
                </button>

                {open ? (
                  <div className="nav-menu-popover" id={menuId} role="menu">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="nav-menu-link"
                        role="menuitem"
                        onClick={() =>
                          setMenuState({
                            openIndex: null,
                            mobileOpen: false,
                          })
                        }
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
        {cta ? (
          <Link href={cta.href} className="nav-cta">
            {cta.label}
          </Link>
        ) : null}
      </div>

      <button
        type="button"
        className="nav-mobile-toggle"
        aria-expanded={mobileOpen}
        aria-controls={mobileMenuId}
        onClick={() =>
          setMenuState({
            openIndex: null,
            mobileOpen: !mobileOpen,
          })
        }
      >
        <span>{mobileOpen ? "Close" : "Menu"}</span>
      </button>

      {mobileOpen ? (
        <div className="nav-mobile-panel" id={mobileMenuId}>
          {groups.map((group) => (
            <div key={group.label} className="nav-mobile-group">
              <span className="nav-mobile-label">{group.label}</span>
              <div className="nav-mobile-links">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="nav-mobile-link"
                    onClick={() =>
                      setMenuState({
                        openIndex: null,
                        mobileOpen: false,
                      })
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {cta ? (
            <Link
              href={cta.href}
              className="nav-cta nav-mobile-cta"
              onClick={() =>
                setMenuState({
                  openIndex: null,
                  mobileOpen: false,
                })
              }
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
