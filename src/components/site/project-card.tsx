import Link from "next/link";
import Image from "next/image";
import { Badge, toneForStatus } from "@/components/ui/badge";
import { formatMonth } from "@/lib/utils";
import type { ProjectDoc } from "@/models/Project";

export function ProjectCard({ project }: { project: ProjectDoc }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-accent/45">
      <Link href={`/projects/${project.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-raised">
          {project.thumbnail?.url ? (
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt || project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1180px) 50vw, 380px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="grid h-full place-items-center text-[13px] text-faint">No image yet</div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2">
            <Badge tone={toneForStatus(project.status)}>{project.status}</Badge>
            <span className="text-[12px] text-faint">{project.category}</span>
            {project.projectDate ? (
              <span className="ml-auto text-[12px] text-faint">{formatMonth(project.projectDate)}</span>
            ) : null}
          </div>

          <h3 className="mt-3 text-[17px] font-medium tracking-tight text-ink">{project.title}</h3>
          <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted">{project.shortDescription}</p>

          {project.technologies?.length ? (
            <ul className="mt-4 flex flex-wrap gap-1.5 pt-1">
              {project.technologies.slice(0, 5).map((tech) => (
                <li key={tech} className="rounded-chip border border-line px-2 py-0.5 text-[12px] text-muted">
                  {tech}
                </li>
              ))}
              {project.technologies.length > 5 ? (
                <li className="px-1 py-0.5 text-[12px] text-faint">+{project.technologies.length - 5}</li>
              ) : null}
            </ul>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
