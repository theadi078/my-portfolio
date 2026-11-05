import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonStyles } from "@/components/ui/button";
import { getActiveResume, getProfile } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resume",
  description: "View or download the current resume.",
  alternates: { canonical: "/resume" },
};

export default async function ResumePage() {
  const [resume, profile] = await Promise.all([getActiveResume(), getProfile()]);

  if (!resume) {
    return (
      <>
        <PageHeader title="Resume" />
        <div className="shell pb-20">
          <EmptyState
            title="No resume uploaded yet"
            description="Upload a PDF from the dashboard and it becomes available here to view and download."
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Resume"
        lead={`${profile?.fullName ? `${profile.fullName} — ` : ""}last updated ${formatDate(resume.updatedAt)}.`}
        meta={
          <>
            <a href={resume.url} download className={buttonStyles("primary")}>
              <Download size={15} /> Download PDF
            </a>
            <a href={resume.url} target="_blank" rel="noreferrer noopener" className={buttonStyles("secondary")}>
              <ExternalLink size={15} /> Open in a new tab
            </a>
          </>
        }
      />
      <div className="shell pb-20">
        <object data={resume.url} type="application/pdf" className="h-[80vh] w-full rounded-card border border-line">
          <p className="p-6 text-[14px] text-muted">
            Your browser cannot display PDFs inline.{" "}
            <a href={resume.url} className="text-accent hover:underline">
              Download the resume instead
            </a>
            .
          </p>
        </object>
      </div>
    </>
  );
}
