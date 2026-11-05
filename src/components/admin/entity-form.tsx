"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Field } from "./field";
import { useToast } from "./toaster";
import { Button, buttonStyles } from "@/components/ui/button";
import { apiRequest } from "@/lib/client-api";
import type { FieldDef } from "@/lib/content/types";

type Props = {
  fields: FieldDef[];
  initial?: Record<string, unknown> | null;
  endpoint: string;
  method: "POST" | "PATCH" | "PUT";
  folder: string;
  cancelHref: string;
  redirectTo?: string;
  deleteEndpoint?: string;
  supportsPublish?: boolean;
  savedMessage?: string;
};

/** One form for every collection, driven entirely by the field definitions. */
export function EntityForm({
  fields,
  initial,
  endpoint,
  method,
  folder,
  cancelHref,
  redirectTo,
  deleteEndpoint,
  supportsPublish,
  savedMessage = "Saved.",
}: Props) {
  const router = useRouter();
  const { notify } = useToast();
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...(initial ?? {}) }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<null | "save" | "publish" | "delete">(null);

  const groups = useMemo(() => {
    const map = new Map<string, FieldDef[]>();
    for (const field of fields) {
      const key = field.group ?? "Details";
      map.set(key, [...(map.get(key) ?? []), field]);
    }
    return [...map.entries()];
  }, [fields]);

  function update(name: string, next: unknown) {
    setValues((current) => ({ ...current, [name]: next }));
    setErrors((current) => {
      if (!current[name]) return current;
      const { [name]: _removed, ...rest } = current;
      return rest;
    });
  }

  async function submit(overrides: Record<string, unknown> = {}, action: "save" | "publish" = "save") {
    setBusy(action);
    setErrors({});

    const payload: Record<string, unknown> = { ...values, ...overrides };
    // Empty strings clear optional fields; arrays drop blank rows.
    for (const [key, value] of Object.entries(payload)) {
      if (Array.isArray(value)) {
        payload[key] = value.filter((item) =>
          typeof item === "string" ? item.trim() !== "" : item !== null && item !== undefined,
        );
      }
    }

    const result = await apiRequest<{ _id?: string }>(endpoint, { method, body: payload });
    setBusy(null);

    if (!result.ok) {
      if (result.details?.length) {
        setErrors(Object.fromEntries(result.details.map((d) => [d.field, d.message])));
        notify("Some fields need attention.", "error");
      } else {
        notify(result.error, "error");
      }
      return;
    }

    setValues((current) => ({ ...current, ...overrides }));
    notify(overrides.published === true ? "Published." : savedMessage);
    router.refresh();
    if (redirectTo) router.push(redirectTo);
  }

  async function remove() {
    if (!deleteEndpoint) return;
    if (!window.confirm("Delete this permanently? This cannot be undone.")) return;
    setBusy("delete");
    const result = await apiRequest(deleteEndpoint, { method: "DELETE" });
    setBusy(null);
    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    notify("Deleted.");
    router.push(cancelHref);
    router.refresh();
  }

  const isPublished = Boolean(values.published);
  const creating = method === "POST";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="pb-24"
    >
      <div className="space-y-8">
        {groups.map(([group, groupFields]) => (
          <section key={group} className="rounded-card border border-line bg-surface p-5 md:p-6">
            <h2 className="mb-5 text-[13px] font-medium text-ink">{group}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {groupFields.map((field) => (
                <Field
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  values={values}
                  error={errors[field.name]}
                  folder={folder}
                  onChange={update}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-0 -mx-4 mt-8 flex flex-wrap items-center gap-3 border-t border-line bg-base/95 px-4 py-4 backdrop-blur lg:-mx-8 lg:px-8">
        <Button type="submit" disabled={busy !== null}>
          {busy === "save" ? <Loader2 size={15} className="animate-spin" /> : null}
          {creating && supportsPublish ? "Save draft" : "Save changes"}
        </Button>

        {supportsPublish ? (
          <Button
            type="button"
            variant="secondary"
            disabled={busy !== null}
            onClick={() => void submit({ published: !isPublished }, "publish")}
          >
            {busy === "publish" ? <Loader2 size={15} className="animate-spin" /> : null}
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
        ) : null}

        <Link href={cancelHref} className={buttonStyles("ghost")}>
          Cancel
        </Link>

        {deleteEndpoint ? (
          <Button type="button" variant="danger" className="ml-auto" disabled={busy !== null} onClick={() => void remove()}>
            {busy === "delete" ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
}
