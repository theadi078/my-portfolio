import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { Journey } from "@/components/site/journey";
import { ProjectCard } from "@/components/site/project-card";
import { SkillsGrid } from "@/components/site/skills-grid";
import { LearningList } from "@/components/site/learning-list";
import { GithubPanel } from "@/components/site/github-panel";
import { Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonStyles } from "@/components/ui/button";
import { getAchievements, getActiveResume, getLearning, getProfile, getProjects, getSkills, getTimeline } from "@/lib/data";
import { env } from "@/lib/env";
import { formatMonth } from "@/lib/utils";

export const revalidate = 300;

export default async function HomePage() {
  const [profile, resume, featured, allProjects, timeline, skills, learning, achievements] = await Promise.all([
    getProfile(),
    getActiveResume(),
    getProjects({ featured: true, limit: 3 }),
    getProjects({ limit: 3 }),
    getTimeline(),
    getSkills(),
    getLearning(),
    getAchievements({ featured: true }),
  ]);

  const projects = featured.length ? featured : allProjects;

  const personSchema = profile?.fullName
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.fullName,
        jobTitle: profile.headline || undefined,
        email: profile.email || undefined,
        url: env.siteUrl,
        address: profile.location || undefined,
        sameAs: [profile.githubUrl, profile.linkedinUrl, ...(profile.socials ?? []).map((s) => s.url)].filter(Boolean),
      }
    : null;

  return (
    <>
      {personSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      ) : null}

      <Hero profile={profile} resume={resume} />

      <Section id="projects">
        <SectionHeading
          title="Selected projects"
          lead="Each one has its own page with the problem, the build and what it taught me."
          aside={
            projects.length ? (
              <Link href="/projects" className={buttonStyles("secondary", "sm")}>
                All projects <ArrowRight size={15} />
              </Link>
            ) : null
          }
        />
        {projects.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No projects published yet"
            description="Projects added in the dashboard appear here as soon as they are published."
          />
        )}
      </Section>

      {timeline.length ? (
        <Section id="journey">
          <SectionHeading title="My journey" lead="How the last few years fit together." />
          <Journey events={timeline} />
        </Section>
      ) : null}

      {skills.length ? (
        <Section id="skills">
          <SectionHeading title="Technologies I work with" />
          <SkillsGrid skills={skills} />
        </Section>
      ) : null}

      {learning.length ? (
        <Section id="learning">
          <SectionHeading title="Currently learning" lead="What I am working through right now." />
          <LearningList items={learning} />
        </Section>
      ) : null}

      {achievements.length ? (
        <Section id="achievements">
          <SectionHeading
            title="Recent highlights"
            aside={
              <Link href="/achievements" className={buttonStyles("secondary", "sm")}>
                All achievements <ArrowRight size={15} />
              </Link>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.slice(0, 3).map((achievement) => (
              <li key={achievement._id} className="rounded-card border border-line bg-surface p-5">
                <p className="text-[12px] text-faint">
                  {[formatMonth(achievement.date), achievement.category].filter(Boolean).join("  ·  ")}
                </p>
                <h3 className="mt-2 text-[16px] font-medium text-ink">{achievement.title}</h3>
                {achievement.description ? (
                  <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted">{achievement.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section id="github">
        <SectionHeading title="Code" lead="Where the work actually lives." />
        <GithubPanel profileUrl={profile?.githubUrl || undefined} />
      </Section>

      <Section id="contact" className="pb-20">
        <div className="flex flex-col gap-6 rounded-card border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-head">{profile?.contactHeading || "Let's talk"}</h2>
            <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-muted">
              {profile?.contactBlurb || "Open to internships, graduate roles and interesting problems."}
            </p>
          </div>
          <Link href="/contact" className={buttonStyles("primary", "lg", "shrink-0")}>
            Contact me <ArrowRight size={16} />
          </Link>
        </div>
      </Section>
    </>
  );
}
