"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProjectCard } from "./project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { ProjectDoc } from "@/models/Project";

/** Search and filtering run in the browser over the already-loaded list. */
export function ProjectExplorer({ projects }: { projects: ProjectDoc[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filters = useMemo(() => {
    const categories = new Set<string>();
    const technologies = new Map<string, number>();
    for (const project of projects) {
      if (project.category) categories.add(project.category);
      for (const tech of project.technologies ?? []) {
        technologies.set(tech, (technologies.get(tech) ?? 0) + 1);
      }
    }
    const topTech = [...technologies.entries()]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);
    return ["All", ...[...categories].sort(), ...topTech];
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesFilter =
        filter === "All" ||
        project.category === filter ||
        (project.technologies ?? []).some((t) => t.toLowerCase() === filter.toLowerCase());
      if (!matchesFilter) return false;
      if (!q) return true;
      const haystack = [
        project.title,
        project.shortDescription,
        project.category,
        ...(project.technologies ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, filter]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative w-full md:max-w-sm">
          <span className="sr-only">Search projects</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            className="h-10 w-full rounded-btn border border-line bg-surface pl-9 pr-9 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-faint hover:text-ink"
            >
              <X size={14} />
            </button>
          ) : null}
        </label>

        <p className="text-[13px] text-faint">
          {visible.length} of {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            aria-pressed={filter === name}
            className={cn(
              "rounded-chip border px-3 py-1.5 text-[13px] transition-colors",
              filter === name
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-line text-muted hover:border-accent/40 hover:text-ink",
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          className="mt-8"
          title="Nothing matches that search"
          description="Try a different keyword, or clear the filter to see everything."
        />
      )}
    </div>
  );
}
