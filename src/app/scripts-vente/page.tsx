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
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

interface CustomBlock {
  id: string;
  title: string;
  content: string;
}

interface SectorScriptData {
  title: string;
  hook: string;
  valueProp: string;
  primaryPitch: string;
  primaryClosing: string;
  downsellPitch: string;
  downsellClosing: string;
  customBlocks?: CustomBlock[];
}

const ALL_BUSINESS_SECTORS: Record<string, SectorScriptData> = {
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
    customBlocks: [],
  },
  HOTEL: {
    title: "Hôtels & Hébergement",
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
    customBlocks: [],
  },
  GARAGE: {
    title: "Garages & Entretien Automobile",
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
    customBlocks: [],
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
    customBlocks: [],
  },
  AUTO_DEALER: {
    title: "Vente de Véhicules & Concessionnaires",
    hook: `Salama tompoko, [Nom Responsable] ao amin'ny Vente Véhicules ve izao? [Nom Commercial] avy amin'ny M-IT Level Up (m-itlevelup.com).`,
    valueProp: "Plateforme Vente Véhicules en ligne (1.500.000 Ar) na Site Vitrine Auto (800.000 Ar).",
    primaryPitch: `Ny M-IT Level Up dia manolotra APPLICATION WEB VENTE DE VÉHICULES:
- Catalogue complet fiara vao tonga na occasion.
- Filtre par marque, prix, kilométrage sy année.
- Formulaire demande d'essai sy réservation direct en ligne.`,
    primaryClosing: `Application Web complète manomboka amin'ny 1.500.000 Ar. Rahoviana ianao no afaka mijery démonstration?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Raha Site Vitrine mampiseho ny stock fiara amin'izao fotoana izao fotsiny, manana offre amin'ny 800.000 Ar izahay miaraka amin'ny visibilité Google."`,
    downsellClosing: `800.000 Ar fotsiny dia efa mahazo mpanjifa en ligne ny concessionnaire-nao!`,
    customBlocks: [],
  },
  RESTAURANT: {
    title: "Restaurants & Traiteurs",
    hook: `Manao ahoana tompoko, [Nom Responsable] ao amin'ny Restaurant/Traiteur ve izao? [Nom Commercial] avy amin'ny M-IT Level Up aho.`,
    valueProp: "Menu en ligne & Commande direct (1.500.000 Ar) na Site Vitrine Restaurant (800.000 Ar).",
    primaryPitch: `Ny Application Web Restaurant M-IT Level Up:
- Menu QR Code & Commande en ligne direct sans commission.
- Réservation de table automatique miaraka amin'ny alerte WhatsApp.
- Catalogue plats & spécialités amin'ny sary HD.`,
    primaryClosing: `Pack Web Restaurant manomboka amin'ny 1.500.000 Ar. Afaka manao RDV fohy ve izatsy?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Misy SITE INTERNET VITRINE RESTAURANT 800.000 Ar mampiseho ny menu, horaires, localisation Google Maps sy numéro WhatsApp."`,
    downsellClosing: `800.000 Ar fotsiny dia efa hitan'ny olona ao amin'ny Google ny Restaurant-nao!`,
    customBlocks: [],
  },
  PHARMACY: {
    title: "Pharmacies & Santé",
    hook: `Manao ahoana tompoko, amin'ny resaka digital santé ao amin'ny [Nom Pharmacie] ihany izao... [Nom Commercial] avy amin'ny M-IT Level Up.`,
    valueProp: "Garde en ligne & Localisation (1.500.000 Ar na 800.000 Ar).",
    primaryPitch: `Ny agence M-IT Level Up dia manolotra Application Web Pharmacie:
- Horaires de garde & localisation Google Maps en direct.
- Service de réservation médicaments na demande de devis produit.
- Mampitombo ny fahatokisan'ny mpanjifa amin'ny alalan'ny plateforme moderne.`,
    primaryClosing: `Packs sur-mesure 1.500.000 Ar. Rahoviana no afaka mihaona?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Internet Vitrine Pharmacie amin'ny 800.000 Ar mampiseho ny localisation, horaires de garde sy contact direct."`,
    downsellClosing: `800.000 Ar fotsiny dia efa hitan'ny olona amin'ny garde ny pharmacie-nao!`,
    customBlocks: [],
  },
  CLINIC: {
    title: "Cliniques & Cabinets Médicaux",
    hook: `Salama Monsieur le Directeur / Docteur, [Nom Commercial] avy amin'ny M-IT Level Up mpanao Application Web Santé.`,
    valueProp: "Système RDV Médical (1.500.000 Ar) na Site Vitrine Clinique (800.000 Ar).",
    primaryPitch: `Ny Application Web Clinique par M-IT Level Up:
- Prise de RDV médical en ligne 24/7 amin'ireo spécialités.
- Presentation médecins, services d'urgence sy spécialités.
- Gestion planning consultation.`,
    primaryClosing: `Packs manomboka amin'ny 1.500.000 Ar. Afaka mandefa présentation izahay.`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Vitrine Clinique 800.000 Ar mampiseho ny spécialités, tarifs consultations sy numéro urgence."`,
    downsellClosing: `800.000 Ar fotsiny ho an'ny visibilité médicale en ligne!`,
    customBlocks: [],
  },
  LAWYER: {
    title: "Avocats, Notaires & Experts-Comptables",
    hook: `Salama Maître / Monsieur le Directeur, [Nom Commercial] avy amin'ny agence M-IT Level Up (m-itlevelup.com) aho.`,
    valueProp: "Site Prestige & RDV Consultation (1.500.000 Ar na 800.000 Ar).",
    primaryPitch: `Ireo mpanjifa mitady Cabinet d'Avocat, Notaire na Expert-Comptable dia mikaroka amin'ny Google alohan'ny hifandraisana.
- Domaine d'expertise mampiseho crédibilité haut de gamme (Prestige).
- Formulaire prise de rendez-vous consultation en ligne.
- Visibilité Google SEO N°1 ao [Ville].`,
    primaryClosing: `Packs prestige manomboka amin'ny 1.500.000 Ar. Rahoviana ianao no afaka hiresaka azy?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Internet Vitrine Cabinet amin'ny 800.000 Ar fotsiny ho an'ny crédibilité professionnelle."`,
    downsellClosing: `800.000 Ar fotsiny ho an'ny presence professionnelle!`,
    customBlocks: [],
  },
  BANK: {
    title: "Banques & Microfinance",
    hook: `Salama tompoko, [Nom Responsable] ao amin'ny Etablissement Financier/Microfinance ve izao? [Nom Commercial] avy amin'ny M-IT Level Up.`,
    valueProp: "Plateforme de simulation de crédit & demande en ligne (1.500.000 Ar+).",
    primaryPitch: `Ny Application Web Microfinance M-IT Level Up:
- Simulateur de crédit en ligne (calcul mensualités & taux).
- Demande de prêt direct en ligne miaraka amin'ny pièces justificatives.
- Présentation agences & produits d'épargne.`,
    primaryClosing: `Solusy sur-mesure. Rahoviana no afaka manao rendez-vous présentation?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Vitrine Microfinance mampiseho ny offres d'épargne, conditions de crédit sy agences."`,
    downsellClosing: `800.000 Ar fotsiny ho an'ny visibilité en ligne!`,
    customBlocks: [],
  },
  IT: {
    title: "Sociétés Informatiques & Télécom",
    hook: `Salama tompoko, [Nom Commercial] avy amin'ny M-IT Level Up (m-itlevelup.com).`,
    valueProp: "Application Web IT / SaaS (1.500.000 Ar+) na Site Vitrine Services IT (800.000 Ar).",
    primaryPitch: `Ny M-IT Level Up dia manolotra Développement Web sur-mesure, API integration sy solutions SaaS ho an'ny Sociétés IT & Télécom.`,
    primaryClosing: `Développement haut de gamme. Afaka mihaona miresaka projet izahay.`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Internet Vitrine IT 800.000 Ar mampiseho ny catalogue d'offres sy infrastructure."`,
    downsellClosing: `800.000 Ar fotsiny!`,
    customBlocks: [],
  },
  REAL_ESTATE: {
    title: "Immobilières & Promotion",
    hook: `Manao ahoana tompoko, [Nom Responsable] Agence Immobilière ve izao? [Nom Commercial] avy amin'ny M-IT Level Up.`,
    valueProp: "Plateforme Annonces Immobilières (1.500.000 Ar) na Site Vitrine Agence (800.000 Ar).",
    primaryPitch: `Ny Application Web Immobilière M-IT Level Up:
- Catalogue annonces vente & location maison, terrain, appartement.
- Moteur de recherche avancé par prix, quartier, superficie.
- Formulaire demande de visite direct.`,
    primaryClosing: `Pack Web Immobilier 1.500.000 Ar. Rahoviana ianao no afaka mijery démonstration?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Vitrine Agence 800.000 Ar mampiseho ny agence, services sy sélection de biens."`,
    downsellClosing: `800.000 Ar fotsiny!`,
    customBlocks: [],
  },
  SUPERMARKET: {
    title: "Supermarchés & Grande Distribution",
    hook: `Salama tompoko, [Nom Responsable] Grande Distribution ve izao? [Nom Commercial] avy amin'ny M-IT Level Up.`,
    valueProp: "Catalogue en ligne & Drive (1.500.000 Ar) na Site Vitrine Magasin (800.000 Ar).",
    primaryPitch: `Ny Application Web Supermarché M-IT Level Up:
- Catalogue produits en ligne & promotions de la semaine.
- Commande & Click & Collect / Livraison à domicile.`,
    primaryClosing: `Solution E-Commerce & Drive. Rahoviana izahay no afaka manolotra azy?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Vitrine Magasin 800.000 Ar mampiseho ny catalogue promos, horaires sy agences."`,
    downsellClosing: `800.000 Ar fotsiny!`,
    customBlocks: [],
  },
  LOGISTICS: {
    title: "Transporteurs & Transitaires",
    hook: `Manao ahoana tompoko, [Nom Responsable] Transport/Transit ve izao? [Nom Commercial] avy amin'ny M-IT Level Up.`,
    valueProp: "Tracking colis & Demande de cotation (1.500.000 Ar) na Site Vitrine Transit (800.000 Ar).",
    primaryPitch: `Ny Application Web Transport & Transit M-IT Level Up:
- Formulaire demande de cotation fret maritime / aérien / terrestre.
- Système de tracking colis & conteneurs en ligne.
- Presentation flotte & destinations.`,
    primaryClosing: `Pack Transit 1.500.000 Ar. Rahoviana ianao no afaka manao RDV?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Vitrine Transporteur 800.000 Ar mampiseho ny lignes, tarifs indicatifs sy contacts."`,
    downsellClosing: `800.000 Ar fotsiny!`,
    customBlocks: [],
  },
  EDUCATION: {
    title: "Centres de Formation & Écoles",
    hook: `Salama Monsieur le Directeur, [Nom Commercial] avy amin'ny M-IT Level Up mpanao Application Web Éducation.`,
    valueProp: "Inscription en ligne & Portal (1.500.000 Ar) na Site Vitrine École (800.000 Ar).",
    primaryPitch: `Ny Application Web École / Formation M-IT Level Up:
- Catalogue de formations & programmes d'études.
- Inscription & pré-inscription en ligne avec dépôt de pièces.
- Espace information étudiants & parents.`,
    primaryClosing: `Pack Éducation 1.500.000 Ar. Rahoviana ianao no afaka mihaona?`,
    downsellPitch: `[REBOND 800.000 Ar] :
"Site Vitrine École 800.000 Ar mampiseho ny programmes, frais de scolarité sy contact."`,
    downsellClosing: `800.000 Ar fotsiny!`,
    customBlocks: [],
  },
};

