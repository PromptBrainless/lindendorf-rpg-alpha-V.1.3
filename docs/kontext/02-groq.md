# Groq

Die Werkstatt nimmt Groq, wenn `TEXT_ANBIETER=groq` gesetzt ist. Sonst gewinnt der erste gesetzte Schlüssel, und das ist oft xAI.

Modell auf diesem Konto: `openai/gpt-oss-120b`. `llama-3.3-70b-versatile` antwortet hier nicht mehr.
Schnittstelle: `src/game/modelle.ts`, Funktion `sprich`. Zweite Stelle: `src/lib/fremd-ki.server.ts`.
`src/lib/env.server.ts` liest die lokale `.env` und füllt nur Variablen, die in der Umgebung noch leer sind.
Der Schlüssel steht nur in `.env`. Die Datei ist in `.gitignore`. Nicht in den Chat, nicht in den Kontext, nicht ins Repo.

Geprüft: ein Aufruf von `sprich` kam als JSON zurück. Kein Browser-Test. Kein Freikontingent ohne Grenze. Bei vielen langen Aufrufen kommt 429, Tokens pro Minute.

Xiaomi MiMo-V2.6 ist offen auf Hugging Face und bezahlt über die API. Kein laufendes Testfenster, keine Gratis-Verbindung. Nicht angeschlossen.
