import { authRequired, requireUser } from "@/lib/auth/guard";
import { success } from "@/lib/api";
import { db } from "@/lib/db";
export async function DELETE(_: Request, { params }: { params: Promise<{ productId: string }> }) { const user = await requireUser(); if (!user) return authRequired(); const wishlist = await db.wishlist.findUnique({ where: { userId: user.id } }); if (wishlist) await db.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId: (await params).productId } }); return success({}); }
