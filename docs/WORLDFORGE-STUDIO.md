# WorldForge und der integrierte RPG-Maker

Der eigenständige WorldForge-Quellstand bleibt im Repository [PromptBrainless/worldforge-studio](https://github.com/PromptBrainless/worldforge-studio). Dieses Lindendorf-Repository enthält daneben eine integrierte Maker-Arbeitsfläche unter `/editor`; sie baut auf dem lokalen Workspace-Modell auf und verwendet die vorhandene Spielbühne als Vorschau.

Die Grenzen bleiben bewusst klar: Ein neues Maker-Projekt startet leer und wird lokal als eigenes Projekt gespeichert. Lindendorf liefert eine durchsuchbare Bibliothek aus Medien und einzelnen Spielbausteinen. Es wird keine Kampagne, kein verbundener Lindendorf-Graph und kein Spielstand automatisch als Demo geladen. Einträge werden einzeln als Projektkopien übernommen.

Die lokale Integration ist kein zweiter Lindendorf-Spielstand und ersetzt nicht die bestehende Partie. Projekt-Szenen, Wahlrelationen, Proben und Enden gehören zum Maker-Workspace; die laufende Lindendorf-Runtime bleibt unverändert. Die aktuelle Bedienung und Datenbegrenzung stehen in [docs/EDITOR.md](EDITOR.md).
