import mongoose, { InferSchemaType, Schema } from "mongoose";
import { MediaSchema, baseOptions, type WithId } from "./common";

/**
 * Singleton document: everything the public site says about the owner,
 * plus site-wide settings. Always read with Profile.findOne().
 */
const ProfileSchema = new Schema(
  {
    fullName: { type: String, default: "", trim: true },
    headline: { type: String, default: "", trim: true },
    shortIntro: { type: String, default: "" },
    biography: { type: String, default: "" },
    location: { type: String, default: "", trim: true },
    currentRole: { type: String, default: "", trim: true },
    availabilityStatus: { type: String, default: "", trim: true },
    availabilityOpen: { type: Boolean, default: true },
    careerInterests: { type: [String], default: [] },
    professionalGoals: { type: [String], default: [] },
    personalInterests: { type: [String], default: [] },
    photo: { type: MediaSchema, default: null },
    ogImage: { type: MediaSchema, default: null },
    stats: { type: [{ label: String, value: String, _id: false }], default: [] },
    email: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    socials: { type: [{ label: String, url: String, _id: false }], default: [] },
    githubUrl: { type: String, default: "", trim: true },
    linkedinUrl: { type: String, default: "", trim: true },
    siteTitle: { type: String, default: "" },
    siteDescription: { type: String, default: "" },
    siteKeywords: { type: [String], default: [] },
    twitterHandle: { type: String, default: "" },
    footerNote: { type: String, default: "" },
    contactHeading: { type: String, default: "" },
    contactBlurb: { type: String, default: "" },
  },
  baseOptions,
);

export type ProfileDoc = WithId<InferSchemaType<typeof ProfileSchema>>;
export const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
