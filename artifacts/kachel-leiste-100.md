# 64-px-Leiste — 100 Kacheln (Häuser, Straßen, Stadt, Wald, Pflanzen)

Stand: 2026-09-29. Katalog mit Pivot-Spalten. Schnitt wartet auf **Start**.

Maschinenlesbar: `kachel-leiste-100.json`, `kachel-leiste-100.csv`.
Tiled-Export: `tiled-export/objekte_64.tsx` (`objectalignment="bottom"`), `boden_64.tsx`, `leiste_vorlage.tmx`, `atlas.json`.

```bash
python3 /home/workdir/.grok/skills/asset-bogen-pipeline/scripts/pipeline.py atlas \
  /home/workdir/artifacts/kachel-leiste-100.json \
  /home/workdir/artifacts/tiled-export \
  --assets-dir /home/workdir/artifacts/<PROJEKT> \
  --columns 8
```

Ohne PNGs schreibt der Befehl trotzdem gültige `.tsx` / `.tmx`. Gefundene Dateien landen in `tiled-export/images/`.

## Pivot-Regel (kurz)

- `pivot_px` = Leinwandbreite / 2. `pivot_py` = Leinwandhöhe (Unterkante).
- Tiled-Objekte: Tileset-Attribut `objectalignment="bottom"` = Unterkante Mitte. Kein extra `tileoffset`.
- `stand_b` × `stand_s` = Sperrfläche in Kacheln, Süd bündig mit der PNG-Unterkante.
- `tuer_dx` relativ zur Südwest-Kachel der Standfläche. `—` = keine Tür.
- Overlay (`stand_b = 0`): nur zeichnen, keine Kollision.

## Archive, die wirklich passen

| Pack | Im Drive | Originalkachel | Faktor auf T=64 | Rolle in dieser Liste |
|---|---|---:|---:|---|
| Dorf-Set / Medieval Village MegaKit | `Medieval Village MegaKit[Standard].zip` + `01_Welt` | 32 | 2 (Lanczos, kein Blur) | Häuser, Wege, Dorfgrün, Zäune |
| Häuserpaket | `Houses_Pack.zip` | oft Objekt, nicht Raster | 2, danach auf 64-Vielfaches pad | ganze Häuser, Anbauten |
| Gentle Forest 3.0a | `19.07a - Gentle Forest 3.0a.zip` | 32 | 2 | Wald, Bäume, Unterholz |
| Mana Seed Forest (Sommer/Herbst) | seasonal forest sample | 16–32 | 2 oder 4, einheitlich pro Bogen | Pflanzen, Laub, Stämme |
| Steinpflaster Stadt | Dorf-Set + Kingdom/Boden in `01_Welt/Boden_Gras_und_Pfade` | 32 | 2 | Stadtgebiet |

**Küchenkacheln** (`Kitchen and more tileset [16x16].zip`): 16 px → Faktor 4. Nicht in diesen 100.

## Session (noch offen)

- `T = 64`
- `PROJEKT` — fehlt. Vorschlag: `kachel-leiste`
- `RAND_PX` — 0 auf 1×1-Kacheln. 2 auf ganze Häuser.
- Schnitt erst nach **Start** und Bestätigung Datei für Datei.

## Zählung

| Block | IDs | Anzahl | Tiled |
|---|---|---:|---|
| A Häuser | L001–L020 | 20 | Objekt-Tileset |
| B Straßen / Wege | L021–L038 | 18 | Boden + einzelne Props |
| C Stadt / Pflaster | L039–L056 | 18 | Boden + Laterne/Brunnen |
| D Wald | L057–L078 | 22 | Boden + Bäume |
| E Pflanzen | L079–L100 | 22 | Overlay / Objekt |
| **Summe** | | **100** | |

Namensschema: `[kat]_[ukat]_[motiv]_[BxH]_[nr].png`

---

## A · Häuser (20)

