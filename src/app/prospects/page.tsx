"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Eye,
  Plus,
  RefreshCw,
  UserCheck,
  Building2,
  ChevronDown,
  Download,
  Flame,
  Star,
  CheckCircle2,
  ShieldCheck,
  User,
  PhoneCall,
  MessageCircle,
} from "lucide-react";
import { ProspectDetailModal } from "@/components/prospects/ProspectDetailModal";

const STATUS_BADGE_COLORS: Record<string, string> = {
  Nouveau: "bg-blue-50 text-blue-700 border-blue-200",
  "À contacter": "bg-sky-50 text-sky-700 border-sky-200",
  Contacté: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "En discussion": "bg-purple-50 text-purple-700 border-purple-200",
  Intéressé: "bg-amber-50 text-amber-700 border-amber-200 font-bold",
  "Devis envoyé": "bg-violet-50 text-violet-700 border-violet-200 font-bold",
  "À rappeler": "bg-orange-50 text-orange-700 border-orange-200",
  "Rendez-vous fixé": "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold",
  Client: "bg-green-600 text-white font-bold shadow-xs",
  Refusé: "bg-red-50 text-red-700 border-red-200",
  Injoignable: "bg-slate-100 text-slate-600 border-slate-200",
};

const PRIORITY_BADGE_COLORS: Record<string, string> = {
  Faible: "text-slate-500 bg-slate-100",
  Moyenne: "text-blue-700 bg-blue-50",
  Haute: "text-amber-700 bg-amber-50 font-bold",
  Urgente: "text-rose-700 bg-rose-50 font-bold animate-pulse",
};

function ProspectsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const { data: session } = useSession();

  const userRole = (session?.user as any)?.role || "COMMERCIAL";
  const isSuperAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";
  const currentUserName = session?.user?.name || "Commercial";

  const [prospects, setProspects] = useState<any[]>([]);
  const [commercials, setCommercials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState<any | null>(null);

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [city, setCity] = useState("");
  const [commercialId, setCommercialId] = useState("");

  // Fetch list of commercials for Super Admin filter
  useEffect(() => {
    if (isSuperAdmin) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.users)) {
            setCommercials(data.users);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [isSuperAdmin]);

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        isClient: "false",
        search,
        status,
        priority,
        city,
      });

      if (isSuperAdmin && commercialId) {
        queryParams.set("commercialId", commercialId);
      }

      const res = await fetch(`/api/prospects?${queryParams}`);
      const data = await res.json();
      setProspects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load prospects", e);
      setProspects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, [status, priority, city, commercialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProspects();
  };

  const safeProspectsList = Array.isArray(prospects) ? prospects : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isSuperAdmin ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                <span>Super Admin : Vue Globale ({safeProspectsList.length} prospects)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1">
                <User className="w-3 h-3 text-brand-600" />
                <span>Mon Portefeuille : {currentUserName} ({safeProspectsList.length} prospects)</span>
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Madagascar</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {isSuperAdmin ? "Gestion de Tous les Prospects (Super Admin)" : "Mes Prospects Commerciaux"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSuperAdmin
              ? "Supervision complète de tous les prospects attribués aux différents commerciaux."
              : "Appels directs, historique et opportunités de vente."}
          </p>
        </div>

        <button
          onClick={fetchProspects}
          className="self-start sm:self-auto px-3.5 py-1.5 sm:px-4 sm:py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-3 sm:p-4 bg-white border border-slate-200/80 rounded-2xl shadow-card flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3"
      >
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Nom, téléphone, ville, responsable..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Super Admin filter by Commercial */}
          {isSuperAdmin && (
            <select
              value={commercialId}
              onChange={(e) => setCommercialId(e.target.value)}
              className="px-3 py-2 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Tous les Commerciaux</option>
              {commercials.map((comm) => (
                <option key={comm.id} value={comm.id}>
                  {comm.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-2.5 sm:px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Tous les Statuts</option>
            <option value="Nouveau">Nouveau</option>
            <option value="À contacter">À contacter</option>
            <option value="Contacté">Contacté</option>
            <option value="En discussion">En discussion</option>
            <option value="Intéressé">Intéressé</option>
            <option value="Devis envoyé">Devis envoyé</option>
            <option value="À rappeler">À rappeler</option>
            <option value="Rendez-vous fixé">Rendez-vous fixé</option>
            <option value="Refusé">Refusé</option>
            <option value="Injoignable">Injoignable</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-2.5 sm:px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Priorités</option>
            <option value="Faible">Faible</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
            <option value="Urgente">Urgente</option>
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-2.5 sm:px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Villes</option>
            <option value="Antananarivo">Antananarivo</option>
            <option value="Toamasina">Toamasina</option>
            <option value="Antsirabe">Antsirabe</option>
            <option value="Mahajanga">Mahajanga</option>
            <option value="Fianarantsoa">Fianarantsoa</option>
            <option value="Antsiranana">Antsiranana</option>
            <option value="Toliara">Toliara</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs ml-auto sm:ml-0"
          >
            Filtrer
          </button>
        </div>
      </form>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-card">
          <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        </div>
      ) : safeProspectsList.length === 0 ? (
        <div className="text-center py-16 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-card">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Aucun prospect trouvé</p>
          <p className="text-xs text-slate-500 mt-1">
            {isSuperAdmin
              ? "Aucun prospect ne correspond à vos critères."
              : "Vous n'avez pas encore de prospect. Utilisez l'onglet Google Maps pour en ajouter."}
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (< md) : Interactive Touch Cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {safeProspectsList.map((prospect) => {
              const cleanPhone = (prospect.phone || "").replace(/[^\d+]/g, "");
              const waNumber = cleanPhone.replace("+", "");

              return (
                <div
                  key={prospect.id}
                  onClick={() => setSelectedProspect(prospect)}
                  className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs active:scale-[0.99] transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div>
                    {/* Top Row: Name, Status & Category */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">
                          {prospect.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {prospect.category} • {prospect.city}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                          STATUS_BADGE_COLORS[prospect.status] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {prospect.status}
                      </span>
                    </div>

                    {/* Address & Commercial */}
                    <div className="text-xs text-slate-600 space-y-1 my-2">
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{prospect.address || prospect.city}</span>
                      </p>
                      {isSuperAdmin && (
                        <p className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded w-fit">
                          👤 {prospect.assignedTo?.name || "Non attribué"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 1-Tap Field Action Buttons for Commercials */}
                  <div
                    className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Call Button (tel:) */}
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Appeler</span>
                    </a>

                    {/* WhatsApp Button */}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WA</span>
                      </a>
                    )}

                    {/* Details Modal Button */}
                    <button
                      onClick={() => setSelectedProspect(prospect)}
                      className="py-2 px-3 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Fiche</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP VIEW (>= md) : Full Responsive Table */}
          <div className="hidden md:block bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Entreprise & Secteur</th>
                    <th className="py-3.5 px-4">Contact Direct</th>
                    <th className="py-3.5 px-4">Ville</th>
                    <th className="py-3.5 px-4">Statut Commercial</th>
                    <th className="py-3.5 px-4">Priorité</th>
                    <th className="py-3.5 px-4">Commercial Attribué</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {safeProspectsList.map((prospect) => (
                    <tr
                      key={prospect.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedProspect(prospect)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {prospect.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {prospect.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{prospect.phone}</div>
                        {prospect.email && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {prospect.email}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">{prospect.city}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border ${
                            STATUS_BADGE_COLORS[prospect.status] || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {prospect.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            PRIORITY_BADGE_COLORS[prospect.priority] || "text-slate-600 bg-slate-100"
                          }`}
                        >
                          {prospect.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-brand-500" />
                          <span>{prospect.assignedTo?.name || "Non attribué"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedProspect(prospect)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Fiche</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Prospect Detail Drawer */}
      {selectedProspect && (
        <ProspectDetailModal
          prospect={selectedProspect}
          onClose={() => setSelectedProspect(null)}
          onUpdate={() => fetchProspects()}
        />
      )}
    </div>
  );
}

export default function ProspectsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      }
    >
      <ProspectsContent />
    </Suspense>
  );
}
