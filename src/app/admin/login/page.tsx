import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-[13px] text-muted hover:text-ink">
          ← Back to the site
        </Link>

        <h1 className="mt-6 text-title">Sign in</h1>
        <p className="mt-2 text-[14px] text-muted">Manage your portfolio content.</p>

        {!isDatabaseConfigured ? (
          <p className="mt-6 rounded-btn border border-signal/35 bg-signal/5 px-3 py-2.5 text-[13px] text-signal">
            MONGODB_URI is not set yet, so sign-in will fail. Add it to .env.local and restart the server.
          </p>
        ) : null}

        <div className="mt-8 rounded-card border border-line bg-surface p-6">
          <Suspense fallback={<div className="h-64 skeleton" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-5 text-[12px] leading-relaxed text-faint">
          No account yet? Run <code className="font-mono text-muted">npm run create-admin</code> once, with
          ADMIN_EMAIL and ADMIN_PASSWORD set in your environment.
        </p>
      </div>
    </div>
  );
}
