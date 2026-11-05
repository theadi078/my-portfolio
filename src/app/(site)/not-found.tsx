import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-[13px] text-faint">404</p>
      <h1 className="mt-3 text-title">That page does not exist</h1>
      <p className="mt-3 max-w-md text-[15px] text-muted">
        The link may be out of date, or the project may have been unpublished.
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/" className={buttonStyles("primary")}>
          Back home
        </Link>
        <Link href="/projects" className={buttonStyles("secondary")}>
          Browse projects
        </Link>
      </div>
    </div>
  );
}
