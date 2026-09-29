# Ordnerhierarchie

Wurzel: `/home/workdir/artifacts/<PROJEKT>/`

```
/<PROJEKT>/
  _quellen/
  _unklar/
  kontrolltabelle.md
  figuren/
    humanoide/
      beruf/          baecker, wache, schmied, haendler, bauer, fischer, wirt, heiler, priester, ...
      buerger/
      adel/
      abenteurer/
      held/
      fremde_voelker/
      schurken/
    tiere/
    monster/
    fabelwesen/
    portraits/
  boden/
  natur/
  gebaeude/
  bauteile/
  moebel/
  props/
  items/
  wasser/
  technik/
  effekte/
  hintergruende/
  ui/
```

Unter jeder Blattkategorie liegt der Größenordner, z. B.:

`moebel/betten/1x2_64x128/moebel_betten_bett_gruen_1x2_01.png`

## Zuordnung (Kurz)

| Typ | Kategorie |
|---|---|
| Bodenkachel, Textur | boden/ |
| Wasserkachel | wasser/ |
| Baum, Strauch, Fels, Pflanze | natur/ |
| Ganzes Haus, Hütte | gebaeude/ |
| Wand, Dach, Tür, Fenster, Treppe | bauteile/ |
| Tisch, Bett, Schrank, Stuhl | moebel/ |
| Fass, Kiste, Schild, Deko | props/ |
| Werkzeug, Nahrung, Trank, Waffe als Item | items/ |
| Zahnrad, Hebel, Lampe technisch | technik/ |
| Rauch, Funken, Magie, Wetter | effekte/ |
| Himmel, Raumkulisse | hintergruende/ |
| Button, Rahmen, Icon, Leiste | ui/ |
| Mensch / Beruf | figuren/humanoide/beruf/<beruf>/ |
| Bürger, Adel, Held, … | figuren/humanoide/<gruppe>/ |
| Tier / Monster / Fabel / Portrait | figuren/<gruppe>/ |

## Neue Ordner

Passt nichts — neuen Ordner auf der **passenden Ebene** anlegen (nicht alles in die Wurzel). In der Kontrolltabelle Spalte oder Hinweis **NEU**.

Im Zweifel `_unklar/<größenklasse>/` und in der Analyse als Unsicherheit listen.

`_quellen/` nur Originale. Keine Skalierung dort.
