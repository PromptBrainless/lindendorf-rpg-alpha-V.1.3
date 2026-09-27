import { ART, LAGEN_ART, PORTRAITS } from "../art";
import { QUESTS } from "../json/baum";
import { stimmeDatei } from "../json/stimme";
import { wissenDatei, wissenIds } from "../json/wissen";
import { FIGUR_NAME } from "../stimme";
import {
  AMULETT,
  ARTEFAKT,
  BRANDMITTEL,
  GEHEIMINFORMATIONEN,
  HEILTRANK,
  KOERPER,
  LEDERMANTEL,
  PROVIANT,
  RUHIGE_HAND,
  SCHLUESSEL,
  SCHLICHTER_RING,
  TRAGEGURT,
  ZAEHER_NACKEN,
} from "../types";
import { STUDIO_MEDIA } from "./assets.generated";
import type { Entity } from "./model";

export type LibraryCategory = "medium" | "abschnitt" | "szene" | "figur" | "wissen" | "gegenstand";
export type LibraryEntry = {
  id: string;
  category: LibraryCategory;
  title: string;
  sourceLabel: string;
  preview?: string;
  mediaType?: "image" | "video" | "audio";
  data: Record<string, unknown>;
};

export function importedLibraryEntryIds(entities: readonly Entity[]): Set<string> {
  const ids = new Set<string>();
  for (const entity of entities) {
    const explicitId = entity.data.libraryEntryId;
    if (typeof explicitId === "string") {
      ids.add(explicitId);
      continue;
    }
    const legacyId = entity.type === "szene"
      ? entity.data.szeneId
      : entity.type === "figur"
        ? entity.data.figurId
        : entity.type === "wissen"
          ? entity.data.tafelId
          : undefined;
    if (typeof legacyId === "string") ids.add(`lindendorf:${entity.type}:${legacyId}`);
  }
  return ids;
}

const AUDIO_FORMATS = new Set(["m4a", "mp3", "ogg", "wav"]);
const STUDIO_MEDIA_PATHS = new Set<string>(STUDIO_MEDIA.map((media) => media.src));

function titleCase(value: string) {
  return value.replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("de-DE"));
}

function mediaEntry(media: (typeof STUDIO_MEDIA)[number]): LibraryEntry {
  const voice = media.id.startsWith("stimme/");
  const mediaType = AUDIO_FORMATS.has(media.format)
    ? "audio"
    : media.format === "webm" || media.format === "mp4"
      ? voice
        ? "audio"
        : "video"
      : "image";
  const assetKey = Object.entries(ART).find(([, src]) => src === media.src)?.[0];
  const portraitKey = Object.entries(PORTRAITS).find(([, src]) => src === media.src)?.[0];
  const layerKey = Object.entries(LAGEN_ART).find(([, src]) => src === media.src)?.[0];
  const role = voice ? "stimme" : portraitKey ? "portraet" : layerKey ? "lage" : assetKey ? "buehnenbild" : "zusatzmedium";
  return {
    id: `lindendorf:medium:${media.id}`,
    category: "medium",
    title: titleCase(media.title),
    sourceLabel: `Lindendorf · ${role}`,
    preview: media.src,
    mediaType,
    data: {
      assetId: media.id,
      assetKey: assetKey ?? portraitKey ?? layerKey,
      assetKind: role,
      format: media.format,
      mediaType,
      src: media.src,
      sourceProject: "Lindendorf",
    },
  };
}

function sceneEntries(): LibraryEntry[] {
  return QUESTS.flatMap((quest) =>
    quest.teile.flatMap((teil) =>
      teil.szenen.map((szene) => {
        const sceneImage = `/art/wissen/${szene.id}.jpg`;
        const preview = STUDIO_MEDIA_PATHS.has(sceneImage) ? sceneImage : ART[szene.art as keyof typeof ART];
        return {
          id: `lindendorf:szene:${szene.id}`,
          category: "szene",
          title: szene.title,
          sourceLabel: `Lindendorf · ${quest.titel} · ${teil.titel}`,
          preview,
          mediaType: "image",
          data: {
            sourceId: szene.id,
            sourceQuest: quest.titel,
            sourceTeil: teil.titel,
            art: szene.art,
            portrait: szene.portrait,
            lines: [...szene.lines],
            choices: [...szene.choices],
            successLines: szene.successLines ? [...szene.successLines] : undefined,
            failureLines: szene.failureLines ? [...szene.failureLines] : undefined,
            passLines: szene.passLines ? [...szene.passLines] : undefined,
            sourceProject: "Lindendorf",
          },
        };
      }),
    ),
  );
}

