import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Advisory services from Gavin Woodhouse — financial structuring, crisis advisory, investment, and strategic business mentoring.",
  alternates: { canonical: "https://gavinroothouse.com/services" },
  openGraph: {
    title: "Services | Gavin Woodhouse",
    description:
      "Financial structuring, crisis advisory, investment, and strategic business mentoring.",
    url: "https://gavinroothouse.com/services",
  },
};

export default function Services() {
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "6rem 1.5rem" }}>
      <h1
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "2rem",
        }}
      >
        Services
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: 1.8, maxWidth: "720px" }}>
        Content coming soon.
      </p>
    </section>
  );
}
