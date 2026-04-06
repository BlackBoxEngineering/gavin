import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONTENT_LAST_MODIFIED, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Strategic Mentoring | Gavin Woodhouse",
  description:
    "Gavin Woodhouse Strategic Mentoring - confidential one-to-one support for business owners facing uncertainty, inflection points, or leadership isolation.",
  alternates: { canonical: `${SITE_URL}/services/strategic-mentoring` },
  openGraph: {
    title: `Strategic Mentoring | ${SITE_NAME}`,
    description:
      "Confidential one-to-one support for business owners facing uncertainty, inflection points, or leadership isolation.",
    url: `${SITE_URL}/services/strategic-mentoring`,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${SITE_URL}/services/strategic-mentoring#article`,
  headline: "Gavin Woodhouse Strategic Mentoring",
  description:
    "Confidential one-to-one support for business owners facing uncertainty, inflection points, or leadership isolation.",
  url: `${SITE_URL}/services/strategic-mentoring`,
  datePublished: "2026-04-04",
  dateModified: SITE_CONTENT_LAST_MODIFIED,
  inLanguage: "en-GB",
  mainEntityOfPage: `${SITE_URL}/services/strategic-mentoring`,
  author: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
  publisher: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/services/strategic-mentoring#service`,
  name: "Strategic Mentoring",
  serviceType: "Business Strategic Mentoring",
  provider: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  url: `${SITE_URL}/services/strategic-mentoring`,
  description:
    "Confidential one-to-one support for business owners facing uncertainty, inflection points, or leadership isolation.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is strategic mentoring for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Strategic mentoring is for owners and leaders who need practical external perspective during high-stakes decisions, uncertainty, or leadership isolation.",
      },
    },
    {
      "@type": "Question",
      name: "What is covered in mentoring sessions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sessions focus on current decision pressure, strategic clarity, execution priorities, and leadership judgement in live business situations.",
      },
    },
    {
      "@type": "Question",
      name: "Is mentoring confidential?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Strategic mentoring conversations are confidential and designed to provide a trusted private decision environment.",
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
      name: "Strategic Mentoring",
      item: `${SITE_URL}/services/strategic-mentoring`,
    },
  ],
};

export default function StrategicMentoring() {
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
        <span style={{ color: "var(--accent)" }}>Strategic Mentoring</span>
      </nav>

      <article style={{ maxWidth: "760px" }}>
        <section className="section-block">
          <span className="eyebrow">Services</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Strategic Mentoring
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Confidential one-to-one support for business owners who need a steady, experienced voice in difficult
            decisions.
          </p>
        </section>

        <section className="section-block">
          <p>
            Leadership pressure is often highest when there is limited room for error and limited space for honest
            testing of decisions.
          </p>
          <p style={{ marginTop: "1rem" }}>
            Strategic mentoring provides a private structure for better judgement, sharper priorities, and stronger
            execution confidence.
          </p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>
            Strategic Mentoring FAQ
          </h2>
          <div className="story-stack" style={{ marginTop: "1rem" }}>
            <article className="story-card">
              <h3>Who is this for?</h3>
              <p>Business owners and senior leaders facing uncertainty, complexity, or high-impact choices.</p>
            </article>
            <article className="story-card">
              <h3>What happens in sessions?</h3>
              <p>Sessions focus on active decisions, strategic options, risk trade-offs, and disciplined next actions.</p>
            </article>
            <article className="story-card">
              <h3>Is this confidential?</h3>
              <p>Yes. The mentoring relationship is private and designed for candid executive-level discussion.</p>
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
            <Link href="/services/financial-structuring" className="button-secondary">
              Financial Structuring
            </Link>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>
            Moving Forward
          </h2>
          <p style={{ marginTop: "1rem" }}>
            Strategic mentoring supports clearer decisions under pressure and helps leaders move from overload to
            deliberate action.
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
