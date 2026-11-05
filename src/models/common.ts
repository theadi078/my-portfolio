import { Schema } from "mongoose";

/** A single uploaded asset. publicId lets us delete it from Cloudinary later. */
export const MediaSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true, default: "" },
    alt: { type: String, trim: true, default: "" },
    width: Number,
    height: Number,
  },
  { _id: false },
);

export const baseOptions = { timestamps: true } as const;

/** Shared shape for every plain-JSON document handed to React. */
export type WithId<T> = T & { _id: string; createdAt: string; updatedAt: string };
export type Media = { url: string; publicId?: string; alt?: string; width?: number; height?: number };
