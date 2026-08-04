"use client";

import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2, User, Building2, MapPin, AlertCircle, RefreshCw } from "lucide-react";

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data || []);
    } catch (e) {
      console.error("Failed to load agenda", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card flex items-center justify-between">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
            Planning & Relances
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Agenda Commercial</h2>
          <p className="text-xs text-slate-500">
            Gestion des rendez-vous clients, visioconférences et rappels téléphoniques.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Appointment List Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Aucun rendez-vous programmé</p>
          <p className="text-xs text-slate-500">Allez dans la fiche d'un prospect pour programmer un rendez-vous.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    {apt.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{apt.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{apt.prospect?.name}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                  {apt.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-900">
                    {new Date(apt.startTime).toLocaleString("fr-FR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{apt.prospect?.city || "Antananarivo"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Commercial : {apt.user?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