| ID | Dateiname | BxH | pivot_px | stand_b | stand_s | tuer_dx | Notiz |
|---|---|---|---:|---:|---:|---:|---|
| L001 | gebaeude_dorf_huette_stroh_2x2_01 | 2×2 | 64 | 2 | 1 | 0 | Hütte Stroh |
| L002 | gebaeude_dorf_huette_schindel_2x2_01 | 2×2 | 64 | 2 | 1 | 0 | Hütte Schindel |
| L003 | gebaeude_dorf_fachwerk_klein_2x2_01 | 2×2 | 64 | 2 | 1 | 0 | Fachwerk klein |
| L004 | gebaeude_dorf_fachwerk_breit_3x2_01 | 3×2 | 96 | 3 | 1 | 1 | Fachwerk breit |
| L005 | gebaeude_dorf_bauernhaus_3x2_01 | 3×2 | 96 | 3 | 1 | 1 | Bauernhaus |
| L006 | gebaeude_dorf_scheune_3x2_01 | 3×2 | 96 | 3 | 1 | 1 | Scheune |
| L007 | gebaeude_dorf_schmiede_2x2_01 | 2×2 | 64 | 2 | 1 | 0 | Schmiede |
| L008 | gebaeude_dorf_taverne_3x2_01 | 3×2 | 96 | 3 | 1 | 1 | Taverne |
| L009 | gebaeude_dorf_laden_2x2_01 | 2×2 | 64 | 2 | 1 | 0 | Laden |
| L010 | gebaeude_dorf_muehle_3x3_01 | 3×3 | 96 | 3 | 2 | 1 | Mühle |
| L011 | gebaeude_dorf_kirche_klein_3x3_01 | 3×3 | 96 | 3 | 2 | 1 | Kirche klein |
| L012 | gebaeude_dorf_rathaus_3x2_01 | 3×2 | 96 | 3 | 1 | 1 | Rathaus |
| L013 | gebaeude_dorf_brunnenhaus_2x2_01 | 2×2 | 64 | 2 | 2 | — | volle Sperre, keine Tür |
| L014 | gebaeude_dorf_stall_2x2_01 | 2×2 | 64 | 2 | 1 | 0 | Stall |
| L015 | gebaeude_dorf_speicher_2x2_01 | 2×2 | 64 | 2 | 1 | 0 | Speicher |
| L016 | bauteile_daecher_giebel_stroh_2x1_01 | 2×1 | 64 | 0 | 0 | — | Dach Giebel |
| L017 | bauteile_daecher_walm_schindel_2x1_01 | 2×1 | 64 | 0 | 0 | — | Dach Walm |
| L018 | bauteile_waende_fachwerk_hell_1x1_01 | 1×1 | 32 | 0 | 0 | — | Fassade |
| L019 | bauteile_tueren_holztuer_1x2_01 | 1×2 | 32 | 1 | 1 | 0 | Tür = eigene Zelle |
| L020 | bauteile_fenster_bleiglas_klein_1x1_01 | 1×1 | 32 | 0 | 0 | — | Fenster |

## B · Straßen / Wege (18)

