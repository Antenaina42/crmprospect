import { NextResponse } from "next/server";

const MADAGASCAR_CITIES_COORDS: Record<string, { lat: number; lng: number; region: string }> = {
  Antananarivo: { lat: -18.8792, lng: 47.5079, region: "Analamanga" },
  Toamasina: { lat: -18.1499, lng: 49.4023, region: "Atsinanana" },
  Antsirabe: { lat: -19.8659, lng: 47.0333, region: "Vakinankaratra" },
  Mahajanga: { lat: -15.7225, lng: 46.3155, region: "Boeny" },
  Fianarantsoa: { lat: -21.4527, lng: 47.0857, region: "Haute Matsiatra" },
  Antsiranana: { lat: -12.2787, lng: 49.2917, region: "Diana" },
  Toliara: { lat: -23.3516, lng: 43.6855, region: "Atsimo-Andrefana" },
  "Nosy Be": { lat: -13.3134, lng: 48.2583, region: "Diana" },
  Sambava: { lat: -14.2667, lng: 50.1667, region: "SAVA" },
  Taolagnaro: { lat: -25.0381, lng: 46.9981, region: "Anosy" },
};

// Generates realistic Madagascar Place search results
function generateSimulatedPlaces(category: string, city: string, keyword: string) {
  const cityInfo = MADAGASCAR_CITIES_COORDS[city] || MADAGASCAR_CITIES_COORDS["Antananarivo"];

  const prefixes = [
    "SOCIETE MADA",
    "MADAGASCAR",
    "TANA",
    "OCEAN INDIEN",
    "GROUPE",
    "AGENCE",
    "LE GRAND",
    "LE PETIT",
    "EXPRESS",
    "COMPAGNIE MADA",
  ];

  const suffixes = ["S.A.R.L.", "S.A.", "O.I.", "SERVICE", "CENTER", "COMMERCIAL", "DISTRIBUTION"];

  const streets: Record<string, string[]> = {
    Antananarivo: [
      "Rue Hydrocarbures, Ankorondrano",
      "Avenue de l'Indépendance, Analakely",
      "Immeuble Pradon, Antanimena",
      "Lot II M 40, Isoraka",
      "Route Nationale 7, Tanjombato",
      "Batiment Kube, Zone Futura Andranomahery",
      "Rue Radama I, Tsaralalàna",
      "Enceinte Galaxy, Andraharo",
    ],
    Toamasina: [
      "Boulevard Joffre",
      "Boulevard Augagneur",
      "Rue du Commerce, Port Tamatave",
      "Avenue de la Réunion",
    ],
    Mahajanga: ["Boulevard Poincare", "Avenue Gillon", "Bord de Mer, La Corniche"],
    Antsirabe: ["Avenue des Thermes", "Rue Joseph Ramanantsoa", "Grande Avenue"],
  };

  const currentCityStreets = streets[city] || streets["Antananarivo"];

  const count = 8;
  const results = [];

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[i % suffixes.length];
    const street = currentCityStreets[i % currentCityStreets.length];

    const placeName = keyword
      ? `${keyword.toUpperCase()} - ${city.toUpperCase()} ${i + 1}`
      : `${prefix} ${category.toUpperCase()} ${suffix}`;

    const phoneProvider = i % 3 === 0 ? "34" : i % 3 === 1 ? "32" : "33";
    const phoneNum = Math.floor(100000 + Math.random() * 900000);
    const phone = `+261 ${phoneProvider} ${phoneNum.toString().substring(0, 2)} ${phoneNum.toString().substring(2, 5)} ${phoneNum.toString().substring(5, 7)}`;

    const slug = placeName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 15);

    results.push({
      googlePlaceId: `ChIJ_mada_place_${city.toLowerCase()}_${i}_${Date.now()}`,
      name: placeName,
      category: category || "Entreprise",
      phone: phone,
      phoneSecondary: i % 2 === 0 ? `+261 20 22 ${Math.floor(10000 + Math.random() * 90000)}` : null,
      address: `${street}, ${city}`,
      city: city,
      region: cityInfo.region,
      website: i % 2 === 0 ? `https://www.${slug}.mg` : null,
      email: i % 2 === 0 ? `contact@${slug}.mg` : null,
      rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
      userRatingsTotal: Math.floor(15 + Math.random() * 300),
      lat: cityInfo.lat + (Math.random() - 0.5) * 0.05,
      lng: cityInfo.lng + (Math.random() - 0.5) * 0.05,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + " " + city)}`,
      openingHours: "Lun - Ven: 08:00 - 17:00",
    });
  }

  return results;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "Entreprises BTP";
    const city = searchParams.get("city") || "Antananarivo";
    const keyword = searchParams.get("keyword") || "";
    const radius = searchParams.get("radius") || "10";

    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;

    // If official Google API key is configured, call official API
    if (googleApiKey && googleApiKey.trim() !== "") {
      try {
        const queryText = `${keyword} ${category} ${city} Madagascar`;
        const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(queryText)}&key=${googleApiKey}`;

        const res = await fetch(googleUrl);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const formatted = data.results.map((p: any) => ({
            googlePlaceId: p.place_id,
            name: p.name,
            category: category,
            address: p.formatted_address || `${city}, Madagascar`,
            city: city,
            region: MADAGASCAR_CITIES_COORDS[city]?.region || "Madagascar",
            rating: p.rating || 4.5,
            userRatingsTotal: p.user_ratings_total || 10,
            lat: p.geometry?.location?.lat,
            lng: p.geometry?.location?.lng,
            mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}&query_place_id=${p.place_id}`,
            phone: "+261 34 00 000 00", // Will be enriched on detail call
          }));
          return NextResponse.json({ source: "OFFICIAL_GOOGLE_PLACES_API", results: formatted });
        }
      } catch (err) {
        console.warn("Official Google Places API failed, falling back to simulator:", err);
      }
    }

    // Fallback/Simulated Google Places results for Madagascar
    const simulated = generateSimulatedPlaces(category, city, keyword);
    return NextResponse.json({
      source: "GOOGLE_PLACES_SIMULATION_MADAGASCAR",
      results: simulated,
    });
  } catch (error) {
    console.error("GET /api/google-places/search error:", error);
    return NextResponse.json({ error: "Erreur lors de la recherche Google Places" }, { status: 500 });
  }
}
