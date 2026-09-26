# 🛠️ Spielleiter-Bereich / Weltwerkzeug 2.0 — Code-Analyse

Ich habe das Repo geklont und den kompletten GM-/Editor-Bereich gelesen:
`docs/WELTWERKZEUG.md`, `docs/WELTWERKZEUG-KANON.md`, `docs/EDITOR.md`,
`src/routes/editor.tsx`, `src/components/welt/SpielleiterBereich.tsx`,
`src/components/welt/WeltStudio.tsx`, `src/game/welt.ts`,
`src/game/gm/werkstatt.ts`, `src/game/gm/sozialanker.ts`,
`src/game/leiter-auth.server.ts`, `src/game/leiter-login.ts`, `src/game/sl-upload.ts`.

Das ist konzeptionell sehr durchdacht (die drei-Speicher-Trennung Partie/Auflage/Kanon
in `docs/WELTWERKZEUG.md` ist ungewöhnlich sauber gedacht). Aber im Code stecken
ein **kritischer Sicherheitsfund** und mehrere **konkrete, belegbare Bugs**.

---

## 🔴 1. KRITISCH — Passwort im Klartext, öffentliches Repo

**Fund:** `src/game/leiter-auth.server.ts`, Zeile 6:
```ts
const PASSWORT = "1337";
```
Kein `.env`, kein `process.env`-Fallback, nicht in `.env.example` erwähnt — fest
im Quelltext, committet in ein **öffentliches** GitHub-Repo. Jede Person kann den
Dateiinhalt lesen und sich damit Zugang zum gesamten Spielleiter-Bereich verschaffen
(Texte ändern, Bilder hochladen, soziale Anker/Figuren anlegen).

Zusätzlich ist die HMAC-Konstruktion vertauscht:
```ts
createHmac("sha256", PASSWORT).update(SALZ).digest("hex")
```
Das Passwort wird als *Schlüssel*, das öffentliche `SALZ` als *Nachricht* verwendet.
Da beide Werte im Quelltext stehen, kann der gültige Cookie-Wert von außen direkt
berechnet werden — der `httpOnly`-Cookie-Schutz verhindert dann nichts mehr, weil
niemand den echten Login-Flow durchlaufen muss.

**Praktisch bedeutet das:** Dieses Passwort ist bereits als kompromittiert zu behandeln,
sobald der Commit einmal gepusht wurde (Git-Historie bleibt auch nach einem
nachträglichen Ändern öffentlich einsehbar).

**Fix:**
```ts
// leiter-auth.server.ts
const PASSWORT = process.env.LEITER_PASSWORT;
if (!PASSWORT && process.env.NODE_ENV === "production") {
  throw new Error("LEITER_PASSWORT fehlt — Spielleiter-Zugang darf nicht mit Default laufen.");
}
```
- `LEITER_PASSWORT` in `.env` (lokal) und als **GitHub Actions Secret** / Vercel
  Environment Variable setzen, `.env` bleibt in `.gitignore` (ist es laut Repo schon).
- **Danach:** neues, langes Passwort vergeben — das alte `1337` gilt als verbrannt.
- HMAC richtig herum: `createHmac("sha256", PASSWORT_ALS_SECRET).update(SESSION_ID_ODER_ZEITSTEMPEL)`.
- Optional: einfaches Rate-Limiting auf den Login-Versuch (z. B. 5 Versuche/Minute pro IP),
  da es aktuell keinerlei Bremse gibt.

---

## 🔴 2. Upload-Endpunkt existiert serverseitig gar nicht

`src/game/sl-upload.ts` ruft `fetch("/__lindendorf/upload", …)` auf — aber im
gesamten Repo (`src/routes/`, `server/`) gibt es **keine** Route, die diesen Pfad
bedient. Ich habe explizit danach gesucht (`grep -rn "__lindendorf"`), nur die
zwei Aufrufstellen in `sl-upload.ts` existieren.

**Folge:** Jeder Bild-/Ton-Upload im Weltwerkzeug schlägt fehl (404) und fällt auf
den vorgesehenen Fallback zurück — die komplette Datei wird als Base64-Data-URL
direkt in die Auflage geschrieben, die in `localStorage` liegt. Das widerspricht
der eigenen Doku in `docs/WELTWERKZEUG.md`:

