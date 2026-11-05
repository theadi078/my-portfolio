import "server-only";
import { connectToDatabase } from "./db";
import { serialize } from "./utils";
import "@/models";
import { Profile, type ProfileDoc } from "@/models/Profile";
import { Project, type ProjectDoc } from "@/models/Project";
import { Skill, type SkillDoc } from "@/models/Skill";
import { Experience, type ExperienceDoc } from "@/models/Experience";
import { Internship, type InternshipDoc } from "@/models/Internship";
import { Education, type EducationDoc } from "@/models/Education";
import { Certification, type CertificationDoc } from "@/models/Certification";
import { Achievement, type AchievementDoc } from "@/models/Achievement";
import { Activity, type ActivityDoc } from "@/models/Activity";
import { Learning, type LearningDoc } from "@/models/Learning";
import { TimelineEvent, type TimelineEventDoc } from "@/models/TimelineEvent";
import { Resume, type ResumeDoc } from "@/models/Resume";

/**
 * Public reads never throw. If the database is unreachable or not configured
 * yet, every section falls back to its empty state instead of a crashed page.
 */
async function safe<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectToDatabase();
    return await run();
  } catch (error) {
    console.error("[data]", error instanceof Error ? error.message : error);
    return fallback;
  }
}

const PUBLISHED = { published: true };

export const getProfile = () =>
  safe<ProfileDoc | null>(async () => {
    const doc = await Profile.findOne({}).lean();
    return doc ? serialize(doc as unknown as ProfileDoc) : null;
  }, null);

export const getProjects = (options: { featured?: boolean; limit?: number } = {}) =>
  safe<ProjectDoc[]>(async () => {
    const query: Record<string, unknown> = { ...PUBLISHED };
    if (options.featured) query.featured = true;
    let q = Project.find(query).sort({ featured: -1, order: -1, projectDate: -1, createdAt: -1 });
    if (options.limit) q = q.limit(options.limit);
    return serialize((await q.lean()) as unknown as ProjectDoc[]);
  }, []);

export const getProjectBySlug = (slug: string) =>
  safe<ProjectDoc | null>(async () => {
    const doc = await Project.findOne({ slug, ...PUBLISHED }).lean();
    return doc ? serialize(doc as unknown as ProjectDoc) : null;
  }, null);

/** Previous / next links at the bottom of a project page. */
export async function getProjectNeighbours(slug: string) {
  const all = await getProjects();
  const index = all.findIndex((p) => p.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

export const getProjectSlugs = () =>
  safe<{ slug: string; updatedAt: string }[]>(async () => {
    const docs = await Project.find(PUBLISHED, { slug: 1, updatedAt: 1 }).lean();
    return serialize(docs as unknown as { slug: string; updatedAt: string }[]);
  }, []);

export const getSkills = () =>
  safe<SkillDoc[]>(async () => {
    const docs = await Skill.find(PUBLISHED).sort({ category: 1, order: -1, name: 1 }).lean();
    return serialize(docs as unknown as SkillDoc[]);
  }, []);

export const getExperience = () =>
  safe<ExperienceDoc[]>(async () => {
    const docs = await Experience.find(PUBLISHED).sort({ current: -1, order: -1, startDate: -1 }).lean();
    return serialize(docs as unknown as ExperienceDoc[]);
  }, []);

export const getInternships = () =>
  safe<InternshipDoc[]>(async () => {
    const docs = await Internship.find(PUBLISHED).sort({ order: -1, startDate: -1 }).lean();
    return serialize(docs as unknown as InternshipDoc[]);
  }, []);

export const getEducation = () =>
  safe<EducationDoc[]>(async () => {
    const docs = await Education.find(PUBLISHED).sort({ order: -1, endDate: -1, startDate: -1 }).lean();
    return serialize(docs as unknown as EducationDoc[]);
  }, []);

export const getCertifications = () =>
  safe<CertificationDoc[]>(async () => {
    const docs = await Certification.find(PUBLISHED).sort({ order: -1, issueDate: -1 }).lean();
    return serialize(docs as unknown as CertificationDoc[]);
  }, []);

export const getAchievements = (options: { featured?: boolean } = {}) =>
  safe<AchievementDoc[]>(async () => {
    const query: Record<string, unknown> = { ...PUBLISHED };
    if (options.featured) query.featured = true;
    const docs = await Achievement.find(query).sort({ featured: -1, order: -1, date: -1 }).lean();
    return serialize(docs as unknown as AchievementDoc[]);
  }, []);

export const getActivities = () =>
  safe<ActivityDoc[]>(async () => {
    const docs = await Activity.find(PUBLISHED).sort({ order: -1, startDate: -1 }).lean();
    return serialize(docs as unknown as ActivityDoc[]);
  }, []);

export const getLearning = () =>
  safe<LearningDoc[]>(async () => {
    const docs = await Learning.find(PUBLISHED).sort({ order: -1, startDate: -1 }).lean();
    return serialize(docs as unknown as LearningDoc[]);
  }, []);

export const getTimeline = () =>
  safe<TimelineEventDoc[]>(async () => {
    const docs = await TimelineEvent.find(PUBLISHED).sort({ order: -1, date: 1 }).lean();
    return serialize(docs as unknown as TimelineEventDoc[]);
  }, []);

export const getActiveResume = () =>
  safe<ResumeDoc | null>(async () => {
    const doc = await Resume.findOne({ active: true }).sort({ updatedAt: -1 }).lean();
    return doc ? serialize(doc as unknown as ResumeDoc) : null;
  }, null);
