import Link from "next/link";
import { buttonStyles } from "./button";
import { cn } from "@/lib/utils";

/** Empty screens are an invitation to act, never an apology. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border border-dashed border-line px-6 py-12 text-center", className)}>
      <p className="text-base text-ink">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {action ? (
        <Link href={action.href} className={buttonStyles("secondary", "sm", "mt-5")}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
