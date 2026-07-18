# JUNGLÜCK — Konzept-Redesign

Inoffizielles Konzept-Redesign der Naturkosmetik-Marke JUNGLÜCK, gebaut fürs
Oddomode-Portfolio. **Kein Bezug zur JUNGLÜCK GmbH.** Alle Produkte, Preise und
Zahlen sind illustrative Konzeptdaten.

**Live:** https://junglueck-konzept.vercel.app

## Was das ist (Architektur)
Eine **reine statische Website** — pures HTML/CSS/JS, **kein Framework, kein
Build-Schritt, keine Server-Runtime, keine Serverless-Functions**.

```
index.html            Startseite (11 Sektionen + Shop-Overlay)
impressum.html        DSGVO-Rechtstexte
datenschutz.html
ki-hinweis.html
styles.css            gesamtes Design-System (Tokens in :root)
data.js               25 Produkte (Datenmodell)
app.js                Bootstrap (State, Nav, Cart/Wishlist, Reveals)  ← BROWSER-Code (nutzt window)
sections.js           Sektions-Renderer (Karussell, Quiz, …)
shop.js               Shop/Cart/Quickview
server.mjs            NUR lokaler Dev-Server (nicht Teil des Deployments)
docs/                 Projekt-Doku (Konzept, Review, Gates, Deploy-Diagnose)
```

## Voraussetzungen
- **Env-Variablen:** keine. Die Seite braucht keinerlei Umgebungsvariablen.
- **Node-Version:** für die *Website* irrelevant (statisch, läuft im Browser).
  Der optionale lokale Dev-Server `server.mjs` braucht Node ≥ 18 (getestet mit 20/24).
- **Fonts:** aktuell Google Fonts via `<link>`. Vor echtem Live-Betrieb self-hosten.

## Lokal testen (Produktions-Äquivalent)
Es gibt keinen Build. „Produktion" = exakt dieselben statischen Dateien, nur über
HTTP statt `file://` ausgeliefert:

```bash
node server.mjs          # startet http://localhost:4330
# dann im Browser: /, /impressum.html, /datenschutz.html, /ki-hinweis.html
```
Alternativ jeder statische Server (z. B. `npx serve .`).

## Deploy (Vercel) — wichtig
Das Projekt wird als **statische Seite** ausgeliefert. Die `vercel.json` erzwingt das:

```json
{ "framework": null, "buildCommand": null, "installCommand": null, "outputDirectory": "." }
```

**Warum das nötig ist (Regression-Schutz):** Ohne diese Config interpretierte
Vercels Zero-Config-Erkennung Root-Dateien mit Server-Entry-Namen (`app.js`,
`server.mjs`) als Node-Server und baute daraus eine **Serverless-Function**. Diese
führte den Browser-Code server-seitig aus → `ReferenceError: window is not defined`
→ **500 FUNCTION_INVOCATION_FAILED**. Die `vercel.json` (static) + `.vercelignore`
(schließt `server.mjs`/`docs/` aus) verhindern das. **Nicht entfernen.**
Details: [`docs/DEPLOY-DIAGNOSE.md`](docs/DEPLOY-DIAGNOSE.md).

Deploy (Projekt ist CLI-verbunden, nicht Git):
```bash
npx vercel deploy --prod
```

## Offene Punkte vor „echtem" Live-Betrieb
- Impressum-Platzhalter (`[BITTE ERGÄNZEN]`: Anschrift, Name, USt-ID) ausfüllen.
- Google Fonts self-hosten (entfernt IP-Übertragung an Google).
- Echte Produktfotos/Portraits statt der CSS-Platzhalter.
