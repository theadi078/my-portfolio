import { EntityForm } from "@/components/admin/entity-form";
import { settingsFields } from "@/lib/content/profile-schema";
import { getProfileForAdmin } from "@/lib/admin-data";
import { isCloudinaryConfigured, isDatabaseConfigured, isGithubConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings", robots: { index: false } };

export default async function SettingsPage() {
  const profile = await getProfileForAdmin();

  const services = [
    { name: "MongoDB Atlas", ready: isDatabaseConfigured, note: "Stores all content." },
    { name: "Cloudinary", ready: isCloudinaryConfigured, note: "Stores images and PDFs." },
    { name: "GitHub panel", ready: isGithubConfigured, note: "Optional. Shows live repository data." },
  ];

  return (
    <div>
      <h1 className="text-title">Settings</h1>
      <p className="mb-8 mt-2 max-w-reading text-[14px] text-muted">
        Search metadata, sharing images and the wording used across a few pages.
      </p>

      <section className="mb-8 rounded-card border border-line bg-surface p-5 md:p-6">
        <h2 className="mb-4 text-[13px] font-medium text-ink">Connected services</h2>
        <ul className="divide-y divide-line">
          {services.map((service) => (
            <li key={service.name} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <span>
                <span className="block text-[14px] text-ink">{service.name}</span>
                <span className="text-[12px] text-faint">{service.note}</span>
              </span>
              <span className={`text-[13px] ${service.ready ? "text-ok" : "text-signal"}`}>
                {service.ready ? "Connected" : "Not configured"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <EntityForm
        fields={settingsFields}
        initial={profile ?? {}}
        endpoint="/api/admin/profile"
        method="PUT"
        folder="site"
        cancelHref="/admin/dashboard"
        savedMessage="Settings saved."
      />
    </div>
  );
}
