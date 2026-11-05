"use client";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; details?: { field: string; message: string }[] };

/** Thin wrapper so every admin form handles errors the same way. */
export async function apiRequest<T = unknown>(
  url: string,
  options: { method?: string; body?: unknown; formData?: FormData } = {},
): Promise<ApiResult<T>> {
  try {
    const init: RequestInit = { method: options.method ?? "GET" };
    if (options.formData) {
      init.body = options.formData;
    } else if (options.body !== undefined) {
      init.headers = { "Content-Type": "application/json" };
      init.body = JSON.stringify(options.body);
    }
    const res = await fetch(url, init);
    const payload = await res.json().catch(() => null);
    if (!res.ok || !payload?.ok) {
      return {
        ok: false,
        error: payload?.error ?? `Request failed with status ${res.status}.`,
        details: payload?.details,
      };
    }
    return { ok: true, data: payload.data as T };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection and try again." };
  }
}
