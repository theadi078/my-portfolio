import mongoose, { InferSchemaType, Schema } from "mongoose";
import { baseOptions, type WithId } from "./common";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: Date,
  },
  baseOptions,
);

export type UserDoc = WithId<InferSchemaType<typeof UserSchema>>;
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
