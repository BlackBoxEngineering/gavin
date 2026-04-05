"use client";

import "@/lib/amplify-client";
import { generateClient } from "aws-amplify/data";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useEffect, useMemo, useState } from "react";

interface SupportMessageRow {
  id: string;
  userId: string;
  fromUserId: string;
  fromUserType: "user" | "admin";
  message: string;
  createdAt?: string;
}

export default function SupportMessagePanel() {
  const client = useMemo(() => generateClient({ authMode: "userPool" }), []);
  const [isReady, setIsReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [rows, setRows] = useState<SupportMessageRow[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [modelReady, setModelReady] = useState(false);

  const loadThread = async (resolvedUserId: string) => {
    const model = (client as any).models?.SupportMessage;
    if (!model) {
      setModelReady(false);
      setRows([]);
      return;
    }
    setModelReady(true);
    const response = await model.list({
      filter: { userId: { eq: resolvedUserId } },
      authMode: "userPool",
    });
    const thread = ((response?.data || []) as SupportMessageRow[]).slice().sort((a, b) => {
      const aDate = new Date(a?.createdAt || 0).getTime();
      const bDate = new Date(b?.createdAt || 0).getTime();
      return aDate - bDate;
    });
    setRows(thread);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const current = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        const resolvedUserId = attrs.sub || current.userId || attrs.email || "";
        if (!resolvedUserId) {
          setStatus("Unable to resolve your user identity.");
          setIsSignedIn(false);
          setIsReady(true);
          return;
        }
        setUserId(resolvedUserId);
        setIsSignedIn(true);
        await loadThread(resolvedUserId);
      } catch {
        setIsSignedIn(false);
      } finally {
        setIsReady(true);
      }
    };

    void init();
  }, []);

  const sendMessage = async () => {
    if (!modelReady || sending || !message.trim() || !userId) return;
    try {
      setSending(true);
      setStatus("Sending message...");
      const model = (client as any).models?.SupportMessage;
      if (!model) {
        setStatus("Support message model is not deployed yet.");
        return;
      }
      await model.create(
        {
          userId,
          fromUserId: userId,
          fromUserType: "user",
          message: message.trim(),
          isAdminNote: false,
        },
        { authMode: "userPool" }
      );
      setMessage("");
      await loadThread(userId);
      setStatus("Message sent.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const requestLogin = () => {
    window.dispatchEvent(new Event("triggerLogin"));
  };

  if (!isReady) {
    return (
      <section className="section-block">
        <span className="eyebrow">Private Messages</span>
        <p className="lede" style={{ marginTop: "1rem" }}>
          Loading your message center...
        </p>
      </section>
    );
  }

  if (!isSignedIn) {
    return (
      <section className="section-block">
        <span className="eyebrow">Private Messages</span>
        <h2 className="section-title" style={{ marginTop: "1rem" }}>
          Private thread with Gavin
        </h2>
        <p className="lede" style={{ marginTop: "1rem" }}>
          You need to sign in to open a private message thread with Gavin.
        </p>
        <div className="button-row" style={{ marginTop: "1rem" }}>
          <button type="button" className="button-primary" onClick={requestLogin}>
            Login to Continue
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block">
      <span className="eyebrow">Private Messages</span>
      <h2 className="section-title" style={{ marginTop: "1rem" }}>
        Private thread with Gavin
      </h2>
      {!modelReady ? (
        <p className="lede" style={{ marginTop: "1rem" }}>
          Support message model is not deployed yet.
        </p>
      ) : (
        <>
          <div className="story-stack" style={{ marginTop: "1rem" }}>
            {rows.length === 0 ? (
              <article className="story-card">
                <p>No messages yet. Start the conversation below.</p>
              </article>
            ) : (
              rows.map((row) => (
                <article className="story-card" key={row.id}>
                  <h3>{row.fromUserType === "admin" ? "Gavin" : "You"}</h3>
                  <p style={{ whiteSpace: "pre-wrap" }}>{row.message}</p>
                  <p className="form-note" style={{ marginTop: "0.6rem" }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}
                  </p>
                </article>
              ))
            )}
          </div>
          <div className="contact-intake" style={{ marginTop: "1rem" }}>
            <label className="form-label" htmlFor="support-message-user">
              New message
            </label>
              <textarea
                id="support-message-user"
                className="form-textarea"
                rows={6}
                placeholder="Write your message to Gavin..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            <div className="contact-intake-actions">
              <button
                type="button"
                className="button-primary"
                disabled={sending || !message.trim()}
                onClick={() => {
                  void sendMessage();
                }}
              >
                {sending ? "Sending..." : "Send to Gavin"}
              </button>
              {status ? <p className="form-note">{status}</p> : null}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