> „Bilder, die du hochlädst, liegen unter `public/art/sl/`."

Das stimmt im aktuellen Code nicht. Ein 1280px-JPEG bei Qualität 0,82 liegt schnell
bei 150–400 KB — als Base64-String macht das aus wenigen Bild-Uploads bereits ein
Mehrfaches des typischen `localStorage`-Limits (~5–10 MB pro Origin).

**Wichtiger Kontext, den die Doku übersieht:** Die App läuft laut `README.md` auf
**Vercel** — Serverless Functions dort haben ein **read-only/ephemeral Dateisystem**.
Selbst ein implementierter `/__lindendorf/upload`-Handler könnte in Produktion
nicht dauerhaft nach `public/art/sl/` schreiben; das würde nur lokal in einem
Codespace/Dev-Server funktionieren und nach jedem Deploy wieder verschwinden.

**Zwei ehrliche Optionen, keine falsche Versprechung:**
1. **Objekt-Storage nachrüsten** (naheliegend, da schon auf Vercel: *Vercel Blob*,
   alternativ Cloudinary/S3) und `/__lindendorf/upload` tatsächlich implementieren.
2. **Doku korrigieren**, wenn Server-Uploads vorerst nicht gebaut werden: klar sagen,
   dass Bilder aktuell nur als lokale Data-URL in der Auflage landen — und dafür
   eine Größenwarnung im Upload-Dialog einbauen (z. B. ab 300 KB abraten/komprimieren).

---

## 🔴 3. Stille Speicherfehler → falsche Erfolgsmeldung

`schreibeWelt()` in `src/game/welt.ts` fängt Fehler (z. B. `QuotaExceededError`,
privater Modus) ab und gibt einfach `false` zurück:
```ts
function schreibeWelt(pack: WeltPack) {
  try {
    window.localStorage.setItem(WELT_STORE, JSON.stringify(pack));
    return true;
  } catch {
    return false;
  }
}
```
Der Aufrufer in `SpielleiterBereich.tsx` prüft diesen Rückgabewert aber nicht:
```ts
function aendereAuflage(next: WeltAuflage) {
  setAuflage(next);
  if (!szene) return;
  merkeAuflage(szene.id ?? szene.title, next, szene.original ?? szene);
  setMeldung("Die Auflage liegt lokal auf dieser Seite. Der Kanon bleibt unangetastet.");
}
```
Die Meldung „liegt lokal" erscheint **immer** — auch wenn `merkeAuflage` intern
gescheitert ist. Kombiniert mit Fund #2 (große Base64-Bilder füllen die Quota
schneller) entsteht ein reales Szenario: Die GM-Person schreibt/lädt hoch, die App
bestätigt „gespeichert", der Browser hat es aber verworfen. Dasselbe Muster steckt
in `speichereWerkstattFigur()` und `speichereSozialanker()`.

**Fix — Rückgabewert ernst nehmen:**
```ts
function aendereAuflage(next: WeltAuflage) {
  setAuflage(next);
  if (!szene) return;
  const ok = merkeAuflage(szene.id ?? szene.title, next, szene.original ?? szene);
  setMeldung(
    ok
      ? "Die Auflage liegt lokal auf dieser Seite. Der Kanon bleibt unangetastet."
      : "⚠️ Speichern fehlgeschlagen — Speicherplatz voll oder privater Modus. Bitte Export sichern."
  );
}
```
Dasselbe Prinzip für die anderen zwei Speicherstellen übernehmen.

---

## 🟡 4. Kein Backup, kein Warnsignal vor voller Quota

Vier getrennte `localStorage`-Schlüssel teilen sich dasselbe Origin-Kontingent:
`lindendorf.welt.v2` (Auflagen), `lindendorf.spielleiter.werkstatt.v1` (Figuren),
der Sozialanker-Schlüssel und der Studio-Workspace (`WeltStudio.tsx`). Keiner davon
zeigt an, wie voll der gemeinsame Speicher ist, und nur das Studio hat einen
expliziten Export-Knopf. Auflagen, Figuren und Anker haben **keinen** Sicherungsweg
außer manuellem Copy-Paste.

