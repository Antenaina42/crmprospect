"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  UserCheck,
  Calendar,
  FileText,
  Clock,
  Plus,
  Building2,
  Star,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  History,
  Tag,
  Shield,
  PhoneCall,
  Flame,
  MessageSquareCode,
  Copy,
  Check,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProspectDetailModalProps {
  prospect: any;
  onClose: () => void;
  onUpdate: () => void;
}

const STATUSES = [
  "Nouveau",
  "À contacter",
  "Contacté",
  "En discussion",
  "Intéressé",
  "Devis envoyé",
  "À rappeler",
  "Rendez-vous fixé",
  "Client",
  "Refusé",
  "Injoignable",
];

const PRIORITIES = ["Faible", "Moyenne", "Haute", "Urgente"];

export function ProspectDetailModal({ prospect, onClose, onUpdate }: ProspectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "script" | "calls" | "appointments">(
    "overview"
  );
  const [status, setStatus] = useState(prospect.status);
  const [priority, setPriority] = useState(prospect.priority);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Call form state
  const [callDuration, setCallDuration] = useState("120");
  const [callResult, setCallResult] = useState("Interesse");
  const [callNotes, setCallNotes] = useState("");
  const [submittingCall, setSubmittingCall] = useState(false);

  // Appointment form state
  const [aptTitle, setAptTitle] = useState("Rendez-vous Présentation Produit");
  const [aptDate, setAptDate] = useState("");
  const [aptType, setAptType] = useState("Rendez-vous");
  const [submittingApt, setSubmittingApt] = useState(false);

  // Quick Status Save
  const handleQuickStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      await fetch("/api/prospects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prospect.id, status: newStatus }),
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority);
    setSaving(true);
    try {
      await fetch("/api/prospects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prospect.id, priority: newPriority }),
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToClient = async () => {
    setSaving(true);
    try {
      await fetch("/api/prospects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: prospect.id, status: "Client", isClient: true }),
      });
      onUpdate();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCall(true);
    try {
      await fetch("/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId: prospect.id,
          duration: callDuration,
          result: callResult,
          notes: callNotes,
        }),
      });
      setCallNotes("");
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingCall(false);
    }
  };

  const handleScheduleApt = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingApt(true);
    try {
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectId: prospect.id,
          title: aptTitle,
          startTime: aptDate || new Date(Date.now() + 86400000).toISOString(),
          type: aptType,
        }),
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingApt(false);
    }
  };

  // Malagasy Pitch customized for this specific prospect (2-Tier Strategy)
  const malagasyPitchText = `Manao ahoana tompoko, ${prospect.decisionMaker || "Responsable"} ao amin'ny ${prospect.name} ve izao? 

Rakoto avy amin'ny agence M-IT Level Up (https://m-itlevelup.com/) aho. 

1️⃣ OFFRE PRINCIPALE : APPLICATION WEB SUR-MESURE (1.500.000 Ar)
Ny antony hianggilanay anao dia ny M-IT Level Up dia manamboatra Application Web sur-mesure ho an'ny ${prospect.category} ao ${prospect.city} ahafahan'ny mpanjifanao manao réservation en ligne, devis automatique ary gestion. Offre spéciale : 1.500.000 Ar.

2️⃣ OFFRE REBOND / DOWNSELL : SITE INTERNET VITRINE (800.000 Ar)
Raha mi-hésiter amin'ny budget ianao, izahay koa dia manao SITE INTERNET VITRINE PROFESSIONNEL manomboka amin'ny 800.000 Ar fotsiny ho an'ny ${prospect.name} ao ${prospect.city}!

Rahoviana ianao no afaka hanaovanay démonstration fohy 10 minitra?`;

  const copyScript = () => {
    navigator.clipboard.writeText(malagasyPitchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl bg-white h-full shadow-modal flex flex-col justify-between overflow-hidden"
      >
        {/* Drawer Top Header */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                {prospect.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">{prospect.city}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{prospect.name}</h2>
            {prospect.decisionMaker && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Responsable : <span className="text-slate-800 font-semibold">{prospect.decisionMaker}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Control Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Statut Commercial
              </label>
              <select
                value={status}
                onChange={(e) => handleQuickStatusChange(e.target.value)}
                className="mt-0.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="mt-0.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {PRIORITIES.map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!prospect.isClient && (
            <button
              onClick={handleConvertToClient}
              disabled={saving}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>Convertir en Client</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200/80 flex items-center gap-6 text-xs font-semibold bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "border-brand-600 text-brand-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Fiche & Historique
          </button>
          <button
            onClick={() => setActiveTab("script")}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "script"
                ? "border-amber-500 text-amber-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>Script Pitch (Malgache 2 Niveaux)</span>
          </button>
          <button
            onClick={() => setActiveTab("calls")}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "calls"
                ? "border-brand-600 text-brand-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Appels Téléphoniques ({prospect.callLogs?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "appointments"
                ? "border-brand-600 text-brand-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Agenda & RDV ({prospect.appointments?.length || 0})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-slate-50/30">
          {activeTab === "overview" && (
            <>
              {/* Contact Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Coordonnées Directes
                  </span>
                  <div className="text-xs text-slate-800 space-y-1.5 pt-1">
                    <p className="flex items-center gap-2 font-semibold text-slate-900">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prospect.phone}</span>
                    </p>
                    {prospect.phoneSecondary && (
                      <p className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-300" />
                        <span>Sec: {prospect.phoneSecondary}</span>
                      </p>
                    )}
                    {prospect.email && (
                      <p className="flex items-center gap-2 text-brand-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prospect.email}</span>
                      </p>
                    )}
                    {prospect.website && (
                      <p className="flex items-center gap-2 text-brand-600">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <a href={prospect.website} target="_blank" className="hover:underline">
                          {prospect.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Localisation & Info
                  </span>
                  <div className="text-xs text-slate-800 space-y-1.5 pt-1">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{prospect.address}</span>
                    </p>
                    <p className="text-slate-500 font-medium">
                      Commercial affecté :{" "}
                      <span className="text-slate-900 font-bold">
                        {prospect.assignedTo?.name || "Non attribué"}
                      </span>
                    </p>
                    {prospect.rating && (
                      <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded w-fit text-[11px] font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                        <span>{prospect.rating} / 5.0 (Avis Google)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {prospect.notes && (
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Notes Commercios & Intentions
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{prospect.notes}</p>
                </div>
              )}

              {/* Chronological Timeline */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Historique Complet de Prospection
                </span>

                <div className="relative pl-6 border-l-2 border-slate-100 space-y-4">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-brand-100 border-2 border-brand-600" />
                    <p className="text-xs font-bold text-slate-900">Prospect Importé</p>
                    <p className="text-[11px] text-slate-400">
                      Importé le {new Date(prospect.importedAt).toLocaleDateString("fr-FR")} par{" "}
                      {prospect.createdBy?.name || "Système"}
                    </p>
                  </div>

                  {prospect.firstContactAt && (
                    <div className="relative">
                      <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-600" />
                      <p className="text-xs font-bold text-slate-900">Premier Contact Téléphonique</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(prospect.firstContactAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  )}

                  {prospect.callLogs?.map((call: any) => (
                    <div key={call.id} className="relative">
                      <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-600" />
                      <p className="text-xs font-bold text-slate-900">
                        Appel enregistré : <span className="text-brand-600">{call.result}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{call.notes}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {new Date(call.createdAt).toLocaleDateString("fr-FR")} à{" "}
                        {new Date(call.createdAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "script" && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-xl text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    Pitch Téléphonique Malagasy (Stratégie 2 Niveaux)
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5">
                    1️⃣ App Web : <span className="font-bold text-amber-300">1 500 000 Ar</span> | 2️⃣ Site Web : <span className="font-bold text-emerald-400">800 000 Ar</span>
                  </p>
                </div>

                <button
                  onClick={copyScript}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copie !" : "Copier"}</span>
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Script de l'Appel (Fiteny Malagasy)
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-semibold bg-slate-50 p-4 rounded-xl border border-slate-200/60 whitespace-pre-line">
                  {malagasyPitchText}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1.5">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Règle d'Or M-IT Level Up :</span>
                </span>
                <p className="text-emerald-900 leading-relaxed">
                  Proposez toujours d'abord l'<strong>Application Web à 1.500.000 Ar</strong>. Si le prospect exprime une hésitation budgétaire, basculez immédiatement sur l'offre alternative <strong>Site Internet Vitrine à 800.000 Ar</strong> !
                </p>
              </div>
            </div>
          )}

          {activeTab === "calls" && (
            <div className="space-y-6">
              <form onSubmit={handleLogCall} className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Enregistrer un nouvel appel</h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Résultat de l'appel
                    </label>
                    <select
                      value={callResult}
                      onChange={(e) => setCallResult(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                    >
                      <option value="Interesse">Intéressé</option>
                      <option value="Repondu">Répondu (Neutre)</option>
                      <option value="Pas_de_reponse">Pas de réponse</option>
                      <option value="Occupe">Occupé</option>
                      <option value="Numero_invalide">Numéro invalide</option>
                      <option value="Pas_interesse">Pas intéressé</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Durée (secondes)
                    </label>
                    <input
                      type="number"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Notes & Compte-rendu
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Saisissez les détails de l'échange..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingCall}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  {submittingCall ? "Enregistrement..." : "Sauvegarder l'Appel"}
                </button>
              </form>

              <div className="space-y-3">
                {prospect.callLogs?.map((call: any) => (
                  <div key={call.id} className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {call.result}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {Math.floor(call.duration / 60)}m {call.duration % 60}s
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">{call.notes}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(call.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-6">
              <form onSubmit={handleScheduleApt} className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Programmer un Rendez-vous / Rappel</h4>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">Objectif du RDV</label>
                  <input
                    type="text"
                    required
                    value={aptTitle}
                    onChange={(e) => setAptTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Date & Heure</label>
                    <input
                      type="datetime-local"
                      required
                      value={aptDate}
                      onChange={(e) => setAptDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Type d'Événement</label>
                    <select
                      value={aptType}
                      onChange={(e) => setAptType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                    >
                      <option value="Rendez-vous">Rendez-vous Présentiel / Visio</option>
                      <option value="Rappel">Rappel Téléphonique</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingApt}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Programmer l'Événement
                </button>
              </form>

              <div className="space-y-3">
                {prospect.appointments?.map((apt: any) => (
                  <div key={apt.id} className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{apt.title}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(apt.startTime).toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700">
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-400">ID Prospect: {prospect.id.substring(0, 8)}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            Fermer la Fiche
          </button>
        </div>
      </motion.div>
    </div>
  );
}
