import Link from "next/link";
import type { Metadata } from "next";
import { ToastProvider } from "@/app/_components/toast-provider";
import "./globals.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/compilers" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/terminal" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Dev Logs", href: "/devlogs" },
  { label: "Sponsored", href: "/sponsored" },
];

export const metadata: Metadata = {
  title: "WFHS Computer Science Club",
  description:
    "Wake Forest High School students building games, robots, tools, and real club projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <nav className="navbar">
            <div className="nav-container">
              <div className="nav-logo">
                <Link href="/">
                  <span className="logo-mark">[WF]</span>
                  <div className="logo-text">
                    <span className="logo-main">WFHS CS Club</span>
                    <span className="logo-sub">Computer Science Club</span>
                  </div>
                </Link>
              </div>
              <div className="nav-links">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="nav-link">
                    {link.label}
                  </Link>
                ))}
                <Link href="/join" className="nav-cta">
                  Join Us
                </Link>
              </div>
            </div>
          </nav>

          <main>{children}</main>

          <footer className="footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-brand">
                  <div className="footer-info">
                    <h4>WFHS Computer Science Club</h4>
                    <p>Building ambitious student projects and shipping them publicly</p>
                  </div>
                </div>
                <div className="footer-links">
                  <div className="footer-section">
                    <h5>Navigation</h5>
                    <Link href="/compilers">About</Link>
                    <Link href="/projects">Projects</Link>
                    <Link href="/terminal">Events</Link>
                    <Link href="/opportunities">Opportunities</Link>
                    <Link href="/devlogs">Dev Logs</Link>
                    <Link href="/sponsored">Sponsored</Link>
                    <Link href="/join">Join Us</Link>
                  </div>
                  <div className="footer-section">
                    <h5>Connect</h5>
                    <Link href="https://discord.gg/wfhs-cs">Discord</Link>
                    <Link href="/devlogs">Build Log</Link>
                    <Link href="/admin">Admin</Link>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <p>
                  © {new Date().getFullYear()} Wake Forest High School Computer
                  Science Club
                </p>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
