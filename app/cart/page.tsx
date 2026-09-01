import Link from "next/link";
import { CartView } from "@/components/cart-view";
export default function CartPage() { return <main className="mx-auto max-w-6xl px-6 py-12"><Link href="/" className="text-sm text-slate-500">AgentBridge</Link><h1 className="mt-2 text-4xl font-bold">Shopping cart</h1><div className="mt-10"><CartView /></div></main>; }
