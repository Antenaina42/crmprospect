"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

const SECTOR_SCRIPTS: Record<
  string,
  {
    title: string;
    hook: string;
    valueProp: string;
    pitch: string;
    closing: string;
  }
> = {
  BTP: {
    title: "Entreprises BTP & Construction",
    hook: "Manao ahoana tompoko, [Nom Responsable] ve izao? Rakoto avy amin'ny agence M-IT Level Up (m-itlevelup.com) aho.",
    valueProp: "Fampiroboroboana ny chantiers, demande de devis en ligne ary catalogue des réalisations BTP.",
    pitch: `Ny antony hianggilanay anao dia mahita izahay fa tena mandeha tsara ny activité-nao amin'ny BTP sy Construction ao [Ville]. 

Maro amin'ireo clients mpanao chantier lehibe ankehitriny no mikaroka entreprise BTP mampiasa Google. Ao amin'ny M-IT Level Up izahay dia manamboatra Application Web & Site Professionnel manokana ho an'ny BTP:
- Kataloga amin'ny sary sy vidéos ny chantiers efa vitanao.
- Formulaire ahafahan'ny client mangataka DEVIS en ligne mampiditra plan sy budget.
- Pejy mivoaka voalohany amin'ny Google search amin'ny teny hoe "BTP Madagascar".`,
    closing: `Manomboka amin'ny 1.500.000 Ar fotsiny ny tarify base-n'ny Application Web ho an'ny BTP. 

Rahoviana ianao no malalaka amin'ity herinandro ity hanaovanay démonstration fohy 15 minitra amin'ny visioconférence na mihaona mampiseho ohatra efa vita?`,
  },
  HOTEL: {
    title: "Hôtels & Restaurants",
    hook: "Salama tompoko, amin'ny resaka gestion d'hébergement sy restauration ao amin'ny [Nom Etablissement] ihany izao...",
    valueProp: "Réservation en ligne direct sans commission + Gestion des chambres.",
    pitch: `Ao amin'ny M-IT Level Up (m-itlevelup.com) izahay dia manampy ireo Hôtels sy Restaurants any Madagascar mba hahazo Client direct tsy mandalo commission amin'ireo plateforme hafa.

Amin'ny alalan'ny Application Web amboarinay:
- Afaka manao Réservation chambre na meza mivantana amin'ny site ny clients.
- Azonao jerena amin'ny Téléphone sy Ordinateur ny planning reservation sy disponible.
- Misy intégration sary sy tarif mazava.`,
    closing: `Misy offre spéciale ho an'ny Hôtels & Restaurants manomboka amin'ny 1.500.000 Ar fotsiny. 

Afaka manao RDV fohy ve izatsy rahampitso amin'ny 10h izahay mba hampiseho anao démonstration mivantana?`,
  },
  GARAGE: {
    title: "Garages & Vente de Véhicules",
    hook: "Manao ahoana tompoko, [Nom Responsable] ao amin'ny Garage/Auto ve izao?",
    valueProp: "Prise de rendez-vous entretien, suivi des réparations pour les clients sy stock pièces.",
    pitch: `Ny agence digital M-IT Level Up dia manamboatra Application Web sy Platforme ho an'ny Garages Automobiles:
- Ny client-nao dia afaka mametraka Rendez-vous entretien / réparation en ligne.
- Afaka mamoaka devis automatique sy mampahafantatra ny client amin'ny SMS/Email rehefa vita ny fiara.
- Catalogue d'occasion na pièces détachées azo jerena amin'ny internet.`,
    closing: `Ny fampidirana ity système modern ity dia manomboka amin'ny 1.500.000 Ar fotsiny. 

Rahoviana ianao no afaka androany na rahampitso mba hiresahantsika azy fohy amin'ny téléphone na mihaona?`,
  },
  TRAVEL: {
    title: "Agences de Voyage & Tourisme",
    hook: "Salama tompoko, Rakoto avy amin'ny M-IT Level Up (m-itlevelup.com) mpanao Application Web sy Digitalisation.",
    valueProp: "Circuits touristiques Madagascar, réservation en ligne sy paiement sécurisé.",
    pitch: `Ireo touristes sy clients mpanao voyage ankehitriny dia mikaroka sy mameno réservation mialoha amin'ny Internet.

Ny Application Web novolavolain'ny M-IT Level Up dia ahafahanao:
- Mampiseho ny circuits touristiques rehetra ao Madagascar (Nosy Be, RN7, Morondava, SAVA...).
- System-na réservation automatique amin'ny teny Frantsay sy Anglisy.
- Mampitombo avy hatrany ny client-nao avy any ivelany sy eto an-toerana.`,
    closing: `Ny solusy novolavolainay dia manomboka amin'ny 1.500.000 Ar fotsiny. 

Afaka manao RDV fohy 10 minitra ve izatsy mba hampisehoanay anao ny exemple d'application web efa novolavolainay?`,
  },
  PHARMACY: {
    title: "Pharmacies & Cliniques Médicales",
    hook: "Manao ahoana tompoko, amin'ny resaka digital sante sy gestion ao amin'ny [Nom Clinique/Pharmacie] ihany izao...",
    valueProp: "Gestion de stock médicaments, garde en ligne sy prise de RDV médical.",
    pitch: `Ny agence M-IT Level Up dia manolotra Application Web manokana ho an'ny domaine médical:
- Mampiseho ny horaires de garde sy localisation Google Maps ho an'ny pharmacie.
- System-na prise de RDV médical en ligne ho an'ny cliniques sy cabinets.
- Mampitombo ny fahatokisan'ny mpanjifa amin'ny alalan'ny plateforme moderne.`,
    closing: `Packs manomboka amin'ny 1.500.000 Ar fotsiny. Afaka mandefa solontena manazava izany izahay amin'ity herinandro ity.`,
  },
  LAWYER: {
    title: "Avocats, Comptables & Architechtet",
    hook: "Salama Maître / Monsieur le Directeur, Rakoto avy amin'ny agence M-IT Level Up (m-itlevelup.com) aho.",
    valueProp: "Cabinet d'expert prestige, prise de rendez-vous consultation en ligne sy visibilité Google.",
    pitch: `Ireo mpanjifa mitady Cabinet d'Avocat, Expert-Comptable na Architecte dia mikaroka amin'ny Google sy Internet alohan'ny hifandraisana.

Ny Application Web avy amin'ny M-IT Level Up:
- Mampiseho ny domaine d'expertise-nao amin'ny fomba haut de gamme (Prestige).
- Formulaire prise de rendez-vous consultation en ligne.
- Pejy SEO mivoaka voalohany amin'ny rehetra mikaroka ao amin'ny [Ville].`,
    closing: `Offre clé en main manomboka amin'ny 1.500.000 Ar. Rahoviana ianao no manam-potoana kely hiresahana azy?`,
  },
};

