import { currentUser } from "@/lib/auth/session";
import { success } from "@/lib/api";
export async function GET() { return success({ user: await currentUser() }); }
