"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Calendar,
  MessageSquareCode,
} from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-50">{children}</main>;
  }

  const mobileBottomNav = [
    { name: "Accueil", href: "/dashboard", icon: LayoutDashboard },
    { name: "Prospects", href: "/prospects", icon: Users },
    { name: "Maps", href: "/google-maps", icon: MapPin },
    { name: "Scripts", href: "/scripts-vente", icon: MessageSquareCode },
    { name: "Agenda", href: "/agenda", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col lg:flex-row">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-w-0 min-h-screen">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Content Area with bottom padding on mobile for navbar */}
        <main className="p-3.5 sm:p-6 pb-24 lg:pb-6 flex-1 overflow-x-hidden">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Smartphones & Tablets) */}
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around z-30 lg:hidden shadow-lg">
          {mobileBottomNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition-all ${
                  isActive
                    ? "text-brand-600 font-extrabold bg-brand-50/80"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-brand-600 scale-110" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
