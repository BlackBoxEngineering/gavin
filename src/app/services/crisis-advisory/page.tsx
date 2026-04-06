import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONTENT_LAST_MODIFIED, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Crisis Advisory | Gavin Woodhouse",
  description:
    "Gavin Woodhouse Crisis Advisory — strategic support for business owners navigating pressure, destabilising events, reputational exposure, or serious uncertainty.",
  alternates: { canonical: `${SITE_URL}/services/crisis-advisory` },
  openGraph: {
    title: "Crisis Advisory | Gavin Woodhouse",
    description:
      "Strategic support for business owners navigating pressure, destabilising events, reputational exposure, or serious uncertainty.",
    url: `${SITE_URL}/services/crisis-advisory`,
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${SITE_URL}/services/crisis-advisory#article`,
  headline: "Gavin Woodhouse Crisis Advisory",
  description:
    "Strategic support for business owners navigating pressure, destabilising events, reputational exposure, or serious uncertainty.",
  url: `${SITE_URL}/services/crisis-advisory`,
  datePublished: "2026-04-04",
  dateModified: SITE_CONTENT_LAST_MODIFIED,
  inLanguage: "en-GB",
  mainEntityOfPage: `${SITE_URL}/services/crisis-advisory`,
  author: {
    "@type": "Person",
    name: "Gavin Woodhouse",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Person",
    name: "Gavin Woodhouse",
    url: SITE_URL,
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/services/crisis-advisory#service`,
  name: "Crisis Advisory",
  serviceType: "Business Crisis Advisory",
  provider: { "@type": "Person", name: "Gavin Woodhouse", url: SITE_URL },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  url: `${SITE_URL}/services/crisis-advisory`,
  description:
    "Strategic support for business owners navigating pressure, destabilising events, reputational exposure, or serious uncertainty.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "When should a business owner seek crisis advisory support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Crisis advisory is most effective when signs of instability appear early, including cash pressure, reputational risk, leadership conflict, or major stakeholder tension.",
      },
    },
    {
      "@type": "Question",
      name: "What is the first priority during a business crisis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first priority is stabilisation: contain immediate risk, protect cash flow, and establish a controlled decision framework before wider strategic moves.",
      },
    },
    {
      "@type": "Question",
      name: "Does crisis advisory include reputational strategy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Reputation handling is part of crisis work, including communication discipline and narrative control aligned with operational and financial reality.",
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
    { "@type": "ListItem", position: 3, name: "Crisis Advisory", item: `${SITE_URL}/services/crisis-advisory` },
  ],
};

