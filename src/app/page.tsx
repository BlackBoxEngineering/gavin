import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Business Advisor & Mentor`,
  description:
    "Gavin Woodhouse — strategic business advisor and mentor to business owners navigating growth, crisis, and recovery.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | Business Advisor & Mentor`,
    description:
      "Strategic business advisor and mentor. Trusted counsel for business owners navigating growth, crisis, and recovery.",
    url: SITE_URL,
    type: "website",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: ["https://www.linkedin.com/in/gavin-woodhouse-514966286/"],
  jobTitle: "Business Advisor & Mentor",
  description:
    "Strategic business advisor and mentor with over 20 years of experience in corporate operations, financial structuring, and crisis advisory.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "6rem 1.5rem",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.15,
            marginBottom: "1.5rem",
            maxWidth: "720px",
          }}
        >
          Gavin Woodhouse
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-muted)",
            maxWidth: "600px",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          Strategic business advisor and mentor. Trusted counsel for business
          owners navigating growth, complexity, and adversity.
        </p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a
            href="/about"
            style={{
              backgroundColor: "var(--accent)",
              color: "#1A1A2E",
              padding: "0.75rem 2rem",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            About Gavin
          </a>
          <a
            href="/contact"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "0.75rem 2rem",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}
