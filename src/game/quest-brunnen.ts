import { goldPlus, nimm, probe, schaden } from "./engine";
import { vielleichtHeiltrank } from "./heal";
import {
  dennekCharismaSchwer,
  echoDruckDennek,
  echoGasseAmBrunnen,
  echoGrovinKenntMuehle,
  echoMuehleAmBrunnen,
} from "./reihe-versorgung";
import type { Runtime } from "./runtime";
import { HEILTRANK, LEICHT, MITTEL, SCHWER, tot, type Held } from "./types";

export async function dorfTruebesWasser(rt: Runtime, held: Held) {
  if (held.loesungswegBrunnen) {
    await brunnenNachspiel(rt, held);
    return;
  }

  const schonDrin = held.truebungBestaetigt || held.spurAmBrunnen || held.grovinGenannt;
  if (!schonDrin) {
    await rt.present({
      id: "brunnen-krug",
      title: "Der bittere Krug",
      art: "well",
      portrait: "dennek",
      held,
      lines: [
        "Der Wassereimer am Dorfbrunnen steht noch halb voll von der Nacht. Niemand hat sich heute Morgen die Mühe gemacht, ihn zu leeren und neu zu füllen — nicht vor dem Brot, nicht vor dem Vieh.",
        "Das Wasser hat die falsche Farbe: ein trübes Graubraun, wie aufgewühlter Teichgrund statt klarer, kalter Tiefe ohne Geschichte.",
        "Vor der Apotheke hustet ein Kind, trocken und hart, weil etwas Falsches in seiner Brust sitzt. Die Mutter hält es fester, weil das bloße Husten nicht genügt; ihr Griff dient ihrer eigenen Angst.",
        "Am Brunnenrand steht Ratsherr Dennek und rührt mit einem Stock im Eimer. Langsam. Im Kreis. Als ließe sich vergiftetes Wasser klären wie ein Brei, dem nur noch Geduld fehlt.",
        "Er sieht dabei niemanden an — weder das Kind noch die Mutter noch die Vorübergehenden. Als hoffe er, dass die Bewegung seiner Hand auch die Fragen im Kreis hält.",
      ],
    });
  }

  while (!tot(held) && !held.loesungswegBrunnen) {
    const grabenLabel = held.spurAmBrunnen
      ? "Dem Ablaufgraben zur Zisterne folgen"
      : held.grovinGenannt
        ? "Nach Grovins altem Bau am Waldrand suchen"
        : "Den Graben am Brunnenrand verfolgen";
    const items: { id: string; label: string }[] = [
      { id: "kern", label: "Mit Witwe Kern über das Wasser sprechen" },
      { id: "dennek", label: "Mit Ratsherr Dennek sprechen" },
      { id: "brunnen", label: "Den Brunnen selbst untersuchen" },
      { id: "graben", label: grabenLabel },
      { id: "dorf", label: "Zurück zum Dorfplatz" },
    ];
    const wahl = await rt.present({
      id: "brunnen-hub",
      title: "Trübes Wasser",
      art: "well",
      portrait: "dennek",
      held,
      lines: [
        "Das Wasser im Eimer bleibt trüb bis zum Grund. Es schmeckt nach Eisen, wenn der Wind vom Wald herüberzieht. Der Wind trägt einen Rest der Wahrheit, den man sonst nirgendwo finden kann.",
        held.truebungBestaetigt
          ? "Kern hat die Kranken namentlich benannt, einen nach dem anderen, mit der Genauigkeit einer Frau, die die überfüllten Betten im Dorf kennt. Dennek steht noch immer am Rand, unverändert. Er betrachtet den Brunnen als sein Eigentum. Für ihn ist die Sorge um das Wasser eine private Angelegenheit, nicht die des ganzen Dorfes."
          : "Kerns Tür steht einen Spalt offen. Sie scheint auf jemanden zu warten, der endlich eintritt. Dennek trommelt mit den Fingern auf die Brunnenmauer. Das Geräusch ist unruhig und klein, und es passt nicht zum Rühren im Eimer. Ein Mann hält etwas in seiner Zunge, das er noch nicht preisgeben will.",
        ...echoMuehleAmBrunnen(held),
        ...echoGasseAmBrunnen(held),
      ],
      choices: items.map((item) => item.label),
    });
    const id = items[wahl]?.id;
    if (id === "kern") await kernWasser(rt, held);
    else if (id === "dennek") await dennekGespraech(rt, held);
    else if (id === "brunnen") await brunnenUntersuchen(rt, held);
    else if (id === "graben") await ablaufgraben(rt, held);
    else return;
  }
}

