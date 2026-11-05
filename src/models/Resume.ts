import mongoose, { InferSchemaType, Schema } from "mongoose";
import { baseOptions, type WithId } from "./common";

const ResumeSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    version: { type: String, default: "" },
    sizeBytes: { type: Number, default: 0 },
    active: { type: Boolean, default: false, index: true },
  },
  baseOptions,
);

export type ResumeDoc = WithId<InferSchemaType<typeof ResumeSchema>>;
export const Resume = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
