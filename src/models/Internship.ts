import mongoose, { InferSchemaType, Schema } from "mongoose";
import { MediaSchema, baseOptions, type WithId } from "./common";

const InternshipSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    duration: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    certificate: { type: MediaSchema, default: null },
    companyUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type InternshipDoc = WithId<InferSchemaType<typeof InternshipSchema>>;
export const Internship = mongoose.models.Internship || mongoose.model("Internship", InternshipSchema);
