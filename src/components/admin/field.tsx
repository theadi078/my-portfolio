"use client";

import { Plus, Trash2 } from "lucide-react";
import { GalleryField, MediaField } from "./media-uploader";
import { slugify } from "@/lib/utils";
import type { FieldDef } from "@/lib/content/types";
import type { Media } from "@/models/common";

const inputClass =
  "h-10 w-full rounded-btn border border-line bg-base px-3 text-[14px] text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none";
const areaClass =
  "w-full rounded-btn border border-line bg-base p-3 text-[14px] leading-relaxed text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none";

function toDateInput(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function Field({
  field,
  value,
  values,
  error,
  folder,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  values: Record<string, unknown>;
  error?: string;
  folder: string;
  onChange: (name: string, next: unknown) => void;
}) {
  const id = `field-${field.name}`;

  function render() {
    switch (field.type) {
      case "textarea":
      case "longtext":
        return (
          <textarea
            id={id}
            rows={field.rows ?? 4}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value)}
            className={areaClass}
          />
        );

      case "list":
        return (
          <textarea
            id={id}
            rows={field.rows ?? 4}
            value={Array.isArray(value) ? value.join("\n") : ""}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value.split("\n"))}
            className={areaClass}
          />
        );

      case "tags":
        return (
          <input
            id={id}
            type="text"
            value={Array.isArray(value) ? value.join(", ") : ""}
            placeholder={field.placeholder ?? "Comma separated"}
            onChange={(event) => onChange(field.name, event.target.value.split(",").map((v) => v.trim()))}
            className={inputClass}
          />
        );

      case "boolean":
        return (
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[14px] text-ink">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) => onChange(field.name, event.target.checked)}
              className="h-4 w-4 rounded border-line accent-[rgb(var(--c-accent))]"
            />
            {field.label}
          </label>
        );

      case "select":
        return (
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(event) => onChange(field.name, event.target.value)}
            className={inputClass}
          >
            <option value="">Not set</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            id={id}
            type="date"
            value={toDateInput(value)}
            onChange={(event) => onChange(field.name, event.target.value || null)}
            className={inputClass}
          />
        );

      case "number":
        return (
          <input
            id={id}
            type="number"
            value={value === null || value === undefined ? "" : String(value)}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value === "" ? null : Number(event.target.value))}
            className={inputClass}
          />
        );

      case "slug":
        return (
          <div className="flex gap-2">
            <input
              id={id}
              type="text"
              value={String(value ?? "")}
              placeholder={field.placeholder}
              onChange={(event) => onChange(field.name, slugify(event.target.value))}
              className={`${inputClass} font-mono text-[13px]`}
            />
            {field.slugFrom ? (
              <button
                type="button"
                onClick={() => onChange(field.name, slugify(String(values[field.slugFrom!] ?? "")))}
                className="h-10 shrink-0 rounded-btn border border-line px-3 text-[13px] text-muted hover:text-ink"
              >
                From title
              </button>
            ) : null}
          </div>
        );

      case "image":
        return (
          <MediaField
            label={field.label}
            folder={folder}
            value={(value as Media) ?? null}
            onChange={(next) => onChange(field.name, next)}
          />
        );

      case "file":
        return (
          <MediaField
            label={field.label}
            folder={folder}
            accept="image/*,application/pdf"
            value={(value as Media) ?? null}
            onChange={(next) => onChange(field.name, next)}
          />
        );

      case "gallery":
        return (
          <GalleryField
            folder={folder}
            value={Array.isArray(value) ? (value as Media[]) : []}
            onChange={(next) => onChange(field.name, next)}
          />
        );

      case "stats":
        return (
          <Repeater
            rows={(value as { label: string; value: string }[]) ?? []}
            keys={[
              { key: "label", placeholder: "CGPA" },
              { key: "value", placeholder: "8.96" },
            ]}
            onChange={(next) => onChange(field.name, next)}
            addLabel="Add statistic"
          />
        );

      case "socials":
        return (
          <Repeater
            rows={(value as { label: string; url: string }[]) ?? []}
            keys={[
              { key: "label", placeholder: "LeetCode" },
              { key: "url", placeholder: "https://" },
            ]}
            onChange={(next) => onChange(field.name, next)}
            addLabel="Add profile"
          />
        );

      default:
        return (
          <input
            id={id}
            type={field.type === "url" ? "url" : "text"}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.name, event.target.value)}
            className={inputClass}
          />
        );
    }
  }

  return (
    <div className={field.half ? "sm:col-span-1" : "sm:col-span-2"}>
      {field.type !== "boolean" ? (
        <label htmlFor={id} className="mb-1.5 block text-[13px] text-muted">
          {field.label}
          {field.required ? <span className="ml-1 text-danger">*</span> : null}
        </label>
      ) : null}
      {render()}
      {field.help ? <p className="mt-1.5 text-[12px] text-faint">{field.help}</p> : null}
      {error ? <p className="mt-1.5 text-[12px] text-danger">{error}</p> : null}
    </div>
  );
}

function Repeater({
  rows,
  keys,
  onChange,
  addLabel,
}: {
  rows: Record<string, string>[];
  keys: { key: string; placeholder: string }[];
  onChange: (next: Record<string, string>[]) => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {rows.map((row, index) => (
        <div key={index} className="flex gap-2">
          {keys.map(({ key, placeholder }) => (
            <input
              key={key}
              type="text"
              value={row[key] ?? ""}
              placeholder={placeholder}
              onChange={(event) => {
                const next = rows.map((r, i) => (i === index ? { ...r, [key]: event.target.value } : r));
                onChange(next);
              }}
              className={inputClass}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
            aria-label="Remove row"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-btn border border-line text-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, Object.fromEntries(keys.map((k) => [k.key, ""]))])}
        className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}
