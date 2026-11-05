import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EntityForm } from "@/components/admin/entity-form";
import { collectionClientConfig, isCollectionKey } from "@/lib/content/registry";

export const dynamic = "force-dynamic";

export default async function NewEntryPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionKey(collection) || collection === "messages") notFound();

  const config = collectionClientConfig(collection);

  return (
    <div>
      <Link href={`/admin/${collection}`} className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink">
        <ArrowLeft size={14} /> {config.label}
      </Link>
      <h1 className="mb-8 mt-4 text-title">New {config.singular.toLowerCase()}</h1>

      <EntityForm
        fields={config.fields}
        initial={{ published: !config.supportsPublish }}
        endpoint={`/api/admin/${collection}`}
        method="POST"
        folder={collection}
        cancelHref={`/admin/${collection}`}
        redirectTo={`/admin/${collection}`}
        supportsPublish={config.supportsPublish}
        savedMessage="Saved as a draft."
      />
    </div>
  );
}
