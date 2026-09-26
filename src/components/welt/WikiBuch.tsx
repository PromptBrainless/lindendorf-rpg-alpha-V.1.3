import { useMemo, useState } from "react";
import { merkeWiki, wikiGeaendert, wikiSeiten, wikiText, wikiZurueck } from "@/game/wiki-buch";
import { WIKI_LINKS } from "@/game/wiki";
import { Button } from "@/components/ui/button";

export function WikiBuch({ start }: { start?: string }) {
  const seiten = useMemo(() => wikiSeiten(), []);
  const [wahl, setWahl] = useState(start && seiten.some((seite) => seite.datei === start) ? start : (seiten[0]?.datei ?? ""));
  const [suche, setSuche] = useState("");
  const [text, setText] = useState(() => (wahl ? wikiText(wahl) : ""));
  const [meldung, setMeldung] = useState<string | null>(null);
  const sichtbar = seiten.filter((seite) => {
    const begriff = suche.trim().toLocaleLowerCase("de-DE");
    if (!begriff) return true;
    return `${seite.titel} ${seite.datei}`.toLocaleLowerCase("de-DE").includes(begriff);
  });

  function oeffne(datei: string) {
    setWahl(datei);
    setText(wikiText(datei));
    setMeldung(null);
  }

  function speichern() {
    if (!wahl) return;
    merkeWiki(wahl, text);
    setMeldung(wikiGeaendert(wahl) ? "Liegt auf diesem Gerät. Das Wiki im Projekt bleibt unverändert." : "Wieder die mitgelieferte Fassung.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)]">
      <div className="grid content-start gap-2">
        <label className="text-xs text-muted-fg">
          Eintrag
          <input
            className="mt-1 h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg"
            value={suche}
            placeholder="Titel oder Datei"
            onChange={(event) => setSuche(event.target.value)}
          />
        </label>
        <ul className="max-h-[min(28rem,50vh)] overflow-y-auto rounded-sm border border-border">
          {sichtbar.map((seite) => (
            <li key={seite.datei}>
              <button
                type="button"
                className={`flex w-full flex-col px-3 py-2 text-left text-sm ${wahl === seite.datei ? "bg-surface-2 text-fg" : "text-muted-fg hover:text-fg"}`}
                onClick={() => oeffne(seite.datei)}
              >
                <span className="truncate">{seite.titel}</span>
                <span className="truncate text-xs text-subtle-fg">{wikiGeaendert(seite.datei) ? "Geändert auf diesem Gerät" : seite.datei}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-display text-2xl font-semibold">{seiten.find((seite) => seite.datei === wahl)?.titel ?? "Wiki"}</p>
            <p className="text-xs text-muted-fg">{wahl}</p>
          </div>
          <a href={WIKI_LINKS.index} target="_blank" rel="noreferrer" className="text-xs text-muted-fg underline">
            Original auf GitHub
          </a>
        </div>
        <textarea
          className="min-h-80 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm leading-relaxed text-fg"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={speichern}>
            Eintrag speichern
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (!wahl) return;
              wikiZurueck(wahl);
              setText(wikiText(wahl));
              setMeldung("Die mitgelieferte Fassung liegt wieder vor.");
            }}
          >
            Mitgelieferte Fassung
          </Button>
        </div>
        {meldung ? <p className="text-sm text-muted-fg">{meldung}</p> : null}
      </div>
    </div>
  );
}
