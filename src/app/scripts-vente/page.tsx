"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  PhoneCall,
  MessageSquareCode,
  Building2,
  Globe,
  Sparkles,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Zap,
  UserCheck,
  Flame,
  Award,
  Clock,
  Send,
  TrendingDown,
  Layers,
  Edit3,
  Save,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

const INITIAL_SECTOR_SCRIPTS: Record<
  string,
  {
    title: string;
    hook: string;
    valueProp: string;
    primaryPitch: string;
    primaryClosing: string;
    downsellPitch: string;
    downsellClosing: string;
  }
> = {
  BTP: {
    title: "Entreprises BTP & Construction",
    hook: `Manao ahoana tompoko, [Nom Responsable] ve izao? [Nom Commercial] avy amin'ny agence digital M-IT Level Up (m-itlevelup.com) aho.`,
    valueProp: "Application Web de gestion (1.500.000 Ar) na Site Internet Vitrine (800.000 Ar).",
    primaryPitch: `Ny antony hianggilanay anao mivantana androany dia mahita izahay fa mitombo tsara ny chantiers ataonareo ao [Ville]. 

Koa mampahafantatra anao izahay fa ny M-IT Level Up dia manamboatra APPLICATION WEB SUR-MESURE ho an'ny BTP:
- Kataloga amboarina amin'ny sary sy vidéos HD amin'ireo chantiers efa vitanao.
- Formulaire demande de DEVIS en ligne ahafahan'ny client mampiditra plan sy budget mivantana.
- Système de gestion de projet & récapitulatif chantiers.`,
    primaryClosing: `Ity Application Web complet ity dia manomboka amin'ny 1.500.000 Ar fotsiny (misy facilité de paiement en 2 ou 3 fois). 

Rahoviana ianao no malalaka hanaovanay démonstration fohy 10 minitra?`,
    downsellPitch: `[RAHA RAZANA NA MI-HÉSITER AMIN'NY PRIX 1.5M Ar] :
"Azoko tsara tompoko. Raha kely kokoa aloha ny budget-nao ankehitriny, izahay ao amin'ny M-IT Level Up dia manana OFFRE SITE INTERNET VITRINE PROFESSIONNEL manomboka amin'ny 800.000 Ar fotsiny!
- Site web moderne mampiseho ny entreprise-nao sy ny chantiers vitanao.
- Bouton Appel direct sy formulaire contact WhatsApp.
- Visibilité Google ao [Ville]."`,
    downsellClosing: `Amin'ny 800.000 Ar fotsiny dia efa manana Site Internet haut de gamme ny entreprise-nao. Afaka mandefa offre fohy amin'ny WhatsApp-nao ve izahay?`,
  },
  HOTEL: {
    title: "Hôtels & Restaurants",
    hook: `Salama tompoko, amin'ny resaka gestion d'hébergement sy restauration ao amin'ny [Nom Etablissement] ihany izao... [Nom Commercial] avy amin'ny M-IT Level Up aho.`,
    valueProp: "Application Web de réservation (1.500.000 Ar) na Site Vitrine Hôtel (800.000 Ar).",
    primaryPitch: `Ao amin'ny M-IT Level Up (m-itlevelup.com) izahay dia manampy ireo Hôtels sy Restaurants any Madagascar mba hahazo Client direct TSY MANDALO COMMISSION amin'ireo plateforme hafa.

1. APPLICATION WEB DE RÉSERVATION (1.500.000 Ar) :
- Client afaka manao Réservation chambre na meza mivantana 24/7.
- Planning disponibilté sy gestion automatique amin'ny téléphone-nao.`,
    primaryClosing: `Packs Application Web à partir de 1.500.000 Ar. Rahoviana izahay no afaka mampiseho démonstration mivantana?`,
    downsellPitch: `[REBOND DOWNSELL 800.000 Ar] :
"Raha tsy mbola mila le système de réservation automatique ianao dia manana OFFRE SITE INTERNET VITRINE HÔTEL amin'ny 800.000 Ar fotsiny izahay:
- Sary HD ny chambres, menu sy tarifs.
- Localisation Google Maps & Contact direct WhatsApp."`,
    downsellClosing: `Amin'ny 800.000 Ar dia efa manana presence professionnelle en ligne ny Hôtel-nao. Afaka manao RDV fohy ve izatsy?`,
  },
  GARAGE: {
    title: "Garages & Vente de Véhicules",
    hook: `Manao ahoana tompoko, [Nom Responsable] ao amin'ny Garage/Auto ve izao? [Nom Commercial] avy amin'ny M-IT Level Up (m-itlevelup.com) aho.`,
    valueProp: "Application Web Garage (1.500.000 Ar) na Site Vitrine Auto (800.000 Ar).",
    primaryPitch: `Ny agence digital M-IT Level Up dia manamboatra APPLICATION WEB GARAGE AUTOMOBILE (1.500.000 Ar):
- Rendez-vous entretien / réparation en ligne.
- Suivi des réparations & SMS alerte rehefa vita ny fiara.
- Stock pièces détachées azo jerena amin'ny internet.`,
    primaryClosing: `Offre Application Web manomboka amin'ny 1.500.000 Ar fotsiny. Afaka manao RDV fohy ve izatsy?`,
    downsellPitch: `[REBOND DOWNSELL 800.000 Ar] :
"Raha ampy anao aloha ny Site Internet mampiseho ny service-nao sy mampiditra client, misy SITE INTERNET VITRINE GARAGE amin'ny 800.000 Ar fotsiny:
- Présentation services vidange, mécanique, diagnostic.
- Bouton appel rapide sy localisation garage."`,
    downsellClosing: `800.000 Ar fotsiny dia efa mampiditra mpanjifa vaovao ny garage-nao!`,
  },
  TRAVEL: {
    title: "Agences de Voyage & Tourisme",
    hook: `Salama tompoko, [Nom Commercial] avy amin'ny M-IT Level Up (m-itlevelup.com) mpanao Application Web sy Digitalisation.`,
    valueProp: "Application Web Circuits & Booking (1.500.000 Ar) na Site Vitrine Voyage (800.000 Ar).",
    primaryPitch: `Ny Application Web Novolavolain'ny M-IT Level Up ho an'ny Agence de Voyage (1.500.000 Ar):
- Circuits touristiques complets Madagascar (Nosy Be, RN7, SAVA...).
- Booking & Réservation automatique en ligne (Frantsay/Anglisy).`,
    primaryClosing: `Manomboka amin'ny 1.500.000 Ar. Rahoviana ianao no afaka mijery démonstration?`,
    downsellPitch: `[REBOND DOWNSELL 800.000 Ar] :
"Raha tsy manao réservation direct en ligne aloha ianao, manana SITE INTERNET VITRINE TOURISME amin'ny 800.000 Ar fotsiny izahay:
- Catalogue circuits sy sary magnifique Madagascar.
- Formulaire contact sy WhatsApp direct ho an'ny touristes."`,
    downsellClosing: `Site Internet Tourisme à partir de 800.000 Ar fotsiny!`,
  },
};

