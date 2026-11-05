import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell, type NavGroup } from "@/components/admin/admin-shell";
import { Toaster } from "@/components/admin/toaster";
import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin-data";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const stats = await getDashboardStats();

  const groups: NavGroup[] = [
    { title: "Overview", items: [{ href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" }] },
    {
      title: "Content",
      items: [
        { href: "/admin/profile", label: "Profile", icon: "profile" },
        { href: "/admin/projects", label: "Projects", icon: "projects" },
        { href: "/admin/experience", label: "Experience", icon: "experience" },
        { href: "/admin/internships", label: "Internships", icon: "internships" },
        { href: "/admin/education", label: "Education", icon: "education" },
        { href: "/admin/skills", label: "Skills", icon: "skills" },
        { href: "/admin/certifications", label: "Certifications", icon: "certifications" },
        { href: "/admin/achievements", label: "Achievements", icon: "achievements" },
        { href: "/admin/activities", label: "Leadership", icon: "activities" },
        { href: "/admin/learning", label: "Currently learning", icon: "learning" },
        { href: "/admin/timeline", label: "My journey", icon: "timeline" },
      ],
    },
    {
      title: "System",
      items: [
        { href: "/admin/resume", label: "Resume", icon: "resume" },
        { href: "/admin/messages", label: "Messages", icon: "messages", badge: stats.unreadMessages || undefined },
        { href: "/admin/settings", label: "Settings", icon: "settings" },
      ],
    },
  ];

  return (
    <Toaster>
      <AdminShell groups={groups} user={{ name: session.name, email: session.email }}>
        {children}
      </AdminShell>
    </Toaster>
  );
}
