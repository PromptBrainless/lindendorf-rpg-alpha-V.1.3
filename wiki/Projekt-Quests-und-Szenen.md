# Quests und Szenen

## Aktueller Spielablauf

Der Code führt von Heldenerstellung und Prolog über Ankunft, Dorf, Brunnen, Mühle, Kesseljahr, Glockenweg beziehungsweise Wald und Lager zum Ende. Die konkrete Reihenfolge und bedingte Übergänge stehen in [src/game/script.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/script.ts), den Questmodulen und den datengetriebenen JSON-Dateien.

## Questregister und Planung

- [docs/QUESTREGISTER.md](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/docs/QUESTREGISTER.md) – Register und belegte Namen.
- [docs/QUESTUEBERSICHT_VOLLTEXT.md](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/docs/QUESTUEBERSICHT_VOLLTEXT.md) – vollständige Übersicht.
- [docs/quests/README.md](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/docs/quests/README.md) – Quest-Spec-Regeln.
- [docs/quests/kesseljahr.md](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/docs/quests/kesseljahr.md)
- [docs/quests/reihe-versorgung.md](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/docs/quests/reihe-versorgung.md)
- [docs/quests/ungerufener-name.md](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/docs/quests/ungerufener-name.md)
- [docs/SZENARIO_ALTER_GLOCKENWEG.md](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/docs/SZENARIO_ALTER_GLOCKENWEG.md)

## Implementierte Questmodule

- [quest-brunnen.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/quest-brunnen.ts) – Brunnen und Wasser.
- [quest-muehle.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/quest-muehle.ts) – Mühle und Versorgung.
- [quest-kesseljahr.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/quest-kesseljahr.ts) – Kesseljahr.
- [quest-ungerufener-name.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/quest-ungerufener-name.ts) – ungerufener Name.
- [reihe-versorgung.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/reihe-versorgung.ts) – Versorgungsreihe.
- [kesseljahr-gewoelbe.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/kesseljahr-gewoelbe.ts)
- [kesseljahr-grete.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/kesseljahr-grete.ts)
- [kesseljahr-schluss.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/kesseljahr-schluss.ts)
- [lager-content.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/lager-content.ts)

## Datenstruktur

Die datengetriebenen Szenen liegen in [src/game/json/quests](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/tree/main/src/game/json/quests). Bereiche sind Ankunft, Brunnen, Dorf, Ende, Gasse, Lager, Mühle und Wald. Die Struktur wird durch [schema.ts](https://github.com/PromptBrainless/lindendorf-rpg-alpha-V.1.1/blob/main/src/game/json/schema.ts) validiert.

## Verknüpfte Wiki-Seiten

- [Orte und Schauplätze](Orte.md)
- [Queststruktur](Queststruktur.md)
- [Quest-Ankunft](Quest-Ankunft.md)
- [Szenenplan](Szenenplan.md)
- [Enden](Enden.md)
