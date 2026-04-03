"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <header className="site-header">
      <nav className="nav-shell">
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

        <div className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="theme-toggle"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </nav>
    </header>
  );
}
