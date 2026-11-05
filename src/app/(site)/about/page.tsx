import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader, Section, SectionHeading } from "@/components/ui/section";
import { Prose } from "@/components/ui/prose";
import { EmptyState } from "@/components/ui/empty-state";
import { Journey } from "@/components/site/journey";
import { getProfile, getTimeline } from "@/lib/data";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "About",
    description: profile?.shortIntro || `About ${profile?.fullName ?? ""}`.trim(),
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [profile, timeline] = await Promise.all([getProfile(), getTimeline()]);

  if (!profile) {
    return (
      <div className="shell py-20">
        <EmptyState
          title="This page is waiting for your profile"
          description="Sign in to the dashboard, fill in your profile, and this page writes itself."
          action={{ label: "Open the dashboard", href: "/admin/login" }}
        />
      </div>
    );
  }

  const lists = [
    { title: "Career interests", items: profile.careerInterests ?? [] },
    { title: "Professional goals", items: profile.professionalGoals ?? [] },
    { title: "Outside work", items: profile.personalInterests ?? [] },
  ].filter((block) => block.items.length);

  const stats = (profile.stats ?? []).filter((s) => s.label && s.value);

  return (
    <>
      <PageHeader title={profile.fullName || "About"} lead={profile.headline || undefined} />

      <div className="shell grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <div>
          {profile.shortIntro ? (
            <p className="max-w-reading text-[17px] leading-relaxed text-ink">{profile.shortIntro}</p>
          ) : null}
          <Prose text={profile.biography} className="mt-6" />
        </div>

        <aside className="space-y-6">
          {profile.photo?.url ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-line">
              <Image
                src={profile.photo.url}
                alt={profile.photo.alt || profile.fullName || "Profile photo"}
                fill
                sizes="(max-width: 1024px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          ) : null}

          {stats.length ? (
            <dl className="divide-y divide-line rounded-card border border-line bg-surface">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline justify-between px-4 py-3">
                  <dt className="text-[13px] text-faint">{stat.label}</dt>
                  <dd className="font-display text-[15px] text-ink">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {profile.location || profile.currentRole ? (
            <dl className="divide-y divide-line rounded-card border border-line bg-surface">
              {profile.currentRole ? (
                <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-[13px] text-faint">Currently</dt>
                  <dd className="text-right text-[13px] text-ink">{profile.currentRole}</dd>
                </div>
              ) : null}
              {profile.location ? (
                <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-[13px] text-faint">Based in</dt>
                  <dd className="text-right text-[13px] text-ink">{profile.location}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </aside>
      </div>

      {lists.length ? (
        <Section>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((block) => (
              <section key={block.title}>
                <h2 className="border-b border-line pb-2 text-[13px] font-medium text-ink">{block.title}</h2>
                <ul className="mt-3 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="text-[14px] leading-relaxed text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Section>
      ) : null}

      {timeline.length ? (
        <Section className="pb-20">
          <SectionHeading title="My journey" />
          <Journey events={timeline} />
        </Section>
      ) : null}
    </>
  );
}
