import Link from "next/link";
import { WishlistView } from "@/components/wishlist-view";
export default function WishlistPage() { return <main className="mx-auto max-w-6xl px-6 py-12"><Link href="/" className="text-sm text-slate-500">AgentBridge</Link><h1 className="mt-2 text-4xl font-bold">Wishlist</h1><div className="mt-10"><WishlistView /></div></main>; }
