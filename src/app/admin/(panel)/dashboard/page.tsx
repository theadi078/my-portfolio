import Link from "next/link";
import { Plus } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { buttonStyles } from "@/components/ui/button";
import { getDashboardStats, getRecentUpdates, listDocuments } from "@/lib/admin-data";
import { collections } from "@/lib/content/registry";
import { isCloudinaryConfigured, isDatabaseConfigured } from "@/lib/env";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const quickActions = [
  { label: "Add project", href: "/admin/projects/new" },
  { label: "Add experience", href: "/admin/experience/new" },
  { label: "Add education", href: "/admin/education/new" },
  { label: "Add skill", href: "/admin/skills/new" },
  { label: "Add certification", href: "/admin/certifications/new" },
  { label: "Add achievement", href: "/admin/achievements/new" },
  { label: "Edit profile", href: "/admin/profile" },
];

export default async function DashboardPage() {
  const [stats, updates, projects] = await Promise.all([
    getDashboardStats(),
    getRecentUpdates(6),
    listDocuments("projects"),
  ]);

  const recentProjects = (projects ?? []).slice(0, 5);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-title">Dashboard</h1>
        <p className="mt-2 text-[14px] text-muted">Everything on your public site, managed from here.</p>
      </header>

      {!isDatabaseConfigured || !isCloudinaryConfigured ? (
        <div className="rounded-card border border-signal/35 bg-signal/5 p-4 text-[13px] text-signal">
          <p className="font-medium">Finish the setup</p>
          <ul className="mt-2 space-y-1">
            {!isDatabaseConfigured ? <li>MONGODB_URI is missing — nothing can be saved yet.</li> : null}
            {!isCloudinaryConfigured ? <li>Cloudinary variables are missing — image and PDF uploads will fail.</li> : null}
          </ul>
        </div>
      ) : null}

      <section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Projects" value={stats.projects.total} href="/admin/projects" hint={`${stats.projects.featured} featured`} />
          <StatCard label="Published" value={stats.projects.published} href="/admin/projects" />
          <StatCard label="Drafts" value={stats.projects.draft} href="/admin/projects" />
          <StatCard label="Unread messages" value={stats.unreadMessages} href="/admin/messages" />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(["experience", "education", "skills", "certifications", "achievements", "internships", "activities", "learning"] as const).map(
            (key) => (
              <StatCard key={key} label={collections[key].label} value={stats.counts[key] ?? 0} href={`/admin/${key}`} />
            ),
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[13px] font-medium text-ink">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className={buttonStyles("secondary", "sm")}>
              <Plus size={14} /> {action.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-medium text-ink">Recent projects</h2>
            <Link href="/admin/projects" className="text-[13px] text-accent hover:underline">
              View all
            </Link>
          </div>
          {recentProjects.length ? (
            <ul className="divide-y divide-line rounded-card border border-line">
              {recentProjects.map((project) => (
                <li key={String(project._id)}>
                  <Link
                    href={`/admin/projects/${String(project._id)}/edit`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-raised"
                  >
                    <span className="truncate text-[14px] text-ink">{String(project.title)}</span>
                    <span className="shrink-0 text-[12px] text-faint">{project.published ? "Live" : "Draft"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-card border border-dashed border-line px-4 py-8 text-center text-[14px] text-muted">
              No projects yet.{" "}
              <Link href="/admin/projects/new" className="text-accent hover:underline">
                Create your first project.
              </Link>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-[13px] font-medium text-ink">Recent updates</h2>
          {updates.length ? (
            <ul className="divide-y divide-line rounded-card border border-line">
              {updates.map((update) => (
                <li key={`${update.collection}-${update.id}`} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] text-ink">{update.title}</span>
                    <span className="text-[12px] text-faint">{update.collectionLabel}</span>
                  </span>
                  <span className="shrink-0 text-[12px] text-faint">{formatDate(update.updatedAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-card border border-dashed border-line px-4 py-8 text-center text-[14px] text-muted">
              Edits you make will be listed here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
