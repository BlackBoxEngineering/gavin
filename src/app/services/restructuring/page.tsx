import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONTENT_LAST_MODIFIED, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Restructuring Support | Gavin Woodhouse",
  description:
    "Gavin Woodhouse Restructuring Support - practical guidance through complex structural change, from stabilisation to sustainable performance.",
  alternates: { canonical: `${SITE_URL}/services/restructuring` },
  openGraph: {
    title: `Restructuring Support | ${SITE_NAME}`,
    description:
      "Practical guidance through complex structural change, from stabilisation to sustainable performance.",
    url: `${SITE_URL}/services/restructuring`,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${SITE_URL}/services/restructuring#article`,
  headline: "Gavin Woodhouse Restructuring Support",
  description:
    "Practical guidance through complex structural change, from stabilisation to sustainable performance.",
  url: `${SITE_URL}/services/restructuring`,
  datePublished: "2026-04-04",
  dateModified: SITE_CONTENT_LAST_MODIFIED,
  inLanguage: "en-GB",
  mainEntityOfPage: `${SITE_URL}/services/restructuring`,
  author: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
  publisher: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/services/restructuring#service`,
  name: "Restructuring Support",
  serviceType: "Business Restructuring Support",
  provider: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  url: `${SITE_URL}/services/restructuring`,
  description:
    "Practical guidance through complex structural change, from stabilisation to sustainable performance.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the goal of restructuring support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The goal is to stabilise operations, improve financial performance, and create a sustainable structure for future growth.",
      },
    },
    {
      "@type": "Question",
      name: "How do you know when restructuring is needed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common signs include margin erosion, debt pressure, weak cash flow, outdated operating models, and underperforming business units.",
      },
    },
    {
      "@type": "Question",
      name: "Is restructuring only a last resort?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Early restructuring is often a strategic choice that preserves options and improves long-term resilience.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Restructuring Support",
      item: `${SITE_URL}/services/restructuring`,
    },
  ],
};

export default function Restructuring() {
  return (
    <div className="page-shell page-hero">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Home
        </Link>
        {" / "}
        <Link href="/services" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
          Services
        </Link>
        {" / "}
        <span style={{ color: "var(--accent)" }}>Restructuring Support</span>
      </nav>

      <article style={{ maxWidth: "760px" }}>
        <section className="section-block">
          <span className="eyebrow">Services</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Restructuring Support
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Practical guidance through complex structural change, from stabilisation to sustainable performance.
          </p>
        </section>

        <section className="section-block">
          <p>
            In business, not all challenges present as sudden crises. Many develop gradually through tightening
            margins, operational inefficiencies, mounting obligations, or changing market conditions.
          </p>
          <p style={{ marginTop: "1rem" }}>
            Left unaddressed, these pressures can erode performance, strain resources, and limit future options.
          </p>
          <p style={{ marginTop: "1rem" }}>
            Restructuring is not a signal of failure. It is a strategic reset and an opportunity to realign a
            business with commercial reality.
          </p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>
            Restructuring Support FAQ
          </h2>
          <div className="story-stack" style={{ marginTop: "1rem" }}>
            <article className="story-card">
              <h3>What does restructuring aim to fix?</h3>
              <p>It addresses structural inefficiencies in costs, operations, and financing that hold back performance.</p>
            </article>
            <article className="story-card">
              <h3>What happens before major changes?</h3>
              <p>A clear diagnosis and short-term stabilisation phase are completed first to protect continuity.</p>
            </article>
            <article className="story-card">
              <h3>Why act early?</h3>
              <p>Early action keeps strategic choices open and reduces the risk of forced reactive outcomes.</p>
            </article>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>
            Related Services
          </h2>
          <div className="button-row" style={{ marginTop: "1rem" }}>
            <Link href="/services/crisis-advisory" className="button-secondary">
              Crisis Advisory
            </Link>
            <Link href="/services/financial-structuring" className="button-secondary">
              Financial Structuring
            </Link>
            <Link href="/services/strategic-mentoring" className="button-secondary">
              Strategic Mentoring
            </Link>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>
            Moving Forward
          </h2>
          <p style={{ marginTop: "1rem" }}>
            Restructuring is a turning point. With the right approach, businesses can become more resilient,
            efficient, and strategically aligned.
          </p>
          <div className="button-row" style={{ marginTop: "2rem" }}>
            <Link href="/contact" className="button-primary">
              Start a Conversation
            </Link>
            <Link href="/services" className="button-secondary">
              All Services
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
