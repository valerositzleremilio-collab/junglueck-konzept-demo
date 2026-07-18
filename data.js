/* ============================================================================
   JUNGLÜCK — Konzept-Datenmodell (25 Produkte)
   Inoffizielles Portfolio-Konzept. Alle Preise/Größen sind ILLUSTRATIVE
   Konzeptdaten, keine echten Angaben. Wirkstoff-Nutzen bewusst neutral
   formuliert (keine Heilversprechen / keine erfundenen Prozent-Belege).
   Bildpfad-Schema: /bilder/produkt-<slug>.png  (Dateien folgen später;
   bis dahin CSS-Platzhalter im Marken-Look, kein Broken-Image).
============================================================================ */

const KATEGORIEN = [
  "Serum", "Öl", "Gel", "Gesicht", "Reinigung",
  "Creme", "Maske", "Lippen", "Körper", "Haar", "Sonne", "Set",
];

const HAUTTYPEN = [
  "alle", "Mischhaut", "trocken", "reif", "sensibel",
  "unrein", "gereizt", "fahle Haut", "müde Augen", "strapaziert", "fettig",
];

/* Jedes Produkt:
   id, slug, name, kurznutzen, wirkstoff, preis (EUR, Konzept),
   groesse, hauttyp, kategorie, bild, highlight (fürs Karussell) */
