import { useState } from "react";
import { BookMarked, ExternalLink, FlaskConical, LayoutGrid, MapPinned, PanelLeft, ShieldCheck, ShieldQuestion, UserRound, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EffektId, Held, SceneView } from "@/game/types";
import type { Tageszeit } from "@/game/tageszeit";
import { useFokusFang } from "@/game/fokus-fang";
import {
  auflageFuerSicht,
  auflageLeer,
  loescheAuflage,
  merkeAuflage,
  rueckgaengigAuflage,
  type WeltAuflage,
} from "@/game/welt";
import { viewAusKanon } from "@/game/welt-graph";
import { mapGmToolState } from "@/game/gm/mapGmToolState";
import { WIKI_LINKS } from "@/game/wiki";
import { WeltEntwurf } from "./WeltEntwurf";
import { WeltHeld } from "./WeltHeld";
import { WeltKarte } from "./WeltKarte";
import { WeltPruefen } from "./WeltPruefen";
import { WeltKampagne } from "./WeltKampagne";
import { WeltQuest } from "./WeltQuest";
import { WeltSpieler } from "./WeltSpieler";
import { WeltWissen } from "./WeltWissen";

type Fach = "karte" | "held" | "stimme" | "wissen" | "kampagne" | "quest" | "spieler" | "pruefen";

