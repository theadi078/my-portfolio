import type { Metadata } from "next";
import { Github, Linkedin, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/section";
import { ContactForm } from "@/components/site/contact-form";
import { getProfile } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a message directly.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const profile = await getProfile();

  const channels = [
    profile?.email ? { label: profile.email, href: `mailto:${profile.email}`, icon: Mail, name: "Email" } : null,
    profile?.linkedinUrl ? { label: "Connect on LinkedIn", href: profile.linkedinUrl, icon: Linkedin, name: "LinkedIn" } : null,
    profile?.githubUrl ? { label: "Follow on GitHub", href: profile.githubUrl, icon: Github, name: "GitHub" } : null,
  ].filter(Boolean) as { label: string; href: string; icon: typeof Mail; name: string }[];

  return (
    <>
      <PageHeader
        title={profile?.contactHeading || "Contact"}
        lead={profile?.contactBlurb || "Send a message and it lands straight in my inbox."}
      />
      <div className="shell grid gap-12 pb-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <ContactForm />

        <aside className="space-y-3">
          {channels.map(({ label, href, icon: Icon, name }) => (
            <a
              key={name}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3.5 transition-colors hover:border-accent/45"
            >
              <Icon size={16} className="text-muted" />
              <span className="min-w-0">
                <span className="block text-[12px] text-faint">{name}</span>
                <span className="block truncate text-[14px] text-ink">{label}</span>
              </span>
            </a>
          ))}
          {profile?.location ? (
            <p className="px-1 pt-2 text-[13px] text-faint">Based in {profile.location}</p>
          ) : null}
        </aside>
      </div>
    </>
  );
}
