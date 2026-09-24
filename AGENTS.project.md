# Lindendorf — Pflicht vor jedem Auftrag

Das Spiel existiert. Nicht neu bauen, nicht scaffolden, keine zweite Engine.

Repo: nur `PromptBrainless/lindendorf-rpg-alpha-V.1.1`. Remote `origin`. Keine Spiegel. Nicht `SpielVersion1.0`.

## Zuerst lesen

1. Diese Datei.
2. `wiki/Home.md` und `wiki/README.md` — das ist der inhaltliche Stand vom 23. September 2026.
3. `docs/KONTEXT_NEUES_FENSTER.md` — was schon spielbar ist und was das Wiki noch nicht im Code ist.

`docs/UMBAU_UMGEBUNG.md` ist keine Freigabe. Ältere Blätter unter `docs/` führen nicht, wenn sie dem Wiki widersprechen.

## Zwei Wahrheiten, eine Richtung

| Frage | Gilt |
|---|---|
| Was der Spieler heute sieht | der Code: `script.ts`, `quest-*.ts`, `lager-content.ts`, längste gleiche Handlung |
| Was der Inhalt werden soll | `wiki/` |
| Namen, Flags, Labels, solange die Szene nicht umgebaut ist | `docs/QUESTREGISTER.md`, bei Zweifel der Code |
| Klassen, Karrieren, Status, Schicksal | `wiki/` und `docs/KARRIERE-PLANUNG.md`. Noch keine fertige Mechanik. Nicht als Rassen bauen. |

Wenn eine Szene dem Wiki widerspricht, ist das Wiki das Ziel und der Code der Ist-Stand. Nicht beides gleichzeitig in einen Satz schreiben.

**Laufendes Spielleiter-Mandat (seit 24. September 2026):** Der Projekteigner hat die Sperre "eine Szene wird nur nach ausdrücklich benanntem Auftrag umgestellt" aufgehoben. Als Spielleiter darf ich Szenen fortlaufend ausbauen und vertiefen, um die im Wiki bereits ausgearbeitete Tiefe in den tatsächlichen Spieltext zu holen und die Erzählweise auszuweiten (mehr Absätze, mehr Figurentiefe, mehr sinnliche Details). Unverändert bleiben dabei: das Weltgeheimnis, alle Namen/Flags aus `docs/QUESTREGISTER.md`, die Reihenfolge Symptome → Besitzer → Rechnung, der Spielausgang und die Wahlmöglichkeiten. Es wird erweitert und vertieft, nicht umgeschrieben oder widerlegt.

## Was das Wiki festlegt

- Lindendorf ist kein Heldenepos. Die Frage ist, welche Schuld das Dorf weiterträgt.
- Das Weltgeheimnis ist der Pakt unter der Kapelle: vor etwa dreißig Jahren Vahl, Dennek und Holm. Die Gasse wurde aus den Listen genommen. Menschen wurden in Mühle, Steinbruch und Lagerhäuser am Fluss verteilt. Ilse schrieb die Namen. Ob unter der Kapelle etwas gebunden wurde, bleibt offen.
- Rotes Wachs markiert, dass etwas entfernt wurde und nicht zurückkehren darf. Die Glocke ist ein Signal, kein Gebet.
- Grovin entzieht Wasser, weil er nicht bezahlt wurde. Dennek hat das als Druck gewollt.
- Die Mühle steht still, weil sie Menschen und Gut verteilt, nicht nur weil das Korn schlecht ist.
- Die Banditen bewachen den alten Transportweg für jemanden im Dorf.
- Kein Heilungsende. Der Zustand des Dorfes steht in `wiki/Enden.md`.
- Klasse ist Milieu, Karriere ist der Beruf jetzt, Stufe ist der Stand in diesem Beruf.

## Nicht tun

- Das Wiki als schon eingebauten Spieltext behandeln. Die Seiten sind der Stand der Inhalte, nicht ein zweites `present()`.
- Texte kürzen. Stichpunkte. Pathos.
- Eine längere Fassung behalten, die eine andere Person handeln lässt. Fenn sitzt an der Mauer. Der Held nicht.
- Den Pakt in die Ankunft schreiben. Die Reihenfolge steht in `wiki/Queststruktur.md`: erst Symptome, dann Besitzer, dann die Rechnung.
- Am Brunnen heißt sie die Müllerin. Lene heißt sie in der Mühle.
- Hub nach Zahlenindex. Immer nach Label.
- Engine, Runtime, Auth, DB, Router ohne Auftrag.
- `public/art/` ohne Bildplan.

## Stimme, wenn du schreibst

Deutsch. Du. Präsens. „…“.
Befund, nicht Urteil. Geruch, Kälte, Gewicht, Arbeit.
Was die Szene schon zeigt, bleibt. Neue Schuld nur, wenn das Wiki sie dieser Szene gibt.

## Danach prüfen

`npm run typecheck`
`npm run check:prosa`
`npm run check:lore`
`npm run check:textvergleich`
`npm run check:knowledge`

Grün behaupten nur, wenn der Lauf grün war.
