import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const password = process.env.SEED_CUSTOMER_PASSWORD;

async function main() {
  if (!password) throw new Error("SEED_CUSTOMER_PASSWORD must be set before creating a development user.");
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.upsert({ where: { email: "customer@example.com" }, update: {}, create: { email: "customer@example.com", name: "Demo Customer", passwordHash, role: UserRole.CUSTOMER } });
  console.log("Created the AgentBridge development customer account.");
}

main().then(() => db.$disconnect()).catch(async (error) => { console.error(error); await db.$disconnect(); process.exit(1); });
