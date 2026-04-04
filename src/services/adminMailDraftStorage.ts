"use client";

export interface AdminMailDraft {
  recipientEmail: string;
  fromEmail: string;
  subject: string;
  message: string;
}

const STORAGE_KEY = "gavin_admin_mail_draft_v1";

export function loadAdminMailDraft(): Partial<AdminMailDraft> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<AdminMailDraft>;
    return {
      recipientEmail: typeof parsed.recipientEmail === "string" ? parsed.recipientEmail : "",
      fromEmail: typeof parsed.fromEmail === "string" ? parsed.fromEmail : "",
      subject: typeof parsed.subject === "string" ? parsed.subject : "",
      message: typeof parsed.message === "string" ? parsed.message : "",
    };
  } catch {
    return {};
  }
}

export function saveAdminMailDraft(draft: AdminMailDraft): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}
