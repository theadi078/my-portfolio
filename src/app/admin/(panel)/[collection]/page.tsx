import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { buttonStyles } from "@/components/ui/button";
import { collectionClientConfig, isCollectionKey } from "@/lib/content/registry";
import { listDocuments } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionKey(collection)) return { title: "Not found" };
  return { title: collectionClientConfig(collection).label, robots: { index: false } };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionKey(collection)) notFound();

  const config = collectionClientConfig(collection);
  const rows = await listDocuments(collection);

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-title">{config.label}</h1>
          <p className="mt-2 max-w-reading text-[14px] text-muted">{config.description}</p>
        </div>
        {collection !== "messages" ? (
          <Link href={`/admin/${collection}/new`} className={buttonStyles("primary")}>
            <Plus size={15} /> Add {config.singular.toLowerCase()}
          </Link>
        ) : null}
      </header>

      {rows === null ? (
        <div className="rounded-card border border-danger/35 bg-danger/5 p-5 text-[14px] text-danger">
          Could not read from the database. Check MONGODB_URI and that your IP is allowed in MongoDB Atlas.
        </div>
      ) : (
        <DataTable config={config} rows={rows as (Record<string, unknown> & { _id: string })[]} />
      )}
    </div>
  );
}