| ID | Dateiname | BxH | pivot_px | stand_b | stand_s | tuer_dx | Notiz |
|---|---|---|---:|---:|---:|---:|---|
| L021 | boden_wege_erde_mitte_1x1_01 | 1×1 | 32 | 1 | 1 | — | Erdweg Mitte |
| L022 | boden_wege_erde_kante_n_1x1_01 | 1×1 | 32 | 1 | 1 | — | Erdweg Kante N |
| L023 | boden_wege_erde_kante_o_1x1_01 | 1×1 | 32 | 1 | 1 | — | Erdweg Kante O |
| L024 | boden_wege_erde_knick_no_1x1_01 | 1×1 | 32 | 1 | 1 | — | Erdweg Knick NO |
| L025 | boden_wege_erde_kreuz_1x1_01 | 1×1 | 32 | 1 | 1 | — | Erdweg Kreuz |
| L026 | boden_wege_erde_t_sued_1x1_01 | 1×1 | 32 | 1 | 1 | — | Erdweg T |
| L027 | boden_wege_kies_mitte_1x1_01 | 1×1 | 32 | 1 | 1 | — | Kies Mitte |
| L028 | boden_wege_kies_kante_1x1_01 | 1×1 | 32 | 1 | 1 | — | Kies Kante |
| L029 | boden_wege_holzsteg_laengs_1x1_01 | 1×1 | 32 | 1 | 1 | — | Steg längs |
| L030 | boden_wege_holzsteg_quer_1x1_01 | 1×1 | 32 | 1 | 1 | — | Steg quer |
| L031 | boden_wege_holzsteg_ende_1x1_01 | 1×1 | 32 | 1 | 1 | — | Steg Ende |
| L032 | boden_wege_radspur_1x1_01 | 1×1 | 32 | 1 | 1 | — | Radspur |
| L033 | boden_wege_pfuetze_1x1_01 | 1×1 | 32 | 1 | 1 | — | Pfütze |
| L034 | boden_wege_trittstein_1x1_01 | 1×1 | 32 | 1 | 1 | — | Trittstein |
| L035 | boden_wege_hang_stufe_1x1_01 | 1×1 | 32 | 1 | 1 | — | Hangstufe |
| L036 | props_wege_meilenstein_1x1_01 | 1×1 | 32 | 1 | 1 | — | Meilenstein |
| L037 | props_wege_wegweiser_holz_1x2_01 | 1×2 | 32 | 1 | 1 | — | Wegweiser |
| L038 | bauteile_zaeune_latten_gerade_1x1_01 | 1×1 | 32 | 1 | 1 | — | Lattenzaun |

## C · Stadt / Steinpflaster (18)

| ID | Dateiname | BxH | pivot_px | stand_b | stand_s | tuer_dx | Notiz |
|---|---|---|---:|---:|---:|---:|---|
| L039 | boden_stadt_pflaster_mitte_1x1_01 | 1×1 | 32 | 1 | 1 | — | Pflaster 1 |
| L040 | boden_stadt_pflaster_mitte_1x1_02 | 1×1 | 32 | 1 | 1 | — | Pflaster 2 |
| L041 | boden_stadt_pflaster_mitte_1x1_03 | 1×1 | 32 | 1 | 1 | — | Pflaster 3 |
| L042 | boden_stadt_pflaster_kante_n_1x1_01 | 1×1 | 32 | 1 | 1 | — | Pflaster Kante |
| L043 | boden_stadt_pflaster_ecke_no_1x1_01 | 1×1 | 32 | 1 | 1 | — | Pflaster Ecke |
| L044 | boden_stadt_pflaster_innenecke_1x1_01 | 1×1 | 32 | 1 | 1 | — | Pflaster Innenecke |
| L045 | boden_stadt_rinne_gerade_1x1_01 | 1×1 | 32 | 1 | 1 | — | Rinne |
| L046 | boden_stadt_rinne_kreuz_1x1_01 | 1×1 | 32 | 1 | 1 | — | Rinne Kreuz |
| L047 | boden_stadt_bordstein_1x1_01 | 1×1 | 32 | 1 | 1 | — | Bordstein |
| L048 | boden_stadt_platz_ornament_1x1_01 | 1×1 | 32 | 1 | 1 | — | Platzornament |
| L049 | boden_stadt_bruchstein_1x1_01 | 1×1 | 32 | 1 | 1 | — | Bruchstein |
| L050 | boden_stadt_ziegel_1x1_01 | 1×1 | 32 | 1 | 1 | — | Ziegel |
| L051 | boden_stadt_luke_1x1_01 | 1×1 | 32 | 1 | 1 | — | Luke |
| L052 | boden_stadt_gully_1x1_01 | 1×1 | 32 | 1 | 1 | — | Gully |
| L053 | props_stadt_laterne_1x2_01 | 1×2 | 32 | 1 | 1 | — | Laterne |
| L054 | props_stadt_brunnen_2x2_01 | 2×2 | 64 | 2 | 2 | — | Marktbrunnen volle Sperre |
| L055 | props_stadt_bank_stein_1x1_01 | 1×1 | 32 | 1 | 1 | — | Steinbank |
| L056 | bauteile_mauern_stadtmauer_1x1_01 | 1×1 | 32 | 1 | 1 | — | Stadtmauer |

