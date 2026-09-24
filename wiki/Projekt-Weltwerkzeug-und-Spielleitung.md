# Weltwerkzeug und Spielleitung

## Der zweite Bereich des Projekts

Lindendorf besteht aus zwei miteinander verbundenen Bereichen. Im Spielerbereich erlebt der Held die vorhandenen Szenen, trifft Entscheidungen und trägt deren Folgen durch das Tal. Im Spielleiterbereich wird die Geschichte vorbereitet, geprüft und weitergeschrieben. Beide Bereiche greifen auf denselben Szenenkatalog zurück. Dadurch arbeitet die Spielleitung nicht an einer losgelösten Kopie, sondern an dem Werk, das die Partie tatsächlich liefert.

Der Einstieg in den Spielleiterbereich liegt unter `/editor` und bleibt durch den vorhandenen Zugang geschützt. Nach dem Eintritt öffnet sich die Spielleiter-Werkstatt. Sie führt durch die Übersicht der acht Questreihen und 71 Seiten, durch die Schreibflächen, die Figurenarbeit, die Wissenstafeln, die Orte und die Prüfungen.

## Was die Werkstatt leisten soll

Die Werkstatt soll der Ort sein, an dem die Geschichte vollständig gedacht und sorgfältig vorbereitet werden kann. Hier kann die Spielleitung eine vorhandene Seite lesen, ihre Sprache prüfen, eine neue Fassung entwerfen und sie als Auflage an genau dieser Seite merken. Hier können Figuren mit Namen, Rolle, Ort, Weltbild, Angst, Ziel und eigener Stimme angelegt werden. Hier können Wissenstafeln entstehen, die an einen konkreten Moment gebunden sind und später eine Spur wieder aufnehmen. Hier lässt sich verfolgen, welche Orte bereits durch das Spiel getragen werden und welche Seiten an ihnen hängen.

Die Werkstatt beantwortet dabei nicht nur die Frage, ob ein JSON gültig ist. Sie macht sichtbar, ob eine Seite im Fluss erreichbar ist, ob die vorhandene Textfassung vollständig genug ist, ob Bilder und Porträts auflösbar sind und ob Informationen aus dem Spielleiterwissen versehentlich in die Heldensicht geraten. Eine bestandene technische Prüfung ersetzt keine redaktionelle Entscheidung, aber sie verhindert, dass eine schöne Fassung an einer toten Kante oder einer falschen Kennung endet.

## Die Grenze zwischen Kanon und Auflage

Der Code ist der Ist-Stand der Partie. `src/game/script.ts`, die Questmodule, der Lagerinhalt, `knowledge.ts` und die Laufzeit entscheiden darüber, was der Spieler heute sehen und tun kann. Das Wiki ist der Zielstand der Welt. Der [Lore-Index](Lore-Index.md), das [Weltgeheimnis](Weltgeheimnis.md), das [Ortsregister](Orte.md) und die [Queststruktur](Queststruktur.md) beschreiben, welche Geschichte Lindendorf tragen soll.

Eine Auflage ist ein sorgfältig begrenzter Zwischenschritt. Sie ersetzt eine Seite für die Partie, ohne den ursprünglichen Kanon zu löschen. Die Werkstatt bewahrt den vorherigen Text, zeigt Unterschiede an und erlaubt, zur kanonischen Fassung zurückzukehren. Eine Auflage macht aus einer Wiki-Idee noch keine spielbare Handlung. Dafür braucht es einen eigenen Auftrag, eine benannte Szene und eine Prüfung der Folgen.

## Geschichte und Sprache

Beim Schreiben spricht Lindendorf den Helden mit „du“ an und bleibt im Präsens. Der Text erzählt vollständig. Er gibt Geruch, Kälte, Gewicht und Arbeit Raum. Figuren antworten aus ihrer Angst, ihrem Nutzen und ihrer Rechtfertigung heraus. Der Text urteilt nicht an ihrer Stelle und erklärt kein Geheimnis früher, als die Handlung es tragen kann.

