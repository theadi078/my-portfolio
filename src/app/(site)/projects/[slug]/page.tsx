import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github, PlayCircle } from "lucide-react";
import { Badge, toneForStatus } from "@/components/ui/badge";
import { Prose } from "@/components/ui/prose";
import { Gallery } from "@/components/site/gallery";
import { buttonStyles } from "@/components/ui/button";
import { getProjectBySlug, getProjectNeighbours, getProjectSlugs } from "@/lib/data";
import { excerpt, formatMonth } from "@/lib/utils";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const description = excerpt(project.shortDescription);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      images: project.thumbnail?.url ? [{ url: project.thumbnail.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: project.thumbnail?.url ? [project.thumbnail.url] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { previous, next } = await getProjectNeighbours(slug);

  const sections = [
    { title: "Problem", body: project.problem },
    { title: "Solution", body: project.solution },
    { title: "Architecture", body: project.architecture },
    { title: "How I built it", body: project.process },
    { title: "Challenges", body: project.challenges },
    { title: "What I learned", body: project.learnings },
  ].filter((section) => section.body?.trim());

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    dateCreated: project.projectDate ?? undefined,
    keywords: project.technologies?.join(", "),
    url: project.liveUrl || undefined,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="shell pt-10">
        <Link href="/projects" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink">
          <ArrowLeft size={14} /> All projects
        </Link>
      </div>

      <header className="shell pb-10 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={toneForStatus(project.status)}>{project.status}</Badge>
          <Badge>{project.category}</Badge>
          {project.projectDate ? (
            <span className="text-[13px] text-faint">{formatMonth(project.projectDate)}</span>
          ) : null}
        </div>

        <h1 className="mt-5 text-title">{project.title}</h1>
        <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-muted">{project.shortDescription}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className={buttonStyles("primary")}>
              <ExternalLink size={15} /> Open live demo
            </a>
          ) : null}
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noreferrer noopener" className={buttonStyles("secondary")}>
              <Github size={15} /> View source
            </a>
          ) : null}
          {project.videoUrl ? (
            <a href={project.videoUrl} target="_blank" rel="noreferrer noopener" className={buttonStyles("ghost")}>
              <PlayCircle size={15} /> Watch the demo
            </a>
          ) : null}
        </div>
      </header>

      {project.thumbnail?.url ? (
        <div className="shell">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card border border-line bg-raised">
            <Image
              src={project.thumbnail.url}
              alt={project.thumbnail.alt || project.title}
              fill
              priority
              sizes="(max-width: 1180px) 100vw, 1180px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="shell grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <div className="space-y-10">
          {project.fullDescription ? <Prose text={project.fullDescription} className="text-[15px]" /> : null}

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 text-head">{section.title}</h2>
              <Prose text={section.body} className="text-[15px]" />
            </section>
          ))}

          {project.features?.length ? (
            <section>
              <h2 className="mb-3 text-head">Features</h2>
              <ul className="space-y-2">
                {project.features.map((feature) => (
                  <li key={feature} className="relative max-w-reading pl-4 text-[15px] leading-relaxed text-muted">
                    <span aria-hidden className="absolute left-0 top-[0.65em] h-1 w-1 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.gallery?.length ? (
            <section>
              <h2 className="mb-4 text-head">Screenshots</h2>
              <Gallery images={project.gallery} title={project.title} />
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {project.technologies?.length ? (
            <div>
              <h2 className="border-b border-line pb-2 text-[13px] font-medium text-ink">Built with</h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <li key={tech} className="rounded-chip border border-line px-2 py-0.5 text-[12px] text-muted">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <dl className="divide-y divide-line rounded-card border border-line bg-surface">
            <div className="flex items-baseline justify-between px-4 py-3">
              <dt className="text-[13px] text-faint">Status</dt>
              <dd className="text-[13px] text-ink">{project.status}</dd>
            </div>
            {project.projectDate ? (
              <div className="flex items-baseline justify-between px-4 py-3">
                <dt className="text-[13px] text-faint">Date</dt>
                <dd className="text-[13px] text-ink">{formatMonth(project.projectDate)}</dd>
              </div>
            ) : null}
            <div className="flex items-baseline justify-between px-4 py-3">
              <dt className="text-[13px] text-faint">Category</dt>
              <dd className="text-[13px] text-ink">{project.category}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {previous || next ? (
        <nav className="border-t border-line" aria-label="More projects">
          <div className="shell grid gap-4 py-10 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/projects/${previous.slug}`}
                className="group rounded-card border border-line p-5 transition-colors hover:border-accent/45"
              >
                <span className="inline-flex items-center gap-2 text-[12px] text-faint">
                  <ArrowLeft size={13} /> Previous
                </span>
                <p className="mt-2 text-[15px] text-ink">{previous.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group rounded-card border border-line p-5 text-right transition-colors hover:border-accent/45 sm:col-start-2"
              >
                <span className="inline-flex items-center gap-2 text-[12px] text-faint">
                  Next <ArrowRight size={13} />
                </span>
                <p className="mt-2 text-[15px] text-ink">{next.title}</p>
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </article>
  );
}
