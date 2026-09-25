# WorldForge Studio

Offline-first Studio fuer Welten, Kampagnen, Quests, Dialoge, Ereignisse, Wissen und Assets.

## Architektur

Der Kern arbeitet mit versionierten Entities und Relations. Ein Workspace kann als JSON exportiert und wieder importiert werden. Die UI nutzt localStorage als Browseradapter; ein SQLite-Adapter kann denselben Store-Port spaeter implementieren. Plugins registrieren neue Schemas und Validatoren ueber `src/core/plugins.ts`.

## Start

```bash
npm install
npm run dev
```