export default function CrisisAdvisory() {
  return (
    <div className="page-shell page-hero">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav style={{ marginBottom: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
        {" / "}
        <Link href="/services" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Services</Link>
        {" / "}
        <span style={{ color: "var(--accent)" }}>Crisis Advisory</span>
      </nav>

      <article style={{ maxWidth: "760px" }}>
        <section className="section-block">
          <span className="eyebrow">Services</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Crisis Advisory
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Strategic support for business owners navigating pressure, destabilising events,
            reputational exposure, or serious uncertainty.
          </p>
        </section>

        <section className="section-block">
          <p>In business, pressure is inevitable. But crisis is different.</p>
          <p>Crisis doesn&apos;t arrive neatly scheduled. It rarely presents with clarity. Instead, it builds quietly through financial strain, operational breakdowns, reputational risk, or external shocks until leaders find themselves making high-stakes decisions in conditions of uncertainty, scrutiny, and time pressure.</p>
          <p>It is in these moments that experience, perspective, and strategic composure matter most.</p>
          <p>Gavin Woodhouse Crisis Advisory exists to support business owners and leadership teams when the stakes are highest — providing calm, structured, and commercially grounded guidance through complexity.</p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>Understanding Crisis in a Modern Business Context</h2>
          <p style={{ marginTop: "1rem" }}>A crisis is not defined solely by scale — it is defined by impact and instability.</p>
          <p>For one business, it may be a sudden liquidity challenge, legal or regulatory exposure, reputational damage, internal leadership conflict, operational disruption, or investor pressure. For another, it may be the slow erosion of stability, where multiple smaller issues converge into a critical tipping point.</p>
          <p>What these situations share is a common reality: clarity becomes scarce just as decisions become more important.</p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>The Role of Strategic Crisis Advisory</h2>
          <p style={{ marginTop: "1rem" }}>During periods of disruption, most business owners face three simultaneous challenges:</p>
          <ul style={{ marginTop: "1rem", paddingLeft: "1.5rem", lineHeight: 2, color: "var(--text-muted)" }}>
            <li><strong style={{ color: "var(--text)" }}>Emotional pressure</strong> — the weight of responsibility, uncertainty, and consequence</li>
            <li><strong style={{ color: "var(--text)" }}>Information overload or gaps</strong> — incomplete, conflicting, or rapidly changing data</li>
            <li><strong style={{ color: "var(--text)" }}>Time sensitivity</strong> — the need to act quickly, often without perfect insight</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>Crisis advisory provides an external, objective layer of support — focused not just on solving problems, but on stabilising decision-making itself. This is not theoretical consulting. It is practical, situational guidance, rooted in real-world business experience.</p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>A Structured Approach to Unstructured Situations</h2>
          <p style={{ marginTop: "1rem" }}>Every crisis is unique, but the response must follow a disciplined framework. Effective advisory typically centres around four core phases.</p>

          <div className="story-stack" style={{ marginTop: "1.5rem" }}>
            <article className="story-card">
              <h3>1. Stabilisation</h3>
              <p>The immediate priority is to contain risk and create breathing space — identifying critical threats, protecting cash flow, managing stakeholder communications, and preventing escalation. The goal is to stop the situation from worsening while regaining control of the narrative and the numbers.</p>
            </article>
            <article className="story-card">
              <h3>2. Clarity</h3>
              <p>Once stabilised, attention shifts to understanding reality without distortion — assessing financial exposure, evaluating operational vulnerabilities, identifying legal or reputational risks, and challenging assumptions. Clarity is often uncomfortable, but it is essential. Without it, decisions are reactive rather than strategic.</p>
            </article>
            <article className="story-card">
              <h3>3. Strategy</h3>
              <p>With a clear view of the situation, the next step is to define a practical path forward — restructuring or repositioning the business, managing stakeholder negotiations, refining communication strategies, and identifying exit, recovery, or transformation options. The emphasis is on decisions that are commercially viable, reputationally aware, and executable under pressure.</p>
            </article>
            <article className="story-card">
              <h3>4. Execution Support</h3>
              <p>Strategy alone is not enough. In crisis, execution must be disciplined and adaptive — acting as a sounding board for leadership, supporting key negotiations, monitoring progress, and maintaining focus under pressure. The objective is not just to survive the crisis, but to emerge from it with structure, credibility, and direction restored.</p>
            </article>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>Reputational Risk and the Importance of Narrative</h2>
          <p style={{ marginTop: "1rem" }}>In today&apos;s environment, reputation can shift as quickly as circumstances. A poorly handled message — or a delay in communication — can amplify an already difficult situation. Conversely, clear, measured, and credible communication can stabilise perception even in challenging conditions.</p>
          <p style={{ marginTop: "1rem" }}>The balance lies in controlled transparency — ensuring that what is communicated aligns with both reality and strategy.</p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>When to Seek Support</h2>
          <p style={{ marginTop: "1rem" }}>Many business owners wait too long before seeking external input — often engaging support only when options have narrowed. The earlier structured guidance is introduced, the more options remain available, the more controlled the outcome can be, and the less reactive the response becomes.</p>
          <p style={{ marginTop: "1rem" }}>Crisis advisory is not only for moments of collapse. It is equally valuable during periods of mounting pressure, early signs of instability, or situations where something isn&apos;t right but clarity is lacking.</p>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>Crisis Advisory FAQ</h2>
          <div className="story-stack" style={{ marginTop: "1rem" }}>
            <article className="story-card">
              <h3>When should support start?</h3>
              <p>As early as possible. Early intervention keeps more options open and reduces forced reactive decisions.</p>
            </article>
            <article className="story-card">
              <h3>What happens first?</h3>
              <p>Immediate stabilisation, then structured diagnosis and strategy, followed by execution support.</p>
            </article>
            <article className="story-card">
              <h3>Is communication part of the work?</h3>
              <p>Yes. Communication strategy is integrated so operational actions and external narrative stay aligned.</p>
            </article>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>Related Services</h2>
          <div className="button-row" style={{ marginTop: "1rem" }}>
            <Link href="/services/restructuring" className="button-secondary">Restructuring Support</Link>
            <Link href="/services/financial-structuring" className="button-secondary">Financial Structuring</Link>
            <Link href="/services/strategic-mentoring" className="button-secondary">Strategic Mentoring</Link>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>Moving Forward</h2>
          <p style={{ marginTop: "1rem" }}>Crisis does not define a business. But how it is handled often does. With the right support, even the most challenging situations can be stabilised, understood, resolved, and repositioned — and in many cases, they become a turning point, not just an endpoint.</p>
          <p style={{ marginTop: "1rem" }}>Gavin Woodhouse Crisis Advisory provides business owners with the structure, perspective, and strategic support needed to navigate uncertainty — protecting both immediate position and long-term reputation when it matters most.</p>
          <div className="button-row" style={{ marginTop: "2rem" }}>
            <Link href="/contact" className="button-primary">Start a Conversation</Link>
            <Link href="/services" className="button-secondary">All Services</Link>
          </div>
        </section>
      </article>
    </div>
  );
}
