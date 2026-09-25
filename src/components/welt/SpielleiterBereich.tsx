import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  FilePenLine,
  MapPinned,
  Link2,
  Plus,
  ScrollText,
  ShieldCheck,
  ShieldQuestion,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SceneView } from "@/game/types";
import { baueWeltGraph, viewAusKanon } from "@/game/welt-graph";
import {
  auflageFuerSicht,
  auflageLeer,
  loescheAuflage,
  merkeAuflage,
  rueckgaengigAuflage,
  type WeltAuflage,
} from "@/game/welt";
import { WELTBILD } from "@/game/weltbild";
import { WIKI_LINKS } from "@/game/wiki";
import { ladeWerkstattFiguren, leereWerkstattFigur, istKanonfigur, speichereWerkstattFigur, type WerkstattFigur } from "@/game/gm/werkstatt";
import { istKanonanker, ladeSozialanker, leererSozialanker, SozialankerSchema, speichereSozialanker, type Sozialanker } from "@/game/gm/sozialanker";
import { WeltEntwurf } from "./WeltEntwurf";
import { WeltKampagne } from "./WeltKampagne";
import { WeltKarte } from "./WeltKarte";
import { WeltPruefen } from "./WeltPruefen";
import { WeltQuest } from "./WeltQuest";
import { WeltSpieler } from "./WeltSpieler";
import { WeltWissen } from "./WeltWissen";

type Bereich = "uebersicht" | "geschichte" | "szenen" | "figuren" | "wissen" | "orte" | "quest" | "anker" | "spieler" | "pruefen";

const SCHNELLZUGRIFF_IDS = [
  "intro-weg",
  "intro-fremder-am-weg",
  "intro-tal",
  "intro-rauch-graben",
  "intro-hang",
  "intro-ankunft",
] as const;

const FEATURE_CARDS = [
  { titel: "Erzählpuls", text: "Schuld, Ort und Erinnerung müssen in derselben Seite zusammenpassen.", aktion: "Geschichte öffnen" },
  { titel: "Figurenstimmen", text: "Jede Figur trägt ein Ziel, einen Ort und eine persönliche Last mit.", aktion: "Figur prüfen" },
  { titel: "Wissenlinien", text: "Spuren, Wiederholungen und versteckte Wahrheiten bleiben in sichtbaren Tafeln verankert.", aktion: "Wissen ansehen" },
  { titel: "Szenenfluss", text: "Die Reise durch Lindendorf bleibt nachvollziehbar und ohne Brüche im Rhythmus.", aktion: "Karte ansehen" },
] as const;

const BEREICHE: Array<{ id: Bereich; titel: string; untertitel: string; Symbol: typeof Compass }> = [
  { id: "uebersicht", titel: "Übersicht", untertitel: "Das Werk im Blick", Symbol: Compass },
  { id: "geschichte", titel: "Geschichte", untertitel: "Seiten schreiben", Symbol: FilePenLine },
  { id: "szenen", titel: "Szenen", untertitel: "Karten und Wege", Symbol: MapPinned },
  { id: "figuren", titel: "Figuren", untertitel: "Menschen erfinden", Symbol: UsersRound },
  { id: "wissen", titel: "Wissen", untertitel: "Tafeln anlegen", Symbol: BookOpen },
  { id: "orte", titel: "Orte", untertitel: "Das Tal ordnen", Symbol: Compass },
  { id: "quest", titel: "Questpfade", untertitel: "Wege prüfen", Symbol: ShieldQuestion },
  { id: "anker", titel: "Soziale Anker", untertitel: "Rang an Wahl binden", Symbol: Link2 },
  { id: "spieler", titel: "Partien", untertitel: "Stände laden", Symbol: UsersRound },
  { id: "pruefen", titel: "Prüfen", untertitel: "Vor dem Spiel", Symbol: ShieldCheck },
];

const BEREICH_GRUPPEN: Array<{ titel: string; ids: Bereich[] }> = [
  { titel: "Orientierung", ids: ["uebersicht", "orte", "spieler"] },
  { titel: "Erzählung", ids: ["geschichte", "szenen", "figuren", "wissen"] },
  { titel: "Kontrolle", ids: ["quest", "anker", "pruefen"] },
];

const SCHNELLAKTIONEN: Array<{ bereich: Bereich; label: string; hint: string }> = [
  { bereich: "geschichte", label: "Geschichte", hint: "Text schreiben" },
  { bereich: "szenen", label: "Szenen", hint: "Karten lesen" },
  { bereich: "figuren", label: "Figuren", hint: "Stimmen bauen" },
  { bereich: "wissen", label: "Wissen", hint: "Tafeln prüfen" },
  { bereich: "pruefen", label: "Prüfen", hint: "Vor dem Spiel" },
];

