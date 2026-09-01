import { failure } from "@/lib/api";
import { currentUser } from "@/lib/auth/session";

export async function requireUser() {
  const user = await currentUser();
  return user ?? null;
}

export async function requireAdmin() {
  const user = await currentUser();
  return user?.role === "ADMIN" ? user : null;
}

export const authRequired = () => failure("AUTH_REQUIRED", "Please sign in to continue.", 401);
export const adminRequired = () => failure("FORBIDDEN", "Administrator access is required.", 403);
