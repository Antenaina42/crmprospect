"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Download,
  Building2,
  CheckCircle2,
  Phone,
  Globe,
  Star,
  RefreshCw,
  Sparkles,
  Info,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Filter,
  GraduationCap,
  School,
} from "lucide-react";
import { motion } from "framer-motion";

const MADAGASCAR_CITIES = [
  { name: "Antananarivo", region: "Analamanga", count: "1 250+ entreprises" },
  { name: "Toamasina", region: "Atsinanana", count: "480+ entreprises" },
  { name: "Antsirabe", region: "Vakinankaratra", count: "320+ entreprises" },
  { name: "Mahajanga", region: "Boeny", count: "410+ entreprises" },
  { name: "Fianarantsoa", region: "Haute Matsiatra", count: "290+ entreprises" },
  { name: "Antsiranana", region: "Diana", count: "210+ entreprises" },
  { name: "Toliara", region: "Atsimo-Andrefana", count: "190+ entreprises" },
  { name: "Nosy Be", region: "Diana", count: "350+ établissements" },
  { name: "Sambava", region: "SAVA", count: "140+ entreprises" },
  { name: "Taolagnaro", region: "Anosy", count: "120+ entreprises" },
];

const MADAGASCAR_DISTRICTS: Record<string, string[]> = {
  Antananarivo: [
    "Toutes les communes / zones",
    "Andoharanofotsy",
    "Tanjombato",
    "Ankadimbahoaka",
    "Ankorondrano",
    "Analakely",
    "Mahamasina",
    "Itaosy",
    "Ivato",
    "Talatamaty",
    "Ambohimanarina",
    "Sabotsy Namehana",
    "Alasora",
    "Ilafy",
    "Analamahitsy",
    "Ampasampito",
    "Ambohibao",
    "Anosivavaka",
    "Ambatobe",
    "Isoraka",
    "Antanimena",
    "67Ha",
    "Behoririka",
  ],
  Toamasina: [
    "Toutes les communes / zones",
    "Tamatave Centre",
    "Bazar Be",
    "Bazar Kely",
    "Salazamay",
    "Mangarano",
    "Tanamakoa",
    "Ankirihiry",
    "Port Fluvial",
  ],
  Antsirabe: [
    "Toutes les communes / zones",
    "Antsirabe Centre",
    "Vatofotsy",
    "Mahazoarivo",
    "Ivohitra",
    "Ambalavato",
    "Manandona",
  ],
  Mahajanga: [
    "Toutes les communes / zones",
    "Majunga Be",
    "Tsaramandroso",
    "Amborovy",
    "Mahabibo",
    "Marovato",
    "Abattoir",
  ],
  Fianarantsoa: [
    "Toutes les communes / zones",
    "Fianar Centre",
    "Ampitakely",
    "Tsianolondroa",
    "Isaha",
    "Talatamaty",
  ],
  Antsiranana: [
    "Toutes les communes / zones",
    "Diego Ville",
    "Scama",
    "Bazarikely",
    "Grand Pavois",
    "Tanambao",
  ],
  Toliara: [
    "Toutes les communes / zones",
    "Tuléar Ville",
    "Sanfily",
    "Betania",
    "Tsimenatse",
    "Mahavatse",
  ],
  "Nosy Be": [
    "Toutes les communes / zones",
    "Hell-Ville",
    "Dzamandzar",
    "Ambatoloaka",
    "Ambatozavavy",
    "Andilana",
  ],
  Sambava: [
    "Toutes les communes / zones",
    "Sambava Centre",
    "Antaimby",
    "Ambodisatrana",
  ],
  Taolagnaro: [
    "Toutes les communes / zones",
    "Fort-Dauphin Centre",
    "Bazarikely",
    "Ampasimasay",
  ],
};

const BUSINESS_CATEGORIES = [
  { name: "Écoles & Établissements Scolaires", code: "SCHOOL", icon: "🏫" },
  { name: "Centres de formation & Universités", code: "EDUCATION", icon: "🎓" },
  { name: "Entreprises BTP", code: "BTP", icon: "🏗️" },
  { name: "Agences de voyage", code: "TRAVEL", icon: "✈️" },
  { name: "Vente de véhicules", code: "AUTO_DEALER", icon: "🚗" },
  { name: "Garages automobiles", code: "AUTO_GARAGE", icon: "🔧" },
  { name: "Hôtels", code: "HOTEL", icon: "🏨" },
  { name: "Restaurants", code: "RESTAURANT", icon: "🍽️" },
  { name: "Pharmacies", code: "PHARMACY", icon: "💊" },
  { name: "Cliniques & Cabinets médicaux", code: "CLINIC", icon: "🏥" },
  { name: "Avocats & Juristes", code: "LAWYER", icon: "⚖️" },
  { name: "Banques & Microfinance", code: "BANK", icon: "🏦" },
  { name: "Sociétés informatiques", code: "IT", icon: "💻" },
  { name: "Immobilières", code: "REAL_ESTATE", icon: "🏢" },
  { name: "Supermarchés", code: "SUPERMARKET", icon: "🛒" },
  { name: "Transporteurs & Transitaires", code: "LOGISTICS", icon: "🚚" },
];