async function brunnenNachspiel(rt: Runtime, held: Held) {
  if (held.loesungswegBrunnen === "bestochen") {
    await rt.present({
      title: "Am Brunnen",
      art: "well",
      portrait: null,
      held,
      lines: [
        "Das Wasser ist klar, doch es reicht nie für alle. Ein zweiter Eimer bleibt ungefüllt. Niemand fragt, wohin der Rest läuft.",
        ...echoMuehleAmBrunnen(held),
        ...echoGasseAmBrunnen(held),
      ],
    });
    return;
  }
  await rt.present({
    title: "Am Brunnen",
    art: "well",
    portrait: null,
    held,
    lines: [
      "Der Eimer ist wieder klar bis auf den Grund, wie man es sich schon lange nicht mehr zu hoffen getraut hatte.",
      held.dennekEntlarvt
        ? "Niemand im Dorf fragt laut nach dem Warum — nur Dennek selbst meidet den Brunnenrand. Die Finger haben nichts mehr, worauf sie trommeln könnten."
        : "Dennek steht noch da. Er rührt nicht mehr im Wasser. Er sieht auch nicht zu dir.",
      ...echoMuehleAmBrunnen(held),
      ...echoGasseAmBrunnen(held),
    ],
  });
}

export async function kernWasser(rt: Runtime, held: Held) {
  if (held.loesungswegBrunnen) {
    await rt.present({
      title: "Bei Witwe Kern",
      art: "apothecary",
      portrait: "kern",
      held,
      lines:
        held.loesungswegBrunnen === "bestochen"
          ? [
              "Kern wiegt weiterhin dieselbe Mischung ab, jedoch seltener. Eine Frau macht Pausen. Sie spürt, dass sich etwas geändert hat, doch sie kennt den Grund nicht.",
              "„Es reicht länger“, sagt sie. „Es reicht nicht.“ Sie sieht dich an. Ihr Blick verrät, dass sie glaubt, du wüsstest mehr. Das Dorf wird nie erfahren, was du weißt.",
            ]
          : [
              "Kern braut zum ersten Mal seit vielen Tagen etwas anderes als bloßes Fiebermittel. Es ist eine Mischung gegen Kopfschmerzen, vielleicht, oder ein Balsam für aufgeschürfte Haut. Kleine, fast vergessene Sorgen erhalten endlich wieder Raum.",
              "Sie fragt nicht, warum das Wasser plötzlich klar ist. Sie füllt ihre Flaschen, wenn niemand hustet, mit stiller Dankbarkeit jener, die gute Zeiten nicht durch Fragen gefährden.",
            ],
    });
    return;
  }

  const erst = !held.truebungBestaetigt;
  held.truebungBestaetigt = true;
  await rt.present({
    title: "Bei Witwe Kern",
    art: "apothecary",
    portrait: "kern",
    held,
    lines: erst
      ? [
          "Kern hat die Ärmel hochgekrempelt, denn sie bereitet sich auf lange Arbeit vor. Auf der Waage vor ihr liegt dieselbe Kräutermischung, die sie seit Tagen abwiegt. Sie scheint nie zu reichen, obwohl sie die Schale immer wieder füllt.",
          "Bauchschmerzen. Fieber. Ein metallischer Geschmack im Mund, den man nicht wegspülen kann. Sie zählt die Symptome auf, während sie die ihr bekannte Liste liest. Die Kinder zuerst, dann die Alten. So ist es immer, wenn etwas von unten kommt und nicht von oben.",
          "Lohn bietet sie dir nicht an. Kein Wort, keine Geste zu ihrer Geldkiste. Vor der Tür warten die Kranken, und nach Lohn fragt sie nicht. „Etwas Fremdes ist im Wasser“, sagt sie. „Nicht Krankheit allein. Jemand hat den Brunnen angefasst.“",
          "Unter den Krankenzetteln an der Wand hängen zwei frische. Die Tinte ist kaum trocken. Beide nennen Häuser nah am Brunnen. Zu nah für einen Zufall.",
        ]
      : [
          "Kern wiegt die Mischung noch einmal ab. Die Schale senkt sich nicht weit genug, gleich wie viel sie hineinschüttet. Das Kraut folgt ihrer Hand nicht.",
          held.grovinGenannt
            ? "„Grovin hat den Brunnen gebaut“, sagt sie, ohne von der Waage aufzusehen. Sie fügt hinzu, dass nur er weiß, wohin das Wasser verschwindet, und niemand sonst."
            : "„Dennek steht am Rand und rührt“, sagt sie stattdessen, mit einer Bitterkeit, die sie nicht zu verbergen versucht. Sie meint, ein Stock könne eine Schuld klären, die tiefer sitzt als der Eimer.",
        ],
  });
}

