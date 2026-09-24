import type { Runtime } from "./runtime";
import type { Held } from "./types";

export async function gasseGrete(rt: Runtime, held: Held) {
  if (held.greteBedraengt && held.greteGespraech) {
    await rt.present({
      title: "Gretes Kate",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Grete hält das Medaillon fest, ohne es zu öffnen. Die Kette hat sich in die Haut gelegt.",
        "„Ich habe geredet. Mehr ist nicht in diesem Haus.“ Die Tür bleibt einen Spalt, nicht mehr.",
      ],
    });
    await rt.present({
      held,
      lines: [
        "Sie findet deine Schritte, bevor du sie findest, und macht den Spalt kleiner.",
        "Innen schlägt das Medaillon einmal gegen den Tisch. Danach bleibt es still.",
      ],
    });
    return;
  }

  if (held.greteGespraech) {
    await rt.present({
      title: "Gretes Kate",
      art: "village",
      portrait: null,
      held,
      lines: [
        "Grete sitzt am Herd, der nicht brennt. Die Asche ist alt genug, dass sie nicht mehr staubt.",
        "„Ilse hat die Liste dorthin gebracht, wo man niemanden begräbt, den man vergessen will. Unter der Kirche. Das Gewölbe, hinter den Steinen ohne Namen.“",
      ],
    });
    await rt.present({
      held,
      lines: [
        "Sie dreht das Medaillon. Innen schlägt etwas Weiches gegen das Metall, zu klein für eine Münze.",
        "„Der lockere Stein ist der dritte von links, wenn du mit dem Rücken zur Treppe stehst. Ilse hat Wachs genommen, das nach Gerberei roch. Du findest ihn am Geruch, wenn die Finger versagen.“",
        "„Geh. Oder bleib still. Beides ist besser als drängen. Drängen habe ich schon gehabt, und danach war die Gasse leer.“",
      ],
    });
    return;
  }

  const lines = [
    "Die Kate ist niedriger als die Gerberei, und Grete ist fast blind. Ihre Finger finden das Medaillon, bevor sie deine Schritte entdeckt.",
    "Es riecht nach kaltem Rauch und altem Leder. An der Wand hängt ein Riemen, der einmal zu einer Gerberei gehört hat und jetzt wie ein Erinnerungsschaden an der Wand hängt.",
    "Auf dem Tisch liegt ein Teller mit nichts darauf. Der Rand ist abgewetzt, wo eine Hand über Jahre den gleichen Platz gesucht hat, ohne ihn jemals wirklich gefunden zu haben.",
  ];
  if (held.gasseSpielzeugGefunden) {
    lines.push("Du hast das Holzspielzeug gesehen. Gretes Mund wird enger. Das Medaillon bleibt fest in ihrer Hand, als hätte sie sich daran festgeklammert, bevor du noch ein Wort gesagt hast.");
  }
  if (held.gasseGeschichteGehoert) {
    lines.push("Fenn hat ihren Namen genannt. Sie wartet jetzt nicht auf eine Frage, sondern auf den Ton, mit dem du sie stellst. Das unterscheidet sie von den anderen.");
  } else if (held.gasseOrtGesehen) {
    lines.push("Du kommst von der Gasse. Sie hat deine Schritte gehört, bevor du gepocht hast. Das Dorf kennt nicht viele Fremde, aber Grete kennt sogar die Schritte derer, die nicht mehr zurückkommen.");
  }

  const items: { id: string; label: string }[] = [
    { id: "warten", label: "Warten und zuhören" },
    { id: "druck", label: "Sie zum Reden drängen" },
    { id: "gehen", label: "Die Kate verlassen" },
  ];

  const wahl = await rt.present({
    title: "Grete",
    art: "village",
    portrait: null,
    held,
    lines,
    choices: items.map((item) => item.label),
  });
  const id = items[wahl]?.id;
  if (id === "gehen" || id == null) return;

  if (id === "druck") {
    held.greteBedraengt = true;
    held.greteGespraech = true;
    await rt.present({
      held,
      lines: [
        "Grete weicht bis an die Herdwand zurück. Das Medaillon schlägt einmal gegen den Tisch.",
        "„Ilse Brandtner war die Hebamme. Sie hat geschrieben, wen man nicht begraben hat. Die Liste liegt unter der Kirche, wo die Steine keine Namen tragen.“",
      ],
    });
    await rt.present({
      held,
      lines: [
        "Die Sätze kommen zu schnell, als müsste sie sie loswerden, bevor du noch eine stellst.",
        "Danach schließt sich die Hand um das Medaillon. Den Stein nennt sie nicht. Den Geruch auch nicht.",
        "Mehr gibt dieses Haus nicht, auch wenn du bleibst. Draußen bleibt die Gasse so leer wie zuvor.",
      ],
    });
    return;
  }

  if (!held.gasseGeschichteGehoert && !held.gasseSpielzeugGefunden) {
    await rt.present({
      held,
      lines: [
        "Grete hört dich atmen. Sie redet nicht. Die Finger bleiben am Medaillon.",
        "„Wer die Gasse nicht kennt, soll sie nicht aus meinem Mund lernen. Fenn sitzt an der Kirche. Frag ihn, oder geh.“",
      ],
    });
    return;
  }

  await rt.present({
    held,
    lines: [
      "Du bleibst. Der Teller auf dem Tisch rührt sich nicht.",
      "Irgendwann wird das Medaillon ruhiger. Grete atmet, als zähle sie die Atemzüge, die du ihr lässt.",
    ],
  });

  held.greteGespraech = true;
  await rt.present({
    held,
    lines: [
      "„Ilse Brandtner war Hebamme. Sie hat die Toten aufgeschrieben, bevor man sie im Mühlbach fand. An einem trockenen Abend. Das Wasser stand niedrig. Ilse stand trotzdem darin.“",
      "„Die Liste hat sie dorthin gebracht, wo man niemanden begräbt, den man vergessen will. Das Gewölbe unter der Kirche, hinter einem Stein, der lockerer sitzt als die anderen.“",
    ],
  });
  await rt.present({
    held,
    lines: [
      "Grete öffnet das Medaillon nicht. Innen liegt, so viel merkst du am Klang, ein Haar.",
      "„Drei Namen vom Rat. Und wie das Land danach aufgeteilt wurde. Der lockere Stein ist der dritte von links, Rücken zur Treppe. Ilse hat Wachs aus der Gerberei genommen.“",
      "„Geh, solange du noch jemand bist, der geht und nicht nur fragt.“",
    ],
  });
}
