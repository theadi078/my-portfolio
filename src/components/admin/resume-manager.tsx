"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, Loader2, Trash2, Upload } from "lucide-react";
import { useToast } from "./toaster";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { apiRequest } from "@/lib/client-api";
import { formatDate } from "@/lib/utils";
import type { ResumeDoc } from "@/models/Resume";

export function ResumeManager({ resumes }: { resumes: ResumeDoc[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (file.type !== "application/pdf") {
      notify("Upload the resume as a PDF.", "error");
      return;
    }
    setBusy(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label || `Resume ${new Date().toISOString().slice(0, 10)}`);
    formData.append("active", "true");
    const result = await apiRequest("/api/admin/resume", { method: "POST", formData });
    setBusy(false);
    notify(result.ok ? "Resume uploaded and set as active." : result.error, result.ok ? "success" : "error");
    if (result.ok) {
      setLabel("");
      router.refresh();
    }
  }

  async function activate(id: string) {
    setBusy(true);
    const result = await apiRequest("/api/admin/resume", { method: "PATCH", body: { id } });
    setBusy(false);
    notify(result.ok ? "That version is now live." : result.error, result.ok ? "success" : "error");
    if (result.ok) router.refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this resume version permanently?")) return;
    setBusy(true);
    const result = await apiRequest("/api/admin/resume", { method: "DELETE", body: { id } });
    setBusy(false);
    notify(result.ok ? "Deleted." : result.error, result.ok ? "success" : "error");
    if (result.ok) router.refresh();
  }

  return (
    <div className="space-y-8">
      <section className="rounded-card border border-line bg-surface p-5 md:p-6">
        <h2 className="text-[13px] font-medium text-ink">Upload a new version</h2>
        <p className="mt-1 text-[13px] text-muted">
          PDF only, up to 10 MB. The new file becomes the live one straight away.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Label, e.g. Resume — backend focus"
            className="h-10 w-full rounded-btn border border-line bg-base px-3 text-[14px] text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none sm:max-w-sm"
          />
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Choose PDF
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </section>

      {resumes.length ? (
        <ul className="divide-y divide-line rounded-card border border-line">
          {resumes.map((resume) => (
            <li key={resume._id} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[14px] text-ink">
                  {resume.label}
                  {resume.active ? (
                    <span className="inline-flex items-center gap-1 rounded-chip border border-ok/35 bg-ok/10 px-2 py-0.5 text-[12px] text-ok">
                      <Check size={11} /> Live
                    </span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[12px] text-faint">
                  Uploaded {formatDate(resume.createdAt)} · {(resume.sizeBytes / 1024).toFixed(0)} KB
                </p>
              </div>
              <a
                href={resume.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink"
              >
                View <ExternalLink size={12} />
              </a>
              {!resume.active ? (
                <button
                  type="button"
                  onClick={() => void activate(resume._id)}
                  disabled={busy}
                  className="text-[13px] text-accent hover:underline"
                >
                  Set as live
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void remove(resume._id)}
                disabled={busy}
                aria-label="Delete version"
                className="grid h-8 w-8 place-items-center rounded-btn text-muted hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No resume uploaded yet" description="Upload a PDF above and it appears on the public resume page." />
      )}
    </div>
  );
}
