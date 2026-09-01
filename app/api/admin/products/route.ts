import { adminRequired, requireAdmin } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { db } from "@/lib/db";
import { productCreateSchema } from "@/lib/validation/commerce";
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export async function POST(request: Request) { const admin = await requireAdmin(); if (!admin) return adminRequired(); const input = productCreateSchema.safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "Invalid product information.", 422); const slug = `${slugify(input.data.name)}-${Date.now().toString(36)}`; const product = await db.product.create({ data: { ...input.data, slug, images: input.data.imageUrl ? { create: { url: input.data.imageUrl, alt: input.data.name } } : undefined } }); return success({ product: { ...product, price: Number(product.price), rating: Number(product.rating) } }, 201); }
