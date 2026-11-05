import "server-only";
import { connectToDatabase } from "./db";
import { serialize } from "./utils";
import "@/models";
import { collections, getCollection } from "./content/registry";
import { Project } from "@/models/Project";
import { Resume, type ResumeDoc } from "@/models/Resume";
import { ContactMessage } from "@/models/ContactMessage";
import { Profile, type ProfileDoc } from "@/models/Profile";

export type DashboardStats = {
  projects: { total: number; published: number; draft: number; featured: number };
  counts: Record<string, number>;
  unreadMessages: number;
  databaseReady: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    projects: { total: 0, published: 0, draft: 0, featured: 0 },
    counts: {},
    unreadMessages: 0,
    databaseReady: false,
  };
  try {
    await connectToDatabase();
    const counts: Record<string, number> = {};
    await Promise.all(
      Object.values(collections).map(async (c) => {
        counts[c.key] = await c.model().countDocuments({});
      }),
    );
    const [total, published, featured, unread] = await Promise.all([
      Project.countDocuments({}),
      Project.countDocuments({ published: true }),
      Project.countDocuments({ featured: true }),
      ContactMessage.countDocuments({ read: false }),
    ]);
    return {
      projects: { total, published, draft: total - published, featured },
      counts,
      unreadMessages: unread,
      databaseReady: true,
    };
  } catch (error) {
    console.error("[admin-data]", error instanceof Error ? error.message : error);
    return empty;
  }
}

/** Newest edits across every collection, for the dashboard activity list. */
export async function getRecentUpdates(limit = 6) {
  try {
    await connectToDatabase();
    const results = await Promise.all(
      Object.values(collections).map(async (c) => {
        const docs = await c
          .model()
          .find({}, { [c.titleField]: 1, updatedAt: 1 })
          .sort({ updatedAt: -1 })
          .limit(limit)
          .lean();
        return (docs as Array<Record<string, unknown>>).map((d) => ({
          id: String(d._id),
          collection: c.key,
          collectionLabel: c.label,
          title: String(d[c.titleField] ?? "Untitled"),
          updatedAt: new Date(String(d.updatedAt)).toISOString(),
        }));
      }),
    );
    return results
      .flat()
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function listDocuments(collectionKey: string) {
  const config = getCollection(collectionKey);
  try {
    await connectToDatabase();
    const docs = await config.model().find({}).sort(config.defaultSort).lean();
    return serialize(docs as unknown as Array<Record<string, unknown>>);
  } catch (error) {
    console.error("[admin-data]", error instanceof Error ? error.message : error);
    return null; // null means "could not read", empty array means "nothing yet"
  }
}

export async function getDocument(collectionKey: string, id: string) {
  const config = getCollection(collectionKey);
  await connectToDatabase();
  const doc = await config.model().findById(id).lean();
  return doc ? serialize(doc as unknown as Record<string, unknown>) : null;
}

export async function getProfileForAdmin(): Promise<ProfileDoc | null> {
  try {
    await connectToDatabase();
    const doc = await Profile.findOne({}).lean();
    return doc ? serialize(doc as unknown as ProfileDoc) : null;
  } catch {
    return null;
  }
}

export async function listResumes(): Promise<ResumeDoc[] | null> {
  try {
    await connectToDatabase();
    const docs = await Resume.find({}).sort({ active: -1, updatedAt: -1 }).lean();
    return serialize(docs as unknown as ResumeDoc[]);
  } catch {
    return null;
  }
}
