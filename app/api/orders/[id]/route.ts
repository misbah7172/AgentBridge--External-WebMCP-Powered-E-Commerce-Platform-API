import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { getOrder } from "@/lib/services/orders";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const user = await requireUser(); if (!user) return authRequired(); const order = await getOrder(user.id, (await params).id); return order ? success({ order }) : failure("ORDER_NOT_FOUND", "Order was not found.", 404); }
