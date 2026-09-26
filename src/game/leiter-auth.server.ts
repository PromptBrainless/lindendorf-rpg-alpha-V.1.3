import { createHmac } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const COOKIE = "lindendorf_leiter";
const SALZ = "lindendorf-spielleiter-v1";

function erwarteterWert() {
  const passwort = process.env.LEITER_PASSWORT;
  if (!passwort) return null;
  return createHmac("sha256", passwort).update(SALZ).digest("hex");
}

export function leiterPasswortGueltig(passwort: string) {
  const erwartet = process.env.LEITER_PASSWORT;
  return Boolean(erwartet && passwort && passwort === erwartet);
}

export function leiterCookieGueltig() {
  const erwartet = erwarteterWert();
  return erwartet !== null && getCookie(COOKIE) === erwartet;
}

export function merkeLeiterCookie() {
  const wert = erwarteterWert();
  if (!wert) throw new Error("LEITER_PASSWORT ist nicht konfiguriert.");
  setCookie(COOKIE, wert, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function verlasseLeiterCookie() {
  setCookie(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function verlangeLeiter() {
  if (!leiterCookieGueltig()) throw new Error("Spielleiter-Zugang erforderlich.");
}
