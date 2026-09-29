#!/usr/bin/env python3
"""Write kachel-leiste-100.json / .csv and refresh pivot columns in the markdown."""

from __future__ import annotations

import csv
import json
from pathlib import Path

T = 64
OUT = Path("/home/workdir/artifacts")


def px_class(bx: int, by: int) -> tuple[int, int, int]:
    w, h = bx * T, by * T
    return w // 2, h, h  # pivot_px, pivot_py, unused


def row(
    lid: str,
    datei: str,
    bx: int,
    by: int,
    block: str,
    rolle: str,
    stand_b: int,
    stand_s: int,
    tuer_dx,
    tuer_dy,
    notiz: str = "",
) -> dict:
    pivot_px = (bx * T) // 2
    pivot_py = by * T
    return {
        "id": lid,
        "datei": datei,
        "bx": bx,
        "by": by,
        "px_w": bx * T,
        "px_h": by * T,
        "block": block,
        "rolle": rolle,
        "pivot_px": pivot_px,
        "pivot_py": pivot_py,
        "origin_x": 0.5,
        "origin_y": 1.0,
        "stand_b": stand_b,
        "stand_s": stand_s,
        "tuer_dx": tuer_dx,
        "tuer_dy": tuer_dy,
        "overlay": rolle == "overlay",
        "objectalignment": "bottom",
        "notiz": notiz,
    }


