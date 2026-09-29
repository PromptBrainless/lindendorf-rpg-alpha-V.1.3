# Schnittregeln

## Kacheln

- Rechteckiger Schnitt auf die erkannte Kachelzelle.
- Keine Nachbarpixel, keine Gutter-Pixel, keine Hintergrundreste.
- Nach Skalierung exakt 64×64. Abweichung von 1 px ist ein Fehler — neu schneiden, nicht interpolierend zurechtbiegen über das Ziel hinaus.

## Objekte, Figuren, UI

- Freistellen. Hintergrund weg, Alpha sauber.
- Keine Halos (farbige Säume der alten Hintergrundfarbe). Bei einfarbigem Hintergrund Farbe per Flood-Fill / Chroma entfernen, dann 1 px unscharfem Saum gegenprüfen.
- Motiv nicht abschneiden — inkl. abstehender Teile (Ast, Schwertspitze, Hut).
- Schlagschatten nur behalten, wenn er Teil der Grafik ist (mitgezeichnet). Dann in der Tabelle **Schatten=ja**. Studio-Dropshadow vom Stockfoto entfernen.

## Zusammengehörigkeit

Ein Asset, wenn es im Spiel als ein Ding steht:

- Haus mit festem Anbau
- Küchenzeile
- Zaunsegment, das als Modul gedacht ist

Getrennte Assets, wenn der Bogen Varianten oder steckbare Teile zeigt (Tür extra, Fenster extra) — in der Analyse vorschlagen, Nutzer entscheidet.

## Animation / Varianten

- Lesen links nach rechts, dann oben nach unten.
- Jeder Frame eigene Datei.
- Leere Zellen überspringen und in der Analyse als leer markieren.

## Gitter vs. Packing

Regelmäßiges Gitter — Zellen aus Inspect-Maßen, `cut-rect` je Zelle.

Unregelmäßiges Packing — Bounding-Box je Motiv per Sichtprüfung. Boxen nicht überlappen lassen. Überlappung in der Analyse als Unsicherheit.

## Verbotene Nacharbeit

- Kein Nachzeichnen fehlender Pixel.
- Kein Recolor.
- Kein Blur, Sharpen, Drop-Shadow-Filter.
- Kein Content-Aware Fill.
- Nur Lanczos beim Größenwechsel.
