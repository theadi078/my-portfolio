import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { env, isCloudinaryConfigured } from "./env";

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"];

export type UploadResult = { url: string; publicId: string; width?: number; height?: number; bytes: number; format?: string };

export async function uploadToCloudinary(file: File, subfolder = "media"): Promise<UploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured. Add the three CLOUDINARY_ variables to .env.local.");
  }
  const isPdf = file.type === "application/pdf";
  const limit = isPdf ? MAX_FILE_BYTES : MAX_IMAGE_BYTES;
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}. Use JPG, PNG, WEBP, AVIF, GIF or PDF.`);
  }
  if (file.size > limit) {
    throw new Error(`File is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${limit / 1024 / 1024} MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const folder = `${env.cloudinary.folder}/${subfolder}`;

  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: isPdf ? "raw" : "image", overwrite: false },
      (error, uploaded) => {
        if (error || !uploaded) return reject(error ?? new Error("Upload failed."));
        resolve(uploaded as unknown as Record<string, unknown>);
      },
    );
    stream.end(buffer);
  });

  return {
    url: String(result.secure_url),
    publicId: String(result.public_id),
    width: result.width as number | undefined,
    height: result.height as number | undefined,
    bytes: Number(result.bytes ?? file.size),
    format: result.format as string | undefined,
  };
}

export async function deleteFromCloudinary(publicId: string, raw = false) {
  if (!isCloudinaryConfigured || !publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: raw ? "raw" : "image" });
}
