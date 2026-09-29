---
name: asset-bogen-pipeline
description: Schneide Spritesheets, Tilesets, Objekt- und UI-Boegen sowie Einzelbilder in benannte PNG-Assets mit T=64. Nutzen bei Start, Bogen, Spritesheet, Tileset, Einzelbilder, Assetpipeline, Kacheln 64, Schnitt, Kontrolltabelle oder ZIP der Asset-Ordner.
metadata:
  type: workflow
  version: "1.0"
  base_tile: "64"
---

# Asset-Bogen-Pipeline (T = 64)

Verarbeite hochgeladene Bilddateien zu einzelnen PNG-Assets. Originale nie überschreiben. Nichts speichern, bevor der Nutzer die Analyse bestätigt. Eine Datei nach der anderen.

Beginne die Arbeit erst, wenn der Nutzer **Start** schreibt. Fehlen Projektname oder Rand-px, zuerst fragen.

## Parameter (fest, Session)

Lies `references/session-defaults.md`. Setze fehlende Werte nur nach Nutzerangabe.

- Basiskachel `T = 64` px, für alle Assets.
- Skalierung immer Lanczos (`Image.Resampling.LANCZOS`), gleiche Methode für alle Assets eines Bogens.
- Transparenter Rand um Objekte — Sessionwert `RAND_PX` (ganze Pixel). Fehlt er, fragen.
- Projektname — Sessionwert `PROJEKT`. ASCII, keine Umlaute, keine Leerzeichen.
- Arbeitswurzel — `/home/workdir/artifacts/<PROJEKT>/`

## Einzelbilder (kein Extra-Modus)

- Jedes erkannte Asset wird eine eigene PNG, inklusive Varianten, Animationsframes und Teile.
- Bereits einzelne Grafiken (kein Bogen) durchlaufen dieselbe Kette — einordnen, Größenklasse, umbenennen, ablegen.
- Originale unverändert nach `_quellen/` kopieren (Dateiname beibehalten).
- Es wird nichts nur vorgeschlagen. Am Ende existiert für jedes bestätigte Asset eine Datei.
- Komplette Bögen gehören nicht ins Ergebnis, außer der Nutzer verlangt das ausdrücklich.

## Quellen und Referenzen

1. `references/ordnerhierarchie.md` — Zielordner, neue Ordner, `_unklar/`.
2. `references/groessenklassen.md` — Raster, Standfläche, Maßstab pro Bogen.
3. `references/benennung.md` — Dateinamen, Nummern, Animationen.
4. `references/schnittregeln.md` — Freistellen, Gitter, zusammengehörige Teile.
5. `references/kontrolltabelle.md` — Tabellenformat.
6. `scripts/pipeline.py` — inspect, cut-rect, scale-pad, matte, zip. Immer nutzen statt Ad-hoc-Magick.

## Ablauf (nie überspringen)

### Vor Start

1. Zielwurzel anlegen, `_quellen/` und `_unklar/` sicherstellen.
2. Sessionwerte `PROJEKT`, `RAND_PX`, `T=64` in einer Zeile bestätigen.
3. Warten auf **Start**.

### Schritt 1 — Analyse (nichts speichern außer Originalkopie in `_quellen/`)

Pro Eingabedatei:

1. Datei nach `_quellen/` kopieren. Originalpfad nicht anfassen.
2. `python3 scripts/pipeline.py inspect <datei>` ausführen.
3. Bild ansehen. Assets visuell zählen, nicht raten.
4. Ausgeben:
   - Dateiname, Pixelgröße, Hintergrundart (transparent / schwarz / einfarbig / Muster).
   - Kachelgröße im Original und `faktor = 64 / kachel_orig`.
   - Enthält der Bogen keine Kachel als Maßstab — Faktor vorschlagen und **warten**.
   - Liste jedes Assets — Arbeitsname, Typ, Zielordner, Größenklasse, Position (Zeile/Spalte oder Bounding-Box).
   - Geplante Schnittlogik und Unsicherheiten.
