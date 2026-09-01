import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { applyCoupon } from "@/lib/services/cart";
import { serviceFailure } from "@/lib/route-errors";
import { couponSchema } from "@/lib/validation/commerce";
export async function POST(request: Request) { const user = await requireUser(); if (!user) return authRequired(); const input = couponSchema.safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "Invalid coupon code.", 422); try { return success(await applyCoupon(user.id, input.data.code)); } catch (error) { return serviceFailure(error); } }
