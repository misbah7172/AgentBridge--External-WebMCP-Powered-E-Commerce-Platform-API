import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function RegisterPage() { return <main className="mx-auto max-w-md px-6 py-20"><Link href="/" className="font-bold">AgentBridge</Link><h1 className="mt-10 text-3xl font-bold">Create your account</h1><p className="mt-2 text-slate-600">Save products, addresses, and order history.</p><AuthForm mode="register" /><p className="mt-6 text-sm text-slate-600">Already have an account? <Link className="font-medium underline" href="/login">Sign in</Link></p></main>; }
