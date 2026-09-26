# Lore-Sammlung

Stand der Dateien: 24. September 2026. Nur das, was in den Dateien steht. Keine Ergänzung, keine Motivdeutung.

Zwei Schichten liegen nebeneinander und werden nicht ineinander geschrieben:

- **Szene / GM-Fakt:** `src/game/*.ts`, vor allem `lore.ts`. Das ist an Szenen gebunden.
- **Wiki:** `wiki/`. Das Register nennt das den Zielkanon, nicht den schon gezeigten Spieltext (`wiki/Orte.md`, Abschnitt Orientierung; `wiki/Home.md`).

Technische Dateien (Proben, Speicher, Editor, Auth) sind nicht aufgenommen.

## 1. Dateiliste

| Pfad | Art | Warum |
|---|---|---|
| `wiki/Weltgeheimnis.md` | MD | Pakt, Kesseljahr, Siegel, Wachs, Glocke |
| `wiki/Queststruktur.md` | MD | Vier Akte und die Reihenfolge der Informationen |
| `wiki/Enden.md` | MD | Sechs Dorfzustände |
| `wiki/Orte.md` | MD | Ortsregister, Zielkanon |
| `wiki/NPCs.md` | MD | Weltbild, Angst, Geheimnis, Rechtfertigung, Ziel |
| `wiki/Queststruktur.md` | MD | Reihenfolge der Informationen |
| `wiki/Home.md` | MD | Rahmen: keine Heldengeschichte, Schuld des Dorfes |
| `wiki/Szenenplan.md` | MD | Was eingebaut ist |
| `wiki/Knowledge-Anker.md`, `wiki/Wissenstafeln.md` | MD | Wissen, nicht die Handlung selbst |
| `wiki/Quest-Ankunft*.md` | MD | Ankunft, Szene für Szene im Wiki |
| `wiki/01` bis `wiki/11`, `Lindendorf-*.md` | MD | Klassen, Berufe, Schicksal. Regeln, keine gespielte Vergangenheit |
| `src/game/lore.ts` | TS | 42 GM-Fakten, je mit Szenen und Figuren. Funktionen ab Zeile 295 ausgelassen |
| `src/game/quest-brunnen.ts` | TS | Spieltext Brunnen, Dennek, Grovin |
| `src/game/quest-muehle.ts` | TS | Spieltext Mühle, Bertok, Lene, Rennik |
| `src/game/quest-kesseljahr.ts` | TS | Spieltext Gasse, Fenn, Vahl |
| `src/game/kesseljahr-grete.ts`, `kesseljahr-gewoelbe.ts`, `kesseljahr-schluss.ts` | TS | Grete, Liste, Ausgänge |
| `src/game/quest-ungerufener-name.ts` | TS | Knoten, Köhler, Kinderumhang, Namen in der Kiste |
| `src/game/content.ts` | TS | Weg und Fremder |
| `src/game/script.ts` | TS | Dorfschleife, Hang, Wald, Lager, Ende. Nur die Sprechzeilen tragen Weltwissen |
| `src/game/lager-content.ts` | TS | Kess und das Lager |
| `src/game/knowledge.ts` | TS | Schlüssel der Wissensanker, keine zweite Geschichte |
| `src/game/json/wissen/*.json` | JSON | Tafeln zu einzelnen Szenen. Dieselbe Schicht wie die Szenen, nicht das Wiki |
| `src/game/gegenstaende.ts` | TS | Dinge im Beutel |
| `docs/figuren/*.md` | MD | Auszug mit den Marken Szene, Lore, Wiki, Schriftstück, Bild |
| `docs/sieben-quests.md`, `docs/informationssheets.md`, `docs/quests/*.md` | MD | Arbeitsfassungen. Nicht als eigene Quelle neben Wiki und Szene verwenden |
| `export/` | Archiv | Alter Stand. Hier nicht als heutiger Text verwendet |
| `AGENTS.project.md` | MD | Wiederholt den Pakt in sechs Sätzen und sagt, das Wiki sei das Ziel |

