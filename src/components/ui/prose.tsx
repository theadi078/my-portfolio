import { cn } from "@/lib/utils";

/** Renders admin-entered text, treating blank lines as paragraph breaks. */
export function Prose({ text, className }: { text?: string | null; className?: string }) {
  if (!text?.trim()) return null;
  const paragraphs = text.trim().split(/\n{2,}/);
  return (
    <div className={cn("prose-body", className)}>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
