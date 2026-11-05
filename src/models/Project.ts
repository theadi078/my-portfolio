import mongoose, { InferSchemaType, Schema } from "mongoose";
import { MediaSchema, baseOptions, type WithId } from "./common";

export const PROJECT_CATEGORIES = ["Frontend", "Full Stack", "Backend", "Mobile", "Web3", "AI", "Other"] as const;
export const PROJECT_STATUSES = ["Completed", "In Progress", "Maintenance", "Archived"] as const;

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, default: "" },
    category: { type: String, enum: PROJECT_CATEGORIES, default: "Other", index: true },
    technologies: { type: [String], default: [], index: true },
    features: { type: [String], default: [] },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    architecture: { type: String, default: "" },
    process: { type: String, default: "" },
    challenges: { type: String, default: "" },
    learnings: { type: String, default: "" },
    githubUrl: { type: String, default: "", trim: true },
    liveUrl: { type: String, default: "", trim: true },
    videoUrl: { type: String, default: "", trim: true },
    thumbnail: { type: MediaSchema, default: null },
    gallery: { type: [MediaSchema], default: [] },
    projectDate: { type: Date, default: null },
    status: { type: String, enum: PROJECT_STATUSES, default: "Completed" },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  baseOptions,
);

export type ProjectDoc = WithId<InferSchemaType<typeof ProjectSchema>>;
export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
