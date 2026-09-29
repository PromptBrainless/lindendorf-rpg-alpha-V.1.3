# Kontrolltabelle — Vorlage

Im Projektroot als `/home/workdir/artifacts/<PROJEKT>/kontrolltabelle.md` führen. Nach jeder Datei anhängen, nicht überschreiben.

```md
# Kontrolltabelle <PROJEKT>

T=64 | Filter=Lanczos | RAND_PX=<n>

## Datei <quellname>

| Dateiname | Ordner | Größenklasse | Pixelgröße | Quelldatei | Position |
|---|---|---|---|---|---|
| moebel_betten_bett_gruen_2x2_01.png | moebel/betten/2x2_128x128 | 2x2 | 128x128 | bogen_03.png | r2c1 32,160 64x96 |

Anzahl erkannt: N
Anzahl geschrieben: N
Neue Ordner:
Auffälligkeiten:
Abschluss: wartet auf Nutzer
```

Position-Format: `r<zeile>c<spalte> x,y wxh` oder bei Einzelbild `einzel`.
