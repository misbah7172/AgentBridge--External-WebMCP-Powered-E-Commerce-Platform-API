import Link from "next/link";
import { AddressView } from "@/components/address-view";
export default function AddressesPage() { return <main className="mx-auto max-w-3xl px-6 py-12"><Link href="/account" className="text-sm text-slate-500">← Account</Link><h1 className="mt-2 text-4xl font-bold">Addresses</h1><div className="mt-10"><AddressView /></div></main>; }
