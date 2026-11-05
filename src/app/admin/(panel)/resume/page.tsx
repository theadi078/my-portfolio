import { ResumeManager } from "@/components/admin/resume-manager";
import { listResumes } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Resume", robots: { index: false } };

export default async function ResumeAdminPage() {
  const resumes = await listResumes();

  return (
    <div>
      <h1 className="text-title">Resume</h1>
      <p className="mb-8 mt-2 max-w-reading text-[14px] text-muted">
        Keep every version. Whichever one is live is the file visitors view and download.
      </p>

      {resumes === null ? (
        <div className="rounded-card border border-danger/35 bg-danger/5 p-5 text-[14px] text-danger">
          Could not read from the database. Check MONGODB_URI and your Atlas network access list.
        </div>
      ) : (
        <ResumeManager resumes={resumes} />
      )}
    </div>
  );
}
