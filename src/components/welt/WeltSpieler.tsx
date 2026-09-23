import { useState } from "react";
import { Archive, Download, FileJson, Play, Trash2, Upload, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  clearSavedGameForName,
  exportiereSpielstand,
  importiereSpielstand,
  ladeSpielstandDatei,
  leseSpielstand,
  listSavedGameDetails,
  nameKey,
} from "@/game/save";
import { WeltFiguren } from "./WeltFiguren";
import { WeltZeitstrahl } from "./WeltZeitstrahl";

export function WeltSpieler({
  aktuelleName,
  onLade,
  onGeaendert,
}: {
  aktuelleName?: string;
  onLade?: (name: string) => void;
  onGeaendert?: () => void;
}) {
  const [slots, setSlots] = useState(() => listSavedGameDetails());
  const [wahl, setWahl] = useState<string | null>(null);
  const [loesch, setLoesch] = useState<string | null>(null);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const angesehen = wahl ? leseSpielstand(wahl) : null;
  const aktiv = aktuelleName ? nameKey(aktuelleName) : "";

  function refresh() {
    setSlots(listSavedGameDetails());
    onGeaendert?.();
  }

  return (
    <section className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <header className="border-b border-border bg-surface-2/60 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-accent">
              <Archive className="size-4" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">Archiv</span>
            </div>
            <h2 className="font-display text-2xl font-semibold leading-tight">Spieler</h2>
            <p className="mt-1 max-w-xl text-sm text-muted-fg">Partien auf diesem Gerät verwalten und wieder aufnehmen.</p>
          </div>
          <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs tabular-nums text-muted-fg">
            {slots.length} {slots.length === 1 ? "Stand" : "Stände"}
          </span>
        </div>
      </header>

      {slots.length === 0 ? (
        <div className="px-4 py-8 text-center sm:px-5">
          <UserRound className="mx-auto size-7 text-subtle-fg" aria-hidden />
          <p className="mt-3 text-sm text-fg">Noch keine gespeicherte Partie.</p>
          <p className="mt-1 text-xs text-muted-fg">Eine Standdatei kannst du unten importieren.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {slots.map((slot) => {
            const hier = slot.nameKey === aktiv;
            const offen = wahl === slot.name;
            return (
              <li key={slot.nameKey} className={hier ? "bg-accent/5" : ""}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-2/70 sm:px-5"
                  onClick={() => setWahl(offen ? null : slot.name)}
                  aria-expanded={offen}
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-fg">
                      <span className="truncate">{slot.name}</span>
                      {hier ? <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-fg">Aktiv</span> : null}
                      {!slot.lebend ? <span className="rounded-full border border-hp/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-hp">Tot</span> : null}
                    </span>
                    <span className="mt-1 block text-xs text-muted-fg">
                      {slot.savedAt ? new Date(slot.savedAt).toLocaleString("de-DE") : "ohne Datum"}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-muted-fg tabular-nums">
                    <span className="block text-fg">{slot.lp} LP</span>
                    <span className="block">{slot.log} Taten · {slot.gold} Gold</span>
                  </span>
                </button>
                {offen ? (
                  <div className="grid grid-cols-1 gap-2 border-t border-border/70 px-4 py-3 sm:grid-cols-3 sm:px-5">
                    {onLade ? (
                      <Button type="button" className="h-10 px-3 text-xs" onClick={() => onLade(slot.name)}>
                        <Play className="size-3.5" aria-hidden />
                        Laden
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-10 px-3 text-xs"
                      onClick={() => {
                        const held = leseSpielstand(slot.name);
                        if (!held) return;
                        ladeSpielstandDatei(slot.name, exportiereSpielstand(held));
                      }}
                    >
                      <Download className="size-3.5" aria-hidden />
                      Datei
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-10 px-3 text-xs text-hp hover:bg-hp/10"
                      onClick={() => setLoesch(loesch === slot.name ? null : slot.name)}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Löschen
                    </Button>
                  </div>
                ) : null}
                {loesch === slot.name ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hp/30 bg-hp/5 px-4 py-3 sm:px-5">
                    <p className="text-xs text-muted-fg">Stand „{slot.name}“ endgültig entfernen?</p>
                    <Button
                      type="button"
                      className="h-9 px-3 text-xs"
                      onClick={() => {
                        clearSavedGameForName(slot.name);
                        setLoesch(null);
                        setWahl(null);
                        setHinweis(`„${slot.name}“ ist weg.`);
                        refresh();
                      }}
                    >
                      Endgültig löschen
                    </Button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-t border-border bg-bg/40 px-4 py-4 sm:px-5">
        <label className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-accent/50 bg-surface text-sm text-accent transition-colors hover:bg-surface-2">
          <Upload className="size-4" aria-hidden />
          Standdatei importieren
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const datei = event.target.files?.[0];
              event.target.value = "";
              if (!datei) return;
              void datei.text().then((roh) => {
                const held = importiereSpielstand(roh);
                if (!held) {
                  setHinweis("Die Datei ist kein Spielstand.");
                  return;
                }
                setHinweis(`„${held.name}“ liegt im Fach.`);
                setWahl(held.name);
                refresh();
              });
            }}
          />
        </label>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-fg">
          <FileJson className="size-3.5" aria-hidden /> JSON-Spielstände werden lokal verarbeitet.
        </p>
      </div>
      {hinweis ? <p className="mt-2 text-xs text-accent">{hinweis}</p> : null}

      {angesehen ? (
        <div className="border-t border-border px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <UserRound className="size-4 text-accent" aria-hidden />
            <p className="text-sm font-semibold">Details · {angesehen.name}</p>
          </div>
          <WeltFiguren held={angesehen} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-fg">Zeitstrahl</p>
          <WeltZeitstrahl held={angesehen} />
        </div>
      ) : null}
    </section>
  );
}
