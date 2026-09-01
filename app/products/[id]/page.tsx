import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/services/products";
import { AddToCart } from "@/components/add-to-cart";
export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) { const item = await getProduct((await params).id); if (!item) notFound(); const { product } = item; return <main className="mx-auto max-w-5xl px-6 py-12"><Link href="/products" className="text-sm text-slate-500">← Products</Link><div className="mt-8 grid gap-10 md:grid-cols-2"><div className="aspect-square rounded-lg bg-slate-200" /><section><p className="text-sm text-slate-500">{product.brand} · {product.category.name}</p><h1 className="mt-2 text-4xl font-bold">{product.name}</h1><p className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</p><p className="mt-6 leading-7 text-slate-600">{product.description}</p><p className="mt-4 text-sm">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p><AddToCart productId={product.id} disabled={product.stock === 0} /></section></div></main>; }
