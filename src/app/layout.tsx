import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CRM Prospect M-It LevelUp | Prospection Commerciale B2B Madagascar",
  description:
    "Solution SaaS moderne de prospection commerciale et de gestion des prospects à Madagascar via l'API Google Places - M-IT Level Up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        <NextAuthProvider>
          <QueryProvider>
            <AppLayout>{children}</AppLayout>
          </QueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
