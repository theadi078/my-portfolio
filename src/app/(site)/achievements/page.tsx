import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { getAchievements } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Achievements",
  description: "Wins, recognitions and milestones.",
  alternates: { canonical: "/achievements" },
};

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  return (
    <>
      <PageHeader title="Achievements" lead="Moments worth keeping a record of." />
      <div className="shell pb-20">
        {achievements.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <li key={achievement._id} className="overflow-hidden rounded-card border border-line bg-surface">
                {achievement.image?.url ? (
                  <div className="relative aspect-[16/9] w-full border-b border-line bg-raised">
                    <Image
                      src={achievement.image.url}
                      alt={achievement.image.alt || achievement.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <Badge>{achievement.category}</Badge>
                    {achievement.date ? (
                      <span className="text-[12px] text-faint">{formatDate(achievement.date)}</span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 text-[16px] font-medium text-ink">{achievement.title}</h2>
                  {achievement.description ? (
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{achievement.description}</p>
                  ) : null}
                  {achievement.link ? (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
                    >
                      Read more <ExternalLink size={12} />
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No achievements yet" description="Add them from the dashboard as they happen." />
        )}
      </div>
    </>
  );
}
