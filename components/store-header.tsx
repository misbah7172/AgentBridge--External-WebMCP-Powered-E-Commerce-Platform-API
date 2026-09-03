import Link from "next/link";
import { currentUser } from "@/lib/auth/session";
import { LogoutButton } from "@/components/logout-button";

export async function StoreHeader() {
  const user = await currentUser();
  return <header className="border-b bg-white"><nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4"><Link href="/" className="text-xl font-bold tracking-tight">AgentBridge</Link><div className="flex items-center gap-4 text-sm"><Link href="/products">Products</Link><Link href="/search">Search</Link><Link href="/wishlist">Wishlist</Link><Link href="/cart">Cart</Link>{user ? <><Link href="/account">Account</Link><LogoutButton /></> : <Link className="rounded bg-slate-900 px-3 py-1.5 font-medium text-white" href="/login">Sign in</Link>}</div></nav></header>;
}
