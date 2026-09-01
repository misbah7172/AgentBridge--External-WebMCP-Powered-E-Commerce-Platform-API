import { authRequired, requireUser } from "@/lib/auth/guard";
import { success } from "@/lib/api";
import { cancelOrder } from "@/lib/services/orders";
import { serviceFailure } from "@/lib/route-errors";
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) { const user = await requireUser(); if (!user) return authRequired(); try { return success(await cancelOrder(user.id, (await params).id)); } catch (error) { return serviceFailure(error); } }
