import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { db } from "@/lib/db";
import { addressSchema } from "@/lib/validation/commerce";
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const user = await requireUser(); if (!user) return authRequired(); const input = addressSchema.partial().safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "Invalid address.", 422); const result = await db.address.updateMany({ where: { id: (await params).id, userId: user.id }, data: input.data }); return result.count ? success({}) : failure("ADDRESS_NOT_FOUND", "Address was not found.", 404); }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const user = await requireUser(); if (!user) return authRequired(); const result = await db.address.deleteMany({ where: { id: (await params).id, userId: user.id } }); return result.count ? success({}) : failure("ADDRESS_NOT_FOUND", "Address was not found.", 404); }
