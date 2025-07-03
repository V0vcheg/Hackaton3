// lib/api/passwordEntries.ts
import { encryptEntry } from "../crypto";

const BASE = "/api/password-entries";

export async function listPasswordEntries(userId: string) {
  const res = await fetch(`${BASE}?userId=${userId}`);
  if (!res.ok) throw new Error("fetch error");
  return (await res.json()) as PasswordEntry[];
}

export async function createPasswordEntry(
  data: { site: string; login: string; pwd: string },
  key: CryptoJS.lib.WordArray,
  userId: string
) {
  const encrypted = encryptEntry(data, key);
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...encrypted, userId }),
  });
  if (!res.ok) throw new Error("create error");
  return (await res.json()) as PasswordEntry;
}

export async function updatePasswordEntry(
  id: string,
  data: { site: string; login: string; pwd: string },
  key: CryptoJS.lib.WordArray
) {
  const encrypted = encryptEntry(data, key);
  const userId = "1";
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...encrypted, userId }),
  });
  if (!res.ok) throw new Error("update error");
  return (await res.json()) as PasswordEntry;
}

export async function deletePasswordEntry(id: string) {
  const userId = "1"; // ⚠️ temporaire – sera extrait du JWT plus tard
  await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}

export type PasswordEntry = {
  id: string;
  iniVector: string;
  cipherData: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
