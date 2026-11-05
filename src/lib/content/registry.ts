import { z } from "zod";
import { Project, PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/models/Project";
import { Skill, SKILL_CATEGORIES } from "@/models/Skill";
import { Experience, EMPLOYMENT_TYPES } from "@/models/Experience";
import { Internship } from "@/models/Internship";
import { Education, EDUCATION_LEVELS } from "@/models/Education";
import { Certification } from "@/models/Certification";
import { Achievement, ACHIEVEMENT_CATEGORIES } from "@/models/Achievement";
import { Activity } from "@/models/Activity";
import { Learning, LEARNING_STATUSES } from "@/models/Learning";
import { TimelineEvent, TIMELINE_KINDS } from "@/models/TimelineEvent";
import { ContactMessage } from "@/models/ContactMessage";
import type { CollectionConfig } from "./types";

/* ------------------------------ shared pieces ----------------------------- */

const media = z
  .object({
    url: z.string().url("Needs to be a full URL."),
    publicId: z.string().optional(),
    alt: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .nullish();

const strings = z.array(z.string().trim().min(1)).default([]);
const date = z.coerce.date().nullish();
const url = z.string().trim().url("Needs to be a full URL, including https://").or(z.literal("")).optional();
const text = (max = 400) => z.string().trim().max(max).optional();

const publishFields = [
  { name: "published", label: "Visible on the public site", type: "boolean" as const, group: "Publishing" },
  { name: "order", label: "Sort weight", type: "number" as const, group: "Publishing", half: true, help: "Higher numbers appear first." },
];
const publishSchema = { published: z.boolean().optional(), order: z.coerce.number().optional() };

/* -------------------------------- projects -------------------------------- */

const projects: CollectionConfig = {
  key: "projects",
  label: "Projects",
  singular: "Project",
  description: "Everything you have built, with the full story behind each one.",
  model: () => Project,
  titleField: "title",
  group: "Content",
  supportsPublish: true,
  supportsFeatured: true,
  supportsDuplicate: true,
  emptyState: "No projects yet. Create your first project.",
  defaultSort: { featured: -1, order: -1, projectDate: -1, createdAt: -1 },
  listColumns: [
    { name: "title", label: "Project" },
    { name: "category", label: "Category", type: "badge" },
    { name: "status", label: "Status", type: "badge" },
    { name: "projectDate", label: "Date", type: "date" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    title: z.string().trim().min(2, "Give the project a title."),
    slug: z.string().trim().min(2, "A slug is required.").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
    shortDescription: z.string().trim().min(10, "Write at least a sentence."),
    fullDescription: z.string().optional(),
    category: z.enum(PROJECT_CATEGORIES).optional(),
    technologies: strings,
    features: strings,
    problem: z.string().optional(),
    solution: z.string().optional(),
    architecture: z.string().optional(),
    process: z.string().optional(),
    challenges: z.string().optional(),
    learnings: z.string().optional(),
    githubUrl: url,
    liveUrl: url,
    videoUrl: url,
    thumbnail: media,
    gallery: z.array(z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() })).default([]),
    projectDate: date,
    status: z.enum(PROJECT_STATUSES).optional(),
    featured: z.boolean().optional(),
    ...publishSchema,
  }),
  fields: [
    { name: "title", label: "Title", type: "text", required: true, group: "Basics" },
    { name: "slug", label: "URL slug", type: "slug", required: true, slugFrom: "title", group: "Basics", help: "The project lives at /projects/your-slug." },
    { name: "shortDescription", label: "One-line summary", type: "textarea", required: true, rows: 2, group: "Basics", help: "Shown on cards and in search results." },
    { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES, group: "Basics", half: true },
    { name: "status", label: "Status", type: "select", options: PROJECT_STATUSES, group: "Basics", half: true },
    { name: "projectDate", label: "Project date", type: "date", group: "Basics", half: true },
    { name: "technologies", label: "Technologies", type: "tags", group: "Basics", placeholder: "Next.js, MongoDB, Tailwind" },

    { name: "fullDescription", label: "Full description", type: "longtext", rows: 6, group: "Story" },
    { name: "problem", label: "Problem", type: "longtext", rows: 4, group: "Story" },
    { name: "solution", label: "Solution", type: "longtext", rows: 4, group: "Story" },
    { name: "architecture", label: "Architecture", type: "longtext", rows: 4, group: "Story" },
    { name: "features", label: "Features", type: "list", group: "Story", help: "One feature per line." },
    { name: "process", label: "How you built it", type: "longtext", rows: 5, group: "Story" },
    { name: "challenges", label: "Challenges", type: "longtext", rows: 4, group: "Story" },
    { name: "learnings", label: "What you learned", type: "longtext", rows: 4, group: "Story" },

    { name: "thumbnail", label: "Thumbnail", type: "image", group: "Media" },
    { name: "gallery", label: "Screenshots", type: "gallery", group: "Media" },

    { name: "githubUrl", label: "GitHub URL", type: "url", group: "Links", half: true },
    { name: "liveUrl", label: "Live demo URL", type: "url", group: "Links", half: true },
    { name: "videoUrl", label: "Video / demo URL", type: "url", group: "Links", half: true },

    { name: "featured", label: "Feature on the homepage", type: "boolean", group: "Publishing" },
    ...publishFields,
  ],
};

/* --------------------------------- skills --------------------------------- */

const skills: CollectionConfig = {
  key: "skills",
  label: "Skills",
  singular: "Skill",
  description: "Technologies you work with, grouped by category.",
  model: () => Skill,
  titleField: "name",
  group: "Content",
  supportsPublish: true,
  emptyState: "No skills yet. Add the first technology you work with.",
  defaultSort: { category: 1, order: -1, name: 1 },
  listColumns: [
    { name: "name", label: "Skill" },
    { name: "category", label: "Category", type: "badge" },
    { name: "proficiencyLabel", label: "Level" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    name: z.string().trim().min(1, "Name the skill."),
    category: z.enum(SKILL_CATEGORIES).optional(),
    icon: text(80),
    proficiency: z.coerce.number().min(0).max(100).nullish(),
    proficiencyLabel: text(40),
    description: z.string().optional(),
    relatedProjects: strings,
    ...publishSchema,
  }),
  fields: [
    { name: "name", label: "Name", type: "text", required: true, group: "Skill", half: true },
    { name: "category", label: "Category", type: "select", options: SKILL_CATEGORIES, group: "Skill", half: true },
    { name: "proficiencyLabel", label: "Level", type: "text", group: "Skill", half: true, placeholder: "Comfortable / Learning / Daily driver" },
    { name: "proficiency", label: "Level as a percentage", type: "number", group: "Skill", half: true, help: "Optional. Leave blank to show no bar." },
    { name: "icon", label: "Icon name or emoji", type: "text", group: "Skill", half: true },
    { name: "description", label: "Notes", type: "textarea", rows: 3, group: "Skill" },
    { name: "relatedProjects", label: "Related project slugs", type: "tags", group: "Skill", placeholder: "anii-hotel, task-tracker" },
    ...publishFields,
  ],
};

/* ------------------------------- experience ------------------------------- */

const experience: CollectionConfig = {
  key: "experience",
  label: "Experience",
  singular: "Role",
  description: "Jobs and professional roles, newest first.",
  model: () => Experience,
  titleField: "position",
  group: "Content",
  supportsPublish: true,
  emptyState: "No roles yet. Add your first position.",
  defaultSort: { current: -1, order: -1, startDate: -1 },
  listColumns: [
    { name: "position", label: "Position" },
    { name: "company", label: "Company" },
    { name: "employmentType", label: "Type", type: "badge" },
    { name: "startDate", label: "Started", type: "date" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    company: z.string().trim().min(1, "Name the company."),
    position: z.string().trim().min(1, "Name the position."),
    employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
    location: text(120),
    companyUrl: url,
    startDate: date,
    endDate: date,
    current: z.boolean().optional(),
    description: z.string().optional(),
    responsibilities: strings,
    achievements: strings,
    technologies: strings,
    ...publishSchema,
  }),
  fields: [
    { name: "position", label: "Position", type: "text", required: true, group: "Role", half: true },
    { name: "company", label: "Company", type: "text", required: true, group: "Role", half: true },
    { name: "employmentType", label: "Employment type", type: "select", options: EMPLOYMENT_TYPES, group: "Role", half: true },
    { name: "location", label: "Location", type: "text", group: "Role", half: true },
    { name: "companyUrl", label: "Company website", type: "url", group: "Role", half: true },
    { name: "startDate", label: "Start date", type: "date", group: "Dates", half: true },
    { name: "endDate", label: "End date", type: "date", group: "Dates", half: true },
    { name: "current", label: "I currently work here", type: "boolean", group: "Dates" },
    { name: "description", label: "Summary", type: "longtext", rows: 4, group: "Detail" },
    { name: "responsibilities", label: "Responsibilities", type: "list", group: "Detail", help: "One per line." },
    { name: "achievements", label: "Achievements", type: "list", group: "Detail", help: "One per line." },
    { name: "technologies", label: "Technologies", type: "tags", group: "Detail" },
    ...publishFields,
  ],
};

/* ------------------------------- internships ------------------------------ */

const internships: CollectionConfig = {
  key: "internships",
  label: "Internships",
  singular: "Internship",
  description: "Internships, kept separate from full professional roles.",
  model: () => Internship,
  titleField: "role",
  group: "Content",
  supportsPublish: true,
  emptyState: "No internships yet. Add your first one.",
  defaultSort: { order: -1, startDate: -1 },
  listColumns: [
    { name: "role", label: "Role" },
    { name: "company", label: "Company" },
    { name: "startDate", label: "Started", type: "date" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    company: z.string().trim().min(1, "Name the company."),
    role: z.string().trim().min(1, "Name the role."),
    duration: text(60),
    location: text(120),
    startDate: date,
    endDate: date,
    current: z.boolean().optional(),
    description: z.string().optional(),
    responsibilities: strings,
    technologies: strings,
    certificate: media,
    companyUrl: url,
    ...publishSchema,
  }),
  fields: [
    { name: "role", label: "Role", type: "text", required: true, group: "Internship", half: true },
    { name: "company", label: "Company", type: "text", required: true, group: "Internship", half: true },
    { name: "duration", label: "Duration", type: "text", group: "Internship", half: true, placeholder: "8 weeks" },
    { name: "location", label: "Location", type: "text", group: "Internship", half: true },
    { name: "companyUrl", label: "Company website", type: "url", group: "Internship", half: true },
    { name: "startDate", label: "Start date", type: "date", group: "Dates", half: true },
    { name: "endDate", label: "End date", type: "date", group: "Dates", half: true },
    { name: "current", label: "Ongoing", type: "boolean", group: "Dates" },
    { name: "description", label: "Summary", type: "longtext", rows: 4, group: "Detail" },
    { name: "responsibilities", label: "Responsibilities", type: "list", group: "Detail", help: "One per line." },
    { name: "technologies", label: "Technologies", type: "tags", group: "Detail" },
    { name: "certificate", label: "Certificate", type: "file", group: "Detail", help: "Image or PDF." },
    ...publishFields,
  ],
};

/* -------------------------------- education ------------------------------- */

const education: CollectionConfig = {
  key: "education",
  label: "Education",
  singular: "Education entry",
  description: "Degrees, school years, diplomas and courses.",
  model: () => Education,
  titleField: "degree",
  group: "Content",
  supportsPublish: true,
  emptyState: "No education entries yet. Add your degree or school.",
  defaultSort: { order: -1, endDate: -1, startDate: -1 },
  listColumns: [
    { name: "degree", label: "Qualification" },
    { name: "institution", label: "Institution" },
    { name: "level", label: "Level", type: "badge" },
    { name: "score", label: "Score" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    institution: z.string().trim().min(1, "Name the institution."),
    degree: z.string().trim().min(1, "Name the qualification."),
    level: z.enum(EDUCATION_LEVELS).optional(),
    fieldOfStudy: text(120),
    startDate: date,
    endDate: date,
    current: z.boolean().optional(),
    score: text(40),
    scoreLabel: text(40),
    description: z.string().optional(),
    location: text(120),
    document: media,
    ...publishSchema,
  }),
  fields: [
    { name: "degree", label: "Qualification", type: "text", required: true, group: "Study", half: true, placeholder: "BE Computer Engineering" },
    { name: "institution", label: "Institution", type: "text", required: true, group: "Study", half: true },
    { name: "level", label: "Level", type: "select", options: EDUCATION_LEVELS, group: "Study", half: true },
    { name: "fieldOfStudy", label: "Field of study", type: "text", group: "Study", half: true },
    { name: "location", label: "Location", type: "text", group: "Study", half: true },
    { name: "scoreLabel", label: "Score label", type: "text", group: "Result", half: true, placeholder: "CGPA" },
    { name: "score", label: "Score", type: "text", group: "Result", half: true, placeholder: "8.96" },
    { name: "startDate", label: "Start date", type: "date", group: "Dates", half: true },
    { name: "endDate", label: "End date", type: "date", group: "Dates", half: true },
    { name: "current", label: "Currently studying here", type: "boolean", group: "Dates" },
    { name: "description", label: "Notes", type: "longtext", rows: 4, group: "Detail" },
    { name: "document", label: "Certificate or marksheet", type: "file", group: "Detail" },
    ...publishFields,
  ],
};

/* ----------------------------- certifications ----------------------------- */

const certifications: CollectionConfig = {
  key: "certifications",
  label: "Certifications",
  singular: "Certification",
  description: "Credentials you have earned, with verification links.",
  model: () => Certification,
  titleField: "name",
  group: "Content",
  supportsPublish: true,
  emptyState: "No certifications yet. Add your first credential.",
  defaultSort: { order: -1, issueDate: -1 },
  listColumns: [
    { name: "name", label: "Certification" },
    { name: "issuer", label: "Issuer" },
    { name: "issueDate", label: "Issued", type: "date" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    name: z.string().trim().min(1, "Name the certification."),
    issuer: z.string().trim().min(1, "Name the issuing organisation."),
    issueDate: date,
    expirationDate: date,
    credentialId: text(120),
    credentialUrl: url,
    certificate: media,
    description: z.string().optional(),
    skills: strings,
    ...publishSchema,
  }),
  fields: [
    { name: "name", label: "Certification name", type: "text", required: true, group: "Credential" },
    { name: "issuer", label: "Issuing organisation", type: "text", required: true, group: "Credential", half: true },
    { name: "credentialId", label: "Credential ID", type: "text", group: "Credential", half: true },
    { name: "credentialUrl", label: "Verification URL", type: "url", group: "Credential" },
    { name: "issueDate", label: "Issued", type: "date", group: "Dates", half: true },
    { name: "expirationDate", label: "Expires", type: "date", group: "Dates", half: true, help: "Leave blank if it does not expire." },
    { name: "description", label: "What it covers", type: "textarea", rows: 3, group: "Detail" },
    { name: "skills", label: "Skills covered", type: "tags", group: "Detail" },
    { name: "certificate", label: "Certificate file", type: "file", group: "Detail", help: "Image or PDF." },
    ...publishFields,
  ],
};

/* ------------------------------ achievements ------------------------------ */

const achievements: CollectionConfig = {
  key: "achievements",
  label: "Achievements",
  singular: "Achievement",
  description: "Wins, recognitions and milestones.",
  model: () => Achievement,
  titleField: "title",
  group: "Content",
  supportsPublish: true,
  supportsFeatured: true,
  emptyState: "No achievements yet. Add your first one.",
  defaultSort: { featured: -1, order: -1, date: -1 },
  listColumns: [
    { name: "title", label: "Achievement" },
    { name: "category", label: "Category", type: "badge" },
    { name: "date", label: "Date", type: "date" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    title: z.string().trim().min(1, "Give it a title."),
    description: z.string().optional(),
    date: date,
    category: z.enum(ACHIEVEMENT_CATEGORIES).optional(),
    image: media,
    link: url,
    featured: z.boolean().optional(),
    ...publishSchema,
  }),
  fields: [
    { name: "title", label: "Title", type: "text", required: true, group: "Achievement" },
    { name: "category", label: "Category", type: "select", options: ACHIEVEMENT_CATEGORIES, group: "Achievement", half: true },
    { name: "date", label: "Date", type: "date", group: "Achievement", half: true },
    { name: "description", label: "Description", type: "longtext", rows: 4, group: "Achievement" },
    { name: "link", label: "Link", type: "url", group: "Achievement" },
    { name: "image", label: "Image", type: "image", group: "Achievement" },
    { name: "featured", label: "Feature on the homepage", type: "boolean", group: "Publishing" },
    ...publishFields,
  ],
};

/* ------------------------------- activities ------------------------------- */

const activities: CollectionConfig = {
  key: "activities",
  label: "Leadership & activities",
  singular: "Activity",
  description: "Leadership roles, clubs, events, seminars and volunteering.",
  model: () => Activity,
  titleField: "title",
  group: "Content",
  supportsPublish: true,
  emptyState: "No activities yet. Add a leadership role or event.",
  defaultSort: { order: -1, startDate: -1 },
  listColumns: [
    { name: "title", label: "Activity" },
    { name: "organization", label: "Organisation" },
    { name: "role", label: "Role" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    title: z.string().trim().min(1, "Give it a title."),
    organization: text(120),
    role: text(120),
    description: z.string().optional(),
    startDate: date,
    endDate: date,
    current: z.boolean().optional(),
    achievements: strings,
    images: z.array(z.object({ url: z.string(), publicId: z.string().optional(), alt: z.string().optional() })).default([]),
    link: url,
    ...publishSchema,
  }),
  fields: [
    { name: "title", label: "Title", type: "text", required: true, group: "Activity" },
    { name: "organization", label: "Organisation", type: "text", group: "Activity", half: true },
    { name: "role", label: "Your role", type: "text", group: "Activity", half: true },
    { name: "startDate", label: "Start date", type: "date", group: "Dates", half: true },
    { name: "endDate", label: "End date", type: "date", group: "Dates", half: true },
    { name: "current", label: "Ongoing", type: "boolean", group: "Dates" },
    { name: "description", label: "Description", type: "longtext", rows: 4, group: "Detail" },
    { name: "achievements", label: "Highlights", type: "list", group: "Detail", help: "One per line." },
    { name: "link", label: "Link", type: "url", group: "Detail" },
    { name: "images", label: "Photos", type: "gallery", group: "Detail" },
    ...publishFields,
  ],
};

/* -------------------------------- learning -------------------------------- */

const learning: CollectionConfig = {
  key: "learning",
  label: "Currently learning",
  singular: "Learning topic",
  description: "What you are working through right now.",
  model: () => Learning,
  titleField: "topic",
  group: "Content",
  supportsPublish: true,
  emptyState: "Nothing here yet. Add what you are learning.",
  defaultSort: { order: -1, startDate: -1 },
  listColumns: [
    { name: "topic", label: "Topic" },
    { name: "status", label: "Status", type: "badge" },
    { name: "progress", label: "Progress" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    topic: z.string().trim().min(1, "Name the topic."),
    description: z.string().optional(),
    progress: z.coerce.number().min(0).max(100).nullish(),
    startDate: date,
    status: z.enum(LEARNING_STATUSES).optional(),
    resourceUrl: url,
    ...publishSchema,
  }),
  fields: [
    { name: "topic", label: "Topic", type: "text", required: true, group: "Topic", half: true },
    { name: "status", label: "Status", type: "select", options: LEARNING_STATUSES, group: "Topic", half: true },
    { name: "progress", label: "Progress %", type: "number", group: "Topic", half: true, help: "Optional." },
    { name: "startDate", label: "Started", type: "date", group: "Topic", half: true },
    { name: "description", label: "What and why", type: "textarea", rows: 3, group: "Topic" },
    { name: "resourceUrl", label: "Resource link", type: "url", group: "Topic" },
    ...publishFields,
  ],
};

/* -------------------------------- timeline -------------------------------- */

const timeline: CollectionConfig = {
  key: "timeline",
  label: "My journey",
  singular: "Journey entry",
  description: "The timeline shown on the homepage.",
  model: () => TimelineEvent,
  titleField: "title",
  group: "Content",
  supportsPublish: true,
  emptyState: "No journey entries yet. Add the first step.",
  defaultSort: { order: -1, date: -1 },
  listColumns: [
    { name: "title", label: "Entry" },
    { name: "kind", label: "Kind", type: "badge" },
    { name: "date", label: "Date", type: "date" },
    { name: "published", label: "Live", type: "boolean" },
  ],
  schema: z.object({
    title: z.string().trim().min(1, "Give it a title."),
    subtitle: text(160),
    description: z.string().optional(),
    kind: z.enum(TIMELINE_KINDS).optional(),
    date: date,
    dateLabel: text(40),
    ...publishSchema,
  }),
  fields: [
    { name: "title", label: "Title", type: "text", required: true, group: "Entry" },
    { name: "subtitle", label: "Subtitle", type: "text", group: "Entry" },
    { name: "kind", label: "Kind", type: "select", options: TIMELINE_KINDS, group: "Entry", half: true },
    { name: "date", label: "Date", type: "date", group: "Entry", half: true },
    { name: "dateLabel", label: "Date label", type: "text", group: "Entry", half: true, help: "Overrides the date, e.g. \"2023 — 2027\"." },
    { name: "description", label: "Description", type: "longtext", rows: 4, group: "Entry" },
    ...publishFields,
  ],
};

/* -------------------------------- messages -------------------------------- */

const messages: CollectionConfig = {
  key: "messages",
  label: "Messages",
  singular: "Message",
  description: "Everything sent through the contact form.",
  model: () => ContactMessage,
  titleField: "name",
  group: "System",
  emptyState: "No messages yet.",
  defaultSort: { createdAt: -1 },
  listColumns: [
    { name: "name", label: "From" },
    { name: "email", label: "Email" },
    { name: "createdAt", label: "Received", type: "date" },
    { name: "read", label: "Read", type: "boolean" },
  ],
  schema: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    message: z.string().trim().min(1),
    read: z.boolean().optional(),
    archived: z.boolean().optional(),
  }),
  fields: [
    { name: "name", label: "From", type: "text", required: true, group: "Message", half: true },
    { name: "email", label: "Email", type: "text", required: true, group: "Message", half: true },
    { name: "message", label: "Message", type: "longtext", rows: 8, group: "Message" },
    { name: "read", label: "Mark as read", type: "boolean", group: "Message" },
    { name: "archived", label: "Archive", type: "boolean", group: "Message" },
  ],
};

/* -------------------------------- registry -------------------------------- */

export const collections = {
  projects, skills, experience, internships, education,
  certifications, achievements, activities, learning, timeline, messages,
} satisfies Record<string, CollectionConfig>;

export type CollectionKey = keyof typeof collections;

export function getCollection(key: string): CollectionConfig {
  const config = (collections as Record<string, CollectionConfig>)[key];
  if (!config) throw new Error(`Unknown collection: ${key}`);
  return config;
}

export function isCollectionKey(key: string): key is CollectionKey {
  return Object.prototype.hasOwnProperty.call(collections, key);
}

/** Serialisable slice of the config, safe to hand to client components. */
export function collectionClientConfig(key: string) {
  const c = getCollection(key);
  return {
    key: c.key,
    label: c.label,
    singular: c.singular,
    description: c.description,
    fields: c.fields,
    listColumns: c.listColumns,
    titleField: c.titleField,
    supportsPublish: Boolean(c.supportsPublish),
    supportsFeatured: Boolean(c.supportsFeatured),
    supportsDuplicate: Boolean(c.supportsDuplicate),
    emptyState: c.emptyState,
  };
}

export type CollectionClientConfig = ReturnType<typeof collectionClientConfig>;
