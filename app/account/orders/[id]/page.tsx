import Link from "next/link";
import { currentUser } from "@/lib/auth/session";
import { getOrder } from "@/lib/services/orders";
import { notFound, redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) { const user = await currentUser(); if (!user) redirect("/login"); const order = await getOrder(user.id, (await params).id); if (!order) notFound(); return <main className="mx-auto max-w-4xl px-6 py-12"><Link href="/account/orders" className="text-sm text-slate-500">← Orders</Link><h1 className="mt-2 text-4xl font-bold">Order {order.id.slice(-8)}</h1><p className="mt-3 text-slate-600">Status: {order.status}</p><div className="mt-8 rounded border bg-white p-6"><div className="space-y-3">{order.items.map((item: { id: string; name: string; quantity: number; unitPrice: number }) => <div key={item.id} className="flex justify-between"><span>{item.name} × {item.quantity}</span><span>${(item.unitPrice * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-6 border-t pt-4 font-semibold">Total: ${order.total.toFixed(2)}</div></div></main>; }
