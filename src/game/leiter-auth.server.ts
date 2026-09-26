import { createHmac } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const COOKIE = "lindendorf_leiter";
const SALZ = "lindendorf-spielleiter-v1";
const PASSWORT = "1337";

function erwarteterWert() {
  return createHmac("sha256", PASSWORT).update(SALZ).digest("hex");
}

export function leiterPasswortGueltig(passwort: string) {
  return passwort === PASSWORT;
}

export function leiterCookieGueltig() {
  return getCookie(COOKIE) === erwarteterWert();
}

export function merkeLeiterCookie() {
  setCookie(COOKIE, erwarteterWert(), {
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
