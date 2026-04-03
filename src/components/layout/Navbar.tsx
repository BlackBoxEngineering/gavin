"use client";

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
    if (stored) setTheme(stored);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <header style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
      <nav
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
        className="flex items-center justify-between h-16"
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--accent)",
            fontSize: "1.25rem",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          Gavin Woodhouse
        </Link>

        <div className="flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {l.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "0.25rem 0.625rem",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
            }}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </nav>
    </header>
  );
}
