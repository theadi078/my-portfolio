import mongoose, { InferSchemaType, Schema } from "mongoose";
import { MediaSchema, baseOptions, type WithId } from "./common";

export const ACHIEVEMENT_CATEGORIES = ["Technical", "Coding", "Leadership", "Academic", "Competition", "Community", "Other"] as const;

const AchievementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    date: { type: Date, default: null },
    category: { type: String, enum: ACHIEVEMENT_CATEGORIES, default: "Other", index: true },
    image: { type: MediaSchema, default: null },
    link: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type AchievementDoc = WithId<InferSchemaType<typeof AchievementSchema>>;
export const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);
