import { authRequired, requireUser } from "@/lib/auth/guard";
import { success } from "@/lib/api";
import { getOrders } from "@/lib/services/orders";
export async function GET() { const user = await requireUser(); return user ? success({ orders: await getOrders(user.id) }) : authRequired(); }
