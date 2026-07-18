# JUNGLÜCK — Konzept & Art Direction (gesperrt)

> **Inoffizielles Konzept-Redesign** für das Oddomode-Portfolio.
> Keine Verbindung zur JUNGLÜCK GmbH. Alle Produktdaten, Preise und Zahlen sind
> **illustrative Konzeptdaten**, keine echten Angaben.

---

## 0. Vorbemerkung — Teil 0 wurde abgeleitet

Der Original-Prompt enthielt an der Stelle „[HIER TEIL 0 KOMPLETT EINFÜGEN]"
nur den Platzhalter. Emilio hat entschieden: **Ableitung durch mich.**
Dieses Kapitel 1 ist damit meine Rekonstruktion des Briefings aus
JUNGLÜCK-Markenwissen + den in den Aufgaben eingebetteten Regeln.
**Alle Annahmen sind mit `» Annahme:` markiert** und können von Emilio
jederzeit überschrieben werden, ohne dass die Token-Architektur bricht.

---

## 1. Abgeleitetes Teil 0 (Briefing)

### 1.1 Marke
JUNGLÜCK ist eine deutsche Naturkosmetik-Marke (Köln). Kern: ehrliche,
reduzierte Pflege, ein Wirkstoff pro Produkt, kein überladenes Versprechen.
Recyceltes Braunglas, vegan, ohne Mikroplastik, Tierversuchs-frei.
Tonalität: nah, warm, du-per-du, „Weil du schön bist" — keine Angst-Kosmetik,
kein Anti-Aging-Druck.

**Markenkern in einem Satz:** *Ein Wirkstoff, ehrlich erklärt, in warmer
Sprache — Pflege ohne Versprechen, die du nicht halten kannst.*

### 1.2 Rechtsrahmen
- Reines **Konzept** fürs Portfolio → Footer trägt Konzept-Disclaimer +
  Link auf `junglueck.de` (das echte Original).
- Betreiber der Konzeptseite = **Oddomode / Emilio** → Impressum + Datenschutz
  über den `dsgvo-websites`-Skill (Aufgabe 5), nie ins Leere verlinken.
- **KI-Kennzeichnung**: Hinweis, dass die Seite als KI-gestütztes Konzept
  entstand.
- **Keine erfundenen Wirk-Claims / keine Heilversprechen** (HWG/UWG): Wirkstoffe
  werden neutral beschrieben („unterstützt", „spendet"), keine medizinischen
  Zusagen, keine erfundenen Prozent-Zahlen als Beleg.

### 1.3 Gefühl (Art Direction Nord)
Warm, ruhig, menschlich. 90 % stiller Raum, EIN grüner Akzent. Es soll sich
anfühlen wie ein heller Morgen im Bad mit Pflanzen am Fenster — nicht wie ein
Klinik-Shop und nicht wie ein Agentur-Template. Handgemachtes darf sichtbar
sein (das Signature-Motiv).

» Annahme: warmes Off-White statt reinweiß; grüner Marken-Akzent statt des
generischen Beige-Messing-Looks (bewusst gegen den AI-Default gewählt).

### 1.4 Die 25 Produkte (illustrative Konzeptdaten)
Schema je Produkt: **Name · Kurznutzen · Wirkstoff · Preis · Größe · Hauttyp ·
Kategorie · Bildpfad `/bilder/produkt-<slug>.png`**.
Preise/Größen sind plausibel gewählt, aber **Konzeptwerte**.

