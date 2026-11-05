import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { EntityForm } from "@/components/admin/entity-form";
import { collectionClientConfig, isCollectionKey } from "@/lib/content/registry";
import { getDocument } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const { collection, id } = await params;
  if (!isCollectionKey(collection)) notFound();

  const config = collectionClientConfig(collection);
  const document = await getDocument(collection, id).catch(() => null);
  if (!document) notFound();

  const slug = typeof document.slug === "string" ? document.slug : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/admin/${collection}`} className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink">
          <ArrowLeft size={14} /> {config.label}
        </Link>
        {slug && document.published ? (
          <Link
            href={`/projects/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[13px] text-accent hover:underline"
          >
            View live page <ExternalLink size={12} />
          </Link>
        ) : null}
      </div>

      <h1 className="mb-8 mt-4 text-title">
        {String(document[config.titleField] ?? `Edit ${config.singular.toLowerCase()}`)}
      </h1>

      <EntityForm
        fields={config.fields}
        initial={document}
        endpoint={`/api/admin/${collection}/${id}`}
        method="PATCH"
        folder={collection}
        cancelHref={`/admin/${collection}`}
        deleteEndpoint={`/api/admin/${collection}/${id}`}
        supportsPublish={config.supportsPublish}
      />
    </div>
  );
}
