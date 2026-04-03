import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for gavinwoodhouse.com.",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

export default function Terms() {
  return (
    <div className="page-shell page-hero">
      <section className="section-block" style={{ maxWidth: "720px" }}>
        <span className="eyebrow">Legal</span>
        <h1 className="section-title" style={{ marginTop: "1rem" }}>
          Terms of Use
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Last updated: April 2026
        </p>

        <div style={{ marginTop: "2rem", display: "grid", gap: "1.5rem", lineHeight: 1.8, color: "var(--text)" }}>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>About this site</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              gavinwoodhouse.com is the personal and professional profile site of Gavin Woodhouse,
              operating via Cens Investments, 86–90 Paul Street, London EC2A 4NE, registered in
              England No. 14065345. The site provides information about Gavin Woodhouse and the
              advisory services he offers.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Information only</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              The content on this site is provided for general informational purposes only.
              Nothing on this site constitutes financial, legal, or professional advice.
              Any advisory engagement with Gavin Woodhouse is subject to a separate agreement
              entered into directly between the parties.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Intellectual property</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              All content on this site — including text, images, and design — is the property
              of Gavin Woodhouse or Cens Investments and may not be reproduced, distributed,
              or used without prior written permission.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Limitation of liability</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              To the fullest extent permitted by law, Gavin Woodhouse and Cens Investments
              accept no liability for any loss or damage arising from use of or reliance on
              the content of this site.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>External links</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              This site may contain links to third-party websites. We have no control over
              the content of those sites and accept no responsibility for them.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Governing law</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              These terms are governed by the laws of England and Wales. Any disputes arising
              from use of this site are subject to the exclusive jurisdiction of the courts
              of England and Wales.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Contact</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              Questions about these terms can be directed to{" "}
              <a href="mailto:gavin@censinvestments.co.uk" style={{ color: "var(--accent)" }}>
                gavin@censinvestments.co.uk
              </a>.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
