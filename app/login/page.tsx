import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() { return <main className="mx-auto max-w-md px-6 py-20"><Link href="/" className="font-bold">AgentBridge</Link><h1 className="mt-10 text-3xl font-bold">Welcome back</h1><p className="mt-2 text-slate-600">Sign in to manage your purchases.</p><AuthForm mode="login" /><p className="mt-6 text-sm text-slate-600">New to AgentBridge? <Link className="font-medium underline" href="/register">Create an account</Link></p></main>; }
