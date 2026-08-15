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

const BUSINESS_CATEGORIES = [
  { name: "Entreprises BTP", code: "BTP", icon: "🏗️" },
  { name: "Agences de voyage", code: "TRAVEL", icon: "✈️" },
  { name: "Vente de véhicules", code: "AUTO_DEALER", icon: "🚗" },
  { name: "Garages automobiles", code: "AUTO_GARAGE", icon: "🔧" },
  { name: "Hôtels", code: "HOTEL", icon: "🏨" },
  { name: "Restaurants", code: "RESTAURANT", icon: "🍽️" },
  { name: "Pharmacies", code: "PHARMACY", icon: "💊" },
  { name: "Cliniques", code: "CLINIC", icon: "🏥" },
  { name: "Avocats & Juristes", code: "LAWYER", icon: "⚖️" },
  { name: "Banques & Microfinance", code: "BANK", icon: "🏦" },
  { name: "Sociétés informatiques", code: "IT", icon: "💻" },
  { name: "Immobilières", code: "REAL_ESTATE", icon: "🏢" },
  { name: "Supermarchés", code: "SUPERMARKET", icon: "🛒" },
  { name: "Transporteurs & Transitaires", code: "LOGISTICS", icon: "🚚" },
  { name: "Centres de formation & Écoles", code: "EDUCATION", icon: "🎓" },
];

export default function GoogleMapsPage() {
  const [selectedCity, setSelectedCity] = useState("Antananarivo");
  const [selectedCategory, setSelectedCategory] = useState("Entreprises BTP");
  const [customKeyword, setCustomKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [existingProspects, setExistingProspects] = useState<any[]>([]);
  const [detailModalPlace, setDetailModalPlace] = useState<any | null>(null);

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
        category: selectedCategory,
        keyword: customKeyword,
      });

      const res = await fetch(`/api/google-places/search?${queryParams}`);
      const data = await res.json();

      const results = Array.isArray(data?.results) ? data.results : [];
      setPlaces(results);

      // Pre-select non-duplicate places
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
  }, [selectedCity, selectedCategory]);

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

    try {
      const placesToImport = places
        .filter((p) => selectedPlaces.includes(p.googlePlaceId) && !isAlreadyImported(p))
        .map((p) => ({
          ...p,
          status: "Nouveau",
          priority: "Moyenne",
        }));

      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placesToImport),
      });

      const data = await res.json();
      if (res.ok) {
        setImportSuccess(`${data.count || placesToImport.length} prospect(s) importé(s) avec succès dans votre CRM !`);
        setSelectedPlaces([]);
        fetchExistingProspects();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
              API Google Places Officielle
            </span>
            <span className="text-xs text-slate-300">Prospection B2B Madagascar</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Recherche d'Entreprises par Google Maps</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Ciblez et importez directement les entreprises par ville et par catégorie. Les contacts déjà enregistrés sont automatiquement protégés et verrouillés.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Prospects en base CRM</span>
            <span className="text-lg font-bold text-amber-300">{existingProspects.length} enregistrés</span>
          </div>
        </div>
      </div>

      {/* Control Panel: City & Category Selectors */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              1. Sélectionner la Ville :
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {MADAGASCAR_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  📍 {c.name} ({c.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              2. Sélectionner le Secteur :
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat.code} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              3. Mot-clé Spécifique (Optionnel) :
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Akorondrano, Analakely, BTP..."
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-card">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{importSuccess}</span>
          </div>
          <a
            href="/prospects"
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
          >
            Voir les prospects ➔
          </a>
        </div>
      )}

      {/* Results Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center gap-1.5"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  selectedPlaces.length > 0 ? "bg-brand-600 border-brand-600 text-white" : "border-slate-300 bg-white"
                }`}
              >
                {selectedPlaces.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Tout sélectionner (Nouveaux uniquement)</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              | {places.length} entreprise(s) trouvée(s)
            </span>
          </div>

          <button
            onClick={handleImportSelected}
            disabled={selectedPlaces.length === 0 || importing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>
              {importing ? "Importation..." : `Importer les ${selectedPlaces.length} prospects sélectionnés`}
            </span>
          </button>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-16 p-6">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">Aucune entreprise trouvée</p>
            <p className="text-xs text-slate-500">Essayez une autre catégorie ou une autre ville de Madagascar.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {places.map((place) => {
              const alreadyInDb = isAlreadyImported(place);
              const isSelected = selectedPlaces.includes(place.googlePlaceId);

              return (
                <div
                  key={place.googlePlaceId}
                  className={`p-4 transition-colors flex items-start gap-4 ${
                    alreadyInDb ? "bg-slate-50/70 opacity-80" : isSelected ? "bg-brand-50/30" : "hover:bg-slate-50/50"
                  }`}
                >
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => toggleSelectPlace(place.googlePlaceId, place)}
                    disabled={alreadyInDb}
                    className={`mt-1 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      alreadyInDb
                        ? "bg-slate-200 border-slate-300 cursor-not-allowed"
                        : isSelected
                        ? "bg-brand-600 border-brand-600 text-white"
                        : "border-slate-300 bg-white hover:border-brand-500"
                    }`}
                  >
                    {alreadyInDb ? (
                      <Check className="w-3 h-3 text-slate-500" />
                    ) : (
                      isSelected && <Check className="w-3 h-3 stroke-[3]" />
                    )}
                  </button>

                  {/* Main Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{place.name}</h4>

                      {alreadyInDb ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-amber-600" />
                          <span>Déjà dans votre base CRM (Non sélectionnable)</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Nouveau Prospect
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {place.phone}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {place.address}
                      </span>
                      {place.rating && (
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold">
                          <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                          {place.rating} / 5.0 ({place.userRatingsTotal} avis)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setDetailModalPlace(place)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                  >
                    Aperçu
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Preview Popup Modal with Click-Outside Backdrop Close */}
      {detailModalPlace && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setDetailModalPlace(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-modal space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {detailModalPlace.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{detailModalPlace.name}</h3>
              </div>
              <button
                onClick={() => setDetailModalPlace(null)}
                className="p-1 text-slate-400 hover:text-slate-900 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              <p><strong>Téléphone :</strong> {detailModalPlace.phone}</p>
              <p><strong>Adresse :</strong> {detailModalPlace.address}</p>
              <p><strong>Ville :</strong> {detailModalPlace.city}</p>
              {detailModalPlace.website && (
                <p>
                  <strong>Site Web :</strong>{" "}
                  <a href={detailModalPlace.website} target="_blank" className="text-brand-600 hover:underline">
                    {detailModalPlace.website}
                  </a>
                </p>
              )}
              {isAlreadyImported(detailModalPlace) && (
                <p className="text-amber-700 font-bold bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                  ⚠️ Ce prospect existe déjà dans votre base de données CRM.
                </p>
              )}
            </div>

            <button
              onClick={() => setDetailModalPlace(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
            >
              Fermer l'aperçu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
