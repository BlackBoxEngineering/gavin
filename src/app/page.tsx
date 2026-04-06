import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | Business Advisor, Mentor & Crisis Advisory`,
  description:
    "Gavin Woodhouse is a UK business advisor and mentor offering strategic advisory, crisis support, restructuring guidance, and business recovery insight.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | Business Advisor, Mentor & Crisis Advisory`,
    description:
      "UK business advisor and mentor offering strategic advisory, crisis support, restructuring guidance, and business recovery insight.",
    url: SITE_URL,
    type: "website",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}#person`,
  name: "Gavin Woodhouse",
  url: SITE_URL,
  image: `${SITE_URL}/photos/gavin-woodhouse-executive-headshot.jpg`,
  jobTitle: "Business Advisor & Mentor",
  description:
    "UK business advisor and mentor with real-world experience in business growth, financial structuring, crisis advisory, and recovery.",
  mainEntityOfPage: {
    "@id": `${SITE_URL}#profile`,
  },
  sameAs: [
    "https://www.linkedin.com/in/gavin-woodhouse-514966286/",
    "https://gwoo.co.uk",
  ],
  knowsAbout: [
    "Business Advisory",
    "Crisis Management",
    "Business Restructuring",
    "Financial Structuring",
    "Strategic Mentoring",
    "Business Recovery",
    "Capital Structure Advisory",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  url: SITE_URL,
  name: "Gavin Woodhouse",
  description: "Official website of Gavin Woodhouse, UK business advisor and mentor.",
  publisher: {
    "@id": `${SITE_URL}#organization`,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: "Gavin Woodhouse",
  url: SITE_URL,
  logo: `${SITE_URL}/gavin_woodhouse_symbol.png`,
  description:
    "Personal advisory brand and official website publisher for Gavin Woodhouse, UK business advisor and mentor.",
  founder: {
    "@id": `${SITE_URL}#person`,
  },
  sameAs: [
    "https://www.linkedin.com/in/gavin-woodhouse-514966286/",
  ],
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}#profile`,
  url: SITE_URL,
  name: "Gavin Woodhouse - Business Advisor & Mentor",
  description:
    "Official profile of Gavin Woodhouse, UK business advisor and mentor specialising in crisis advisory, restructuring, and strategic mentoring.",
  mainEntity: {
    "@id": `${SITE_URL}#person`,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <div className="page-shell page-hero">
        <section className="hero-grid">
          <div className="section-block hero-copy">
            <span className="eyebrow">Business Advisor & Mentor</span>
            <h1 className="display-title">Gavin Woodhouse</h1>
            <p className="lede">
              Strategic business advisor, mentor, and crisis advisory voice for
              owners navigating growth, restructuring, reputational pressure,
              and recovery.
            </p>
            <p
              style={{
                margin: 0,
                maxWidth: "48rem",
                color: "var(--text)",
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            >
              Gavin Woodhouse built and led businesses that reached more than
              £40m in annual turnover and employed over 450 staff across
              multiple UK locations. He now offers commercially grounded support
              to business owners facing the kind of pressure most advisors never
              have to live through.
            </p>
            <div className="button-row">
              <Link href="/about" className="button-primary">
                Read Gavin&apos;s Story
              </Link>
              <Link href="/contact" className="button-secondary">
                Start a Conversation
              </Link>
            </div>
          </div>

          <aside className="hero-art">
            <div className="portrait-frame">
              <Image
                src="/photos/gavin-woodhouse-executive-headshot.jpg"
                alt="Gavin Woodhouse executive headshot"
                width={400}
                height={400}
                priority
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gap: "0.85rem",
              }}
            >
              <div className="pillar">
                <h3>Commercial credibility</h3>
                <p>
                  Built, scaled, and led businesses in the real world, with
                  practical responsibility for growth, teams, and delivery.
                </p>
              </div>
              <div className="pillar">
                <h3>Lived crisis perspective</h3>
                <p>
                  Advises from firsthand experience of scrutiny, disruption, and
                  recovery rather than theory alone.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="section-block">
          <div className="stat-strip">
            <div className="stat-card">
              <p className="stat-value">£40m+</p>
              <p className="stat-copy">Annual turnover reached before 2019.</p>
            </div>
            <div className="stat-card">
              <p className="stat-value">450+</p>
              <p className="stat-copy">
                Staff employed across multiple UK locations.
              </p>
            </div>
            <div className="stat-card">
              <p className="stat-value">Multi-site</p>
              <p className="stat-copy">
                Operational leadership across complex organisations and teams.
              </p>
            </div>
          </div>
        </section>

        <section className="section-block content-grid">
          <div>
            <span className="eyebrow">Why This Matters</span>
            <h2 className="section-title" style={{ marginTop: "1rem" }}>
              Advice shaped by both business growth and what happens when the
              pressure becomes personal.
            </h2>
            <p className="lede" style={{ marginTop: "1.15rem" }}>
              This is not generic business mentoring. Gavin&apos;s positioning is
              built on two things: proven commercial experience and the
              perspective that comes from navigating public pressure, adversity,
              and recovery. That combination is what makes the offer distinct.
            </p>
          </div>
          <div className="story-stack">
            <article className="story-card">
              <h3>Built something real</h3>
              <p>
                The credibility here starts with what was built: businesses,
                teams, operational scale, and serious commercial responsibility.
              </p>
            </article>
            <article className="story-card">
              <h3>Knows the cost of pressure</h3>
              <p>
                Gavin has navigated public scrutiny, reputational exposure, and
                the kind of commercial and personal pressure that most advisors
                only read about. That experience is what makes the perspective
                genuinely useful when the stakes are high.
              </p>
            </article>
            <article className="story-card">
              <h3>Useful now</h3>
              <p>
                The value is not in retelling the past for its own sake. It is
                in helping owners make better decisions when the ground becomes
                unstable.
              </p>
            </article>
          </div>
        </section>

        <section className="section-block">
          <span className="eyebrow">Advisory Services</span>
          <h2 className="section-title" style={{ marginTop: "1rem" }}>
            Clear support across crisis, restructuring, recovery, and strategic
            leadership.
          </h2>
          <div className="service-grid" style={{ marginTop: "1.5rem" }}>
            <article className="service-card">
              <span className="service-kicker">01</span>
              <h3>Crisis Advisory</h3>
              <p>
                Strategic support for business owners navigating pressure,
                destabilising events, reputational exposure, or serious
                uncertainty.
              </p>
              <p style={{ marginTop: "0.85rem" }}>
                <Link href="/services/crisis-advisory" className="button-secondary">
                  Crisis Advisory Service Page
                </Link>
              </p>
            </article>
            <article className="service-card">
              <span className="service-kicker">02</span>
              <h3>Restructuring Support</h3>
              <p>
                Guidance through restructuring processes that stabilise
                operations, improve financial performance, and create a
                sustainable footing.
              </p>
              <p style={{ marginTop: "0.85rem" }}>
                <Link href="/services/restructuring" className="button-secondary">
                  Restructuring Support Service Page
                </Link>
              </p>
            </article>
            <article className="service-card">
              <span className="service-kicker">03</span>
              <h3>Financial Structuring</h3>
              <p>
                Practical advice on capital structure, borrowing options,
                refinancing opportunities, and more disciplined commercial
                decision-making.
              </p>
              <p style={{ marginTop: "0.85rem" }}>
                <Link href="/services/financial-structuring" className="button-secondary">
                  Financial Structuring Service Page
                </Link>
              </p>
            </article>
            <article className="service-card">
              <span className="service-kicker">04</span>
              <h3>Strategic Mentoring</h3>
              <p>
                Direct support for owners who need a steadier, more experienced
                voice while rebuilding confidence, direction, and control.
              </p>
              <p style={{ marginTop: "0.85rem" }}>
                <Link href="/services/strategic-mentoring" className="button-secondary">
                  Strategic Mentoring Service Page
                </Link>
              </p>
            </article>
          </div>
        </section>

        <section className="section-block contact-grid">
          <div>
            <span className="eyebrow">Next Step</span>
            <h2 className="section-title" style={{ marginTop: "1rem" }}>
              Start with the story, then move into the practical advisory offer.
            </h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              The About page gives the fuller context. The Services page turns
              that context into a clearer commercial offer for owners and
              organisations who need experienced guidance.
            </p>
          </div>
          <div className="contact-card">
            <h3>Explore the next step</h3>
            <p>
              If the context matters, read the story. If the challenge is
              current, move directly into the advisory offer or contact page.
            </p>
            <div className="button-row" style={{ marginTop: "1.25rem" }}>
              <Link href="/services" className="button-secondary">
                Review Services
              </Link>
              <Link href="/contact" className="button-primary">
                Contact Gavin
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}