| # | Produkt | Wirkstoff | Kategorie | Hauttyp |
|---|---------|-----------|-----------|---------|
| 1 | Hyaluron Serum | Hyaluronsäure | Serum | alle |
| 2 | Niacinamide Serum | Niacinamid 10 % | Serum | Mischhaut |
| 3 | Vitamin-C Serum | Vitamin C | Serum | fahle Haut |
| 4 | Retinal Serum | Retinal | Serum | reif |
| 5 | Jojobaöl | Jojoba | Öl | trocken |
| 6 | Arganöl | Argan | Öl | trocken |
| 7 | Rosehip Öl | Hagebutte | Öl | reif |
| 8 | Aloe Vera Gel | Aloe | Gel | gereizt |
| 9 | Rosenwasser | Rose | Gesicht | sensibel |
| 10 | Reinigungsgel | Panthenol | Reinigung | alle |
| 11 | Peeling Enzym | Papain | Reinigung | unrein |
| 12 | Toner BHA | Salicylsäure | Reinigung | unrein |
| 13 | Feuchtigkeitscreme | Squalan | Creme | trocken |
| 14 | Nachtcreme | Peptide | Creme | reif |
| 15 | Augencreme | Koffein | Creme | müde Augen |
| 16 | Gesichtsmaske Ton | Heilerde | Maske | unrein |
| 17 | Gesichtsmaske Feucht | Aloe & Hyaluron | Maske | trocken |
| 18 | Lippenpflege | Sheabutter | Lippen | alle |
| 19 | Handcreme | Mandel | Körper | trocken |
| 20 | Körperöl | Mandel | Körper | alle |
| 21 | Bodylotion | Hafer | Körper | sensibel |
| 22 | Haaröl | Argan | Haar | strapaziert |
| 23 | Kopfhaut Serum | Koffein | Haar | fettig |
| 24 | SPF 30 Tagesfluid | Mineralfilter | Sonne | alle |
| 25 | Set „Morgenroutine" | Kombination | Set | alle |

Volles Datenmodell (Preis, Größe, Kurznutzen, Slug) entsteht in Aufgabe 1
als JS-Objekt.

### 1.5 Seitenstruktur (One-Pager + Shop-Overlay)
`index.html` mit 11 Sektionen, jede ≤ 100 dvh:
1. **Hero** — Markenmoment + primärer CTA
2. **Versprechen** — die 4 Haltungslinien der Marke
3. **Highlights** — Karussell der Lieblingsprodukte
4. **Routine-Finder** — kurzes Quiz → Produktempfehlung
5. **Philosophie** — „ein Wirkstoff, ehrlich erklärt"
6. **Menschen** — die Menschen hinter/vor der Marke
7. **Inhaltsstoffe** — die Wirkstoffe zum Anfassen
8. **Nachhaltigkeit** — Baum-Zähler + Glas-Kreislauf
9. **Stimmen** — Kund:innen-Zitate
10. **FAQ** — Akkordeon
11. **Newsletter + Footer** — Anmeldung + Rechts-Links

**Shop-Ansicht** als Vollbild-Overlay (kein Seitenwechsel): alle 25 Produkte,
Filter, Suche, Schnellansicht, Warenkorb, Wunschliste.

### 1.6 Features
Warenkorb mit Zähler · Wunschliste (Herz) · Schnellansicht-Modal · Filter
(Kategorie / Hauttyp / Preis) · Suche · Routine-Quiz · Baum-Zähler ·
FAQ-Akkordeon · Newsletter mit Inline-Validierung.

### 1.7 Hard Rules (verbindlich)
- Jede Sektion **≤ 100 dvh** (Shop-Liste ausgenommen), per `getBoundingClientRect` geprüft.
- **Kein horizontaler Overflow** (`scrollX === 0` nach `scrollTo(50,0)`).
- Ohne JS ist die Seite **voll lesbar** (Reveals starten sichtbar / No-JS-Fallback).
- **60 fps** Ziel, nur `transform`/`opacity` animiert.
- **Blur nie auf dem fixed Header selbst**, immer auf einem `::before`-Pseudo.
- Kein Broken-Image: fehlende Produktbilder → CSS-Platzhalter im Marken-Look.
- `prefers-reduced-motion` respektiert.
- **Zero Em-Dash** (—) im gesamten sichtbaren Text.
- Kein erfundener Zahlen-Claim als Wirknachweis.
- **EIN** Akzent, **EIN** Easing-System, **EINE** Radius-Skala, **EIN** Theme.

