import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

// Helper to get settings file path
const getSettingsFilePath = () => {
  return path.resolve(process.cwd(), ".settings.json");
};

// Read current settings
export function getSavedSettings(): Record<string, string> {
  const defaults: Record<string, string> = {
    googleApiKey: process.env.GOOGLE_PLACES_API_KEY || "",
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpPort: process.env.SMTP_PORT || "587",
    smtpUser: process.env.SMTP_USER || "",
    smtpPass: process.env.SMTP_PASS || "",
    whatsAppToken: process.env.WHATSAPP_TOKEN || "",
    voipEndpoint: process.env.VOIP_ENDPOINT || "",
  };

  try {
    const filePath = getSettingsFilePath();
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return { ...defaults, ...data };
    }
  } catch (e) {
    console.error("Error reading settings file:", e);
  }

  return defaults;
}

// Save settings to file and environment
export function saveSettings(newSettings: Record<string, string>) {
  try {
    const filePath = getSettingsFilePath();
    const current = getSavedSettings();
    const updated = { ...current, ...newSettings };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");

    // Apply to running process environment
    if (updated.googleApiKey) {
      process.env.GOOGLE_PLACES_API_KEY = updated.googleApiKey;
    }
    if (updated.smtpHost) process.env.SMTP_HOST = updated.smtpHost;
    if (updated.smtpUser) process.env.SMTP_USER = updated.smtpUser;
    if (updated.smtpPass) process.env.SMTP_PASS = updated.smtpPass;
    if (updated.whatsAppToken) process.env.WHATSAPP_TOKEN = updated.whatsAppToken;
    if (updated.voipEndpoint) process.env.VOIP_ENDPOINT = updated.voipEndpoint;

    // Update .env and .env.production files if accessible
    const envPaths = [
      path.resolve(process.cwd(), ".env.production"),
      path.resolve(process.cwd(), ".env"),
    ];

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, "utf-8");
        if (content.includes("GOOGLE_PLACES_API_KEY=")) {
          content = content.replace(/GOOGLE_PLACES_API_KEY=.*/, `GOOGLE_PLACES_API_KEY="${updated.googleApiKey || ""}"`);
        } else {
          content += `\nGOOGLE_PLACES_API_KEY="${updated.googleApiKey || ""}"`;
        }
        fs.writeFileSync(envPath, content, "utf-8");
      }
    }

    return updated;
  } catch (e) {
    console.error("Error saving settings:", e);
    return null;
  }
}

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
