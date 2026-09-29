# Größenklassen (T = 64)

Ordnername: `<BxH>_<pxB>x<pxH>`

Beispiele: `1x1_64x64`, `1x2_64x128`, `2x2_128x128`, `3x3_192x192`.

## Klassen

### Kacheln (Boden, Wasser, nahtlose Texturen)

- Exakt 64×64 nach Skalierung.
- Kein transparenter Rand.
- Kein Auffüllen über 64 hinaus.

### Objekte (Möbel, Bäume, Häuser, Bauteile, Props, Items)

- Canvas = Vielfaches von 64.
- Motiv proportional mit Bogenfaktor skalieren.
- Auf der transparenten Leinwand **unten bündig** und **horizontal mittig**.
- Standfläche muss stimmen (Füße / Sockel auf der Unterkante, nicht in der Luft).
- Danach `RAND_PX` als transparenter Saum **innerhalb** der Leinwand, sofern noch Platz. Reicht der Platz nicht, nächstgrößere Klasse wählen — Motiv nie verkleinern, um Rand zu erzwingen.

Typische Raster:

| Klasse | Pixel |
|---|---|
| 1×1 | 64×64 |
| 1×2 | 64×128 |
| 2×1 | 128×64 |
| 2×2 | 128×128 |
| 2×3 | 128×192 |
| 3×2 | 192×128 |
| 3×3 | 192×192 |
| 4×3 | 256×192 |
| 4×4 | 256×256 |

Passt das Motiv nicht — nächstgrößere Klasse. Niemals quetschen.

### Figuren

Einheitlicher Rahmen pro Klasse, nicht pro Einzelpose wechseln.

- Menschen / Humanoide — Standard `1x2_64x128`.
- Große Monster / Reittiere — `2x2_128x128` oder `3x3_192x192`.
- Unten bündig, horizontal mittig. Füße auf der Unterkante.

### UI

- Keine Rasterpflicht.
- Rahmen und Buttons 9-Slice-tauglich zuschneiden (Inhalt und Rand klar trennbar, keine angeschnittenen Ornamente).
- Größenordner trotzdem nach tatsächlichen Pixeln, z. B. `ui_48x48` nur wenn bewusst ohne Raster. Bevorzugt T-Vielfache, wenn es ohne Quetschen geht.
- UI-Ordner: `ui/<unterart>/<dateiname>.png` — Größenordner optional, wenn Maße im Dateinamen stehen.

## Maßstab pro Bogen

1. Eine klare Kachel im Bogen messen (Kantenpixel, nicht Inhalt).
2. `faktor = 64 / kachel_orig`.
3. Denselben Faktor auf Kacheln **und** Objekte dieses Bogens.
4. Objekt danach auf nächstes T-Vielfache mit Alpha auffüllen.

So bleiben Proportionen zwischen Boden und Möbeln erhalten.

## Entscheidung nächstgrößere Klasse

Nach Skalierung Bounding-Box des Motivs (ohne leeren Rand) = `w × h`.

```
tiles_x = ceil(w / 64)
tiles_y = ceil(h / 64)
```

Canvas = `tiles_x*64` × `tiles_y*64`. Steht `RAND_PX` an und Motiv + 2*RAND_PX überschreitet die Klasse, `tiles_*` um 1 erhöhen, wo nötig.