export default function ScriptsVentePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Rakoto Jean";

  const [selectedSector, setSelectedSector] = useState("BTP");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Editable scripts state per user
  const [sectorScripts, setSectorScripts] = useState(INITIAL_SECTOR_SCRIPTS);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState(INITIAL_SECTOR_SCRIPTS["BTP"]);
  const [savedNotice, setSavedNotice] = useState(false);

  // Load custom scripts from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`user_custom_scripts_${userName}`);
      if (saved) {
        setSectorScripts(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [userName]);

  useEffect(() => {
    if (sectorScripts[selectedSector]) {
      setEditedScript(sectorScripts[selectedSector]);
    }
  }, [selectedSector, sectorScripts]);

  const handleSaveCustomScript = () => {
    const updated = {
      ...sectorScripts,
      [selectedSector]: editedScript,
    };
    setSectorScripts(updated);
    try {
      localStorage.setItem(`user_custom_scripts_${userName}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleResetDefaults = () => {
    setSectorScripts(INITIAL_SECTOR_SCRIPTS);
    try {
      localStorage.removeItem(`user_custom_scripts_${userName}`);
    } catch (e) {}
    setIsEditing(false);
  };

  const currentScript = sectorScripts[selectedSector] || INITIAL_SECTOR_SCRIPTS["BTP"];

  // Replace [Nom Commercial] with active logged in user name dynamically
  const replaceCommercialName = (text: string) => {
    if (!text) return "";
    return text.replace(/\[Nom Commercial\]/g, userName);
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(replaceCommercialName(text));
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Commercial Connecté : {userName}
            </span>
            <span className="text-xs text-slate-300">Scripts Modifiables par Utilisateur</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Scripts de Prospection Modifiables (Fiteny Malagasy)</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Personnalisez vos arguments téléphoniques pour votre propre profil commercial. Les modifications sont automatiquement sauvegardées pour votre compte !
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Modifier ce Script</span>
            </button>
          ) : (
            <button
              onClick={handleSaveCustomScript}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer mes Modifications</span>
            </button>
          )}

          <button
            onClick={handleResetDefaults}
            title="Réinitialiser aux scripts par défaut"
            className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Vos modifications de script ont été sauvegardées avec succès pour votre compte !</span>
        </div>
      )}

      {/* Sector Selector Tabs */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-card">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Mifidiana Secteur d'Activité an'ny Prospect :
        </label>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Object.keys(sectorScripts).map((key) => {
            const item = sectorScripts[key];
            const isSelected = selectedSector === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedSector(key);
                  setIsEditing(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Pitch Card Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Full Call Script */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section 1: Hook */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                Accroche Téléphonique (Hook)
              </span>
              {!isEditing && (
                <button
                  onClick={() => copyToClipboard(currentScript.hook, "hook")}
                  className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 font-medium"
                >
                  {copiedField === "hook" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "hook" ? "Copie !" : "Copier"}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                rows={2}
                value={editedScript.hook}
                onChange={(e) => setEditedScript({ ...editedScript, hook: e.target.value })}
                className="w-full p-3 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            ) : (
              <p className="text-sm font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                "{replaceCommercialName(currentScript.hook)}"
              </p>
            )}
          </div>

          {/* Section 2: Primary Pitch (Application Web 1.5M Ar) */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                PROPOSITION 1 : Application Web Sur-Mesure (1.500.000 Ar)
              </span>
              {!isEditing && (
                <button
                  onClick={() => copyToClipboard(currentScript.primaryPitch, "primaryPitch")}
                  className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 font-medium"
                >
                  {copiedField === "primaryPitch" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "primaryPitch" ? "Copie !" : "Copier"}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500">Texte du Pitch 1 :</label>
                <textarea
                  rows={5}
                  value={editedScript.primaryPitch}
                  onChange={(e) => setEditedScript({ ...editedScript, primaryPitch: e.target.value })}
                  className="w-full p-3 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <label className="text-[10px] font-bold text-slate-500 block pt-1">Accroche de Clôture / Prise de RDV :</label>
                <textarea
                  rows={2}
                  value={editedScript.primaryClosing}
                  onChange={(e) => setEditedScript({ ...editedScript, primaryClosing: e.target.value })}
                  className="w-full p-3 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            ) : (
              <>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                    {replaceCommercialName(currentScript.primaryPitch)}
                  </p>
                </div>

                <p className="text-xs text-slate-800 font-semibold bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                  "{replaceCommercialName(currentScript.primaryClosing)}"
                </p>
              </>
            )}
          </div>

          {/* Section 3: Downsell Pitch (Site Internet 800k Ar) */}
          <div className="p-5 bg-white border border-emerald-200/80 rounded-2xl shadow-card space-y-3 bg-emerald-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                PROPOSITION 2 (REBOND / DOWNSELL) : Site Internet Vitrine (800.000 Ar)
              </span>
              {!isEditing && (
                <button
                  onClick={() => copyToClipboard(currentScript.downsellPitch, "downsellPitch")}
                  className="text-xs text-slate-400 hover:text-emerald-700 flex items-center gap-1 font-medium"
                >
                  {copiedField === "downsellPitch" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "downsellPitch" ? "Copie !" : "Copier"}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500">Texte du Rebond Downsell (800 000 Ar) :</label>
                <textarea
                  rows={4}
                  value={editedScript.downsellPitch}
                  onChange={(e) => setEditedScript({ ...editedScript, downsellPitch: e.target.value })}
                  className="w-full p-3 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <label className="text-[10px] font-bold text-slate-500 block pt-1">Clôture Rebond :</label>
                <textarea
                  rows={2}
                  value={editedScript.downsellClosing}
                  onChange={(e) => setEditedScript({ ...editedScript, downsellClosing: e.target.value })}
                  className="w-full p-3 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            ) : (
              <>
                <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-semibold text-emerald-950">
                    {replaceCommercialName(currentScript.downsellPitch)}
                  </p>
                </div>

                <p className="text-xs text-slate-800 font-semibold bg-emerald-100/60 p-3 rounded-xl border border-emerald-300">
                  "{replaceCommercialName(currentScript.downsellClosing)}"
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Col: Save Action & Reminders */}
        <div className="space-y-4">
          {isEditing && (
            <div className="p-5 bg-amber-50 border border-amber-300 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Mode Édition Actif</span>
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Modifiez les textes dans les cases ci-contre, puis cliquez sur <strong>Enregistrer</strong> pour enregistrer votre propre version de pitch.
              </p>
              <button
                onClick={handleSaveCustomScript}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder pour {userName}</span>
              </button>
            </div>
          )}

          {/* Agency Summary Reminder Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider">M-IT Level Up Tarifs</span>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              1️⃣ <span className="font-bold text-amber-300">Application Web</span> : 1 500 000 Ar+<br />
              2️⃣ <span className="font-bold text-emerald-300">Site Internet Vitrine</span> : 800 000 Ar+
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