async function dennekGespraech(rt: Runtime, held: Held) {
  if (held.dennekEntlarvt) {
    await rt.present({
      id: "ratsherr-dennek",
      title: "Ratsherr Dennek",
      art: "well",
      portrait: "dennek",
      held,
      lines: [
        "Dennek trommelt nicht mehr. Seine Finger liegen flach auf dem kalten Stein der Brunnenmauer, ausgebreitet. Sie scheinen sich dort festzuhalten, um nicht zu wanken.",
        "„Grovin“, sagt er. Der Name kostet ihn nichts mehr, keine Anstrengung, kein Zögern. Es ist, als hätte das Aussprechen der Wahrheit eine Last genommen. Er hat sie endlich abgelegt. „Zisterne am Waldrand. Ich habe nicht bezahlt, das ist wahr, und ich werde es nicht schönreden.“ Das Wasser hat den Rest erledigt, an meiner Statt.",
      ],
    });
    return;
  }

  const lines = [
    "Dennek rührt weiter im Eimer, mechanisch, ohne Überzeugung. Das Wasser wird dadurch nicht klarer, und das scheint ihm nicht zu entgehen, obwohl er die Bewegung nicht einstellt. „Trockenes Jahr“, sagt er, mit der glatten Sicherheit eines Mannes, der diesen Satz schon oft geübt hat. „Der Brunnen gibt, was er kann. Mehr zu verlangen wäre Klage. Wofür sollte man klagen, wenn die Erde knapp ist?“",
    "Der Stock kreist immer an derselben Stelle vorbei. Die Fuge rechts am Rand bleibt unberührt. Das Wasser, das er aufwühlt, fällt in sich zurück und bleibt grau.",
    "An seinen Stiefeln klebt hellerer Lehm als auf dem Platz. Der Weg zum Wald ist kürzer, als sein Satz vom trockenen Jahr behauptet.",
  ];
  if (held.truebungBestaetigt) {
    lines.push(
      "Du trägst die Liste bei dir, die Namen der Kranken, fein säuberlich notiert. Dennek sieht auf deine Schuhe, nicht auf den Eimer, nicht auf dich. Dennek meint, deine Stiefel bergen mehr Wahrheit, als er ertragen kann. Er sucht sie in deinem Gesicht.",
    );
  }
  if (held.buergermeisterVertraut) {
    lines.push(
      "Er kennt Holms Vorschuss, das stille Zeichen, dass ein schweres Gewicht im Rücken lastet, und es lässt ihn höflicher klingen, nicht aber wahrhaftiger. An diesem Brunnenrand lernt man, dass Höflichkeit und Wahrheit getrennte Münzen sind.",
    );
  }
  lines.push(...echoDruckDennek(held));

  const schwer = dennekCharismaSchwer(held);
  const items: { id: string; label: string }[] = [
    {
      id: "charisma",
      label: held.truebungBestaetigt
        ? "Ihn mit den Kranken stellen (Charisma, mittel)"
        : "Nach dem trockenen Jahr fragen (Charisma, schwer)",
    },
    {
      id: "staerke",
      label: held.buergermeisterVertraut
        ? "Ihn im Namen des Rats festlegen (Stärke, mittel)"
        : "Ihn an die Mauer drücken (Stärke, mittel)",
    },
    { id: "gehen", label: "Ihn am Eimer lassen" },
  ];

  const wahl = await rt.present({
    id: "ratsherr-dennek",
    title: "Ratsherr Dennek",
    art: "well",
    portrait: "dennek",
    held,
    lines,
    choices: items.map((item) => item.label),
  });
  const id = items[wahl]?.id;
  if (id === "gehen" || id == null) return;

  if (id === "charisma") {
    const ergebnis = probe(held, "Charisma", held.charisma, schwer, "Denneks Ausflucht prüfen", undefined, "reden");
    await dennekProbe(rt, held, ergebnis);
    return;
  }
  const ergebnis = probe(held, "Stärke", held.staerke, MITTEL, "Dennek festlegen", undefined, "kaempfen");
  await dennekProbe(rt, held, ergebnis);
}