**Fix, klein und wirkungsvoll:**
```ts
async function speicherAuslastung(): Promise<{ genutztMB: number; quoteMB: number } | null> {
  if (!("storage" in navigator) || !navigator.storage.estimate) return null;
  const { usage = 0, quota = 0 } = await navigator.storage.estimate();
  return { genutztMB: usage / 1e6, quoteMB: quota / 1e6 };
}
```
Im Header von `SpielleiterBereich.tsx` einen kleinen Indikator anzeigen und ab
~80 % Auslastung zu „Studio-Export" auffordern. Zusätzlich: **ein** gemeinsamer
„Alles sichern"-Knopf, der Auflagen + Figuren + Anker + Studio als eine JSON-Datei
exportiert (analog zu `downloadWorkspace` in `studio/store.ts`, nur eben für alle
vier Speicher zusammen).

---

## 🟡 5. Kanon-Schreibweg fehlt — bereits selbst erkannt, aber offen

`docs/WELTWERKZEUG.md` benennt das selbst in der Roadmap (Schritt 7: „Kanon-Schreiben
nur für Module, die schon `content.ts` sind — mittel, einzeln"). Ich kann bestätigen:
im Code gibt es aktuell **keinen** Mechanismus, der eine Auflage tatsächlich in
`content.ts`/`quest-*.ts` zurückschreibt — nur Zod-validierten JSON-Export/Import
im Fach „Prüfen". Das ist kein Bug, sondern der nächste, von euch selbst benannte
Arbeitsschritt. Ich würde ihn aber vor neuen Komfort-Features priorisieren, weil er
die eigentliche Brücke zwischen „im Browser getestet" und „im Spiel für alle" ist —
ohne ihn bleibt jede Auflage für immer eine private Testfassung.

---

## 🟢 6. Ein gemeinsames statisches Passwort für alle GM-Personen

Zusätzlich zu Fund #1: Selbst mit einem starken, per Env-Variable verwalteten
Passwort bleibt es *ein* geteiltes Passwort für alle Spielleiter:innen — kein
Login pro Person, kein Protokoll, wer welche Auflage gemerkt oder welche Figur
angelegt hat. Für Solo-Betrieb unkritisch; sobald mehrere Personen am Kanon
mitschreiben (siehe Punkt 5), wird Nachvollziehbarkeit relevant.

---

## 🎛️ HUD — Kopfzeile im laufenden Spiel (`src/components/game/Hud.tsx`)

Das HUD ist die Stelle, an der Weltwerkzeug/Spielleiter-Zugang, Speichern und
Wissen im laufenden Spiel zusammenlaufen — genau das, was `docs/WELTWERKZEUG.md`
unter „Öffnen während des Spiels" beschreibt. Auch hier lohnt der Blick in den
tatsächlichen Code statt nur in die Zielbeschreibung.

### 🔴 7. Speichern-Bestätigung ist praktisch unsichtbar

`GameApp.tsx` erzeugt bereits genau die richtigen Meldungen — inklusive der
Fehlerfälle, die zu Fund #3 passen:
```ts
setSaveMessage(`Gespeichert unter „${current.name}". Derselbe Name lädt den Stand.`);
// …
setSaveMessage("Speichern war in diesem Browser nicht möglich.");
// …
setSaveMessage("Auflage zu groß für diesen Browser. Hol die JSON-Datei unter Prüfen.");
```
Aber `saveMessage` wird in `Hud.tsx` **nur an einer einzigen Stelle** gerendert
(Zeile 297) — innerhalb des Status-Akkordeons, das standardmäßig **zugeklappt**
ist (`offen = false`):
```tsx
{offen ? (
  <div className="herein …">
    …
    {saveMessage ? <span className="text-ok">{saveMessage}</span> : null}
  </div>
) : null}
```
Wer auf **Speichern** tippt, ohne vorher das Status-Menü zu öffnen, bekommt **keinerlei
sichtbare Rückmeldung** — weder dass es geklappt hat, noch dass der Browser-Speicher
voll ist. Das ist derselbe „stille Fehler"-Musterfehler wie im Weltwerkzeug (Fund #3),
nur hier am wichtigsten Knopf im ganzen Spiel.

**Fix — Toast statt Akkordeon-Text:**
```tsx
{saveMessage ? (
  <div
    role="status"
    aria-live="polite"
    className="pointer-events-none absolute inset-x-0 top-full z-30 mx-auto mt-1 w-fit max-w-[92vw] rounded-sm border border-border bg-ink/95 px-3 py-1.5 text-xs text-fg shadow-md"
  >
    {saveMessage}
  </div>
) : null}
```
Direkt im äußeren HUD-Container ergänzen (unabhängig von `offen`), plus einen
kurzen Auto-Dismiss in `GameApp.tsx` (`setTimeout(() => setSaveMessage(null), 3500)`
nach dem Setzen). Damit sieht jede spielende Person sofort, ob der Stand sitzt —
das ist der wichtigste Einzel-Fix in diesem ganzen Dokument, gemessen an Häufigkeit
der Nutzung.

### 🟡 8. „Welt"-Badges fehlen auf Mobile — Wissen-Badge zeigt, wie es richtig geht

Der Wissen-Button macht es korrekt: Zahl sichtbar auf **allen** Breiten:
```tsx
<span className="tabular-nums sm:hidden">{wissenAnzahl || ""}</span>
<span className="hidden sm:inline">Wissen{wissenAnzahl ? ` (${wissenAnzahl})` : ""}</span>
```
Der SL-Button daneben tut das nicht — `weltPunkt` (Marker „diese Szene hat eine
Auflage") und `weltAnzahl` (Gesamtzahl) stecken **nur** im Desktop-Zweig:
```tsx
<span className="sm:hidden">{leiterAn ? "an" : "SL"}</span>
<span className="hidden sm:inline">
  {leiterAn ? "SL an" : "SL aus"}
  {weltPunkt ? " ●" : ""}
</span>
```
Auf einem Handy — also auch in der Android-App — ist der „gemerkt"-Punkt aus
`docs/WELTWERKZEUG.md` („Welt ● 3 … Punkt nur, wenn die aktuelle Szene eine
Auflage hat") schlicht **nicht vorhanden**. Die Spielleitung sieht auf dem Handy
nie, ob die gerade offene Karte schon einmal geändert wurde.

**Fix — dieselbe Struktur wie beim Wissen-Button:**
```tsx
<span className="tabular-nums sm:hidden">
  {leiterAn ? "an" : "SL"}{weltPunkt ? "●" : ""}
</span>
<span className="hidden sm:inline">
  {leiterAn ? "SL an" : "SL aus"}{weltPunkt ? " ●" : ""}
</span>
```

### 🟡 9. Wichtige Hinweise stecken nur im `title`-Attribut — auf Touch unsichtbar

`title`-Tooltips erscheinen nur bei Maus-Hover, nie bei Touch. Betroffen:
- Einstellungen-Button: `title="Einstellungen (E)"` — der Tastatur-Hinweis „(E)"
  ist auf einem Touch-Gerät ohnehin irrelevant, aber gerade deshalb bräuchte es
  dort keine Tastenangabe, sondern eher gar keinen Hinweis oder einen Touch-tauglichen.
- SL-Button: Der Unterschied zwischen „Menü öffnen" und „Spielleiter einschalten"
  steckt komplett im `title`-Text — auf dem Handy nicht lesbar, das sichtbare
  Label „SL an"/„SL aus" sagt nichts über offen/geschlossen aus.

**Faustregel für den Rest des Umbaus:** Jede Information, die im Spielleiter- oder
Spieler-HUD auf Android sichtbar sein muss, gehört in sichtbaren Text oder ein
Badge — nie ausschließlich in `title`.

### 🟢 10. Einstellungen-Button hat nie sichtbaren Text

Jeder andere HUD-Button zeigt ab `sm:` ein Textlabel — nur `Settings2` bleibt
reines Icon, auch auf Desktop. Kleine Inkonsistenz, schnell behoben:
```tsx
<Settings2 className="size-3.5" aria-hidden />
<span className="hidden sm:inline">Einstellungen</span>
```

### 🟢 11. Status-Panel ist kein Bottom-Sheet — Doku vs. Umsetzung

`docs/WELTWERKZEUG.md` legt für vergleichbare Overlays fest: „Mobil: dieselbe
Zeile, Schublade als **Bottom-Sheet** mit Safe-Area unten." Das aktuelle
Status-Akkordeon klappt stattdessen **inline unterhalb** der Sticky-Kopfzeile
auf (`mt-2 … border-t`) und schiebt den Spieltext nach unten, statt als Sheet von
unten hereinzufahren. Auf kurzen Bildschirmen kann der aufgeklappte Inhalt dadurch
teilweise unterhalb des sichtbaren Bereichs landen. Sobald Punkt 7 behoben ist,
lohnt sich dieselbe Bottom-Sheet-Lösung auch hier — dann für Speicher-Feedback
und Status-Panel konsistent.

### 🟢 12. Kein haptisches Feedback bei knappem Leben

`knapp` (LP ≤ 30 %) löst bereits eine visuelle Puls-Animation aus (`lp-knapp`).
Eine einmalige Vibration beim **Überschreiten** der Schwelle (nicht bei jedem
Render) wäre auf Android ein günstiger Zusatz:
```ts
useEffect(() => {
  if (knapp && "vibrate" in navigator) navigator.vibrate(80);
}, [knapp]);
```

---

## 📱 Android-Konsequenz

Die Android-App ist laut `README.md` eine reine WebView auf `lindendorf.vercel.app` —
der `/editor`-Bereich ist über die App also mit demselben (kompromittierten)
Passwort erreichbar. Zusätzlich: mobile WebViews räumen `localStorage` unter
Speicherdruck eher auf als Desktop-Browser, ohne Warnung. Das verschärft Fund #4
speziell auf Android — ungesicherte Auflagen/Figuren/Anker können dort eher
verschwinden als am Desktop.

---

## Priorisierte Reihenfolge für Codespaces

| # | Aufgabe | Aufwand | Warum zuerst |
|---|---|---|---|
| 1 | `LEITER_PASSWORT` als Secret, altes Passwort für ungültig erklären | 15 Min | öffentlich exponiert, jetzt schon dringend |
| 2 | Speichern-Feedback aus dem Akkordeon lösen, als sichtbaren Toast zeigen (Fund #7) | 20–30 Min | betrifft **jede** spielende Person bei **jedem** Speichern |
| 3 | Rückgabewerte der drei GM-Speicherfunktionen auswerten + Fehlermeldung in der UI | 30–45 Min | verhindert stillen Datenverlust im Weltwerkzeug |
| 4 | Welt-Badge (● / Zahl) auf Mobile sichtbar machen (Fund #8) | 10 Min | kleiner Fix, direkt sichtbarer Nutzen für die SL-Person auf Android |
| 5 | Gemeinsamer „Alles sichern"-Export-Knopf (Auflage+Figuren+Anker+Studio) | 1 Std | Sofort-Absicherung ohne Architekturänderung |
| 6 | Speicherauslastungs-Anzeige (`navigator.storage.estimate`) | 1 Std | macht Fund #4 sichtbar, bevor es kracht |
| 7 | Doku in `WELTWERKZEUG.md` an echtes Upload-Verhalten anpassen ODER Vercel-Blob-Upload bauen | 1 Std (Doku) / 3–4 Std (echter Upload) | schließt Code-Doku-Widerspruch |
| 8 | Tooltip-only Hinweise im HUD auf sichtbaren Text umstellen (Fund #9, #10) | 30 Min | Touch-Geräte sehen `title` nie |
| 9 | Kanon-Schreibpfad für ein erstes Modul (z. B. Wissen) | größer, eigener Auftrag | eure eigene Roadmap, Schritt 7 |
| 10 | Status-Panel als Bottom-Sheet, optionales Haptik-Feedback (Fund #11, #12) | 1–2 Std | Politur, kein akuter Schmerzpunkt |

---

Sag Bescheid, an welchem Punkt ich direkt im Code weitermachen soll — am
schnellsten wirksam sind 1–3, die lassen sich in einer Codespace-Sitzung
komplett durchziehen.
