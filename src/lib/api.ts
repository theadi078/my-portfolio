import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { DatabaseNotConfiguredError } from "./db";
import { UnauthorizedError } from "./auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, details }, { status });
}

/** Maps thrown errors onto clean, user-readable API responses. */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const details = error.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
    return fail("Some fields need attention.", 422, details);
  }
  if (error instanceof UnauthorizedError) return fail(error.message, 401);
  if (error instanceof DatabaseNotConfiguredError) return fail(error.message, 503);
  if (error && typeof error === "object" && "code" in error && (error as { code: number }).code === 11000) {
    return fail("That value is already used by another entry.", 409);
  }
  console.error("[api]", error);
  const message = error instanceof Error ? error.message : "Something went wrong.";
  return fail(message, 500);
}

/** Strips empty strings so optional fields clear correctly instead of failing validation. */
export function cleanPayload<T extends Record<string, unknown>>(input: T) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === "" || value === undefined) {
      out[key] = undefined;
      continue;
    }
    if (Array.isArray(value)) {
      out[key] = value.filter((v) => !(typeof v === "string" && v.trim() === ""));
      continue;
    }
    out[key] = value;
  }
  return out as T;
}
