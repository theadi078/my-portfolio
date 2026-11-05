import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectExplorer } from "@/components/site/project-explorer";
import { getProjects } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I have designed, built and shipped.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        title="Projects"
        lead="Everything I have built, with the reasoning behind each one. Search or filter to narrow it down."
      />
      <div className="shell pb-20">
        {projects.length ? (
          <ProjectExplorer projects={projects} />
        ) : (
          <EmptyState
            title="No projects published yet"
            description="Once a project is published from the dashboard it shows up here automatically."
          />
        )}
      </div>
    </>
  );
}
