import { authRequired, requireUser } from "@/lib/auth/guard";
import { success } from "@/lib/api";
import { clearCart, getCart } from "@/lib/services/cart";
export async function GET() { const user = await requireUser(); return user ? success(await getCart(user.id)) : authRequired(); }
export async function DELETE() { const user = await requireUser(); return user ? success(await clearCart(user.id)) : authRequired(); }
