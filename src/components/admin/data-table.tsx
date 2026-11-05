"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Copy, Eye, EyeOff, Pencil, Search, Trash2 } from "lucide-react";
import { useToast } from "./toaster";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/client-api";
import { formatDate } from "@/lib/utils";
import type { CollectionClientConfig } from "@/lib/content/registry";

type Row = Record<string, unknown> & { _id: string };

export function DataTable({ config, rows }: { config: CollectionClientConfig; rows: Row[] }) {
  const router = useRouter();
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      config.listColumns.some((column) => String(row[column.name] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, query, config.listColumns]);

  async function togglePublished(row: Row) {
    setBusyId(row._id);
    const next = !row.published;
    const result = await apiRequest(`/api/admin/${config.key}/${row._id}`, { method: "PATCH", body: { published: next } });
    setBusyId(null);
    notify(result.ok ? (next ? "Published." : "Unpublished.") : result.error, result.ok ? "success" : "error");
    if (result.ok) router.refresh();
  }

  async function duplicate(row: Row) {
    setBusyId(row._id);
    const result = await apiRequest(`/api/admin/${config.key}/${row._id}/duplicate`, { method: "POST" });
    setBusyId(null);
    notify(result.ok ? "Copied as a draft." : result.error, result.ok ? "success" : "error");
    if (result.ok) router.refresh();
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete "${String(row[config.titleField])}" permanently?`)) return;
    setBusyId(row._id);
    const result = await apiRequest(`/api/admin/${config.key}/${row._id}`, { method: "DELETE" });
    setBusyId(null);
    notify(result.ok ? "Deleted." : result.error, result.ok ? "success" : "error");
    if (result.ok) router.refresh();
  }

  if (!rows.length) {
    return (
      <EmptyState
        title={config.emptyState}
        action={config.key === "messages" ? undefined : { label: `Add ${config.singular.toLowerCase()}`, href: `/admin/${config.key}/new` }}
      />
    );
  }

  return (
    <div>
      <label className="relative mb-4 block max-w-xs">
        <span className="sr-only">Search {config.label}</span>
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${config.label.toLowerCase()}`}
          className="h-10 w-full rounded-btn border border-line bg-surface pl-9 pr-3 text-[14px] text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
        />
      </label>

      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface">
              {config.listColumns.map((column) => (
                <th key={column.name} className="px-4 py-3 text-[12px] font-medium text-faint">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-[12px] font-medium text-faint">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((row) => (
              <tr key={row._id} className={busyId === row._id ? "opacity-60" : undefined}>
                {config.listColumns.map((column, index) => {
                  const raw = row[column.name];
                  return (
                    <td key={column.name} className="px-4 py-3 text-[14px] text-muted">
                      {index === 0 ? (
                        <Link href={`/admin/${config.key}/${row._id}/edit`} className="text-ink hover:text-accent">
                          {String(raw ?? "Untitled")}
                        </Link>
                      ) : column.type === "date" ? (
                        formatDate(raw as string) || "—"
                      ) : column.type === "boolean" ? (
                        raw ? (
                          <Badge tone="ok">Live</Badge>
                        ) : (
                          <Badge>Draft</Badge>
                        )
                      ) : column.type === "badge" ? (
                        raw ? (
                          <Badge>{String(raw)}</Badge>
                        ) : (
                          "—"
                        )
                      ) : (
                        String(raw ?? "—")
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {config.supportsPublish ? (
                      <button
                        type="button"
                        onClick={() => void togglePublished(row)}
                        disabled={busyId === row._id}
                        title={row.published ? "Unpublish" : "Publish"}
                        className="grid h-8 w-8 place-items-center rounded-btn text-muted hover:bg-raised hover:text-ink"
                      >
                        {row.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    ) : null}
                    {config.supportsDuplicate ? (
                      <button
                        type="button"
                        onClick={() => void duplicate(row)}
                        disabled={busyId === row._id}
                        title="Duplicate"
                        className="grid h-8 w-8 place-items-center rounded-btn text-muted hover:bg-raised hover:text-ink"
                      >
                        <Copy size={15} />
                      </button>
                    ) : null}
                    <Link
                      href={`/admin/${config.key}/${row._id}/edit`}
                      title="Edit"
                      className="grid h-8 w-8 place-items-center rounded-btn text-muted hover:bg-raised hover:text-ink"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => void remove(row)}
                      disabled={busyId === row._id}
                      title="Delete"
                      className="grid h-8 w-8 place-items-center rounded-btn text-muted hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!visible.length ? (
        <p className="mt-4 text-center text-[14px] text-muted">Nothing matches that search.</p>
      ) : null}
    </div>
  );
}
