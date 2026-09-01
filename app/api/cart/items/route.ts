import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { addCartItem } from "@/lib/services/cart";
import { serviceFailure } from "@/lib/route-errors";
import { cartItemSchema } from "@/lib/validation/commerce";
export async function POST(request: Request) { const user = await requireUser(); if (!user) return authRequired(); const input = cartItemSchema.safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "Invalid cart item.", 422); try { return success(await addCartItem(user.id, input.data), 201); } catch (error) { return serviceFailure(error); } }
