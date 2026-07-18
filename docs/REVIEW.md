# JUNGLÜCK — Wärme-Pass (Aufgabe 4)

Skills: `/review-animations` · `/impeccable` · `/taste-skill`
Ziel: Fühlt sich die Seite MENSCHLICH an oder nach Agentur-Template? Kalte/generische
Stellen aufwerten, Copy in warmem Du-Ton prüfen, ≥10 echte Schwächen finden und fixen.

---

## 1. Gesamteindruck (menschlich vs. Template)

Nach dem ersten Gesamt-Erleben wirkte die Seite bereits warm und kohärent (grüner
Akzent durchgängig, Signature-Pinselstrich 3×, Newsreader-Italic dezent als
menschliche Stimme). Der Template-Verdacht entstand an genau **drei** Stellen, die
sich kalt/generisch anfühlten und jetzt aufgewertet sind:

- **Menschen-Sektion** wirkte wie fünf flache Farbrechtecke → organischer
  Blatt-Schimmer, variierte Verläufe, diagonale Blatt-Silhouette.
- **Produkt-Platzhalter** waren 25× exakt derselbe Flakon → kategoriebasierte
  Grün-Tönung bringt Rhythmus, bleibt aber im EINEN Akzent-System.
- **Faint-Captions** waren blass und leblos (auch a11y-Problem) → dunkler,
  lesbarer, präsenter.

Der Rest trägt sich menschlich: kurze, ehrliche Sätze, keine Angst-Kosmetik.

## 2. Copy-Audit (Du-Ton, ehrlich, kein Marketing-Deutsch)

Jeder sichtbare String wurde gegengelesen. Ergebnis: durchgehend **Du-Ansprache**,
kurze ehrliche Sätze, keine Marketing-Floskeln („elevate/seamless/revolutionär"
kommen nicht vor), keine erfundenen Wirk-Prozente als Beleg. Konzept-/Illustrations-
Charakter ist an Preis (Konzept-Preis), Baum-Zähler (illustrative Konzept-Zahl) und
FAQ offen ausgewiesen. Zwei Copy-Eingriffe:

- Ein grammatikalisch kaputter Testimonial-Satz („…zurückzugeben mich geblieben
  lassen") → klar umgeschrieben (bereits in A3 gefixt, hier bestätigt).
- Menschen-Anleitung „Fahr mit der Maus" ignorierte Touch → „Fahr über eine Person
  oder tipp sie an".

## 3. Die Funde (Before / After / Warum)

| # | Before | After | Warum |
| --- | --- | --- | --- |
| 1 | `<title>… — Naturkosmetik…` (Em-Dash) | `<title>… · Naturkosmetik…` | Titel ist im Browser-Tab sichtbar → Zero-Em-Dash-Hard-Rule verletzt. |
| 2 | `--ink-faint: #8A8B80` (3,31:1 auf bg) | `--ink-faint: #64655C` (>=4,7:1) | Captions/Small-Text fielen WCAG AA (4,5:1) durch; jetzt lesbar. |
| 3 | 25 identische Platzhalter-Flakons | `data-shade` 1–5 je Kategorie | Shop-Grid wirkte monoton/kühl; Tonvariation gibt Rhythmus, EIN Akzent bleibt. |
| 4 | `.person__bg` flacher Farbverlauf | + Blatt-Schimmer-`::after` + Blatt-Silhouette | Fünf flache Blöcke lasen sich als Template; jetzt organisch/warm. |
| 5 | „Fahr mit der Maus über eine Person" | „Fahr über eine Person oder tipp sie an" | Touch-Nutzer haben keine Maus; Anleitung war für sie falsch. |
| 6 | `.ingr__item` animiert `padding-left` | animiert `transform: translateX` | Layout-Property-Animation (Reflow) → GPU-Transform, kein Jank. |
| 7 | Primär-Button nur Farbwechsel bei Hover | + `translateY(-1px)` + Schatten (nur hover:hover) | Taktiles Feedback (emil-design-eng): Button reagiert spürbar. |
| 8 | `.stimmen__stage aria-live="polite"` + Auto-Rotation | `aria-live` entfernt | Auto-Wechsel alle 5,2 s hätte Screenreader im Sekundentakt zugespamt. |
| 9 | Media nur per JS-Cursor klickbar, unsichtbar | sichtbarer „Schnellansicht"-Peek + `role=button`/Tastatur | Schnellansicht war nicht auffindbar und nicht tastaturbedienbar. |
| 10 | `.faq__a` ohne semantische Zuordnung | `role="region"` + `aria-labelledby` + Button-`id` | Antworten waren für Screenreader nicht mit ihrer Frage verknüpft. |
| 11 | Baum-Zähler zeigt ohne JS „0" | HTML trägt echte Zahl, JS nullt nur zum Animieren | Ohne JS stand „0 Bäume" (wirkte kaputt); jetzt No-JS-fest. |
| 12 | Karten-Fuß: „14,99 €"/„In den Korb" brachen um | `white-space: nowrap` (in A3 gefixt) | Zweizeiliger Preis/CTA wirkte gebrochen; hier bestätigt. |

## 4. Was für die echte Produktion noch fehlt (ehrlich)

Kein Bildgenerierungs-Tool verfügbar → Produkt- und Menschen-Bilder sind bewusst
markenkonforme CSS-Kompositionen mit klarer TODO-Markierung im Markup
(`TODO(Foto): …`). In Produktion würden echte Produktfotografie und echte Portraits
diese Platzhalter ersetzen. Alles andere (Interaktion, Motion, Copy, a11y) ist final.

## 5. Motion-Review (kurz, /review-animations-Linse)

- Nur `transform`/`opacity`/`clip-path`/`grid-rows` animiert; keine `top/left/width`
  im Hot-Path (Ausnahmen dokumentiert und gerechtfertigt).
- Enter/Exit → `--ease` (stark ease-out); Bewegung → `--ease-inout`; Overlays →
  `--ease-soft`. Kein `ease-in` auf UI, kein `transition: all`.
- `prefers-reduced-motion` gated: Signature, Floats, Count-up, Crossfade, Akkordeon.
- Jede Animation ist motiviert (Hierarchie/Storytelling/Feedback/State) — kein
  Motion „nur weil es geht". Genau EIN Karussell, KEIN Marquee.
