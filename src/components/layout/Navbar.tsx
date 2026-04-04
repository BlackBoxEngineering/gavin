"use client";

import "@/lib/amplify-client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hub } from "aws-amplify/utils";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { getSessionGroups, hasAdminAccess } from "@/lib/adminAccess";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

type ThemeName = "light" | "dark";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="M4 6.75h16M4 12h16M4 17.25h16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="m6.75 6.75 10.5 10.5m0-10.5-10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.55 5.45l-1.77 1.77M7.22 16.78l-1.77 1.77M18.55 18.55l-1.77-1.77M7.22 7.22 5.45 5.45"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="M15.9 3.45a8.82 8.82 0 1 0 4.65 15.95 8.2 8.2 0 0 1-2.56.4c-4.79 0-8.67-3.88-8.67-8.67 0-3.17 1.7-5.95 4.24-7.48a8.9 8.9 0 0 1 2.34-.2Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="M10 6.75H6.75A2.75 2.75 0 0 0 4 9.5v5A2.75 2.75 0 0 0 6.75 17.25H10M13 8.25 18 12l-5 3.75M18 12H8.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="M14 6.75h3.25A2.75 2.75 0 0 1 20 9.5v5a2.75 2.75 0 0 1-2.75 2.75H14M11 8.25 6 12l5 3.75M6 12h9.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ThemeSwitch({
  theme,
  onChange,
}: {
  theme: ThemeName;
  onChange: (theme: ThemeName) => void;
}) {
  return (
    <div role="group" className="theme-switcher" aria-label="Theme switcher">
      <button
        type="button"
        onClick={() => onChange("light")}
        className={`theme-pill${theme === "light" ? " theme-pill-active" : ""}`}
        aria-pressed={theme === "light"}
        title="Light mode"
      >
        <SunIcon />
      </button>
      <button
        type="button"
        onClick={() => onChange("dark")}
        className={`theme-pill${theme === "dark" ? " theme-pill-active" : ""}`}
        aria-pressed={theme === "dark"}
        title="Dark mode"
      >
        <MoonIcon />
      </button>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<ThemeName>("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeName | null;
    const nextTheme = stored ?? "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncAuth = async () => {
      try {
        await getCurrentUser();
        const session = await fetchAuthSession();
        const groups = getSessionGroups(session);
        setIsAuthenticated(true);
        setIsAdmin(hasAdminAccess(groups));
      } catch {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    void syncAuth();

    const unsubscribe = Hub.listen("auth", () => {
      void syncAuth();
    });

    return unsubscribe;
  }, []);

  function setThemeMode(nextTheme: ThemeName) {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  async function handleAuthAction() {
    if (authBusy) return;
    if (!isAuthenticated) {
      setMobileOpen(false);
      window.dispatchEvent(new Event("triggerLogin"));
      return;
    }

    setAuthBusy(true);
    try {
      await signOut({
        global: false,
        oauth: {
          redirectUrl: window.location.origin,
        },
      });
      setIsAuthenticated(false);
      window.dispatchEvent(new Event("authStateChanged"));
    } finally {
      setAuthBusy(false);
    }
  }

  const authLabel = isAuthenticated ? "Logout" : "Login";
  const links = isAdmin ? [...baseLinks, { href: "/admin", label: "Admin" }] : baseLinks;

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <div className="nav-top-row">
          <Link href="/" className="brand-link" aria-label="Gavin Woodhouse home">
            <span className="brand-logo-stack">
              <Image
                src="/gavin_woodhouse_logo_light.png"
                alt="Gavin Woodhouse"
                width={653}
                height={314}
                priority
                className="brand-logo brand-logo-light"
              />
              <Image
                src="/gavin_woodhouse_logo_dark.png"
                alt="Gavin Woodhouse"
                width={653}
                height={314}
                priority
                className="brand-logo brand-logo-dark"
              />
            </span>
          </Link>

          <div className="desktop-nav">
            <div className="nav-links">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="header-actions">
              <button
                type="button"
                onClick={handleAuthAction}
                aria-label={authLabel}
                className="header-action header-action-auth"
                disabled={authBusy}
              >
                {isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
                <span>{authBusy ? "Working" : authLabel}</span>
              </button>

              <ThemeSwitch theme={theme} onChange={setThemeMode} />
            </div>
          </div>

          <div className="mobile-actions">
            <ThemeSwitch theme={theme} onChange={setThemeMode} />

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-site-menu"
              className="header-action header-action-icon"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        <div
          id="mobile-site-menu"
          className={`mobile-menu${mobileOpen ? " mobile-menu-open" : ""}`}
        >
          <div className="mobile-menu-links">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link mobile-nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mobile-menu-actions">
            <button
              type="button"
              onClick={handleAuthAction}
              aria-label={authLabel}
              className="header-action header-action-auth mobile-auth-button"
              disabled={authBusy}
            >
              {isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
              <span>{authBusy ? "Working" : authLabel}</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
