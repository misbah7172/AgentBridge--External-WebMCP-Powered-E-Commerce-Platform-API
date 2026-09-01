import { authRequired, requireUser } from "@/lib/auth/guard";
import { success } from "@/lib/api";
import { db } from "@/lib/db";
export async function GET() { const user = await requireUser(); if (!user) return authRequired(); const wishlist = await db.wishlist.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id }, include: { items: { include: { product: { include: { images: { take: 1 } } } } } } }); return success({ items: wishlist.items.map((item) => ({ id: item.id, product: { ...item.product, price: Number(item.product.price), rating: Number(item.product.rating) } })) }); }
