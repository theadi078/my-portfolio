import { getSession } from "@/lib/auth";
import { fail, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Not signed in.", 401);
  return ok({ name: session.name, email: session.email });
}
