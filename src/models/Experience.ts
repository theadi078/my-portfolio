import mongoose, { InferSchemaType, Schema } from "mongoose";
import { baseOptions, type WithId } from "./common";

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Apprenticeship"] as const;

const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    employmentType: { type: String, enum: EMPLOYMENT_TYPES, default: "Full-time" },
    location: { type: String, default: "" },
    companyUrl: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type ExperienceDoc = WithId<InferSchemaType<typeof ExperienceSchema>>;
export const Experience = mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
