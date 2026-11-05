import mongoose, { InferSchemaType, Schema } from "mongoose";
import { baseOptions, type WithId } from "./common";

export const LEARNING_STATUSES = ["Exploring", "Learning", "Practising", "Completed", "Paused"] as const;

const LearningSchema = new Schema(
  {
    topic: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    progress: { type: Number, min: 0, max: 100, default: null },
    startDate: { type: Date, default: null },
    status: { type: String, enum: LEARNING_STATUSES, default: "Learning" },
    resourceUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type LearningDoc = WithId<InferSchemaType<typeof LearningSchema>>;
export const Learning = mongoose.models.Learning || mongoose.model("Learning", LearningSchema);
