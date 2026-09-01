import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const COOKIE_NAME = "agentbridge_session";
const SESSION_DAYS = 14;
const hash = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await db.session.create({ data: { userId, tokenHash: hash(token), expiresAt } });
  const store = await cookies();
  store.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires: expiresAt, path: "/" });
}

export async function destroySession() {
  const store = await cookies(); const token = store.get(COOKIE_NAME)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: hash(token) } });
  store.set(COOKIE_NAME, "", { httpOnly: true, expires: new Date(0), path: "/" });
}

export async function currentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash: hash(token) }, include: { user: { select: { id: true, email: true, name: true, role: true } } } });
  if (!session || session.expiresAt <= new Date()) { if (session) await db.session.delete({ where: { id: session.id } }); return null; }
  return session.user;
}
