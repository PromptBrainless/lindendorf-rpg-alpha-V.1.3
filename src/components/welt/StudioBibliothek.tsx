import { useMemo, useState } from "react";
import { Image, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lindendorfLibrary, type LibraryCategory, type LibraryEntry } from "@/game/studio/library";

const CATEGORY_LABELS: Record<LibraryCategory, string> = {
  medium: "Medien",
  abschnitt: "Questabschnitte",
  szene: "Szenen",
  figur: "Figuren",
  wissen: "Wissen",
  gegenstand: "Gegenstände",
};

export function StudioBibliothek({
  importedIds,
  onImport,
}: {
  importedIds: Set<string>;
  onImport: (entry: LibraryEntry) => void;
}) {
  const [category, setCategory] = useState<"alle" | LibraryCategory>("alle");
  const [search, setSearch] = useState("");
  const entries = useMemo(() => lindendorfLibrary(), []);
  const visible = entries.filter((entry) => {
    const matchesCategory = category === "alle" || entry.category === category;
    const term = search.trim().toLocaleLowerCase("de-DE");
    return matchesCategory && (!term || `${entry.title} ${entry.sourceLabel} ${entry.category}`.toLocaleLowerCase("de-DE").includes(term));
  });
  const media = visible.filter((entry) => entry.category === "medium");
  const records = visible.filter((entry) => entry.category !== "medium");

  function mediaCard(entry: LibraryEntry) {
    const imported = importedIds.has(entry.id);
    return (
      <article key={entry.id} className="overflow-hidden rounded-sm border border-border bg-surface/40">
        {entry.mediaType === "image" && entry.preview ? <img src={entry.preview} alt={entry.title} loading="lazy" className="aspect-video w-full object-cover" /> : null}
        {entry.mediaType === "video" && entry.preview ? <video src={entry.preview} controls preload="none" className="aspect-video w-full object-cover" aria-label={entry.title} /> : null}
        {entry.mediaType === "audio" && entry.preview ? <div className="flex aspect-video items-center justify-center bg-surface-2 p-4"><audio src={entry.preview} controls preload="none" aria-label={entry.title} /></div> : null}
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">{entry.title}</h3>
            <p className="truncate text-xs text-muted-fg">{entry.sourceLabel}</p>
          </div>
          <Button type="button" variant="secondary" className="h-10 shrink-0 px-3" onClick={() => onImport(entry)} disabled={imported}>
            <Image size={16} /> {imported ? "Übernommen" : "Übernehmen"}
          </Button>
        </div>
      </article>
    );
  }

  function recordRow(entry: LibraryEntry) {
    const imported = importedIds.has(entry.id);
    return (
      <tr key={entry.id} className="border-t border-border">
        <td className="max-w-64 px-3 py-3 font-medium">{entry.title}</td>
        <td className="px-3 py-3 text-muted-fg">{CATEGORY_LABELS[entry.category]}</td>
        <td className="max-w-64 px-3 py-3 text-muted-fg">{entry.sourceLabel}</td>
        <td className="px-3 py-2 text-right">
          <Button type="button" variant="secondary" className="h-10 whitespace-nowrap px-3" onClick={() => onImport(entry)} disabled={imported}>
            <Plus size={16} /> {imported ? "Übernommen" : "Übernehmen"}
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-xl">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
        <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Bibliothek durchsuchen..." />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Bibliothekskategorien">
        <button type="button" className={`rounded-sm border px-3 py-2 text-sm ${category === "alle" ? "border-accent bg-accent text-accent-fg" : "border-border text-muted-fg hover:bg-surface-2"}`} onClick={() => setCategory("alle")}>
          Alle <span className="opacity-70">{entries.length}</span>
        </button>
        {(Object.entries(CATEGORY_LABELS) as [LibraryCategory, string][]).map(([id, label]) => {
          const count = entries.filter((entry) => entry.category === id).length;
          return (
            <button key={id} type="button" className={`rounded-sm border px-3 py-2 text-sm ${category === id ? "border-accent bg-accent text-accent-fg" : "border-border text-muted-fg hover:bg-surface-2"}`} onClick={() => setCategory(id)}>
              {label} <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? <div className="rounded-sm border border-border p-6 text-sm text-muted-fg">Keine passenden Einträge gefunden.</div> : null}
      {media.length > 0 ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{media.map(mediaCard)}</div> : null}
      {records.length > 0 ? (
        <div className="overflow-x-auto rounded-sm border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase text-muted-fg">
              <tr><th className="px-3 py-3 font-medium">Eintrag</th><th className="px-3 py-3 font-medium">Kategorie</th><th className="px-3 py-3 font-medium">Herkunft</th><th className="px-3 py-3 font-medium"><span className="sr-only">Aktion</span></th></tr>
            </thead>
            <tbody>{records.map(recordRow)}</tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}