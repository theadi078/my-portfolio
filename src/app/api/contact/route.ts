import { NextRequest } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { sendContactNotification } from "@/lib/mailer";
import { fail, handleApiError, ok } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2, "Tell me your name.").max(120),
  email: z.string().trim().email("Enter an email address I can reply to."),
  message: z.string().trim().min(10, "Add a little more detail.").max(5000),
  // Honeypot: real people never fill this in.
  website: z.string().max(0).optional(),
});

const sent = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const now = Date.now();
    const history = (sent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (history.length >= MAX_PER_WINDOW) {
      return fail("That is a lot of messages. Try again in an hour.", 429);
    }

    const body = schema.parse(await request.json());
    if (body.website) return ok({ received: true }); // silently drop bots

    await connectToDatabase();
    await ContactMessage.create({ name: body.name, email: body.email, message: body.message });
    sent.set(ip, [...history, now]);

    // Email is a bonus; the message is already safely stored.
    await sendContactNotification(body).catch(() => undefined);

    return ok({ received: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