export default function ScriptsVentePage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Rakoto Jean";

  const [selectedSector, setSelectedSector] = useState("BTP");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Editable scripts state per user with fallback safety
  const [sectorScripts, setSectorScripts] = useState<Record<string, SectorScriptData>>(ALL_BUSINESS_SECTORS);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScript, setEditedScript] = useState<SectorScriptData>(ALL_BUSINESS_SECTORS["BTP"]);
  const [savedNotice, setSavedNotice] = useState(false);

  // Safe getter for sector script data
  const getSafeSectorData = (sectorKey: string, source: Record<string, SectorScriptData>): SectorScriptData => {
    const raw = source[sectorKey] || ALL_BUSINESS_SECTORS[sectorKey] || ALL_BUSINESS_SECTORS["BTP"];
    return {
      title: raw.title || ALL_BUSINESS_SECTORS["BTP"].title,
      hook: raw.hook || "",
      valueProp: raw.valueProp || "",
      primaryPitch: raw.primaryPitch || "",
      primaryClosing: raw.primaryClosing || "",
      downsellPitch: raw.downsellPitch || "",
      downsellClosing: raw.downsellClosing || "",
      customBlocks: Array.isArray(raw.customBlocks) ? raw.customBlocks : [],
    };
  };

  // Load custom scripts from localStorage safely after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`user_custom_scripts_${userName}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setSectorScripts((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.error("LocalStorage read error in scripts page:", e);
    }
  }, [userName]);

  useEffect(() => {
    const safeData = getSafeSectorData(selectedSector, sectorScripts);
    setEditedScript(safeData);
  }, [selectedSector, sectorScripts]);

  const handleSaveCustomScript = () => {
    const safeEdited = getSafeSectorData(selectedSector, { [selectedSector]: editedScript });
    const updated = {
      ...sectorScripts,
      [selectedSector]: safeEdited,
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
    setSectorScripts(ALL_BUSINESS_SECTORS);
    try {
      localStorage.removeItem(`user_custom_scripts_${userName}`);
    } catch (e) {}
    setIsEditing(false);
  };

  const handleAddCustomBlock = () => {
    const newBlock: CustomBlock = {
      id: `block_${Date.now()}`,
      title: "Nouvel Argumentaire Personnalisé",
      content: "Saisissez ici le texte du nouvel argumentaire en malgache...",
    };
    setEditedScript((prev) => ({
      ...prev,
      customBlocks: [...(prev.customBlocks || []), newBlock],
    }));
  };

  const handleRemoveCustomBlock = (id: string) => {
    setEditedScript((prev) => ({
      ...prev,
      customBlocks: (prev.customBlocks || []).filter((b) => b.id !== id),
    }));
  };

  const handleUpdateCustomBlock = (id: string, field: "title" | "content", value: string) => {
    setEditedScript((prev) => ({
      ...prev,
      customBlocks: (prev.customBlocks || []).map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    }));
  };

  const activeScript = getSafeSectorData(selectedSector, sectorScripts);

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
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Commercial Connecté : {userName}
            </span>
            <span className="text-xs text-slate-300">Bibliothèque Complète Tous Secteurs ({Object.keys(sectorScripts).length})</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Scripts de Prospection Modifiables & Personnalisables</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Modifiez et ajoutez autant de zones de texte personnalisées (Titre + Texte) que nécessaire. Tous les textes sont entièrement visibles sans masquage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Vos modifications de script et vos zones de texte ont été sauvegardées avec succès pour votre compte !</span>
        </div>
      )}

      {/* Exhaustive Sector Filter Tabs (All Business Categories) */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Sélectionner l'activité du Prospect ({Object.keys(sectorScripts).length} secteurs disponibles) :
          </label>
          <span className="text-[11px] font-bold text-brand-600">
            Secteur actif : {activeScript.title}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
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

      {/* Main Full-Height Scrollable Script Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Fully Expanded Text Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Hook */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                1. Accroche Téléphonique (Hook)
              </span>
              {!isEditing && (
                <button
                  onClick={() => copyToClipboard(activeScript.hook, "hook")}
                  className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 font-semibold"
                >
                  {copiedField === "hook" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "hook" ? "Copie !" : "Copier"}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                rows={3}
                value={editedScript.hook || ""}
                onChange={(e) => setEditedScript({ ...editedScript, hook: e.target.value })}
                className="w-full p-3.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium leading-relaxed"
              />
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                <p className="text-xs font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                  "{replaceCommercialName(activeScript.hook)}"
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Primary Pitch (Application Web 1.5M Ar) */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                2. PROPOSITION 1 : Application Web Sur-Mesure (1.500.000 Ar)
              </span>
              {!isEditing && (
                <button
                  onClick={() => copyToClipboard(activeScript.primaryPitch, "primaryPitch")}
                  className="text-xs text-slate-400 hover:text-brand-600 flex items-center gap-1 font-semibold"
                >
                  {copiedField === "primaryPitch" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "primaryPitch" ? "Copie !" : "Copier"}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600">Texte du Pitch 1 :</label>
                <textarea
                  rows={6}
                  value={editedScript.primaryPitch || ""}
                  onChange={(e) => setEditedScript({ ...editedScript, primaryPitch: e.target.value })}
                  className="w-full p-3.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium leading-relaxed"
                />
                <label className="text-xs font-bold text-slate-600 block pt-1">Accroche de Clôture / Prise de RDV :</label>
                <textarea
                  rows={3}
                  value={editedScript.primaryClosing || ""}
                  onChange={(e) => setEditedScript({ ...editedScript, primaryClosing: e.target.value })}
                  className="w-full p-3.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium leading-relaxed"
                />
              </div>
            ) : (
              <>
                <div className="p-4.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                    {replaceCommercialName(activeScript.primaryPitch)}
                  </p>
                </div>

                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                    "{replaceCommercialName(activeScript.primaryClosing)}"
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Section 3: Downsell Pitch (Site Internet 800k Ar) */}
          <div className="p-6 bg-white border border-emerald-200/80 rounded-2xl shadow-card space-y-4 bg-emerald-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                3. PROPOSITION 2 (REBOND / DOWNSELL) : Site Internet Vitrine (800.000 Ar)
              </span>
              {!isEditing && (
                <button
                  onClick={() => copyToClipboard(activeScript.downsellPitch, "downsellPitch")}
                  className="text-xs text-slate-400 hover:text-emerald-700 flex items-center gap-1 font-semibold"
                >
                  {copiedField === "downsellPitch" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === "downsellPitch" ? "Copie !" : "Copier"}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600">Texte du Rebond Downsell (800 000 Ar) :</label>
                <textarea
                  rows={5}
                  value={editedScript.downsellPitch || ""}
                  onChange={(e) => setEditedScript({ ...editedScript, downsellPitch: e.target.value })}
                  className="w-full p-3.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium leading-relaxed"
                />
                <label className="text-xs font-bold text-slate-600 block pt-1">Clôture Rebond :</label>
                <textarea
                  rows={3}
                  value={editedScript.downsellClosing || ""}
                  onChange={(e) => setEditedScript({ ...editedScript, downsellClosing: e.target.value })}
                  className="w-full p-3.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium leading-relaxed"
                />
              </div>
            ) : (
              <>
                <div className="p-4.5 bg-white rounded-xl border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-950 leading-relaxed whitespace-pre-line">
                    {replaceCommercialName(activeScript.downsellPitch)}
                  </p>
                </div>

                <div className="p-4 bg-emerald-100/60 rounded-xl border border-emerald-300">
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                    "{replaceCommercialName(activeScript.downsellClosing)}"
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Section 4: Dynamic Custom Text Blocks Added by User */}
          {((isEditing ? editedScript.customBlocks : activeScript.customBlocks) || []).map((block, idx) => (
            <div key={block.id} className="p-6 bg-white border border-indigo-200 rounded-2xl shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isEditing ? `Bloc Personnalisé N°${idx + 1}` : block.title}</span>
                </span>

                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <button
                      onClick={() => copyToClipboard(block.content, block.id)}
                      className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-semibold"
                    >
                      {copiedField === block.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === block.id ? "Copie !" : "Copier"}</span>
                    </button>
                  )}

                  {isEditing && (
                    <button
                      onClick={() => handleRemoveCustomBlock(block.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Supprimer ce bloc"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Titre de la zone de texte :</label>
                    <input
                      type="text"
                      value={block.title || ""}
                      onChange={(e) => handleUpdateCustomBlock(block.id, "title", e.target.value)}
                      className="w-full p-2.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Texte de l'argumentaire :</label>
                    <textarea
                      rows={5}
                      value={block.content || ""}
                      onChange={(e) => handleUpdateCustomBlock(block.id, "content", e.target.value)}
                      className="w-full p-3.5 bg-amber-50/50 border border-amber-300 rounded-xl text-xs text-slate-900 font-medium leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4.5 bg-indigo-50/30 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                    {replaceCommercialName(block.content)}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Button to Add New Custom Text Block during Edit Mode */}
          {isEditing && (
            <button
              onClick={handleAddCustomBlock}
              className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl text-xs font-bold text-brand-600 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajouter une zone de texte personnalisée (Titre & Texte)</span>
            </button>
          )}
        </div>

        {/* Right Col: Control Panel & Save Actions */}
        <div className="space-y-6">
          {isEditing ? (
            <div className="p-6 bg-amber-50 border border-amber-300 rounded-2xl space-y-4 shadow-sm sticky top-4">
              <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Mode Édition en cours</span>
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                Vous pouvez modifier les textes et ajouter autant de zones de texte personnalisées (Titre + Contenu) que vous souhaitez pour le secteur <strong>{activeScript.title}</strong>.
              </p>

              <button
                onClick={handleAddCustomBlock}
                className="w-full py-2.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-amber-700" />
                <span>+ Ajouter une zone de texte</span>
              </button>

              <button
                onClick={handleSaveCustomScript}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer pour {userName}</span>
              </button>
            </div>
          ) : (
            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-3 sticky top-4">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Personnalisation des Scripts</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque commercial connecté peut personnaliser et ajouter ses propres blocs d'arguments par secteur d'activité.
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modifier ou Ajouter des blocs</span>
              </button>
            </div>
          )}

          {/* Agency Summary Reminder Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-md space-y-3">
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
