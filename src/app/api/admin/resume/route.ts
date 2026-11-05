import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { fail, handleApiError, ok } from "@/lib/api";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { isCloudinaryConfigured } from "@/lib/env";
import { Resume } from "@/models/Resume";
import { revalidatePublicSite } from "@/lib/revalidate";
import { serialize } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Upload a new resume file and store it as a version. */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    if (!isCloudinaryConfigured) return fail("Cloudinary is not configured yet.", 503);

    const form = await request.formData();
    const file = form.get("file");
    const label = String(form.get("label") ?? "").trim() || "Resume";
    const makeActive = String(form.get("active") ?? "true") === "true";
    if (!(file instanceof File)) return fail("Choose a PDF to upload.", 400);
    if (file.type !== "application/pdf") return fail("Upload the resume as a PDF.", 400);

    const uploaded = await uploadToCloudinary(file, "resume");
    await connectToDatabase();
    if (makeActive) await Resume.updateMany({}, { $set: { active: false } });

    const created = await Resume.create({
      label,
      url: uploaded.url,
      publicId: uploaded.publicId,
      sizeBytes: uploaded.bytes,
      version: new Date().toISOString().slice(0, 10),
      active: makeActive,
    });
    revalidatePublicSite();
    return ok(serialize(created.toObject()), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Set which uploaded version is the live one. */
export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = z.object({ id: z.string().min(1) }).parse(await request.json());
    await connectToDatabase();
    const target = await Resume.findById(id);
    if (!target) return fail("That resume no longer exists.", 404);
    await Resume.updateMany({}, { $set: { active: false } });
    target.active = true;
    await target.save();
    revalidatePublicSite();
    return ok(serialize(target.toObject()));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { id } = z.object({ id: z.string().min(1) }).parse(await request.json());
    await connectToDatabase();
    const doc = await Resume.findByIdAndDelete(id).lean();
    if (!doc) return fail("That resume no longer exists.", 404);
    const publicId = (doc as unknown as { publicId?: string }).publicId;
    if (publicId) await deleteFromCloudinary(publicId, true);
    revalidatePublicSite();
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
