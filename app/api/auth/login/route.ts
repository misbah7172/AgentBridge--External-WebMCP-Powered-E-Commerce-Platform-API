import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { failure, success } from "@/lib/api";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) { try { const input = loginSchema.parse(await request.json()); const user = await db.user.findUnique({ where: { email: input.email } }); if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return failure("INVALID_CREDENTIALS", "Email or password is incorrect.", 401); await createSession(user.id); return success({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }); } catch { return failure("VALIDATION_ERROR", "Please provide a valid email and password.", 422); } }
