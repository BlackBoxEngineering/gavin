"use client";

import "@/lib/amplify-client";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useEffect, useMemo, useState } from "react";
import { getSessionGroups, hasAdminAccess, REQUIRED_ADMIN_GROUPS } from "@/lib/adminAccess";
import { sendAdminMail } from "@/services/adminMailService";
import { loadAdminMailDraft, saveAdminMailDraft } from "@/services/adminMailDraftStorage";
import {
  deleteUser,
  getUserList,
  hasDeleteApiConfigured,
  hasUserApiConfigured,
  type AdminUserData,
} from "@/services/adminUsersService";

type GateState = "loading" | "signedOut" | "forbidden" | "ready" | "error";
type AdminTab = "overview" | "users" | "messages" | "emails" | "contactForms";

interface ContactSubmission {
  id: string;
  name?: string;
  email?: string;
  message?: string;
  createdAt?: string;
}

interface SupportMessageRow {
  id: string;
  userId: string;
  fromUserId: string;
  fromUserType: "user" | "admin";
  message: string;
  createdAt?: string;
}

interface UserProfileRow {
  id?: string;
  email?: string;
  displayName?: string;
}

const DEFAULT_SENDERS = [
  "support@gavinwoodhouse.com",
  "info@gavinwoodhouse.com",
  "admin@gavinwoodhouse.com",
  "applications@gavinwoodhouse.com",
  "voting@gavinwoodhouse.com",
  "noreply@gavinwoodhouse.com",
];

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="M4.75 6.75h14.5A1.25 1.25 0 0 1 20.5 8v8a1.25 1.25 0 0 1-1.25 1.25h-9l-4 3v-3H4.75A1.25 1.25 0 0 1 3.5 16V8a1.25 1.25 0 0 1 1.25-1.25Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="M5.75 7.25h12.5M9.25 7.25V5.5h5.5v1.75M8.25 9.75v7.25M12 9.75v7.25M15.75 9.75v7.25M7 19.25h10A1.25 1.25 0 0 0 18.25 18V7.25H5.75V18A1.25 1.25 0 0 0 7 19.25Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export default function AdminPageClient() {
  const dataClient = useMemo(() => generateClient({ authMode: "userPool" }), []);
  const [state, setState] = useState<GateState>("loading");
  const [email, setEmail] = useState<string>("");
  const [groups, setGroups] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [status, setStatus] = useState("");
  const [contactModelReady, setContactModelReady] = useState(false);
  const [messageModelReady, setMessageModelReady] = useState(false);

  const [selectedMessageUserId, setSelectedMessageUserId] = useState("");
  const [threadRows, setThreadRows] = useState<SupportMessageRow[]>([]);
  const [threadBody, setThreadBody] = useState("");
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadSending, setThreadSending] = useState(false);
  const [threadStatus, setThreadStatus] = useState("");

  const initialDraft = useMemo(() => loadAdminMailDraft(), []);
  const [recipientEmail, setRecipientEmail] = useState(initialDraft.recipientEmail || "");
  const [fromEmail, setFromEmail] = useState(initialDraft.fromEmail || DEFAULT_SENDERS[0]);
  const [subject, setSubject] = useState(initialDraft.subject || "");
  const [message, setMessage] = useState(initialDraft.message || "");
  const [sending, setSending] = useState(false);
  const [mailStatus, setMailStatus] = useState("");

  const senders = useMemo(() => {
    const configured = (process.env.NEXT_PUBLIC_GAVIN_FROM_EMAILS || "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    return Array.from(new Set(configured.length > 0 ? configured : DEFAULT_SENDERS));
  }, []);

  useEffect(() => {
    if (!senders.includes(fromEmail)) {
      setFromEmail(senders[0] || DEFAULT_SENDERS[0]);
    }
  }, [fromEmail, senders]);

  useEffect(() => {
    saveAdminMailDraft({ recipientEmail, fromEmail, subject, message });
  }, [recipientEmail, fromEmail, subject, message]);

  const getUserEmail = (user: AdminUserData): string =>
    user.Attributes?.email || user.Attributes?.["custom:email"] || user.Username;

  const getUserName = (user: AdminUserData): string =>
    user.Attributes?.nickname ||
    user.Attributes?.given_name ||
    user.Attributes?.name ||
    getUserEmail(user);

  const getMessageUserId = (user: AdminUserData): string =>
    user.Attributes?.sub || user.Username || getUserEmail(user);

  const selectedMessageUser =
    users.find((user) => getMessageUserId(user) === selectedMessageUserId) || null;

  const deleteEnabled = hasDeleteApiConfigured();

  const normalizeUser = (user: AdminUserData): AdminUserData => {
    const emailValue =
      user.Attributes?.email || user.Attributes?.["custom:email"] || user.Username || "";
    return {
      ...user,
      Username: user.Username || emailValue || "unknown-user",
      Attributes: {
        ...(user.Attributes || {}),
        email: emailValue,
      },
      UserStatus: user.UserStatus || "CONFIRMED",
      Enabled: user.Enabled ?? true,
    };
  };

  const mergeUsers = (...collections: AdminUserData[][]): AdminUserData[] => {
    const map = new Map<string, AdminUserData>();
    for (const list of collections) {
      for (const raw of list) {
        const user = normalizeUser(raw);
        const key = user.Attributes?.sub || user.Username || user.Attributes?.email || "";
        if (!key) continue;
        map.set(key, user);
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      getUserEmail(a).localeCompare(getUserEmail(b), undefined, { sensitivity: "base" })
    );
  };

  const loadContacts = async () => {
    const contactModel =
      (dataClient as any).models?.Contact || (dataClient as any).models?.ContactSubmission;
    if (!contactModel) {
      setContactModelReady(false);
      setContacts([]);
      return;
    }
    setContactModelReady(true);
    const response = await contactModel.list({ authMode: "userPool" });
    const rows = ((response?.data || []) as ContactSubmission[]).slice().sort((a, b) => {
      const aDate = new Date(a?.createdAt || 0).getTime();
      const bDate = new Date(b?.createdAt || 0).getTime();
      return bDate - aDate;
    });
    setContacts(rows);
  };

  const loadSupportThread = async (userId: string) => {
    const supportModel = (dataClient as any).models?.SupportMessage;
    if (!supportModel || !userId) {
      setMessageModelReady(false);
      setThreadRows([]);
      return;
    }
    setMessageModelReady(true);
    setThreadLoading(true);
    try {
      const response = await supportModel.list({
        filter: { userId: { eq: userId } },
        authMode: "userPool",
      });
      const rows = ((response?.data || []) as SupportMessageRow[]).slice().sort((a, b) => {
        const aDate = new Date(a?.createdAt || 0).getTime();
        const bDate = new Date(b?.createdAt || 0).getTime();
        return aDate - bDate;
      });
      setThreadRows(rows);
    } catch (error) {
      setThreadStatus(error instanceof Error ? error.message : "Failed to load message thread.");
    } finally {
      setThreadLoading(false);
    }
  };

  const loadData = async () => {
    setLoadingData(true);
    setStatus("");
    try {
      let apiUsers: AdminUserData[] = [];
      let profileUsers: AdminUserData[] = [];
      let threadUsers: AdminUserData[] = [];
      let apiError: string | null = null;
      const userApiConfigured = hasUserApiConfigured();

      if (userApiConfigured) {
        try {
          apiUsers = await getUserList();
        } catch (error) {
          apiError = error instanceof Error ? error.message : "User list API unavailable.";
        }
      }

      const userProfileModel = (dataClient as any).models?.UserProfile;
      if (userProfileModel) {
        try {
          const profileResponse = await userProfileModel.list({ authMode: "userPool" });
          profileUsers = ((profileResponse?.data || []) as UserProfileRow[]).map((row) => ({
            Username: row.id || row.email || "user-profile",
            Attributes: {
              sub: row.id || "",
              email: row.email || "",
              nickname: row.displayName || row.email || "",
              given_name: row.displayName || "",
            },
            UserStatus: "CONFIRMED",
            Enabled: true,
          }));
        } catch {
          // Keep silent; fallback data sources below.
        }
      }

      const supportModel = (dataClient as any).models?.SupportMessage;
      if (supportModel) {
        try {
          const supportResponse = await supportModel.list({ authMode: "userPool" });
          const rows = ((supportResponse?.data || []) as SupportMessageRow[]).filter(
            (row) => row.fromUserType === "user"
          );
          threadUsers = Array.from(new Set(rows.map((row) => row.userId).filter(Boolean))).map(
            (userId) => ({
              Username: userId,
              Attributes: {
                sub: userId,
                email: userId,
                nickname: userId,
              },
              UserStatus: "CONFIRMED",
              Enabled: true,
            })
          );
        } catch {
          // Keep silent; thread model may be empty/permission-limited.
        }
      }

      let loadedUsers = mergeUsers(apiUsers, profileUsers, threadUsers);

      if (userApiConfigured) {
        if (apiError) {
          setStatus(`User API error: ${apiError}. Showing fallback user sources only.`);
        } else if (apiUsers.length === 0) {
          setStatus("User API returned 0 users. Check gavin-getusers logs and USER_POOL_ID.");
        }
      }

      if (!userApiConfigured && loadedUsers.length === 0) {
        const currentUser = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        loadedUsers = [
          {
            Username: currentUser.userId || attributes.sub || attributes.email || "current-user",
            Attributes: {
              sub: attributes.sub || currentUser.userId || "",
              email: attributes.email || "",
              given_name: attributes.given_name || "",
              family_name: attributes.family_name || "",
              nickname: attributes.nickname || attributes.given_name || attributes.email || "",
            },
            UserStatus: "CONFIRMED",
            Enabled: true,
          },
        ];
      }

      setUsers(loadedUsers);
      if (loadedUsers.length > 0) {
        setSelectedMessageUserId((current) => current || getMessageUserId(loadedUsers[0]));
      }

      await loadContacts();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load admin data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await getCurrentUser();
        const session = await fetchAuthSession();
        const sessionGroups = getSessionGroups(session);
        setGroups(sessionGroups);

        if (!hasAdminAccess(sessionGroups)) {
          setState("forbidden");
          return;
        }

        const attrs = await fetchUserAttributes();
        setEmail(attrs.email ?? "");
        setState("ready");
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message.toLowerCase().includes("not authenticated")) {
          setState("signedOut");
          return;
        }
        setState("error");
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (state === "ready") {
      void loadData();
    }
  }, [state]);

  useEffect(() => {
    if (state === "ready" && selectedMessageUserId) {
      void loadSupportThread(selectedMessageUserId);
    }
  }, [state, selectedMessageUserId]);

  const handleMessageUser = (user: AdminUserData) => {
    setSelectedMessageUserId(getMessageUserId(user));
    setActiveTab("messages");
  };

  const handleDeleteUser = async (user: AdminUserData) => {
    if (!hasDeleteApiConfigured()) {
      setStatus("Delete user API not configured.");
      return;
    }
    const confirmed = window.confirm(`Delete user "${getUserEmail(user)}"?`);
    if (!confirmed) return;
    try {
      await deleteUser(user.Username);
      setUsers((prev) => prev.filter((row) => row.Username !== user.Username));
      setStatus(`User ${getUserEmail(user)} deleted.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  const handleDeleteContact = async (id: string) => {
    const confirmed = window.confirm("Delete this contact submission?");
    if (!confirmed) return;
    try {
      const contactModel =
        (dataClient as any).models?.Contact || (dataClient as any).models?.ContactSubmission;
      if (!contactModel) {
        setStatus("Contact model not configured.");
        return;
      }
      await contactModel.delete({ id });
      setContacts((prev) => prev.filter((row) => row.id !== id));
      setStatus("Contact submission deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to delete contact submission");
    }
  };

  const handleSendMail = async () => {
    if (sending) return;
    if (!recipientEmail.trim() || !message.trim()) {
      setMailStatus("Recipient email and message are required.");
      return;
    }

    try {
      setSending(true);
      setMailStatus("Sending email...");
      await sendAdminMail({
        recipientEmail: recipientEmail.trim(),
        fromEmail: fromEmail.trim() || undefined,
        subject: subject.trim() || "Message from Gavin Woodhouse",
        message: message.trim(),
      });
      setMailStatus("Email sent successfully.");
      setMessage("");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Failed to send email";
      setMailStatus(detail);
    } finally {
      setSending(false);
    }
  };

  const handleSendSupportReply = async () => {
    if (!selectedMessageUserId || !threadBody.trim() || threadSending) return;
    try {
      setThreadSending(true);
      setThreadStatus("Sending message...");
      const supportModel = (dataClient as any).models?.SupportMessage;
      if (!supportModel) {
        setThreadStatus("SupportMessage model not configured.");
        return;
      }
      await supportModel.create(
        {
          userId: selectedMessageUserId,
          fromUserId: "admin",
          fromUserType: "admin",
          message: threadBody.trim(),
          isAdminNote: false,
        },
        { authMode: "userPool" }
      );
      setThreadBody("");
      await loadSupportThread(selectedMessageUserId);
      setThreadStatus("Message sent.");
    } catch (error) {
      setThreadStatus(error instanceof Error ? error.message : "Failed to send message.");
    } finally {
      setThreadSending(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="page-shell page-hero">
        <section className="section-block">
          <span className="eyebrow">Admin</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Loading admin workspace...
          </h1>
        </section>
      </div>
    );
  }

  if (state === "signedOut") {
    return (
      <div className="page-shell page-hero">
        <section className="section-block">
          <span className="eyebrow">Admin Access Required</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Sign in to continue.
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            This page is available only to authenticated admin users.
          </p>
          <div className="button-row" style={{ marginTop: "1.25rem" }}>
            <Link href="/" className="button-primary">
              Return Home
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (state === "forbidden") {
    return (
      <div className="page-shell page-hero">
        <section className="section-block">
          <span className="eyebrow">Admin Access Required</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Your account is signed in but does not have admin permissions.
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Required Cognito groups: {REQUIRED_ADMIN_GROUPS.join(", ")}.
          </p>
          {groups.length > 0 ? (
            <p className="lede" style={{ marginTop: "0.8rem" }}>
              Current groups: {groups.join(", ")}.
            </p>
          ) : null}
        </section>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="page-shell page-hero">
        <section className="section-block">
          <span className="eyebrow">Admin</span>
          <h1 className="section-title" style={{ marginTop: "1rem" }}>
            Unable to load admin data right now.
          </h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Please refresh and try again.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell page-hero">
      <section className="section-block admin-hero">
        <span className="eyebrow">Admin Workspace</span>
      </section>

      <section className="section-block admin-tools-shell">
        <div className="admin-tabs" role="tablist" aria-label="Admin tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            className={`admin-tab${activeTab === "overview" ? " admin-tab-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "users"}
            className={`admin-tab${activeTab === "users" ? " admin-tab-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "messages"}
            className={`admin-tab${activeTab === "messages" ? " admin-tab-active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "emails"}
            className={`admin-tab${activeTab === "emails" ? " admin-tab-active" : ""}`}
            onClick={() => setActiveTab("emails")}
          >
            System Emails
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "contactForms"}
            className={`admin-tab${activeTab === "contactForms" ? " admin-tab-active" : ""}`}
            onClick={() => setActiveTab("contactForms")}
          >
            Contact Forms
          </button>
        </div>

        {status ? <p className="form-note">{status}</p> : null}
        {loadingData ? <p className="form-note">Loading admin data...</p> : null}

        {activeTab === "overview" ? (
          <div className="admin-tab-panel">
            <div className="admin-metrics-grid">
              <article className="story-card">
                <h3>Users</h3>
                <p className="admin-metric-value">{users.length}</p>
              </article>
              <article className="story-card">
                <h3>Contact Submissions</h3>
                <p className="admin-metric-value">{contacts.length}</p>
              </article>
              <article className="story-card">
                <h3>Support Messaging</h3>
                <p className="admin-metric-value">{messageModelReady ? "Ready" : "Missing"}</p>
              </article>
              <article className="story-card">
                <h3>Email API</h3>
                <p className="admin-metric-value">
                  {process.env.NEXT_PUBLIC_GAVIN_MAIL_API ||
                  "https://457iafd5sc.execute-api.us-east-1.amazonaws.com/main/mailout"
                    ? "Ready"
                    : "Missing"}
                </p>
              </article>
            </div>
          </div>
        ) : null}

        {activeTab === "users" ? (
          <div className="admin-tab-panel">
            <h2 className="section-title admin-panel-title" style={{ marginTop: 0 }}>
              All Users ({users.length})
            </h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.Username}>
                      <td>{getUserName(user)}</td>
                      <td>{getUserEmail(user)}</td>
                      <td>{user.UserStatus || "CONFIRMED"}</td>
                      <td>
                        <div className="admin-actions-row">
                          <button
                            type="button"
                            className="admin-icon-btn"
                            onClick={() => handleMessageUser(user)}
                            aria-label={`Message ${getUserEmail(user)}`}
                            title="Message user"
                          >
                            <MessageIcon />
                          </button>
                          {deleteEnabled ? (
                            <button
                              type="button"
                              className="admin-icon-btn admin-delete-btn"
                              onClick={() => {
                                void handleDeleteUser(user);
                              }}
                              aria-label={`Delete ${getUserEmail(user)}`}
                              title="Delete user"
                            >
                              <TrashIcon />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-user-cards">
              {users.map((user) => (
                <article className="story-card admin-user-card" key={`card-${user.Username}`}>
                  <div className="admin-user-card-head">
                    <div>
                      <h3>{getUserName(user)}</h3>
                      <p className="admin-user-card-email">{getUserEmail(user)}</p>
                    </div>
                    <span className="admin-user-status">{user.UserStatus || "CONFIRMED"}</span>
                  </div>
                  <div className="admin-user-card-actions">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={() => handleMessageUser(user)}
                      aria-label={`Message ${getUserEmail(user)}`}
                      title="Message user"
                    >
                      <MessageIcon />
                    </button>
                    {deleteEnabled ? (
                      <button
                        type="button"
                        className="admin-icon-btn admin-delete-btn"
                        onClick={() => {
                          void handleDeleteUser(user);
                        }}
                        aria-label={`Delete ${getUserEmail(user)}`}
                        title="Delete user"
                      >
                        <TrashIcon />
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "messages" ? (
          <div className="admin-tab-panel">
            <h2 className="section-title admin-panel-title" style={{ marginTop: 0 }}>
              Support Messages
            </h2>
            {!messageModelReady ? (
              <p className="lede admin-empty-state" style={{ marginTop: "1rem" }}>
                SupportMessage model is not deployed yet.
              </p>
            ) : (
              <div className="admin-message-grid" style={{ marginTop: "1rem" }}>
                <div className="story-stack admin-message-list">
                  {users.map((user) => {
                    const messageUserId = getMessageUserId(user);
                    return (
                      <button
                        key={user.Username}
                        type="button"
                        className={`admin-user-thread-btn${
                          selectedMessageUserId === messageUserId ? " admin-user-thread-btn-active" : ""
                        }`}
                        onClick={() => setSelectedMessageUserId(messageUserId)}
                      >
                        <strong>{getUserName(user)}</strong>
                        <span>{getUserEmail(user)}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="story-card admin-thread-panel">
                  <h3 style={{ marginBottom: "0.8rem" }}>
                    {selectedMessageUser ? `Thread: ${getUserName(selectedMessageUser)}` : "Select a user"}
                  </h3>
                  {threadLoading ? (
                    <p className="form-note">Loading thread...</p>
                  ) : threadRows.length === 0 ? (
                    <p className="form-note">No messages yet for this user.</p>
                  ) : (
                    <div className="story-stack admin-thread-list">
                      {threadRows.map((row) => (
                        <article className="story-card admin-thread-card" key={row.id}>
                          <h3>{row.fromUserType === "admin" ? "Admin" : "User"}</h3>
                          <p style={{ whiteSpace: "pre-wrap" }}>{row.message}</p>
                          <p className="form-note" style={{ marginTop: "0.6rem" }}>
                            {row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}

                  <div className="contact-intake" style={{ marginTop: "1rem" }}>
                    <label className="form-label" htmlFor="admin-support-reply">
                      Reply
                    </label>
                    <textarea
                      id="admin-support-reply"
                      className="form-textarea"
                      rows={5}
                      placeholder="Write a reply to this user..."
                      value={threadBody}
                      onChange={(event) => setThreadBody(event.target.value)}
                    />
                    <div className="contact-intake-actions">
                      <button
                        type="button"
                        className="button-primary"
                        disabled={!selectedMessageUserId || !threadBody.trim() || threadSending}
                        onClick={() => {
                          void handleSendSupportReply();
                        }}
                      >
                        {threadSending ? "Sending..." : "Send Reply"}
                      </button>
                      {threadStatus ? <p className="form-note">{threadStatus}</p> : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "emails" ? (
          <div className="admin-tab-panel">
            <h2 className="section-title admin-panel-title" style={{ marginTop: 0 }}>
              System No-Reply Mailer
            </h2>
            <div className="contact-intake" style={{ marginTop: "1rem" }}>
              <div className="admin-form-grid">
                <div>
                  <label className="form-label" htmlFor="admin-mail-to">
                    Recipient
                  </label>
                  <input
                    id="admin-mail-to"
                    type="email"
                    className="form-textarea admin-input"
                    placeholder="client@example.com"
                    value={recipientEmail}
                    onChange={(event) => setRecipientEmail(event.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="admin-mail-from">
                    From
                  </label>
                  <select
                    id="admin-mail-from"
                    className="form-textarea admin-input"
                    value={fromEmail}
                    onChange={(event) => setFromEmail(event.target.value)}
                  >
                    {senders.map((sender) => (
                      <option key={sender} value={sender}>
                        {sender}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-grid-span">
                  <label className="form-label" htmlFor="admin-mail-subject">
                    Subject
                  </label>
                  <input
                    id="admin-mail-subject"
                    type="text"
                    className="form-textarea admin-input"
                    placeholder="Message from Gavin Woodhouse"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>
              </div>

              <label className="form-label" htmlFor="admin-mail-body">
                Message
              </label>
              <textarea
                id="admin-mail-body"
                className="form-textarea"
                rows={8}
                placeholder="Write your message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />

              <div className="contact-intake-actions">
                <button
                  type="button"
                  className="button-primary"
                  disabled={sending}
                  onClick={() => {
                    void handleSendMail();
                  }}
                >
                  {sending ? "Sending..." : "Send Email"}
                </button>
                {mailStatus ? <p className="form-note">{mailStatus}</p> : null}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "contactForms" ? (
          <div className="admin-tab-panel">
            <h2 className="section-title admin-panel-title" style={{ marginTop: 0 }}>
              Contact Submissions ({contacts.length})
            </h2>
            {!contactModelReady ? (
              <p className="lede admin-empty-state" style={{ marginTop: "1rem" }}>
                Contact model is not deployed yet. Add `Contact` (or `ContactSubmission`) to
                Amplify Data schema and deploy.
              </p>
            ) : contacts.length === 0 ? (
              <p className="lede admin-empty-state" style={{ marginTop: "1rem" }}>
                No contact submissions found.
              </p>
            ) : (
              <div className="story-stack admin-contact-list" style={{ marginTop: "1rem" }}>
                {contacts.map((row) => (
                  <article className="story-card" key={row.id}>
                    <div className="admin-contact-row">
                      <div className="admin-contact-meta">
                        <h3>{row.name || "Unknown"}</h3>
                        <p>{row.email || "No email provided"}</p>
                        <p className="form-note">
                          {row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="button-secondary admin-delete-btn"
                        onClick={() => {
                          void handleDeleteContact(row.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <p style={{ marginTop: "0.8rem", whiteSpace: "pre-wrap" }}>
                      {row.message || ""}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
