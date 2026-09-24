import { useEffect, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFokusFang } from "@/game/fokus-fang";
import { spieleStimmen, stoppeStimme, stimmenListe } from "@/game/stimme";
import { wissenTafeln } from "@/game/wissen-tafeln";
import type { Held } from "@/game/types";

export function KnowledgeJournal({ held, onClose }: { held: Held; debug?: boolean; onClose: () => void; an?: boolean }) {
  const tafeln = wissenTafeln(held);
  const fang = useFokusFang(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((wert) => Math.min(wert, Math.max(0, tafeln.length - 1)));
  }, [tafeln.length]);

  const tafel = tafeln[index];
  const zuege = tafel ? stimmenListe(tafel.stimmeSrc, tafel.stimmen) : [];

  useEffect(() => {
    spieleStimmen(zuege);
    return () => stoppeStimme();
  }, [tafel?.id, zuege.join("|")]);

  const offen = tafeln.filter((item) => item.offen).length;
  const gesehen = tafeln.length - offen;

  return (
    <div ref={fang} className="pointer-events-auto fixed inset-0 z-40 bg-bg text-fg" role="dialog" aria-modal="true" aria-labelledby="wissen-tafel-title">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-fg">Wissen</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">Was du weißt</h2>
          </div>
          <Button variant="ghost" className="h-11 px-3 text-sm" onClick={onClose} aria-label="Wissen schließen">
            <X className="size-4" aria-hidden />
            Schließen
          </Button>
        </div>

        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Einträge</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{tafeln.length}</p>
          </div>
          <div className="rounded-md border border-border bg-surface/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Gesehen</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-ok">{gesehen}</p>
          </div>
          <div className="rounded-md border border-border bg-surface/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Offen</p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-accent">{offen}</p>
          </div>
        </div>

        {held.mal ? <p className="mb-4 rounded-md border border-border bg-surface/60 px-3 py-2 text-sm leading-relaxed text-fg/90">{held.mal}</p> : null}

        {tafel ? (
          <div className="grid flex-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="space-y-2">
              {tafeln.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full overflow-hidden rounded-md border text-left transition-colors ${
                    index === i ? "border-accent bg-accent/5" : "border-border bg-surface/60 hover:border-accent/70"
                  }`}
                  onClick={() => setIndex(i)}
                >
                  <img src={item.bild} alt="" className="h-24 w-full object-cover" />
                  <div className="px-2.5 py-2.5">
                    <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-fg">
                      <span>{item.offen ? "Offen" : "Gesehen"}</span>
                      <span>{i + 1}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-fg">{item.title}</p>
                  </div>
                </button>
              ))}
            </aside>

            <figure className="m-0 flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-surface/60">
              <div className="relative min-h-52 border-b border-border bg-surface">
                <img src={tafel.bild} alt="" className="size-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" aria-hidden />
              </div>
              <figcaption className="flex flex-1 flex-col px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <p className={`text-[11px] uppercase tracking-[0.14em] ${tafel.offen ? "text-accent" : "text-ok"}`}>
                    {tafel.offen ? "Offen" : "Gesehen"}
                  </p>
                  <span className="text-[11px] text-muted-fg tabular-nums">
                    {index + 1} / {tafeln.length}
                  </span>
                </div>
                <h3 id="wissen-tafel-title" className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  {tafel.title}
                </h3>
                {zuege.length ? (
                  <button
                    type="button"
                    className="mt-3 inline-flex h-11 items-center gap-2 self-start rounded-sm border border-border bg-bg px-3 text-xs text-fg"
                    onClick={() => spieleStimmen(zuege)}
                  >
                    <Volume2 className="size-3.5 text-accent" aria-hidden />
                    {zuege.length > 1 ? "Gespräch noch einmal" : "Stimme noch einmal"}
                  </button>
                ) : null}
                <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-fg/95 sm:text-base">
                  {tafel.lines.map((zeile, i) => (
                    <p key={`${i}-${zeile.slice(0, 32)}`}>{zeile}</p>
                  ))}
                </div>
              </figcaption>
            </figure>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border bg-surface/40 px-4 py-8 text-center text-sm text-muted-fg">
            Noch kein Satz, der sich als Wissen festhält.
          </div>
        )}

        {tafeln.length > 1 ? (
          <div className="safe-bottom mt-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-12"
              disabled={index === 0}
              onClick={() => setIndex((wert) => Math.max(0, wert - 1))}
            >
              <ChevronLeft className="size-4" aria-hidden />
              Zurück
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-12"
              disabled={index >= tafeln.length - 1}
              onClick={() => setIndex((wert) => Math.min(tafeln.length - 1, wert + 1))}
            >
              Weiter
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
