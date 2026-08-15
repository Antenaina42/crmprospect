import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavedSettings, saveSettings } from "@/lib/settings";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const testKey = searchParams.get("testKey");

    // Live test Google Places API Key
    if (testKey) {
      try {
        const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotel+antananarivo+madagascar&key=${encodeURIComponent(testKey.trim())}`;
        const res = await fetch(testUrl);
        const data = await res.json();

        if (data.status === "OK" || (data.results && data.results.length > 0)) {
          return NextResponse.json({
            valid: true,
            status: data.status,
            message: "Clé Google Places API valide et opérationnelle ! Résultats reçus avec succès.",
            sampleCount: data.results?.length || 0,
          });
        } else {
          let errorExplanation = data.error_message || data.status || "Clé invalide";
          if (data.status === "REQUEST_DENIED") {
            errorExplanation = "Requête refusée par Google. Vérifiez que l'API 'Places API' est bien ACTIVÉE dans votre console Google Cloud et que la clé n'est pas bloquée par une restriction d'adresse IP/domaine.";
          } else if (data.status === "OVER_QUERY_LIMIT") {
            errorExplanation = "Quota Google Places dépassé ou facturation (billing) non activée sur votre compte Google Cloud.";
          }

          return NextResponse.json({
            valid: false,
            status: data.status,
            error: errorExplanation,
            rawErrorMessage: data.error_message,
          });
        }
      } catch (err: any) {
        return NextResponse.json({
          valid: false,
          error: "Erreur de connexion aux serveurs Google : " + (err?.message || "Inconnue"),
        });
      }
    }

    const settings = getSavedSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des paramètres" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserRole = (session?.user as any)?.role;
    if (currentUserRole !== "SUPER_ADMIN" && currentUserRole !== "ADMIN") {
      return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    const body = await req.json();
    const updated = saveSettings(body);

    if (!updated) {
      return NextResponse.json({ error: "Échec de l'enregistrement des paramètres" }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: error?.message || "Erreur serveur" }, { status: 500 });
  }
}
