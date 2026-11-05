import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { getCertifications } from "@/lib/data";
import { formatMonth } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Certifications",
  description: "Credentials earned, with verification links.",
  alternates: { canonical: "/certifications" },
};

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <>
      <PageHeader title="Certifications" lead="Credentials I have earned, each one verifiable." />
      <div className="shell pb-20">
        {certifications.length ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {certifications.map((certification) => (
              <li key={certification._id} className="flex flex-col rounded-card border border-line bg-surface p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[16px] font-medium text-ink">{certification.name}</h2>
                  {certification.issueDate ? (
                    <span className="shrink-0 text-[12px] text-faint">{formatMonth(certification.issueDate)}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-[14px] text-muted">{certification.issuer}</p>

                {certification.description ? (
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{certification.description}</p>
                ) : null}

                {certification.skills?.length ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {certification.skills.map((skill) => (
                      <li key={skill} className="rounded-chip border border-line px-2 py-0.5 text-[12px] text-muted">
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-[13px]">
                  {certification.credentialUrl ? (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline"
                    >
                      Verify <ExternalLink size={12} />
                    </a>
                  ) : null}
                  {certification.certificate?.url ? (
                    <a
                      href={certification.certificate.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-accent hover:underline"
                    >
                      Certificate <ExternalLink size={12} />
                    </a>
                  ) : null}
                  {certification.credentialId ? (
                    <span className="font-mono text-[12px] text-faint">ID {certification.credentialId}</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No certifications yet"
            description="Credentials added from the dashboard show up here with their verification links."
          />
        )}
      </div>
    </>
  );
}