ITEMS = [
    row("L001", "gebaeude_dorf_huette_stroh_2x2_01", 2, 2, "A", "objekt", 2, 1, 0, 0, "Hütte Stroh"),
    row("L002", "gebaeude_dorf_huette_schindel_2x2_01", 2, 2, "A", "objekt", 2, 1, 0, 0, "Hütte Schindel"),
    row("L003", "gebaeude_dorf_fachwerk_klein_2x2_01", 2, 2, "A", "objekt", 2, 1, 0, 0, "Fachwerk klein"),
    row("L004", "gebaeude_dorf_fachwerk_breit_3x2_01", 3, 2, "A", "objekt", 3, 1, 1, 0, "Fachwerk breit"),
    row("L005", "gebaeude_dorf_bauernhaus_3x2_01", 3, 2, "A", "objekt", 3, 1, 1, 0, "Bauernhaus"),
    row("L006", "gebaeude_dorf_scheune_3x2_01", 3, 2, "A", "objekt", 3, 1, 1, 0, "Scheune"),
    row("L007", "gebaeude_dorf_schmiede_2x2_01", 2, 2, "A", "objekt", 2, 1, 0, 0, "Schmiede"),
    row("L008", "gebaeude_dorf_taverne_3x2_01", 3, 2, "A", "objekt", 3, 1, 1, 0, "Taverne"),
    row("L009", "gebaeude_dorf_laden_2x2_01", 2, 2, "A", "objekt", 2, 1, 0, 0, "Laden"),
    row("L010", "gebaeude_dorf_muehle_3x3_01", 3, 3, "A", "objekt", 3, 2, 1, 1, "Mühle"),
    row("L011", "gebaeude_dorf_kirche_klein_3x3_01", 3, 3, "A", "objekt", 3, 2, 1, 1, "Kirche klein"),
    row("L012", "gebaeude_dorf_rathaus_3x2_01", 3, 2, "A", "objekt", 3, 1, 1, 0, "Rathaus"),
    row("L013", "gebaeude_dorf_brunnenhaus_2x2_01", 2, 2, "A", "objekt", 2, 2, None, None, "volle Sperre, keine Tür"),
    row("L014", "gebaeude_dorf_stall_2x2_01", 2, 2, "A", "objekt", 2, 1, 0, 0, "Stall"),
    row("L015", "gebaeude_dorf_speicher_2x2_01", 2, 2, "A", "objekt", 2, 1, 0, 0, "Speicher"),
    row("L016", "bauteile_daecher_giebel_stroh_2x1_01", 2, 1, "A", "overlay", 0, 0, None, None, "Dach Giebel"),
    row("L017", "bauteile_daecher_walm_schindel_2x1_01", 2, 1, "A", "overlay", 0, 0, None, None, "Dach Walm"),
    row("L018", "bauteile_waende_fachwerk_hell_1x1_01", 1, 1, "A", "kachel", 0, 0, None, None, "Fassade"),
    row("L019", "bauteile_tueren_holztuer_1x2_01", 1, 2, "A", "objekt", 1, 1, 0, 0, "Tür = eigene Zelle"),
    row("L020", "bauteile_fenster_bleiglas_klein_1x1_01", 1, 1, "A", "overlay", 0, 0, None, None, "Fenster"),
    row("L021", "boden_wege_erde_mitte_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Erdweg Mitte"),
    row("L022", "boden_wege_erde_kante_n_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Erdweg Kante N"),
    row("L023", "boden_wege_erde_kante_o_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Erdweg Kante O"),
    row("L024", "boden_wege_erde_knick_no_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Erdweg Knick NO"),
    row("L025", "boden_wege_erde_kreuz_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Erdweg Kreuz"),
    row("L026", "boden_wege_erde_t_sued_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Erdweg T"),
    row("L027", "boden_wege_kies_mitte_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Kies Mitte"),
    row("L028", "boden_wege_kies_kante_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Kies Kante"),
    row("L029", "boden_wege_holzsteg_laengs_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Steg längs"),
    row("L030", "boden_wege_holzsteg_quer_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Steg quer"),
    row("L031", "boden_wege_holzsteg_ende_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Steg Ende"),
    row("L032", "boden_wege_radspur_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Radspur"),
    row("L033", "boden_wege_pfuetze_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Pfütze"),
    row("L034", "boden_wege_trittstein_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Trittstein"),
    row("L035", "boden_wege_hang_stufe_1x1_01", 1, 1, "B", "kachel", 1, 1, None, None, "Hangstufe"),
    row("L036", "props_wege_meilenstein_1x1_01", 1, 1, "B", "objekt", 1, 1, None, None, "Meilenstein"),
    row("L037", "props_wege_wegweiser_holz_1x2_01", 1, 2, "B", "objekt", 1, 1, None, None, "Wegweiser"),
    row("L038", "bauteile_zaeune_latten_gerade_1x1_01", 1, 1, "B", "objekt", 1, 1, None, None, "Lattenzaun"),
    row("L039", "boden_stadt_pflaster_mitte_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Pflaster 1"),
    row("L040", "boden_stadt_pflaster_mitte_1x1_02", 1, 1, "C", "kachel", 1, 1, None, None, "Pflaster 2"),
    row("L041", "boden_stadt_pflaster_mitte_1x1_03", 1, 1, "C", "kachel", 1, 1, None, None, "Pflaster 3"),
    row("L042", "boden_stadt_pflaster_kante_n_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Pflaster Kante"),
    row("L043", "boden_stadt_pflaster_ecke_no_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Pflaster Ecke"),
    row("L044", "boden_stadt_pflaster_innenecke_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Pflaster Innenecke"),
    row("L045", "boden_stadt_rinne_gerade_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Rinne"),
    row("L046", "boden_stadt_rinne_kreuz_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Rinne Kreuz"),
    row("L047", "boden_stadt_bordstein_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Bordstein"),
    row("L048", "boden_stadt_platz_ornament_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Platzornament"),
    row("L049", "boden_stadt_bruchstein_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Bruchstein"),
    row("L050", "boden_stadt_ziegel_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Ziegel"),
    row("L051", "boden_stadt_luke_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Luke"),
    row("L052", "boden_stadt_gully_1x1_01", 1, 1, "C", "kachel", 1, 1, None, None, "Gully"),
    row("L053", "props_stadt_laterne_1x2_01", 1, 2, "C", "objekt", 1, 1, None, None, "Laterne"),
    row("L054", "props_stadt_brunnen_2x2_01", 2, 2, "C", "objekt", 2, 2, None, None, "Marktbrunnen volle Sperre"),
    row("L055", "props_stadt_bank_stein_1x1_01", 1, 1, "C", "objekt", 1, 1, None, None, "Steinbank"),
    row("L056", "bauteile_mauern_stadtmauer_1x1_01", 1, 1, "C", "objekt", 1, 1, None, None, "Stadtmauer"),
    row("L057", "boden_wald_nadelstreu_1x1_01", 1, 1, "D", "kachel", 1, 1, None, None, "Nadelstreu"),
    row("L058", "boden_wald_nadelstreu_1x1_02", 1, 1, "D", "kachel", 1, 1, None, None, "Nadelstreu Wurzeln"),
    row("L059", "boden_wald_moos_1x1_01", 1, 1, "D", "kachel", 1, 1, None, None, "Moos"),
    row("L060", "boden_wald_kante_gras_1x1_01", 1, 1, "D", "kachel", 1, 1, None, None, "Waldkante"),
    row("L061", "natur_baeume_nadel_jung_1x2_01", 1, 2, "D", "objekt", 1, 1, None, None, "junge Fichte"),
    row("L062", "natur_baeume_nadel_alt_2x3_01", 2, 3, "D", "objekt", 2, 1, None, None, "alte Fichte"),
    row("L063", "natur_baeume_eiche_2x3_01", 2, 3, "D", "objekt", 2, 1, None, None, "Eiche"),
    row("L064", "natur_baeume_birke_1x3_01", 1, 3, "D", "objekt", 1, 1, None, None, "Birke"),
    row("L065", "natur_baeume_stumpf_1x1_01", 1, 1, "D", "objekt", 1, 1, None, None, "Stubben"),
    row("L066", "natur_baeume_stamm_liegend_2x1_01", 2, 1, "D", "objekt", 2, 1, None, None, "liegender Stamm"),
    row("L067", "natur_baeume_krone_sommer_2x2_01", 2, 2, "D", "overlay", 0, 0, None, None, "Krone Overlay"),
    row("L068", "natur_wald_unterholz_dicht_1x1_01", 1, 1, "D", "objekt", 1, 1, None, None, "Unterholz dicht"),
    row("L069", "natur_wald_unterholz_licht_1x1_01", 1, 1, "D", "objekt", 1, 1, None, None, "Unterholz licht"),
    row("L070", "natur_felsen_waldstein_1x1_01", 1, 1, "D", "objekt", 1, 1, None, None, "Waldstein"),
    row("L071", "natur_felsen_waldstein_2x1_01", 2, 1, "D", "objekt", 2, 1, None, None, "Steinriegel"),
    row("L072", "boden_wald_wurzel_1x1_01", 1, 1, "D", "kachel", 1, 1, None, None, "Wurzel"),
    row("L073", "boden_wald_pilzring_1x1_01", 1, 1, "D", "kachel", 1, 1, None, None, "Pilzring"),
    row("L074", "natur_wald_totholz_1x1_01", 1, 1, "D", "objekt", 1, 1, None, None, "Totholz"),
    row("L075", "boden_wald_hohlweg_kante_1x1_01", 1, 1, "D", "kachel", 1, 1, None, None, "Hohlweg"),
    row("L076", "props_wald_wildwechsel_1x1_01", 1, 1, "D", "overlay", 0, 0, None, None, "Wildwechsel"),
    row("L077", "boden_wald_lichtung_1x1_01", 1, 1, "D", "kachel", 1, 1, None, None, "Lichtung"),
    row("L078", "bauteile_zaeune_holzstoss_1x1_01", 1, 1, "D", "objekt", 1, 1, None, None, "Holzstoß"),
    row("L079", "natur_pflanzen_gras_hoch_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Hochgras"),
    row("L080", "natur_pflanzen_gras_tritt_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Trittgras"),
    row("L081", "natur_pflanzen_bluete_weiss_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Blüte weiß"),
    row("L082", "natur_pflanzen_bluete_gelb_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Blüte gelb"),
    row("L083", "natur_pflanzen_klee_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Klee"),
    row("L084", "natur_pflanzen_distel_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Distel"),
    row("L085", "natur_pflanzen_farn_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Farn"),
    row("L086", "natur_pflanzen_nessel_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Nessel"),
    row("L087", "natur_pflanzen_schilf_1x2_01", 1, 2, "E", "objekt", 1, 1, None, None, "Schilf"),
    row("L088", "natur_pflanzen_seerose_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Seerose"),
    row("L089", "natur_hecken_buchs_gerade_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Hecke gerade"),
    row("L090", "natur_hecken_buchs_ecke_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Hecke Ecke"),
    row("L091", "natur_hecken_wild_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Wildhecke"),
    row("L092", "natur_straeucher_holunder_1x2_01", 1, 2, "E", "objekt", 1, 1, None, None, "Holunder"),
    row("L093", "natur_straeucher_beeren_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Beerenstrauch"),
    row("L094", "natur_pflanzen_kohl_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Kohl"),
    row("L095", "natur_pflanzen_weizen_1x1_01", 1, 1, "E", "kachel", 1, 1, None, None, "Weizen"),
    row("L096", "natur_pflanzen_kraeuter_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Kräuter"),
    row("L097", "natur_pflanzen_efeu_wand_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Efeu"),
    row("L098", "natur_pflanzen_moos_stein_1x1_01", 1, 1, "E", "overlay", 0, 0, None, None, "Moospolster"),
    row("L099", "natur_pflanzen_pilz_einzel_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Hutpilz"),
    row("L100", "natur_pflanzen_blumentopf_1x1_01", 1, 1, "E", "objekt", 1, 1, None, None, "Blumentopf"),
]


def dash(v) -> str:
    return "—" if v is None else str(v)


def main() -> None:
    assert len(ITEMS) == 100, len(ITEMS)
    ids = [i["id"] for i in ITEMS]
    assert ids == [f"L{n:03d}" for n in range(1, 101)]

    catalog = {
        "projekt": "kachel-leiste",
        "t": T,
        "objectalignment": "bottom",
        "origin": {"x": 0.5, "y": 1.0},
        "items": ITEMS,
    }
    (OUT / "kachel-leiste-100.json").write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    fields = [
        "id",
        "datei",
        "bx",
        "by",
        "rolle",
        "pivot_px",
        "pivot_py",
        "stand_b",
        "stand_s",
        "tuer_dx",
        "tuer_dy",
        "notiz",
    ]
    with (OUT / "kachel-leiste-100.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        for it in ITEMS:
            row_out = {k: ("" if it[k] is None else it[k]) for k in fields}
            w.writerow(row_out)

    print(f"wrote {len(ITEMS)} items")


if __name__ == "__main__":
    main()
