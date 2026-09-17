import "server-only";

import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

export const ADMIN_EMAIL = "admin@orgus.com.br";

const COOKIE_NAME = "orgus_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

export type AdminUser = {
  displayName: string;
  email: string;
};

function configuredPassword() {
  return env.ADMIN_PASSWORD?.trim() ?? "";
}

export function isAdminPasswordConfigured() {
  return configuredPassword().length >= 16;
}

export async function authenticateAdmin(email: string, password: string) {
  const expectedPassword = configuredPassword();
  if (!expectedPassword || email.trim().toLowerCase() !== ADMIN_EMAIL) return false;

  const [receivedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(password)),
    crypto.subtle.digest("SHA-256", encoder.encode(expectedPassword)),
  ]);

  return constantTimeEqual(
    new Uint8Array(receivedHash),
    new Uint8Array(expectedHash),
  );
}

export async function createAdminSessionToken() {
  const password = configuredPassword();
  if (!password) throw new Error("Senha administrativa não configurada.");

  const payload = encodeText(
    JSON.stringify({
      email: ADMIN_EMAIL,
      expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    }),
  );
  const signature = await sign(payload, password);
  return `${payload}.${signature}`;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const password = configuredPassword();
  if (!password) return null;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, receivedSignature] = parts;
  const expectedSignature = await sign(payload, password);
  if (!constantTimeEqualText(receivedSignature, expectedSignature)) return null;

  try {
    const parsed = JSON.parse(decodeText(payload)) as {
      email?: string;
      expiresAt?: number;
    };
    if (
      parsed.email !== ADMIN_EMAIL ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      return null;
    }
  } catch {
    return null;
  }

  return { displayName: "Administrador Orgus", email: ADMIN_EMAIL };
}

export function adminSessionCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

async function sign(value: string, password: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return encodeBytes(new Uint8Array(signature));
}

function encodeText(value: string) {
  return encodeBytes(encoder.encode(value));
}

function decodeText(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return new TextDecoder().decode(
    Uint8Array.from(binary, (character) => character.charCodeAt(0)),
  );
}

function encodeBytes(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function constantTimeEqual(received: Uint8Array, expected: Uint8Array) {
  let mismatch = received.length ^ expected.length;
  const size = Math.max(received.length, expected.length);
  for (let index = 0; index < size; index += 1) {
    mismatch |= (received[index] ?? 0) ^ (expected[index] ?? 0);
  }
  return mismatch === 0;
}

function constantTimeEqualText(received: string, expected: string) {
  return constantTimeEqual(encoder.encode(received), encoder.encode(expected));
}