async function dennekProbe(rt: Runtime, held: Held, ergebnis: ReturnType<typeof probe>) {
  if (ergebnis.erfolg) {
    held.dennekEntlarvt = true;
    held.grovinGenannt = true;
    await rt.present({
      held,
      probe: ergebnis,
      lines: [
        "Dennek trommelt zu oft mit den Fingern, ein letztes, nervöses Klopfen. Plötzlich verstummen die Finger, denn die Wahrheit lässt keinen Rhythmus der Welt mehr übertönen.",
        "„Grovin hat den Brunnen gebaut“, sagt er. Die Stimme hat keine Farbe mehr. „Wir haben ihn nicht bezahlt. Damals, vor Jahren. Man sagte, das Geld werde für Wichtigeres gebraucht. Seitdem ist er fort. Das Wasser ist mit ihm gegangen.“",
        "Er lässt den Stock in den Eimer fallen. Das Geräusch ist klein und endgültig. Dann sieht er weg. Der Brunnenrand war lange sein Posten. Jetzt ist er eine Schuld, die er loswerden will.",
      ],
    });
    return;
  }
  held.grovinGenannt = true;
  await rt.present({
    held,
    probe: ergebnis,
    lines: [
      "Dennek bleibt stur, unbeirrbar in seiner Ausflucht. Er wiederholt: „Trockenes Jahr.“ Die bloße Wiederholung soll die Behauptung stärker erscheinen lassen. „Mehr steht nicht im Buch, und mehr wirst du von mir nicht hören.“",
      "Beim dritten Satz, mitten im Fluss seiner Rede, fällt ein Name – Grovin – kaum lauter als ein Atemzug, doch deutlich genug, dass man ihn nicht überhören kann. Er kann den Namen nicht mehr ganz verschlucken, obwohl er es versucht.",
      "Die Finger trommeln weiter, unverändert, im gleichen nervösen Takt. Lügen haben hier ihren eigenen Rhythmus, den man mit der Zeit erkennt, ohne die Worte zu verstehen.",
    ],
  });
}

async function brunnenUntersuchen(rt: Runtime, held: Held) {
  if (held.spurAmBrunnen) {
    await rt.present({
      title: "Brunnenschacht",
      art: "well",
      artSrc: "/art/well-depth.mp4",
      portrait: null,
      held,
      lines: [
        "Frischer Mörtel klebt an einer Steinfuge, nicht älter als ein paar Nächte, glatt und hell im Gegensatz zum verwitterten Stein ringsum. Dahinter liegt ein schmaler Ablaufgraben, der aus dem Dorf zum Wald führt. Er ist unauffällig genug, dass man ihn für Regenwasser hält.",
        "Denneks Stock meidet beim Rühren immer diese Stelle. Die Hand kennt die Fuge. Der Mund nennt sie nicht.",
      ],
    });
    return;
  }
  const ergebnis = probe(held, "Geschicklichkeit", held.geschick, LEICHT, "den Brunnenrand prüfen", undefined, "wahrnehmung");
  if (ergebnis.erfolg) {
    held.spurAmBrunnen = true;
    await rt.present({
      title: "Brunnenschacht",
      art: "well",
      artSrc: "/art/well-depth.mp4",
      portrait: null,
      held,
      probe: ergebnis,
      lines: [
        "Frischer Mörtel klebt an einer Steinfuge, nicht älter als ein paar Nächte, glatt und hell im Gegensatz zum verwitterten Stein ringsum. Dahinter liegt ein schmaler Ablaufgraben, der aus dem Dorf zum Wald führt. Er ist unauffällig genug, dass man ihn für Regenwasser hält.",
        "Denneks Stock meidet beim Rühren immer diese Stelle. Die Hand kennt die Fuge. Der Mund nennt sie nicht.",
      ],
    });
    return;
  }
  await rt.present({
    title: "Brunnenschacht",
    art: "well",
    artSrc: "/art/well-depth.mp4",
    portrait: null,
    held,
    probe: ergebnis,
    lines: [
      "Der Stein am Rand ist nass, obwohl kein Regen gefallen ist. Der Eimer bleibt trüb, auch wenn man tief hineinsieht. Mehr gibt der Brunnenrand auf den ersten Blick nicht her.",
      "Wer den Graben trotzdem finden will, sucht ihn später im Unterholz. Die Fuge am Brunnen dient ihm nicht als Spur. Es bleibt nur sein Gespür.",
    ],
  });
}

