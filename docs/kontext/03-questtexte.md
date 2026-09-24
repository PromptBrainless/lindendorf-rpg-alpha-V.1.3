# Questtexte

Auftrag: die Quests sollen zusammenpassen und nicht in verschachtelten oder kryptischen Sätzen stehen. Fakten bleiben.

Geglättet, zuerst über Groq, danach von Hand an den Stellen, wo der Sinn verrutscht war:

- `src/game/quest-brunnen.ts`
- `src/game/quest-kesseljahr.ts`
- `src/game/kesseljahr-gewoelbe.ts`
- `src/game/kesseljahr-schluss.ts`
- `src/game/content.ts` (Weg und Fremder)
- `src/game/lager-content.ts` (wenige Sätze)
- `src/game/quest-ungerufener-name.ts` nur der Satz zum Kinderumhang

Nicht angefasst, weil die Sätze schon kurz waren: `quest-muehle.ts`, der Hauptlauf in `script.ts`.

Groq hat dabei Fehler gebaut, die zurückgenommen sind: „Der Kern“ statt Kern, Grabegabel als Wasserstandsmesser, „gar gar nicht“, Herbst und Frühjahr beim Korn vertauscht, Ilses Schrift als „Hand enthält“. Nicht erneut ungeprüft über die ganze Datei jagen.

Spielertext ist das, was `present()` zeigt. `docs/json` und die Volltexte sind nicht die zweite Wahrheit.
