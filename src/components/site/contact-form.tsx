"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/client-api";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setError(null);
    setFieldErrors({});

    const result = await apiRequest("/api/contact", {
      method: "POST",
      body: {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        website: String(data.get("website") ?? ""),
      },
    });

    if (result.ok) {
      setState("sent");
      form.reset();
      return;
    }
    setState("error");
    setError(result.error);
    if (result.details) {
      setFieldErrors(Object.fromEntries(result.details.map((d) => [d.field, d.message])));
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-card border border-ok/35 bg-ok/5 p-6">
        <p className="flex items-center gap-2 text-[15px] text-ink">
          <Check size={16} className="text-ok" />
          Message sent.
        </p>
        <p className="mt-2 text-[14px] text-muted">I will reply to the address you gave.</p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-4 text-[14px] text-accent hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Your name" name="name" error={fieldErrors.name}>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
        />
      </Field>

      <Field label="Email" name="email" error={fieldErrors.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
        />
      </Field>

      <Field label="Message" name="message" error={fieldErrors.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full rounded-btn border border-line bg-surface p-3 text-sm leading-relaxed text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
        />
      </Field>

      {/* Honeypot, hidden from people and screen readers alike. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {error ? (
        <p role="alert" className="rounded-btn border border-danger/35 bg-danger/5 px-3 py-2 text-[13px] text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={state === "sending"}>
        {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : null}
        {state === "sending" ? "Sending" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] text-muted">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-[12px] text-danger">{error}</p> : null}
    </div>
  );
}
