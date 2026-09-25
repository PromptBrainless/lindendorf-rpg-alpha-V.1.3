import { useMemo, useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ART, lageBild } from "@/game/art";
import { EFFEKTE, werteMitEffekt } from "@/game/effekte";
import {
  baueHeldAusHerkunft,
  LAGE_ZUG_ANZAHL,
  neueLageSaat,
  urteilAusrichtung,
  zieheLagen,
  type HerkunftArt,
  type HerkunftFrage,
} from "@/game/herkunft";
import { peekSaveForName } from "@/game/save";
import { sichtbareHerkunft } from "@/game/welt";
import { charakterAusLagen, klasseMitId, karriereMitId, type Charakterwahlmodus } from "@/game/charakter";
import type { Held } from "@/game/types";

export function CreateHero({
  onReady,
  onBack,
  onWelt,
  onSystem,
  onLoadName,
}: {
  onReady: (held: Held) => void;
  onBack: () => void;
  onWelt: () => void;
  onSystem?: () => void;
  onLoadName?: (name: string) => boolean;
}) {
  const [name, setName] = useState("");
  const [schritt, setSchritt] = useState(-1);
  const [antworten, setAntworten] = useState<number[]>([]);
  const [rueck, setRueck] = useState(false);
  const [saat, setSaat] = useState(0);
  const [zug, setZug] = useState<string[]>([]);
  const [wahlmodus, setWahlmodus] = useState<Charakterwahlmodus>("lagen");

  const alle = sichtbareHerkunft();
  const fragen = useMemo(() => {
    if (!zug.length) return [] as HerkunftFrage[];
    const nachId = new Map(alle.map((frage) => [frage.id, frage]));
    return zug.map((id) => nachId.get(id)).filter((frage): frage is HerkunftFrage => Boolean(frage));
  }, [alle, zug]);
  const frage = schritt >= 0 && schritt < fragen.length && !rueck ? fragen[schritt] : undefined;
  const fertig = fragen.length === LAGE_ZUG_ANZAHL && antworten.length >= fragen.length && !rueck;
  const charakter = fertig
    ? charakterAusLagen(
        antworten.map((wahl, i) => ({ id: fragen[i]!.id, art: fragen[i]!.antworten[wahl]!.art })),
        saat,
        wahlmodus,
      )
    : undefined;
  const standHeld = antworten.length ? baueHeldAusHerkunft(name, antworten, fragen, saat, charakter) : null;
  const grundHeld = schritt >= 0 ? baueHeldAusHerkunft(name, [], fragen, saat, charakter) : null;
  const held = fertig ? standHeld : null;
  const vorhandenerStand = useMemo(() => peekSaveForName(name), [name]);
  const hintergrund = fertig ? ART.village : frage ? lageBild(frage.id) || ART.road : ART.road;
  const letzteFrage = rueck ? fragen[antworten.length - 1] : undefined;
  const letzteAntwort = letzteFrage?.antworten[antworten[antworten.length - 1] ?? -1];

  function starteLagen() {
    const neu = neueLageSaat(name);
    const gezogen = zieheLagen(alle, neu, LAGE_ZUG_ANZAHL);
    setSaat(neu);
    setZug(gezogen.map((frage) => frage.id));
    setAntworten([]);
    setRueck(false);
    setSchritt(0);
  }

  function waehle(index: number) {
    setAntworten([...antworten, index]);
    setRueck(true);
  }

  function weiter() {
    setRueck(false);
    setSchritt(antworten.length);
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden overflow-y-auto bg-bg text-fg">
      <img src={hintergrund} alt="" className="absolute inset-0 size-full object-cover grayscale" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/35" />
      <div
        className={`safe-bottom relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-8 ${
          schritt < 0 || fertig || rueck ? "justify-end sm:justify-center" : "justify-start pt-16 sm:justify-center"
        }`}
      >
        <div className="rounded-xl border border-border bg-ink/80 p-5 shadow-sm backdrop-blur-md sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Heldenerstellung</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
            {fertig
              ? "Charakterblatt — Lindendorf"
              : rueck
                ? letzteFrage?.titel ?? "Lage"
                : schritt < 0
                  ? "Aufbruch"
                  : frage?.titel ?? "Wer geht da"}
          </h1>

          {schritt < 0 ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-fg/90">
                In Lindendorf ist Klasse kein Volk und kein Rassenmerkmal, sondern das gesellschaftliche
                Milieu, aus dem du kommst: Akademiker, Bürger, Flussvolk, Freisassen, Gesetzlose,
                Höflinge, Krieger oder Landvolk. Die Karriere ist dein aktueller Beruf — der rollt in
                der Welt auf, bestimmt deinen Status und erklärt, warum du heute an diesem Ort stehst.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg/80">
                Drei von zehn Lagen liegen vor dem Tal. Jede Wahl lässt etwas zurück: Blut, Gold, einen
                Zustand, eine Schuld. Wenigstens drei Lebensentscheidungen bleiben an dir hängen, und am
                Ende spricht die Welt ein Urteil über dich — den Spiegeltext deines Standpunkts.
              </p>
              <div className="mt-3 rounded-md border border-border bg-surface/70 p-3 text-xs leading-relaxed text-fg/80">
                <p className="font-medium text-fg">Charaktergrundsatz</p>
                <p className="mt-1">
                  Warum ist dein Platz heute hier — und wer möchte, dass du dort bleibst? In Lindendorf
                  ist das die verbindliche Frage zwischen Klasse, Karriere, Herkunft und persönlicher
                  Entscheidung.
                </p>
              </div>
              <label className="mt-4 block text-sm text-muted-fg">
                Herkunft bestimmt deinen sozialen Weg
                <select
                  className="mt-1.5 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg"
                  value={wahlmodus}
                  onChange={(event) => setWahlmodus(event.target.value as Charakterwahlmodus)}
                >
                  <option value="lagen">An den drei Lagen orientieren</option>
                  <option value="zufall">Klasse und Beruf zufällig bestimmen</option>
                </select>
              </label>
              <p className="mt-2 text-xs text-muted-fg">
                Die Klasse und genau ein Beruf werden erst nach den drei Lagen festgelegt. Jede Karriere beginnt auf Stufe 1.
              </p>
              <label className="mt-5 block text-sm text-muted-fg" htmlFor="hero-name">
                Name
              </label>
              <Input
                id="hero-name"
                className="mt-1.5"
                placeholder="Namenlos"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={24}
                autoComplete="off"
              />
              {vorhandenerStand ? (
                <div className="mt-3 rounded-md border border-ok/30 bg-ok/10 px-3 py-2 text-sm">
                  <p className="text-ok">
                    Stand für {vorhandenerStand.name} gefunden
                    {vorhandenerStand.savedAt
                      ? ` · ${new Date(vorhandenerStand.savedAt).toLocaleString("de-DE")}`
                      : ""}
                    {` · LP ${vorhandenerStand.lp}`}
                  </p>
                  <Button
                    className="mt-2 w-full"
                    size="lg"
                    onClick={() => {
                      if (!onLoadName?.(vorhandenerStand.name)) return;
                    }}
                  >
                    Mit diesem Namen weiterspielen
                  </Button>
                </div>
              ) : null}
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Button size="lg" onClick={starteLagen}>
                  {vorhandenerStand ? "Neues Abenteuer" : "Die erste Lage"}
                </Button>
                <Button variant="secondary" size="lg" onClick={onBack}>
                  Zurück
                </Button>
              </div>
            </>
          ) : null}

          {frage ? (
            <>
              <p className="mt-1 text-xs text-muted-fg">
                Lage {schritt + 1} von {fragen.length}
                {grundHeld
                  ? ` · Grundwerte 2W6−2: Stärke ${grundHeld.staerke}, Geschick ${grundHeld.geschick}, Charisma ${grundHeld.charisma}`
                  : ""}
              </p>
              {lageBild(frage.id) ? (
                <figure className="mt-3 overflow-hidden rounded-md border border-border">
                  <img src={lageBild(frage.id)} alt="" className="h-44 w-full object-cover grayscale sm:h-56" />
                </figure>
              ) : null}
              <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-fg sm:text-base">
                {frage.geschichte.map((absatz) => (
                  <p key={absatz.slice(0, 28)}>{absatz}</p>
                ))}
              </div>
              <div className="mt-5 grid gap-2">
                {frage.antworten.map((antwort, index) => (
                  <Button
                    key={antwort.label}
                    type="button"
                    variant="choice"
                    size="choice"
                    onClick={() => waehle(index)}
                  >
                    {antwort.label}
                  </Button>
                ))}
              </div>
            </>
          ) : null}

          {rueck && standHeld && letzteAntwort ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-fg/90">{letzteAntwort.mal}</p>
              <StandBlock
                held={standHeld}
                lage={antworten.length}
                arten={antworten.map((wahl, i) => fragen[i]!.antworten[wahl]!.art)}
              />
              <Button className="mt-5 w-full" size="lg" onClick={weiter}>
                {antworten.length >= fragen.length ? "Das Blatt" : "Nächste Lage"}
              </Button>
            </>
          ) : null}

          {held ? (
            <Blatt
              held={held}
              antworten={antworten}
              fragen={fragen}
              onReady={() => onReady(held)}
              onReset={() => {
                setSchritt(-1);
                setAntworten([]);
                setRueck(false);
                setZug([]);
                setSaat(0);
              }}
            />
          ) : null}
        </div>
        {onSystem ? (
          <Button variant="secondary" className="mt-3 w-full" onClick={onSystem}>
            <Settings2 className="size-4" aria-hidden />
            Einstellungen
          </Button>
        ) : null}
        <Button variant="secondary" className="mt-3 w-full" onClick={onWelt}>
          Weltwerkzeug
        </Button>
      </div>
    </div>
  );
}

