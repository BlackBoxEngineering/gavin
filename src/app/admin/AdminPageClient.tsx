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
  loadAdminMailLog,
  saveAdminMailLog,
  type AdminMailLogEntry,
} from "@/services/adminMailLogStorage";
import {
  deleteUser,
  getUserList,
  hasDeleteApiConfigured,
  hasUserApiConfigured,
  type AdminUserData,
} from "@/services/adminUsersService";

type GateState = "loading" | "signedOut" | "forbidden" | "ready" | "error";
type AdminTab = "overview" | "users" | "messages" | "emails" | "contactForms" | "clientContacts";
type ConfirmIntent =
  | { kind: "deleteUser"; user: AdminUserData }
  | { kind: "deleteContact"; id: string }
  | { kind: "deleteMessage"; row: SupportMessageRow }
  | { kind: "deleteClientContact"; id: string; label: string };

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

interface ClientContactRow {
  id: string;
  name: string;
  gender?: string;
  dob?: string;
  age?: number | null;
  address?: string;
  postcode?: string;
  country?: string;
  telephone?: string;
  email?: string;
  company?: string;
  project?: string;
  from?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ClientContactDraft {
  name: string;
  gender: string;
  dob: string;
  age: string;
  address: string;
  postcode: string;
  country: string;
  telephone: string;
  email: string;
  company: string;
  project: string;
  from: string;
}

const DEFAULT_SENDERS = [
  "support@gavinwoodhouse.com",
  "info@gavinwoodhouse.com",
  "admin@gavinwoodhouse.com",
  "applications@gavinwoodhouse.com",
  "voting@gavinwoodhouse.com",
  "noreply@gavinwoodhouse.com",
];

const createEmptyClientContactDraft = (): ClientContactDraft => ({
  name: "",
  gender: "",
  dob: "",
  age: "",
  address: "",
  postcode: "",
  country: "",
  telephone: "",
  email: "",
  company: "",
  project: "",
  from: "",
});

const normalizeEmailKey = (value?: string): string => String(value || "").trim().toLowerCase();
const normalizePhoneKey = (value?: string): string =>
  String(value || "")
    .trim()
    .replace(/[\s\-().]/g, "")
    .toLowerCase();

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

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="header-icon">
      <path
        d="M4.75 19.25h14.5M7.5 16.5 16.9 7.1a1.6 1.6 0 0 1 2.25 0l.75.75a1.6 1.6 0 0 1 0 2.25l-9.4 9.4-3.5.75.5-3.75Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.65"
      />
    </svg>
  );
}

