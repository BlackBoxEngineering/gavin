"use client";

import { fetchAuthSession } from "aws-amplify/auth";

export interface AdminUserData {
  Username: string;
  Attributes?: Record<string, string>;
  UserStatus?: string;
  Enabled?: boolean;
}

const ENDPOINTS = {
  listClients: process.env.NEXT_PUBLIC_GAVIN_LIST_CLIENTS_API || "",
  deleteUser: process.env.NEXT_PUBLIC_GAVIN_DELETE_USER_API || "",
} as const;

interface ApiEnvelope {
  statusCode?: number;
  body?: unknown;
  users?: AdminUserData[];
  Users?: AdminUserData[];
  error?: string;
}

function parseJsonString(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function unwrapApiPayload(payload: unknown, depth = 0): unknown {
  if (depth > 4) return payload;
  if (!payload || typeof payload !== "object") return payload;

  const envelope = payload as ApiEnvelope;
  let next: unknown = payload;

  if (typeof envelope.body === "string") {
    next = parseJsonString(envelope.body);
  } else if (envelope.body !== undefined) {
    next = envelope.body;
  }

  if (next === payload) return payload;
  return unwrapApiPayload(next, depth + 1);
}

export function hasUserApiConfigured(): boolean {
  return Boolean(ENDPOINTS.listClients);
}

export function hasDeleteApiConfigured(): boolean {
  return Boolean(ENDPOINTS.deleteUser);
}

export async function getUserList(): Promise<AdminUserData[]> {
  if (!ENDPOINTS.listClients) {
    throw new Error("Missing NEXT_PUBLIC_GAVIN_LIST_CLIENTS_API");
  }

  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Not authenticated");

  const response = await fetch(ENDPOINTS.listClients, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`User list API failed (${response.status})`);
  }

  const responseData = (await response.json()) as ApiEnvelope;

  if (typeof responseData?.statusCode === "number" && responseData.statusCode >= 400) {
    const payload = unwrapApiPayload(responseData) as { error?: string } | undefined;
    throw new Error(payload?.error || `User list API failed (${responseData.statusCode})`);
  }

  const parsedBody = unwrapApiPayload(responseData) as ApiEnvelope | AdminUserData[] | undefined;

  if (Array.isArray((parsedBody as ApiEnvelope)?.users)) {
    return (parsedBody as ApiEnvelope).users as AdminUserData[];
  }
  if (Array.isArray((parsedBody as ApiEnvelope)?.Users)) {
    return (parsedBody as ApiEnvelope).Users as AdminUserData[];
  }
  if (Array.isArray(responseData?.users)) return responseData.users as AdminUserData[];
  if (Array.isArray(responseData?.Users)) return responseData.Users as AdminUserData[];
  if (Array.isArray(parsedBody)) return parsedBody as AdminUserData[];
  return [];
}

export async function deleteUser(username: string): Promise<void> {
  if (!ENDPOINTS.deleteUser) throw new Error("Missing NEXT_PUBLIC_GAVIN_DELETE_USER_API");

  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("Not authenticated");

  const response = await fetch(ENDPOINTS.deleteUser, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) throw new Error(`Delete user failed (${response.status})`);

  const responseData = (await response.json()) as ApiEnvelope;
  if (typeof responseData?.statusCode === "number" && responseData.statusCode >= 400) {
    const payload = unwrapApiPayload(responseData) as { error?: string } | undefined;
    throw new Error(payload?.error || `Delete user failed (${responseData.statusCode})`);
  }
}