## D · Wald (22)

| ID | Dateiname | BxH | pivot_px | stand_b | stand_s | tuer_dx | Notiz |
|---|---|---|---:|---:|---:|---:|---|
| L057 | boden_wald_nadelstreu_1x1_01 | 1×1 | 32 | 1 | 1 | — | Nadelstreu |
| L058 | boden_wald_nadelstreu_1x1_02 | 1×1 | 32 | 1 | 1 | — | Nadelstreu Wurzeln |
| L059 | boden_wald_moos_1x1_01 | 1×1 | 32 | 1 | 1 | — | Moos |
| L060 | boden_wald_kante_gras_1x1_01 | 1×1 | 32 | 1 | 1 | — | Waldkante |
| L061 | natur_baeume_nadel_jung_1x2_01 | 1×2 | 32 | 1 | 1 | — | junge Fichte |
| L062 | natur_baeume_nadel_alt_2x3_01 | 2×3 | 64 | 2 | 1 | — | alte Fichte |
| L063 | natur_baeume_eiche_2x3_01 | 2×3 | 64 | 2 | 1 | — | Eiche |
| L064 | natur_baeume_birke_1x3_01 | 1×3 | 32 | 1 | 1 | — | Birke |
| L065 | natur_baeume_stumpf_1x1_01 | 1×1 | 32 | 1 | 1 | — | Stubben |
| L066 | natur_baeume_stamm_liegend_2x1_01 | 2×1 | 64 | 2 | 1 | — | liegender Stamm |
| L067 | natur_baeume_krone_sommer_2x2_01 | 2×2 | 64 | 0 | 0 | — | Krone Overlay |
| L068 | natur_wald_unterholz_dicht_1x1_01 | 1×1 | 32 | 1 | 1 | — | Unterholz dicht |
| L069 | natur_wald_unterholz_licht_1x1_01 | 1×1 | 32 | 1 | 1 | — | Unterholz licht |
| L070 | natur_felsen_waldstein_1x1_01 | 1×1 | 32 | 1 | 1 | — | Waldstein |
| L071 | natur_felsen_waldstein_2x1_01 | 2×1 | 64 | 2 | 1 | — | Steinriegel |
| L072 | boden_wald_wurzel_1x1_01 | 1×1 | 32 | 1 | 1 | — | Wurzel |
| L073 | boden_wald_pilzring_1x1_01 | 1×1 | 32 | 1 | 1 | — | Pilzring |
| L074 | natur_wald_totholz_1x1_01 | 1×1 | 32 | 1 | 1 | — | Totholz |
| L075 | boden_wald_hohlweg_kante_1x1_01 | 1×1 | 32 | 1 | 1 | — | Hohlweg |
| L076 | props_wald_wildwechsel_1x1_01 | 1×1 | 32 | 0 | 0 | — | Wildwechsel |
| L077 | boden_wald_lichtung_1x1_01 | 1×1 | 32 | 1 | 1 | — | Lichtung |
| L078 | bauteile_zaeune_holzstoss_1x1_01 | 1×1 | 32 | 1 | 1 | — | Holzstoß |

## E · Pflanzen (22)

