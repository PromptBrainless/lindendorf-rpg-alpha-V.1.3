import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";
import { useFokusFang } from "@/game/fokus-fang";

type BereichId =
  | "uebersicht"
  | "geschichte"
  | "szenen"
  | "figuren"
  | "wissen"
  | "orte"
  | "quest"
  | "anker"
  | "spieler"
  | "wiki"
  | "studio"
  | "pruefen";

type Schritt = {
  titel: string;
  bereich?: BereichId;
  text: string;
  tun: string[];
};

const SCHLUESSEL = "lindendorf.spielleiter.anleitung.gesehen";

const SCHRITTE: Schritt[] = [
  {
    titel: "Zwei Räume, ein Passwort",
    text: "Die Werkstatt liegt unter /editor und öffnet sich erst nach dem Spielleiter-Passwort. Im laufenden Spiel schaltest du denselben Zugang über SL ein. Das Menü darf danach zu. Die Bearbeitung bleibt an, bis du SL wieder ausstellst. Der Knopf Werkstatt im Weltwerkzeug bringt dich hierher.",
    tun: [
      "Im Spiel: SL einschalten, Passwort eingeben, Menü schließen. Anfassen bleibt nutzbar.",
      "Hier: die linke Leiste ist die ganze Werkstatt. Overlay wiederholt nur die fünf Schnellwege.",
    ],
  },
  {
    titel: "Kanon und Auflage",
    bereich: "szenen",
    text: "Der Kanon ist der mitgelieferte Text. Eine Auflage ist deine Fassung auf diesem Gerät. Sie ersetzt die Seite für den Helden, schreibt den Kanon aber nicht um. Rechts steht, welche Seite gewählt ist und ob dort Kanon oder Auflage liegt. Eine Stufe zurück holt die vorige Auflage. Zurück auf Kanon löscht sie.",
    tun: [
      "Seite wählen, Text ändern, Status rechts prüfen.",
      "Rückgängig nimmt eine Stufe. Kanon zurück nimmt die Auflage ganz weg.",
    ],
  },
  {
    titel: "Übersicht",
    bereich: "uebersicht",
    text: "Die Übersicht zählt Questreihen, Seiten, auffällige Texte und Orte. Der Schnellzugriff öffnet die Ankunftsseiten direkt in den Szenen. Die Karten darunter springen in Geschichte, Figuren, Wissen und Questpfade. Sie ändern nichts.",
    tun: ["Zahlen lesen. Eine Ankunftsseite antippen. Erst dann schreiben."],
  },
  {
    titel: "Geschichte",
    bereich: "geschichte",
    text: "Links wählst du die Seite. Das Feld Eingabe ist ihr Text. Ein Hinweis sagt Grok, was an dieser Seite fehlen soll, nicht an der ganzen Quest. Der Vorschlag liegt rechts und ist noch nicht im Spiel. Erst Auf die Karte legen merkt ihn als Auflage. Die Stimme nimmst du selbst auf. Lore-Fakten unter dem Feld sind Spielleiterwissen und gehören nicht in den Spielertext.",
    tun: [
      "Seite wählen, Hinweis setzen, formulieren lassen.",
      "Vorschlag lesen. Nur wenn er die Seite meint: als Auflage legen.",
    ],
  },
  {
    titel: "Szenen: Seite finden",
    bereich: "szenen",
    text: "Links suchst du nach Titel, Questreihe oder Kennung. Ein Klick lädt die Karte rechts. Oben steht Kanon oder Auflage und die Szenenkennung. Hängt die Seite nur am Wortlaut und nicht an einer festen Kennung, warnt die Karte: die Auflage gilt nur, solange der Satz gleich bleibt.",
    tun: [
      "Seite suchen und anklicken. Die Kennung unten auf der Karte mit der Liste vergleichen.",
      "Rechts im Arbeitskontext prüfen, ob diese Seite schon eine lokale Auflage hat.",
    ],
  },
  {
    titel: "Szenen: Bild, Porträt, Stimme",
    bereich: "szenen",
    text: "Bild und Porträt sind zuerst Schlüssel aus dem vorhandenen Bestand. Keins nimmt das Porträt weg. Darunter liegen zwei eigene Dateien: Text zu Bild und Porträt. Beide gelten nur als Auflage, nicht als neuer Kanon. Die Stimme gehört zur gewählten Porträtfigur. Du nimmst mehrere Züge auf, sie spielen in dieser Reihenfolge. Ein Porträt setzt du nur, wenn diese Person auf der Seite spricht.",
    tun: [
      "Schlüssel wählen, wenn das Bild schon im Spiel liegt.",
      "Galerie öffnet die Bilder auf dem Telefon. Danach die Vorschau prüfen. Das Bild gilt nur als Auflage.",
      "Stimme zur Figur aufnehmen, nicht zur ganzen Quest.",
    ],
  },
  {
    titel: "Szenen: Text, Wahlen, Zustände",
    bereich: "szenen",
    text: "Der Text speichert Absätze. Eine Leerzeile trennt sie. Ein einzelner Zeilenumbruch in einem Absatz wird beim Speichern zu einem Leerzeichen. Die Zahl der Wahlen ist fest. Du kannst den Wortlaut ändern, keine vierte Wahl anlegen und keine streichen. Gunst und Last gibt diese Karte dem Helden. Beim Gehen nimmt sie einen Zustand wieder fort. Diff zeigt Titel, Absätze und Wahlen gegen den Kanon. Rückgängig holt eine Stufe, Auf Kanon löscht die Auflage dieser Seite.",
    tun: [
      "Absatz schreiben, Leerzeile, nächster Absatz. Diff öffnen, bevor du die Seite verlässt.",
      "Einen Zustand nur unter Gibt setzen, wenn der Held ihn hier bekommt. Fort nur, wenn er beim Verlassen endet.",
    ],
  },
  {
    titel: "Figuren: Bestand und Felder",
    bereich: "figuren",
    text: "Links steht der Bestand. Kanonfiguren wie Holm, Dennek, Vahl und Grovin sind Bezugspunkte. Bei ihnen ist Speichern aus. Neu leert das Formular. Name ist der sichtbare Name. Rolle ist Amt oder Arbeit. Ort ist, wo man sie trifft. Die Kennung bleibt leer, dann entsteht sie aus dem Namen. Weltbild, Angst und Ziel sind die drei Sätze, aus denen du später ihren Dialog schreibst. Die Notiz ist nur für dich.",
    tun: [
      "Eine Kanonfigur öffnen und die sieben Felder nur lesen.",
      "Neu. Name, Ort und Ziel setzen. Die Kennung frei lassen, außer du brauchst eine feste.",
    ],
  },
  {
    titel: "Figuren: was Speichern nicht tut",
    bereich: "figuren",
    text: "Figur speichern legt den Entwurf im Browser ab. Die Figur erscheint dadurch in keiner Szene, auf keinem Porträt und in keiner Probe. Damit sie im Spiel vorkommt, braucht eine Seite ihren Namen im Text und, wenn sie spricht, denselben Porträtschlüssel unter Szenen. Eine Kennung, die schon einer Kanonfigur gehört, wird abgelehnt.",
    tun: [
      "Speichern. Die Meldung muss sagen, dass der Spieltext unverändert ist.",
      "Danach unter Szenen die Seite öffnen, auf der sie auftreten soll, und Name plus Porträt dort setzen.",
    ],
  },
  {
    titel: "Wissen",
    bereich: "wissen",
    text: "Jede Tafel hängt an einer Szenenkennung und optional an einem Wissensanker. Titel und Text müssen stehen, sonst speichert sie nicht. Speichern schreibt zuerst in den Browser und versucht danach die Datei abzulegen. Schlägt das Ablegen fehl, bleibt die Tafel nur auf diesem Gerät. Eine Tafel erscheint dem Spieler beim Verlassen der Information, nicht schon beim Eintreten.",
    tun: ["Tafel suchen, Text in Sätzen schreiben, Bild prüfen, dann speichern."],
  },
  {
    titel: "Orte",
    bereich: "orte",
    text: "Das Ortsbild folgt dem Spiel, nicht einer zweiten Karte. Jede Karte nennt, wozu der Ort da ist, und öffnet bis zu drei Seiten, die dort spielen. Von dort arbeitest du in den Szenen weiter.",
    tun: ["Ort lesen. Eine genannte Seite öffnen, statt den Ort selbst umzubenennen."],
  },
  {
    titel: "Questpfade",
    bereich: "quest",
    text: "Drei Unterfächer. Pfade schicken einen Testhelden durch die eingetragenen Wege und sagen, ob der Weg sicher, offen oder an Wissen gebunden ist. Ablauf zeigt tote Knoten im Übersichtsgraphen. Herkunft sind die zehn Lagen vor dem Spiel. Ein toter Knoten im echten Skript fällt nur auf, wenn der Übersichtsgraph ihn noch enthält.",
    tun: ["Einen Pfad laufen lassen. Danach den Ablauf prüfen. Herkunft nur anfassen, wenn die Lage selbst falsch ist."],
  },
  {
    titel: "Soziale Anker",
    bereich: "anker",
    text: "Ein Anker bindet Messing, Silber oder Gold an eine Dialog- oder Probeoption in einer genannten Szene. Die Belohnung ist Zugang, Wissen, ein Weg oder Ansehen. Der Anker Amtliche Anhörung im Rathaus ist Kanon und nur zum Lesen. Eigene Anker speicherst du lokal. Sie gelten, wenn die Szene diese Kennung auch wirklich abfragt.",
    tun: ["Szenenkennung aus der Seitenliste nehmen. Rang, Auslöser und Satz speichern. Kanonanker nicht überschreiben."],
  },
  {
    titel: "Partien",
    bereich: "spieler",
    text: "Hier liegen die Spielstände dieses Browsers. Du kannst einen Stand ansehen, exportieren, eine Standdatei importieren oder löschen. Löschen fragt noch einmal. Die Werkstatt selbst lädt die Partie nicht in den Heldensitz um. Das tut das Weltwerkzeug im laufenden Spiel.",
    tun: ["Stand öffnen und nur lesen, bevor du ihn löschst. Export sichert die Datei außerhalb des Browsers."],
  },
  {
    titel: "Wiki auf dem Gerät",
    bereich: "wiki",
    text: "Wiki öffnet die Einträge in der App, nicht auf GitHub. Du suchst die Seite, änderst den Text und speicherst. Die Fassung bleibt auf diesem Telefon. Mitgelieferte Fassung holt den ursprünglichen Text zurück. Das Projekt-Wiki ändert sich dadurch nicht.",
    tun: ["Eintrag suchen, Text ändern, Eintrag speichern.", "Auf GitHub nur schauen, wenn du die ursprüngliche Datei vergleichen willst."],
  },
  {
    titel: "Studio",
    bereich: "studio",
    text: "Das Studio ist ein leeres Arbeitsheft: Welten, Orte, Figuren, Quests, Dialoge, Wissen. Aus Lindendorf übernehmen kopiert Szenen, Figuren und Wissen als Einträge hierher. Es schreibt nichts in den Kanon zurück. Export und Import sind eine JSON-Datei dieses Hefts.",
    tun: ["Erst übernehmen, wenn du ein Heft willst. Danach nur im Studio weiterschreiben."],
  },
  {
    titel: "Prüfen",
    bereich: "pruefen",
    text: "Oben liegt die Kampagne: welche Seiten der Katalog trägt. Darunter die Prüfung der gewählten Seite: Abweichung vom Kanon, tote Wege, Textlänge und ob Spielleiterwissen in die Heldensicht gerutscht ist. Eine Auflage, die den Pakt vor dem Kesseljahr ausspricht, gehört hier gestrichen.",
    tun: ["Seite wählen. Befund lesen. Erst danach in Geschichte oder Szenen korrigieren."],
  },
  {
    titel: "Im Spiel, auf der Bühne",
    text: "Bei offenem Spielleiter kannst du den sichtbaren Text, das Bild, das Porträt und eine Probe direkt an der Szene anfassen. Das schreibt dieselbe Auflage wie die Karte hier. Wissen, das der Held gerade bekommt, und eine abgeschlossene Quest zeigt das Spiel kurz im Fokus. Die Werkstatt ist der Ort, an dem du dieselben Seiten mit Liste, Vergleich und Prüfung bearbeitest.",
    tun: [
      "Kleine Korrektur an der Bühne. Längere Fassung in Geschichte.",
      "Vor dem nächsten Spiel einmal Prüfen laufen lassen.",
    ],
  },
];

