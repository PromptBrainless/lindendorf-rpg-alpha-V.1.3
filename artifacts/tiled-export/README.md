# Tiled-Export (T=64, objectalignment=bottom)

Quelle der Wahrheit: `../kachel-leiste-100.csv` + `../build_kachel_katalog.py`.

Generierte Dateien (`kachel-leiste-100.json`, `atlas.json`, `objekte_64.tsx`, `boden_64.tsx`, `boden_64.png`) entstehen so:

```bash
python3 artifacts/build_kachel_katalog.py
python3 .grok/skills/asset-bogen-pipeline/scripts/pipeline.py atlas \
  artifacts/kachel-leiste-100.json \
  artifacts/tiled-export \
  --assets-dir artifacts/<PROJEKT> \
  --columns 8
```

Ohne PNGs: gültige `.tsx` / `.tmx`, `missing=100` in `atlas.json`.
Mit PNGs: Dateien nach `images/<datei>.png`, Bodenblatt `boden_64.png`.

- `boden_64.tsx` — Raster 64, Tile-Layer
- `objekte_64.tsx` — Collection of Images, `objectalignment="bottom"`
- `leiste_vorlage.tmx` — Boden firstgid=1, Objekte firstgid=1001
- Objektpunkt = Süd-Kante Mitte der Standfläche (`stand_b` × `stand_s`)
