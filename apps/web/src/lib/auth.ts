/**
 * МышМат — auth: JWT HS256 на Web Crypto (работает и в Node, и в Edge middleware).
 * Без внешних зависимостей. Токен в httpOnly cookie.
 */
import type { SessionPayload, Role } from "@/types/users";

export const SESSION_COOKIE = "myshmat_session";
const WEEK_S = 60 * 60 * 24 * 7;

function b64url(data: Uint8Array): string {
  let s = "";
  for (const b of data) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
const enc = new TextEncoder();

async function hmacKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_JWT_SECRET || "dev-secret-change-me";
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export interface SessionToken extends SessionPayload {
  exp: number;
}

/** Подписать сессию → JWT. */
export async function signSession(payload: SessionPayload, maxAgeS = WEEK_S): Promise<string> {
  const header = b64url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body: SessionToken = { ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeS };
  const data = `${header}.${b64url(enc.encode(JSON.stringify(body)))}`;
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(data));
  return `${data}.${b64url(new Uint8Array(sig))}`;
}

/** Проверить JWT → сессия или null. */
export async function verifySession(token: string | undefined): Promise<SessionToken | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const data = `${parts[0]}.${parts[1]}`;
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      b64urlDecode(parts[2]) as unknown as ArrayBuffer,
      enc.encode(data),
    );
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(parts[1]))) as SessionToken;
    if (!payload.exp || payload.exp < Date.now() / 1000) return null;
    if (!payload.role || !payload.userId) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Домашняя страница роли. */
export function roleHome(role: Role): string {
  switch (role) {
    case "parent":
      return "/parent";
    case "methodist":
      return "/methodist";
    default:
      return "/";
  }
}
