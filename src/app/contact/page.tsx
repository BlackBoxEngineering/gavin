import type { Metadata } from "next";
import Image from "next/image";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Gavin Woodhouse",
  description:
    "Contact Gavin Woodhouse to discuss business advisory, restructuring support, crisis advisory, or strategic mentoring.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description:
      "Contact Gavin Woodhouse to discuss business advisory, restructuring support, crisis advisory, or strategic mentoring.",
    url: `${SITE_URL}/contact`,
  },
};

export default function Contact() {
  return (
    <div className="page-shell page-hero">
      <div className="about-layout">
        <div className="about-main">
          <section className="section-block">
            <span className="eyebrow">Contact</span>
            <h1 className="section-title" style={{ marginTop: "1rem" }}>
              Contact Gavin Woodhouse for advisory, restructuring support,
              crisis guidance, or strategic mentoring.
            </h1>
            <p className="lede" style={{ marginTop: "1rem" }}>
              The aim is a direct and discreet first conversation. If the
              situation is commercially sensitive, operationally difficult, or
              personally high-pressure, this page provides a straightforward
              way to make contact.
            </p>
          </section>

          <section className="section-block">
            <span className="eyebrow">Suitable Enquiries</span>
            <h2 className="section-title" style={{ marginTop: "1rem" }}>
              The best conversations usually begin before a situation becomes
              harder to control.
            </h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              Contact may be appropriate if a business is entering a period of
              restructuring, facing leadership pressure, dealing with financial
              strain, or simply needing a more experienced external perspective
              during a difficult chapter.
            </p>
          </section>

          <section className="section-block">
            <span className="eyebrow">Get in Touch</span>
            <h2 className="section-title" style={{ marginTop: "1rem" }}>
              Start with a direct message.
            </h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              A short outline is enough: the pressure point, the business
              context, and whether the issue is strategic, financial,
              operational, or reputational.
            </p>
            <div className="contact-intake">
              <label className="form-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                className="form-textarea"
                rows={7}
                placeholder="Describe the situation, the business context, and the best way to reply."
              />
              <div className="contact-intake-actions">
                <button type="button" className="button-primary">
                  Send Message
                </button>
                <p className="form-note">
                  Contact submissions will be handled privately through the
                  site and routed into the admin dashboard.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="about-side">
          <section className="section-block">
            <Image
              src="/photos/gavin-woodhouse-formal-portrait.jpg"
              alt="Gavin Woodhouse portrait"
              width={1200}
              height={1600}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </section>

          <section className="section-block">
            <div className="story-stack">
              <article className="story-card">
                <h3>What to include</h3>
                <p>
                  A short outline is enough. Explain the pressure point, the
                  business context, and whether the issue is strategic,
                  financial, operational, or reputational. The purpose of
                  first contact is to establish whether a conversation would be
                  useful.
                </p>
              </article>
              <article className="story-card">
                <h3>Business advisory</h3>
                <p>
                  For owners and leaders who need clearer commercial judgement
                  and practical outside perspective.
                </p>
              </article>
              <article className="story-card">
                <h3>Restructuring and recovery</h3>
                <p>
                  For organisations stabilising operations, reviewing
                  structure, or trying to move through a more difficult trading
                  period.
                </p>
              </article>
              <article className="story-card">
                <h3>Pressure and complexity</h3>
                <p>
                  For situations where decisions carry reputational,
                  financial, or personal weight and steadier thinking matters.
                </p>
              </article>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

