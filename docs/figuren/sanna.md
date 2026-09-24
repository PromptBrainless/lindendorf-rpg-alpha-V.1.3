# Sanna

Die Marken bedeuten verschiedenes. Sie stehen absichtlich nebeneinander, damit eine Wiki-Zeile nicht wie ein Satz aus der Szene wirkt.

- **[Szene]** Text, den das Spiel zeigen kann.
- **[Lore]** Spielleiterfassung aus `lore.ts`. Nicht automatisch das, was der Held liest.
- **[Wiki]** Figurenkarte. Kann Absicht und Angst enthalten, die niemand ausspricht.
- **[Schriftstück]** Papier, Inschrift oder Zeichen, an dem die Figur hängt.
- **[Bild]** Datei unter `public`.

## Schriftstück

> **[Schriftstück]** Ihr Brief, unter einem nassen Stein: „Die Glocke nicht läuten.“ Darunter, fast ausgewaschen: „Wenn sie dich beim Namen rufen, antworte nicht.“ Den unteren Teil zerreißt sie.

## Bild

> **[Bild]** `public/art/sanna.jpg`
> **[Bild]** `public/art/wissen/sanna-botin.jpg`
> **[Bild]** `public/art/wissen/sanna-die-botin.jpg`

## Wiki

> **[Wiki]** Kein eigener Abschnitt in `wiki/NPCs.md`.

## Lore

> **[Lore]** Lene ist Bertoks Tochter, nicht Sanna. Sie zählt dieselben Säcke und stellt sich vor die hintere Wand. Dahinter sitzen Yorwin, ihr Schwager, und zwei Kinder, Teil der Leute, die das Kesseljahr aus den Listen genommen hat. Lene führt ihre eigenen Namen. Ihre Schwester ist tot. Rennik weiß von ihnen. Deshalb steht die Mühle.
> — `src/game/lore.ts`
>
> **[Lore]** Sanna hat eine versiegelte Nachricht für Lindendorf im Geröll verloren. Das rote Wachs ist keine Andacht. Es markiert, dass etwas entfernt wurde und nicht zurückkehren darf. Wer die Spur liest oder sie beruhigt und den Inhalt rekonstruiert, kennt im Wald später eine sichere Abzweigung.
> — `src/game/lore.ts`
>

## Szene

> **[Szene]** Sanna trägt eine Ledertasche ohne Brief. Die Schnalle, die ihn halten sollte, fehlt. An der Stelle ist das Leder heller, frisch gerissen.
> — `src/game/json/baum.ts`
>
> **[Szene]** Sanna hält sich mit einer Hand am Mauerwerk fest. Ihre Stiefel sind voller Geröll, und an ihrer Tasche fehlt die Schnalle, die den Brief halten sollte.
> — `src/game/script.ts`
>
> **[Szene]** Sanna liest sie zweimal. Dann zerreißt sie den unteren Teil des Briefes und steckt ihn ein, als könne Papier ein Geräusch behalten.
> — `src/game/script.ts`
>
> **[Szene]** Sanna zählt die Schnallen ihrer Tasche. Der fehlende Brief fehlt noch immer.
> — `src/game/script.ts`
>
> **[Szene]** Sanna faltet den Brief. Ihre Hände zittern erst, als sie ihn wieder hat.
> — `src/game/script.ts`
>
> **[Szene]** Sanna beruhigen und den Inhalt rekonstruieren (Charisma, mittel)
> — `src/game/script.ts`
>
> **[Szene]** Das Geröll gibt keinen Brief her. Sanna nimmt die leere Tasche.
> — `src/game/script.ts`
>
> **[Szene]** Sanna hebt die Tasche, bevor du fragst.
> — `src/game/script.ts`
>

## Abgleich

Sie ist die Botin am Hang, nicht die Müllerin. Ihr Brief war mit etwas gesiegelt, das unter dem Wachs des Bürgermeisters lag. Die untere Zeile zerreißt sie, statt sie laut zu lassen. Damit ist sie Überbringerin einer Warnung, nicht ihre Autorin.
