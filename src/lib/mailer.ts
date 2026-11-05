import "server-only";
import { env } from "./env";

/**
 * Optional contact notifications. Messages are always saved to MongoDB first;
 * this only sends a copy when RESEND_API_KEY + CONTACT_NOTIFY_TO are present.
 * Swap the fetch below for any provider without touching the API route.
 */
export async function sendContactNotification(input: { name: string; email: string; message: string }) {
  const { resendKey, to, from } = env.mail;
  if (!resendKey || !to) return { sent: false, reason: "not-configured" as const };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: from ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: input.email,
      subject: `New message from ${input.name}`,
      text: `${input.name} <${input.email}>\n\n${input.message}`,
    }),
  });

  if (!res.ok) return { sent: false, reason: "provider-error" as const };
  return { sent: true as const };
}
