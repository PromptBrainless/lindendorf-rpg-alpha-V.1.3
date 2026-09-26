# Lindendorf

**Lindendorf** ist ein illustriertes, browserbasiertes Dark-Fantasy-Textabenteuer. Ein gewöhnlicher Mensch erreicht ein armes Tal, dessen Vorräte verschwinden, dessen Glocke für die falschen Leute läutet und dessen Alltag aus Arbeit, Schuld, Hunger und Ausweglosigkeit besteht.

Aktueller Ausbau: [`docs/ERNEUERUNGSPLAN.md`](docs/ERNEUERUNGSPLAN.md). Register: [`docs/QUESTREGISTER.md`](docs/QUESTREGISTER.md). Hauptprojekt: [`PromptBrainless/lindendorf-rpg-alpha-V.1.1`](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1). Vergleichsarchiv: [`export/spielversion1-7170673/`](export/spielversion1-7170673/). WorldForge Studio ist getrennt: [`PromptBrainless/worldforge-studio`](https://github.com/PromptBrainless/worldforge-studio).

Das Spiel verbindet ausführliche deutsche Erzähltexte mit drei Attributen, W10-Proben, wissensbasierten Freischaltungen, Nebenquests, mehreren Lösungswegen und unterschiedlichen Enden. Entschlüsse und Spurensuche bestimmen, wer im Dorf noch eine Zukunft hat und wer am Ende nur noch ein Rest aus Schuld und Arbeit bleibt.

## Spielumfang

Der aktuelle Stand enthält Heldenerstellung, einen bebilderten Prolog mit erster Würfelentscheidung, eine offene Dorf-Schleife, Rathaus, Taverne, Brunnen, Mühle, Schmiede, Apotheke, mehrere Nebenquests und einen aktiven Übergang zum Lager- und Endepfad. Chronik, Wissen und die Hauptquest-Reihen sind an die Implementierung gebunden; die Welt bleibt materiell und düster.

Sechs neue Hintergründe und vier neue Figurenporträts ergänzen die bestehende dunkle Low-Fantasy-Ölmalerei. Die Oberfläche ist für Desktop und Mobilgeräte ausgelegt. Ein Spielstand kann lokal gespeichert werden, und die Grundlagen für die Systemsteuerung und den Ton sind im Projekt vorhanden.

Eine Systemsteuerung (Taste `E`) regelt Ton, Bild, Text, Spielverhalten und Spielstände. Der Ton entsteht vollständig im Browser: Wind, Wasser, Feuer, Hammerschlag und Stimmengemurmel folgen dem Lauf der Szene. Die Ausrüstung, die Spielstände und die Wissenslogik stehen im aktiven Code des Hauptprojekts.

## Technik

- React und TypeScript
- Vite/Nitro-Build
- Tailwind-basierte Oberfläche
- Zod-validierte Inhaltsstruktur
- prozeduraler Ton über die Web Audio API, ohne Audioarchiv
- lokaler Browser-Spielstand und lokale Einstellungen
- deterministische Wissens- und Assetprüfungen

## Lokal starten

```bash
npm install
npm run dev
```

Die Entwicklungsseite läuft standardmäßig auf `http://localhost:8080`.

## Android-App

Die Android-App lädt das Spiel von `https://lindendorf.vercel.app`; sie benötigt keinen laufenden Codespace. Die APK wird unter [`/download/lindendorf.apk`](https://lindendorf.vercel.app/download/lindendorf.apk) ausgeliefert. `npm run android:apk` baut die Debug-APK und aktualisiert die von Vercel veröffentlichte Datei in `public/download/`.

## Prüfen

```bash
npm run typecheck
npm run check:knowledge
npm run build:dev
npm test
```

Gegen einen laufenden `npm run dev` prüft `npm run check:system` die Systemsteuerung, die Tastenwege, die Haftung des HUD beim Scrollen und den Querlauf bei 390 Pixeln.

Zusätzlich prüft das projektweite QA-Skript außerhalb dieses Repository-Unterordners Held-Felder, Bildschlüssel, Porträtschlüssel, Assets und aktuelle Quests. `scripts/check-darkfantasy-mobile.mjs` und andere Projektchecks bleiben für das Hauptprojekt relevant.

## Wichtige Dateien

| Pfad | Zweck |
|---|---|
| `src/game/script.ts` | Gesamter Szenenfluss, Proben, Quests und Enden |
| `src/game/content.ts` | Zod-validierter Pilot für datengetriebene Szeneninhalte |
| `src/game/knowledge.ts` | Ableitung des Spielerwissens aus Held-Zuständen |
| `src/game/types.ts` | Held-, Bild- und Szenentypen |
| `src/game/art.ts` | Zuordnung aller Hintergründe und Porträts |
| `src/game/save.ts` | lokaler Speicherstand |
| `src/game/einstellungen.ts` | Systemsteuerung: Ton, Darstellung, Spielverhalten |
| `src/game/klang.ts` | prozedurales Klangwerk (Orte und Rückmeldungen) |
| `src/components/game/Systemsteuerung.tsx` | Bedienfeld der Einstellungen |
| `public/art/` | Spielhintergründe und Figurenporträts |
| `docs/PROJEKTKONTEXT.md` | aktueller Projektstand und nächste sichere Schritte |
| `UEBERGABE_AN_STERKE_AI.md` | kompakte Übergabe für eine weitere KI |

## Erzählprinzipien

Die Welt bleibt materiell glaubwürdig: Getreide, Salz, Eisen, Verbandstoff, Kohle und trockene Schlafplätze sind wichtiger als abstrakte Lore. Das Übernatürliche bleibt selten und mehrdeutig. Konflikte entstehen aus Hunger, Schuld, Befehlen, Preisverfall, Gefahren und versäumten Entscheidungen, nicht aus bloßen Wundern.

## Status

Der aktuelle Stand ist technisch gebaut und auf Desktop sowie bei 390 × 844 Pixeln mobil geprüft. Systemsteuerung und Ton sind ergänzt, die Bedienleiste haftet beim Scrollen wieder oben. Die Daten- und Queststruktur ist im aktiven Main-Repo verankert; das Archiv unter `export/spielversion1-7170673/` dient nur als Vergleichs- und Referenzstand.
