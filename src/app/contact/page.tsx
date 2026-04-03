import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Gavin Woodhouse to discuss advisory, mentoring, or speaking engagements.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `Contact ${SITE_NAME}`,
    description: "Get in touch to discuss advisory, mentoring, or speaking engagements.",
    url: `${SITE_URL}/contact`,
  },
};

export default function Contact() {
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
        Contact
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: 1.8, maxWidth: "720px" }}>
        Content coming soon.
      </p>
    </section>
  );
}