async function ablaufgraben(rt: Runtime, held: Held) {
  if (!held.spurAmBrunnen) {
    const suche = probe(held, "Geschicklichkeit", held.geschick, MITTEL, "den Ablaufgraben finden", undefined, "wahrnehmung");
    if (!suche.erfolg) {
      await rt.present({
        art: "forest",
        held,
        probe: suche,
        lines: [
          "Dornen ranken sich über feuchtes, welkes Laub, und im Unterholz zeigen sich drei kleine Gräben. Alle wirken aus reinem Regenwasser, keiner ist hervorgehoben.",
          "Ohne die Fuge am Brunnen als Beweis bleibt jeder Weg nur eine Vermutung, eine Behauptung ohne Boden.",
        ],
      });
      return;
    }
    await rt.present({
      art: "ditch",
      held,
      probe: suche,
      lines: [
        "Man findet den richtigen Graben dort, wo das Gras merklich kürzer steht – ein stiller Verrat der Natur an dem, der sie zu lesen weiß.",
        "Der Graben verläuft gerade, zu gerade, um das Werk von Wildwasser zu sein, das sich für gewöhnlich seinen eigenen, launischen Weg sucht.",
      ],
    });
  }

  await rt.present({
    id: "ablaufgraben",
    title: "Ablaufgraben",
    art: "ditch",
    portrait: null,
    held,
    lines: [
      "Der Graben läuft gerade, zu gerade für Wasser, das sich seinen Weg sucht. An den Rändern steht das Gras kürzer, niedergetreten, nicht vom Regen.",
      "Der Boden darin ist glatt. Jemand hat hier mehr als einmal mit einem Eimer entlanggeschliffen. Die Ränder tragen Kratzspuren, die nicht von Wurzeln stammen.",
      "Er endet an einer halb überwucherten Zisterne. Das Mauerwerk ist alt. Die Fugen sind es nicht. Jemand hat sie nachgestrichen, hell, noch nicht vom Moos genommen.",
      "Im Dorf husten die Kinder. Hier hält jemand ein Becken instand, das sie nicht zu sehen bekommen.",
    ],
  });

  const sneakSchwer = held.spurAmBrunnen ? MITTEL : SCHWER;
  const weg = await rt.present({
    id: "an-der-zisterne",
    title: "An der Zisterne",
    art: "ditch",
    portrait: null,
    held,
    lines: [
      "Dornen stehen dicht vor dem Becken. Nicht gewachsen, gelegt. Die Zweige sind an den Schnittstellen hell.",
      "Dahinter bewegt sich eine Hand über Wasser. Flach. Ohne Eile. Das Wasser ist klar bis auf den Stein. Im Dorf hat der Eimer diese Farbe seit Tagen nicht mehr.",
      "Der Geruch ist Stein und nasses Holz, nicht Eisen. Wer hier schöpft, schöpft nicht aus dem Brunnen.",
    ],
    choices: [
      "Sich durch das Gestrüpp zwängen (Stärke, leicht)",
      held.spurAmBrunnen
        ? "Sich unbemerkt nähern (Geschick, mittel)"
        : "Sich unbemerkt nähern (Geschick, schwer)",
      "Umkehren",
    ],
  });
  if (weg === 2) return;

  let grovinBereit = false;
  if (weg === 0) {
    const ergebnis = probe(held, "Stärke", held.staerke, LEICHT, "durch das Gestrüpp", undefined, "klettern");
    if (!ergebnis.erfolg) {
      const wunde = schaden(held, 1, "Dornen");
      await rt.present({
        held,
        probe: ergebnis,
        log: [wunde],
        lines: [
          "Die Dornen nehmen sich, was ihnen zusteht — Stoff zunächst, dann Haut darunter, kleine, brennende Schnitte. Alarm jedoch geben sie keinen.",
          "Man kommt hindurch, zerrissen und leicht blutend, aber immerhin unangekündigt genug, dass niemand drüben am Becken aufschaut.",
        ],
      });
    } else {
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Das Gestrüpp gibt bereitwillig nach an einer Stelle, wo offenbar schon öfter jemand hindurchgegangen ist – ein schmaler, kaum sichtbarer Pfad im Dornengewirr, den nur ein geübtes Auge erkennt.",
        ],
      });
    }
  } else {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, sneakSchwer, "sich der Zisterne nähern", undefined, "schleichen");
    if (!ergebnis.erfolg) {
      grovinBereit = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Ein trockener Ast bricht unter dem eigenen Fuß, viel zu laut in der Stille. Die flache Hand auf dem Wasser hält einen Moment lang inne — und bewegt sich dann nicht mehr.",
          "Grovin richtet sich auf. In der anderen Hand hält er eine Grabegabel. Die Zinken sind blanker, als Arbeit am Wasser sie machen würde.",
        ],
      });
    } else {
      await rt.present({
        art: "sneak",
        held,
        probe: ergebnis,
        lines: [
          "Du kommst seitlich an das Becken, ohne dass er dich sieht. Grovin prüft den Wasserstand weiter mit der flachen Hand. Die Stille hält er für seine eigene.",
        ],
      });
    }
  }

  if (tot(held)) {
    held.todesort = "zisterne";
    return;
  }
  await grovinZisterne(rt, held, grovinBereit);
}