const PRODUKTE = [
  {
    id: 1, slug: "hyaluron-serum", name: "Hyaluron Serum",
    kurznutzen: "Polstert die Haut mit Feuchtigkeit auf.",
    wirkstoff: "Hyaluronsäure", preis: 14.99, groesse: "30 ml",
    hauttyp: "alle", kategorie: "Serum",
    bild: "/bilder/produkt-hyaluron-serum.png", highlight: true,
  },
  {
    id: 2, slug: "niacinamide-serum", name: "Niacinamide Serum",
    kurznutzen: "Für ein ebenmäßigeres, ruhigeres Hautbild.",
    wirkstoff: "Niacinamid 10 %", preis: 14.99, groesse: "30 ml",
    hauttyp: "Mischhaut", kategorie: "Serum",
    bild: "/bilder/produkt-niacinamide-serum.png", highlight: true,
  },
  {
    id: 3, slug: "vitamin-c-serum", name: "Vitamin-C Serum",
    kurznutzen: "Schenkt fahler Haut frische Ausstrahlung.",
    wirkstoff: "Vitamin C", preis: 16.99, groesse: "30 ml",
    hauttyp: "fahle Haut", kategorie: "Serum",
    bild: "/bilder/produkt-vitamin-c-serum.png", highlight: true,
  },
  {
    id: 4, slug: "retinal-serum", name: "Retinal Serum",
    kurznutzen: "Unterstützt die Haut über Nacht.",
    wirkstoff: "Retinal", preis: 19.99, groesse: "30 ml",
    hauttyp: "reif", kategorie: "Serum",
    bild: "/bilder/produkt-retinal-serum.png", highlight: false,
  },
  {
    id: 5, slug: "jojobaoel", name: "Jojobaöl",
    kurznutzen: "Leichtes Öl, das schnell einzieht.",
    wirkstoff: "Jojoba", preis: 12.99, groesse: "30 ml",
    hauttyp: "trocken", kategorie: "Öl",
    bild: "/bilder/produkt-jojobaoel.png", highlight: true,
  },
  {
    id: 6, slug: "arganoel", name: "Arganöl",
    kurznutzen: "Reichhaltige Pflege für trockene Stellen.",
    wirkstoff: "Argan", preis: 13.99, groesse: "30 ml",
    hauttyp: "trocken", kategorie: "Öl",
    bild: "/bilder/produkt-arganoel.png", highlight: false,
  },
  {
    id: 7, slug: "rosehip-oel", name: "Rosehip Öl",
    kurznutzen: "Pflegt beanspruchte, reife Haut.",
    wirkstoff: "Hagebutte", preis: 14.99, groesse: "30 ml",
    hauttyp: "reif", kategorie: "Öl",
    bild: "/bilder/produkt-rosehip-oel.png", highlight: false,
  },
  {
    id: 8, slug: "aloe-vera-gel", name: "Aloe Vera Gel",
    kurznutzen: "Kühlt und beruhigt gereizte Haut.",
    wirkstoff: "Aloe", preis: 11.99, groesse: "100 ml",
    hauttyp: "gereizt", kategorie: "Gel",
    bild: "/bilder/produkt-aloe-vera-gel.png", highlight: true,
  },
  {
    id: 9, slug: "rosenwasser", name: "Rosenwasser",
    kurznutzen: "Sanfte Erfrischung für sensible Haut.",
    wirkstoff: "Rose", preis: 10.99, groesse: "100 ml",
    hauttyp: "sensibel", kategorie: "Gesicht",
    bild: "/bilder/produkt-rosenwasser.png", highlight: false,
  },
  {
    id: 10, slug: "reinigungsgel", name: "Reinigungsgel",
    kurznutzen: "Reinigt mild, ohne die Haut zu spannen.",
    wirkstoff: "Panthenol", preis: 12.99, groesse: "150 ml",
    hauttyp: "alle", kategorie: "Reinigung",
    bild: "/bilder/produkt-reinigungsgel.png", highlight: false,
  },
  {
    id: 11, slug: "peeling-enzym", name: "Enzym-Peeling",
    kurznutzen: "Feines Peeling für einen klaren Teint.",
    wirkstoff: "Papain", preis: 15.99, groesse: "50 ml",
    hauttyp: "unrein", kategorie: "Reinigung",
    bild: "/bilder/produkt-peeling-enzym.png", highlight: false,
  },
  {
    id: 12, slug: "toner-bha", name: "BHA Toner",
    kurznutzen: "Klärt Poren bei unreiner Haut.",
    wirkstoff: "Salicylsäure", preis: 13.99, groesse: "100 ml",
    hauttyp: "unrein", kategorie: "Reinigung",
    bild: "/bilder/produkt-toner-bha.png", highlight: false,
  },
  {
    id: 13, slug: "feuchtigkeitscreme", name: "Feuchtigkeitscreme",
    kurznutzen: "Spendet trockener Haut Geschmeidigkeit.",
    wirkstoff: "Squalan", preis: 16.99, groesse: "50 ml",
    hauttyp: "trocken", kategorie: "Creme",
    bild: "/bilder/produkt-feuchtigkeitscreme.png", highlight: true,
  },
  {
    id: 14, slug: "nachtcreme", name: "Nachtcreme",
    kurznutzen: "Reichhaltige Pflege für die Nacht.",
    wirkstoff: "Peptide", preis: 18.99, groesse: "50 ml",
    hauttyp: "reif", kategorie: "Creme",
    bild: "/bilder/produkt-nachtcreme.png", highlight: false,
  },
  {
    id: 15, slug: "augencreme", name: "Augencreme",
    kurznutzen: "Frischt den Blick am Morgen auf.",
    wirkstoff: "Koffein", preis: 15.99, groesse: "15 ml",
    hauttyp: "müde Augen", kategorie: "Creme",
    bild: "/bilder/produkt-augencreme.png", highlight: false,
  },
  {
    id: 16, slug: "maske-ton", name: "Tonerde-Maske",
    kurznutzen: "Klärt und mattiert unreine Haut.",
    wirkstoff: "Heilerde", preis: 13.99, groesse: "100 ml",
    hauttyp: "unrein", kategorie: "Maske",
    bild: "/bilder/produkt-maske-ton.png", highlight: false,
  },
  {
    id: 17, slug: "maske-feucht", name: "Feuchtigkeitsmaske",
    kurznutzen: "Intensive Feuchtigkeit für trockene Haut.",
    wirkstoff: "Aloe & Hyaluron", preis: 14.99, groesse: "100 ml",
    hauttyp: "trocken", kategorie: "Maske",
    bild: "/bilder/produkt-maske-feucht.png", highlight: false,
  },
  {
    id: 18, slug: "lippenpflege", name: "Lippenpflege",
    kurznutzen: "Weiche Pflege für spröde Lippen.",
    wirkstoff: "Sheabutter", preis: 8.99, groesse: "10 ml",
    hauttyp: "alle", kategorie: "Lippen",
    bild: "/bilder/produkt-lippenpflege.png", highlight: false,
  },
  {
    id: 19, slug: "handcreme", name: "Handcreme",
    kurznutzen: "Zieht schnell ein, ohne zu fetten.",
    wirkstoff: "Mandel", preis: 9.99, groesse: "75 ml",
    hauttyp: "trocken", kategorie: "Körper",
    bild: "/bilder/produkt-handcreme.png", highlight: false,
  },
  {
    id: 20, slug: "koerperoel", name: "Körperöl",
    kurznutzen: "Pflegt die Haut nach dem Duschen.",
    wirkstoff: "Mandel", preis: 15.99, groesse: "100 ml",
    hauttyp: "alle", kategorie: "Körper",
    bild: "/bilder/produkt-koerperoel.png", highlight: false,
  },
  {
    id: 21, slug: "bodylotion", name: "Bodylotion",
    kurznutzen: "Leichte Feuchtigkeit für sensible Haut.",
    wirkstoff: "Hafer", preis: 12.99, groesse: "200 ml",
    hauttyp: "sensibel", kategorie: "Körper",
    bild: "/bilder/produkt-bodylotion.png", highlight: false,
  },
  {
    id: 22, slug: "haaroel", name: "Haaröl",
    kurznutzen: "Glättet strapazierte Längen.",
    wirkstoff: "Argan", preis: 13.99, groesse: "50 ml",
    hauttyp: "strapaziert", kategorie: "Haar",
    bild: "/bilder/produkt-haaroel.png", highlight: false,
  },
  {
    id: 23, slug: "kopfhaut-serum", name: "Kopfhaut-Serum",
    kurznutzen: "Erfrischt die Kopfhaut spürbar.",
    wirkstoff: "Koffein", preis: 16.99, groesse: "50 ml",
    hauttyp: "fettig", kategorie: "Haar",
    bild: "/bilder/produkt-kopfhaut-serum.png", highlight: false,
  },
  {
    id: 24, slug: "spf-30-fluid", name: "SPF 30 Tagesfluid",
    kurznutzen: "Leichter Sonnenschutz für jeden Tag.",
    wirkstoff: "Mineralfilter", preis: 17.99, groesse: "50 ml",
    hauttyp: "alle", kategorie: "Sonne",
    bild: "/bilder/produkt-spf-30-fluid.png", highlight: true,
  },
  {
    id: 25, slug: "set-morgenroutine", name: "Set „Morgenroutine“",
    kurznutzen: "Reinigung, Serum und Creme im Bundle.",
    wirkstoff: "Kombination", preis: 39.99, groesse: "3-teilig",
    hauttyp: "alle", kategorie: "Set",
    bild: "/bilder/produkt-set-morgenroutine.png", highlight: true,
  },
];

// Kleine Konsistenz-Selbstprüfung (nur Konsole, bricht nichts):
(function validateData() {
  const ids = new Set();
  const slugs = new Set();
  for (const p of PRODUKTE) {
    if (ids.has(p.id)) console.warn("[data] Doppelte ID:", p.id);
    if (slugs.has(p.slug)) console.warn("[data] Doppelter Slug:", p.slug);
    ids.add(p.id); slugs.add(p.slug);
    if (!KATEGORIEN.includes(p.kategorie))
      console.warn("[data] Unbekannte Kategorie:", p.kategorie, p.slug);
  }
  if (PRODUKTE.length !== 25)
    console.warn("[data] Erwartet 25 Produkte, gefunden:", PRODUKTE.length);
})();

window.JUNGLUECK_DATA = { PRODUKTE, KATEGORIEN, HAUTTYPEN };