const FEATURE_MODULE = [
  { titel: "Erzählpuls", beschreibung: "Befund, Schuld und Stimmung müssen in derselben Seite zusammenwirken.", farbe: "gold" },
  { titel: "Figurenstimmen", beschreibung: "Jede Figur trägt Ort, Angst und Ziel mit sich, statt bloßer Namen zu sein.", farbe: "amber" },
  { titel: "Wissenlinien", beschreibung: "Wissen und Spur bleiben am Ort verankert und nicht im Kopf des GM allein.", farbe: "olive" },
  { titel: "Questlogik", beschreibung: "Pfad, Text und Prüfung bleiben lesbar, bevor eine Szene in die Partie fällt.", farbe: "copper" },
] as const;

export function SpielleiterBereich() {
  const graph = useMemo(() => baueWeltGraph(), []);
  const [bereich, setBereich] = useState<Bereich>("uebersicht");
  const startSzene = graph.knoten.find((knoten) => knoten.titel === "Ankunft");
  const [szeneId, setSzeneId] = useState(startSzene?.id ?? "");
  const [suche, setSuche] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const szene = useMemo(() => (szeneId ? viewAusKanon(szeneId) : null), [szeneId]);
  const [auflage, setAuflage] = useState<WeltAuflage>(() => (szene ? auflageFuerSicht(szene).patch : {}));
  const [meldung, setMeldung] = useState<string | null>(null);

  function oeffneSzene(id: string, ziel: Bereich = "szenen") {
    const next = viewAusKanon(id);
    if (!next) return;
    setSzeneId(id);
    setAuflage(auflageFuerSicht(next).patch);
    setBereich(ziel);
    setMeldung(null);
  }

  function aendereAuflage(next: WeltAuflage) {
    setAuflage(next);
    if (!szene) return;
    merkeAuflage(szene.id ?? szene.title, next, szene.original ?? szene);
    setMeldung("Die Auflage liegt lokal auf dieser Seite. Der Kanon bleibt unangetastet.");
  }

  function setzeKanon() {
    if (!szene?.id) return;
    loescheAuflage(szene.id);
    setAuflage({});
    setMeldung("Die Seite zeigt wieder den Kanon.");
  }

  function rueckgaengig() {
    if (!szene?.id) return;
    const restored = rueckgaengigAuflage(szene.id);
    setAuflage(restored ?? {});
    setMeldung(restored ? "Die letzte Fassung ist wiederhergestellt." : "Für diese Seite gibt es keine frühere Fassung.");
  }

  const sichtbareKnoten = graph.knoten.filter((knoten) => {
    const begriff = suche.trim().toLocaleLowerCase("de-DE");
    if (!begriff) return true;
    return `${knoten.titel} ${knoten.id} ${knoten.questTitel} ${knoten.teilTitel}`.toLocaleLowerCase("de-DE").includes(begriff);
  });

  return (
    <main className="min-h-screen bg-[#0b0a08] text-fg selection:bg-accent/30">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-[#0b0a08]/95 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <span>How to be a Hero — Lindendorf</span>
                <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[10px] tracking-[0.12em] text-muted-fg">Weltwerkzeug 2.0</span>
              </div>
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Werkstatt für das ganze Tal</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-fg">
                Geschichte, Figuren, Orte, Wissen und Wege liegen in einem Arbeitsraum. Jede Änderung bleibt an der bestehenden Partie lesbar.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-muted-fg">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/5 px-2.5 py-1"><CheckCircle2 className="size-4 text-ok" aria-hidden />Kanon geladen</span>
              <span className="rounded-full border border-border px-2.5 py-1">8 Quests · {graph.knoten.length} Seiten</span>
              <button
                type="button"
                onClick={() => setOverlayOpen((open) => !open)}
                className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border px-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Overlay
              </button>
              <a
                href={WIKI_LINKS.index}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border px-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                Wiki
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SCHNELLAKTIONEN.map((aktion) => (
              <button
                key={aktion.bereich}
                type="button"
                onClick={() => setBereich(aktion.bereich)}
                className="rounded-sm border border-border bg-surface/40 px-2.5 py-1.5 text-left transition-colors hover:border-accent hover:text-accent"
              >
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-fg">{aktion.hint}</span>
                <span className="block text-sm text-fg">{aktion.label}</span>
              </button>
            ))}
          </div>
        </header>

        {overlayOpen ? (
          <div className="pointer-events-none fixed inset-0 z-40 flex items-start justify-end bg-black/45 p-4 pt-24">
            <div className="pointer-events-auto w-full max-w-sm rounded-md border border-border bg-[#110d09]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Tool overlay</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-fg">GM-Workbench</h2>
                </div>
                <button type="button" onClick={() => setOverlayOpen(false)} className="rounded-sm border border-border px-2 py-1 text-xs text-muted-fg hover:text-fg">Schließen</button>
              </div>

              <div className="mt-4 grid gap-2">
                {SCHNELLAKTIONEN.map((aktion) => (
                  <button
                    key={aktion.bereich}
                    type="button"
                    onClick={() => {
                      setBereich(aktion.bereich);
                      setOverlayOpen(false);
                    }}
                    className="rounded-sm border border-border bg-surface/40 px-3 py-2 text-left transition-colors hover:border-accent hover:bg-surface-2"
                  >
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-fg">{aktion.hint}</span>
                    <span className="mt-1 block text-sm font-medium text-fg">{aktion.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)_13rem]">
          <nav className="self-start lg:sticky lg:top-5" aria-label="Spielleiter-Bereiche">
            <div className="grid gap-4 rounded-md border border-border bg-surface/40 p-2">
              {BEREICH_GRUPPEN.map((gruppe) => (
                <div key={gruppe.titel}>
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle-fg">{gruppe.titel}</p>
                  <div className="grid gap-1">
                    {gruppe.ids.map((id) => {
                      const eintrag = BEREICHE.find((item) => item.id === id)!;
                      const Symbol = eintrag.Symbol;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-current={bereich === id}
                          onClick={() => setBereich(id)}
                          className={`flex min-h-12 items-center gap-3 rounded-sm px-3 text-left transition-colors duration-[var(--motion-quick)] ${bereich === id ? "bg-accent text-accent-fg shadow-sm" : "text-muted-fg hover:bg-surface-2 hover:text-fg"}`}
                        >
                          <Symbol className="size-4 shrink-0" aria-hidden />
                          <span>
                            <span className="block text-sm font-semibold">{eintrag.titel}</span>
                            <span className={`block text-xs ${bereich === id ? "text-accent-fg/70" : "text-subtle-fg"}`}>{eintrag.untertitel}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-md border border-border px-3 py-3 text-xs leading-relaxed text-muted-fg">
              <p className="font-semibold text-fg">Arbeitsregel</p>
              <p className="mt-1">Erst Seite und Folge benennen. Dann schreiben. Der Kanon bleibt als Vergleich erhalten.</p>
            </div>
          </nav>

          <section className="min-w-0" aria-live="polite">
            {bereich === "uebersicht" ? <Uebersicht graph={graph} onBereich={setBereich} onSzene={oeffneSzene} /> : null}
            {bereich === "geschichte" ? (
              <Arbeitsflaeche titel="Geschichte schreiben" beschreibung="Wähle eine vorhandene Seite und entwickle ihre Fassung weiter. Neue Schuld, neue Orte und neue Figuren gehören erst in den Kanon, wenn die passende Seite benannt ist.">
                <div className="grid gap-5 xl:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)]">
                  <Szenenliste knoten={sichtbareKnoten} suche={suche} onSuche={setSuche} ausgewaehlt={szeneId} onAuswahl={(id) => oeffneSzene(id, "geschichte")} />
                  {szene ? <WeltEntwurf szene={szene} auflage={auflage} schluessel={szene.id} onChange={aendereAuflage} /> : <LeereAuswahl />}
                </div>
              </Arbeitsflaeche>
            ) : null}
            {bereich === "szenen" ? (
              <Arbeitsflaeche titel="Szenen und Karten" beschreibung="Der Szenenkatalog folgt dem aktiven Spiel: acht Questreihen, 71 Seiten, dieselben Bezeichnungen wie im Ablauf.">
                <div className="grid gap-5 xl:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)]">
                  <Szenenliste knoten={sichtbareKnoten} suche={suche} onSuche={setSuche} ausgewaehlt={szeneId} onAuswahl={(id) => oeffneSzene(id)} />
                  {szene ? <WeltKarte szene={szene} auflage={auflage} schluessel={szene.id ?? ""} bruechig={false} onChange={aendereAuflage} onReset={setzeKanon} onRueckgaengig={rueckgaengig} /> : <LeereAuswahl />}
                </div>
                {meldung ? <Meldung text={meldung} /> : null}
              </Arbeitsflaeche>
            ) : null}
            {bereich === "figuren" ? <FigurenWerkstatt /> : null}
            {bereich === "wissen" ? (
              <Arbeitsflaeche titel="Wissenstafeln" beschreibung="Wissen wird an Seiten und Fragen gebunden. Eine Tafel darf eine Spur öffnen, aber sie nimmt dem Spieler nicht die Entscheidung ab.">
                <WeltWissen aktuell={szeneId} />
              </Arbeitsflaeche>
            ) : null}
            {bereich === "orte" ? <OrteWerkstatt onSzene={oeffneSzene} /> : null}
            {bereich === "quest" ? (
              <Arbeitsflaeche titel="Questpfade" beschreibung="Prüfe die vorhandenen Wege durch die Questreihen mit den bestehenden Pfad- und Lagerprüfungen.">
                <WeltQuest />
              </Arbeitsflaeche>
            ) : null}
            {bereich === "anker" ? <SozialeAnkerWerkstatt /> : null}
            {bereich === "spieler" ? (
              <Arbeitsflaeche titel="Partien und Spielstände" beschreibung="Lade eine vorhandene Partie, bevor du Zustände, Tageszeit oder eine Probe im laufenden Weltwerkzeug untersuchst.">
                <WeltSpieler />
              </Arbeitsflaeche>
            ) : null}
            {bereich === "pruefen" ? (
              <Arbeitsflaeche titel="Prüfen und ordnen" beschreibung="Hier wird sichtbar, was der aktuelle Szenenkatalog trägt: Wege, Seiten, Bilder, Textlängen und die Grenze zwischen Heldensicht und Spielleiterwissen.">
                <WeltKampagne aktuell={szeneId} onSeite={(id) => oeffneSzene(id)} />
                {szene ? <div className="mt-6 border-t border-border pt-5"><WeltPruefen szene={szene} auflage={auflage} schluessel={szene.id} held={null} onChange={aendereAuflage} seite /></div> : null}
              </Arbeitsflaeche>
            ) : null}
          </section>

          <KontextPanel szene={szene} auflage={auflage} bereich={bereich} />
        </div>
      </div>
    </main>
  );
}

function Uebersicht({ graph, onBereich, onSzene }: { graph: ReturnType<typeof baueWeltGraph>; onBereich: (bereich: Bereich) => void; onSzene: (id: string, bereich?: Bereich) => void }) {
  const questAnzahl = new Set(graph.knoten.map((knoten) => knoten.quest)).size;
  const offeneSeiten = graph.leer + graph.kurz + graph.stichpunkt;

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 md:grid-cols-4">
        <Zahl wert={questAnzahl} label="Questreihen" />
        <Zahl wert={graph.knoten.length} label="Seiten im Spiel" />
        <Zahl wert={offeneSeiten} label="Textstellen prüfen" warnung={offeneSeiten > 0} />
        <Zahl wert={WELTBILD.length} label="Orte im Weltbild" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-border bg-surface/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Der aktuelle Stand</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Ein Dorf, acht Wege durch dieselbe Schuld</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-fg">
            Die Partie beginnt auf dem Weg nach Lindendorf und führt über Dorfplatz, Brunnen, Mühle, Kesseljahr, Glockenweg und Steinbruch zum Ende. Die Werkstatt bleibt an diesem Bestand. Sie macht ihn bearbeitbar, ohne den Spielertext und die verborgene Wahrheit zu vermischen.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" onClick={() => onBereich("geschichte")}><FilePenLine className="size-4" aria-hidden />Geschichte öffnen</Button>
            <Button type="button" variant="secondary" onClick={() => onBereich("figuren")}><UserRound className="size-4" aria-hidden />Figur erfinden</Button>
            <Button type="button" variant="secondary" onClick={() => onBereich("wissen")}><BookOpen className="size-4" aria-hidden />Wissenstafel anlegen</Button>
          </div>
        </div>

        <div className="rounded-md border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Schnellzugriff</p>
          <div className="mt-3 grid gap-1">
            {SCHNELLZUGRIFF_IDS.map((id) => graph.knoten.find((knoten) => knoten.id === id)).filter((knoten): knoten is (typeof graph.knoten)[number] => Boolean(knoten)).map((knoten) => (
              <button key={knoten.id} type="button" className="flex items-center justify-between gap-3 border-b border-border/60 py-2 text-left text-sm hover:text-accent" onClick={() => onSzene(knoten.id)}>
                <span className="truncate">{knoten.titel}</span>
                <span className="shrink-0 text-xs text-muted-fg">{knoten.questTitel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-surface/40 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Ablauf heute</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-fg">
            <div className="rounded-sm border border-border px-3 py-2">1. Befund sichern</div>
            <div className="rounded-sm border border-border px-3 py-2">2. Schuld und Ort nachverfolgen</div>
            <div className="rounded-sm border border-border px-3 py-2">3. Questzugriff und Prüfung validieren</div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface/40 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Arbeitsstatus</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-sm border border-border px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Kanon</p>
              <p className="mt-1 text-lg font-semibold text-fg">Aktiv</p>
            </div>
            <div className="rounded-sm border border-border px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Lokale Fassung</p>
              <p className="mt-1 text-lg font-semibold text-fg">Verfügbar</p>
            </div>
            <div className="rounded-sm border border-border px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Wissen</p>
              <p className="mt-1 text-lg font-semibold text-fg">Zugriff</p>
            </div>
            <div className="rounded-sm border border-border px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-fg">Prüfung</p>
              <p className="mt-1 text-lg font-semibold text-fg">Bereit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-md border border-border bg-surface/40 p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Fokus im Moment</p>
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-fg">V2 aktiv</span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {FEATURE_MODULE.map((feature) => (
              <article key={feature.titel} className="rounded-sm border border-border bg-surface/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-fg">{feature.titel}</p>
                  <span className={`h-2.5 w-2.5 rounded-full ${feature.farbe === "gold" ? "bg-[#d6a866]" : feature.farbe === "amber" ? "bg-[#d9b36d]" : feature.farbe === "olive" ? "bg-[#8aa174]" : "bg-[#ca7d56]"}`} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-fg">{feature.beschreibung}</p>
                <button
                  type="button"
                  className="mt-3 text-xs font-medium text-accent hover:text-accent/80"
                  onClick={() => {
                    if (feature.titel === "Erzählpuls") onBereich("geschichte");
                    if (feature.titel === "Figurenstimmen") onBereich("figuren");
                    if (feature.titel === "Wissenlinien") onBereich("wissen");
                    if (feature.titel === "Questlogik") onBereich("quest");
                  }}
                >
                  {feature.titel === "Erzählpuls" ? "Geschichte öffnen" : feature.titel === "Figurenstimmen" ? "Figur prüfen" : feature.titel === "Wissenlinien" ? "Wissen ansehen" : "Questpfad prüfen"}
                </button>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border bg-surface/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Arbeitsablauf</p>
          <ol className="mt-4 space-y-3 text-sm text-muted-fg">
            <li className="rounded-sm border border-border px-3 py-2"><span className="mr-2 font-semibold text-fg">01</span>Seite auswählen und im Kontext lesen</li>
            <li className="rounded-sm border border-border px-3 py-2"><span className="mr-2 font-semibold text-fg">02</span>Wissen, Schuld und Ort mit der aktuellen Seite absichern</li>
            <li className="rounded-sm border border-border px-3 py-2"><span className="mr-2 font-semibold text-fg">03</span>Questpfad und Prüfung gegen die Weltkontrolle prüfen</li>
            <li className="rounded-sm border border-border px-3 py-2"><span className="mr-2 font-semibold text-fg">04</span>Rückgabe in die erzählerische Form, nicht in reine Stichpunkte</li>
          </ol>
        </div>
      </div>

      <div className="rounded-md border border-border px-5 py-4 text-sm leading-relaxed text-muted-fg">
        <p className="font-semibold text-fg">Kanonische Grenze</p>
        <p className="mt-1">Der Pakt unter der Kapelle bleibt verborgen, bis die Reihe Das Kesseljahr ihn über die Gasse, Ilse Brandtners Liste und das Gewölbe öffnet. Die Werkstatt zeigt diese Grenze an jeder Stelle, an der eine Seite bearbeitet wird.</p>
      </div>
    </div>
  );
}

function KontextPanel({ szene, auflage, bereich }: { szene: SceneView | null; auflage: WeltAuflage; bereich: Bereich }) {
  const statusText = auflageLeer(auflage) ? "Kanon" : "Lokale Auflage";
  const statusTone = auflageLeer(auflage) ? "text-ok" : "text-warn";

  return (
    <aside className="hidden self-start lg:sticky lg:top-24 lg:block" aria-label="Arbeitskontext">
      <div className="grid gap-3">
        <section className="rounded-md border border-border bg-surface/40 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Arbeitskontext</p>
          <p className="mt-3 text-xs text-subtle-fg">Bereich</p>
          <p className="text-sm font-semibold text-fg">{BEREICHE.find((item) => item.id === bereich)?.titel}</p>
          <p className="mt-3 text-xs text-subtle-fg">Ausgewählte Seite</p>
          <p className="mt-1 text-sm leading-snug text-fg">{szene?.title ?? "Keine Seite"}</p>
          <p className="mt-3 text-xs text-subtle-fg">Speicherstand</p>
          <p className={`mt-1 text-sm font-semibold ${statusTone}`}>{statusText}</p>
          {szene?.id ? <p className="mt-2 break-all font-mono text-[10px] text-subtle-fg">{szene.id}</p> : null}
        </section>

        <section className="rounded-md border border-border bg-surface/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Aktionskette</p>
          <div className="mt-2 grid gap-1.5 text-xs text-muted-fg">
            <div className="rounded-sm border border-border bg-surface/50 px-2 py-1.5">1. Befund lesen</div>
            <div className="rounded-sm border border-border bg-surface/50 px-2 py-1.5">2. Schuld prüfen</div>
            <div className="rounded-sm border border-border bg-surface/50 px-2 py-1.5">3. Perspektive sichern</div>
            <div className="rounded-sm border border-border bg-surface/50 px-2 py-1.5">4. Questfluss validieren</div>
          </div>
        </section>

        <section className="rounded-md border border-border bg-surface/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Feature-Lane</p>
          <div className="mt-2 grid gap-2">
            {FEATURE_MODULE.map((entry) => (
              <div key={entry.titel} className="rounded-sm border border-border bg-surface/50 px-2 py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-fg">{entry.titel}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${entry.farbe === "gold" ? "bg-[#d6a866]" : entry.farbe === "amber" ? "bg-[#d9b36d]" : entry.farbe === "olive" ? "bg-[#8aa174]" : "bg-[#ca7d56]"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-border bg-surface/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Weltwissen</p>
          <div className="mt-2 grid gap-1">
            {[
              ["Lore-Index", WIKI_LINKS.lore],
              ["Orte", WIKI_LINKS.orte],
              ["Figuren", WIKI_LINKS.npc],
              ["Wissenstafeln", WIKI_LINKS.wissen],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="rounded-sm px-2 py-1.5 text-xs text-muted-fg hover:bg-surface-2 hover:text-fg">
                {label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

function SozialeAnkerWerkstatt() {
  const [anker, setAnker] = useState(() => ladeSozialanker());
  const [wahl, setWahl] = useState(anker[0]?.id ?? "");
  const [entwurf, setEntwurf] = useState<Sozialanker>(() => anker[0] ?? leererSozialanker());
  const [meldung, setMeldung] = useState<string | null>(null);
  const ausgewaehlt = anker.find((eintrag) => eintrag.id === wahl);

  function waehle(id: string) {
    const next = anker.find((eintrag) => eintrag.id === id);
    if (!next) return;
    setWahl(id);
    setEntwurf(next);
    setMeldung(null);
  }

  function speichern() {
    const id = entwurf.id.trim() || entwurf.name.trim().toLocaleLowerCase("de-DE").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const parsed = { ...entwurf, id, name: entwurf.name.trim(), szeneId: entwurf.szeneId.trim() };
    if (!SozialankerSchema.safeParse(parsed).success || istKanonanker(id)) {
      setMeldung("Ein Anker braucht Kennung, Name, Szenenkennung und eine gültige Rangschwelle.");
      return;
    }
    speichereSozialanker(parsed);
    setAnker(ladeSozialanker());
    setWahl(id);
    setEntwurf(parsed);
    setMeldung("Der soziale Anker ist lokal gespeichert und kann an einer Dialog- oder Probeentscheidung verwendet werden.");
  }

  return (
    <Arbeitsflaeche titel="Soziale Anker" beschreibung="Binde Rang und Milieu an eine konkrete Dialog- oder Würfeloption. Kanonische Anker bleiben sichtbar; eigene Anker werden lokal für die Spielleitung gespeichert.">
      <div className="grid gap-5 xl:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)]">
        <div className="grid content-start gap-2">
          <div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.16em] text-muted-fg">Anker im Bestand</p><Button type="button" variant="secondary" className="h-9 px-2 text-xs" onClick={() => { setWahl(""); setEntwurf(leererSozialanker()); }}>Neu</Button></div>
          <div className="grid gap-1 rounded-sm border border-border p-1">
            {anker.map((eintrag) => <button key={eintrag.id} type="button" onClick={() => waehle(eintrag.id)} className={`rounded-sm px-3 py-2 text-left text-sm ${wahl === eintrag.id ? "bg-surface-2 text-fg" : "text-muted-fg hover:bg-surface"}`}><span className="block">{eintrag.name}</span><span className="block text-xs text-subtle-fg">{eintrag.erforderlicherRang} · {eintrag.ausloeser}</span></button>)}
          </div>
        </div>
        <div className="grid gap-3">
          <div className="border-b border-border pb-3"><p className="font-display text-2xl font-semibold">{ausgewaehlt?.name ?? "Neuer sozialer Anker"}</p><p className="text-xs text-muted-fg">{ausgewaehlt && istKanonanker(ausgewaehlt.id) ? "Kanonischer Anker · nur als Bezugspunkt" : "Autorenmaterial · lokal gespeichert"}</p></div>
          <div className="grid gap-3 sm:grid-cols-2"><Feld label="Name" value={entwurf.name} onChange={(name) => setEntwurf({ ...entwurf, name })} /><Feld label="Kennung" value={entwurf.id} onChange={(id) => setEntwurf({ ...entwurf, id })} /><Feld label="Szenenkennung" value={entwurf.szeneId} onChange={(szeneId) => setEntwurf({ ...entwurf, szeneId })} /><label className="block text-xs text-muted-fg">Auslöser<select className="mt-1 h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg" value={entwurf.ausloeser} onChange={(event) => setEntwurf({ ...entwurf, ausloeser: event.target.value as Sozialanker["ausloeser"] })}><option value="dialog">Dialogoption</option><option value="probe">Würfelprobe</option></select></label><label className="block text-xs text-muted-fg">Erforderlicher Rang<select className="mt-1 h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg" value={entwurf.erforderlicherRang} onChange={(event) => setEntwurf({ ...entwurf, erforderlicherRang: event.target.value as Sozialanker["erforderlicherRang"] })}><option>Messing</option><option>Silber</option><option>Gold</option></select></label><label className="block text-xs text-muted-fg">Belohnung<select className="mt-1 h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg" value={entwurf.belohnung} onChange={(event) => setEntwurf({ ...entwurf, belohnung: event.target.value as Sozialanker["belohnung"] })}><option value="zugang">Zusätzlicher Zugang</option><option value="wissen">Wissen</option><option value="weg">Neuer Weg</option><option value="ansehen">Ansehen</option></select></label></div>
          <Feld label="Was bekommt der Spieler an dieser Wahl?" value={entwurf.beschreibung} onChange={(beschreibung) => setEntwurf({ ...entwurf, beschreibung })} mehrzeilig />
          <div className="flex flex-wrap items-center gap-3"><Button type="button" onClick={speichern} disabled={Boolean(ausgewaehlt && istKanonanker(ausgewaehlt.id))}>Anker speichern</Button><span className="text-xs text-muted-fg">Die Spielleitung bindet ihn anschließend an die genannte Szene.</span></div>
          {meldung ? <Meldung text={meldung} /> : null}
        </div>
      </div>
    </Arbeitsflaeche>
  );
}

function FigurenWerkstatt() {
  const [figuren, setFiguren] = useState(() => ladeWerkstattFiguren());
  const [wahl, setWahl] = useState(figuren[0]?.id ?? "");
  const [entwurf, setEntwurf] = useState<WerkstattFigur>(() => figuren[0] ?? leereWerkstattFigur());
  const [meldung, setMeldung] = useState<string | null>(null);
  const figur = figuren.find((eintrag) => eintrag.id === wahl);

  function waehle(id: string) {
    const next = figuren.find((eintrag) => eintrag.id === id);
    if (!next) return;
    setWahl(id);
    setEntwurf(next);
    setMeldung(null);
  }

  function neu() {
    setWahl("");
    setEntwurf(leereWerkstattFigur());
    setMeldung("Ein neuer Entwurf liegt bereit. Er wird erst durch Speichern Teil deiner Werkstatt.");
  }

  function speichern() {
    const id = entwurf.id.trim() || entwurf.name.trim().toLocaleLowerCase("de-DE").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!id || !entwurf.name.trim() || istKanonfigur(id)) {
      setMeldung("Eine neue Figur braucht einen eigenen Namen und eine freie Kennung.");
      return;
    }
    const next = { ...entwurf, id, name: entwurf.name.trim() };
    speichereWerkstattFigur(next);
    const alle = ladeWerkstattFiguren();
    setFiguren(alle);
    setWahl(id);
    setEntwurf(next);
    setMeldung("Figur als Autorenmaterial gespeichert. Sie verändert den laufenden Spieltext noch nicht.");
  }

  return (
    <Arbeitsflaeche titel="Figurenwerkstatt" beschreibung="Kanonfiguren bleiben als Leitplanken sichtbar. Neue Figuren kannst du hier mit Ort, Weltbild, Angst, Ziel und Notizen anlegen.">
      <div className="grid gap-5 xl:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)]">
        <div>
          <div className="mb-2 flex items-center justify-between"><p className="text-xs uppercase tracking-[0.16em] text-muted-fg">Figuren im Bestand</p><Button type="button" variant="secondary" className="h-9 px-2 text-xs" onClick={neu}><Plus className="size-3.5" aria-hidden />Neu</Button></div>
          <div className="grid max-h-[32rem] gap-1 overflow-y-auto rounded-sm border border-border p-1">
            {figuren.map((eintrag) => <button key={eintrag.id} type="button" onClick={() => waehle(eintrag.id)} className={`rounded-sm px-3 py-2 text-left text-sm ${wahl === eintrag.id ? "bg-surface-2 text-fg" : "text-muted-fg hover:bg-surface"}`}><span className="block">{eintrag.name}</span><span className="block text-xs text-subtle-fg">{eintrag.rolle || "Entwurf"}</span></button>)}
          </div>
        </div>
        <div className="grid gap-3">
          <div className="border-b border-border pb-3"><p className="font-display text-2xl font-semibold">{figur?.name ?? "Neue Figur"}</p><p className="text-xs text-muted-fg">{figur && istKanonfigur(figur.id) ? "Kanonische Figur · nur als Bezugspunkt" : "Autorenmaterial · lokal gespeichert"}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Feld label="Name" value={entwurf.name} onChange={(name) => setEntwurf({ ...entwurf, name })} />
            <Feld label="Rolle" value={entwurf.rolle} onChange={(rolle) => setEntwurf({ ...entwurf, rolle })} />
            <Feld label="Ort" value={entwurf.ort} onChange={(ort) => setEntwurf({ ...entwurf, ort })} />
            <Feld label="Kennung" value={entwurf.id} onChange={(id) => setEntwurf({ ...entwurf, id })} />
          </div>
          <Feld label="Weltbild" value={entwurf.weltbild} onChange={(weltbild) => setEntwurf({ ...entwurf, weltbild })} mehrzeilig />
          <div className="grid gap-3 sm:grid-cols-2"><Feld label="Angst" value={entwurf.angst} onChange={(angst) => setEntwurf({ ...entwurf, angst })} mehrzeilig /><Feld label="Ziel" value={entwurf.ziel} onChange={(ziel) => setEntwurf({ ...entwurf, ziel })} mehrzeilig /></div>
          <Feld label="Notizen für die Geschichte" value={entwurf.notizen} onChange={(notizen) => setEntwurf({ ...entwurf, notizen })} mehrzeilig />
          <div className="flex flex-wrap items-center gap-3"><Button type="button" onClick={speichern} disabled={Boolean(figur && istKanonfigur(figur.id))}>Figur speichern</Button><span className="text-xs text-muted-fg">Kanonfiguren werden nicht überschrieben.</span></div>
          {meldung ? <Meldung text={meldung} /> : null}
        </div>
      </div>
    </Arbeitsflaeche>
  );
}

function OrteWerkstatt({ onSzene }: { onSzene: (id: string, bereich?: Bereich) => void }) {
  return <Arbeitsflaeche titel="Orte des Tals" beschreibung="Das Ortsbild folgt dem Spielbestand. Öffne eine zugehörige Seite, wenn du die Geschichte an diesem Ort bearbeiten willst."><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{WELTBILD.map((ort) => <article key={ort.id} className="rounded-md border border-border bg-surface/40 p-4"><div className="flex items-start justify-between gap-3"><h2 className="font-display text-xl font-semibold">{ort.name}</h2><MapPinned className="size-4 text-accent" aria-hidden /></div><p className="mt-2 text-sm leading-relaxed text-muted-fg">{ort.funktion}</p><div className="mt-4 flex flex-wrap gap-1.5">{ort.szenen.slice(0, 3).map((id) => <button key={id} type="button" onClick={() => onSzene(id, "szenen")} className="rounded-sm border border-border px-2 py-1 text-xs text-muted-fg hover:text-fg">{viewAusKanon(id)?.title ?? id}</button>)}</div></article>)}</div></Arbeitsflaeche>;
}

function Szenenliste({ knoten, suche, onSuche, ausgewaehlt, onAuswahl }: { knoten: ReturnType<typeof baueWeltGraph>["knoten"]; suche: string; onSuche: (value: string) => void; ausgewaehlt: string; onAuswahl: (id: string) => void }) {
  return <div className="grid gap-2 self-start"><label className="text-xs text-muted-fg">Seite suchen<input className="mt-1 h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg" value={suche} onChange={(event) => onSuche(event.target.value)} placeholder="Titel, Reihe oder Kennung" /></label><div className="max-h-[min(42rem,65vh)] overflow-y-auto rounded-sm border border-border">{knoten.map((eintrag) => <button key={eintrag.id} type="button" onClick={() => onAuswahl(eintrag.id)} className={`block w-full border-b border-border/60 px-3 py-2 text-left ${ausgewaehlt === eintrag.id ? "bg-surface-2 text-fg" : "text-muted-fg hover:bg-surface"}`}><span className="block truncate text-sm">{eintrag.titel}</span><span className="block truncate text-xs text-subtle-fg">{eintrag.questTitel} · {eintrag.teilTitel}</span></button>)}</div></div>;
}

function Arbeitsflaeche({ titel, beschreibung, children }: { titel: string; beschreibung: string; children: React.ReactNode }) {
  return <div><div className="mb-5 border-b border-border pb-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Spielleiter-Bereich</p><h2 className="mt-1 font-display text-3xl font-semibold">{titel}</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-fg">{beschreibung}</p></div>{children}</div>;
}

function Feld({ label, value, onChange, mehrzeilig = false }: { label: string; value: string; onChange: (value: string) => void; mehrzeilig?: boolean }) {
  return <label className="block text-xs text-muted-fg">{label}{mehrzeilig ? <textarea className="mt-1 min-h-24 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm leading-relaxed text-fg" value={value} onChange={(event) => onChange(event.target.value)} /> : <input className="mt-1 h-11 w-full rounded-sm border border-border bg-surface px-3 text-sm text-fg" value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function Zahl({ wert, label, warnung = false }: { wert: number; label: string; warnung?: boolean }) {
  return <div className="rounded-md border border-border bg-surface/50 px-4 py-3"><p className={`font-display text-3xl font-semibold ${warnung ? "text-warn" : "text-fg"}`}>{wert}</p><p className="text-xs uppercase tracking-[0.12em] text-muted-fg">{label}</p></div>;
}

function Meldung({ text }: { text: string }) {
  return <p className="rounded-sm border border-border bg-surface/50 px-3 py-2 text-xs text-muted-fg">{text}</p>;
}

function LeereAuswahl() {
  return <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-fg">Wähle eine Seite aus dem Katalog.</div>;
}