function sectionEntries(): LibraryEntry[] {
  return QUESTS.flatMap((quest) =>
    quest.teile.map((teil) => {
      const firstScene = teil.szenen[0];
      const sceneImage = firstScene ? `/art/wissen/${firstScene.id}.jpg` : "";
      const preview = STUDIO_MEDIA_PATHS.has(sceneImage)
        ? sceneImage
        : firstScene
          ? ART[firstScene.art as keyof typeof ART]
          : undefined;
      return {
        id: `lindendorf:abschnitt:${quest.id}:${teil.id}`,
        category: "abschnitt" as const,
        title: teil.titel,
        sourceLabel: `Lindendorf · ${quest.titel} · Questabschnitt`,
        preview,
        mediaType: "image" as const,
        data: {
          sourceQuestId: quest.id,
          sourceQuest: quest.titel,
          sourceSectionId: teil.id,
          sceneCount: teil.szenen.length,
          sourceSceneIds: teil.szenen.map((scene) => scene.id),
          sourceProject: "Lindendorf",
        },
      };
    }),
  );
}

function characterEntries(): LibraryEntry[] {
  return Object.entries(FIGUR_NAME).map(([portrait, title]) => ({
    id: `lindendorf:figur:${portrait}`,
    category: "figur",
    title,
    sourceLabel: "Lindendorf · Figurenbaustein",
    preview: PORTRAITS[portrait as keyof typeof PORTRAITS],
    mediaType: "image",
    data: {
      sourceId: portrait,
      portrait,
      portraitSrc: PORTRAITS[portrait as keyof typeof PORTRAITS],
      role: "Figur aus Lindendorf",
      sourceProject: "Lindendorf",
    },
  }));
}

function knowledgeEntries(): LibraryEntry[] {
  return wissenIds().flatMap((id) => {
    const page = wissenDatei(id);
    if (!page) return [];
    return [{
      id: `lindendorf:wissen:${id}`,
      category: "wissen" as const,
      title: page.title,
      sourceLabel: "Lindendorf · Wissenstafel",
      preview: page.bild,
      mediaType: "image" as const,
      data: {
        sourceId: id,
        lines: [...page.lines],
        bild: page.bild,
        sourceSceneIds: [...(page.szenen ?? [])],
        sourceProject: "Lindendorf",
      },
    }];
  });
}

const ITEM_TEMPLATES = [
  HEILTRANK,
  SCHLUESSEL,
  PROVIANT,
  BRANDMITTEL,
  GEHEIMINFORMATIONEN,
  AMULETT,
  ARTEFAKT,
  LEDERMANTEL,
  KOERPER,
  RUHIGE_HAND,
  ZAEHER_NACKEN,
  TRAGEGURT,
  SCHLICHTER_RING,
];

function itemEntries(): LibraryEntry[] {
  return ITEM_TEMPLATES.map((title) => ({
    id: `lindendorf:gegenstand:${title}`,
    category: "gegenstand",
    title,
    sourceLabel: "Lindendorf · Gegenstandsvorlage",
    data: { sourceId: title, beschreibung: "", sourceProject: "Lindendorf" },
  }));
}

function voiceEntries(): LibraryEntry[] {
  const scenes = QUESTS.flatMap((quest) => quest.teile.flatMap((teil) => teil.szenen));
  const seen = new Set<string>();
  return scenes.flatMap((scene) =>
    stimmeDatei(scene.id).flatMap((voice, index) => {
      if (!voice.src || seen.has(voice.src)) return [];
      seen.add(voice.src);
      return [{
        id: `lindendorf:stimme:${scene.id}:${index}`,
        category: "medium" as const,
        title: voice.name || scene.title,
        sourceLabel: `Lindendorf · Stimme · ${scene.title}`,
        preview: voice.src,
        mediaType: "audio" as const,
        data: { src: voice.src, sceneId: scene.id, sourceProject: "Lindendorf" },
      }];
    }),
  );
}

export function lindendorfLibrary(): LibraryEntry[] {
  return [
    ...STUDIO_MEDIA.map(mediaEntry),
    ...sectionEntries(),
    ...sceneEntries(),
    ...characterEntries(),
    ...knowledgeEntries(),
    ...itemEntries(),
    ...voiceEntries(),
  ].sort((left, right) => left.title.localeCompare(right.title, "de-DE"));
}