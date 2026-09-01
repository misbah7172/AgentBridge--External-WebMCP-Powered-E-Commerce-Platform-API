import { success } from "@/lib/api";
import { recommendations } from "@/lib/services/products";
export async function GET(request: Request) { const { searchParams } = new URL(request.url); return success(await recommendations(searchParams.get("category") ?? undefined, searchParams.get("brand") ?? undefined)); }
