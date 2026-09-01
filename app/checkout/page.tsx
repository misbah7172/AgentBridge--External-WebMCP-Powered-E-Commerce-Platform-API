import Link from "next/link";
import { CheckoutView } from "@/components/checkout-view";
export default function CheckoutPage() { return <main className="mx-auto max-w-2xl px-6 py-12"><Link href="/cart" className="text-sm text-slate-500">← Cart</Link><h1 className="mt-2 text-4xl font-bold">Checkout</h1><div className="mt-10"><CheckoutView /></div></main>; }
