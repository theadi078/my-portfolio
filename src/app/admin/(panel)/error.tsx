"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-card border border-danger/35 bg-danger/5 p-6">
      <h1 className="text-head text-ink">That did not load</h1>
      <p className="mt-2 max-w-reading text-[14px] text-muted">
        {error.message || "Something went wrong reading your content."} If this keeps happening, check that
        MONGODB_URI is correct and that your current IP is allowed in MongoDB Atlas.
      </p>
      <Button type="button" variant="secondary" className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
