# Grovin

Die Marken bedeuten verschiedenes. Sie stehen absichtlich nebeneinander, damit eine Wiki-Zeile nicht wie ein Satz aus der Szene wirkt.

- **[Szene]** Text, den das Spiel zeigen kann.
- **[Lore]** Spielleiterfassung aus `lore.ts`. Nicht automatisch das, was der Held liest.
- **[Wiki]** Figurenkarte. Kann Absicht und Angst enthalten, die niemand ausspricht.
- **[Schriftstück]** Papier, Inschrift oder Zeichen, an dem die Figur hängt.
- **[Bild]** Datei unter `public`.

## Schriftstück

> **[Schriftstück]** Er will, dass jemand seine Rechnung liest. Ein Blatt mit Zahlen liegt in der Szene nicht auf dem Tisch. Die Zahl, die man Holm verspricht, steht danach nicht in der Kasse.

## Bild

> **[Bild]** `public/art/grovin.jpg`
> **[Bild]** `public/art/grovin.mp4`
> **[Bild]** `public/art/wissen/an-der-zisterne.jpg`
> **[Bild]** `public/art/wissen/grovin_zisterne.jpg`
> **[Bild]** `public/art/wissen/grovins-zisterne.jpg`

## Wiki

> **[Wiki]** - Weltbild: Eigentum ist die letzte Form von Würde.
> **[Wiki]** - Angst: Wieder ausgenutzt zu werden.
> **[Wiki]** - Geheimnis: Kennt den alten Wasserlauf unter dem Dorf und könnte das Wasser vollständig umleiten.
> **[Wiki]** - Rechtfertigung: „Wer alles verliert, darf wenigstens behalten, was er gebaut hat.“
> **[Wiki]** - Ziel: Anerkennung und Nachzahlung, notfalls durch weiteren Wasserentzug.
> **[Wiki]** - Konflikt: Behandelt den Spieler als Verbündeten oder als weiteren Dieb.

## Lore

> **[Lore]** Grovin hat den Brunnen gebaut und nie Lohn gesehen. Er kennt den alten Wasserlauf und könnte das Dorf ganz vom Wasser nehmen. Er will Anerkennung, nicht Gift. Fünf Gold lassen ihn die Zisterne behalten: das Wasser wird nur teilweise klar. Verhandeln geht nur, wenn zuvor nach seinem Grund gefragt wurde, und legt Holm eine echte Schuld auf. Die Sperre unbemerkt umzulegen klärt das Wasser, ohne dass das Dorf den Grund erfährt. Sie mit Gewalt zu zerstören vertreibt ihn. Dann bleibt er eine Spur am Waldrand.
> — `src/game/lore.ts`
>
> **[Lore]** Bestechen endet als zwei Brunnen: es reicht nicht für alle, und der Held trägt das Wissen allein. Zerstören ohne entlarvten Dennek endet als Riss: das Wasser läuft, Grovin ist nur für den Tag fort. Verhandeln oder öffnen endet klar. War Dennek entlarvt, meidet er den Rand. Wurde Grovin ein Versprechen gegeben, steht die Zahl noch nicht in Holms Kasse.
> — `src/game/lore.ts`
>
> **[Lore]** Kein Heilungsende. Die Rückkehr zu Holm zeigt, welchen Zustand die Wege hinterlassen: Ordnung, bei der die Lüge bleibt; Namen, die laut werden; Grovin, der anerkannt wird; oder die Mühle, die ihre Leute weiter versteckt. Eine Reinigung gibt es nicht.
> — `src/game/lore.ts`
>
> **[Lore]** Dennek hat Grovin den Lohn bewusst vorenthalten, damit das Wasser ein Druckmittel bleibt. Nach dem trockenen Jahr gefragt oder an die Mauer gedrückt, kommt der Name Grovin heraus. Seine Stiefel tragen helleren Lehm als der Platz.
> — `src/game/lore.ts`
>
> **[Lore]** Die Zisterne am Waldrand ist alt, die Fugen nicht. Die Dornen sind gelegt, nicht gewachsen. Das Wasser darin ist klar. Grovin schöpft für sich, nicht für den Eimer im Dorf.
> — `src/game/lore.ts`
>

