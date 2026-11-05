import { z } from "zod";
import type { FieldDef } from "./types";

const media = z
  .object({ url: z.string().url(), publicId: z.string().optional(), alt: z.string().optional(), width: z.number().optional(), height: z.number().optional() })
  .nullish();
const list = z.array(z.string().trim().min(1)).default([]);
const optionalUrl = z.string().trim().url("Needs a full URL, including https://").or(z.literal("")).optional();

export const profileSchema = z.object({
  fullName: z.string().trim().optional(),
  headline: z.string().trim().optional(),
  shortIntro: z.string().optional(),
  biography: z.string().optional(),
  location: z.string().trim().optional(),
  currentRole: z.string().trim().optional(),
  availabilityStatus: z.string().trim().optional(),
  availabilityOpen: z.boolean().optional(),
  careerInterests: list,
  professionalGoals: list,
  personalInterests: list,
  photo: media,
  ogImage: media,
  stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  email: z.string().trim().email("Enter a valid email.").or(z.literal("")).optional(),
  phone: z.string().trim().optional(),
  socials: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  siteTitle: z.string().optional(),
  siteDescription: z.string().optional(),
  siteKeywords: list,
  twitterHandle: z.string().optional(),
  footerNote: z.string().optional(),
  contactHeading: z.string().optional(),
  contactBlurb: z.string().optional(),
});

/** Fields rendered on /admin/profile. */
export const profileFields: FieldDef[] = [
  { name: "fullName", label: "Full name", type: "text", group: "Identity", half: true },
  { name: "headline", label: "Professional headline", type: "text", group: "Identity", half: true, placeholder: "Software Engineer | Full Stack Developer" },
  { name: "currentRole", label: "Current role", type: "text", group: "Identity", half: true },
  { name: "location", label: "Location", type: "text", group: "Identity", half: true },
  { name: "availabilityStatus", label: "Status line", type: "text", group: "Identity", half: true, placeholder: "Building • Learning • Growing" },
  { name: "availabilityOpen", label: "Show the status dot as active", type: "boolean", group: "Identity" },
  { name: "photo", label: "Profile photo", type: "image", group: "Identity" },
  { name: "shortIntro", label: "Short introduction", type: "textarea", rows: 3, group: "About", help: "Two or three lines, shown in the hero." },
  { name: "biography", label: "Detailed biography", type: "longtext", rows: 8, group: "About", help: "Blank lines start a new paragraph." },
  { name: "careerInterests", label: "Career interests", type: "list", group: "About", help: "One per line." },
  { name: "professionalGoals", label: "Professional goals", type: "list", group: "About", help: "One per line." },
  { name: "personalInterests", label: "Personal interests", type: "list", group: "About", help: "One per line." },
  { name: "stats", label: "Highlight statistics", type: "stats", group: "About", help: "Shown in the hero and on the about page, e.g. CGPA / 8.96." },
  { name: "email", label: "Public email", type: "text", group: "Contact", half: true },
  { name: "phone", label: "Phone", type: "text", group: "Contact", half: true },
  { name: "githubUrl", label: "GitHub URL", type: "url", group: "Contact", half: true },
  { name: "linkedinUrl", label: "LinkedIn URL", type: "url", group: "Contact", half: true },
  { name: "socials", label: "Other profiles", type: "socials", group: "Contact", help: "Any other profile you want linked in the footer." },
];

/** Fields rendered on /admin/settings. */
export const settingsFields: FieldDef[] = [
  { name: "siteTitle", label: "Site title", type: "text", group: "Search & sharing", half: true },
  { name: "twitterHandle", label: "X / Twitter handle", type: "text", group: "Search & sharing", half: true, placeholder: "@handle" },
  { name: "siteDescription", label: "Meta description", type: "textarea", rows: 2, group: "Search & sharing", help: "Around 150 characters." },
  { name: "siteKeywords", label: "Keywords", type: "tags", group: "Search & sharing" },
  { name: "ogImage", label: "Social share image", type: "image", group: "Search & sharing", help: "1200x630 works best." },
  { name: "contactHeading", label: "Contact page heading", type: "text", group: "Page content" },
  { name: "contactBlurb", label: "Contact page intro", type: "textarea", rows: 3, group: "Page content" },
  { name: "footerNote", label: "Footer note", type: "text", group: "Page content" },
];
