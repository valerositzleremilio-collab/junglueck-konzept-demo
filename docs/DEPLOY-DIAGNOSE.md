# Deploy-Diagnose — 500 FUNCTION_INVOCATION_FAILED

Aufgabe 0 (nur gelesen/gemessen, keine Code-Änderung).

## Vorab-Korrektur der Prämisse
Der Auftrag beschrieb ein **Next.js-Projekt** mit `npm ci && npm run build && npm start`,
Env-Variablen, Server Components. Das trifft **nicht** zu:
`junglueck-konzept` ist eine **reine statische Seite** — kein `package.json`, kein
`vercel.json`, kein `next.config`, kein Build, kein Framework. Die Next.js-spezifischen
Diagnoseschritte laufen hier ins Leere und wurden durch die tatsächlich passenden
Messungen (Vercel `inspect` + Runtime-`logs`) ersetzt.

## Exakte Fehlermeldung + Stacktrace
```
λ GET /
ReferenceError: window is not defined
    at file:///var/task/app.mjs:4:46
    at file:///var/task/app.mjs:224:3
    at ModuleJob.run (node:internal/modules/esm/module_job:439:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
Node.js process exited with exit status: 1
```
Client sieht: `A server error has occurred / FUNCTION_INVOCATION_FAILED` (HTTP 500).
Quelle: `vercel logs https://junglueck-konzept.vercel.app --scope oddomode`.

## Betroffene Route(n)
**Die ganze App**, nicht eine einzelne Route: die Function wird für jeden Request
aufgerufen (`GET /`, `GET /favicon.ico`, …) und crasht jedes Mal beim Modul-Laden,
bevor überhaupt Routing passiert. Betrifft alle Aliasse des Deployments
`dpl_4JtxaxM4FMaWD5VnPvHNDUUDGcha`. Sichtbar wird der 500 nur auf
`junglueck-konzept.vercel.app` (ohne Schutz); die `-oddomode`-Aliasse liefern 302
(Deployment Protection/SSO) und erreichen die Function gar nicht erst.

## `vercel inspect` — der Kern
```
Builds
  ┌ .        [0ms]
  └── λ index (3.26KB) [iad1]     ← Serverless-Function, dürfte bei statischer Seite NICHT existieren
```

## Identifizierte Ursache
1. `app.js` (Zeile 4) ist **Browser-Code**: `const {…} = window.JUNGLUECK_DATA;` —
   korrekt für den Browser, wo `window` existiert.
2. Beim CLI-Deploy (`vercel deploy --prod`) gab es **keine statische Konfiguration**.
   Vercels Zero-Config-Erkennung interpretiert Root-Dateien mit typischen Server-Entry-
   Namen (`app.js`, `server.mjs`) ohne `package.json`/Framework als Node-Server-
   Entrypoint und baut daraus eine **Serverless-Function** (`λ index`) statt die Dateien
   als statische Assets auszuliefern.
3. Zur Laufzeit läuft dieser Browser-Code in Node (Serverless) → `window` ist dort
   `undefined` → `ReferenceError` → Prozess-Exit 1 → 500.

**Ausgeschlossen** (geprüft): Next.js/Build-Fehler (kein Build vorhanden), fehlende
Env-Variable (keine benötigt), Case-Sensitivity der Imports (kein modularer Import),
Node-Version-Mismatch (24.x, egal), fehlende Dependency (keine).

## Geplanter Fix (minimal-invasiv, kein Code-Eingriff)
Die Seite ist korrekt — nur der Deploy muss **statisch** erzwungen werden, damit
Vercel gar keine Function baut:
- `vercel.json` hinzufügen: `framework: null`, `buildCommand: null`,
  `installCommand: null`, `outputDirectory: "."` → Vercel liefert alle Dateien als
  statische Assets aus, `app.js` wird als Asset (nicht als Function) serviert.
- `.vercelignore` hinzufügen: `server.mjs` (lokaler Dev-Server) und `docs/` aus dem
  Deployment ausnehmen — entfernt den Node-Server-Detektions-Trigger und hält das
  Deployment schlank. `server.mjs` bleibt lokal für die Verifikation erhalten.
- **Keine** Änderung an `app.js`/`index.html`/`styles.css` etc. (funktioniert im
  Browser korrekt).

Danach neu deployen (CLI, Projekt ist nicht git-verbunden) und live jede Route auf
200 prüfen.
