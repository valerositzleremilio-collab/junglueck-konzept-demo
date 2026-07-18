# JUNGLÜCK — Gate-Protokoll (Aufgabe 5)

Automatisiert im Browser (Chrome DevTools) gegen den lokalen Server
`http://localhost:4330` gemessen. Alle drei Gates **bestanden**.

---

## Gate 1 — HÖHEN-GATE (jede Sektion ≤ 100 dvh)

Viewport: **1440 × 900**. Shop-Liste ausgenommen (Overlay, bewusst scrollbar).
Messung per `getBoundingClientRect().height` gegen `window.innerHeight`.

| Sektion | Höhe | % dvh | Ergebnis |
|---|---|---|---|
| hero | 900 px | 100,0 % | ✅ |
| versprechen | 647 px | 71,9 % | ✅ |
| highlights | 780 px | 86,7 % | ✅ |
| routine | 572 px | 63,5 % | ✅ |
| philosophie | 544 px | 60,5 % | ✅ |
| menschen | 614 px | 68,3 % | ✅ |
| inhaltsstoffe | 789 px | 87,6 % | ✅ |
| nachhaltigkeit | 369 px | 40,9 % | ✅ |
| stimmen | 489 px | 54,4 % | ✅ |
| faq | 708 px | 78,7 % | ✅ |
| newsletter | 329 px | 36,6 % | ✅ |

**Ergebnis: BESTANDEN** — keine Sektion über 100 dvh (Hero exakt 100 %, per
`min-height` gewollt; „über 100" wäre der Verstoß, exakt 100 ist zulässig).

## Gate 2 — OVERFLOW-GATE (kein horizontaler Overflow)

`window.scrollTo(50, 0)` → `window.scrollX === 0`.
Zusätzlich: `documentElement.scrollWidth (1425) <= innerWidth (1440)`.

**Ergebnis: BESTANDEN** — `scrollX = 0`, kein horizontaler Überlauf.
(Ursprünglich gab es einen fr-Grid-Overflow; mit `minmax(0, …fr)` behoben, s. A2.)

## Gate 3 — MOBIL-GATE (echter 390-px-Beweis, alle Features bedienbar)

Emulation: **390 × 844, deviceScaleFactor 2, isMobile + touch** (iPhone-Klasse).
Alle Kern-Features per synthetischer Interaktion geprüft (in gedrosselten Tabs
zuverlässiger als echte Klicks, siehe Team-Learning):

| Feature | Ergebnis |
|---|---|
| Kein horizontaler Overflow (`scrollX=0`, `docWidth=390`) | ✅ |
| Burger sichtbar, Menü öffnet + schließt | ✅ |
| Shop-Overlay öffnet, 25 Karten gerendert | ✅ |
| Kategorie-Filter (Serum → „4 Produkte") | ✅ |
| Schnellansicht-Modal öffnet | ✅ |
| Add-to-Cart aus Modal (Zähler → 1) | ✅ |
| Warenkorb-Drawer öffnet, 1 Zeile | ✅ |

Screenshot-Beweis: `docs/shots/a5-mobil-hero.png` (Hero + Nav bei 390 px).

**Ergebnis: BESTANDEN** — alle Features bei 390 px bedienbar, kein Overflow.

---

## Zusatz-Checks

- **Konsole:** 0 Fehler auf allen Seiten (nur der Bootstrap-Log).
- **Rechtstext-Seiten:** impressum/datenschutz/ki-hinweis liefern HTTP 200,
  aus dem Footer in 1 Klick erreichbar (Anforderung: ≤ 2 Klicks).
- **Kontrast:** Kerntext WCAG AA (ink 14,97:1, ink-soft 7,12:1, accent 5,89:1,
  Button-Text auf Grün 5,89:1, faint nach Fix ≥ 4,7:1).
