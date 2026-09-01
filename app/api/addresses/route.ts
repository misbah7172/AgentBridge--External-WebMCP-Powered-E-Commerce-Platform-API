import { authRequired, requireUser } from "@/lib/auth/guard";
import { failure, success } from "@/lib/api";
import { db } from "@/lib/db";
import { addressSchema } from "@/lib/validation/commerce";
export async function GET() { const user = await requireUser(); return user ? success({ addresses: await db.address.findMany({ where: { userId: user.id }, orderBy: [{ isDefault: "desc" }, { id: "asc" }] }) }) : authRequired(); }
export async function POST(request: Request) { const user = await requireUser(); if (!user) return authRequired(); const input = addressSchema.safeParse(await request.json()); if (!input.success) return failure("VALIDATION_ERROR", "Invalid address.", 422); if (input.data.isDefault) await db.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } }); const address = await db.address.create({ data: { ...input.data, userId: user.id, isDefault: input.data.isDefault ?? (await db.address.count({ where: { userId: user.id } })) === 0 } }); return success({ address }, 201); }