## 2. Weltgeschichte

Quelle `wiki/Weltgeheimnis.md`, Abschnitt Historischer Kern:

Vor etwa dreißig Jahren, im Kesseljahr, entschied ein informeller Rat aus drei Familien, Vahl, Dennek und Holm, dass das Dorf nur überleben könne, wenn es die Versorgung des Tals kontrolliert. Eine Gasse wurde aus den Aufzeichnungen entfernt. Bewohner wurden „umverteilt“: Mühle, Steinbruch, Lagerhäuser am Fluss. Wer sich wehrte, verschwand ohne Eintrag. Ilse Brandtner, Hebamme, führte eine Liste der Toten und Vermissten. Die Kirche bewahrte auf, was offiziell nicht existieren durfte.

Quelle `wiki/Weltgeheimnis.md`, Abschnitt Das Ritual, und `src/game/lore.ts` Fakt `pakt-grube`:

Unter der Kapelle am Hang liegt keine geweihte Kammer, sondern eine Grube, älter als die Kirche. Ob dort etwas gebunden wurde, bleibt in beiden Dateien offen. Dieselbe Datei im Wiki: seit dem Kesseljahr sterben weniger Menschen offiziell, verschwinden tun mehr.

Quelle `src/game/lore.ts` Fakt `ilse-liste`:

Im Gewölbe liegt Ilses Wachstuch: Namen, Daten, die drei Familien. Wer sich wehrte, hat keinen Eintrag. Andere wurden in die Mühle, in den Steinbruch und in die Lagerhäuser verteilt. Vahls Großvater steht zuerst. Die Häuser der Gasse sind nur noch Fläche.

Quelle `src/game/lore.ts` Fakt `fenn-kesseljahr`:

Fenn hat als Kind gesehen, wie Menschen aus der Gasse geholt wurden. Die Gasse wurde vernagelt. Das Korn kam nicht, das Fieber schon. Das Land wurde verteilt, bevor die Trauer kam. Vahls Großvater hat zuerst gezeichnet. Den ganzen Pakt sagt er nicht.

Quelle `src/game/script.ts`, Zeile der Ankunftszeile über die Gasse:

„eine Gasse, die zehn Jahre niemand betreten hat.“

Quelle `src/game/quest-kesseljahr.ts`, Fenn blickt zur Gasse:

„selbst nach zehn Jahren.“

## 3. Zeitleiste, nur belegte Punkte

| Punkt | Belegt in |
|---|---|
| Grube älter als die Kirche | `wiki/Weltgeheimnis.md`, `lore.ts` `pakt-grube`, `wiki/Orte.md` Kapelle |
| Kesseljahr, etwa dreißig Jahre vor der Wiki-Gegenwart | `wiki/Weltgeheimnis.md`, `lore.ts` `pakt-grube`, `wiki/Orte.md` |
| Gasse seit zehn Jahren unbetreten, im Spieltext | `script.ts`, `quest-kesseljahr.ts` |
| Zeichen am Nordpass, „vor Jahren“, offenes Auge über drei Linien | `lore.ts` `fremder-silber`, `content.ts` Fremder |
| Grovin: drei Jahre Arbeit, kein Lohn | `quest-brunnen.ts`, Grovin an der Zisterne |
| Vahl will die Gasse in einer Woche bebauen | `lore.ts` `gasse-gemieden` |
| Kirche: seit zehn Jahren kein Abfluss an der Schwelle | `quest-kesseljahr.ts` Kirchenabsatz. Das steht dort über die Schwelle, nicht über das Kesseljahr |

## 4. Fraktionen und politische Struktur

Keine Datei benutzt das Wort Fraktion für eine eigene Organisation. Belegt sind:

