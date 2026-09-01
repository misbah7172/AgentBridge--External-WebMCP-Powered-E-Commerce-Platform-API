import { failure, success } from "@/lib/api";
import { searchProducts } from "@/lib/services/products";
import { productQuerySchema } from "@/lib/validation/products";
export async function GET(request: Request) { const params = Object.fromEntries(new URL(request.url).searchParams); const parsed = productQuerySchema.safeParse(params); return parsed.success ? success(await searchProducts(parsed.data)) : failure("VALIDATION_ERROR", "Invalid product search parameters.", 422); }
