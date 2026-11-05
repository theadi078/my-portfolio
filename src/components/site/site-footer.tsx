import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import type { ProfileDoc } from "@/models/Profile";

export function SiteFooter({ profile }: { profile: ProfileDoc | null }) {
  const year = new Date().getFullYear();
  const socials = [
    profile?.githubUrl ? { label: "GitHub", href: profile.githubUrl, icon: Github } : null,
    profile?.linkedinUrl ? { label: "LinkedIn", href: profile.linkedinUrl, icon: Linkedin } : null,
    profile?.email ? { label: "Email", href: `mailto:${profile.email}`, icon: Mail } : null,
  ].filter(Boolean) as { label: string; href: string; icon: typeof Github }[];

  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-ink">{profile?.fullName || "Portfolio"}</p>
          <p className="mt-1 text-[13px] text-faint">
            {profile?.footerNote || `Updated continuously. © ${year}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              aria-label={label}
              className="grid h-9 w-9 place-items-center rounded-btn border border-line text-muted transition-colors hover:border-accent/50 hover:text-ink"
            >
              <Icon size={16} />
            </a>
          ))}
          {(profile?.socials ?? []).map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-btn border border-line px-3 py-2 text-[13px] text-muted transition-colors hover:border-accent/50 hover:text-ink"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <div className="shell mt-8 flex items-center justify-between text-[12px] text-faint">
        <span>Built with Next.js, MongoDB and Cloudinary.</span>
        <Link href="/admin/login" className="transition-colors hover:text-muted">
          Admin
        </Link>
      </div>
    </footer>
  );
}