- Drei Familien: Vahl, Dennek, Holm. `wiki/Weltgeheimnis.md`, `lore.ts` `ilse-liste`.
- Holm ist der Bürgermeister, nicht Dennek und nicht Vahl. `lore.ts` `holm-auftrag`.
- Das Amt benennt öffentlich nur die Banditen im Steinbruch. `lore.ts` `amt-nennt-nur-banditen`.
- Dennek ist der Mann am Brunnen. „Trockenes Jahr“ ist sein geübter Satz, nicht die Ursache. `lore.ts` `brunnen-not`.
- Vahl nennt den Bau Ordnung. Nach dem Großvater sagt er „Verantwortung“ und bricht ab, sobald es um die Aufteilung geht. `lore.ts` `vahl-ring`.
- Banditen im Steinbruch, angeführt im Text von Kess, ohne Wappen. Sie bewachen den alten Transportweg für jemanden im Dorf. `lore.ts` `lager-kiste`, `glockenweg-nutzung`. Der Name dieses Jemand steht nicht in diesen Fakten.
- Rennik wiegt fremdes Korn. An der Wand hängt Bertoks Schuldschein. Eine zweite Schuld Renniks in einem Nachbarort steckt in dem Papier im Mahlstein. `lore.ts` `rennik-schein`.

`wiki/NPCs.md` gibt jeder Figur zusätzlich Weltbild, Angst, Geheimnis, Rechtfertigung und Ziel. Das sind Wiki-Sätze, nicht die Dialogzeilen.

## 5. Orte

Aus `wiki/Orte.md`, Abschnitt Orientierung: das Tal zwischen Wald, Hang und altem Versorgungsweg. Lindendorf unten am Wasser. Kapelle oberhalb. Osten: alter Steinbruch und Lager.

Aus `lore.ts` `ankunft-platz`: vom Platz Rathaus, Taverne, Brunnen, Mühle, Weg zum Hang. Im Osten raucht der Steinbruch.

Weitere Orte, die in `lore.ts` eine eigene Tatsache haben: Weg, Tal (Rauch ohne Wind, Kinderschuh), Ablaufgraben, Zisterne am Waldrand, Gerbereigasse, Kirche und Gewölbe (dritter Stein von links, Rücken zur Treppe, Wachs aus der Gerberei: `grete-ilse`), Glockenweg, Kapelle, Lagerhaus am Fluss, Kontor Renniks, Kornkammer, Steinbruch mit drei Zelten.

`wiki/Orte.md` sagt zum Weg: Lindendorf sei nicht abgeschnitten, sondern verlassen worden. `content.ts` sagt, der Held glaube seit Tagen, niemand betrete den Pfad. Das sind zwei Sätze aus zwei Schichten.

## 6. Charaktere, nur der belegte Satz

Vollständige Akten mit getrennten Marken: `docs/figuren/`. Hier nur der Satz aus `lore.ts`, der die Figur festlegt.

