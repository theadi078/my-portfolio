import mongoose, { InferSchemaType, Schema } from "mongoose";
import { baseOptions, type WithId } from "./common";

export const TIMELINE_KINDS = ["Education", "Project", "Leadership", "Internship", "Learning", "Career", "Goal", "Other"] as const;

/** "My journey" entries on the homepage. Fully admin-managed. */
const TimelineEventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    kind: { type: String, enum: TIMELINE_KINDS, default: "Other" },
    date: { type: Date, default: null },
    dateLabel: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type TimelineEventDoc = WithId<InferSchemaType<typeof TimelineEventSchema>>;
export const TimelineEvent = mongoose.models.TimelineEvent || mongoose.model("TimelineEvent", TimelineEventSchema);