const OBJECTIONS = [
  {
    objection: "« Lafo be izany 1.500.000 Ar izany »",
    response:
      "Azoko tsara ny fomba fijerinao tompoko. Fa eritrereto izao: ny Application Web dia TSY dépense fa INVESTISSEMENT mampiditra mpanjifa vaovao isam-bolana. Raha mahazo client vaovao 2 na 3 fotsiny ianao dia efa miverina (amorti) ny volanao. Ary ao amin'ny M-IT Level Up dia misy facility de paiement (paiment en plusieurs fois).",
  },
  {
    objection: "« Efa manana Page Facebook izahay »",
    response:
      "Tena tsara izany tompoko! Ny Page Facebook dia tsara amin'ny communication quotidienne, fa ny Application Web no manome Credibilité & Professionnalisme ampy. Misy mpanjifa maro (sady lehibe) TSY mampiasa Facebook fa Google fotsiny. Ary ny Web App dia misy système de réservation sy gestion automatique tsy hita ao amin'ny Facebook.",
  },
  {
    objection: "« Tsy ilaina aloha izao amin'izao fotoana izao »",
    response:
      "Azoko tsara. Fa izao tompoko: ireo concurrent-nao ao [Ville] dia efa manomboka miditra amin'ny Digitalisation. Raha miandry ianao dia ny concurrent no hahazo ireo mpanjifa mikaroka en ligne. Nahoana raha manao RDV fohy 10 minitra hijerena ny potentiel izao?",
  },
  {
    objection: "« Tsy manam-potoana aho hiresahana an'izany »",
    response:
      "Tsy maninona mihitsy tompoko. Tsy handany fotoana izahay: afaka mandefa présentation fohy amin'ny WhatsApp na Email anao ve izahay, dia iantsoana anao fotsiny afaka 2 andro rehefa hitanao?",
  },
];

