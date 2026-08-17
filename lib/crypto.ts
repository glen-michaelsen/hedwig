import "server-only";

export function newId(): string {
  return crypto.randomUUID();
}

export function newPin(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return Array.from(bytes, (b) => String(b % 10)).join("");
}

/**
 * One-way digest of an IP address, so rate limiting can count repeat
 * submitters without keeping the addresses. Plain SHA-256 is enough: this
 * guards a public form, not a secret.
 */
export async function hashIp(ip: string): Promise<string> {
  const bits = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  return Array.from(new Uint8Array(bits), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

/* ---------------------------- PIN hashing ---------------------------- */

// A 4-digit PIN only has 10k candidates, so the iteration count is not what
// protects it — the per-phone lockout in lib/student-session.ts is. This is
// here so a leaked database doesn't hand over PINs in plaintext.
const PBKDF2_ITERATIONS = 100_000;

function toB64(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const b of view) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromB64(value: string): Uint8Array {
  const binary = atob(value);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function pbkdf2(pin: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      // `salt` needs to be a plain ArrayBuffer for the Workers implementation.
      salt: salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer,
      iterations,
      hash: "SHA-256",
    },
    key,
    256,
  );
}

export async function hashPin(pin: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await pbkdf2(pin, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toB64(salt)}$${toB64(bits)}`;
}

export async function verifyPin(pin: string, stored: string): Promise<boolean> {
  const [scheme, iterations, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) return false;
  const bits = await pbkdf2(pin, fromB64(salt), Number(iterations));
  return timingSafeEqual(toB64(bits), hash);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ------------------------- Signed cookie values ------------------------ */

function b64url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

/** `<base64url(json)>.<base64url(hmac)>` — self-contained, no session table. */
export async function signToken(
  secret: string,
  payload: Record<string, unknown>,
): Promise<string> {
  const body = b64url(JSON.stringify(payload));
  const sig = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(secret),
    new TextEncoder().encode(body),
  );
  return `${body}.${b64url(String.fromCharCode(...new Uint8Array(sig)))}`;
}

export async function verifyToken<T>(
  secret: string,
  token: string | undefined,
): Promise<T | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(secret),
    new TextEncoder().encode(body),
  );
  const expectedB64 = b64url(String.fromCharCode(...new Uint8Array(expected)));
  if (!timingSafeEqual(sig, expectedB64)) return null;
  try {
    return JSON.parse(unb64url(body)) as T;
  } catch {
    return null;
  }
}
