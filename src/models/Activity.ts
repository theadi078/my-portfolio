import mongoose, { InferSchemaType, Schema } from "mongoose";
import { MediaSchema, baseOptions, type WithId } from "./common";

/** Leadership positions, clubs, events, seminars, volunteering. */
const ActivitySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, default: "" },
    role: { type: String, default: "" },
    description: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    achievements: { type: [String], default: [] },
    images: { type: [MediaSchema], default: [] },
    link: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  baseOptions,
);

export type ActivityDoc = WithId<InferSchemaType<typeof ActivitySchema>>;
export const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
