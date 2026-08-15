import { NextResponse } from "next/server";
import { getSavedSettings } from "@/lib/settings";

const MADAGASCAR_CITIES_COORDS: Record<string, { lat: number; lng: number; region: string }> = {
  Antananarivo: { lat: -18.8792, lng: 47.5079, region: "Analamanga" },
  Toamasina: { lat: -18.1499, lng: 49.4023, region: "Atsinanana" },
  Antsirabe: { lat: -19.8659, lng: 47.0333, region: "Vakinankaratra" },
  Mahajanga: { lat: -15.7167, lng: 46.3167, region: "Boeny" },
  Fianarantsoa: { lat: -21.4536, lng: 47.0857, region: "Haute Matsiatra" },
  Antsiranana: { lat: -12.2787, lng: 49.2917, region: "Diana" },
  Toliara: { lat: -23.3516, lng: 43.6675, region: "Atsimo-Andrefana" },
  "Nosy Be": { lat: -13.3167, lng: 48.2667, region: "Diana" },
  Sambava: { lat: -14.2667, lng: 50.1667, region: "SAVA" },
  Taolagnaro: { lat: -25.0333, lng: 46.9833, region: "Anosy" },
};

const SCHOOL_NAMES = [
  "École Privée Saint-Michel",
  "Collège & Lycée La Providence",
  "Établissement Scolaire Les Petits Génies",
  "École Primaire Bilingue Les Papillons",
  "Lycée Privé Moderne L'Excellence",
  "Institution Sainte-Anne",
  "École Secondaire Les Lauriers",
  "Complexe Scolaire L'Espérance",
  "Collège Privé La Source",
  "École Internationale de l'Océan Indien",
  "Établissement Privé Les Hirondelles",
  "Lycée Saint-Joseph",
  "École Maternelle & Primaire Le Nid d'Or",
  "Institution Chrétienne La Victoire",
  "École Bilingue L'Étoile du Savoir",
  "Collège Privé Les Palmiers",
  "Établissement Scolaire La Renaissance",
  "École Privée Sainte-Thérèse",
  "Lycée Technique & Général Le Progrès",
  "Académie Scolaire de Madagascar",
  "École Fondamentale Les Bâtisseurs",
  "Institution Scolaire L'Avenir",
  "École Maternelle & Primaire Les Poussins",
  "Complexe Éducatif Saint-Gabriel",
  "Collège & Lycée Les Étoiles",
];

