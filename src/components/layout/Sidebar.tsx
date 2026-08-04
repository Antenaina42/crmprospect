"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  MapPin,
  Users,
  Calendar,
  FileText,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  BookOpen,
  MessageSquareCode,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Google Maps Places", href: "/google-maps", icon: MapPin, badge: "API" },
  { name: "Gestion Prospects", href: "/prospects", icon: Users },
  { name: "Scripts de Vente (MG)", href: "/scripts-vente", icon: MessageSquareCode, badge: "Pitch" },
  { name: "Agenda & Rappels", href: "/agenda", icon: Calendar },
  { name: "Devis Commercial", href: "/devis", icon: FileText },
  { name: "Portefeuille Clients", href: "/clients", icon: UserCheck },
  { name: "Statistiques & Analytics", href: "/statistiques", icon: BarChart3 },
  { name: "Paramètres CRM", href: "/parametres", icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "COMMERCIAL";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200/80 z-30 flex flex-col justify-between shadow-sm">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-base tracking-tight">Prospect Mada</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                CRM
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">M-IT Level Up</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            if (item.adminOnly && userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
              return null;
            }

            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-brand-600 bg-brand-50/80 font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-brand-600" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-brand-600 rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs overflow-hidden border border-slate-200">
              {session?.user?.name ? session.user.name.charAt(0) : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {session?.user?.name || "Utilisateur"}
              </p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-600" />
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  {userRole}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Se déconnecter"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
