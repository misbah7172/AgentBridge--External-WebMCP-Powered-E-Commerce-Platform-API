import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { failure, success } from "@/lib/api";
import { createSession } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) { try { const input = registerSchema.parse(await request.json()); const exists = await db.user.findUnique({ where: { email: input.email } }); if (exists) return failure("EMAIL_IN_USE", "An account already exists for this email.", 409); const user = await db.user.create({ data: { ...input, passwordHash: await bcrypt.hash(input.password, 12) }, select: { id: true, email: true, name: true, role: true } }); await createSession(user.id); return success({ user }, 201); } catch { return failure("VALIDATION_ERROR", "Please provide a valid name, email, and password.", 422); } }
