"use client";

import React, { useEffect, useState } from "react";
import { UserCheck, Search, Phone, Mail, MapPin, Calendar, Star, Building2, Eye, RefreshCw } from "lucide-react";
import { ProspectDetailModal } from "@/components/prospects/ProspectDetailModal";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
            Portefeuille Clients Signés
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Gestion des Clients Madagascar</h2>
          <p className="text-xs text-slate-500">
            Historique intégral de prospection conservé après la conversion du prospect.
          </p>
        </div>

        <button
          onClick={fetchClients}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un client converti par nom, ville, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Clients Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
          <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Aucun client converti actuellement</p>
          <p className="text-xs text-slate-500">
            Convertissez vos prospects qualifiés en cliquant sur "Convertir en Client" dans la fiche prospect.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                    Client Actif
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors mt-1">
                    {client.name}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">{client.category}</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-900">{client.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.city}</span>
                </p>
                {client.convertedAt && (
                  <p className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Converti le {new Date(client.convertedAt).toLocaleDateString("fr-FR")}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
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
