# Pivot-Positionen für Gebäude

`T = 64`. Gilt für L001–L020 und alle späteren Haus-Objekte.
Sprite-Ausrichtung in der PNG: Motiv **unten bündig**, **horizontal mittig** (`scale-pad --align bottom-center`).

Zwei Punkte, nie vermischen:

| Name | Sitzt auf | Zweck |
|---|---|---|
| **Sprite-Pivot** | PNG-Pixel | Zeichnen, Sortierung Y, Schatten |
| **Stand-Ursprung** | Kachelraster der Karte | Platzieren, Kollision, Türzelle |

## 1. Sprite-Pivot (immer)

Ursprung der PNG ist links oben, Y nach unten.

```
pivot_px = width  / 2
pivot_py = height          # Unterkante, nicht die letzte Pixelreihe minus 1
```

Normiert (0…1, Ursprung links oben):

```
origin_x = 0.5
origin_y = 1.0
```

`RAND_PX` sitzt *innerhalb* der Leinwand. Die Unterkante der Leinwand bleibt der Pivot — nicht die Unterkante des Motivs nach dem Saum. Sockel/Stufen auf der letzten Pixelreihe halten, sonst schwebt das Haus.

Verboten: Pivot in die Gebäudemitte, in den First oder in die Tür. Dach überhängt nach Norden, der Körper steht auf der Südseite.

## 2. Standfläche

Die Klasse `BxH` ist die **Leinwand**, nicht automatisch die begehbare Sperrfläche.

| Klasse | Leinwand | Standard-Stand (Sperr) | Dach-Overlay (kein Block) |
|---|---|---|---|
| 2×2 | 128×128 | 2×1 Süd | 2×1 Nord |
| 3×2 | 192×128 | 3×1 Süd | 3×1 Nord |
| 3×3 | 192×192 | 3×2 Süd | 3×1 Nord |
| 2×3 | 128×192 | 2×1 Süd | 2×2 Nord |
| 1×2 Tür/Laterne | 64×128 | 1×1 Süd | 1×1 Nord |
| 2×1 Dachmodul | 128×64 | keine | ganzes Modul Overlay |
| 1×1 Fassade/Fenster | 64×64 | keine | Deko / Wand |

Stand-Ursprung = **Mitte der Süd-Kante** der Sperrfläche, in Kachelkoordinaten.

```
# Kartenkachel der Südwest-Ecke = (tx, ty)
# B = Standbreite in Kacheln, S = Standtiefe in Kacheln (Süd = +Y auf der Karte)

stand_x = tx + B / 2
stand_y = ty + S          # Süd-Kante
```

Sprite-Pivot und Stand-Ursprung fallen zusammen, wenn die PNG-Unterkante genau auf dieser Süd-Kante liegt. Das ist die Regel.

Türzelle: mittlere Südkachel. Ungerade B → exakt Mitte. Gerade B → rechte der beiden Mittelkacheln (östlicher Türanschlag).

```
tuer_tx = tx + floor((B - 1) / 2)
tuer_ty = ty + S - 1
```

## 3. Pixelpivot je Klasse

Y-unten = Canvas-Höhe. X = halbe Breite. Ganzzahlig, bei ungerader Breite `.0` vermeiden — Breite ist immer durch 64 teilbar, also immer ganz.

| Klasse | px × py | origin (x, y) Unity | origin Phaser | offset Godot (von oben-links) |
|---|---|---|---|---|
| 1×1 | 32, 64 | (0.5, 0) | (0.5, 1) | (32, 64) |
| 1×2 | 32, 128 | (0.5, 0) | (0.5, 1) | (32, 128) |
| 2×1 | 64, 64 | (0.5, 0) | (0.5, 1) | (64, 64) |
| 2×2 | 64, 128 | (0.5, 0) | (0.5, 1) | (64, 128) |
| 2×3 | 64, 192 | (0.5, 0) | (0.5, 1) | (64, 192) |
| 3×2 | 96, 128 | (0.5, 0) | (0.5, 1) | (96, 128) |
| 3×3 | 96, 192 | (0.5, 0) | (0.5, 1) | (96, 192) |

Unity: Pivot unten, deshalb Y-normiert **0** (Ursprung links unten).
Phaser / Tiled-Objekt / LDtk: Y nach unten, deshalb Y-normiert **1**.
Godot `TileSet` Atlas-Texture: `texture_origin` = Pivot relativ zur Textur-Mitte, oder Sprite2D `centered = false` + Position am Standpunkt und Offset `(-pivot_px, -pivot_py)` wenn du top-left zeichnest. Bevorzugt: `centered = true` nur bei 1×1-Boden, bei Gebäuden `offset = (0, -height/2)` plus Position auf Süd-Kante — oder direkt `centered = false` und Position `stand - (0, height)` ist falsch. Korrekt bei `centered = false`:

