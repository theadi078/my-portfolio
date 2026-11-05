import mongoose, { InferSchemaType, Schema } from "mongoose";
import { MediaSchema, baseOptions, type WithId } from "./common";

const CertificationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date, default: null },
    expirationDate: { type: Date, default: null },
    credentialId: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
    certificate: { type: MediaSchema, default: null },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type CertificationDoc = WithId<InferSchemaType<typeof CertificationSchema>>;
export const Certification = mongoose.models.Certification || mongoose.model("Certification", CertificationSchema);
