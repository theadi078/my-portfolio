"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { apiRequest } from "@/lib/client-api";
import type { Media } from "@/models/common";

type UploadResponse = { url: string; publicId: string; width?: number; height?: number };

const MAX_MB = 5;

/** Single image or file. Handles validation, progress and preview. */
export function MediaField({
  value,
  onChange,
  folder,
  accept = "image/*",
  label,
}: {
  value: Media | null;
  onChange: (next: Media | null) => void;
  folder: string;
  accept?: string;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    if (file.size > MAX_MB * 1024 * 1024 && file.type !== "application/pdf") {
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. Keep images under ${MAX_MB} MB.`);
      return;
    }
    setBusy(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const result = await apiRequest<UploadResponse>("/api/admin/upload", { method: "POST", formData });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange({ url: result.data.url, publicId: result.data.publicId, alt: "", width: result.data.width, height: result.data.height });
  }

  const isPdf = value?.url?.toLowerCase().endsWith(".pdf");

  return (
    <div>
      {value?.url ? (
        <div className="flex items-start gap-4 rounded-card border border-line bg-surface p-3">
          {isPdf ? (
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-line text-muted">
              <FileText size={20} />
            </div>
          ) : (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-raised">
              <Image src={value.url} alt={value.alt || label} fill sizes="80px" className="object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={value.alt ?? ""}
              onChange={(event) => onChange({ ...value, alt: event.target.value })}
              placeholder="Describe this image for screen readers"
              className="h-9 w-full rounded-btn border border-line bg-base px-3 text-[13px] text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-[13px] text-accent hover:underline"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 text-[13px] text-danger hover:underline"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line px-4 py-6 text-[14px] text-muted transition-colors hover:border-accent/50 hover:text-ink"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {busy ? "Uploading" : `Upload ${label.toLowerCase()}`}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />
      {error ? <p className="mt-2 text-[12px] text-danger">{error}</p> : null}
    </div>
  );
}

/** Multiple images, with per-file progress and removal. */
export function GalleryField({
  value,
  onChange,
  folder,
}: {
  value: Media[];
  onChange: (next: Media[]) => void;
  folder: string;
}) {
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadAll(files: FileList) {
    setError(null);
    setPending(files.length);
    const uploaded: Media[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const result = await apiRequest<UploadResponse>("/api/admin/upload", { method: "POST", formData });
      if (result.ok) {
        uploaded.push({ url: result.data.url, publicId: result.data.publicId, alt: "" });
      } else {
        setError(result.error);
      }
      setPending((n) => n - 1);
    }
    if (uploaded.length) onChange([...value, ...uploaded]);
    setPending(0);
  }

  return (
    <div>
      {value.length ? (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((image, index) => (
            <li key={image.url} className="group relative overflow-hidden rounded-card border border-line">
              <div className="relative aspect-[4/3] w-full bg-raised">
                <Image src={image.url} alt={image.alt || `Image ${index + 1}`} fill sizes="200px" className="object-cover" />
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove image"
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-btn border border-line bg-base/90 text-danger"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={pending > 0}
        className="flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line px-4 py-5 text-[14px] text-muted transition-colors hover:border-accent/50 hover:text-ink"
      >
        {pending > 0 ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {pending > 0 ? `Uploading ${pending} left` : "Add images"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files?.length) void uploadAll(event.target.files);
          event.target.value = "";
        }}
      />
      {error ? <p className="mt-2 text-[12px] text-danger">{error}</p> : null}
    </div>
  );
}
