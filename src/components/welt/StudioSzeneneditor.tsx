import { Flag, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Entity, Workspace } from "@/game/studio/model";
import { lindendorfLibrary, type LibraryEntry } from "@/game/studio/library";
import { MakerProbeSchema, MakerSceneDataSchema, type MakerSceneData } from "@/game/studio/runner";

const mediaLibrary = lindendorfLibrary().filter((entry) => entry.category === "medium");
const backgrounds = mediaLibrary.filter((entry) =>
  entry.mediaType === "image" && entry.data.assetKind !== "portraet" && entry.preview,
);
const portraits = mediaLibrary.filter((entry) => entry.data.assetKind === "portraet" && entry.preview);
const audio = mediaLibrary.filter((entry) => entry.mediaType === "audio" && entry.preview);

function eintragFuerPfad(entries: LibraryEntry[], path: string | undefined) {
  return entries.find((entry) => entry.preview === path);
}

export function StudioSzeneneditor({
  entity,
  workspace,
  isStart,
  onTitle,
  onData,
  onSetStart,
  onChoiceTarget,
  onPreview,
}: {
  entity: Entity;
  workspace: Workspace;
  isStart: boolean;
  onTitle: (title: string) => void;
  onData: (patch: Partial<MakerSceneData>) => void;
  onSetStart: () => void;
  onChoiceTarget: (choiceIndex: number, targetId: string) => void;
  onPreview: () => void;
}) {
  const data = MakerSceneDataSchema.parse(entity.data);
  const scenes = workspace.entities.filter((candidate) => candidate.type === "szene");

  function aendereAsset(path: string) {
    const media = eintragFuerPfad(backgrounds, path);
    onData({
      art: typeof media?.data.assetKey === "string" ? media.data.assetKey : "village",
      artSrc: path || undefined,
    });
  }

  function aenderePortraet(path: string) {
    const media = eintragFuerPfad(portraits, path);
    onData({
      portrait: typeof media?.data.assetKey === "string" ? media.data.assetKey : undefined,
      portraitSrc: path || undefined,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Input aria-label="Szenentitel" value={entity.title} onChange={(event) => onTitle(event.target.value)} className="min-w-48 flex-1 text-base font-semibold" />
        <div className="flex gap-2">
          <Button type="button" variant={isStart ? "default" : "secondary"} className="h-11 px-3" onClick={onSetStart} aria-pressed={isStart}>
            <Flag size={16} /> {isStart ? "Startszene" : "Als Start"}
          </Button>
          <Button type="button" variant="secondary" className="h-11 px-3" onClick={onPreview}>
            <Play size={16} /> Testen
          </Button>
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium uppercase text-muted-fg">Bühnenbild</span>
        <select className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm" value={data.artSrc ?? ""} onChange={(event) => aendereAsset(event.target.value)}>
          <option value="">Standardbild: {data.art}</option>
          {data.artSrc && !eintragFuerPfad(backgrounds, data.artSrc) ? <option value={data.artSrc}>Aktueller Bildpfad</option> : null}
          {backgrounds.map((entry) => <option key={entry.id} value={entry.preview}>{entry.title} · {entry.sourceLabel}</option>)}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium uppercase text-muted-fg">Porträt</span>
        <select className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm" value={data.portraitSrc ?? ""} onChange={(event) => aenderePortraet(event.target.value)}>
          <option value="">Kein Porträt</option>
          {data.portraitSrc && !eintragFuerPfad(portraits, data.portraitSrc) ? <option value={data.portraitSrc}>Aktueller Bildpfad</option> : null}
          {portraits.map((entry) => <option key={entry.id} value={entry.preview}>{entry.title}</option>)}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium uppercase text-muted-fg">Stimme oder Audio</span>
        <select className="h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm" value={data.stimmeSrc ?? ""} onChange={(event) => onData({ stimmeSrc: event.target.value || undefined })}>
          <option value="">Kein Audio</option>
          {data.stimmeSrc && !audio.some((entry) => entry.preview === data.stimmeSrc) ? <option value={data.stimmeSrc}>Aktueller Audiopfad</option> : null}
          {audio.map((entry) => <option key={entry.id} value={entry.preview}>{entry.title} · {entry.sourceLabel}</option>)}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium uppercase text-muted-fg">Erzähltext · ein Absatz pro Zeile</span>
        <textarea className="min-h-40 w-full rounded-sm border border-border bg-ink/70 p-3 text-sm leading-relaxed text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.lines.join("\n")} onChange={(event) => onData({ lines: event.target.value.split("\n") })} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-xs font-medium uppercase text-muted-fg">Wahlen · eine pro Zeile</span>
        <textarea className="min-h-28 w-full rounded-sm border border-border bg-ink/70 p-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.choices.join("\n")} onChange={(event) => onData({ choices: event.target.value.split("\n") })} />
      </label>

      <section className="space-y-2 border-t border-border pt-4" aria-label="Wahlziele">
        <h3 className="text-xs font-semibold uppercase text-muted-fg">Wahlziele</h3>
        {data.choices.map((choice, index) => {
          const relation = workspace.relations.find((candidate) => candidate.kind === "choice" && candidate.fromId === entity.id && candidate.data.choiceIndex === index);
          const istEnde = data.endingChoices.includes(index);
          return (
            <label key={`${index}-${choice}`} className="grid gap-1 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(12rem,1fr)] sm:items-center">
              <span className="truncate">{index + 1}. {choice || "Unbenannte Wahl"}</span>
              <select className="h-11 min-w-0 rounded-sm border border-border bg-surface px-3 text-sm" value={istEnde ? "__ending__" : relation?.toId ?? ""} onChange={(event) => onChoiceTarget(index, event.target.value)}>
                <option value="">Kein Ziel</option>
                <option value="__ending__">Ende</option>
                {scenes.map((target) => <option key={target.id} value={target.id}>{target.title}</option>)}
              </select>
            </label>
          );
        })}
      </section>

      <section className="space-y-3 border-t border-border pt-4" aria-label="Probe">
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(data.probe)} onChange={(event) => onData({ probe: event.target.checked ? MakerProbeSchema.parse({ attribut: "Stärke" }) : undefined })} />
          Probe in dieser Szene aktivieren
        </label>
        {data.probe ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted-fg">Attribut</span>
              <select className="h-11 w-full rounded-sm border border-border bg-surface px-3" value={data.probe.attribut} onChange={(event) => onData({ probe: { ...data.probe!, attribut: event.target.value as NonNullable<MakerSceneData["probe"]>["attribut"] } })}>
                <option>Stärke</option><option>Geschicklichkeit</option><option>Charisma</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted-fg">Schwierigkeit</span>
              <Input type="number" min={1} max={30} value={data.probe.schwierigkeit} onChange={(event) => onData({ probe: { ...data.probe!, schwierigkeit: Number(event.target.value) } })} />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-muted-fg">Anlass</span>
              <Input value={data.probe.beschreibung} onChange={(event) => onData({ probe: { ...data.probe!, beschreibung: event.target.value } })} placeholder="Worum geht es bei der Probe?" />
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm sm:col-span-2">
              <input type="checkbox" checked={data.probe.nebel} onChange={(event) => onData({ probe: { ...data.probe!, nebel: event.target.checked } })} />
              Nebelmodifikator −2
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-muted-fg">Erfolgstext · ein Absatz pro Zeile</span>
              <textarea className="min-h-20 w-full rounded-sm border border-border bg-ink/70 p-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.probe.erfolgText.join("\n")} onChange={(event) => onData({ probe: { ...data.probe!, erfolgText: event.target.value.split("\n") } })} />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-muted-fg">Misserfolgstext · ein Absatz pro Zeile</span>
              <textarea className="min-h-20 w-full rounded-sm border border-border bg-ink/70 p-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.probe.misserfolgText.join("\n")} onChange={(event) => onData({ probe: { ...data.probe!, misserfolgText: event.target.value.split("\n") } })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted-fg">LP bei Erfolg</span>
              <Input type="number" min={-10} max={10} value={data.probe.erfolgLp} onChange={(event) => onData({ probe: { ...data.probe!, erfolgLp: Number(event.target.value) } })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted-fg">LP bei Misserfolg</span>
              <Input type="number" min={-10} max={10} value={data.probe.misserfolgLp} onChange={(event) => onData({ probe: { ...data.probe!, misserfolgLp: Number(event.target.value) } })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted-fg">Gold bei Erfolg</span>
              <Input type="number" min={-1000} max={1000} value={data.probe.erfolgGold} onChange={(event) => onData({ probe: { ...data.probe!, erfolgGold: Number(event.target.value) } })} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-xs text-muted-fg">Gold bei Misserfolg</span>
              <Input type="number" min={-1000} max={1000} value={data.probe.misserfolgGold} onChange={(event) => onData({ probe: { ...data.probe!, misserfolgGold: Number(event.target.value) } })} />
            </label>
          </div>
        ) : null}
      </section>
    </div>
  );
}