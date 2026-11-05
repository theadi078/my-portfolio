import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { fail, handleApiError, ok } from "@/lib/api";
import { getCollection, isCollectionKey } from "@/lib/content/registry";
import { serialize } from "@/lib/utils";
import "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ collection: string; id: string }> };

/** Copies an entry as an unpublished draft so the original stays untouched. */
export async function POST(_request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { collection, id } = await params;
    if (!isCollectionKey(collection)) return fail("Unknown collection.", 404);

    const config = getCollection(collection);
    await connectToDatabase();
    const original = (await config.model().findById(id).lean()) as Record<string, unknown> | null;
    if (!original) return fail("That entry no longer exists.", 404);

    delete original._id;
    delete original.createdAt;
    delete original.updatedAt;
    original.published = false;
    original.featured = false;
    const titleField = config.titleField;
    original[titleField] = `${String(original[titleField] ?? "Untitled")} (copy)`;
    if (typeof original.slug === "string") original.slug = `${original.slug}-copy-${Date.now().toString(36)}`;

    const copy = await config.model().create(original);
    return ok(serialize(copy.toObject()), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
