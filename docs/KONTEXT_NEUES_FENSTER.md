# Kontext — neues Fenster

**Stand:** 24. September 2026. Pflicht nach `AGENTS.project.md`.

Einzelne Speicher für die letzte Sitzung: [docs/kontext/00-index.md](kontext/00-index.md). Nur die Datei lesen, die der Auftrag braucht.

Aktiver Remote dieses Arbeitsbaums: [PromptBrainless/lindendorf-rpg-alpha-V.1.3](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.3).
`AGENTS.project.md` nennt noch V.1.1. Widerspruch, nicht still auflösen.
Inhaltlicher Stand: `wiki/`. Nicht das GitHub-Wiki, der Ordner im Repo.

## Was das Spiel heute tut

Lindendorf, illustriertes Textabenteuer. Deutsch, Du, Präsens.
Fluss, noch unverändert:

> Heldenerstellung → Prolog → Dorf-Schleife → Glockenweg oder Wald → Lager → Ende

Start im älteren Kontext: Stärke, Geschick, Charisma je 10. W10. Schwellen 8 / 12 / 15.
Zehn Lagen vor dem Tal. Höchstens drei Zustände. Noch keine Klassen und keine Karrierestufen im Code.

## Was schon spielbar ist

| Stück | Datei |
|---|---|
| Mühle, Brunnen, Kesseljahr | `quest-muehle.ts`, `quest-brunnen.ts`, `quest-kesseljahr.ts` |
| Hauptfluss, Lager | `script.ts`, `lager-content.ts` |
| Weltwerkzeug | HUD **Welt**, `src/components/welt/WeltEditor.tsx` |
| Wissen | 22 Keys, `knowledge.ts` |
| Lore-Grenze | `src/game/lore.ts`, am Wiki ausgerichtet |
| Stimme | `werkstatt-vertrag.ts`, nur die offene Seite |
| Text über Groq | `src/game/modelle.ts`, Schlüssel nur lokal |

## Was das Wiki jetzt vorgibt und der Code noch nicht erzählt

- Pakt unter der Kapelle. Drei Familien: Vahl, Dennek, Holm. Etwa dreißig Jahre.
- Umverteilung in Mühle, Steinbruch, Lagerhäuser. Ilse zählt, wen das Amt streicht.
- Rotes Wachs als Löschmarke. Glocke als Signal.
- Mühle als Versteck und Verteiler, nicht nur als Schuld bei Rennik.
- Banditen als Wache eines Transportwegs.
- Enden als Zustand des Dorfes, ohne Reinigung: `wiki/Enden.md`.
- Klassen, Karrieren, Status, Schicksal: dokumentiert, nicht mechanisch.

Eine Szene erst umschreiben, wenn der Auftrag sie nennt. Reihenfolge: `wiki/Queststruktur.md`. Den Pakt nicht in die Ankunft vorziehen.

## Nicht anfassen ohne Auftrag

Engine, Runtime, Auth, neue ArtKeys, Hauptfluss durch eine neue Quest ersetzen.
Questtexte nicht noch einmal blind über die Schnittstelle jagen. Siehe [docs/kontext/03-questtexte.md](kontext/03-questtexte.md).

## Neuer Spielleiter-Bereich

Der Spielleiter-Bereich ist unter `/editor` als geschützte Spielleiter-Werkstatt erreichbar. Er arbeitet direkt mit dem vorhandenen Weltgraphen und zeigt die acht Questreihen mit ihren 71 Seiten. Die Oberfläche liegt in `src/components/welt/SpielleiterBereich.tsx`. Die Route liegt in `src/routes/editor.tsx` und verwendet weiterhin den vorhandenen Spielleiter-Zugang.

Die Werkstatt ist in Übersicht, Geschichte, Szenen, Figuren, Wissen, Orte und Prüfen gegliedert. Geschichte und Szenen bearbeiten vorhandene Seiten als Auflagen. Eine Auflage verändert zunächst die sichtbare Fassung einer Seite, bewahrt aber den Kanon und kann zurückgenommen werden. Der Spielerbereich bleibt die Quelle für das, was heute tatsächlich geschieht.

Die Figurenwerkstatt unterscheidet kanonische Figuren von neuem Autorenmaterial. Kanonische Figuren werden nur angezeigt und nicht überschrieben. Neue Figuren werden mit Zod geprüft und lokal gespeichert. Sie sind dadurch vollständig beschreibbar, aber noch keine handelnden Figuren des laufenden Spiels. Für ihre Überführung in den Kanon braucht es einen eigenen Auftrag mit benannter Szene, Handlung und Folge.

Der Bereich Wissen verwendet die vorhandenen Wissenstafeln und Werkstattfunktionen. Der Bereich Orte liest `src/game/weltbild.ts` und öffnet die daran gebundenen Szenen. Der Prüfbereich verwendet die bestehenden Graph-, Bild-, Textvergleichs- und Heldensichtprüfungen. Eine neue Engine, Datenbank oder zweite Runtime ist nicht entstanden.

Die ausführliche Arbeitsanweisung steht in `docs/EDITOR.md`. Der inhaltliche Einstieg in die Zielwelt steht in `wiki/Lore-Index.md`, die Schauplätze stehen in `wiki/Orte.md`, und die kanonische Beschreibung der Spielleitung steht in `wiki/Projekt-Weltwerkzeug-und-Spielleitung.md`.
