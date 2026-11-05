"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award, BookOpen, Briefcase, FileText, GraduationCap, LayoutDashboard, LogOut, Mail,
  Menu, Route, Settings, Sparkles, UserRound, Wrench, X, Layers,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { apiRequest } from "@/lib/client-api";
import { cn } from "@/lib/utils";

const icons = {
  dashboard: LayoutDashboard, profile: UserRound, projects: Layers, experience: Briefcase,
  education: GraduationCap, skills: Wrench, certifications: Award, achievements: Sparkles,
  internships: Briefcase, activities: Route, learning: BookOpen, timeline: Route,
  resume: FileText, settings: Settings, messages: Mail,
} as const;

export type NavItem = { href: string; label: string; icon: keyof typeof icons; badge?: number };
export type NavGroup = { title: string; items: NavItem[] };

export function AdminShell({
  groups,
  user,
  children,
}: {
  groups: NavGroup[];
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function signOut() {
    setSigningOut(true);
    await apiRequest("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex h-full flex-col gap-7 overflow-y-auto p-4" aria-label="Admin">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-[12px] text-faint">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = icons[item.icon];
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-btn px-3 py-2 text-[14px] transition-colors",
                      active ? "bg-accent/10 text-accent" : "text-muted hover:bg-raised hover:text-ink",
                    )}
                  >
                    <Icon size={16} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-chip bg-accent/15 px-1.5 text-[11px] text-accent">{item.badge}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-auto border-t border-line pt-4">
        <p className="px-3 text-[13px] text-ink">{user.name}</p>
        <p className="truncate px-3 text-[12px] text-faint">{user.email}</p>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="mt-3 flex w-full items-center gap-2.5 rounded-btn px-3 py-2 text-[14px] text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          <LogOut size={16} />
          {signingOut ? "Signing out" : "Sign out"}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh border-r border-line bg-surface lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-line px-5">
          <Link href="/" className="text-[14px] font-medium tracking-tight text-ink">
            Portfolio CMS
          </Link>
        </div>
        <div className="h-[calc(100dvh-4rem)]">{nav}</div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-base/90 px-4 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-btn border border-line text-muted lg:hidden"
          >
            <Menu size={16} />
          </button>
          <Link href="/" className="text-[13px] text-muted hover:text-ink">
            View public site
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-line bg-surface">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="text-[14px] font-medium text-ink">Portfolio CMS</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