## Szene

> **[Szene]** Das Wasser in der Zisterne ist klar bis auf den steinigen Grund. Grovin blickt zuerst hinunter darauf, dann erst zu dir hinüber.
> — `src/game/json/baum.ts`
>
> **[Szene]** Das Wasser fließt wieder. Der Eimer schlägt gegen den Stein, und der Klang ist der alte. Grovin ist fort, nicht fort genug.
> — `src/game/json/baum.ts`
>
> **[Szene]** Holm schuldet Grovin eine Zahl, die nicht in der Kasse steht.
> — `src/game/knowledge.ts`
>
> **[Szene]** Grovin leitet Wasser in eine Zisterne.
> — `src/game/knowledge.ts`
>
> **[Szene]** Dennek hat Grovin nie bezahlt.
> — `src/game/knowledge.ts`
>
> **[Szene]** „Grovin“, sagt er, und der Name kostet ihn nun nichts mehr, keine Anstrengung, kein Zögern — als hätte das Aussprechen der Wahrheit einer Last gleichgekommen, die er endlich abgesetzt hat. „Zisterne am Waldrand. Ich habe nicht bezahlt, das ist wahr, und ich werde es auch nicht schönreden. Das Wasser hat den Rest erledigt, an meiner statt.“
> — `src/game/quest-brunnen.ts`
>
> **[Szene]** „Grovin hat den Brunnen gebaut“, sagt er schließlich, mit einer Stimme, der jede Farbe entwichen ist. „Wir haben ihn nicht bezahlt, damals, vor Jahren, als das Geld für Wichtigeres gebraucht wurde, oder so hat man es sich eingeredet. Seither ist er verschwunden — und das Wasser geht mit ihm, dorthin, wo er es jetzt braucht.“
> — `src/game/quest-brunnen.ts`
>
> **[Szene]** Holm schuldet Grovin jetzt eine Zahl, die nicht in der Kasse steht. Du hast es versprochen, an einer Zisterne, deren Wasser den Graben schon wieder kennt. Zahlt das Amt, bleibt der Brunnen ein Brunnen. Zahlt es nicht, kommt das Wasser nicht als Bitte zurück, sondern als alte Rechnung.
> — `src/game/quest-brunnen.ts`
>
> **[Szene]** Doch beim dritten Satz, mitten im Fluss seiner eigenen Rede, rutscht ihm ein Name heraus — Grovin — kaum lauter als ein Atemzug, aber deutlich genug, dass man ihn nicht überhören kann. Er schluckt ihn nicht mehr ganz hinunter, dieses eine Mal, so sehr er es auch versucht.
> — `src/game/quest-brunnen.ts`
>
> **[Szene]** Grovin richtet sich auf. In seiner anderen Hand liegt eine Grabegabel, deren Zinken bedenklich blanker poliert sind, als es das bloße Werkzeug eines Mannes rechtfertigen würde, der für gewöhnlich nur den Wasserstand misst.
> — `src/game/quest-brunnen.ts`
>
> **[Szene]** „Dennek trommelt, wenn er lügt“, fügt Grovin trocken hinzu, fast amüsiert. „Ich habe das schon gehört, lange bevor du geboren wurdest, und ich habe es nie vergessen.“
> — `src/game/quest-brunnen.ts`
>
> **[Szene]** „Grovin hat den Brunnen gebaut“, sagt sie, ohne von der Waage aufzusehen. „Wenn irgendjemand weiß, wohin das Wasser verschwindet, dann er, und niemand sonst.“
> — `src/game/quest-brunnen.ts`
>
> **[Szene]** Grovin flieht, noch bevor man die Gabel in seiner Hand ganz zu Gesicht bekommt. Der Waldrand nimmt ihn auf, ohne eine einzige Frage zu stellen.
> — `src/game/quest-brunnen.ts`
>

## Abgleich

Er hat den Brunnen gebaut, nie Lohn gesehen und zieht das Wasser in eine Zisterne am Waldrand. Er will Anerkennung, nicht Gift. Fünf Gold lassen ihn die Zisterne behalten. Das Wasser wird dann nur teilweise klar. Zerstört man die Sperre, bleibt er eine Spur am Waldrand.