---

## 2. Design-Tokens (GESPERRT)

### 2.1 Farbe — warm, ~90 % ruhig + EIN Akzent (Grün)
```css
--bg:        #FBFAF7;  /* warmes Off-White (Grundfläche) */
--bg-2:      #F1EEE6;  /* warmer Sand (alternierende Sektionen) */
--bg-3:      #E8E3D7;  /* tiefere warme Fläche (Karten/Divider) */
--ink:       #23241F;  /* warmes Anthrazit (Fließtext, nicht #000) */
--ink-soft:  #55564E;  /* gedämpfter Text */
--ink-faint: #8A8B80;  /* Labels, Captions */
--line:      #DED9CD;  /* Hairlines */
--accent:      #3E6B4E; /* JUNGLÜCK-Grün, tief & gedämpft (<80% sat) */
--accent-deep: #2C4E39; /* Hover / gepresst */
--accent-tint: #E7EFE6; /* grüner Wash (Badges, Highlights) */
--accent-ink:  #FBFAF7; /* Text auf Grün (Kontrast AA geprüft) */
```
Akzent wird über **die ganze Seite** identisch verwendet (Color Consistency
Lock): CTAs, Signature-Stroke, aktive Zustände, Zähler-Badges. Kein zweiter
Akzent taucht auf.

Kontrast-Check (Aufgabe 5 verifiziert): `--ink` auf `--bg` und
`--accent-ink` auf `--accent` ≥ WCAG AA.

### 2.2 Typografie — Grotesk + warme Serif für Emphasis
- **Sans / Grotesk (alles):** *Hanken Grotesk* — warm, humanistisch, freundlich.
  Fallback: `"Segoe UI", system-ui, sans-serif`.
- **Serif für Emphasis (nur einzelne Wörter):** *Newsreader Italic* — warm,
  editorial. Bewusst **nicht** Fraunces / Instrument Serif (AI-Tells).
  Fallback: `Georgia, "Times New Roman", serif`.
- Serif erscheint **nur** als kursives Emphasis-Wort in Headlines, nie als
  Fließtext. Begründung fürs Mischen: der Brief nennt explizit eine „warme
  Serif für Emphasis" — bewusste, gesperrte Marken-Entscheidung, kein Zufall.

```css
--font-sans: "Hanken Grotesk", "Segoe UI", system-ui, -apple-system, sans-serif;
--font-serif: "Newsreader", Georgia, "Times New Roman", serif;

--t-impact: clamp(2.7rem, 6.5vw, 5.25rem); /* Hero-Statement */
--t-h1:     clamp(2.2rem, 4.6vw, 3.6rem);  /* Sektions-H1 */
--t-h2:     clamp(1.5rem, 2.6vw, 2.1rem);  /* Sub-Headline */
--t-h3:     1.25rem;
--t-body:   1.0625rem;   /* 17px, line-height 1.65, max 65ch */
--t-small:  0.9375rem;
--t-label:  0.78rem;     /* uppercase, tracking 0.14em — rationiert! */
```
Emphasis-Regel: Betonte Wörter = *Newsreader Italic* in `--accent`.
Eyebrow-Labels sind **rationiert** (max 1 pro 3 Sektionen, mechanisch geprüft).

### 2.3 Spacing — 4px-Basis
```css
--s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px; --s-5: 24px;
--s-6: 32px; --s-7: 48px; --s-8: 64px; --s-9: 96px; --s-10: 128px;
--maxw: 1240px;        /* Content-Container */
--pad:  clamp(20px, 5vw, 64px); /* seitliches Padding */
```

