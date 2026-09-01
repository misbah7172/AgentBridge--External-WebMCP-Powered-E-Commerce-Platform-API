import Link from "next/link";
import { currentUser } from "@/lib/auth/session";
import { getOrders } from "@/lib/services/orders";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function OrdersPage() { const user = await currentUser(); if (!user) redirect("/login"); const orders = await getOrders(user.id); return <main className="mx-auto max-w-4xl px-6 py-12"><Link href="/account" className="text-sm text-slate-500">← Account</Link><h1 className="mt-2 text-4xl font-bold">Orders</h1><div className="mt-10 space-y-3">{orders.length === 0 ? <p className="text-slate-600">You have not placed an order yet.</p> : orders.map((order) => <Link key={order.id} href={`/account/orders/${order.id}`} className="block rounded border bg-white p-5"><div className="flex justify-between"><span className="font-semibold">Order {order.id.slice(-8)}</span><span>{order.status}</span></div><p className="mt-2 text-sm text-slate-600">{order.items.length} item(s) · ${order.total.toFixed(2)}</p></Link>)}</div></main>; }
