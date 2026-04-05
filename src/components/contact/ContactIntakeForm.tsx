"use client";

import "@/lib/amplify-client";
import { generateClient } from "aws-amplify/data";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  message: "",
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function ContactIntakeForm() {
  const client = useMemo(() => generateClient({ authMode: "identityPool" }), []);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const preloadSignedInDetails = async () => {
      try {
        await fetchAuthSession();
        const attrs = await fetchUserAttributes();
        setForm((current) => ({
          ...current,
          name: current.name || attrs.name || attrs.given_name || "",
          email: current.email || attrs.email || "",
        }));
      } catch {
        // Guest users can still submit with identity pool auth.
      }
    };

    void preloadSignedInDetails();
  }, []);

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async () => {
    if (submitting) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus("Name, email, and message are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setStatus("Sending...");

    try {
      const contactModel =
        (client as any).models?.Contact || (client as any).models?.ContactSubmission;
      if (!contactModel) {
        setStatus("Contact model is not available yet.");
        return;
      }

      await contactModel.create(
        {
          name,
          email,
          message,
        },
        { authMode: "identityPool" },
      );

      setForm((current) => ({
        ...current,
        message: "",
      }));
      setStatus("Message sent. We will review and respond privately.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Failed to send message.";
      setStatus(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-intake">
      <label className="form-label" htmlFor="contact-name">
        Name
      </label>
      <input
        id="contact-name"
        type="text"
        className="form-textarea admin-input"
        placeholder="Your name"
        value={form.name}
        onChange={handleChange("name")}
        autoComplete="name"
      />

      <label className="form-label" htmlFor="contact-email">
        Email
      </label>
      <input
        id="contact-email"
        type="email"
        className="form-textarea admin-input"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange("email")}
        autoComplete="email"
      />

      <label className="form-label" htmlFor="contact-message">
        Message
      </label>
      <textarea
        id="contact-message"
        className="form-textarea"
        rows={7}
        placeholder="Describe the situation, the business context, and the best way to reply."
        value={form.message}
        onChange={handleChange("message")}
      />
      <div className="contact-intake-actions">
        <button type="button" className="button-primary" disabled={submitting} onClick={handleSubmit}>
          {submitting ? "Sending..." : "Send Message"}
        </button>
        {status ? <p className="form-note">{status}</p> : null}
      </div>
    </div>
  );
}