| ID | Dateiname | BxH | pivot_px | stand_b | stand_s | tuer_dx | Notiz |
|---|---|---|---:|---:|---:|---:|---|
| L079 | natur_pflanzen_gras_hoch_1x1_01 | 1×1 | 32 | 0 | 0 | — | Hochgras |
| L080 | natur_pflanzen_gras_tritt_1x1_01 | 1×1 | 32 | 0 | 0 | — | Trittgras |
| L081 | natur_pflanzen_bluete_weiss_1x1_01 | 1×1 | 32 | 0 | 0 | — | Blüte weiß |
| L082 | natur_pflanzen_bluete_gelb_1x1_01 | 1×1 | 32 | 0 | 0 | — | Blüte gelb |
| L083 | natur_pflanzen_klee_1x1_01 | 1×1 | 32 | 0 | 0 | — | Klee |
| L084 | natur_pflanzen_distel_1x1_01 | 1×1 | 32 | 1 | 1 | — | Distel |
| L085 | natur_pflanzen_farn_1x1_01 | 1×1 | 32 | 0 | 0 | — | Farn |
| L086 | natur_pflanzen_nessel_1x1_01 | 1×1 | 32 | 1 | 1 | — | Nessel |
| L087 | natur_pflanzen_schilf_1x2_01 | 1×2 | 32 | 1 | 1 | — | Schilf |
| L088 | natur_pflanzen_seerose_1x1_01 | 1×1 | 32 | 0 | 0 | — | Seerose |
| L089 | natur_hecken_buchs_gerade_1x1_01 | 1×1 | 32 | 1 | 1 | — | Hecke gerade |
| L090 | natur_hecken_buchs_ecke_1x1_01 | 1×1 | 32 | 1 | 1 | — | Hecke Ecke |
| L091 | natur_hecken_wild_1x1_01 | 1×1 | 32 | 1 | 1 | — | Wildhecke |
| L092 | natur_straeucher_holunder_1x2_01 | 1×2 | 32 | 1 | 1 | — | Holunder |
| L093 | natur_straeucher_beeren_1x1_01 | 1×1 | 32 | 1 | 1 | — | Beerenstrauch |
| L094 | natur_pflanzen_kohl_1x1_01 | 1×1 | 32 | 1 | 1 | — | Kohl |
| L095 | natur_pflanzen_weizen_1x1_01 | 1×1 | 32 | 1 | 1 | — | Weizen |
| L096 | natur_pflanzen_kraeuter_1x1_01 | 1×1 | 32 | 1 | 1 | — | Kräuter |
| L097 | natur_pflanzen_efeu_wand_1x1_01 | 1×1 | 32 | 0 | 0 | — | Efeu |
| L098 | natur_pflanzen_moos_stein_1x1_01 | 1×1 | 32 | 0 | 0 | — | Moospolster |
| L099 | natur_pflanzen_pilz_einzel_1x1_01 | 1×1 | 32 | 1 | 1 | — | Hutpilz |
| L100 | natur_pflanzen_blumentopf_1x1_01 | 1×1 | 32 | 1 | 1 | — | Blumentopf |

---

## Tiled-Lesart

`objekte_64.tsx` ist ein *Collection of Images* (`columns="0"`), `objectalignment="bottom"`.
Platzieren: Objektpunkt auf die **Süd-Kante Mitte** der Standfläche. GID-Bereich in `leiste_vorlage.tmx`: Boden `1…`, Objekte `1001…`.

Kollisionsrechteck je Gebäude liegt in der Tile-`objectgroup` `stand` — Süd bündig, Breite `stand_b*64`, Höhe `stand_s*64`.

`boden_64.tsx` bleibt ein Raster-Tileset 64×64 ohne objectalignment (Tile-Layer).

## Schnittregeln

- Dorf-Set: Kachel 32, `faktor = 2`, Lanczos, danach exakt 64.
- Kein Extra-Rand auf 1×1-Boden. Kein Alpha unter dem Haussockel.
- Haus+Anbau, Haus+Schild, Mühle+Flügel = **ein** Asset.
- Küche, UI, Charaktere, Waffen: nicht in dieser Liste.

## Nächster Schritt

1. `PROJEKT` und `RAND_PX` bestätigen.
2. **Start** schreiben.
3. Nach dem Schnitt Atlas erneut mit `--assets-dir` erzeugen, dann fehlen die 100 `missing` nicht mehr.
