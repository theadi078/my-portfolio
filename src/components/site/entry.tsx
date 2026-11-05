import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * One dated record on the rail: used by experience, internships, education
 * and activities so every history section reads the same way.
 */
export function RailEntry({
  eyebrow,
  title,
  subtitle,
  meta,
  description,
  bullets,
  tags,
  live,
  footer,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  description?: string | null;
  bullets?: { label: string; items: string[] }[];
  tags?: string[];
  live?: boolean;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal as="li" className={cn("rail-node relative pb-10 last:pb-0", className)}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-[17px] font-medium tracking-tight text-ink">{title}</h3>
        {subtitle ? <span className="text-[15px] text-muted">{subtitle}</span> : null}
        {live ? <Badge tone="ok">Current</Badge> : null}
      </div>

      <p className="mt-1.5 text-[13px] text-faint">
        {[meta, eyebrow].filter(Boolean).join("  ·  ")}
      </p>

      {description ? <Prose text={description} className="mt-4 text-[14px]" /> : null}

      {bullets?.filter((b) => b.items.length).map((block) => (
        <div key={block.label} className="mt-4">
          <p className="text-[13px] text-ink">{block.label}</p>
          <ul className="mt-2 space-y-1.5">
            {block.items.map((item) => (
              <li key={item} className="relative pl-4 text-[14px] leading-relaxed text-muted">
                <span aria-hidden className="absolute left-0 top-[0.62em] h-1 w-1 rounded-full bg-faint" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {tags?.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag} className="rounded-chip border border-line px-2 py-0.5 text-[12px] text-muted">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {footer ? <div className="mt-4">{footer}</div> : null}
    </Reveal>
  );
}

export function RailList({ children }: { children: React.ReactNode }) {
  return <ul className="rail">{children}</ul>;
}
