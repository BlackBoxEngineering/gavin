import fs from "node:fs";
import path from "node:path";
import { Amplify } from "aws-amplify";
import { signIn, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import type { Schema } from "../amplify/data/resource";

type CsvRow = Record<string, string>;

const INPUT_PATH = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), "gavin", "gavinsOldClients_clientContacts_import_deduped.csv");
const BATCH_SIZE = Number.parseInt(process.env.CLIENT_IMPORT_BATCH_SIZE || "25", 10);
const RESET_EXISTING = process.env.CLIENT_IMPORT_RESET === "1";
const SKIP_EXISTING = process.env.CLIENT_IMPORT_SKIP_EXISTING !== "0";

const ADMIN_EMAIL = process.env.GAVIN_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.GAVIN_ADMIN_PASSWORD || "";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing admin login credentials. Set GAVIN_ADMIN_EMAIL and GAVIN_ADMIN_PASSWORD, then run again."
  );
  process.exit(1);
}

Amplify.configure(outputs);
const client = generateClient<Schema>({ authMode: "userPool" });

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const nxt = line[i + 1];
    if (ch === '"' && inQuotes && nxt === '"') {
      cur += '"';
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((v) => v.trim());
}

function readCsvRows(filePath: string): CsvRow[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    return row;
  });
}

function asInt(value: string): number | undefined {
  const v = value.trim();
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? undefined : n;
}

function normalizeEmailKey(value?: string): string {
  return String(value || "").trim().toLowerCase();
}

function normalizePhoneKey(value?: string): string {
  return String(value || "")
    .trim()
    .replace(/[\s\-().]/g, "")
    .toLowerCase();
}

async function run(): Promise<void> {
  console.log(`Import file: ${INPUT_PATH}`);
  const rows = readCsvRows(INPUT_PATH);
  console.log(`Rows to import: ${rows.length}`);
  if (rows.length === 0) return;

  await signIn({ username: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  console.log(`Signed in as ${ADMIN_EMAIL}`);

  if (RESET_EXISTING) {
    console.log("Reset mode enabled. Deleting existing ClientContact rows first...");
    let deleted = 0;
    let token: string | undefined;
    do {
      const listResponse = await client.models.ClientContact.list({
        authMode: "userPool",
        nextToken: token,
        limit: 500,
      });
      const existing = listResponse.data || [];
      token = listResponse.nextToken || undefined;
      for (const item of existing) {
        await client.models.ClientContact.delete({ id: item.id }, { authMode: "userPool" });
        deleted += 1;
      }
    } while (token);
    console.log(`Existing rows deleted: ${deleted}`);
  }

  let created = 0;
  let failed = 0;
  let skipped = 0;
  const existingEmailKeys = new Set<string>();
  const existingPhoneKeys = new Set<string>();

  if (!RESET_EXISTING && SKIP_EXISTING) {
    console.log("Duplicate protection enabled. Loading existing ClientContact keys...");
    let token: string | undefined;
    do {
      const listResponse = await client.models.ClientContact.list({
        authMode: "userPool",
        nextToken: token,
        limit: 500,
      });
      const existing = listResponse.data || [];
      token = listResponse.nextToken || undefined;
      for (const item of existing) {
        const emailKey = normalizeEmailKey(item.email || "");
        const phoneKey = normalizePhoneKey(item.telephone || "");
        if (emailKey) existingEmailKeys.add(emailKey);
        if (phoneKey) existingPhoneKeys.add(phoneKey);
      }
    } while (token);
    console.log(
      `Loaded existing keys: emails=${existingEmailKeys.size}, phones=${existingPhoneKeys.size}`
    );
  }

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const payload = {
      name: row.name?.trim() || "Unknown",
      gender: row.gender?.trim() || undefined,
      dob: row.dob?.trim() || undefined,
      age: asInt(row.age || ""),
      address: row.address?.trim() || undefined,
      postcode: row.postcode?.trim() || undefined,
      country: row.country?.trim() || undefined,
      telephone: row.telephone?.trim() || undefined,
      email: row.email?.trim() || undefined,
      company: row.company?.trim() || undefined,
      project: row.project?.trim() || undefined,
      from: row.from?.trim() || undefined,
    };
    const emailKey = normalizeEmailKey(payload.email || "");
    const phoneKey = normalizePhoneKey(payload.telephone || "");

    if (SKIP_EXISTING && ((emailKey && existingEmailKeys.has(emailKey)) || (phoneKey && existingPhoneKeys.has(phoneKey)))) {
      skipped += 1;
      continue;
    }

    try {
      await client.models.ClientContact.create(payload, { authMode: "userPool" });
      created += 1;
      if (emailKey) existingEmailKeys.add(emailKey);
      if (phoneKey) existingPhoneKeys.add(phoneKey);
    } catch (error) {
      failed += 1;
      const reason = error instanceof Error ? error.message : String(error);
      console.error(`Create failed at row ${i + 1} (${payload.name}): ${reason}`);
    }

    if ((i + 1) % BATCH_SIZE === 0 || i + 1 === rows.length) {
      console.log(
        `Progress: ${i + 1}/${rows.length} | created=${created} failed=${failed} skipped=${skipped}`
      );
    }
  }

  await signOut();
  console.log(`Done. Created=${created}, Failed=${failed}, Skipped=${skipped}`);
}

run().catch(async (error) => {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`Import failed: ${reason}`);
  try {
    await signOut();
  } catch {
    // no-op
  }
  process.exit(1);
});
