import { z } from "zod";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/api";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

// Small in-memory throttle. Enough to blunt brute force on a single instance.
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function throttled(key: string) {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return false;
  }
  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    if (throttled(ip)) return fail("Too many attempts. Wait a few minutes and try again.", 429);

    const { email, password } = bodySchema.parse(await request.json());
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash").lean();
    // Same message either way so the form never reveals which emails exist.
    const invalid = fail("That email and password combination did not work.", 401);
    if (!user) return invalid;

    const matches = await verifyPassword(password, String((user as { passwordHash: string }).passwordHash));
    if (!matches) return invalid;

    const record = user as unknown as { _id: string; email: string; name: string };
    const token = await createSessionToken({
      sub: String(record._id),
      email: record.email,
      name: record.name,
      role: "admin",
    });
    await setSessionCookie(token);
    await User.updateOne({ _id: record._id }, { $set: { lastLoginAt: new Date() } });
    attempts.delete(ip);

    return ok({ name: record.name, email: record.email });
  } catch (error) {
    return handleApiError(error);
  }
}