Die Reihenfolge der Erkenntnis beginnt mit sichtbaren Symptomen. Der Brunnen schmeckt nach Eisen. Die Mühle steht still. Eine Gasse ist leer. Eine Glocke bewegt sich über dem Hang. Erst danach werden Besitzer, Rechnungen und die Geschichte des Kesseljahrs erkennbar. Der Pakt gehört in die fünfte Quest, Das Kesseljahr, nicht in die Ankunft.

## Figuren und Autorenmaterial

Die kanonischen Figuren bleiben als Leitplanken erhalten. Holm, Dennek, Vahl, Grovin, Bertok, Lene, Fenn, Grete, Rennik, der Pfarrer, Mara, Sanna, Jorren und Kess gehören zur bestehenden Welt und dürfen nicht durch einen neuen Entwurf ersetzt werden, nur weil eine andere Fassung bequemer wäre.

Für neue Figuren gibt es ein getrenntes Autorenmaterial. Es wird lokal gespeichert und mit einem Zod-Schema geprüft. Eine neue Figur kann dort vollständig beschrieben werden, ohne dass sie sofort in der Partie handelt oder den Spielertext verändert. Erst wenn ihre Szene, ihre Handlung und ihre Folge in einem eigenen Auftrag festgelegt sind, wird sie aus dem Entwurf in den Kanon und anschließend in den Code überführt.

## Wissenstafeln und Orte

Wissenstafeln halten nicht bloß Hintergrundwissen fest. Sie verändern, was der Held später erkennt. Eine Tafel darf das silberne Artefakt beschreiben, ohne seine Herkunft zu erklären. Sie darf rotes Wachs als Spur zeigen, ohne den Pakt zu nennen. Die vollständigen Regeln für diese Reihenfolge stehen im [Lore-Index](Lore-Index.md) und bei den [Knowledge-Ankern](Knowledge-Anker.md).

Das Ortsbild stammt aus `src/game/weltbild.ts` und bleibt an die Szenen gebunden. Der [Orte und Schauplätze](Orte.md) genannte Zielkanon kann weiter sein als der aktuelle Code, aber der Spielleiterbereich behauptet nicht, dass jede geplante Verbindung schon spielbar ist. Ein Ort wird in der Werkstatt über sein Label und seine vorhandenen Seiten gefunden, niemals über einen zufälligen Zahlenindex.

## Prüfung und technische Grenzen

Der Weltgraph prüft die erreichbaren Knoten und Kanten des vorhandenen Katalogs. Die Lagerprüfung sucht nach Wegen, die keinen gültigen Zugang besitzen. Der Textvergleich stellt fest, welche Fassung tatsächlich länger und damit für die laufende Partie maßgeblich ist. Die Bildprüfung prüft vorhandene Schlüssel und Quellen. Die Heldensichtprüfung sucht nach privaten Lore-Fakten, die nicht sichtbar werden dürfen.

Import und Export verwenden die vorhandenen Zod-Schemas. Ein geladenes JSON wird geprüft, bevor es als Auflage oder Werkstattmaterial verwendet wird. Das Ablegen in die Projektdateien bleibt an die bestehenden Werkstattfunktionen gebunden. Die Werkstatt erzeugt keine zweite Runtime, keinen neuen Router, keine Datenbank und keinen neuen Bildbestand.

Die vollständige Arbeitsanweisung steht in [docs/EDITOR.md](../docs/EDITOR.md). Dort sind die Bereiche der Werkstatt, die Arbeitsreihenfolge, die Änderungsdateien und die erforderlichen Prüfungen ausführlich beschrieben.

## Verwandte Weltseiten

Der [Lore-Index](Lore-Index.md) führt durch die Grundgeschichte und ihre Reihenfolge. [Orte und Schauplätze](Orte.md) beschreibt alle Räume des Tals. [NPCs](NPCs.md) beschreibt die kanonischen Figuren. [Wissenstafeln](Wissenstafeln.md) und [Knowledge-Anker](Knowledge-Anker.md) ordnen die Freischaltungen. [Stil](Stil.md) legt die Sprache fest. [Enden](Enden.md) beschreibt den Zustand, den das Dorf nach den Entscheidungen des Helden weiterträgt.
