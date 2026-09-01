import { adminRequired, requireAdmin } from "@/lib/auth/guard";
import { success } from "@/lib/api";
import { db } from "@/lib/db";
export async function GET() { const admin = await requireAdmin(); if (!admin) return adminRequired(); const orders = await db.order.findMany({ include: { user: { select: { email: true, name: true } }, items: true }, orderBy: { createdAt: "desc" }, take: 100 }); return success({ orders: orders.map((order) => ({ ...order, subtotal: Number(order.subtotal), discount: Number(order.discount), shipping: Number(order.shipping), total: Number(order.total) })) }); }
