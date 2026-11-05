import "server-only";
import { revalidatePath } from "next/cache";

/** Public pages are cached; call this after any admin write so edits appear at once. */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}
