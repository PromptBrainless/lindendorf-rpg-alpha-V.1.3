# Spielleiter-Werkstatt von Lindendorf

## Zweck

Die Spielleiter-Werkstatt ist der Arbeitsraum hinter der Partie. Sie dient dazu, die vorhandene Geschichte zu lesen, einzelne Seiten zu bearbeiten, Figuren zu entwickeln, Orte zu ordnen, Wissenstafeln anzulegen und den Weg durch das Spiel zu prüfen. Sie ist kein zweites Spiel und keine zweite Erzählmaschine. Die Partie bleibt an den vorhandenen Szenen, Entscheidungen und Zuständen gebunden.

Der Einstieg liegt unter `/editor`. Die Seite bleibt durch den vorhandenen Spielleiter-Zugang geschützt. Nach dem Eintritt zeigt die Werkstatt den Szenenkatalog des laufenden Spiels und nicht eine losgelöste Beispielwelt. Der aktuelle Bestand umfasst acht Questreihen und 71 Seiten. Die Werkstatt benutzt dieselben Bezeichnungen, Kennungen und Übergänge wie der Spielerbereich.

## Die zwei Wahrheiten

Die Werkstatt arbeitet mit zwei verschiedenen Ebenen. Der Code unter `src/game/` beschreibt, was der Spieler heute tatsächlich erlebt. Dazu gehören der Hauptfluss in `script.ts`, die Module für Brunnen, Mühle und Kesseljahr, der Lagerinhalt, die Wissenserkennung und die Laufzeit. Diese Ebene darf nicht durch eine bloße Notiz im Editor verändert werden.

Das Wiki unter `wiki/` beschreibt dagegen den Zielkanon der Spielwelt. Dort stehen das Weltgeheimnis, die Geschichte des Kesseljahrs, die Figuren, die Orte, die Wissenstafeln und die geplante Reihenfolge der Enthüllungen. Der Wiki-Kanon darf weiter sein als die aktuelle Partie. Wenn eine Szene im Code noch nicht die ganze Geschichte trägt, wird sie nicht heimlich durch die Editor-Oberfläche vorweggenommen.

Eine Auflage verändert deshalb zunächst nur die Fassung einer Seite. Der ursprüngliche Text bleibt als Kanon sichtbar und kann verglichen oder wiederhergestellt werden. Eine neue Figur, ein neuer Ort oder eine neue Wahrheit wird zuerst als Autorenmaterial angelegt. Erst ein eigener Auftrag, eine benannte Szene und eine geprüfte Entscheidung machen daraus eine Änderung des laufenden Spiels.

## Die Bereiche der Werkstatt

## Version 2.0 der Oberfläche

Die Werkstatt verwendet eine dreiteilige Arbeitsansicht. Links liegen die gruppierten Bereiche für Orientierung, Erzählung und Kontrolle. In der Mitte arbeitet die Spielleitung am ausgewählten Inhalt. Rechts bleibt der Arbeitskontext sichtbar: geöffnete Seite, Kennung, Kanon- oder Auflagenstatus und die passenden Lore-Seiten. Auf kleinen Bildschirmen wird die Kontextspalte ausgeblendet, ohne die Arbeitsbereiche oder ihre Reihenfolge zu verlieren.

Das laufende Weltwerkzeug verwendet dieselbe Sprache. Sein Overlay nennt die aktuelle Seite, den Helden, den Speicherstand und den Unterschied zwischen Kanon und lokaler Auflage. Von dort führt ein eigener Weg zurück in die Gesamtwerkstatt oder in das Wiki. Die laufende Partie bleibt dabei offen genug, um die aktuelle Szene zu prüfen, ohne den gesamten Bildschirm mit einer zweiten Anwendung zu verdecken.

### Übersicht

Die Übersicht zeigt, wie groß die gegenwärtige Partie ist. Sie zählt die Questreihen, die vorhandenen Seiten, die Orte aus dem aktiven Weltbild und die Textstellen, die noch geprüft werden müssen. Von hier aus gelangt die Spielleitung direkt zum Schreiben, zu einer neuen Figur oder zu einer Wissenstafel.

Die Übersicht ist kein bloßes Titelbild. Sie macht die kanonische Grenze sichtbar: Lindendorf beginnt auf dem Weg ins Tal und führt über Dorfplatz, Brunnen, Mühle, Kesseljahr, Glockenweg und Steinbruch zum Ende. Die Werkstatt darf diese Reihenfolge lesbar machen, aber sie darf den Pakt nicht in die Ankunft vorziehen.

### Geschichte

Im Bereich Geschichte wird eine vorhandene Seite als Textentwurf geöffnet. Der Ausgangstext bleibt erhalten. Die Spielleitung kann ihn lesen, eine neue Fassung formulieren lassen, eigene Sätze schreiben und die Fassung anschließend als Auflage an dieser Seite merken.

