import { ImagePlus } from "lucide-react";

/** Dateifeld liegt über dem Knopf, nicht auf 1px versteckt.
 *  Android-WebViews öffnen die Galerie sonst nicht. */
export function GalerieWahl({ onDatei }: { onDatei: (datei: File) => void }) {
  return (
    <label className="relative inline-flex h-11 cursor-pointer items-center gap-1.5 overflow-hidden rounded-sm border border-border px-3 text-sm text-fg">
      <ImagePlus className="size-3.5" aria-hidden />
      Galerie
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(event) => {
          const datei = event.target.files?.[0];
          event.target.value = "";
          if (datei) onDatei(datei);
        }}
      />
    </label>
  );
}