export default function GoogleMapsPage() {
  const [selectedCity, setSelectedCity] = useState("Antananarivo");
  const [selectedDistrict, setSelectedDistrict] = useState("Toutes les communes / zones");
  const [selectedCategory, setSelectedCategory] = useState("Écoles & Établissements Scolaires");
  const [customKeyword, setCustomKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [existingProspects, setExistingProspects] = useState<any[]>([]);
  const [detailModalPlace, setDetailModalPlace] = useState<any | null>(null);

  // Available districts for the current city
  const availableDistricts = MADAGASCAR_DISTRICTS[selectedCity] || ["Toutes les communes / zones"];

  // Fetch existing prospects to prevent selecting duplicate contacts
  const fetchExistingProspects = async () => {
    try {
      const res = await fetch("/api/prospects?forDuplicates=true");
      const data = await res.json();
      setExistingProspects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setExistingProspects([]);
    }
  };

  useEffect(() => {
    fetchExistingProspects();
  }, []);

  // Reset district when city changes
  useEffect(() => {
    setSelectedDistrict("Toutes les communes / zones");
  }, [selectedCity]);

  // Check if place is already imported in CRM
  const isAlreadyImported = (place: any) => {
    if (!place) return false;
    return existingProspects.some((ep) => {
      if (place.googlePlaceId && ep.googlePlaceId === place.googlePlaceId) return true;
      if (place.name && ep.name && place.name.toLowerCase().trim() === ep.name.toLowerCase().trim()) return true;
      if (place.phone && ep.phone && place.phone.replace(/\s+/g, "") === ep.phone.replace(/\s+/g, "")) return true;
      return false;
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setImportSuccess(null);
    setSelectedPlaces([]);

    try {
      const queryParams = new URLSearchParams({
        city: selectedCity,
        district: selectedDistrict,
        category: selectedCategory,
        keyword: customKeyword,
      });

      const res = await fetch(`/api/google-places/search?${queryParams}`);
      const data = await res.json();

      const results = Array.isArray(data?.results) ? data.results : [];
      setPlaces(results);

      // Pre-select fresh non-duplicate places
      const freshPlaceIds = results
        .filter((p: any) => !isAlreadyImported(p))
        .map((p: any) => p.googlePlaceId);
      setSelectedPlaces(freshPlaceIds);
    } catch (e) {
      console.error(e);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [selectedCity, selectedDistrict, selectedCategory]);

  const toggleSelectPlace = (id: string, place: any) => {
    if (isAlreadyImported(place)) return; // Prevent selecting duplicates

    setSelectedPlaces((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const freshPlaces = places.filter((p) => !isAlreadyImported(p));
    if (selectedPlaces.length === freshPlaces.length) {
      setSelectedPlaces([]);
    } else {
      setSelectedPlaces(freshPlaces.map((p) => p.googlePlaceId));
    }
  };

  const handleImportSelected = async () => {
    if (selectedPlaces.length === 0) return;
    setImporting(true);

    const placesToImport = places.filter((p) => selectedPlaces.includes(p.googlePlaceId));

    try {
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placesToImport),
      });

      const result = await res.json();

      if (res.ok) {
        setImportSuccess(`${result.count || placesToImport.length} nouveaux prospects ont été importés dans votre CRM avec succès !`);
        setSelectedPlaces([]);
        fetchExistingProspects();
      }
    } catch (e) {
      console.error("Import error:", e);
    } finally {
      setImporting(false);
    }
  };

  const freshAvailableCount = places.filter((p) => !isAlreadyImported(p)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
              Module d'Extraction B2B (100 Résultats / Recherche)
            </span>
            <span className="text-xs text-slate-300 font-medium">Madagascar</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Prospection Google Places Madagascar</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Recherchez et importez jusqu'à <strong>100 établissements</strong> par secteur et par commune (Écoles, BTP, Hôtels, etc.) avec coordonnées vérifiées.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-semibold text-white flex items-center gap-2 backdrop-blur-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={handleImportSelected}
            disabled={selectedPlaces.length === 0 || importing}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{importing ? "Importation..." : `Importer (${selectedPlaces.length})`}</span>
          </button>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{importSuccess}</span>
          </div>
          <button
            onClick={() => setImportSuccess(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Advanced Filter Bar with City & Communes */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main City Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>1. Ville Principale</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {MADAGASCAR_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.region})
                </option>
              ))}
            </select>
          </div>

          {/* Sub-District / Commune Selector (e.g. Andoharanofotsy, Tanjombato, etc.) */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Commune / Quartier</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-indigo-50/50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d === "Toutes les communes / zones" ? `Toutes les zones de ${selectedCity}` : `📍 ${d}`}
                </option>
              ))}
            </select>
          </div>

          {/* Business Category */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              <span>3. Secteur d'Activité</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Keyword */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>4. Mot-clé Spécifique (Optionnel)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Lycée privé, Ecole bilingue..."
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
              >
                Lancer
              </button>
            </div>
          </div>
        </div>

        {/* Quick Activity Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Secteurs rapides :</span>
          {BUSINESS_CATEGORIES.slice(0, 7).map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Header with Select All / Actions */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1.5"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedPlaces.length > 0 && selectedPlaces.length === freshAvailableCount ? "bg-brand-600 border-brand-600 text-white" : "border-slate-300 bg-white"}`}>
              {selectedPlaces.length > 0 && <Check className="w-3 h-3" />}
            </div>
            <span>
              {selectedPlaces.length === freshAvailableCount
                ? "Tout désélectionner"
                : `Tout sélectionner (${freshAvailableCount} nouveaux)`}
            </span>
          </button>

          <span className="text-xs font-semibold text-slate-400">
            • {places.length} résultats générés pour {selectedDistrict !== "Toutes les communes / zones" ? `${selectedDistrict}, ${selectedCity}` : selectedCity}
          </span>
        </div>

        <button
          onClick={handleImportSelected}
          disabled={selectedPlaces.length === 0 || importing}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Importer la sélection ({selectedPlaces.length})</span>
        </button>
      </div>

      {/* Results Grid (Up to 100 results) */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-card">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">
              Extraction des 100 établissements pour {selectedCity}...
            </p>
          </div>
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Aucun établissement trouvé</p>
          <p className="text-xs text-slate-500">Modifiez vos critères de recherche ou sélectionnez une autre commune.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place) => {
            const isSelected = selectedPlaces.includes(place.googlePlaceId);
            const isDuplicate = isAlreadyImported(place);

            return (
              <motion.div
                key={place.googlePlaceId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4.5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                  isDuplicate
                    ? "bg-slate-50 border-slate-200 opacity-75"
                    : isSelected
                    ? "bg-indigo-50/40 border-brand-500 shadow-sm"
                    : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div>
                  {/* Top Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {place.category}
                        </span>

                        {isDuplicate && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Déjà dans votre base CRM
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {place.name}
                      </h3>
                    </div>

                    {/* Checkbox */}
                    <button
                      type="button"
                      disabled={isDuplicate}
                      onClick={() => toggleSelectPlace(place.googlePlaceId, place)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        isDuplicate
                          ? "bg-slate-200 border-slate-300 cursor-not-allowed text-slate-400"
                          : isSelected
                          ? "bg-brand-600 border-brand-600 text-white"
                          : "border-slate-300 hover:border-brand-500 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Place Information Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 my-3">
                    <p className="flex items-center gap-2 font-semibold text-slate-900">
                      <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{place.phone}</span>
                    </p>

                    <p className="flex items-start gap-2 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{place.address}</span>
                    </p>

                    {place.decisionMaker && (
                      <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                        👤 Contact : <strong className="text-slate-800">{place.decisionMaker}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                    <span>{place.rating} ({place.userRatingsTotal} avis)</span>
                  </div>

                  <button
                    onClick={() => setDetailModalPlace(place)}
                    className="text-brand-600 hover:text-brand-700 font-bold hover:underline"
                  >
                    Aperçu & Détails
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Place Preview Modal */}
      {detailModalPlace && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setDetailModalPlace(null)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-modal space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  {detailModalPlace.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{detailModalPlace.name}</h3>
                <p className="text-xs text-slate-500">{detailModalPlace.address}</p>
              </div>
              <button
                onClick={() => setDetailModalPlace(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <p>📞 <strong>Téléphone :</strong> {detailModalPlace.phone}</p>
              {detailModalPlace.phoneSecondary && <p>📞 <strong>Ligne fixe :</strong> {detailModalPlace.phoneSecondary}</p>}
              {detailModalPlace.email && <p>✉️ <strong>Email :</strong> {detailModalPlace.email}</p>}
              {detailModalPlace.website && (
                <p className="flex items-center gap-1">
                  🌐 <strong>Site Web :</strong>{" "}
                  <a href={detailModalPlace.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    {detailModalPlace.website}
                  </a>
                </p>
              )}
              {detailModalPlace.decisionMaker && <p>👤 <strong>Responsable :</strong> {detailModalPlace.decisionMaker}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDetailModalPlace(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Fermer
              </button>
              {!isAlreadyImported(detailModalPlace) && (
                <button
                  onClick={() => {
                    toggleSelectPlace(detailModalPlace.googlePlaceId, detailModalPlace);
                    setDetailModalPlace(null);
                  }}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {selectedPlaces.includes(detailModalPlace.googlePlaceId) ? "Retirer de la sélection" : "Ajouter à la sélection"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
