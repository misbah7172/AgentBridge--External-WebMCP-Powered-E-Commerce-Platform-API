import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AdminProductForm } from "@/components/admin-product-form";
export const dynamic = "force-dynamic";
export default async function AdminPage() { const user = await currentUser(); if (user?.role !== "ADMIN") redirect("/account"); const categories = await db.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }); return <main className="mx-auto max-w-4xl px-6 py-12"><Link href="/account" className="text-sm text-slate-500">← Account</Link><h1 className="mt-2 text-4xl font-bold">Administration</h1><p className="mt-3 text-slate-600">Manage the development catalog. Orders are available through the protected admin API.</p><div className="mt-10"><AdminProductForm categories={categories} /></div></main>; }
