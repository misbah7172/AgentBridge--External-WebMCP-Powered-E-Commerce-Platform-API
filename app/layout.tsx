import type { Metadata } from "next";
import "./globals.css";
import { StoreHeader } from "@/components/store-header";

export const metadata: Metadata = { title: "AgentBridge", description: "Technology selected for everyday work." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><StoreHeader />{children}</body></html>;
}