function StandBlock({
  held,
  lage,
  arten,
}: {
  held: Held;
  lage: number;
  arten: HerkunftArt[];
}) {
  const werte = werteMitEffekt(held);
  const zaehl = { gnade: 0, ordnung: 0, nutzen: 0 };
  for (const art of arten) zaehl[art] += 1;
  const namen = held.effekte.map((id) => EFFEKTE[id]?.name ?? id);
  const probe = [
    werte.staerke !== held.staerke ? `Stärke ${werte.staerke - held.staerke > 0 ? "+" : ""}${werte.staerke - held.staerke}` : null,
    werte.geschick !== held.geschick ? `Geschick ${werte.geschick - held.geschick > 0 ? "+" : ""}${werte.geschick - held.geschick}` : null,
    werte.charisma !== held.charisma ? `Charisma ${werte.charisma - held.charisma > 0 ? "+" : ""}${werte.charisma - held.charisma}` : null,
  ].filter(Boolean);
  return (
    <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-surface/70 px-3 py-2 font-mono text-xs leading-relaxed text-fg">
{`Stand nach Lage ${lage}
Grundwerte 2W6−2: Stärke ${held.staerke} · Geschick ${held.geschick} · Charisma ${held.charisma}
LP: ${held.lp}/10   Gold: ${held.gold}   Beutel: ${held.inventar.length ? held.inventar.join(", ") : "leer"}
Zustände (alt → neu): ${namen.length ? namen.join(" · ") : "—"}
Aktive Proben: ${probe.length ? probe.join(" · ") : "keine"}
Ausrichtung bisher: Gnade ${zaehl.gnade} · Ordnung ${zaehl.ordnung} · Nutzen ${zaehl.nutzen}`}
    </pre>
  );
}

