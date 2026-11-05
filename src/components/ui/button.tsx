import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-55",
    {
      sm: "h-8 px-3 text-[13px]",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-[15px]",
    }[size],
    {
      primary: "bg-accent text-white hover:bg-accent/85",
      secondary: "border border-line bg-surface text-ink hover:border-accent/60 hover:bg-raised",
      ghost: "text-muted hover:bg-raised hover:text-ink",
      danger: "border border-danger/40 text-danger hover:bg-danger/10",
    }[variant],
    className,
  );
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant = "primary", size = "md", className, ...props }: Props) {
  return <button className={buttonStyles(variant, size, className)} {...props} />;
}
