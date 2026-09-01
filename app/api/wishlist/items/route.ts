import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { db } from "@/lib/db";
import { z } from "zod";
export async function POST(request: Request) { const user = await requireUser(); if (!user) return authRequired(); const parsed = z.object({ productId: z.string().min(1) }).safeParse(await request.json()); if (!parsed.success) return failure("VALIDATION_ERROR", "Invalid product.", 422); const product = await db.product.findUnique({ where: { id: parsed.data.productId } }); if (!product) return failure("PRODUCT_NOT_FOUND", "Product was not found.", 404); const wishlist = await db.wishlist.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } }); await db.wishlistItem.upsert({ where: { wishlistId_productId: { wishlistId: wishlist.id, productId: product.id } }, update: {}, create: { wishlistId: wishlist.id, productId: product.id } }); return success({}); }