function ConfirmModal({
  open,
  title,
  message,
  dangerNote,
  confirmLabel,
  requirePhrase,
  requireLabel,
  requireValue,
  onRequireValueChange,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  dangerNote?: string;
  confirmLabel: string;
  requirePhrase?: string;
  requireLabel?: string;
  requireValue?: string;
  onRequireValueChange?: (value: string) => void;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  const requiresTypedConfirm = Boolean(requirePhrase);
  const typedConfirmValid = !requiresTypedConfirm || (requireValue || "").trim() === requirePhrase;

  return (
    <div className="admin-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title">
      <div className="admin-confirm-backdrop" onClick={busy ? undefined : onCancel} />
      <div className="admin-confirm-panel">
        <h3 id="admin-confirm-title">{title}</h3>
        <p>{message}</p>
        {dangerNote ? <p className="admin-confirm-danger">{dangerNote}</p> : null}
        {requiresTypedConfirm ? (
          <div className="contact-intake" style={{ marginTop: 0 }}>
            <label className="form-label" htmlFor="admin-confirm-input">
              {requireLabel || `Type ${requirePhrase} to confirm`}
            </label>
            <input
              id="admin-confirm-input"
              type="text"
              className="admin-confirm-input"
              value={requireValue || ""}
              onChange={(event) => onRequireValueChange?.(event.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ) : null}
        <div className="admin-confirm-actions">
          <button type="button" className="button-secondary" onClick={onCancel} disabled={busy}>
            No
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={onConfirm}
            disabled={busy || !typedConfirmValid}
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
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
  const [clientContacts, setClientContacts] = useState<ClientContactRow[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [status, setStatus] = useState("");
  const [confirmIntent, setConfirmIntent] = useState<ConfirmIntent | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [contactModelReady, setContactModelReady] = useState(false);
  const [clientContactsModelReady, setClientContactsModelReady] = useState(false);
  const [messageModelReady, setMessageModelReady] = useState(false);
  const [clientContactSaving, setClientContactSaving] = useState(false);
  const [clientContactEditingId, setClientContactEditingId] = useState<string | null>(null);
  const [showClientContactEditor, setShowClientContactEditor] = useState(false);
  const [clientContactDraft, setClientContactDraft] = useState<ClientContactDraft>(
    createEmptyClientContactDraft
  );
  const [clientContactQuery, setClientContactQuery] = useState("");
  const [clientContactCompanyFilter, setClientContactCompanyFilter] = useState("all");
  const [clientContactProjectFilter, setClientContactProjectFilter] = useState("all");
  const [clientContactFromFilter, setClientContactFromFilter] = useState("all");
  const [clientContactSort, setClientContactSort] = useState<"az" | "za" | "newest" | "oldest">("az");
  const [clientContactsPage, setClientContactsPage] = useState(1);
  const [clientContactsPageSize, setClientContactsPageSize] = useState<10 | 25 | 50>(25);

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
  const [mailStatusTone, setMailStatusTone] = useState<"info" | "success" | "error">("info");
  const initialMailLog = useMemo(() => loadAdminMailLog(), []);
  const [mailLog, setMailLog] = useState<AdminMailLogEntry[]>(initialMailLog);

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

  useEffect(() => {
    saveAdminMailLog(mailLog);
  }, [mailLog]);

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

  const normalizeFilterValue = (value?: string | null): string => {
    const trimmed = String(value || "").trim();
    return trimmed || "Unspecified";
  };

  const normalizeMaybeNumber = (value: string): number | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isNaN(parsed)) return undefined;
    return parsed;
  };

  const companyFilterOptions = useMemo(
    () =>
      Array.from(new Set(clientContacts.map((row) => normalizeFilterValue(row.company)))).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ),
    [clientContacts]
  );

  const projectFilterOptions = useMemo(
    () =>
      Array.from(new Set(clientContacts.map((row) => normalizeFilterValue(row.project)))).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ),
    [clientContacts]
  );

  const fromFilterOptions = useMemo(
    () =>
      Array.from(new Set(clientContacts.map((row) => normalizeFilterValue(row.from)))).sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ),
    [clientContacts]
  );

  const filteredClientContacts = useMemo(() => {
    const query = clientContactQuery.trim().toLowerCase();
    const rows = clientContacts.filter((row) => {
      const matchesCompany =
        clientContactCompanyFilter === "all" ||
        normalizeFilterValue(row.company) === clientContactCompanyFilter;
      const matchesProject =
        clientContactProjectFilter === "all" ||
        normalizeFilterValue(row.project) === clientContactProjectFilter;
      const matchesFrom =
        clientContactFromFilter === "all" || normalizeFilterValue(row.from) === clientContactFromFilter;
      if (!matchesCompany || !matchesProject || !matchesFrom) {
        return false;
      }
      if (!query) return true;
      return [
        row.name,
        row.email,
        row.company,
        row.project,
        row.from,
        row.country,
        row.telephone,
        row.address,
        row.postcode,
      ]
        .map((value) => String(value || "").toLowerCase())
        .some((value) => value.includes(query));
    });

    const sorted = rows.slice();
    if (clientContactSort === "az" || clientContactSort === "za") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      if (clientContactSort === "za") sorted.reverse();
      return sorted;
    }

    sorted.sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return clientContactSort === "oldest" ? aDate - bDate : bDate - aDate;
    });
    return sorted;
  }, [
    clientContacts,
    clientContactCompanyFilter,
    clientContactFromFilter,
    clientContactProjectFilter,
    clientContactQuery,
    clientContactSort,
  ]);

  const clientContactsTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredClientContacts.length / clientContactsPageSize)),
    [filteredClientContacts.length, clientContactsPageSize]
  );

  const pagedClientContacts = useMemo(() => {
    const safePage = Math.min(clientContactsPage, clientContactsTotalPages);
    const start = (safePage - 1) * clientContactsPageSize;
    const end = start + clientContactsPageSize;
    return filteredClientContacts.slice(start, end);
  }, [clientContactsPage, clientContactsPageSize, clientContactsTotalPages, filteredClientContacts]);

  useEffect(() => {
    setClientContactsPage(1);
  }, [
    clientContactQuery,
    clientContactCompanyFilter,
    clientContactProjectFilter,
    clientContactFromFilter,
    clientContactSort,
    clientContactsPageSize,
  ]);

  useEffect(() => {
    if (clientContactsPage > clientContactsTotalPages) {
      setClientContactsPage(clientContactsTotalPages);
    }
  }, [clientContactsPage, clientContactsTotalPages]);

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

  const loadClientContacts = async () => {
    const model = (dataClient as any).models?.ClientContact;
    if (!model) {
      setClientContactsModelReady(false);
      setClientContacts([]);
      return;
    }
    setClientContactsModelReady(true);
    const allRows: ClientContactRow[] = [];
    let nextToken: string | undefined;
    do {
      const response = await model.list({
        authMode: "userPool",
        nextToken,
        limit: 500,
      });
      allRows.push(...((response?.data || []) as ClientContactRow[]));
      nextToken = response?.nextToken || undefined;
    } while (nextToken);
    const rows = allRows.slice().sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );
    setClientContacts(rows);
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

      let loadedUsers = mergeUsers(threadUsers, profileUsers, apiUsers);

      // When Cognito API users are available, treat them as source of truth
      // so stale thread/profile-only IDs do not create ghost rows.
      if (userApiConfigured && apiUsers.length > 0) {
        loadedUsers = mergeUsers(apiUsers);
      }

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

      await Promise.all([loadContacts(), loadClientContacts()]);
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
    if (email && getUserEmail(user).toLowerCase() === email.toLowerCase()) {
      setStatus("You cannot delete the currently signed-in admin user.");
      return;
    }
    try {
      await deleteUser(user.Username);
      setUsers((prev) => prev.filter((row) => row.Username !== user.Username));
      setStatus(`User ${getUserEmail(user)} deleted.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  const handleDeleteContact = async (id: string) => {
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

  const resetClientContactEditor = () => {
    setClientContactEditingId(null);
    setClientContactDraft(createEmptyClientContactDraft());
    setShowClientContactEditor(false);
  };

  const handleEditClientContact = (row: ClientContactRow) => {
    setClientContactEditingId(row.id);
    setShowClientContactEditor(true);
    setClientContactDraft({
      name: row.name || "",
      gender: row.gender || "",
      dob: row.dob || "",
      age: row.age != null ? String(row.age) : "",
      address: row.address || "",
      postcode: row.postcode || "",
      country: row.country || "",
      telephone: row.telephone || "",
      email: row.email || "",
      company: row.company || "",
      project: row.project || "",
      from: row.from || "",
    });
  };

  const handleClientContactFieldChange = (field: keyof ClientContactDraft, value: string) => {
    setClientContactDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClientContact = async () => {
    if (clientContactSaving) return;
    const model = (dataClient as any).models?.ClientContact;
    if (!model) {
      setStatus("ClientContact model not configured.");
      return;
    }
    if (!clientContactDraft.name.trim()) {
      setStatus("Client contact name is required.");
      return;
    }

    const draftEmailKey = normalizeEmailKey(clientContactDraft.email);
    const draftPhoneKey = normalizePhoneKey(clientContactDraft.telephone);
    const duplicate = clientContacts.find((row) => {
      if (clientContactEditingId && row.id === clientContactEditingId) return false;
      const rowEmailKey = normalizeEmailKey(row.email);
      const rowPhoneKey = normalizePhoneKey(row.telephone);
      const emailMatch = Boolean(draftEmailKey) && rowEmailKey === draftEmailKey;
      const phoneMatch = Boolean(draftPhoneKey) && rowPhoneKey === draftPhoneKey;
      return emailMatch || phoneMatch;
    });

    if (duplicate) {
      const duplicateLabel = duplicate.email || duplicate.telephone || duplicate.name;
      setStatus(`Duplicate detected. A contact with matching email or phone already exists (${duplicateLabel}).`);
      return;
    }

    const payload = {
      name: clientContactDraft.name.trim(),
      gender: clientContactDraft.gender.trim() || undefined,
      dob: clientContactDraft.dob.trim() || undefined,
      age: normalizeMaybeNumber(clientContactDraft.age),
      address: clientContactDraft.address.trim() || undefined,
      postcode: clientContactDraft.postcode.trim() || undefined,
      country: clientContactDraft.country.trim() || undefined,
      telephone: clientContactDraft.telephone.trim() || undefined,
      email: clientContactDraft.email.trim() || undefined,
      company: clientContactDraft.company.trim() || undefined,
      project: clientContactDraft.project.trim() || undefined,
      from: clientContactDraft.from.trim() || undefined,
    };

    try {
      setClientContactSaving(true);
      if (clientContactEditingId) {
        await model.update(
          {
            id: clientContactEditingId,
            ...payload,
          },
          { authMode: "userPool" }
        );
        setStatus("Client contact updated.");
      } else {
        await model.create(payload, { authMode: "userPool" });
        setStatus("Client contact added.");
      }
      resetClientContactEditor();
      await loadClientContacts();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to save client contact");
    } finally {
      setClientContactSaving(false);
    }
  };

  const handleDeleteClientContact = async (id: string) => {
    const model = (dataClient as any).models?.ClientContact;
    if (!model) {
      setStatus("ClientContact model not configured.");
      return;
    }
    try {
      await model.delete({ id }, { authMode: "userPool" });
      setClientContacts((prev) => prev.filter((row) => row.id !== id));
      if (clientContactEditingId === id) {
        resetClientContactEditor();
      }
      setStatus("Client contact deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to delete client contact");
    }
  };

  const handleDeleteSupportMessage = async (row: SupportMessageRow) => {
    try {
      const supportModel = (dataClient as any).models?.SupportMessage;
      if (!supportModel) {
        setThreadStatus("SupportMessage model not configured.");
        return;
      }
      await supportModel.delete({ id: row.id }, { authMode: "userPool" });
      setThreadRows((prev) => prev.filter((item) => item.id !== row.id));
      setThreadStatus("Message deleted.");
    } catch (error) {
      setThreadStatus(error instanceof Error ? error.message : "Failed to delete message.");
    }
  };

  const runConfirmIntent = async () => {
    if (!confirmIntent) return;
    setConfirmBusy(true);
    try {
      if (confirmIntent.kind === "deleteUser") {
        await handleDeleteUser(confirmIntent.user);
      } else if (confirmIntent.kind === "deleteContact") {
        await handleDeleteContact(confirmIntent.id);
      } else if (confirmIntent.kind === "deleteClientContact") {
        await handleDeleteClientContact(confirmIntent.id);
      } else {
        await handleDeleteSupportMessage(confirmIntent.row);
      }
      setConfirmIntent(null);
      setConfirmInput("");
    } finally {
      setConfirmBusy(false);
    }
  };

  const handleSendMail = async () => {
    if (sending) return;
    if (!recipientEmail.trim() || !message.trim()) {
      setMailStatusTone("error");
      setMailStatus("Recipient email and message are required.");
      return;
    }

    const payload = {
      recipientEmail: recipientEmail.trim(),
      fromEmail: fromEmail.trim() || undefined,
      subject: subject.trim() || "Message from Gavin Woodhouse",
      message: message.trim(),
    };

    try {
      setSending(true);
      setMailStatusTone("info");
      setMailStatus("Sending email...");
      await sendAdminMail(payload);
      setMailStatusTone("success");
      setMailStatus(`Email sent to ${payload.recipientEmail}.`);
      setMailLog((prev) => [
        {
          id: `${Date.now()}-ok`,
          at: new Date().toISOString(),
          status: "success",
          recipientEmail: payload.recipientEmail,
          fromEmail: payload.fromEmail || "",
          subject: payload.subject,
        },
        ...prev,
      ]);
      setMessage("");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Failed to send email";
      setMailStatusTone("error");
      setMailStatus(detail);
      setMailLog((prev) => [
        {
          id: `${Date.now()}-err`,
          at: new Date().toISOString(),
          status: "error",
          recipientEmail: payload.recipientEmail,
          fromEmail: payload.fromEmail || "",
          subject: payload.subject,
          detail,
        },
        ...prev,
      ]);
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
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "clientContacts"}
            className={`admin-tab${activeTab === "clientContacts" ? " admin-tab-active" : ""}`}
            onClick={() => setActiveTab("clientContacts")}
          >
            Client Contacts
          </button>
        </div>

        {status ? <p className="form-note">{status}</p> : null}
        {loadingData ? <p className="form-note">Loading admin data...</p> : null}

        {activeTab === "overview" ? (
          <div className="admin-tab-panel">
            <div className="admin-metrics-grid">
              <article className="story-card">
                <h3>Users</h3>
                <p>
                  Manage client accounts, monitor active access, and keep the user list
                  accurate for ongoing communication.
                </p>
                <p className="admin-metric-value">{users.length}</p>
              </article>
              <article className="story-card">
                <h3>Messages</h3>
                <p>
                  Review and reply to private client threads so support conversations stay in
                  one place and are easy to track.
                </p>
                <p className="admin-metric-value">{messageModelReady ? "Ready" : "Missing"}</p>
              </article>
              <article className="story-card">
                <h3>System Emails</h3>
                <p>
                  Send controlled platform mailouts from approved addresses and review delivery
                  outcomes in the mail log.
                </p>
                <p className="admin-metric-value">
                  {process.env.NEXT_PUBLIC_GAVIN_MAIL_API ||
                  "https://457iafd5sc.execute-api.us-east-1.amazonaws.com/main/mailout"
                    ? "Ready"
                    : "Missing"}
                </p>
              </article>
              <article className="story-card">
                <h3>Contact Forms</h3>
                <p>
                  Review incoming contact enquiries from the public form, action important
                  requests, and clear resolved submissions.
                </p>
                <p className="admin-metric-value">{contacts.length}</p>
              </article>
              <article className="story-card">
                <h3>Client Contacts</h3>
                <p>
                  Maintain Gavin&apos;s contact database, filter by source and project, and keep
                  client records accurate over time.
                </p>
                <p className="admin-metric-value">{clientContacts.length}</p>
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
                                setConfirmInput("");
                                setConfirmIntent({ kind: "deleteUser", user });
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
                          setConfirmInput("");
                          setConfirmIntent({ kind: "deleteUser", user });
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
              Private Messages
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
                          <div className="admin-thread-head">
                            <h3>{row.fromUserType === "admin" ? "Gavin" : "User"}</h3>
                            <button
                              type="button"
                              className="admin-icon-btn admin-delete-btn"
                              aria-label="Delete message"
                              title="Delete message"
                              onClick={() => {
                                setConfirmInput("");
                                setConfirmIntent({ kind: "deleteMessage", row });
                              }}
                            >
                              <TrashIcon />
                            </button>
                          </div>
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
                      placeholder="Write a reply as Gavin..."
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
                {mailStatus ? (
                  <p className={`form-feedback form-feedback-${mailStatusTone}`} role="status" aria-live="polite">
                    {mailStatus}
                  </p>
                ) : null}
              </div>

              <div className="admin-mail-log">
                <div className="admin-mail-log-head">
                  <h3>Mailout Log</h3>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => setMailLog([])}
                    disabled={mailLog.length === 0}
                  >
                    Clear Log
                  </button>
                </div>
                {mailLog.length === 0 ? (
                  <p className="form-note">No mailout activity recorded yet.</p>
                ) : (
                  <div className="story-stack">
                    {mailLog.slice(0, 12).map((entry) => (
                      <article className="story-card admin-mail-log-item" key={entry.id}>
                        <div className="admin-mail-log-row">
                          <strong>{entry.recipientEmail}</strong>
                          <span
                            className={`admin-mail-log-badge admin-mail-log-badge-${entry.status}`}
                          >
                            {entry.status === "success" ? "Sent" : "Failed"}
                          </span>
                        </div>
                        <p>
                          From: {entry.fromEmail || "Default sender"} | Subject: {entry.subject}
                        </p>
                        <p className="form-note">{new Date(entry.at).toLocaleString()}</p>
                        {entry.detail ? <p className="form-note">{entry.detail}</p> : null}
                      </article>
                    ))}
                  </div>
                )}
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
                          setConfirmInput("");
                          setConfirmIntent({ kind: "deleteContact", id: row.id });
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

        {activeTab === "clientContacts" ? (
          <div className="admin-tab-panel">
            <h2 className="section-title admin-panel-title" style={{ marginTop: 0 }}>
              Client Contacts ({filteredClientContacts.length})
            </h2>
            {!clientContactsModelReady ? (
              <p className="lede admin-empty-state" style={{ marginTop: "1rem" }}>
                ClientContact model is not deployed yet. Deploy Amplify updates and refresh.
              </p>
            ) : (
              <div className="admin-client-contacts-shell">
                <div className="admin-client-contact-toolbar">
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => {
                      if (showClientContactEditor && !clientContactEditingId) {
                        setShowClientContactEditor(false);
                        return;
                      }
                      setClientContactEditingId(null);
                      setClientContactDraft(createEmptyClientContactDraft());
                      setShowClientContactEditor(true);
                    }}
                  >
                    {showClientContactEditor && !clientContactEditingId ? "Close Add Contact" : "Add Contact"}
                  </button>
                </div>

                {showClientContactEditor ? (
                  <div className="admin-client-contact-editor contact-intake">
                    <h3>{clientContactEditingId ? "Edit Contact" : "Add Contact"}</h3>
                    <div className="admin-client-contact-form-grid">
                      <div>
                        <label className="form-label" htmlFor="client-contact-name">
                          Name
                        </label>
                        <input
                          id="client-contact-name"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.name}
                          onChange={(event) => handleClientContactFieldChange("name", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-email">
                          Email
                        </label>
                        <input
                          id="client-contact-email"
                          className="form-textarea admin-input"
                          type="email"
                          value={clientContactDraft.email}
                          onChange={(event) => handleClientContactFieldChange("email", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-phone">
                          Telephone
                        </label>
                        <input
                          id="client-contact-phone"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.telephone}
                          onChange={(event) => handleClientContactFieldChange("telephone", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-company">
                          Company
                        </label>
                        <input
                          id="client-contact-company"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.company}
                          onChange={(event) => handleClientContactFieldChange("company", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-project">
                          Project
                        </label>
                        <input
                          id="client-contact-project"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.project}
                          onChange={(event) => handleClientContactFieldChange("project", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-from">
                          Agent / Source
                        </label>
                        <input
                          id="client-contact-from"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.from}
                          onChange={(event) => handleClientContactFieldChange("from", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-gender">
                          Gender
                        </label>
                        <input
                          id="client-contact-gender"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.gender}
                          onChange={(event) => handleClientContactFieldChange("gender", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-dob">
                          DOB
                        </label>
                        <input
                          id="client-contact-dob"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.dob}
                          onChange={(event) => handleClientContactFieldChange("dob", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-age">
                          Age
                        </label>
                        <input
                          id="client-contact-age"
                          className="form-textarea admin-input"
                          type="number"
                          min={0}
                          value={clientContactDraft.age}
                          onChange={(event) => handleClientContactFieldChange("age", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-postcode">
                          Postcode
                        </label>
                        <input
                          id="client-contact-postcode"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.postcode}
                          onChange={(event) => handleClientContactFieldChange("postcode", event.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="client-contact-country">
                          Country
                        </label>
                        <input
                          id="client-contact-country"
                          className="form-textarea admin-input"
                          type="text"
                          value={clientContactDraft.country}
                          onChange={(event) => handleClientContactFieldChange("country", event.target.value)}
                        />
                      </div>
                      <div className="admin-form-grid-span">
                        <label className="form-label" htmlFor="client-contact-address">
                          Address
                        </label>
                        <textarea
                          id="client-contact-address"
                          className="form-textarea"
                          rows={3}
                          value={clientContactDraft.address}
                          onChange={(event) => handleClientContactFieldChange("address", event.target.value)}
                        />
                      </div>
                    </div>
                    <div className="contact-intake-actions">
                      <button
                        type="button"
                        className="button-primary"
                        onClick={() => {
                          void handleSaveClientContact();
                        }}
                        disabled={clientContactSaving}
                      >
                        {clientContactSaving
                          ? "Saving..."
                          : clientContactEditingId
                            ? "Update Contact"
                            : "Add Contact"}
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        onClick={resetClientContactEditor}
                        disabled={clientContactSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="admin-client-contact-filters">
                  <input
                    type="text"
                    className="form-textarea admin-input"
                    placeholder="Search name, email, company, project..."
                    value={clientContactQuery}
                    onChange={(event) => setClientContactQuery(event.target.value)}
                  />
                  <select
                    className="form-textarea admin-input"
                    value={clientContactCompanyFilter}
                    onChange={(event) => setClientContactCompanyFilter(event.target.value)}
                  >
                    <option value="all">All Companies</option>
                    {companyFilterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-textarea admin-input"
                    value={clientContactProjectFilter}
                    onChange={(event) => setClientContactProjectFilter(event.target.value)}
                  >
                    <option value="all">All Projects</option>
                    {projectFilterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-textarea admin-input"
                    value={clientContactFromFilter}
                    onChange={(event) => setClientContactFromFilter(event.target.value)}
                  >
                    <option value="all">All Agents</option>
                    {fromFilterOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-textarea admin-input"
                    value={clientContactSort}
                    onChange={(event) =>
                      setClientContactSort(event.target.value as "az" | "za" | "newest" | "oldest")
                    }
                  >
                    <option value="az">Sort: Name A-Z</option>
                    <option value="za">Sort: Name Z-A</option>
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                  </select>
                  <select
                    className="form-textarea admin-input"
                    value={String(clientContactsPageSize)}
                    onChange={(event) =>
                      setClientContactsPageSize(event.target.value === "10" ? 10 : event.target.value === "50" ? 50 : 25)
                    }
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table admin-client-contact-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Telephone</th>
                        <th>Company</th>
                        <th>Project</th>
                        <th>Country</th>
                        <th>Agent</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedClientContacts.map((row) => (
                        <tr key={row.id}>
                          <td>{row.name}</td>
                          <td>{row.email || "-"}</td>
                          <td>{row.telephone || "-"}</td>
                          <td>{row.company || "-"}</td>
                          <td>{row.project || "-"}</td>
                          <td>{row.country || "-"}</td>
                          <td>{row.from || "-"}</td>
                          <td>
                            <div className="admin-actions-row">
                              <button
                                type="button"
                                className="admin-icon-btn"
                                onClick={() => handleEditClientContact(row)}
                                title="Edit contact"
                                aria-label={`Edit ${row.name}`}
                              >
                                <EditIcon />
                              </button>
                              <button
                                type="button"
                                className="admin-icon-btn admin-delete-btn"
                                onClick={() => {
                                  setConfirmInput("");
                                  setConfirmIntent({
                                    kind: "deleteClientContact",
                                    id: row.id,
                                    label: row.name,
                                  });
                                }}
                                title="Delete contact"
                                aria-label={`Delete ${row.name}`}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-client-contact-cards">
                  {pagedClientContacts.map((row) => (
                    <article className="story-card admin-client-contact-card" key={`client-${row.id}`}>
                      <div className="admin-client-contact-card-head">
                        <h3>{row.name}</h3>
                        <span className="admin-user-status">{row.project || "No project"}</span>
                      </div>
                      <p>{row.email || "-"}</p>
                      <p>{row.telephone || "-"}</p>
                      <p>{row.country || "No country"}</p>
                      <p>
                        {row.company || "No company"} | {row.from || "No source"}
                      </p>
                      <div className="admin-user-card-actions">
                        <button
                          type="button"
                          className="admin-icon-btn"
                          onClick={() => handleEditClientContact(row)}
                          title="Edit contact"
                          aria-label={`Edit ${row.name}`}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn admin-delete-btn"
                          onClick={() => {
                            setConfirmInput("");
                            setConfirmIntent({
                              kind: "deleteClientContact",
                              id: row.id,
                              label: row.name,
                            });
                          }}
                          title="Delete contact"
                          aria-label={`Delete ${row.name}`}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="admin-pagination">
                  <p className="form-note">
                    Showing {filteredClientContacts.length === 0 ? 0 : (clientContactsPage - 1) * clientContactsPageSize + 1}
                    {" "}to{" "}
                    {Math.min(clientContactsPage * clientContactsPageSize, filteredClientContacts.length)} of{" "}
                    {filteredClientContacts.length}
                  </p>
                  <div className="admin-pagination-actions">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setClientContactsPage((prev) => Math.max(1, prev - 1))}
                      disabled={clientContactsPage <= 1}
                    >
                      Previous
                    </button>
                    <span className="admin-pagination-page">
                      Page {clientContactsPage} / {clientContactsTotalPages}
                    </span>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() =>
                        setClientContactsPage((prev) => Math.min(clientContactsTotalPages, prev + 1))
                      }
                      disabled={clientContactsPage >= clientContactsTotalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </section>
      <ConfirmModal
        open={Boolean(confirmIntent)}
        title={
          confirmIntent?.kind === "deleteUser"
            ? "Delete user?"
            : confirmIntent?.kind === "deleteContact"
              ? "Delete contact submission?"
              : confirmIntent?.kind === "deleteClientContact"
                ? "Delete client contact?"
              : "Delete private message?"
        }
        message={
          confirmIntent?.kind === "deleteUser"
            ? `This will permanently remove ${getUserEmail(confirmIntent.user)} from Cognito and revoke access.`
            : confirmIntent?.kind === "deleteContact"
              ? "This will permanently remove this contact submission from the dashboard."
              : confirmIntent?.kind === "deleteClientContact"
                ? `This will permanently remove ${confirmIntent.label} from the client contacts database.`
              : "This will permanently remove this message from the private thread."
        }
        dangerNote="This action cannot be undone."
        confirmLabel={
          confirmIntent?.kind === "deleteUser"
            ? "Yes, delete user"
            : confirmIntent?.kind === "deleteContact"
              ? "Yes, delete"
              : confirmIntent?.kind === "deleteClientContact"
                ? "Yes, delete contact"
              : "Yes, delete message"
        }
        requirePhrase={confirmIntent?.kind === "deleteUser" ? "DELETE" : undefined}
        requireLabel={
          confirmIntent?.kind === "deleteUser"
            ? "Type DELETE to confirm user deletion"
            : undefined
        }
        requireValue={confirmInput}
        onRequireValueChange={setConfirmInput}
        busy={confirmBusy}
        onCancel={() => {
          if (!confirmBusy) {
            setConfirmIntent(null);
            setConfirmInput("");
          }
        }}
        onConfirm={() => {
          void runConfirmIntent();
        }}
      />
    </div>
  );
}
