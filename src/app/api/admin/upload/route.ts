import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/api";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { isCloudinaryConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    if (!isCloudinaryConfigured) {
      return fail("Cloudinary is not configured yet. Add the three CLOUDINARY_ variables and restart.", 503);
    }
    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "media");
    if (!(file instanceof File)) return fail("Choose a file to upload.", 400);

    const uploaded = await uploadToCloudinary(file, folder.replace(/[^a-z0-9-_]/gi, "") || "media");
    return ok(uploaded, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Removes an asset from Cloudinary so unused uploads do not fill the free tier. */
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { publicId, raw } = await request.json();
    if (!publicId) return fail("No file selected.", 400);
    await deleteFromCloudinary(String(publicId), Boolean(raw));
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
