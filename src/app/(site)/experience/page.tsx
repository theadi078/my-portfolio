import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader, Section, SectionHeading } from "@/components/ui/section";
import { RailEntry, RailList } from "@/components/site/entry";
import { EmptyState } from "@/components/ui/empty-state";
import { getActivities, getExperience, getInternships } from "@/lib/data";
import { formatRange } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles, internships and the work behind them.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const [experience, internships, activities] = await Promise.all([
    getExperience(),
    getInternships(),
    getActivities(),
  ]);

  const nothing = !experience.length && !internships.length && !activities.length;

  return (
    <>
      <PageHeader title="Experience" lead="Where I have worked, what I was responsible for, and what came out of it." />

      <div className="shell pb-6">
        {nothing ? (
          <EmptyState
            title="No experience added yet"
            description="Roles, internships and activities added in the dashboard appear here."
          />
        ) : null}

        {experience.length ? (
          <RailList>
            {experience.map((role) => (
              <RailEntry
                key={role._id}
                title={role.position}
                subtitle={role.company}
                meta={formatRange(role.startDate, role.endDate, role.current)}
                eyebrow={[role.employmentType, role.location].filter(Boolean).join(" · ")}
                description={role.description}
                live={role.current}
                tags={role.technologies}
                bullets={[
                  { label: "Responsibilities", items: role.responsibilities ?? [] },
                  { label: "Achievements", items: role.achievements ?? [] },
                ]}
                footer={
                  role.companyUrl ? (
                    <a
                      href={role.companyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
                    >
                      Company site <ExternalLink size={12} />
                    </a>
                  ) : null
                }
              />
            ))}
          </RailList>
        ) : null}
      </div>

      {internships.length ? (
        <Section>
          <SectionHeading title="Internships" />
          <RailList>
            {internships.map((internship) => (
              <RailEntry
                key={internship._id}
                title={internship.role}
                subtitle={internship.company}
                meta={formatRange(internship.startDate, internship.endDate, internship.current) || internship.duration}
                eyebrow={internship.location || undefined}
                description={internship.description}
                tags={internship.technologies}
                live={internship.current}
                bullets={[{ label: "Responsibilities", items: internship.responsibilities ?? [] }]}
                footer={
                  internship.certificate?.url ? (
                    <a
                      href={internship.certificate.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
                    >
                      View certificate <ExternalLink size={12} />
                    </a>
                  ) : null
                }
              />
            ))}
          </RailList>
        </Section>
      ) : null}

      {activities.length ? (
        <Section className="pb-20">
          <SectionHeading title="Leadership and activities" lead="Clubs, events, teams and volunteering." />
          <RailList>
            {activities.map((activity) => (
              <RailEntry
                key={activity._id}
                title={activity.title}
                subtitle={activity.role || activity.organization || undefined}
                meta={formatRange(activity.startDate, activity.endDate, activity.current)}
                eyebrow={activity.role && activity.organization ? activity.organization : undefined}
                description={activity.description}
                live={activity.current}
                bullets={[{ label: "Highlights", items: activity.achievements ?? [] }]}
                footer={
                  activity.link ? (
                    <a
                      href={activity.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
                    >
                      Learn more <ExternalLink size={12} />
                    </a>
                  ) : null
                }
              />
            ))}
          </RailList>
        </Section>
      ) : null}
    </>
  );
}
