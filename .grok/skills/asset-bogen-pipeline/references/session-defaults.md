# Session-Defaults

Werte, die der Agent zu Beginn einer Session bestätigen oder erfragen muss.

## Fest verdrahtet

| Schlüssel | Wert | Darf der Agent ändern? |
|---|---|---|
| T | 64 | Nein |
| SCALE_FILTER | Lanczos | Nein |
| WARTE_AUF | Start | Nein |
| DATEI_MODUS | eine nach der anderen | Nein |

## Pro Projekt vom Nutzer

| Schlüssel | Beispiel | Pflicht |
|---|---|---|
| PROJEKT | warmholz-oliv | Ja, vor Schritt 1 |
| RAND_PX | 2 | Ja, vor Objekt-Schnitt. 0 ist erlaubt. |

`RAND_PX` gilt nur für Objekte, Figuren und UI nach dem Freistellen. Kacheln (exakt 64×64) bekommen keinen Extra-Rand.

## Ableitung Maßstab

```
faktor = T / kachel_orig_px
```

Denselben `faktor` auf **alle** Assets desselben Bogens anwenden. Danach auf das nächste T-Vielfache mit Transparenz auffüllen (siehe `groessenklassen.md`).

Enthält ein Bogen keine erkennbare Kachel:

1. Faktor aus typischer Motivgröße schätzen.
2. Schätzung plus Begründung ausgeben.
3. Warten. Nicht speichern.

Einzelbilder ohne Bogen-Kontext — denselben zuletzt bestätigten Bogenfaktor nutzen, falls der Nutzer sie dem Bogen zuordnet. Sonst Faktor vorschlagen und warten.