Eine Auflage ist für die Partie sichtbar, sobald sie gespeichert wurde. Sie ist aber noch kein neuer Kanon. Die Werkstatt zeigt deshalb immer an, ob gerade die kanonische Seite oder eine Auflage bearbeitet wird. Eine frühere Fassung kann zurückgeholt werden. Die Schreibfläche arbeitet nur an der geöffneten Seite und führt keine fremde Figur, keinen neuen Ort und keine spätere Erklärung unbemerkt in den Text ein.

Beim Schreiben gilt die Stimme von Lindendorf: Du, Präsens, vollständige erzählerische Sätze und wörtliche Rede. Der Text beschreibt Befund und Handlung, nicht die moralische Bedeutung einer Entscheidung. Geruch, Kälte, Gewicht, Arbeit, Hunger und die Körperhaltung der Figuren tragen die Stimmung. Der Pakt wird nicht erklärt, bevor die Geschichte ihn an der vorgesehenen Stelle öffnet.

### Szenen und Karten

Der Bereich Szenen und Karten ist der präzise Arbeitsraum für Titel, Bild, Porträt, Text, Wahlen, Stimme und die Wirkung einer Seite. Die linke Liste sucht nach Titel, Reihe und Kennung. Sie ordnet nicht nach einem Zahlenindex, sondern nach den Labels des aktiven Szenenkatalogs.

Die Anzahl der Wahlen einer vorhandenen Karte bleibt fest. Eine Auflage darf die Formulierung einer Wahl ändern, aber sie darf nicht unbemerkt einen neuen Übergang erfinden. Wirkungen werden nur aus den vorhandenen Effektgruppen gewählt. Bild und Porträt können über vorhandene Schlüssel oder eine Auflage gesetzt werden. Neue Bildschlüssel gehören nicht in diesen Bereich, solange kein eigener Bildplan und kein Auftrag dafür vorliegen.

### Figuren

Die Figurenwerkstatt unterscheidet zwischen kanonischen Figuren und Autorenmaterial. Holm, Dennek, Vahl, Grovin, Bertok, Fenn und Kess werden als Bezugspunkte angezeigt, aber nicht überschrieben. Ihre Weltbilder, Ängste, Ziele und Rechtfertigungen sind Teil der bestehenden Lore.

Eine neue Figur erhält einen Namen, eine freie Kennung, eine Rolle, einen Ort, ein Weltbild, eine Angst, ein Ziel und Notizen für die Geschichte. Diese Angaben werden lokal im Autorenmaterial gespeichert. Dadurch kann die Spielleitung eine Figur vollständig ausarbeiten, ohne den laufenden Spieltext zu verändern. Erst wenn die Figur einer konkreten Szene, einer Handlung und einer Folge zugeordnet wird, kann ein eigener Umbauauftrag sie in den Kanon und den Code überführen.

Neue Figuren handeln nicht automatisch für andere Figuren. Fenn sitzt an der Kirchmauer. Der Held bleibt derjenige, der fragt und entscheidet. Diese Grenze schützt die Handlung vor einer bequemeren, aber falschen Erzählung.

### Wissen

Im Bereich Wissen werden Wissenstafeln angelegt und gepflegt. Jede Tafel besitzt eine Kennung, einen Titel, vollständigen Text, ein mögliches Bild und eine mögliche Stimme. Ihre Aufgabe ist es, eine Spur nach einer Szene festzuhalten und später wieder aufzunehmen.

Eine Wissenstafel darf dem Spieler zeigen, was er bemerkt oder verstanden hat. Sie darf aber nicht die Entscheidung an seiner Stelle treffen. Das Artefakt am Weg bleibt zunächst ein kaltes Stück Kirchensilber. Das rote Wachs bleibt zunächst eine Markierung. Erst weitere Begegnungen geben diesen Dingen Gewicht.

Die Werkstatt kann eine Tafel lokal vorbereiten und über die vorhandenen Werkstattfunktionen ablegen. Vor dem Speichern müssen Kennung, Titel und Text vorhanden sein. Eine Tafel wird nicht dadurch zum gültigen Kanon, dass sie im Editor sichtbar ist. Ihre Kennung muss an eine vorhandene Wissenserkennung und an eine passende Szene gebunden werden.

### Orte

Der Bereich Orte liest das aktive Weltbild aus `src/game/weltbild.ts`. Er zeigt die Orte, die der aktuelle Szenenkatalog bereits kennt, und öffnet die zugehörigen Seiten. Er erfindet keine zweite Karte neben dem Spiel.

Die Ortsbeschreibungen folgen der Grenze der Szene. Der Dorfplatz darf Rathaus, Taverne, Brunnen, Mühle und Hang zeigen. Er darf den Pakt noch nicht erklären. Die leere Gasse darf Kratzspuren und ein Holzpferd tragen. Die Liste gehört erst in das Gewölbe. Die Kapellenglocke bleibt ein Signalwerkzeug. Ob unter der Kapelle etwas Übernatürliches gebunden ist, bleibt offen.

