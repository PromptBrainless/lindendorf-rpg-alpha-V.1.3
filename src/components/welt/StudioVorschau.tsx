import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Dices, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SceneStage } from "@/components/game/SceneStage";
import { spieleKlang } from "@/game/klang";
import { createHeld } from "@/game/types";
import type { Workspace } from "@/game/studio/model";
import { makerSceneView, szeneNachId, wahlIstEnde, wahlZiel, wuerfleMakerProbe, wendeMakerProbeFolgeAn } from "@/game/studio/runner";

export function StudioVorschau({
  workspace,
  startSceneId,
  onClose,
}: {
  workspace: Workspace;
  startSceneId: string;
  onClose: () => void;
}) {
  const [sceneId, setSceneId] = useState(startSceneId);
  const [held, setHeld] = useState(() => createHeld("Vorschau", 8, 8, 8));
  const [probeResult, setProbeResult] = useState<ReturnType<typeof wuerfleMakerProbe>>();
  const [probeFolgeText, setProbeFolgeText] = useState<string[]>([]);
  const [beendet, setBeendet] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [meldung, setMeldung] = useState("");
  const scene = szeneNachId(workspace, sceneId);
  const view = useMemo(() => {
    const current = makerSceneView(scene, held, probeResult ?? undefined, probeFolgeText);
    return current && beendet ? { ...current, ending: "Ende dieses Testlaufs" } : current;
  }, [beendet, held, probeFolgeText, probeResult, scene]);
  const probeKonfiguriert = Boolean(scene?.type === "szene" && scene.data.probe);

  useEffect(() => {
    setSceneId(startSceneId);
    setHeld(createHeld("Vorschau", 8, 8, 8));
    setProbeResult(undefined);
    setProbeFolgeText([]);
    setBeendet(false);
    setMeldung("");
  }, [startSceneId, workspace.id]);

  function waehle(index: number) {
    if (!scene) return;
    if (beendet) return;
    if (wahlIstEnde(scene, index)) {
      setBeendet(true);
      setProbeResult(undefined);
      setProbeFolgeText([]);
      setMeldung("");
      return;
    }
    const target = wahlZiel(workspace, scene.id, index);
    if (!target) {
      setMeldung("Diese Wahl hat noch kein Szenenziel.");
      return;
    }
    setSceneId(target);
    setProbeResult(undefined);
    setProbeFolgeText([]);
    setBeendet(false);
    setMeldung("");
  }

  function neuStarten() {
    setSceneId(startSceneId);
    setHeld(createHeld("Vorschau", 8, 8, 8));
    setProbeResult(undefined);
    setProbeFolgeText([]);
    setBeendet(false);
    setMeldung("");
  }

  function wuerfle() {
    if (!scene) return;
    const result = wuerfleMakerProbe(scene, held);
    if (!result) return;
    const folge = wendeMakerProbeFolgeAn(scene, held, result);
    if (!folge) return;
    spieleKlang("wuerfel");
    setHeld(folge.held);
    setProbeResult(result);
    setProbeFolgeText(folge.lines);
    window.setTimeout(() => spieleKlang(result.erfolg ? "erfolg" : "misserfolg"), 560);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg text-fg" role="dialog" aria-modal="true" aria-label="Spielvorschau">
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-ink/95 px-3 py-2 backdrop-blur sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Button type="button" variant="secondary" className="h-11 shrink-0 px-3" onClick={onClose}>
            <ArrowLeft size={16} /> Werkstatt
          </Button>
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-fg">{workspace.name}</p>
            <h1 className="truncate text-sm font-semibold">{scene?.title ?? "Keine Startszene"}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" className="h-11 px-3" onClick={neuStarten} title="Testlauf neu starten" aria-label="Testlauf neu starten">
            <RotateCcw size={16} />
          </Button>
          {probeKonfiguriert ? (
            <Button type="button" variant="secondary" className="h-11 px-3" onClick={wuerfle}>
              <Dices size={16} /> Probe würfeln
            </Button>
          ) : null}
        </div>
      </header>
      {meldung ? <p className="border-b border-border bg-surface px-4 py-2 text-sm text-warn" role="status">{meldung}</p> : null}
      {view ? (
        <SceneStage
          view={view}
          original={view}
          onChoose={waehle}
          onSave={() => setMeldung("Testspielstände werden nicht gespeichert.")}
          saveMessage={null}
          onKnowledge={() => setKnowledgeOpen((open) => !open)}
          knowledgeOpen={knowledgeOpen}
          debug={false}
          leiterOpen={false}
          patch={{}}
          schluessel={scene?.id ?? ""}
          onLeiter={onClose}
          onPatch={() => undefined}
          onResetKarte={() => undefined}
          authorMode={false}
          onEffekt={() => undefined}
          onHerkunft={() => undefined}
          onLageVorlegen={() => undefined}
          lageIndex={null}
          onLageAntwort={() => undefined}
          onLageSchliessen={() => undefined}
          onRueckgaengig={() => undefined}
          wissenAnzahl={0}
          weltAnzahl={0}
          weltPunkt={false}
        />
      ) : (
        <div className="mx-auto grid min-h-[60vh] max-w-3xl place-content-center gap-3 px-5 text-center">
          <h2 className="font-display text-2xl font-semibold">Keine gültige Startszene</h2>
          <p className="text-sm text-muted-fg">Lege im Szeneneditor eine Szene als Start fest, bevor du dein Projekt testest.</p>
        </div>
      )}
    </div>
  );
}