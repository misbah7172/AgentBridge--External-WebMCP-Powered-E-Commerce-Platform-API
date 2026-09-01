import { adminRequired, requireAdmin } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { db } from "@/lib/db";
import { productCreateSchema } from "@/lib/validation/commerce";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const admin = await requireAdmin(); if (!admin) return adminRequired(); const input = productCreateSchema.partial().safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "Invalid product information.", 422); const result = await db.product.updateMany({ where: { id: (await params).id }, data: input.data }); return result.count ? success({}) : failure("PRODUCT_NOT_FOUND", "Product was not found.", 404); }