export default function ScriptsVentePage() {
  const [selectedSector, setSelectedSector] = useState("BTP");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentScript = SECTOR_SCRIPTS[selectedSector] || SECTOR_SCRIPTS["BTP"];

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Agency Branding Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Guide Commercial Malagasy
            </span>
            <span className="text-xs text-slate-300">Agence M-IT Level Up</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Scripts de Prospection Téléphonique (Fiteny Malagasy)</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Pitches téléphoniques et argumentation sur-mesure pour convaincre les entreprises de Madagascar d'acquérir une application web à partir de <span className="font-bold text-amber-300">1 500 000 Ar</span>.
          </p>
        </div>

        <a
          href="https://m-itlevelup.com/"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all shrink-0"
        >
          <Globe className="w-4 h-4 text-brand-400" />
          <span>m-itlevelup.com</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Sector Selector Tabs */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-card">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Mifidiana Secteur d'Activité an'ny Prospect :
        </label>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Object.keys(SECTOR_SCRIPTS).map((key) => {
            const item = SECTOR_SCRIPTS[key];
            const isSelected = selectedSector === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedSector(key)}
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
          {/* Section 1: Fiarahabana & Fampidirana (Hook) */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                Etape 1 : Fiarahabana & Fampidirana (Hook)
              </span>
              <button
                onClick={() => copyToClipboard(currentScript.hook, "hook")}
                className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 font-medium"
              >
                {copiedField === "hook" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === "hook" ? "Copie !" : "Copier"}</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
              "{currentScript.hook}"
            </p>
          </div>

          {/* Section 2: Valeur Ajoutée & Pitch Secteur */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Etape 2 : Pitch Manokana ({currentScript.title})
              </span>
              <button
                onClick={() => copyToClipboard(currentScript.pitch, "pitch")}
                className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 font-medium"
              >
                {copiedField === "pitch" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === "pitch" ? "Copie !" : "Copier"}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                Proposition de valeur : {currentScript.valueProp}
              </span>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                {currentScript.pitch}
              </p>
            </div>
          </div>

          {/* Section 3: Annonce du Prix & Demande de RDV */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Etape 3 : Tarif Base (1.500.000 Ar) & Prise de RDV
              </span>
              <button
                onClick={() => copyToClipboard(currentScript.closing, "closing")}
                className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 font-medium"
              >
                {copiedField === "closing" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === "closing" ? "Copie !" : "Copier"}</span>
              </button>
            </div>

            <p className="text-xs text-slate-800 font-semibold bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 leading-relaxed">
              "{currentScript.closing}"
            </p>
          </div>
        </div>

        {/* Right Col: Objections & Answers in Malagasy */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Valin'ny Fanontanian'ny Client (Objections)</span>
            </h3>

            <div className="space-y-3">
              {OBJECTIONS.map((obj, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-rose-700 block">{obj.objection}</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {obj.response}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Summary Reminder Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider">Atsangano ny M-IT Level Up</span>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              M-IT Level Up (https://m-itlevelup.com/) dia Agence Digital Malagasy manam-pahaizana amin'ny Création Web & Application sur-mesure. 
            </p>
            <div className="pt-2 text-[11px] font-bold text-amber-200 border-t border-white/20">
              Tarif minimum : 1.500.000 Ariary (Facilité de paiement dispo).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
