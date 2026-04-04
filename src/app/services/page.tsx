import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Gavin Woodhouse?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gavin Woodhouse is a UK business advisor and mentor with experience building a £40m business group and leading 450+ staff. He now offers crisis advisory, restructuring support, financial structuring, and strategic mentoring to business owners.",
      },
    },
    {
      "@type": "Question",
      name: "What services does Gavin Woodhouse offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gavin Woodhouse offers crisis advisory, restructuring support, financial structuring, and strategic mentoring for business owners and organisations facing pressure, uncertainty, or complex operational challenges.",
      },
    },
    {
      "@type": "Question",
      name: "What is Gavin Woodhouse's background?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gavin Woodhouse built and led a group of businesses that reached more than £40m in annual turnover and employed over 450 staff across multiple UK locations. He has firsthand experience of business growth, adversity, and recovery.",
      },
    },
    {
      "@type": "Question",
      name: "How can I contact Gavin Woodhouse?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can contact Gavin Woodhouse through the contact form at gavinwoodhouse.com/contact to discuss advisory, restructuring support, crisis guidance, or strategic mentoring.",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Services | Gavin Woodhouse",
  description:
    "Services from Gavin Woodhouse including crisis advisory, restructuring support, financial structuring, and strategic mentoring for business owners and organisations.",
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: `Services | ${SITE_NAME}`,
    description:
      "Crisis advisory, restructuring support, financial structuring, and strategic mentoring for business owners and organisations.",
    url: `${SITE_URL}/services`,
  },
};

export default function Services() {
  return (
    <div className="page-shell page-hero">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="section-block">
        <span className="eyebrow">Services</span>
        <h1 className="section-title" style={{ marginTop: "1rem" }}>
          Practical advisory services for business owners and organisations
          facing pressure, restructuring, or strategic uncertainty.
        </h1>
        <p className="lede" style={{ marginTop: "1rem" }}>
          Gavin Woodhouse offers business advisory and mentoring shaped by real
          commercial experience. The service focus is not abstract consulting. It
          is direct support for leaders who need clearer thinking, steadier
          judgement, and practical action in situations where the stakes are
          financial, reputational, and operational.
        </p>
      </section>

      <section className="section-block">
        <div className="service-grid">
          <article className="service-card">
            <span className="service-kicker">01</span>
            <h3>Crisis Advisory</h3>
            <p>
              Strategic support for business owners facing serious pressure,
              destabilising events, hostile scrutiny, or reputational exposure.
              The aim is to create calmer decision-making when circumstances are
              changing quickly and confidence is under strain.
            </p>
          </article>
          <article className="service-card">
            <span className="service-kicker">02</span>
            <h3>Restructuring Support</h3>
            <p>
              Gavin Woodhouse supports organisations through restructuring
              processes that stabilise operations, improve financial
              performance, and create a more sustainable foundation for the
              future.
            </p>
            <p style={{ marginTop: "0.9rem" }}>
              Typical areas include cost structure review and optimisation,
              operational redesign, leadership and reporting alignment, and
              financial performance improvement.
            </p>
          </article>
          <article className="service-card">
            <span className="service-kicker">03</span>
            <h3>Financial Structuring</h3>
            <p>
              Advice on capital structure, borrowing options, refinancing
              opportunities, and more disciplined commercial planning.
              Particularly useful where leaders need clarity around funding,
              leverage, and business resilience.
            </p>
          </article>
          <article className="service-card">
            <span className="service-kicker">04</span>
            <h3>Strategic Mentoring</h3>
            <p>
              Confidential one-to-one support for business owners who need a
              more experienced voice during inflection points, periods of
              uncertainty, or leadership isolation. The focus is practical
              perspective, not motivational noise.
            </p>
          </article>
        </div>
      </section>

      <section className="section-block content-grid">
        <div>
          <span className="eyebrow">Why These Services</span>
          <h2 className="section-title" style={{ marginTop: "1rem" }}>
            The differentiator is not theory. It is the ability to stay useful
            when circumstances become difficult.
          </h2>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Many advisors are comfortable when businesses are stable and growth
            is straightforward. Fewer have the perspective to remain helpful
            when pressure escalates, narratives shift, and decisions start to
            carry wider consequences. That is where Gavin&apos;s experience is
            most relevant.
          </p>
        </div>
        <div className="story-stack">
          <article className="story-card">
            <h3>Commercial grounding</h3>
            <p>
              Advice built on real business growth, team leadership, and
              operational responsibility rather than detached consultancy
              language.
            </p>
          </article>
          <article className="story-card">
            <h3>Pressure experience</h3>
            <p>
              Guidance informed by firsthand experience of public adversity,
              uncertainty, and the need to make decisions when the situation is
              far from ideal.
            </p>
          </article>
          <article className="story-card">
            <h3>Human and operational balance</h3>
            <p>
              A practical view that recognises business performance matters, but
              so do stability, people, and the wider cost of sustained pressure.
            </p>
          </article>
        </div>
      </section>

      <section className="section-block contact-grid">
        <div>
          <span className="eyebrow">Next Step</span>
          <h2 className="section-title" style={{ marginTop: "1rem" }}>
            If the context matters, read the story. If the challenge is current,
            start the conversation.
          </h2>
          <p className="lede" style={{ marginTop: "1rem" }}>
            The About page explains the perspective behind the work. The Contact
            page provides a direct route if you already know the pressure point
            and need a serious conversation.
          </p>
        </div>
        <div className="contact-card">
          <h3>Take the next step</h3>
          <p>
            Explore the background behind the advisory offer or move straight to
            contact if the situation already demands attention.
          </p>
          <div className="button-row" style={{ marginTop: "1.25rem" }}>
            <Link href="/about" className="button-secondary">
              Read the Story
            </Link>
            <Link href="/contact" className="button-primary">
              Contact Gavin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