export function WeltEditor({
  szene,
  auflage,
  schluessel,
  held,
  onChange,
  onReset,
  onClose,
  onAus,
  onEffekt,
  onLage,
  onRueckgaengig,
  onTageszeit,
  startFach = "karte",
  onLadeSpieler,
  onSpielerGeaendert,
}: {
  szene: SceneView | null;
  auflage: WeltAuflage;
  schluessel: string;
  held: Held | null;
  onChange: (next: WeltAuflage) => void;
  onReset: () => void;
  onClose?: () => void;
  onAus?: () => void;
  onEffekt: (id: EffektId, an: boolean) => void;
  onLage: (frageIndex: number) => void;
  onRueckgaengig: () => void;
  onTageszeit?: (zeit: Tageszeit) => void;
  startFach?: Fach;
  onLadeSpieler?: (name: string) => void;
  onSpielerGeaendert?: () => void;
}) {
  const [fach, setFach] = useState<Fach>(szene ? startFach : "pruefen");
  const fang = useFokusFang(true);
  const [fremd, setFremd] = useState<SceneView | null>(null);
  const [fremdPatch, setFremdPatch] = useState<WeltAuflage>({});
  const [vorschau, setVorschau] = useState<string | null>(null);
  const sicht = fremd ?? szene;
  const sichtAuflage = fremd ? fremdPatch : auflage;
  const sichtKey = fremd ? (fremd.id ?? "") : schluessel;
  const merkt = !auflageLeer(sichtAuflage);
  const werk = mapGmToolState(held, sicht, sichtAuflage);
  const bruechig = Boolean(sicht && sicht.idStabil !== true);
  const nichtHeld = Boolean(fremd && fremd.id && fremd.id !== szene?.id);

  function oeffneSeite(id: string) {
    if (szene?.id === id) {
      setFremd(null);
      setFremdPatch({});
      setFach("karte");
      return;
    }
    const view = viewAusKanon(id);
    if (!view) return;
    setFremd(view);
    setFremdPatch(auflageFuerSicht(view).patch);
    setFach("karte");
  }

  function speichere(next: WeltAuflage) {
    if (fremd) {
      merkeAuflage(sichtKey, next, fremd.original ?? fremd);
      setFremdPatch(next);
      if (szene?.id === fremd.id) onChange(next);
      return;
    }
    onChange(next);
  }

  function reset() {
    if (fremd) {
      if (sichtKey) loescheAuflage(sichtKey);
      setFremdPatch({});
      return;
    }
    onReset();
  }

  function rueck() {
    if (fremd) {
      if (!sichtKey) return;
      const restored = rueckgaengigAuflage(sichtKey);
      if (restored) setFremdPatch(restored);
      else setFremdPatch({});
      return;
    }
    onRueckgaengig();
  }

  return (
    <aside
      ref={fang}
      className="safe-bottom fixed inset-0 z-40 overflow-y-auto bg-bg text-fg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welt-titel"
    >
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-5 sm:py-5">
        <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
          <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 id="welt-titel" className="font-display text-2xl font-semibold">Weltwerkzeug 2.0</h1>
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-fg">
                {nichtHeld ? "Fremde Szene" : werk.stand === "auflage" ? "Auflage" : "Kanon"}
              </span>
              {merkt && werk.stand === "kanon" ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-fg">Gemerkt</span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs text-muted-fg">{sicht?.title ?? "Keine Szene ausgewählt"}</p>
            <p className="mt-1 text-[11px] text-subtle-fg">
              {held?.name ? `${held.name} · ` : ""}
              {merkt ? "Lokale Auflage · Kanon bleibt erhalten" : "Kanonische Seite · bereit zur Bearbeitung"}
            </p>
            {vorschau ? <p className="mt-1 text-xs text-accent">{vorschau}</p> : null}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-11 px-3 text-sm"
              onClick={() => window.location.assign("/editor")}
              title="Vollständige Spielleiter-Werkstatt öffnen"
            >
              <PanelLeft className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Werkstatt</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-11 px-3 text-sm"
              onClick={() => window.open(WIKI_LINKS.index, "_blank", "noopener,noreferrer")}
              title="Lindendorf-Wiki öffnen"
            >
              <ExternalLink className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Wiki</span>
            </Button>
            {onAus ? (
              <Button type="button" variant="secondary" className="h-11 px-3 text-sm" onClick={onAus}>
                SL aus
              </Button>
            ) : null}
            {onClose ? (
              <Button type="button" variant="ghost" className="h-11 px-3 text-sm" onClick={onClose}>
                Schließen
              </Button>
            ) : null}
          </div>
          </div>
        </div>
        {nichtHeld ? (
          <div className="mb-3 flex items-center justify-between gap-2 rounded-sm border border-border px-3 py-2 text-sm">
            <span>Du siehst {sicht?.title}. Der Held steht woanders.</span>
            <Button
              type="button"
              variant="secondary"
              className="h-9 px-3 text-xs"
              onClick={() => {
                setFremd(null);
                setFremdPatch({});
              }}
            >
              Zurück zur Partie
            </Button>
          </div>
        ) : null}
        <div className="mb-4 flex gap-1 overflow-x-auto rounded-md border border-border bg-surface/40 p-1" role="tablist" aria-label="Weltwerkzeuge">
          {(
            [
              ["karte", "Karte", MapPinned],
              ["held", "Held", UserRound],
              ["stimme", "Stimme", FlaskConical],
              ["wissen", "Wissen", BookMarked],
              ["kampagne", "Kampagne", LayoutGrid],
              ["quest", "Quest", ShieldQuestion],
              ["spieler", "Partien", Users2],
              ["pruefen", "Prüfen", ShieldCheck],
            ] as const
          ).map(([id, titel, Symbol]) => (
            <button
              key={id}
              type="button"
              id={`welt-fach-${id}`}
              role="tab"
              aria-selected={fach === id}
              aria-controls="welt-fach-inhalt"
              className={`inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm px-3 text-sm transition-colors duration-[var(--motion-quick)] ${
                fach === id ? "bg-surface-2 text-fg" : "text-muted-fg hover:text-fg"
              }`}
              onClick={() => setFach(id)}
            >
              <Symbol className="size-4" aria-hidden />
              {titel}
            </button>
          ))}
        </div>
        <div id="welt-fach-inhalt" role="tabpanel" aria-labelledby={`welt-fach-${fach}`}>
        {fach === "karte" ? (
          sicht ? (
            <WeltKarte
              szene={sicht}
              auflage={sichtAuflage}
              schluessel={sichtKey}
              bruechig={bruechig}
              onChange={speichere}
              onReset={reset}
              onRueckgaengig={rueck}
            />
          ) : (
            <p className="text-sm text-muted-fg">Keine Karte in dieser Ansicht.</p>
          )
        ) : null}
        {fach === "held" ? (
          <WeltHeld
            held={held}
            onEffekt={onEffekt}
            onLage={onLage}
            onTageszeit={onTageszeit}
            onVorschau={setVorschau}
            onLadeSpieler={onLadeSpieler}
            onSpielerGeaendert={onSpielerGeaendert}
          />
        ) : null}
        {fach === "stimme" ? (
          <WeltEntwurf szene={sicht} auflage={sichtAuflage} schluessel={sichtKey} onChange={speichere} />
        ) : null}
        {fach === "wissen" ? <WeltWissen aktuell={sicht?.id} /> : null}
        {fach === "kampagne" ? <WeltKampagne aktuell={sicht?.id} onSeite={oeffneSeite} /> : null}
        {fach === "quest" ? <WeltQuest /> : null}
        {fach === "spieler" ? (
          <WeltSpieler aktuelleName={held?.name} onLade={onLadeSpieler} onGeaendert={onSpielerGeaendert} />
        ) : null}
        {fach === "pruefen" ? (
          <WeltPruefen
            szene={sicht}
            auflage={sichtAuflage}
            schluessel={sichtKey}
            held={held}
            onChange={speichere}
            seite
          />
        ) : null}
        </div>
      </div>
    </aside>
  );
}
