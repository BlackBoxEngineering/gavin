"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import { REQUIRED_ADMIN_GROUPS, hasAdminAccess } from "@/lib/adminAccess";

export interface AdminMailPayload {
  recipientEmail: string;
  fromEmail?: string;
  subject?: string;
  message: string;
}

const MAIL_API_ENDPOINT =
  process.env.NEXT_PUBLIC_GAVIN_MAIL_API ||
  "https://457iafd5sc.execute-api.us-east-1.amazonaws.com/main/mailout";

const getTokenGroups = (payload?: Record<string, unknown>): string[] => {
  const groups = payload?.["cognito:groups"];
  return Array.isArray(groups) ? groups.map((value) => String(value)) : [];
};

const parseJsonSafe = (value: string): unknown => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return value;
  }
};

export async function sendAdminMail(payload: AdminMailPayload) {
  if (!MAIL_API_ENDPOINT) throw new Error("Missing mail API endpoint");

  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  const idTokenGroups = getTokenGroups(
    session.tokens?.idToken?.payload as Record<string, unknown> | undefined
  );

  if (!idToken) throw new Error("Missing Cognito ID token");
  if (!hasAdminAccess(idTokenGroups)) {
    throw new Error(
      `Current session is missing required admin group: ${REQUIRED_ADMIN_GROUPS.join(", ")}`
    );
  }

  const response = await fetch(MAIL_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  const parsed = parseJsonSafe(raw);
  const data =
    typeof parsed === "object" &&
    parsed !== null &&
    "body" in parsed &&
    typeof (parsed as { body?: unknown }).body === "string"
      ? parseJsonSafe((parsed as { body: string }).body)
      : parsed;

  const effectiveStatus =
    typeof parsed === "object" &&
    parsed !== null &&
    "statusCode" in parsed &&
    typeof (parsed as { statusCode?: unknown }).statusCode === "number"
      ? (parsed as { statusCode: number }).statusCode
      : response.status;

  if (effectiveStatus >= 200 && effectiveStatus < 300) return data;

  const message =
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as { error?: unknown }).error === "string"
      ? (data as { error: string }).error
      : `Mail API failed (${effectiveStatus})`;

  throw new Error(message);
}