### 2.4 DAS eine Easing-System
```css
--ease:       cubic-bezier(0.23, 1, 0.32, 1);   /* Enter/Exit (stark ease-out) */
--ease-inout: cubic-bezier(0.77, 0, 0.175, 1);  /* Bewegung/Morph auf dem Screen */
--ease-soft:  cubic-bezier(0.32, 0.72, 0, 1);   /* Drawer/Overlay (iOS-Kurve) */
--d-fast: 160ms;  --d-base: 320ms;  --d-slow: 600ms;
```
Regel (emil-design-eng): Enter/Exit → `--ease`; Bewegung → `--ease-inout`;
Overlays/Drawer → `--ease-soft`. **Nie** `ease-in` auf UI. Nie `transition: all`.
UI-Interaktionen < 300 ms; Overlays 320–600 ms.

### 2.5 Radien — EINE Skala (weich, organisch)
```css
--r-sm:   10px;  /* Inputs, kleine Chips */
--r-md:   16px;  /* Karten */
--r-lg:   22px;  /* große Flächen, Modals */
--r-pill: 999px; /* Buttons, Filter-Pills, Badges */
```
Shape Consistency Lock: Buttons & Pills = `--r-pill`, Karten = `--r-md`,
Inputs = `--r-sm`. Diese Regel gilt überall, keine Ausnahmen.

### 2.6 Schatten (auf Hintergrund getönt, nie reines Schwarz)
```css
--shadow-sm: 0 1px 2px rgba(43,42,33,0.06);
--shadow-md: 0 8px 30px rgba(43,42,33,0.09);
--shadow-lg: 0 24px 60px rgba(43,42,33,0.14);
```

### 2.7 Z-Index-Skala (dokumentiert, kein Spam)
```
--z-nav: 100 · --z-overlay: 200 · --z-modal: 300 · --z-toast: 400 · --z-grain: 500
```

---

## 3. Sektions-Plan mit je EINER Interaktion (Duplikat-geprüft)

| # | Sektion | Layout-Familie | Geplante Interaktion / Motion |
|---|---------|----------------|-------------------------------|
| 1 | Hero | Asymmetric Split | Gestaffelter Entrance + sanfte Parallax des Blatt-Motivs |
| 2 | Versprechen | Vertikaler Stack, 4 Linien | Zeilen-Masken-Reveal beim Scrollen (clip-path) |
| 3 | Highlights | Horizontales Karussell | Drag / Scroll-Snap Coverflow |
| 4 | Routine-Finder | Zentrierte Quiz-Karte | Stateful Mehrschritt-Quiz mit morphendem Ergebnis |
| 5 | Philosophie | Bild + Text Split | Clip-path Bild-Enthüllung auf Scroll |
| 6 | Menschen | Horizontale Strip-Reihe | Hover-Expand-Akkordeon (Streifen weiten sich) |
| 7 | Inhaltsstoffe | Liste + Detailpanel | Hover/Click Spotlight → Detail tauscht |
| 8 | Nachhaltigkeit | Zahlen-Bühne | Count-up Baum-Zähler beim Ins-Bild-Scrollen |
| 9 | Stimmen | Einzel-Zitat-Bühne | Auto-Crossfade + Blur Zitat-Rotator |
| 10 | FAQ | Akkordeon-Liste | Höhen+Opacity-Akkordeon (eins offen) |
| 11 | Newsletter+Footer | Split + Footer-Grid | Formular-Zustandszyklus (idle→loading→success/error) |

**Duplikat-Check:** 11 verschiedene Interaktionsmuster, kein Muster wiederholt.
Layout-Familien: Split, Stack, Karussell, Quiz-Karte, Bild-Split, Strip,
Liste+Panel, Zahlen-Bühne, Zitat-Bühne, Akkordeon, Footer-Grid = 11 verschieden.
Nur **ein** horizontales Karussell (Highlights); Stimmen ist Crossfade, kein
zweites Karussell. **Kein** Marquee auf der Seite.

Motion-Rechtfertigung je Sektion (jede Animation kommuniziert etwas):
Hero=Hierarchie/Ankunft · Versprechen=Storytelling-Sequenz · Highlights=Breite
erfahrbar · Quiz=Feedback/State · Philosophie=Enthüllung passt zur Aussage ·
Menschen=Fokus-Lenkung · Inhaltsstoffe=State-Wechsel · Nachhaltigkeit=Wert
sichtbar machen · Stimmen=sanfter Wechsel · FAQ=State · Newsletter=Feedback.

