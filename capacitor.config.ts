import type { CapacitorConfig } from "@capacitor/cli";

// Beta-Wrapper: laedt die laufende Lindendorf-Instanz per WebView (kein Offline-Bundle,
// da das Spiel Server-Funktionen fuer Auth/KI-Text/Speicherstaende nutzt).
const config: CapacitorConfig = {
  appId: "com.lindendorf.rpg",
  appName: "Lindendorf",
  webDir: "www",
  server: {
    url: process.env.LINDENDORF_APP_URL ?? "https://legendary-space-goldfish-69vw46gvq7rrf45q9-8080.app.github.dev",
    cleartext: false,
  },
};

export default config;
