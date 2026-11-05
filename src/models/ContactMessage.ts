import mongoose, { InferSchemaType, Schema } from "mongoose";
import { baseOptions, type WithId } from "./common";

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  baseOptions,
);

export type ContactMessageDoc = WithId<InferSchemaType<typeof ContactMessageSchema>>;
export const ContactMessage = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
