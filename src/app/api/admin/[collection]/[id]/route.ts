import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { cleanPayload, fail, handleApiError, ok } from "@/lib/api";
import { getCollection, isCollectionKey } from "@/lib/content/registry";
import { revalidatePublicSite } from "@/lib/revalidate";
import { serialize } from "@/lib/utils";
import "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ collection: string; id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { collection, id } = await params;
    if (!isCollectionKey(collection)) return fail("Unknown collection.", 404);
    await connectToDatabase();
    const doc = await getCollection(collection).model().findById(id).lean();
    if (!doc) return fail("That entry no longer exists.", 404);
    return ok(serialize(doc));
  } catch (error) {
    return handleApiError(error);
  }
}

/** Partial update — used by the edit form and by inline publish toggles. */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { collection, id } = await params;
    if (!isCollectionKey(collection)) return fail("Unknown collection.", 404);

    const config = getCollection(collection);
    const partial = (config.schema as unknown as { partial: () => { parse: (v: unknown) => unknown } }).partial();
    const payload = partial.parse(cleanPayload(await request.json()));

    await connectToDatabase();
    const updated = await config
      .model()
      .findByIdAndUpdate(id, { $set: payload }, { new: true, runValidators: true })
      .lean();
    if (!updated) return fail("That entry no longer exists.", 404);

    revalidatePublicSite();
    return ok(serialize(updated));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { collection, id } = await params;
    if (!isCollectionKey(collection)) return fail("Unknown collection.", 404);

    await connectToDatabase();
    const deleted = await getCollection(collection).model().findByIdAndDelete(id).lean();
    if (!deleted) return fail("That entry no longer exists.", 404);

    revalidatePublicSite();
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
