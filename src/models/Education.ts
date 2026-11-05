import mongoose, { InferSchemaType, Schema } from "mongoose";
import { MediaSchema, baseOptions, type WithId } from "./common";

export const EDUCATION_LEVELS = ["Degree", "HSC", "SSC", "Diploma", "Course", "Other"] as const;

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    level: { type: String, enum: EDUCATION_LEVELS, default: "Degree" },
    fieldOfStudy: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    score: { type: String, default: "" },
    scoreLabel: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    document: { type: MediaSchema, default: null },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type EducationDoc = WithId<InferSchemaType<typeof EducationSchema>>;
export const Education = mongoose.models.Education || mongoose.model("Education", EducationSchema);
