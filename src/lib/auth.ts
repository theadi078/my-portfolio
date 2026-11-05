import "server-only";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

export const SESSION_COOKIE = "pf_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { sub: string; email: string; name: string; role: "admin" };

function secretKey() {
  if (!env.authSecret) throw new Error("AUTH_SECRET is not set. Add it to .env.local.");
  return new TextEncoder().encode(env.authSecret);
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}
export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .setSubject(payload.sub)
    .sign(secretKey());
}

export async function readSessionToken(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "admin") return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: "admin",
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Current admin session, or null. Safe to call from any server component. */
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return readSessionToken(token);
}

export class UnauthorizedError extends Error {
  constructor() {
    super("You need to sign in to do that.");
    this.name = "UnauthorizedError";
  }
}

/** Throws UnauthorizedError when there is no valid admin session. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
