import { EntityForm } from "@/components/admin/entity-form";
import { profileFields } from "@/lib/content/profile-schema";
import { getProfileForAdmin } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile", robots: { index: false } };

export default async function ProfilePage() {
  const profile = await getProfileForAdmin();

  return (
    <div>
      <h1 className="text-title">Profile</h1>
      <p className="mb-8 mt-2 max-w-reading text-[14px] text-muted">
        This is what the homepage and about page say about you. Saving updates the public site immediately.
      </p>

      <EntityForm
        fields={profileFields}
        initial={profile ?? {}}
        endpoint="/api/admin/profile"
        method="PUT"
        folder="profile"
        cancelHref="/admin/dashboard"
        savedMessage="Profile saved."
      />
    </div>
  );
}