async function grovinZisterne(rt: Runtime, held: Held, bewaffnet: boolean) {
  const lines = [
    "Das Wasser in der Zisterne ist klar bis auf den steinigen Grund; es übertrifft das, was der Brunnen im Dorf seit Tagen bietet. Grovin blickt zuerst hinunter, dann zu dir, mit abschätzender Ruhe. Er ist ein Mann, der lange allein gelebt hat und sich von einem unerwarteten Besuch kaum aus der Fassung bringen lässt.",
    "„Ich habe dem Dorf diesen Brunnen gebaut“, sagt er, „und es hat mich dafür nicht bezahlt. Das Wasser nimmt, was mir zusteht, und ich helfe ihm dabei nach.“",
  ];
  if (bewaffnet) {
    lines.push("Die Grabegabel bleibt zwischen euch stehen, eine stumme Grenze. Ihre Zinken tropfen — nicht von Regen.");
  }
  if (held.dennekEntlarvt) {
    lines.push(
      "„Dennek trommelt, wenn er lügt“, fügt Grovin trocken hinzu, fast amüsiert. „Ich habe das schon gehört, lange bevor du geboren wurdest, und ich habe es nie vergessen.“",
    );
  }
  lines.push(...echoGrovinKenntMuehle(held));

  await rt.present({
    title: "Grovins Zisterne",
    art: "ditch",
    portrait: "grovin",
    held,
    lines,
  });

  if (!held.grovinsGrund) {
    const frage = await rt.present({
      title: "Grovins Zisterne",
      art: "ditch",
      portrait: "grovin",
      held,
      lines: [
        "Grovin wartet. Die Hand bleibt auf dem Wasser, als könnte er daran ablesen, ob du fragst oder nimmst.",
        "Nicht lange. Die Zisterne hat keinen Platz für zwei Rechnungen gleichzeitig.",
      ],
      choices: [
        "Ihn nach der ausgebliebenen Entschädigung fragen",
        "Sofort handeln",
      ],
    });
    if (frage === 0) {
      held.grovinsGrund = true;
      held.grovinGenannt = true;
      await rt.present({
        title: "Grovins Zisterne",
        art: "ditch",
        portrait: "grovin",
        held,
        lines: [
          "Grovin legt die Hand erneut aufs Wasser. Er prüft, ob man ihm wirklich zuhört. Er fragt sich, ob man nur eine weitere Frage stellt. Die Antwort darauf ist längst bekannt.",
          "„Drei Jahre Arbeit“, sagt er. „Kein Lohn. Dennek hat gesagt, das Amt zahle später.“ Er lässt das Wort stehen. „Später ist ein Grab. Ohne Stein. Ohne einen Namen, den es zu merken lohnte.“",
          "Er will das Dorf nicht vergiften, das macht er deutlich, mit einer Bestimmtheit, die keinen Widerspruch duldet. Er will nur, dass irgendjemand endlich diese eine Rechnung liest. Man hat ihm die Rechnung all die Jahre verweigert.",
        ],
      });
    }
  }

  const kampfSchwer = bewaffnet ? SCHWER : MITTEL;
  const oeffnenSchwer = held.spurAmBrunnen ? MITTEL : SCHWER;
  const items: { id: string; label: string }[] = [
    {
      id: "zerstoeren",
      label: bewaffnet
        ? "Die Sperre gewaltsam brechen (Stärke, schwer)"
        : "Die Sperre gewaltsam brechen (Stärke, mittel)",
    },
    {
      id: "oeffnen",
      label: held.spurAmBrunnen
        ? "Die Sperre unbemerkt umlegen (Geschick, mittel)"
        : "Die Sperre unbemerkt umlegen (Geschick, schwer)",
    },
  ];
  if (held.grovinsGrund) {
    items.push({ id: "handeln", label: "Ihm Holms Entschädigung versprechen (Charisma, mittel)" });
  }
  items.push({
    id: "bestechen",
    label: held.gold >= 5 ? "Ihn mit 5 Gold ruhigstellen" : "Ihn mit Gold ruhigstellen — zu wenig Gold",
  });
  items.push({ id: "gehen", label: "Die Zisterne verlassen" });

  const wahl = await rt.present({
    title: "Grovins Zisterne",
    art: "ditch",
    portrait: "grovin",
    held,
    lines: [
      "Die Sperre sitzt im Gerinne, unscheinbar wie ein Brett, das jemand zum Trocknen hingelegt hat. Grovin sieht nicht weg.",
    ],
    choices: items.map((item) => item.label),
  });
  const id = items[wahl]?.id;
  if (id === "gehen" || id == null) return;

  if (id === "bestechen") {
    if (held.gold < 5) {
      await rt.present({
        held,
        lines: [
          "Grovin blickt in den angebotenen Beutel, ohne ihn zu berühren, mit der abschätzigen Genauigkeit eines Mannes, der solche Beutel zu oft gewogen hat.",
          "„Später ist schon einmal gekommen“, sagt er nur. „Es war leer.“",
        ],
      });
      return;
    }
    held.gold -= 5;
    held.loesungswegBrunnen = "bestochen";
    await rt.present({
      held,
      log: ["→ 5 Gold. Grovin behält seine Zisterne."],
      lines: [
        "Grovin nimmt das Gold und zählt es nicht. Er kennt den Betrag. Es ist die Summe, die man zahlt, damit niemand mehr fragt. Auf den Cent.",
        "Ein Teil des Wassers läuft daraufhin zurück ins Dorf, ein anderer Teil bleibt hier, bei ihm. Das Dorf wird seltener husten müssen von nun an — doch satt trinken wird es sich nie wieder wirklich können.",
      ],
    });
    await brunnenEnde(rt, held);
    return;
  }

  if (id === "handeln") {
    const ergebnis = probe(held, "Charisma", held.charisma, MITTEL, "Grovin ein Versprechen geben", undefined, "reden");
    if (ergebnis.erfolg) {
      held.loesungswegBrunnen = "verhandelt";
      held.grovinVersprechen = true;
      await rt.present({
        held,
        probe: ergebnis,
        lines: [
          "Grovin hört das Wort „Amt“, ohne dabei den Blick abzuwenden, wie er es sonst bei leeren Versprechungen zu tun pflegt.",
          "„Wenn Holm zahlt, öffne ich selbst“, sagt er. „Zahlt er nicht, kommt das Wasser nicht zurück. Das ist kein Drohen, das ich hier ausspreche. Das ist die alte Rechnung, die endlich beglichen werden will.“",
          "Er legt die Sperre eigenhändig um. Das klare Wasser läuft den Graben zurück, dem Dorf entgegen, als hätte es den alten Weg nie wirklich vergessen, nur lange genug darauf gewartet, ihn wieder gehen zu dürfen.",
        ],
      });
      await brunnenEnde(rt, held);
      return;
    }
    await rt.present({
      held,
      probe: ergebnis,
      lines: [
        "Grovin schüttelt nur den Kopf, ohne Zorn, fast mit einer Art müder Belustigung.",
        "„Versprechen habe ich schon einige gehört“, sagt er. „Sie wiegen allesamt weniger als diese Hand hier auf dem Wasser.“",
      ],
    });
    return;
  }

  if (id === "oeffnen") {
    const ergebnis = probe(held, "Geschicklichkeit", held.geschick, oeffnenSchwer, "die Wassersperre umlegen", undefined, "klettern");
    if (ergebnis.erfolg) {
      held.loesungswegBrunnen = "geoeffnet";
      await rt.present({
        art: "sneak",
        held,
        probe: ergebnis,
        lines: [
          "Die Sperre gibt leise nach, kaum ein Geräusch. Grovin bemerkt es erst, als der Wasserstand unter seiner eigenen Hand merklich sinkt.",
          "Er flucht, lautlos, ohne Stimme. Das Dorf wird nie erfahren, warum der Eimer am nächsten Morgen wieder klar ist bis auf den Grund.",
        ],
      });
      await brunnenEnde(rt, held);
      return;
    }
    const wunde = schaden(held, bewaffnet ? 4 : 2, "Grabegabel");
    held.todesort = tot(held) ? "zisterne" : held.todesort;
    await rt.present({
      art: tot(held) ? "death" : "combat",
      held,
      probe: ergebnis,
      log: [wunde],
      lines: tot(held)
        ? [
            "Grovin ist schneller am Hebel, als man es ihm zugetraut hätte. Die Grabegabel findet zuerst Stoff, dann darunter Haut.",
            "Die Zisterne bleibt klar und still, unbewegt von allem, was gerade geschehen ist. Das Dorf wartet derweil weiter auf einen Boten, der nicht mehr zurückkehren wird.",
          ]
        : [
            "Grovin ist schneller am Hebel, als man es ihm zugetraut hätte. Die Grabegabel findet zuerst Stoff, dann darunter Haut.",
            "Man trägt eine Wunde davon, schmerzhaft, aber nicht tödlich.",
          ],
    });
    if (tot(held)) return;
    await vielleichtHeiltrank(rt, held);
    return;
  }

  const ergebnis = probe(held, "Stärke", held.staerke, kampfSchwer, "die Umleitung zerstören", undefined, "kaempfen");
  if (ergebnis.erfolg) {
    held.loesungswegBrunnen = "zerstoert";
    held.grovinGeflohen = true;
    await rt.present({
      art: "combat",
      held,
      probe: ergebnis,
      lines: [
        "Das alte Holz der Sperre bricht mit einem trockenen Knacken. Das Wasser schießt sofort in den Graben zurück, zuerst braun vom aufgewühlten Grund, dann nach und nach wieder klar.",
        "Grovin flieht, noch bevor man die Gabel in seiner Hand ganz zu Gesicht bekommt. Der Waldrand nimmt ihn auf, ohne eine einzige Frage zu stellen.",
      ],
    });
    await brunnenEnde(rt, held);
    return;
  }
  const wunde = schaden(held, bewaffnet ? 4 : 3, "Kampf an der Zisterne");
  held.todesort = tot(held) ? "zisterne" : held.todesort;
  await rt.present({
    art: tot(held) ? "death" : "combat",
    held,
    probe: ergebnis,
    log: [wunde],
    lines: tot(held)
      ? [
          "Man geht ins klare Wasser hinein und bleibt dort. Die Zisterne behält ihren Stand unverändert bei. Das Dorf behält seinen Husten.",
        ]
      : [
          "Man trägt eine Wunde vom Kampf an der Zisterne davon. Die Sperre hält weiterhin, Grovin ebenso. Man wird später wiederkommen müssen, oder es auf eine andere Art versuchen.",
        ],
  });
  if (tot(held)) return;
  await vielleichtHeiltrank(rt, held);
}