| Figur | Satz | Fakt |
|---|---|---|
| Der Fremde | Namenlos, mager, linker Ärmel blutig. Unter dem Mantel ein Rest des Siegels: offenes Auge über drei Linien | `fremder-silber` |
| Holm | Bürgermeister. Auftrag gegen das Lager. Weiß, dass das Kesseljahr kein Unfall war | `holm-auftrag`, `amt-nennt-nur-banditen` |
| Dennek | Hat Grovin den Lohn vorenthalten, damit das Wasser Druck bleibt | `dennek-grovin` |
| Grovin | Hat den Brunnen gebaut, nie Lohn gesehen. Will Anerkennung, nicht Gift | `grovin-rechnung` |
| Witwe Kern | Heilerin, nicht Mirl. Hält die Trübung nicht für Krankheit allein | `kern-dorf`, `kern-befund` |
| Bertok | Hände mehlweiß, obwohl nichts gemahlen wurde. Schuldschein im Mahlstein | `muehle-still`, `bertok-rennik` |
| Lene | Bertoks Tochter, nicht Sanna. Eigene Namen. Schwester tot | `lene-nische` |
| Yorwin | Ihr Schwager, mit zwei Kindern in der Nische | `lene-nische` |
| Rennik | Fremdes Korn, Bertoks Schein, zweite Schuld im Nachbarort | `rennik-schein` |
| Fenn | An der Kirchmauer, nicht am Brunnen. Stück Lattenzaun. Sagt nicht den ganzen Pakt | `fenn-kesseljahr` |
| Vahl | Siegelring. Bau als Ordnung | `vahl-ring` |
| Vahls Großvater | Hat zuerst gezeichnet | `fenn-kesseljahr`, `ilse-liste` |
| Grete | Fast blind. Hört, ob jemand Zeit mitbringt. Drängen sperrt sie | `grete-ilse` |
| Ilse Brandtner | Hebamme. Liste. Im Mühlbach gefunden, an einem Abend mit niedrigem Wasser | `grete-ilse` |
| Sanna | Versiegelte Nachricht im Geröll verloren | `sanna-siegel` |
| Jorren | Haftet für das Salz im Geröll | `jorren-salz` |
| Mara | „Zum letzten Fass“. Pfad hinter der Taverne | `mara-pfad` |
| Kess | Narbe, kein Wappen. Sagt, das hier habe vor dem Auftrag angefangen | `lager-kiste`, `lager-wege` |
| Der Schmied | In den bestehenden Quests keine eigene Schuld und kein eigener Ausgang | `schmied-rand` |
| Der Küster | Merkt sich das Gesicht, wenn das nächtliche Schleichen scheitert | `gewoelbe-zugang` |
| Pfarrer | In `lore.ts` nicht als eigener Fakt. In `gewoelbe-zugang` lässt „der Pfarrer“ einen bittenden Helden leichter hinunter, wenn das Kirchensilber dabei ist | `gewoelbe-zugang` |

`wiki/NPCs.md` setzt für Holm, Dennek, Vahl, Grovin, Bertok, Lene und Fenn je ein Geheimnis. Diese Sätze stehen nur dort, bis eine Szene sie sagt.

## 7. Konflikte, so wie die Dateien sie als Ausgänge schreiben

Brunnen, `lore.ts` `brunnen-enden`: Bestechen lässt zwei Brunnen, es reicht nicht für alle. Zerstören ohne entlarvten Dennek lässt einen Riss, Grovin ist nur für den Tag fort. Verhandeln oder Öffnen endet klar. Ein Versprechen an Grovin steht noch nicht in Holms Kasse.

Mühle, `lore.ts` `muehle-enden`: Verrat an Holm gibt Schutz und pünktliches Mehl, Bertok grüßt danach nur noch kühl. Schein stehlen oder Rennik stellen löst die Mühle leise. Kampf jagt Rennik fort.

Liste, `lore.ts` `liste-ausgang`: Vorlesen nimmt Vahl den Sitz. Holm zustecken lässt den Bauplatz liegen, die Wahrheit bleibt in der Schublade. Unter vier Augen stoppt den Bau und lässt Vahl im Amt. Verbrennen für Fenn löscht die Namen, die Gasse wird bebaut.

Lager, `lore.ts` `lager-wege`: Schleichen, Drohen, Handel, Lügen, Kampf, Seitentor. Kess bittet um sein Leben und sagt, sein Tod gebe dem Dorf nichts zurück.

Ende, `wiki/Enden.md`: sechs Zustände. Ordnung bewahren, Namen öffentlich, Grovin anerkennen, Mühle schützen, Siegel brechen, alles verbrennen. `lore.ts` `muster` nennt vier: Ordnung, Namen, Grovin, Mühle. Die Sätze „Siegel brechen“ und „Alles verbrennen“ stehen im Wiki, nicht in `muster`.

## 8. Religion, Magie, Wirtschaft

