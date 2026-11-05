import { Reveal } from "@/components/ui/reveal";
import { formatMonth } from "@/lib/utils";
import type { TimelineEventDoc } from "@/models/TimelineEvent";

/** The homepage journey: each step carries its own date marker. */
export function Journey({ events }: { events: TimelineEventDoc[] }) {
  return (
    <ol className="rail space-y-9">
      {events.map((event, index) => (
        <Reveal
          as="li"
          key={event._id}
          delay={Math.min(index * 60, 240)}
          className="rail-node relative"
          data-live={index === 0}
        >
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-[13px] text-accent">
              {event.dateLabel || formatMonth(event.date) || "—"}
            </span>
            <span className="text-[12px] text-faint">{event.kind}</span>
          </div>
          <h3 className="mt-1.5 text-[17px] font-medium tracking-tight text-ink">{event.title}</h3>
          {event.subtitle ? <p className="mt-1 text-[14px] text-muted">{event.subtitle}</p> : null}
          {event.description ? (
            <p className="mt-2.5 max-w-reading text-[14px] leading-relaxed text-muted">{event.description}</p>
          ) : null}
        </Reveal>
      ))}
    </ol>
  );
}
