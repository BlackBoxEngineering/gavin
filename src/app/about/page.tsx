import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Gavin Woodhouse — from building a £40m business group to navigating adversity and emerging as a trusted advisor to business owners.",
  alternates: { canonical: "https://gavinroothouse.com/about" },
  openGraph: {
    title: "About Gavin Woodhouse",
    description:
      "From building a £40m business group to navigating adversity. Gavin Woodhouse's story.",
    url: "https://gavinroothouse.com/about",
  },
};

export default function About() {
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
        About Gavin Woodhouse
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: 1.8, maxWidth: "720px" }}>
        Content coming soon.
      </p>
    </section>
  );
}