async function brunnenEnde(rt: Runtime, held: Held) {
  if (held.loesungswegBrunnen === "bestochen") {
    await rt.present({
      id: "zwei-brunnen-ein-dorf",
      title: "Zwei Brunnen, ein Dorf",
      art: "well",
      portrait: "kern",
      held,
      lines: [
        "Das Wasser wird spürbar klarer. Es reicht länger, doch nicht für alle. Kern braut dieselbe Mischung wie zuvor, jedoch seltener. Er stellt die Flaschen enger, damit die Lücke nicht auffällt.",
        "Der Eimer am Platz ist nicht mehr grau. Er ist auch nicht klar. Wer zuerst kommt, trinkt. Wer später kommt, zählt die Ringe an der Wand.",
        "Du trägst, was wirklich geschah, allein. Dennek rührt nicht mehr. Er spricht auch nicht.",
      ],
    });
    return;
  }

  if (held.loesungswegBrunnen === "zerstoert" && !held.dennekEntlarvt) {
    await rt.present({
      id: "wasser-mit-einem-riss",
      title: "Wasser mit einem Riss",
      art: "well",
      portrait: null,
      held,
      lines: [
        "Das Wasser fließt wieder. Der Eimer schlägt gegen den Stein. Der Klang ist der alte. Grovin ist fort, aber nicht weit genug.",
        "Am Waldrand sind Schritte, nachts, wenn der Wind vom Osten kommt. Niemand im Dorf sagt den Namen dazu. Die Zisterne steht noch. Ihre Fugen auch.",
      ],
    });
    return;
  }

  const log: string[] = [];
  if (held.truebungBestaetigt && !held.inventar.includes(HEILTRANK)) {
    log.push(nimm(held, HEILTRANK));
  } else if (held.truebungBestaetigt) {
    log.push(goldPlus(held, 2, "Kerns Dank, weil die Flaschen reichen"));
  }

  await rt.present({
    id: "klares-wasser",
    title: "Klares Wasser",
    art: "well",
    portrait: "kern",
    held,
    log: log.length ? log : undefined,
    lines: [
      "Am nächsten Morgen ist der Eimer am Brunnen wieder klar bis auf den Grund, wie man es sich schon lange nicht mehr zu hoffen getraut hatte. Kern braut zum ersten Mal seit vielen Tagen wieder etwas anderes als bloßes Fiebermittel.",
      held.dennekEntlarvt
        ? "Niemand im Dorf fragt laut nach dem Warum. Dennek meidet eine Weile den Brunnenrand. Der Stein dort kennt noch seine Finger. Der Stock liegt im Eimer. Die Kinder trinken. Dem Platz reicht das als Urteil."
        : "Niemand im Dorf fragt laut nach dem Warum. Fragen kosten Kraft, und die braucht man zum Trinken. Ein klarer Eimer ist Antwort genug, solange niemand hustet. Wer mehr will, muss in den Wald. Dort liegt der Graben, durch den das trübe Wasser gelaufen ist.",
      held.grovinVersprechen
        ? "Holm schuldet Grovin jetzt eine Summe. Sie steht nicht in der Kasse. Du hast sie an der Zisterne versprochen. Das Wasser kennt den Graben schon wieder. Zahlt das Amt, bleibt der Brunnen ein Brunnen. Zahlt es nicht, kommt das Wasser nicht als Bitte zurück. Es kommt als die alte Rechnung."
        : "Das Wasser schmeckt nach Stein, nicht nach Metall. Das reicht für ein Tal, das gelernt hat, gute Morgen nicht durch Fragen zu gefährden.",
    ],
  });
}
