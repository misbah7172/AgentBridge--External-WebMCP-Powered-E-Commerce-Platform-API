import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { z } from "zod";
import type { productQuerySchema } from "@/lib/validation/products";

type ProductQuery = z.infer<typeof productQuerySchema>;
const baseInclude = { category: true, images: { orderBy: { position: "asc" as const }, take: 1 }, variants: { select: { id: true, sku: true, price: true, stock: true, attributes: true } } };
export const productDto = (product: any) => ({ ...product, price: Number(product.price), compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null, rating: Number(product.rating), variants: product.variants?.map((variant: any) => ({ ...variant, price: variant.price ? Number(variant.price) : null })) });

export async function searchProducts(query: ProductQuery) {
  const where: Prisma.ProductWhereInput = { AND: [] };
  const filters = where.AND as Prisma.ProductWhereInput[];
  if (query.q) filters.push({ OR: [{ name: { contains: query.q, mode: "insensitive" } }, { brand: { contains: query.q, mode: "insensitive" } }, { description: { contains: query.q, mode: "insensitive" } }] });
  if (query.category) filters.push({ category: { slug: query.category.toLowerCase() } });
  if (query.brand) filters.push({ brand: { equals: query.brand, mode: "insensitive" } });
  if (query.minPrice !== undefined || query.maxPrice !== undefined) filters.push({ price: { gte: query.minPrice, lte: query.maxPrice } });
  if (query.minRating !== undefined) filters.push({ rating: { gte: query.minRating } });
  if (query.availability === "in_stock") filters.push({ stock: { gt: 0 } });
  const orderBy: Prisma.ProductOrderByWithRelationInput = query.sort === "price_asc" ? { price: "asc" } : query.sort === "price_desc" ? { price: "desc" } : query.sort === "rating" ? { rating: "desc" } : query.sort === "newest" ? { createdAt: "desc" } : query.sort === "popularity" ? { reviewCount: "desc" } : { createdAt: "desc" };
  const [products, total] = await db.$transaction([db.product.findMany({ where, orderBy, skip: (query.page - 1) * query.limit, take: query.limit, include: baseInclude }), db.product.count({ where })]);
  return { products: products.map(productDto), pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
}

export async function getProduct(idOrSlug: string) {
  const product = await db.product.findFirst({ where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] }, include: { category: true, images: { orderBy: { position: "asc" } }, variants: true } });
  if (!product) return null;
  const related = await db.product.findMany({ where: { categoryId: product.categoryId, id: { not: product.id } }, take: 4, orderBy: { rating: "desc" }, include: baseInclude });
  return { product: productDto(product), variants: product.variants.map((variant) => ({ ...variant, price: variant.price ? Number(variant.price) : null })), stock: product.stock, reviews: [], relatedProducts: related.map(productDto) };
}

export async function recommendations(category?: string, brand?: string) { return searchProducts({ page: 1, limit: 8, sort: "popularity", ...(category ? { category } : {}), ...(brand ? { brand } : {}) }); }
