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

  const responseData = await response.json();
  const parsedBody =
    typeof responseData?.body === "string" ? JSON.parse(responseData.body) : responseData;
  if (Array.isArray(parsedBody?.users)) return parsedBody.users as AdminUserData[];
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
}
