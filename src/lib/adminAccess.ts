import type { AuthSession } from "aws-amplify/auth";

export const REQUIRED_ADMIN_GROUPS = [
  "gavin-admingroup",
] as const;

function normalizeGroups(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
}

export function getSessionGroups(session: AuthSession): string[] {
  const idGroups = normalizeGroups(session.tokens?.idToken?.payload?.["cognito:groups"]);
  const accessGroups = normalizeGroups(session.tokens?.accessToken?.payload?.["cognito:groups"]);
  return Array.from(new Set([...idGroups, ...accessGroups]));
}

export function hasAdminAccess(groups: string[]): boolean {
  return groups.some((group) => REQUIRED_ADMIN_GROUPS.includes(group as (typeof REQUIRED_ADMIN_GROUPS)[number]));
}
