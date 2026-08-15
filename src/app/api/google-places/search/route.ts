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
};

function generateSimulatedPlaces(category: string, city: string, keyword?: string) {
  const coords = MADAGASCAR_CITIES_COORDS[city] || MADAGASCAR_CITIES_COORDS["Antananarivo"];
  const prefixes = ["Société", "Entreprise", "Groupe", "Agence", "Cabinet", "Établissement", "Comptoir"];
  const suffixes = ["Madagascar", "S.A.", "SARL", "Océan Indien", "Services", "Plus", "LevelUp"];
  const decisionMakers = [
    "Rakotomalala Jean",
    "Rasoanirina Marie",
    "Andriamparany Hery",
    "Ranaivomanana Patrick",
    "Razafindrakoto Lova",
    "Ramanantsoa Eric",
    "Ravelomanantsoa Faniry",
    "Randriamampionona Toky",
  ];

  const results = [];
  const count = 12;

  for (let i = 1; i <= count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[(i + 2) % suffixes.length];
    const baseName = keyword ? `${keyword} ${suffix}` : `${prefix} ${category} ${city} ${suffix}`;
    const jitterLat = coords.lat + (Math.random() - 0.5) * 0.05;
    const jitterLng = coords.lng + (Math.random() - 0.5) * 0.05;
    const telOperator = ["034", "032", "033", "038"][i % 4];
    const telRandom = Math.floor(1000000 + Math.random() * 9000000);
    const phone = `+261 ${telOperator.substring(1)} ${telRandom.toString().slice(0, 2)} ${telRandom.toString().slice(2, 5)} ${telRandom.toString().slice(5, 7)}`;
    const sanitizedName = baseName.toLowerCase().replace(/[^a-z0-9]/g, "");

    results.push({
      googlePlaceId: `place_sim_${city.toLowerCase()}_${i}_${Date.now()}`,
      name: baseName,
      category,
      phone,
      phoneSecondary: `+261 20 22 ${Math.floor(10000 + Math.random() * 90000)}`,
      email: `contact@${sanitizedName}.mg`,
      address: `Lot ${String.fromCharCode(65 + (i % 26))}${i * 12} Bis, ${city}, Madagascar`,
      city,
      region: coords.region,
      website: `https://www.${sanitizedName}.mg`,
      decisionMaker: decisionMakers[i % decisionMakers.length],
      facebook: `https://facebook.com/${sanitizedName}`,
      linkedin: `https://linkedin.com/company/${sanitizedName}`,
      rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      userRatingsTotal: Math.floor(5 + Math.random() * 45),
      lat: jitterLat,
      lng: jitterLng,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(baseName + " " + city)}`,
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

    const settings = getSavedSettings();
    const googleApiKey = settings.googleApiKey || process.env.GOOGLE_PLACES_API_KEY;

    // If official Google API key is configured, call official API
    if (googleApiKey && googleApiKey.trim() !== "") {
      try {
        const queryText = keyword ? `${keyword} ${city} Madagascar` : `${category} ${city} Madagascar`;
        const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(queryText)}&key=${googleApiKey.trim()}`;

        const res = await fetch(googleUrl);
        const data = await res.json();

        if (data.status === "OK" && data.results && data.results.length > 0) {
          // Format place results
          const formatted = await Promise.all(
            data.results.slice(0, 15).map(async (p: any) => {
              let phone = "+261 34 00 000 00";
              let website = null;
              let openingHours = null;

              // Optionally enrich with Place Details if place_id exists
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
                address: p.formatted_address || `${city}, Madagascar`,
                city: city,
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
        } else {
          console.warn("Google Places API returned status:", data.status, data.error_message);
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
      hasConfiguredKey: !!(googleApiKey && googleApiKey.trim()),
    });
  } catch (error) {
    console.error("GET /api/google-places/search error:", error);
    return NextResponse.json({ error: "Erreur lors de la recherche Google Places" }, { status: 500 });
  }
}
