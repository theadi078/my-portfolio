import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("border-t border-line py-16 md:py-24", className)}>
      <div className="shell">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  lead,
  aside,
}: {
  title: string;
  lead?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-title">{title}</h2>
        {lead ? <p className="mt-3 max-w-reading text-[15px] leading-relaxed text-muted">{lead}</p> : null}
      </div>
      {aside}
    </div>
  );
}

export function PageHeader({
  title,
  lead,
  meta,
}: {
  title: string;
  lead?: string;
  meta?: React.ReactNode;
}) {
  return (
    <header className="shell pb-10 pt-14 md:pb-14 md:pt-20">
      <h1 className="text-title">{title}</h1>
      {lead ? <p className="mt-4 max-w-reading text-[15px] leading-relaxed text-muted">{lead}</p> : null}
      {meta ? <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div> : null}
    </header>
  );
}
