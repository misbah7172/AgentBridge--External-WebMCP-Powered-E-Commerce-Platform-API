import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { checkout } from "@/lib/services/orders";
import { serviceFailure } from "@/lib/route-errors";
import { checkoutSchema } from "@/lib/validation/commerce";
export async function POST(request: Request) { const user = await requireUser(); if (!user) return authRequired(); const input = checkoutSchema.safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "A delivery address is required.", 422); try { return success(await checkout(user.id, input.data.addressId), 201); } catch (error) { return serviceFailure(error); } }
