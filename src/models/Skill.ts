import mongoose, { InferSchemaType, Schema } from "mongoose";
import { baseOptions, type WithId } from "./common";

export const SKILL_CATEGORIES = [
  "Frontend", "Backend", "Database", "Programming Languages",
  "Frameworks", "Cloud", "Tools", "Other",
] as const;

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: SKILL_CATEGORIES, default: "Other", index: true },
    icon: { type: String, default: "" },
    proficiency: { type: Number, min: 0, max: 100, default: null },
    proficiencyLabel: { type: String, default: "" },
    description: { type: String, default: "" },
    relatedProjects: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type SkillDoc = WithId<InferSchemaType<typeof SkillSchema>>;
export const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
