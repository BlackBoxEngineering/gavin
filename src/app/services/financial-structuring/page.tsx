import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONTENT_LAST_MODIFIED, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Financial Structuring | Gavin Woodhouse",
  description:
    "Gavin Woodhouse Financial Structuring - advice on capital structure, borrowing options, refinancing opportunities, and disciplined commercial planning.",
  alternates: { canonical: `${SITE_URL}/services/financial-structuring` },
  openGraph: {
    title: `Financial Structuring | ${SITE_NAME}`,
    description:
      "Advice on capital structure, borrowing options, refinancing opportunities, and disciplined commercial planning.",
    url: `${SITE_URL}/services/financial-structuring`,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${SITE_URL}/services/financial-structuring#article`,
  headline: "Gavin Woodhouse Financial Structuring",
  description:
    "Advice on capital structure, borrowing options, refinancing opportunities, and disciplined commercial planning.",
  url: `${SITE_URL}/services/financial-structuring`,
  datePublished: "2026-04-04",
  dateModified: SITE_CONTENT_LAST_MODIFIED,
  inLanguage: "en-GB",
  mainEntityOfPage: `${SITE_URL}/services/financial-structuring`,
  author: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
  publisher: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/services/financial-structuring#service`,
  name: "Financial Structuring",
  serviceType: "Business Financial Structuring",
  provider: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  url: `${SITE_URL}/services/financial-structuring`,
  description:
    "Advice on capital structure, borrowing options, refinancing opportunities, and disciplined commercial planning.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does financial structuring help with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It helps leaders make clearer funding decisions around debt, equity, refinancing, and capital allocation.",
      },
    },
    {
      "@type": "Question",
      name: "When should refinancing be reviewed?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Refinancing should be reviewed when borrowing terms no longer match performance, cash flow pressure increases, or market rates improve.",
      },
    },
    {
      "@type": "Question",
      name: "Is this only for distressed businesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Financial structuring is useful for both growth-stage and stabilisation-stage businesses seeking resilient long-term capital decisions.",
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
      name: "Financial Structuring",
      item: `${SITE_URL}/services/financial-structuring`,
    },
  ],
};

export default function FinancialStructuring() {
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
        <span style={{ color: "var(--accent)" }}>Financial Structuring</span>
      </nav>

      <article style={{ maxWidth: "760px" }}>
        <section className="section-block">
          <span className="eyebrow">Services</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Financial Structuring
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Advice on capital structure, borrowing options, refinancing opportunities, and disciplined commercial
            planning.
          </p>
        </section>

        <section className="section-block">
          <p>
            Capital decisions influence resilience, optionality, and long-term performance. Weak structuring can
            restrict growth and increase pressure when market conditions shift.
          </p>
          <p style={{ marginTop: "1rem" }}>
            Financial structuring support brings clarity to debt exposure, funding strategy, and cash discipline so
            decisions remain commercially grounded.
          </p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>
            Financial Structuring FAQ
          </h2>
          <div className="story-stack" style={{ marginTop: "1rem" }}>
            <article className="story-card">
              <h3>What does this service improve first?</h3>
              <p>Funding clarity, cash-flow control, and better alignment between financial obligations and performance.</p>
            </article>
            <article className="story-card">
              <h3>When is refinancing worth reviewing?</h3>
              <p>When existing terms create unnecessary strain or when improved terms can increase flexibility and resilience.</p>
            </article>
            <article className="story-card">
              <h3>Who is this most useful for?</h3>
              <p>Owners and leadership teams managing growth, leverage, or complex funding decisions under pressure.</p>
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
            <Link href="/services/restructuring" className="button-secondary">
              Restructuring Support
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
            Strong financial structuring improves strategic control and supports better decisions in both stable and
            high-pressure phases.
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
