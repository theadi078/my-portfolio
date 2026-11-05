"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/client-api";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);

    const result = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email: String(data.get("email") ?? ""), password: String(data.get("password") ?? "") },
    });

    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }

    const next = params.get("next");
    router.push(next && next.startsWith("/admin") ? next : "/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="h-11 w-full rounded-btn border border-line bg-base px-3 text-[14px] text-ink focus:border-accent/60 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-[13px] text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 w-full rounded-btn border border-line bg-base px-3 text-[14px] text-ink focus:border-accent/60 focus:outline-none"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-btn border border-danger/35 bg-danger/5 px-3 py-2 text-[13px] text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 size={16} className="animate-spin" /> : null}
        {busy ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
