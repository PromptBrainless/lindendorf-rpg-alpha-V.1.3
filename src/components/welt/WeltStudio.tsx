import { useMemo, useState } from "react";
import { Download, Plus, Search, ShieldCheck, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GraphKnoten } from "@/game/welt-graph";
import { ladeWerkstattFiguren } from "@/game/gm/werkstatt";
import { wissenIds, wissenDatei } from "@/game/json/wissen";
import { newEntity, newWorkspace, validateWorkspace, type Entity, type Workspace } from "@/game/studio/model";
import { downloadWorkspace, LocalWorkspaceStore } from "@/game/studio/store";
import { registeredSchemas } from "@/game/studio/plugins";

const store = new LocalWorkspaceStore();

/**
 * WorldForge-Studio, eingebettet als eigener Bereich der Spielleiter-Werkstatt.
 * Verwaltet Autorenmaterial (Entities/Relationen) getrennt vom Kanon; siehe docs/EDITOR.md.
 */
export function WeltStudio({ knoten }: { knoten: GraphKnoten[] }) {
  const [workspace, setWorkspace] = useState<Workspace>(() => store.load() ?? newWorkspace());
  const [selected, setSelected] = useState("");
  const [suche, setSuche] = useState("");
  const [typ, setTyp] = useState("alle");
  const [meldung, setMeldung] = useState("");

  const selectedEntity = workspace.entities.find((entity) => entity.id === selected) ?? null;
  const sichtbar = workspace.entities.filter(
    (entity) => (typ === "alle" || entity.type === typ) && `${entity.title} ${entity.type}`.toLowerCase().includes(suche.toLowerCase()),
  );
  const validation = useMemo(() => validateWorkspace(workspace), [workspace]);

  function aktualisiere(next: Workspace) {
    const mitStempel = { ...next, updatedAt: new Date().toISOString() };
    setWorkspace(mitStempel);
    store.save(mitStempel);
  }

  function neueEntity(entityType = registeredSchemas()[0]?.type ?? "notiz") {
    const schema = registeredSchemas().find((item) => item.type === entityType);
    const entity = newEntity(workspace.id, entityType, schema?.label ?? "Neue Notiz");
    aktualisiere({ ...workspace, entities: [...workspace.entities, entity] });
    setSelected(entity.id);
  }

  function bearbeite(patch: Partial<Entity>) {
    if (!selectedEntity) return;
    aktualisiere({
      ...workspace,
      entities: workspace.entities.map((entity) => (entity.id === selected ? { ...entity, ...patch, revision: entity.revision + 1, updatedAt: new Date().toISOString() } : entity)),
    });
  }

  function loesche(id: string) {
    aktualisiere({ ...workspace, entities: workspace.entities.filter((entity) => entity.id !== id) });
    if (selected === id) setSelected("");
  }

  function importiereDatei(file: File) {
    file.text().then((text) => {
      const result = validateWorkspace(JSON.parse(text));
      if (!result.workspace || result.findings.some((f) => f.severity === "error")) {
        setMeldung("Import abgelehnt: Workspace ist ungültig.");
        return;
      }
      aktualisiere(result.workspace);
      setMeldung("Workspace importiert.");
    });
  }

  function importiereAusLindendorf() {
    const figuren = ladeWerkstattFiguren();
    const neueEntitaeten: Entity[] = [];
    for (const k of knoten) {
      const existiert = workspace.entities.some((e) => e.type === "szene" && e.data.szeneId === k.id);
      if (existiert) continue;
      neueEntitaeten.push(newEntity(workspace.id, "szene", k.titel, { szeneId: k.id, quest: k.questTitel, notizen: "" }));
    }
    for (const figur of figuren) {
      const existiert = workspace.entities.some((e) => e.type === "figur" && e.data.figurId === figur.id);
      if (existiert) continue;
      const entity = newEntity(workspace.id, "figur", figur.name, { figurId: figur.id, rolle: figur.rolle, ort: figur.ort, weltbild: figur.weltbild, angst: figur.angst, ziel: figur.ziel });
      neueEntitaeten.push(entity);
    }
    for (const id of wissenIds()) {
      const tafel = wissenDatei(id);
      if (!tafel) continue;
      const existiert = workspace.entities.some((e) => e.type === "wissen" && e.data.tafelId === id);
      if (existiert) continue;
      neueEntitaeten.push(newEntity(workspace.id, "wissen", tafel.title, { tafelId: id, text: tafel.lines.join("\n\n"), szenen: (tafel.szenen ?? []).join(", ") }));
    }
    if (neueEntitaeten.length === 0) {
      setMeldung("Nichts Neues zum Übernehmen gefunden.");
      return;
    }
    aktualisiere({ ...workspace, entities: [...workspace.entities, ...neueEntitaeten] });
    setMeldung(`${neueEntitaeten.length} Einträge aus Lindendorf übernommen (Szenen, Figuren, Wissen).`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-fg">
          Das Studio hält freies Autorenmaterial: Notizen, Entwürfe und Querverweise zu Szenen, Figuren und Wissen. Es überschreibt keinen Kanon und ist getrennt vom laufenden Spiel.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="default" onClick={importiereAusLindendorf}>
            Aus Lindendorf übernehmen
          </Button>
          <Button variant="secondary" size="default" onClick={() => downloadWorkspace(workspace)} title="Studio exportieren">
            <Download size={16} /> Export
          </Button>
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-sm border border-border bg-surface px-4 text-sm hover:bg-surface-2">
            <Upload size={16} /> Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) importiereDatei(file);
                event.target.value = "";
              }}
            />
          </label>
          <Button variant="default" size="default" onClick={() => neueEntity()}>
            <Plus size={16} /> Neu
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-fg">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck size={14} /> {validation.findings.length ? `${validation.findings.length} Befunde` : "Workspace valide"}
        </span>
        <span>{workspace.entities.length} Einträge</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className={`rounded-sm border px-3 py-1.5 text-xs ${typ === "alle" ? "border-accent bg-accent text-accent-fg" : "border-border text-muted-fg hover:bg-surface-2"}`} onClick={() => setTyp("alle")}>
          Alle
        </button>
        {registeredSchemas().map((schema) => (
          <button
            key={schema.type}
            className={`rounded-sm border px-3 py-1.5 text-xs ${typ === schema.type ? "border-accent bg-accent text-accent-fg" : "border-border text-muted-fg hover:bg-surface-2"}`}
            onClick={() => setTyp(schema.type)}
          >
            {schema.label} <span className="opacity-70">{workspace.entities.filter((e) => e.type === schema.type).length || ""}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)]">
        <div className="space-y-2">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg" />
            <Input className="pl-9" value={suche} onChange={(event) => setSuche(event.target.value)} placeholder="Suchen..." />
          </div>
          <div className="max-h-[28rem] overflow-y-auto rounded-sm border border-border">
            {sichtbar.length === 0 ? (
              <div className="p-4 text-sm text-muted-fg">Noch keine Einträge. Lege eine Notiz an oder übernimm Lindendorf-Daten.</div>
            ) : (
              sichtbar.map((entity) => (
                <button
                  key={entity.id}
                  className={`flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-sm last:border-b-0 ${selected === entity.id ? "bg-accent text-accent-fg" : "hover:bg-surface-2"}`}
                  onClick={() => setSelected(entity.id)}
                >
                  <span className="min-w-0 truncate">
                    <strong className="block truncate">{entity.title}</strong>
                    <span className="block truncate text-xs opacity-70">{registeredSchemas().find((s) => s.type === entity.type)?.label ?? entity.type} · Rev. {entity.revision}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-sm border border-border p-4">
          {!selectedEntity ? (
            <p className="text-sm text-muted-fg">Wähle einen Eintrag links oder lege einen neuen an.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Input value={selectedEntity.title} onChange={(event) => bearbeite({ title: event.target.value })} className="text-base font-semibold" />
                <Button variant="ghost" size="default" onClick={() => loesche(selectedEntity.id)} title="Eintrag löschen">
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(selectedEntity.data).map(([feld, wert]) => (
                  <label key={feld} className="block text-sm">
                    <span className="mb-1 block text-xs uppercase tracking-wide text-subtle-fg">{feld}</span>
                    <textarea
                      className="min-h-16 w-full rounded-sm border border-border bg-ink/70 p-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={typeof wert === "string" ? wert : JSON.stringify(wert)}
                      onChange={(event) => bearbeite({ data: { ...selectedEntity.data, [feld]: event.target.value } })}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {meldung ? <p className="text-sm text-muted-fg">{meldung}</p> : null}
    </div>
  );
}
