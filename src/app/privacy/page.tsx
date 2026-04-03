import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for gavinwoodhouse.com — how personal data submitted via the contact form is collected, stored, and used.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

export default function Privacy() {
  return (
    <div className="page-shell page-hero">
      <section className="section-block" style={{ maxWidth: "720px" }}>
        <span className="eyebrow">Legal</span>
        <h1 className="section-title" style={{ marginTop: "1rem" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          Last updated: April 2026
        </p>

        <div style={{ marginTop: "2rem", display: "grid", gap: "1.5rem", lineHeight: 1.8, color: "var(--text)" }}>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Who we are</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              This website is operated by Gavin Woodhouse, trading via Cens Investments,
              86–90 Paul Street, London EC2A 4NE, registered in England No. 14065345.
              Contact: <a href="mailto:gavin@censinvestments.co.uk" style={{ color: "var(--accent)" }}>gavin@censinvestments.co.uk</a>
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>What data we collect</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              When you submit the contact form on this site, we collect your name, email address,
              and the content of your message. Company name and phone number are optional and
              collected only if you choose to provide them. No other personal data is collected.
              This site does not use cookies, tracking scripts, or analytics tools.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>How we use your data</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              Your data is used solely to respond to your enquiry. It is not used for marketing,
              shared with third parties, or sold under any circumstances.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Where your data is stored</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              Contact form submissions are stored securely on Amazon Web Services infrastructure
              in the US East (N. Virginia) region. AWS is compliant with GDPR standard contractual
              clauses for international data transfers.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>How long we keep your data</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              Enquiry data is retained for up to 12 months and then deleted, unless an ongoing
              advisory relationship requires it to be kept longer, in which case you will be
              informed separately.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Your rights</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              Under UK GDPR you have the right to access, correct, or request deletion of any
              personal data we hold about you. To exercise any of these rights, email{" "}
              <a href="mailto:gavin@censinvestments.co.uk" style={{ color: "var(--accent)" }}>
                gavin@censinvestments.co.uk
              </a>.
              We will respond within 30 days.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Changes to this policy</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>
              This policy may be updated from time to time. The date at the top of this page
              reflects the most recent revision. Continued use of the site constitutes acceptance
              of any changes.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
