import { createServerFn } from "@tanstack/react-start";
import {
  leiterPasswortGueltig,
  merkeLeiterCookie,
  verlasseLeiterCookie,
} from "./leiter-auth.server";

function innerOf(input: unknown): Record<string, unknown> {
  const rec = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  if (rec.data && typeof rec.data === "object" && !Array.isArray(rec.data)) {
    return rec.data as Record<string, unknown>;
  }
  return rec;
}

export const oeffneLeiterSitzung = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const inner = innerOf(input);
    return { passwort: String(inner.passwort ?? "").slice(0, 80) };
  })
  .handler(async ({ data }) => {
    if (!data.passwort || !leiterPasswortGueltig(data.passwort)) return { ok: false as const };
    merkeLeiterCookie();
    return { ok: true as const };
  });

export const schliesseLeiterSitzungServer = createServerFn({ method: "POST" }).handler(() => {
  verlasseLeiterCookie();
  return { ok: true as const };
});
