import { requireAdmin } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/api";
import { getDashboardStats } from "@/lib/admin-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    return ok(await getDashboardStats());
  } catch (error) {
    return handleApiError(error);
  }
}
