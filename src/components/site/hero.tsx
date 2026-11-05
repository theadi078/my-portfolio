import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/badge";
import type { ProfileDoc } from "@/models/Profile";
import type { ResumeDoc } from "@/models/Resume";

export function Hero({ profile, resume }: { profile: ProfileDoc | null; resume: ResumeDoc | null }) {
  const name = profile?.fullName?.trim();
  const stats = (profile?.stats ?? []).filter((s) => s.label && s.value).slice(0, 4);

  return (
    <section className="shell grid gap-12 pb-16 pt-16 md:pb-24 md:pt-24 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
      <div className="animate-rise">
        {profile?.availabilityStatus ? (
          <p className="mb-6 inline-flex items-center gap-2 rounded-chip border border-line bg-surface px-3 py-1.5 text-[13px] text-muted">
            <StatusDot live={profile.availabilityOpen !== false} />
            {profile.availabilityStatus}
          </p>
        ) : null}

        <h1 className="text-display">{name ? `Hi, I'm ${name}.` : "Welcome."}</h1>

        {profile?.headline ? (
          <p className="mt-4 text-head text-muted">{profile.headline}</p>
        ) : null}

        {profile?.shortIntro ? (
          <p className="mt-6 max-w-reading text-[16px] leading-relaxed text-muted">{profile.shortIntro}</p>
        ) : (
          <p className="mt-6 max-w-reading text-[16px] leading-relaxed text-muted">
            This site is live but the profile is still empty. Sign in to the dashboard and add your
            introduction — it appears here straight away.
          </p>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/projects" className={buttonStyles("primary", "lg")}>
            View my projects
            <ArrowRight size={16} />
          </Link>
          {resume?.url ? (
            <a href={resume.url} download className={buttonStyles("secondary", "lg")}>
              <Download size={16} />
              Download resume
            </a>
          ) : null}
          <Link href="/contact" className={buttonStyles("ghost", "lg")}>
            Contact me
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-[13px] text-muted">
          {profile?.githubUrl ? (
            <a href={profile.githubUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-ink">
              <Github size={15} /> GitHub
            </a>
          ) : null}
          {profile?.linkedinUrl ? (
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-ink">
              <Linkedin size={15} /> LinkedIn
            </a>
          ) : null}
          {profile?.email ? (
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-ink">
              <Mail size={15} /> {profile.email}
            </a>
          ) : null}
        </div>
      </div>

      <aside className="lg:pt-2">
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          {profile?.photo?.url ? (
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={profile.photo.url}
                alt={profile.photo.alt || name || "Profile photo"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
              />
            </div>
          ) : null}

          <dl className="divide-y divide-line">
            {profile?.currentRole ? (
              <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-[13px] text-faint">Currently</dt>
                <dd className="text-right text-[13px] text-ink">{profile.currentRole}</dd>
              </div>
            ) : null}
            {profile?.location ? (
              <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-[13px] text-faint">Based in</dt>
                <dd className="text-right text-[13px] text-ink">{profile.location}</dd>
              </div>
            ) : null}
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <dt className="text-[13px] text-faint">{stat.label}</dt>
                <dd className="text-right font-display text-[15px] text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </section>
  );
}
