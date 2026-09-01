import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { removeCartItem, updateCartItem } from "@/lib/services/cart";
import { serviceFailure } from "@/lib/route-errors";
import { cartUpdateSchema } from "@/lib/validation/commerce";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const user = await requireUser(); if (!user) return authRequired(); const input = cartUpdateSchema.safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "Invalid quantity.", 422); try { return success(await updateCartItem(user.id, (await params).id, input.data.quantity)); } catch (error) { return serviceFailure(error); } }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const user = await requireUser(); if (!user) return authRequired(); try { return success(await removeCartItem(user.id, (await params).id)); } catch (error) { return serviceFailure(error); } }
