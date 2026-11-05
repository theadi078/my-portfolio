import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { RailEntry, RailList } from "@/components/site/entry";
import { EmptyState } from "@/components/ui/empty-state";
import { getEducation } from "@/lib/data";
import { formatRange } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Education",
  description: "Degrees, schooling and coursework.",
  alternates: { canonical: "/education" },
};

export default async function EducationPage() {
  const education = await getEducation();

  return (
    <>
      <PageHeader title="Education" lead="Where I studied and what I studied there." />
      <div className="shell pb-20">
        {education.length ? (
          <RailList>
            {education.map((item) => (
              <RailEntry
                key={item._id}
                title={item.degree}
                subtitle={item.institution}
                meta={formatRange(item.startDate, item.endDate, item.current)}
                eyebrow={[item.fieldOfStudy, item.location].filter(Boolean).join(" · ") || undefined}
                description={item.description}
                live={item.current}
                tags={item.score ? [`${item.scoreLabel || "Score"}: ${item.score}`] : undefined}
                footer={
                  item.document?.url ? (
                    <a
                      href={item.document.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
                    >
                      View document <ExternalLink size={12} />
                    </a>
                  ) : null
                }
              />
            ))}
          </RailList>
        ) : (
          <EmptyState
            title="No education entries yet"
            description="Add your degree, school years and courses from the dashboard."
          />
        )}
      </div>
    </>
  );
}
