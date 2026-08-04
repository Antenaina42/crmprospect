"use client";

import React, { useEffect, useState } from "react";
import {
  UserCheck,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Building2,
  Eye,
  RefreshCw,
  Wrench,
  CheckCircle2,
  Clock,
  User,
  ExternalLink,
} from "lucide-react";
import { ProspectDetailModal } from "@/components/prospects/ProspectDetailModal";

const TECH_STATUSES = [
  "À contacter par Technicien",
  "Brief Technique Effectué",
  "En Développement Web (M-IT Level Up)",
  "Recettage & Test",
  "Projet Livré au Client",
];

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "tech">("all");
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [techStatuses, setTechStatuses] = useState<Record<string, string>>({});

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prospects?isClient=true&search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setClients(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const handleUpdateTechStatus = (clientId: string, status: string) => {
    setTechStatuses((prev) => ({ ...prev, [clientId]: status }));
  };

  const filteredClients =
    activeTab === "tech"
      ? clients.filter((c) => (techStatuses[c.id] || "À contacter par Technicien") !== "Projet Livré au Client")
      : clients;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
              Portefeuille Signé M-IT Level Up
            </span>
            <span className="text-xs text-slate-400 font-medium">Espace Techniciens & Developpeurs</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clients Signés & Prise en Charge Technique</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi du transfert des clients signés par les commerciaux vers l'équipe technique M-IT Level Up.
          </p>
        </div>

        <button
          onClick={fetchClients}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Navigation Tabs (Tous les Clients / Passation Techniciens) */}
      <div className="px-6 py-2 bg-white border border-slate-200/80 rounded-2xl shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-3 rounded-xl transition-colors ${
              activeTab === "all"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tous les Clients Signés ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab("tech")}
            className={`py-2 px-3 rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === "tech"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Onglet Techniciens : En cours de contact / Déjà Signés ({filteredClients.length})</span>
          </button>
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrer client, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Clients Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Aucun client trouvé dans cette vue</p>
          <p className="text-xs text-slate-500">
            Convertissez vos prospects qualifiés en cliquant sur "Convertir en Client" dans la fiche prospect.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const currentTechStatus = techStatuses[client.id] || "À contacter par Technicien";

            return (
              <div
                key={client.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                        Client Signé (1.500.000 Ar+)
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{client.name}</h4>
                      <span className="text-xs text-slate-400 font-medium">{client.category}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <p className="flex items-center gap-2 font-semibold text-slate-900">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{client.city}</span>
                    </p>
                    {client.decisionMaker && (
                      <p className="flex items-center gap-2 text-slate-500">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Responsable : {client.decisionMaker}</span>
                      </p>
                    )}
                    {client.convertedAt && (
                      <p className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Signé le {new Date(client.convertedAt).toLocaleDateString("fr-FR")}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Technicians Action Status Control */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <label className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                    <Wrench className="w-3 h-3" />
                    <span>Statut Prise en Charge Technicien :</span>
                  </label>
                  <select
                    value={currentTechStatus}
                    onChange={(e) => handleUpdateTechStatus(client.id, e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {TECH_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedClient(client)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Consulter la Fiche & Brief Client</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedClient && (
        <ProspectDetailModal
          prospect={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdate={() => fetchClients()}
        />
      )}
    </div>
  );
}
