import Link from "next/link";

export function StatCard({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number | string;
  href?: string;
  hint?: string;
}) {
  const content = (
    <>
      <p className="text-[12px] text-faint">{label}</p>
      <p className="mt-2 font-display text-[26px] leading-none text-ink">{value}</p>
      {hint ? <p className="mt-2 text-[12px] text-muted">{hint}</p> : null}
    </>
  );

  const className = "block rounded-card border border-line bg-surface p-4 transition-colors";

  return href ? (
    <Link href={href} className={`${className} hover:border-accent/45`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