Die ausführliche Zielbeschreibung steht in [Orte und Schauplätze](../wiki/Orte.md). Der Lore-Zusammenhang steht im [Lore-Index](../wiki/Lore-Index.md). Der Editor stellt diese Seiten nicht als fertigen Spieltext dar, sondern als Arbeitsgrundlage für die nächste sichere Änderung.

### Prüfen

Der Prüfbereich stellt fest, ob der vorhandene Arbeitsstand in sich trägt. Er prüft den Weltgraphen auf tote Knoten und unbekannte Kanten, die Wege des Lagers, die vorhandenen Bild- und Porträtschlüssel sowie die Textlängen. Der Textvergleich zeigt, welche Fassung tatsächlich die längste und damit maßgebliche Spielversion ist.

Die Prüfung der Heldensicht sucht außerdem nach Informationen, die nur für die Spielleitung bestimmt sind. Lore-Fakten dürfen nicht versehentlich in der sichtbaren Oberfläche auftauchen. JSON kann geladen, mit dem vorhandenen Zod-Schema geprüft und als Datei geholt werden. Das Ablegen schreibt nur dort, wo die vorhandenen Werkstattfunktionen es erlauben. Ein gültiges JSON ist noch keine neue Szene.

Der Prüfgraph ist ein Arbeitsinstrument. Er ist keine geheime Kopie des gesamten `script.ts` und ersetzt keine Laufzeittests. Für eine Änderung an Text oder Logik bleiben die Projektprüfungen verbindlich.

## Arbeitsablauf für eine neue Geschichte

Zuerst wird die Stelle im Szenenkatalog über ihr Label geöffnet. Danach wird geprüft, was die Seite im Code bereits zeigt und welche Funktion der Zielkanon dieser Seite gibt. Anschließend wird der Text vollständig geschrieben oder überarbeitet. Neue Figuren, Orte, Anker und Aufträge werden ausdrücklich benannt und nicht nebenbei in eine bestehende Seite eingeschoben.

Nach dem Schreiben wird die Seite als Auflage gespeichert und im Prüfbereich gegen den Kanon und die Laufzeit verglichen. Erst wenn Text, Bild, Wahlzahl, Wissen und Übergänge zusammenpassen, wird entschieden, ob aus der Auflage eine dauerhafte Codeänderung werden soll. Diese Entscheidung gehört zu einem eigenen Auftrag. Die Werkstatt macht sie sichtbar, aber sie nimmt sie niemandem ab.

Nach Text- oder Logikänderungen laufen im Projekt `npm run typecheck`, `npm run check:prosa`, `npm run check:lore`, `npm run check:textvergleich` und `npm run check:knowledge`. Nur ein tatsächlich grüner Lauf darf als geprüft bezeichnet werden.

## Änderungsdateien dieses Neuaufbaus

Die Route `src/routes/editor.tsx` schützt und öffnet den eigenständigen Spielleiter-Bereich. Sie leitet nicht mehr in eine einzelne Prüfansicht zurück, sondern verbindet den vorhandenen Spielleiter-Zugang mit der vollständigen Werkstatt.

Die Komponente `src/components/welt/SpielleiterBereich.tsx` bildet die Oberfläche. Sie lädt den bestehenden Weltgraphen, zeigt die acht Questreihen und 71 Seiten, führt durch Geschichte, Szenen, Figuren, Wissen, Orte und Prüfung und reicht Änderungen an die bereits vorhandenen Welt- und Werkstattfunktionen weiter.

Die Datei `src/game/gm/werkstatt.ts` hält das Autorenmaterial für neue Figuren. Sie validiert die Daten mit Zod, speichert sie lokal und schützt die kanonischen Figuren vor dem Überschreiben. Diese Datei verändert weder den Hauptfluss noch den Spielerzustand.

Die Dokumentation in `docs/EDITOR.md`, `wiki/Lore-Index.md` und `wiki/Projekt-Weltwerkzeug-und-Spielleitung.md` beschreibt die Arbeitsschichten, die Sprache und die Grenzen des neuen Bereichs. Sie ist keine zusätzliche Engine und kein Ersatz für die Szenen im Code.

## Bewusste Grenzen

Die Werkstatt führt keine neue Datenbank ein. Sie verändert weder Authentifizierung noch Router und legt keine neue Spielengine an. Autorenmaterial für neue Figuren bleibt lokal, bis ein eigener Auftrag seine Überführung in den Kanon verlangt. Der Spielerbereich bleibt die einzige Quelle dafür, was in einer Partie wirklich geschieht.

Auch eine schön geschriebene Wiki-Seite macht eine Szene noch nicht spielbar. Das Wiki ist der Zielstand der Welt. Der Code ist der gegenwärtige Stand der Partie. Gute Arbeit an Lindendorf hält beide Schichten auseinander und führt sie erst dort zusammen, wo eine konkrete Seite, eine konkrete Wahl und eine überprüfte Folge dafür bereitstehen.