---

## 4. NAV-Spezifikation (explizit)

**Struktur (Desktop, eine Zeile, Höhe 68px, ≤ 80px):**
`[JUNGLÜCK Wortmarke]  ·  Produkte  Routine  Philosophie  Nachhaltigkeit  ·  [Suche] [Wunschliste♥ n] [Warenkorb⌾ n]`

- **Scroll-Verhalten:** Über dem Hero transparent (Text in `--ink`, lesbar auf
  hellem Hero). Ab Scroll > 40px: Header bekommt `--bg`-Fläche (leicht
  transluzent) + untere Hairline + `--shadow-sm`, gleitet minimal kompakter
  (68→60px). Beim Hochscrollen an den Top-Rand: zurück zu transparent.
- **Warenkorb-Zähler:** Badge oben rechts am Bag-Icon, zeigt Anzahl. Bei
  „In den Warenkorb" **Scale-Bounce** (spring, 1→1.25→1, `--ease`) + kurze
  Toast-Bestätigung. Zähler = Summe der Mengen.
- **Wunschliste-Zähler:** analog am Herz-Icon.
- **Mobiles Menü:** Hamburger → Vollbild-Overlay. **Blur liegt auf dem
  `::before`-Pseudo des Overlays**, NICHT auf dem fixed Header selbst
  (Hard Rule + Team-Learning). Menüpunkte staffeln sich ein (stagger 50 ms).
  Body-Scroll-Lock während offen. Schließen per X, Escape, oder Link-Klick.
- **Backdrop-Blur-Fallback:** unter `prefers-reduced-transparency` → solide
  `--bg`-Fläche statt Blur.

**Verhalten dokumentiert für Screenreader:** `aria-label` an Icon-Buttons,
Zähler als `aria-live="polite"`, mobiles Menü mit Focus-Trap + `aria-expanded`.

---

## 5. Das Signature-Element (handschriftliches Motiv)

**Motiv:** ein handgezeichneter grüner Pinselstrich — organisch, leicht
unregelmäßig, wie mit einem Brush unter ein Wort gesetzt. Umgesetzt als Inline-
**SVG-Pfad** mit `stroke-dasharray`-Draw-Animation (kein Font-Risiko, skaliert
sauber, on-brand „handgemacht"). Farbe immer `--accent`.

**Kehrt genau 3× wieder:**
1. **Hero** — als Unterstreichung des kursiven Emphasis-Worts (z. B. *ehrlich*),
   zeichnet sich beim Load.
2. **Philosophie** — als Betonungsstrich unter dem Schlüsselwort der
   Kern-Aussage, zeichnet sich beim Ins-Bild-Scrollen.
3. **Newsletter/Footer** — als kleiner Schwung neben „Weil du schön bist",
   zeichnet sich beim Reveal.

Reduced-Motion: Strich erscheint sofort vollständig (kein Draw), bleibt sichtbar.

---

## 6. Technischer Rahmen
- Pure HTML / CSS / JS (kein Framework, kein npm) — Oddomode-Standardstack.
- Motion primär via CSS-Transitions + IntersectionObserver-Reveals.
  Optional GSAP/ScrollTrigger nur wo Scrub echt gebraucht wird (Philosophie).
- Fonts via Google Fonts `<link>` mit `preconnect` (Konzept-Demo, kein
  Produktions-Client) + robuste System-Fallbacks.
- Reveal-Robustheit: IntersectionObserver **mit** `getBoundingClientRect`-
  Sofort-Fallback (Team-Learning: Hintergrund-Tabs feuern IO/rAF unzuverlässig)
  → ohne JS und in Hintergrund-Tabs bleibt Inhalt sichtbar.

---

*Aufgabe 0 abgeschlossen — Tokens & Konzept gesperrt. Ab hier wird gebaut.*