function Blatt({
  held,
  antworten,
  fragen,
  onReady,
  onReset,
}: {
  held: Held;
  antworten: number[];
  fragen: ReturnType<typeof sichtbareHerkunft>;
  onReady: () => void;
  onReset: () => void;
}) {
  const werte = werteMitEffekt(held);
  const lesung = urteilAusrichtung(antworten.map((wahl, i) => fragen[i]!.antworten[wahl]!.art));
  return (
    <>
      <p className="mt-3 text-sm text-muted-fg">
        Ausrichtung: {lesung.name}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-fg/90">Spiegeltext: „{lesung.satz}“</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <InfoCard label="Klasse" value={held.klasse ? klasseMitId(held.klasse).name : "Nicht gewählt"} hint="Aus den drei Lagen oder zufällig bestimmt" />
        <InfoCard label="Karriere" value={karriereMitId(held.karriere ?? "")?.name ?? "Nicht gewählt"} hint={`Beruf jetzt · Stufe ${held.karriereStufe}`} />
        <InfoCard label="Status" value={`${held.statusRang} ${held.statusAnsehen}`} hint="Rang und Ansehen der ersten Karrierestufe" />
        <InfoCard label="Leitfrage" value="Warum bist du hier?" hint="Wer will, dass du bleibst, und wer hat dich schon verloren?" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label="Stärke" value={werte.staerke} basis={held.staerke} />
        <Stat label="Geschick" value={werte.geschick} basis={held.geschick} />
        <Stat label="Charisma" value={werte.charisma} basis={held.charisma} />
      </div>
      <p className="mt-3 text-xs text-muted-fg">Grundwerte sind 2W6−2. Die Zahl oben ist die Probe, Zustände liegen darauf.</p>
      <p className="mt-3 text-sm">
        LP {held.lp}/10 · Gold {held.gold} · EP {held.ep} · Glück {held.glueck} · Schicksal {held.schicksal} · Beutel {held.inventar.length ? held.inventar.join(", ") : "leer"}
      </p>
      {held.effekte.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {held.effekte.map((id) => {
            const item = EFFEKTE[id];
            const gunst = item.gruppe === "gunst";
            return (
              <span
                key={id}
                className={`rounded-xs border px-1.5 py-0.5 text-xs ${
                  gunst ? "border-ok/40 text-ok" : "border-hp/40 text-hp"
                }`}
              >
                {item.name} {item.hint}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-fg">Keine Zustände.</p>
      )}
      <ol className="mt-4 space-y-1 text-xs text-muted-fg">
        {fragen.map((frage, i) => (
          <li key={frage.id}>
            {i + 1}. {frage.titel} — {frage.antworten[antworten[i] ?? -1]?.label ?? "—"}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-fg/90">
        Der Charakter ist spielbereit. Er trägt ein Milieu, eine Berufsgeschichte, einen sozialen Rang
        und eine Schuld im Körper. So beginnt der Weg in Lindendorf: nicht als Rasse, sondern als
        gesellschaftliche Vergangenheit, die später im Tal wieder aufsteht.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button size="lg" onClick={onReady}>
          Nach Lindendorf
        </Button>
        <Button variant="secondary" size="lg" onClick={onReset}>
          Noch einmal
        </Button>
      </div>
    </>
  );
}

function Stat({ label, value, basis }: { label: string; value: number; basis: number }) {
  const delta = value - basis;
  return (
    <div className="rounded-md border border-border bg-surface/70 px-2 py-2">
      <p className="text-xs text-muted-fg">{label}</p>
      <p className={`font-display text-2xl tabular-nums ${delta > 0 ? "text-ok" : delta < 0 ? "text-hp" : ""}`}>
        {value}
      </p>
      {delta !== 0 ? (
        <p className={`text-xs ${delta > 0 ? "text-ok" : "text-hp"}`}>
          {delta > 0 ? `+${delta}` : delta} vom Grund {basis}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-md border border-border bg-surface/70 p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-fg">{label}</p>
      <p className="mt-1 font-medium text-fg">{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-fg/70">{hint}</p>
    </div>
  );
}
