"use client";

export type AdminMailLogStatus = "success" | "error";

export interface AdminMailLogEntry {
  id: string;
  at: string;
  status: AdminMailLogStatus;
  recipientEmail: string;
  fromEmail: string;
  subject: string;
  detail?: string;
}

const STORAGE_KEY = "gavin_admin_mail_log_v1";
const MAX_LOG_ITEMS = 60;

const normalizeStatus = (value: unknown): AdminMailLogStatus =>
  value === "error" ? "error" : "success";

export function loadAdminMailLog(): AdminMailLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : String(Date.now()),
        at: typeof item.at === "string" ? item.at : new Date().toISOString(),
        status: normalizeStatus((item as { status?: unknown }).status),
        recipientEmail:
          typeof item.recipientEmail === "string" ? item.recipientEmail : "",
        fromEmail: typeof item.fromEmail === "string" ? item.fromEmail : "",
        subject: typeof item.subject === "string" ? item.subject : "",
        detail: typeof item.detail === "string" ? item.detail : undefined,
      }))
      .slice(0, MAX_LOG_ITEMS);
  } catch {
    return [];
  }
}

export function saveAdminMailLog(entries: AdminMailLogEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries.slice(0, MAX_LOG_ITEMS)),
  );
}