function generateSimulatedPlaces(category: string, city: string, district?: string, keyword?: string) {
  const coords = MADAGASCAR_CITIES_COORDS[city] || MADAGASCAR_CITIES_COORDS["Antananarivo"];
  const isSchoolCategory = category.toLowerCase().includes("école") || category.toLowerCase().includes("ecole") || category.toLowerCase().includes("scolaire");

  const prefixes = ["Société", "Entreprise", "Groupe", "Agence", "Cabinet", "Établissement", "Comptoir"];
  const suffixes = ["Madagascar", "S.A.", "SARL", "Océan Indien", "Services", "Plus", "LevelUp"];
  const decisionMakers = [
    "Rakotomalala Jean (Directeur)",
    "Rasoanirina Marie (Responsable Pédagogique)",
    "Andriamparany Hery (Fondateur)",
    "Ranaivomanana Patrick (Directeur Général)",
    "Razafindrakoto Lova (Directrice)",
    "Ramanantsoa Eric (Secrétaire Général)",
    "Ravelomanantsoa Faniry (Proviseur)",
    "Randriamampionona Toky (Directeur Administratif)",
    "Ratsimba Armand (Responsable Établissement)",
    "Andrianasolo Fara (Directrice des Études)",
  ];

  const results = [];
  const count = 100; // Generated 100 records per search

  const districtLabel = district && district !== "Toutes les communes / zones" ? district : "";
  const locationLabel = districtLabel ? `${districtLabel}, ${city}` : city;

  for (let i = 1; i <= count; i++) {
    let baseName = "";

    if (isSchoolCategory) {
      const schoolTemplate = SCHOOL_NAMES[(i - 1) % SCHOOL_NAMES.length];
      const schoolSuffix = i > SCHOOL_NAMES.length ? ` Annexe ${Math.ceil(i / SCHOOL_NAMES.length)}` : "";
      baseName = keyword ? `${keyword} ${schoolSuffix}`.trim() : `${schoolTemplate} ${districtLabel || city}${schoolSuffix}`.trim();
    } else {
      const prefix = prefixes[i % prefixes.length];
      const suffix = suffixes[(i + 2) % suffixes.length];
      baseName = keyword ? `${keyword} ${suffix} N°${i}` : `${prefix} ${category} ${locationLabel} ${suffix} ${i}`;
    }

    const jitterLat = coords.lat + (Math.random() - 0.5) * 0.08;
    const jitterLng = coords.lng + (Math.random() - 0.5) * 0.08;
    const telOperator = ["034", "032", "033", "038"][i % 4];
    const telRandom = Math.floor(1000000 + Math.random() * 9000000);
    const phone = `+261 ${telOperator.substring(1)} ${telRandom.toString().slice(0, 2)} ${telRandom.toString().slice(2, 5)} ${telRandom.toString().slice(5, 7)}`;
    const sanitizedName = baseName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 18);

    const streetLetter = String.fromCharCode(65 + (i % 26));
    const streetNumber = i * 4 + 1;
    const address = `Lot ${streetLetter}${streetNumber} Bis, ${locationLabel}, Madagascar`;

    results.push({
      googlePlaceId: `place_sim_${city.toLowerCase()}_${(districtLabel || "all").toLowerCase().replace(/[^a-z]/g, "")}_${i}_${Date.now()}`,
      name: baseName,
      category: isSchoolCategory ? "Écoles & Établissements Scolaires" : category,
      phone,
      phoneSecondary: `+261 20 22 ${Math.floor(10000 + Math.random() * 90000)}`,
      email: `contact@${sanitizedName || "etablissement"}.mg`,
      address,
      city: locationLabel,
      region: coords.region,
      website: `https://www.${sanitizedName || "etablissement"}.mg`,
      decisionMaker: decisionMakers[i % decisionMakers.length],
      facebook: `https://facebook.com/${sanitizedName}`,
      linkedin: `https://linkedin.com/company/${sanitizedName}`,
      rating: parseFloat((3.9 + Math.random() * 1.1).toFixed(1)),
      userRatingsTotal: Math.floor(8 + Math.random() * 85),
      lat: jitterLat,
      lng: jitterLng,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(baseName + " " + locationLabel)}`,
      openingHours: "Lun - Ven: 07:30 - 17:00",
    });
  }

  return results;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "Écoles & Établissements Scolaires";
    const city = searchParams.get("city") || "Antananarivo";
    const district = searchParams.get("district") || "";
    const keyword = searchParams.get("keyword") || "";

    const districtLabel = district && district !== "Toutes les communes / zones" ? district : "";
    const locationQuery = districtLabel ? `${districtLabel} ${city}` : city;

    const settings = getSavedSettings();
    const googleApiKey = settings.googleApiKey || process.env.GOOGLE_PLACES_API_KEY;

    // If official Google API key is configured, call official API
    if (googleApiKey && googleApiKey.trim() !== "") {
      try {
        const queryText = keyword
          ? `${keyword} ${locationQuery} Madagascar`
          : `${category} ${locationQuery} Madagascar`;

        const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(queryText)}&key=${googleApiKey.trim()}`;

        const res = await fetch(googleUrl);
        const data = await res.json();

        if (data.status === "OK" && data.results && data.results.length > 0) {
          // Format place results
          const formatted = await Promise.all(
            data.results.map(async (p: any) => {
              let phone = "+261 34 00 000 00";
              let website = null;
              let openingHours = null;

              // Enrich with Place Details if place_id exists
              if (p.place_id) {
                try {
                  const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=name,formatted_phone_number,international_phone_number,website,opening_hours&key=${googleApiKey.trim()}`;
                  const detailRes = await fetch(detailUrl);
                  const detailData = await detailRes.json();
                  if (detailData.result) {
                    phone = detailData.result.formatted_phone_number || detailData.result.international_phone_number || phone;
                    website = detailData.result.website || null;
                    if (detailData.result.opening_hours?.weekday_text) {
                      openingHours = detailData.result.opening_hours.weekday_text.join(", ");
                    }
                  }
                } catch (dErr) {
                  // Keep fallback phone
                }
              }

              return {
                googlePlaceId: p.place_id,
                name: p.name,
                category: category,
                address: p.formatted_address || `${locationQuery}, Madagascar`,
                city: locationQuery,
                region: MADAGASCAR_CITIES_COORDS[city]?.region || "Madagascar",
                rating: p.rating || 4.5,
                userRatingsTotal: p.user_ratings_total || 10,
                lat: p.geometry?.location?.lat,
                lng: p.geometry?.location?.lng,
                mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}&query_place_id=${p.place_id}`,
                phone,
                website,
                openingHours,
              };
            })
          );

          return NextResponse.json({
            source: "OFFICIAL_GOOGLE_PLACES_API",
            results: formatted,
            googleStatus: data.status,
          });
        }
      } catch (err) {
        console.warn("Official Google Places API failed, falling back to simulator:", err);
      }
    }

    // Fallback/Simulated Google Places results for Madagascar (100 places batch)
    const simulated = generateSimulatedPlaces(category, city, districtLabel, keyword);
    return NextResponse.json({
      source: "GOOGLE_PLACES_SIMULATION_MADAGASCAR",
      results: simulated,
      hasConfiguredKey: !!(googleApiKey && googleApiKey.trim()),
    });
  } catch (error) {
    console.error("GET /api/google-places/search error:", error);
    return NextResponse.json({ error: "Erreur lors de la recherche Google Places" }, { status: 500 });
  }
}
