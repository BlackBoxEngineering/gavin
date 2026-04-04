import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Gavin Woodhouse",
  description:
    "About Gavin Woodhouse: business advisor and mentor with experience building a £40m business group, leading 450+ staff, and advising on crisis, restructuring, and recovery.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `About Gavin Woodhouse`,
    description:
      "Business advisor and mentor with experience in growth, crisis, restructuring, and recovery.",
    url: `${SITE_URL}/about`,
  },
};

export default function About() {
  return (
    <div className="page-shell page-hero">
      <section className="about-layout">
        <div className="about-main">
          <section className="section-block">
            <span className="eyebrow">About Gavin Woodhouse</span>
            <h1 className="section-title" style={{ marginTop: "1rem" }}>
              Business advisor and mentor shaped by both commercial growth and
              the reality of pressure, scrutiny, and recovery.
            </h1>
            <p className="lede" style={{ marginTop: "1rem" }}>
              Gavin Woodhouse built and led businesses that by 2019 had grown to
              more than £40m in annual turnover, employing over 450 staff across
              multiple UK locations. That commercial experience now sits
              alongside a very different kind of knowledge: what it takes to
              keep perspective, make decisions, and rebuild when the pressure
              becomes personal as well as professional.
            </p>
          </section>

          <section className="section-block">
            <div className="story-stack">
              <article className="story-card">
                <h3>What Gavin built</h3>
                <p>
                  Starting in 2013, Gavin Woodhouse built a group of businesses
                  that scaled quickly and significantly. The work involved
                  growth, leadership, operational delivery, commercial pressure,
                  and responsibility for teams across multiple sites.
                </p>
              </article>
              <article className="story-card">
                <h3>What changed</h3>
                <p>
                  In 2019, that trajectory was disrupted by a period of severe
                  public and commercial adversity. The consequences were not only
                  financial or reputational. They affected every part of life,
                  including relationships, health, and personal stability.
                </p>
              </article>
              <article className="story-card">
                <h3>Why that matters now</h3>
                <p>
                  Gavin&apos;s advisory work is shaped by both sides of that
                  experience. He understands how to build, but he also
                  understands what happens when pressure escalates, narratives
                  harden, and trusted support starts to disappear.
                </p>
              </article>
            </div>
          </section>

          <section className="section-block">
            <span className="eyebrow">Perspective</span>
            <h2 className="section-title" style={{ marginTop: "1rem" }}>
              Calm judgement matters most when businesses and lives are both
              under strain.
            </h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              Gavin&apos;s perspective is not driven by theory, image, or
              corporate language. It is grounded in lived experience, in a
              people-first view of leadership, and in the belief that business
              success means very little if everything else around it is allowed
              to fall apart.
            </p>
          </section>

          <section className="section-block">
            <span className="eyebrow">Today</span>
            <h2 className="section-title" style={{ marginTop: "1rem" }}>
              The work now is focused on helping owners and organisations
              navigate complexity with more stability and clearer thinking.
            </h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              That includes crisis advisory, restructuring support, financial
              structuring, and strategic mentoring for business owners who need a
              practical and steady voice when decisions carry real weight.
            </p>
          </section>
        </div>

        <aside className="about-side">
          <section className="media-panel">
            <video
              controls
              preload="metadata"
              playsInline
              poster="/photos/gavin-woodhouse-about-story-portrait.jpg"
            >
              <source
                src="/videos/gavin-woodhouse-about-introduction.mp4"
                type="video/mp4"
              />
            </video>

          </section>

          <section className="story-card">
            <h3 style={{ marginBottom: "1rem" }}>Work with Gavin</h3>
            <p>
              If the background resonates and the challenge is current, the
              next step is a direct conversation. No obligation, no pitch -
              just a practical discussion about whether the advisory offer is
              the right fit.
            </p>
            <div className="button-row" style={{ marginTop: "1.4rem" }}>
              <Link href="/services" className="button-secondary">
                See Services
              </Link>
              <Link href="/contact" className="button-primary">
                Get in Touch
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