export function SpielleiterAnleitung({ onBereich }: { onBereich: (bereich: BereichId) => void }) {
  const [offen, setOffen] = useState(false);
  const [folge, setFolge] = useState(false);
  const [index, setIndex] = useState(0);
  const fang = useFokusFang(offen && !folge);
  const schritt = SCHRITTE[index]!;

  useEffect(() => {
    try {
      if (window.localStorage.getItem(SCHLUESSEL) !== "1") setOffen(true);
    } catch {
      setOffen(true);
    }
  }, []);

  useEffect(() => {
    if (!offen) return;
    function zu(event: KeyboardEvent) {
      if (event.key === "Escape") schliessen();
      if (event.key === "ArrowRight") setIndex((wert) => Math.min(SCHRITTE.length - 1, wert + 1));
      if (event.key === "ArrowLeft") setIndex((wert) => Math.max(0, wert - 1));
    }
    window.addEventListener("keydown", zu);
    return () => window.removeEventListener("keydown", zu);
  }, [offen]);

  function schliessen() {
    setOffen(false);
    setFolge(false);
    try {
      window.localStorage.setItem(SCHLUESSEL, "1");
    } catch {
      /* bleibt nur für diese Sitzung zu */
    }
  }

  function zeigen() {
    if (!schritt.bereich) return;
    onBereich(schritt.bereich);
    setFolge(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOffen(true);
          setFolge(false);
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border px-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
      >
        <CircleHelp className="size-3.5" aria-hidden />
        Anleitung
      </button>
      {offen && folge ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[#110d09]/95 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <p className="min-w-0 text-sm text-fg">
              <span className="mr-2 text-xs uppercase tracking-[0.14em] text-accent">
                {index + 1}/{SCHRITTE.length}
              </span>
              {schritt.titel}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="h-9 rounded-sm border border-border px-3 text-sm" onClick={() => setFolge(false)}>
                Text
              </button>
              <button type="button" className="h-9 rounded-sm border border-border px-3 text-sm" disabled={index === 0} onClick={() => setIndex((wert) => wert - 1)}>
                Zurück
              </button>
              <button
                type="button"
                className="h-9 rounded-sm bg-accent px-3 text-sm text-accent-fg"
                onClick={() => (index === SCHRITTE.length - 1 ? schliessen() : setIndex((wert) => wert + 1))}
              >
                {index === SCHRITTE.length - 1 ? "Fertig" : "Weiter"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {offen && !folge ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 sm:items-center">
          <div
            ref={fang}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sl-anleitung-titel"
            className="max-h-[min(40rem,calc(100vh-2rem))] w-full max-w-xl overflow-y-auto rounded-md border border-border bg-[#110d09] p-5 shadow-2xl"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              Spielleiter · Schritt {index + 1} von {SCHRITTE.length}
            </p>
            <h2 id="sl-anleitung-titel" className="mt-2 font-display text-3xl font-semibold">
              {schritt.titel}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-fg">{schritt.text}</p>
            <ol className="mt-4 grid gap-2 text-sm text-fg">
              {schritt.tun.map((satz) => (
                <li key={satz} className="rounded-sm border border-border px-3 py-2">
                  {satz}
                </li>
              ))}
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              {schritt.bereich ? (
                <button type="button" className="h-11 rounded-sm bg-accent px-4 text-sm text-accent-fg" onClick={zeigen}>
                  Bereich zeigen
                </button>
              ) : null}
              <button type="button" className="h-11 rounded-sm border border-border px-4 text-sm" disabled={index === 0} onClick={() => setIndex((wert) => wert - 1)}>
                Zurück
              </button>
              <button
                type="button"
                className="h-11 rounded-sm border border-border px-4 text-sm"
                onClick={() => (index === SCHRITTE.length - 1 ? schliessen() : setIndex((wert) => wert + 1))}
              >
                {index === SCHRITTE.length - 1 ? "Fertig" : "Weiter"}
              </button>
              <button type="button" className="h-11 rounded-sm px-3 text-sm text-muted-fg" onClick={schliessen}>
                Schließen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