```
sprite.position = world(stand_x, stand_y)
sprite.offset   = Vector2(-pivot_px, -pivot_py)
```

## 4. L001–L020

| ID | Motiv | Klasse | Sprite-Pivot px | Stand B×S | Türzelle relativ SW |
|---|---|---|---|---|---|
| L001 | Hütte Stroh | 2×2 | 64, 128 | 2×1 | (0, 0) |
| L002 | Hütte Schindel | 2×2 | 64, 128 | 2×1 | (0, 0) |
| L003 | Fachwerk klein | 2×2 | 64, 128 | 2×1 | (0, 0) |
| L004 | Fachwerk breit | 3×2 | 96, 128 | 3×1 | (1, 0) |
| L005 | Bauernhaus | 3×2 | 96, 128 | 3×1 | (1, 0) |
| L006 | Scheune | 3×2 | 96, 128 | 3×1 | (1, 0) |
| L007 | Schmiede | 2×2 | 64, 128 | 2×1 | (0, 0) |
| L008 | Taverne | 3×2 | 96, 128 | 3×1 | (1, 0) |
| L009 | Laden | 2×2 | 64, 128 | 2×1 | (0, 0) |
| L010 | Mühle | 3×3 | 96, 192 | 3×2 | (1, 1) |
| L011 | Kirche klein | 3×3 | 96, 192 | 3×2 | (1, 1) |
| L012 | Rathaus | 3×2 | 96, 128 | 3×1 | (1, 0) |
| L013 | Brunnenhaus | 2×2 | 64, 128 | 2×2 ganz | — kein Durchgang, Mitte |
| L014 | Stall | 2×2 | 64, 128 | 2×1 | (0, 0) |
| L015 | Speicher | 2×2 | 64, 128 | 2×1 | (0, 0) |
| L016 | Dach Giebel | 2×1 | 64, 64 | 0 | Overlay, Pivot Unterkante Firstlinie |
| L017 | Dach Walm | 2×1 | 64, 64 | 0 | Overlay |
| L018 | Wand Fachwerk | 1×1 | 32, 64 | 0 | Wandkachel, kein Objektpivot |
| L019 | Holztür | 1×2 | 32, 128 | 1×1 | selbst die Türzelle |
| L020 | Fenster | 1×1 | 32, 64 | 0 | Overlay auf Fassade |

L013 (Brunnenhaus) und Props wie L054 (Marktbrunnen 2×2): Stand = volle Grundfläche, Pivot trotzdem Unterkante-Mitte. Spieler läuft nicht durch.

L016–L018, L020: keine Map-Objekte mit Fußabdruck. Pivot nur zum Ausrichten auf die Wandoberkante des Trägerhauses.

## 5. Sortierung und Schatten

Y-Sort: `sort_y = stand_y` (Süd-Kante), nicht First, nicht Pivot-Pixel in Bildmitte.

Schatten: eigene Ebene, Anker identisch zum Sprite-Pivot. Schatten nicht in die PNG einbrennen, wenn er über Nachbarkacheln läuft.

Tiefe gegen den Spieler: Figur mit Fuß-Pivot (`1×2`, origin 0.5 / 1) und Haus mit Süd-Kanten-Pivot liegen in derselben Y-Metrik.

## 6. Export-Felder

In `atlas.json` / Tiled-Objektvorlage je Gebäude:

```
id, datei, tiles_x, tiles_y,
pivot_px, pivot_py,
origin_x, origin_y,
stand_b, stand_s,
tuer_dx, tuer_dy,
overlay: bool
```

Tiled-Objekt: `object.x = stand_x * 64`, `object.y = stand_y * 64`, `object.gid` mit `objectalignment = bottom`.

## 7. Kontrolle nach Schnitt

1. Letzte Pixelreihe enthält Sockel oder Stufe, keine leere Alpha-Zeile unter dem Haus (außer `RAND_PX` links/rechts, nicht unten).
2. `inspect`: Breite und Höhe Vielfache von 64.
3. Probe: Pivotkreuz auf (pivot_px, pivot_py − 1) muss den Sockel treffen, nicht den Rasen davor und nicht die Türklinke.
4. Weicht ein Bogen davon ab (Mühle steht auf einem Podest in der Bildmitte) — Klasse vergrößern, Motiv nach unten schieben, Pivot-Regel nicht ändern.