5. Warten auf Bestätigung. Bei Unklarheit fragen, nicht speichern.

### Schritt 2 — Schnitt

Nur nach Bestätigung der aktuellen Datei.

- Ein Asset = eine PNG. Nichts weglassen, nichts erfinden, nichts nachzeichnen.
- Kacheln rechteckig, exakt, keine Nachbarpixel, keine Hintergrundreste.
- Objekte / Figuren / UI freistellen — sauberer Alpha-Rand, keine Halos. Motiv nicht abschneiden.
- Schlagschatten nur behalten, wenn er zum Asset gehört — dann in der Kontrolltabelle melden.
- Zusammengehörige Teile (Haus+Anbau, Küchenzeile, Zaun) als ein Asset, außer der Nutzer trennt sie.
- Animationen und Varianten — Reihenfolge links nach rechts, oben nach unten. Jeder Frame eine Datei.
- Keine Farbänderung, kein Weichzeichnen außer Lanczos beim Skalieren.
- Motiv proportional. Niemals quetschen.

Schnittbefehle über `scripts/pipeline.py cut-rect` und `scale-pad`. Freistellen mit `matte` nur, wenn der Inspect-Schritt die Farbe eindeutig nennt. Sonst Alpha aus Transparenz oder Nutzer fragen.

### Schritt 3 — Benennung und Ablage

Schema und Umlaute laut `references/benennung.md`.

Zielpfad:

`/<PROJEKT>/<kategorie>/<unterkategorie>/.../<groessenklasse>/<dateiname>.png`

Größenordner heißt `[BxH]_[pxB]x[pxH]`, z. B. `1x2_64x128`.

Passt kein Ordner — neuen auf der richtigen Ebene anlegen und in der Kontrolltabelle als NEU melden. Im Zweifel `_unklar/`.

### Schritt 4 — Kontrolle der aktuellen Datei

Tabelle laut `references/kontrolltabelle.md`.

Prüfen:

- Anzahl Ausgabedateien = Anzahl bestätigter Assets.
- Keine doppelten Namen.
- Keine leeren oder abgeschnittenen PNGs (`pipeline.py inspect` auf jede Ausgabe).
- Alle Kacheln exakt 64x64.
- Alle Objekte Vielfache von 64 (nach Padding).
- Auffälligkeiten listen statt raten — Überlappungen, unscharfe Kanten, Hintergrundreste, unklare Zuordnung, neue Ordner.

Abschluss dieser Datei bestätigen. Erst dann die nächste Datei bei Schritt 1 beginnen.

### Projektabschluss

Wenn der Nutzer ZIP verlangt oder alle Dateien fertig sind:

```bash
python3 scripts/pipeline.py zip /home/workdir/artifacts/<PROJEKT> /home/workdir/artifacts/<PROJEKT>.zip
python3 scripts/pipeline.py atlas /home/workdir/artifacts/kachel-leiste-100.json /home/workdir/artifacts/tiled-export --assets-dir /home/workdir/artifacts/<PROJEKT> --columns 8
```

`atlas` schreibt `boden_64.tsx` (Raster 64) und `objekte_64.tsx` (`objectalignment="bottom"`). Objektpunkt in Tiled = Süd-Kante Mitte.

ZIP enthält die ganze Hierarchie inklusive `_quellen/` und `kontrolltabelle.md` im Projektroot.

## Harte Verbote

- Nicht vor **Start** schneiden.
- Nicht mehrere Bögen in einem Rutsch ohne Zwischenbestätigung.
- Nicht skalieren mit einem anderen Filter als Lanczos.
- Nicht den Maßstab innerhalb eines Bogens wechseln.
- Nicht quetschen, nicht nachzeichnen, Originale nicht verändern.
- Nicht raten bei fehlender Kachelreferenz — Faktor vorschlagen und warten.
