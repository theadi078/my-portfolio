import type { z } from "zod";
import type { Model } from "mongoose";

/** Every input widget the admin form knows how to render. */
export type FieldType =
  | "text" | "slug" | "textarea" | "longtext" | "number" | "date"
  | "boolean" | "select" | "tags" | "list" | "image" | "gallery" | "file" | "url"
  | "stats" | "socials";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  options?: readonly string[];
  required?: boolean;
  group?: string;
  rows?: number;
  /** Auto-fill this slug field from another field's value. */
  slugFrom?: string;
  /** Half-width on desktop. */
  half?: boolean;
};

export type ListColumn = { name: string; label: string; type?: "text" | "date" | "badge" | "boolean" };

export type CollectionConfig = {
  key: string;
  label: string;
  singular: string;
  description: string;
  /** Lazy so models register through the shared mongoose connection first. */
  model: () => Model<any>;
  schema: z.ZodTypeAny;
  fields: FieldDef[];
  listColumns: ListColumn[];
  defaultSort: Record<string, 1 | -1>;
  titleField: string;
  supportsPublish?: boolean;
  supportsFeatured?: boolean;
  supportsDuplicate?: boolean;
  emptyState: string;
  group: "Content" | "System";
};