Religion. `wiki/Weltgeheimnis.md`: das rote Wachs ist kein Glaubenszeichen. Die Glocke läutet nicht zum Gebet. `lore.ts` `pakt-grube`: keine geweihte Kammer. Eine eigene Religion, ein Gott oder eine Liturgie stehen in diesen Dateien nicht.

Magie oder Technik. Dieselbe Stelle: ob etwas gebunden wurde, bleibt offen. Ein System mit Regeln, Kosten oder Wirkungen steht dort nicht.

Wirtschaft. Belegt: Mehl und Mühle (`muehle-still`), Salz auf dem Glockenweg (`jorren-salz`), Wasser als entzogene Menge (`grovin-rechnung`), Gold als Zahlung an Grovin und als Lohn aus dem Salz, Schuldscheine (`rennik-schein`), Lagerhäuser, Steinbruch, Korn, das nicht kam (`fenn-kesseljahr`). Keine Preisliste, kein Münzname außer Gold und ein alter Groschen am Brunnen in `script.ts`.

## 9. Quests und was sie nach den Dateien tragen

`wiki/Queststruktur.md` ordnet sie so:

1. Ankunft. Artefakt, Graben, Wachs, Glocke ohne Reaktion.
2. Lindendorf. Holms Auftrag. Gerücht von Leuten, die nicht mehr gezählt werden.
3. Trübes Wasser. Grovin. Dennek als Mitwisser.
4. Stumme Mühle. Bertok, Lene, Flüchtlinge, Rennik.
5. Kesseljahr. Fenn, Vahl, Grete, Ilse, Liste.
6. Hang und Wald. Sanna, Jorren, Salz, Glocke als Signal.
7. Banditenlager. Bewachung für jemanden im Dorf.
8. Kirche und Gewölbe. Im Wiki als eigener Akt. Im Code sind Gewölbe und Liste Teil der Kesseljahr-Dateien `kesseljahr-gewoelbe.ts` und `kesseljahr-schluss.ts`.

`quest-ungerufener-name.ts` hängt an Knoten, Glocke, Köhler und der Kiste mit Namen und Kreuzen. `lore.ts` hat dafür keinen eigenen Fakt. Der Kinderumhang und die Kreuze stehen im Fakt `lager-kiste`.

## 10. Unsicherheiten, nur als Differenz der Dateien

Fehlt. Der Name dessen, für den die Banditen den Weg bewachen. `lore.ts` `lager-kiste` sagt „jemanden im Dorf“ und nennt ihn nicht. Ob der Pfarrer das Artefakt in die Grube gelegt hat, steht in den gelesenen Szenen- und Lore-Dateien nicht. Der Fremde hat in `content.ts` und `lore.ts` `fremder-silber` keinen Namen.

Widerspruch, nicht aufgelöst. Das Wiki und `lore.ts` `pakt-grube` setzen das Kesseljahr vor etwa dreißig Jahren. `script.ts` sagt, die Gasse habe zehn Jahre niemand betreten. `quest-kesseljahr.ts` lässt Fenn „nach zehn Jahren“ zur Gasse sehen. Die zehn Jahre an der Kirchenschwelle und bei Gretes Gehör stehen in derselben Datei über die Schwelle und über Grete, nicht als Datum des Pakts.

Mehrdeutig, weil die Datei es so sagt. `wiki/Weltgeheimnis.md` und `lore.ts` `pakt-grube`: ob unter der Kapelle etwas gebunden wurde, bleibt offen. `wiki/Enden.md`, Ende 5: „Etwas wird freigesetzt, oder die Menschen glauben nur, dass es so ist.“

Nicht bestätigt, deshalb hier nicht als Zusammenhang geschrieben. Gleichsetzungen zwischen dem Fremden, dem Pfarrer, Fenn, Kess oder dem Jungen am Brunnen. Keine der gelesenen Dateien setzt sie gleich. `docs/kontext/01-abgleich.md` hält das bereits fest.
