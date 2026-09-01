import { failure, success } from "@/lib/api";
import { getProduct } from "@/lib/services/products";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const product = await getProduct((await params).id); return product ? success(product) : failure("PRODUCT_NOT_FOUND", "Product was not found.", 404); }
