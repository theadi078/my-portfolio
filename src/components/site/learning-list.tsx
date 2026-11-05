import { Badge, toneForStatus } from "@/components/ui/badge";
import type { LearningDoc } from "@/models/Learning";

export function LearningList({ items }: { items: LearningDoc[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item._id} className="rounded-card border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-medium text-ink">{item.topic}</h3>
            <Badge tone={toneForStatus(item.status)}>{item.status}</Badge>
          </div>
          {item.description ? (
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.description}</p>
          ) : null}
          {typeof item.progress === "number" ? (
            <div className="mt-4">
              <div
                className="h-1 w-full overflow-hidden rounded-full bg-raised"
                role="progressbar"
                aria-valuenow={item.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.topic} progress`}
              >
                <div className="h-full rounded-full bg-accent" style={{ width: `${item.progress}%` }} />
              </div>
              <p className="mt-1.5 text-[12px] text-faint">{item.progress}% through</p>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
