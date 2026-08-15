"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  UserPlus,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const breadcrumbMap: Record<string, string> = {
  dashboard: "Tableau de Bord",
  "google-maps": "Prospection Google Maps",
  prospects: "Gestion des Prospects",
  "scripts-vente": "Scripts Téléphoniques (MG)",
  agenda: "Agenda & Rappels",
  devis: "Devis Commercial",
  clients: "Portefeuille Clients",
  statistiques: "Statistiques & Analytics",
  parametres: "Paramètres CRM",
};

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu = () => {} }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const paths = pathname.split("/").filter(Boolean);
  const currentTitle = breadcrumbMap[paths[0]] || "CRM Prospect M-It LevelUp";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/prospects?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  const sampleNotifications = [
    {
      id: "1",
      title: "Rendez-vous aujourd'hui",
      message: "Démonstration avec Établissement Scolaire Saint-Michel",
      time: "Il y a 15 min",
      type: "APPOINTMENT",
    },
    {
      id: "2",
      title: "Nouveau prospect importé",
      message: "100 écoles importées depuis Google Places",
      time: "Il y a 1 heure",
      type: "PROSPECT",
    },
  ];

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-2">
      {/* Left: Mobile Hamburger & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden shrink-0"
          title="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 min-w-0 truncate">
          <span className="text-xs font-bold text-brand-600 hidden sm:inline shrink-0">M-It LevelUp</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline shrink-0" />
          <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{currentTitle}</h1>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Desktop Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher nom, tel, ville..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 lg:w-64 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </form>

        {/* Mobile Search Toggle Icon */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl md:hidden"
          title="Rechercher"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-modal border border-slate-200 p-4 z-50"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    2 Nouvelles
                  </span>
                </div>
                <div className="space-y-3 mt-3">
                  {sampleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors flex gap-3 items-start cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-brand-100 text-brand-700 shrink-0">
                        {notif.type === "APPOINTMENT" ? (
                          <Calendar className="w-3.5 h-3.5" />
                        ) : (
                          <UserPlus className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => router.push("/google-maps")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Trouver des Prospects</span>
          <span className="sm:hidden">Prospecter</span>
        </button>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-16 bg-white border-b border-slate-200 p-3 shadow-md md:hidden z-30">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Recherche instantanée : nom, tel, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-brand-600 text-white text-[11px] font-bold rounded-lg"
            >
              OK
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
