"use client";

import React, { useState } from "react";
import {
  MapPin,
  Search,
  Filter,
  CheckSquare,
  Square,
  ExternalLink,
  Star,
  Download,
  Building2,
  Phone,
  Globe,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "Entreprises BTP",
  "Agences de voyage",
  "Vente de véhicules",
  "Garages automobiles",
  "Hôtels",
  "Restaurants",
  "Pharmacies",
  "Cliniques",
  "Cabinets médicaux",
  "Dentistes",
  "Avocats",
  "Banques",
  "Assurances",
  "Architectes",
  "Ingénieurs",
  "Cabinets comptables",
  "Cabinets de recrutement",
  "Sociétés informatiques",
  "Entreprises industrielles",
  "Imprimeries",
  "Agences immobilières",
  "Boutiques",
  "Supermarchés",
  "Magasins de matériaux",
  "Transporteurs",
  "Transitaires",
  "Universités",
  "Écoles primaires",
  "Collèges",
  "Lycées",
  "Écoles privées",
  "Centres de formation",
  "ONG",
  "Associations",
  "Coopératives",
  "Centres commerciaux",
];

const CITIES = [
  "Antananarivo",
  "Toamasina",
  "Antsirabe",
  "Mahajanga",
  "Fianarantsoa",
  "Antsiranana",
  "Toliara",
  "Nosy Be",
  "Sambava",
  "Taolagnaro",
];

export default function GoogleMapsProspectionPage() {
  const [selectedCategory, setSelectedCategory] = useState("Entreprises BTP");
  const [selectedCity, setSelectedCity] = useState("Antananarivo");
  const [keyword, setKeyword] = useState("");
  const [radius, setRadius] = useState("10");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState("");

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setImportSuccessMessage("");
    setSelectedPlaces([]);

    try {
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        city: selectedCity,
        keyword: keyword,
        radius: radius,
      });

      const res = await fetch(`/api/google-places/search?${queryParams}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Failed to search Google Places", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectPlace = (id: string) => {
    if (selectedPlaces.includes(id)) {
      setSelectedPlaces(selectedPlaces.filter((pId) => pId !== id));
    } else {
      setSelectedPlaces([...selectedPlaces, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPlaces.length === results.length) {
      setSelectedPlaces([]);
    } else {
      setSelectedPlaces(results.map((r) => r.googlePlaceId));
    }
  };

  const handleImportSelected = async () => {
    if (selectedPlaces.length === 0) return;
    setImporting(true);

    try {
      const placesToImport = results.filter((r) => selectedPlaces.includes(r.googlePlaceId));

      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(placesToImport),
      });

      if (res.ok) {
        setImportSuccessMessage(
          `${placesToImport.length} prospect(s) importé(s) avec succès dans votre base de données !`
        );
        setSelectedPlaces([]);
      }
    } catch (err) {
      console.error("Import failed", err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
              API Officielle Google Places
            </span>
            <span className="text-xs text-slate-400">Sans scraping / 100% Conforme</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Moteur de Prospection Google Places Madagascar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ciblez et importez directement des entreprises locales dans votre base de prospection CRM.
          </p>
        </div>

        {selectedPlaces.length > 0 && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleImportSelected}
            disabled={importing}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {importing ? "Importation..." : `Importer la sélection (${selectedPlaces.length})`}
            </span>
          </motion.button>
        )}
      </div>

      {importSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{importSuccessMessage}</span>
        </div>
      )}

      {/* Search Filter Form */}
      <form
        onSubmit={handleSearch}
        className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Catégorie B2B</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Ville / Région
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mot clé / Raison Sociale
          </label>
          <input
            type="text"
            placeholder="Ex: Construction, Carlton, etc."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Rayon (km)
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Rechercher via API</span>
          </button>
        </div>
      </form>

      {/* Results Header & Bulk Selection */}
      {results.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              {selectedPlaces.length === results.length ? (
                <CheckSquare className="w-4 h-4 text-brand-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Tout Sélectionner ({results.length} Entreprises)</span>
            </button>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {selectedPlaces.length} sélectionné(s)
          </span>
        </div>
      )}

      {/* Results Grid Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-700">Interrogation de l'API Google Places...</p>
          <p className="text-[11px] text-slate-400">Recherche des fiches à {selectedCity}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Aucune entreprise affichée</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Sélectionnez une catégorie et une ville de Madagascar ci-dessus, puis cliquez sur "Rechercher via API".
          </p>
          <button
            onClick={() => handleSearch()}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800"
          >
            Lancer la recherche par défaut ({selectedCategory})
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((place) => {
            const isSelected = selectedPlaces.includes(place.googlePlaceId);

            return (
              <motion.div
                key={place.googlePlaceId}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl bg-white border transition-all duration-200 ${
                  isSelected
                    ? "border-brand-500 ring-2 ring-brand-500/10 shadow-md"
                    : "border-slate-200/80 shadow-card hover:shadow-card-hover"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleSelectPlace(place.googlePlaceId)}
                      className="mt-1 text-slate-400 hover:text-brand-600"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-brand-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {place.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-500 stroke-none" />
                          <span>{place.rating}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({place.userRatingsTotal})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors shrink-0"
                    title="Voir dans Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </div>

                  {place.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{place.phone}</span>
                    </div>
                  )}

                  {place.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline truncate"
                      >
                        {place.website}
                      </a>
                    </div>
                  )}

                  {place.openingHours && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{place.openingHours}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
