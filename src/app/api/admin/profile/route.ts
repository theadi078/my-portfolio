import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { cleanPayload, handleApiError, ok } from "@/lib/api";
import { profileSchema } from "@/lib/content/profile-schema";
import { Profile } from "@/models/Profile";
import { revalidatePublicSite } from "@/lib/revalidate";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();
    const doc = await Profile.findOne({}).lean();
    return ok(doc ? serialize(doc) : null);
  } catch (error) {
    return handleApiError(error);
  }
}

/** Upsert: the profile is a singleton, so the first save creates it. */
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const payload = profileSchema.partial().parse(cleanPayload(await request.json()));
    await connectToDatabase();
    const updated = await Profile.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean();
    revalidatePublicSite();
    return ok(serialize(updated));
  } catch (error) {
    return handleApiError(error);
  }
}
