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

type Params = { params: Promise<{ collection: string }> };

/** List every document in a collection. */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { collection } = await params;
    if (!isCollectionKey(collection)) return fail("Unknown collection.", 404);

    const config = getCollection(collection);
    await connectToDatabase();
    const docs = await config.model().find({}).sort(config.defaultSort).lean();
    return ok(serialize(docs));
  } catch (error) {
    return handleApiError(error);
  }
}

/** Create a document. */
export async function POST(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { collection } = await params;
    if (!isCollectionKey(collection)) return fail("Unknown collection.", 404);

    const config = getCollection(collection);
    const payload = config.schema.parse(cleanPayload(await request.json()));

    await connectToDatabase();
    const created = await config.model().create(payload);
    revalidatePublicSite();
    return ok(serialize(created.toObject()), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
