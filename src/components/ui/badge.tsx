import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "signal" | "ok" | "danger";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-raised text-muted",
  accent: "border-accent/35 bg-accent/10 text-accent",
  signal: "border-signal/35 bg-signal/10 text-signal",
  ok: "border-ok/35 bg-ok/10 text-ok",
  danger: "border-danger/35 bg-danger/10 text-danger",
};

/** Maps project / learning states onto a colour so status is readable at a glance. */
export function toneForStatus(status?: string | null): Tone {
  switch (status) {
    case "In Progress":
    case "Learning":
    case "Practising":
      return "signal";
    case "Completed":
      return "ok";
    case "Maintenance":
      return "accent";
    case "Archived":
    case "Paused":
      return "neutral";
    default:
      return "neutral";
  }
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip border px-2 py-0.5 text-xs leading-5",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ live = true, className }: { live?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        live ? "bg-ok animate-pulseDot" : "bg-faint",
        className,
      )}
    />
  );
}
