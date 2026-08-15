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
