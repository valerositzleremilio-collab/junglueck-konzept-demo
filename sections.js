/* ============================================================================
   JUNGLÜCK — sections.js
   Aufgabe 2: Renderer & Verhalten für Sektionen 1–6
   (Highlights-Karussell · Routine-Quiz · Menschen-Strip · Signature-Draw)
   Aufgabe 3 ergänzt hier weitere Module (Shop/Cart/Quickview/Ingredients …).
   Registriert sich über window.JUNGLUECK_MODULES (Bootstrap ruft geordnet auf).
============================================================================ */
(function () {
  "use strict";
  window.JUNGLUECK_MODULES = window.JUNGLUECK_MODULES || [];

  /* ---------- SVG-Icons ---------- */
  const ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.5 0 5 3.5 3.5 6.5C19 15.65 12 20 12 20Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="2.6"/></svg>',
  };

  /* ---------- Platzhalter-Markup (kein Broken-Image) ---------- */
  const CAT_SHADE = {
    "Serum": 3, "Öl": 4, "Gel": 1, "Gesicht": 2, "Reinigung": 2, "Creme": 4,
    "Maske": 5, "Lippen": 1, "Körper": 3, "Haar": 4, "Sonne": 1, "Set": 5,
  };
  function placeholder(p) {
    const shade = CAT_SHADE[p.kategorie] || 3;
    return (
      '<div class="ph" data-shade="' + shade + '" role="img" aria-label="Produktbild ' + esc(p.name) + ' (Platzhalter)">' +
        '<span class="ph__tag">' + esc(p.wirkstoff) + '</span>' +
        '<span class="ph__flacon"></span>' +
        '<span class="ph__name">' + esc(p.name) + '</span>' +
      '</div>'
    );
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- Gemeinsame Produktkarte ---------- */
  function productCard(p, ctx, opts = {}) {
    const { State, euro } = ctx;
    const el = document.createElement("article");
    el.className = "product-card";
    el.setAttribute("role", "listitem");
    el.dataset.id = p.id;
    const pressed = State.inWishlist(p.id);
    el.innerHTML =
      '<div class="product-card__media">' +
        placeholder(p) +
        '<button class="product-card__wish" aria-pressed="' + pressed + '" aria-label="' + esc(p.name) + ' zur Wunschliste">' + ICON.heart + '</button>' +
      '</div>' +
      '<div class="product-card__body">' +
        '<span class="product-card__tag">' + esc(p.kategorie) + '</span>' +
        '<h3 class="product-card__name">' + esc(p.name) + '</h3>' +
        '<p class="product-card__benefit">' + esc(p.kurznutzen) + '</p>' +
        '<div class="product-card__foot">' +
          '<span class="product-card__price">' + euro(p.preis) + '<small>' + esc(p.groesse) + '</small></span>' +
          '<button class="product-card__add" aria-label="' + esc(p.name) + ' in den Warenkorb">' + ICON.plus + 'In den Korb</button>' +
        '</div>' +
      '</div>';

    // Wunschliste
    el.querySelector(".product-card__wish").addEventListener("click", (e) => {
      e.stopPropagation();
      State.toggleWishlist(p.id);
      const on = State.inWishlist(p.id);
      e.currentTarget.setAttribute("aria-pressed", on);
      ctx.toast(on ? p.name + " gemerkt." : p.name + " entfernt.", on);
    });
    // Warenkorb
    el.querySelector(".product-card__add").addEventListener("click", (e) => {
      e.stopPropagation();
      State.addToCart(p.id, 1);
      ctx.toast(p.name + " ist im Korb.");
    });
    // Schnellansicht: klickbare Media + sichtbare Affordance (Auge)
    if (opts.quickview) {
      const media = el.querySelector(".product-card__media");
      const peek = document.createElement("span");
      peek.className = "product-card__peek";
      peek.setAttribute("aria-hidden", "true");
      peek.innerHTML = ICON.eye + "<span>Schnellansicht</span>";
      media.appendChild(peek);
      media.style.cursor = "pointer";
      media.setAttribute("role", "button");
      media.setAttribute("tabindex", "0");
      media.setAttribute("aria-label", "Schnellansicht " + p.name);
      const open = () => opts.quickview(p);
      media.addEventListener("click", open);
      media.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    }
    return el;
  }
  window.JUNGLUECK_CARD = productCard; // von A3 (Shop) mitgenutzt
  window.JUNGLUECK_PLACEHOLDER = placeholder;
  window.JUNGLUECK_ESC = esc;
  window.JUNGLUECK_ICON = ICON;

  /* ======================================================= MODUL: HIGHLIGHTS */
  window.JUNGLUECK_MODULES.push(function highlightsModule(ctx) {
    const { PRODUKTE, $ } = ctx;
    const track = $('[data-mount="highlights"]');
    if (!track) return;
    const items = PRODUKTE.filter((p) => p.highlight);
    // noscript entfernen, Karten mounten
    track.querySelectorAll("noscript").forEach((n) => n.remove());
    items.forEach((p) => track.appendChild(productCard(p, ctx, { quickview: window.JUNGLUECK_QUICKVIEW })));

    // Pfeile
    document.querySelectorAll('.carousel-prev, .carousel-next').forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = document.getElementById(btn.dataset.car);
        if (!t) return;
        const step = t.querySelector(".product-card")?.offsetWidth || 260;
        t.scrollBy({ left: btn.classList.contains("carousel-next") ? step + 16 : -(step + 16), behavior: ctx.prefersReduced ? "auto" : "smooth" });
      });
    });

    // Drag-to-scroll (Pointer)
    enableDrag(track, ctx);
  });

  function enableDrag(track, ctx) {
    let down = false, startX = 0, startScroll = 0, moved = 0;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true; moved = 0;
      startX = e.clientX; startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.abs(dx);
      if (moved > 4) track.classList.add("is-dragging");
      track.scrollLeft = startScroll - dx;
    });
    const end = (e) => {
      if (!down) return;
      down = false;
      track.classList.remove("is-dragging");
      try { track.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
    // Klick nach Drag unterdrücken
    track.addEventListener("click", (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  }
  window.JUNGLUECK_DRAG = enableDrag;

  /* ======================================================= MODUL: ROUTINE-QUIZ */
  window.JUNGLUECK_MODULES.push(function quizModule(ctx) {
    const { PRODUKTE, $ } = ctx;
    const mount = $('[data-mount="quiz"]');
    if (!mount) return;
    mount.querySelectorAll("noscript").forEach((n) => n.remove());

    const QUESTIONS = [
      {
        q: "Wie fühlt sich deine Haut gerade an?",
        key: "haut",
        opts: [
          { label: "Trocken, spannt", val: "trocken", hint: "zieht schnell ein" },
          { label: "Mal so, mal so", val: "Mischhaut", hint: "T-Zone glänzt" },
          { label: "Schnell gereizt", val: "sensibel", hint: "reagiert empfindlich" },
          { label: "Unrein, glänzt", val: "unrein", hint: "verstopfte Poren" },
        ],
      },
      {
        q: "Was wünschst du dir am meisten?",
        key: "ziel",
        opts: [
          { label: "Mehr Feuchtigkeit", val: "feuchtigkeit", hint: "praller, weicher" },
          { label: "Frische Ausstrahlung", val: "ausstrahlung", hint: "wacher Teint" },
          { label: "Mehr Ruhe", val: "ruhe", hint: "weniger Rötung" },
          { label: "Klareres Hautbild", val: "klarheit", hint: "weniger Unreinheiten" },
        ],
      },
      {
        q: "Wie viel Zeit hast du morgens?",
        key: "zeit",
        opts: [
          { label: "Wenig, das Nötigste", val: "minimal", hint: "2 Schritte" },
          { label: "Ich nehme mir Zeit", val: "komplett", hint: "3 Schritte" },
        ],
      },
    ];

    const ZIEL_WIRK = {
      feuchtigkeit: ["Hyaluronsäure", "Squalan", "Aloe", "Aloe & Hyaluron"],
      ausstrahlung: ["Vitamin C", "Koffein"],
      ruhe: ["Aloe", "Rose", "Hafer", "Panthenol"],
      klarheit: ["Niacinamid 10 %", "Salicylsäure", "Papain", "Heilerde"],
    };

    const answers = {};
    let step = 0;

    function scoreProduct(p) {
      let s = 0;
      if (p.hauttyp === answers.haut) s += 3;
      if (p.hauttyp === "alle") s += 1;
      const wl = ZIEL_WIRK[answers.ziel] || [];
      if (wl.some((w) => p.wirkstoff.includes(w))) s += 3;
      return s;
    }

    function recommend() {
      const scored = PRODUKTE
        .filter((p) => p.kategorie !== "Set")
        .map((p) => ({ p, s: scoreProduct(p) }))
        .sort((a, b) => b.s - a.s);

      const wantCleanse = answers.zeit === "komplett";
      const picks = [];
      const takeBy = (pred) => {
        const hit = scored.find((x) => !picks.includes(x.p) && pred(x.p));
        if (hit) picks.push(hit.p);
      };
      if (wantCleanse) takeBy((p) => p.kategorie === "Reinigung");
      takeBy((p) => p.kategorie === "Serum" || p.kategorie === "Öl");
      takeBy((p) => p.kategorie === "Creme" || p.kategorie === "Gel" || p.kategorie === "Maske");
      // auffüllen bis 3 mit besten verbleibenden
      for (const x of scored) { if (picks.length >= 3) break; if (!picks.includes(x.p)) picks.push(x.p); }
      return picks.slice(0, wantCleanse ? 3 : 2);
    }

    function renderStep() {
      const total = QUESTIONS.length;
      const cur = QUESTIONS[step];
      const dots = QUESTIONS.map((_, i) =>
        '<div class="quiz__dot ' + (i < step ? "is-done" : "") + '"><span></span></div>').join("");
      mount.innerHTML =
        '<div class="quiz__progress" aria-hidden="true">' + dots + '</div>' +
        '<div class="quiz__step">' +
          '<p class="quiz__q">' + esc(cur.q) + '</p>' +
          '<div class="quiz__options">' +
            cur.opts.map((o) =>
              '<button class="quiz__opt" data-val="' + esc(o.val) + '">' + esc(o.label) +
              '<small>' + esc(o.hint) + '</small></button>').join("") +
          '</div>' +
          (step > 0 ? '<button class="quiz__back">Zurück</button>' : "") +
        '</div>';
      mount.setAttribute("aria-live", "polite");
      mount.querySelectorAll(".quiz__opt").forEach((b) =>
        b.addEventListener("click", () => {
          answers[cur.key] = b.dataset.val;
          if (step < total - 1) { step++; renderStep(); }
          else renderResult();
        }));
      const back = mount.querySelector(".quiz__back");
      back && back.addEventListener("click", () => { step--; renderStep(); });
    }

    function renderResult() {
      const picks = recommend();
      const cards = picks.map((p) =>
        '<div class="reco">' +
          placeholder(p) +
          '<span class="reco__name">' + esc(p.name) + '</span>' +
          '<span class="reco__wirk">' + esc(p.wirkstoff) + '</span>' +
          '<button class="reco__add" data-id="' + p.id + '">In den Korb</button>' +
        '</div>').join("");
      mount.innerHTML =
        '<div class="quiz__result">' +
          '<div class="quiz__result-head">' +
            '<p class="eyebrow">Deine Routine</p>' +
            '<h3>Das würde zu dir passen.</h3>' +
            '<p class="muted">Ein Vorschlag, kein Muss. Du kennst deine Haut am besten.</p>' +
          '</div>' +
          '<div class="quiz__recos">' + cards + '</div>' +
          '<button class="quiz__back" id="quiz-restart">Nochmal starten</button>' +
        '</div>';
      mount.querySelectorAll(".reco__add").forEach((b) =>
        b.addEventListener("click", () => {
          const p = PRODUKTE.find((x) => x.id === +b.dataset.id);
          ctx.State.addToCart(p.id, 1);
          ctx.toast(p.name + " ist im Korb.");
        }));
      $("#quiz-restart").addEventListener("click", () => { step = 0; renderStep(); });
    }

    renderStep();
  });

  /* ======================================================= MODUL: MENSCHEN */
  window.JUNGLUECK_MODULES.push(function menschenModule(ctx) {
    const { $ } = ctx;
    const strip = $('[data-mount="menschen"]');
    if (!strip) return;
    strip.querySelectorAll("noscript").forEach((n) => n.remove());

    // Konzept-Personen (Namen locale-appropriate; keine echten Personen)
    const PEOPLE = [
      { name: "Lena Brandt", role: "Gründerin", quote: "Ich wollte Pflege, die ich meiner kleinen Schwester ohne Beipackzettel erklären kann." },
      { name: "Mats Ohlsen", role: "Formulierung", quote: "Ein Wirkstoff, richtig dosiert, macht mehr als zehn, die sich gegenseitig im Weg stehen." },
      { name: "Feriha Aydın", role: "Community", quote: "Die besten Ideen kommen aus euren Nachrichten. Wir lesen wirklich jede." },
      { name: "Jonas Krüger", role: "Nachhaltigkeit", quote: "Das Glas zurückzunehmen war Aufwand. Es nicht zu tun wäre bequem gewesen." },
      { name: "Pia Reinhardt", role: "Kund:innenservice", quote: "Wenn etwas nicht passt, sagen wir das ehrlich. Auch wenn du dann nichts kaufst." },
    ];

    PEOPLE.forEach((person) => {
      const el = document.createElement("div");
      el.className = "person";
      el.setAttribute("role", "listitem");
      el.setAttribute("tabindex", "0");
      const initials = person.name.split(" ").map((w) => w[0]).join("");
      el.innerHTML =
        '<div class="person__bg" aria-hidden="true"></div>' +
        '<span class="person__mono" aria-hidden="true">' + esc(initials) + '</span>' +
        '<div class="person__body">' +
          '<span class="person__name">' + esc(person.name) + '</span>' +
          '<span class="person__role">' + esc(person.role) + '</span>' +
          '<div class="person__reveal"><p class="person__quote">' + esc(person.quote) + '</p></div>' +
        '</div>';
      // Touch / kein Hover: Toggle per Klick + Tastatur
      const toggle = () => {
        const open = el.classList.contains("is-open");
        strip.querySelectorAll(".person.is-open").forEach((o) => o.classList.remove("is-open"));
        if (!open) el.classList.add("is-open");
      };
      el.addEventListener("click", toggle);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
      });
      strip.appendChild(el);
    });
  });

  /* ---------- Helper: whenInView (IO + rect + scroll-Fallback) ---------- */
  function whenInView(el, cb, threshold = 0.3) {
    if (!el) return;
    let done = false;
    const fire = () => { if (done) return; done = true; cleanup(); cb(); };
    const inZone = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      return r.top < vh * (1 - threshold * 0.4) && r.bottom > vh * 0.1;
    };
    let io;
    function cleanup() {
      if (io) io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
    function onScroll() { if (inZone()) fire(); }
    if (inZone()) { fire(); return; }
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((ents) => { ents.forEach((e) => { if (e.isIntersecting) fire(); }); }, { threshold });
      io.observe(el);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
  window.JUNGLUECK_INVIEW = whenInView;

  /* ======================================================= MODUL: INHALTSSTOFFE */
  window.JUNGLUECK_MODULES.push(function ingredientsModule(ctx) {
    const { PRODUKTE, $ } = ctx;
    const list = $('[data-mount="ingr-list"]');
    const detail = $('[data-mount="ingr-detail"]');
    if (!list || !detail) return;

    // Wirkstoffe (neutral beschrieben, keine Heilversprechen)
    const INGR = [
      { key: "Hyaluronsäure", what: "der Feuchtigkeits-Schwamm", body: "Bindet Wasser in der obersten Hautschicht und lässt sie praller wirken. Verträgt sich mit fast allem.", gut: "trockene und müde Haut" },
      { key: "Niacinamid", what: "der Ausgleicher", body: "Eine Form von Vitamin B3. Wird gern genutzt, um das Hautbild ebenmäßiger und ruhiger wirken zu lassen.", gut: "Mischhaut und Unreinheiten" },
      { key: "Vitamin C", what: "der Aufwecker", body: "Ein Antioxidans, das fahler Haut frische Ausstrahlung geben soll. Morgens unter Sonnenschutz am schönsten.", gut: "fahle, müde Haut" },
      { key: "Squalan", what: "die leichte Pflege", body: "Ein pflanzlicher Feuchtigkeitsspender, der schnell einzieht, ohne zu fetten. Fühlt sich seidig an.", gut: "trockene Haut" },
      { key: "Aloe", what: "die Beruhigende", body: "Kühlt und spendet Feuchtigkeit. Ein Klassiker für Momente, in denen die Haut etwas Ruhe braucht.", gut: "gereizte, sensible Haut" },
      { key: "Retinal", what: "die Nachtschicht", body: "Eine Form von Vitamin A. Langsam einschleichen, abends anwenden, tagsüber Sonnenschutz nicht vergessen.", gut: "reife Haut" },
      { key: "Salicylsäure", what: "die Poren-Klärerin", body: "Eine BHA, die in die Pore hineinwirkt und sie freier wirken lässt. Sanft dosiert statt aggressiv.", gut: "unreine Haut" },
    ];

    INGR.forEach((ing) => {
      const prods = PRODUKTE.filter((p) => p.wirkstoff.includes(ing.key));
      ing.prods = prods.map((p) => p.name);
    });

    let active = 0;
    list.innerHTML = INGR.map((ing, i) =>
      '<li role="presentation"><button class="ingr__item" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '">' +
        '<span class="ingr__item-dot" aria-hidden="true"></span>' +
        '<span class="ingr__item-label">' + esc(ing.key) + '</span>' +
        '<span class="ingr__item-use">' + esc(ing.what) + '</span>' +
      '</button></li>').join("");

    function renderDetail(i) {
      const ing = INGR[i];
      detail.classList.add("is-swapping");
      const paint = () => {
        detail.innerHTML =
          '<span class="ingr__detail-tag">Wirkstoff</span>' +
          '<h3 class="ingr__detail-name">' + esc(ing.key) + '</h3>' +
          '<p class="ingr__detail-what">' + esc(ing.what) + '</p>' +
          '<p class="ingr__detail-body">' + esc(ing.body) + '</p>' +
          '<span class="ingr__detail-tag">Gut bei</span>' +
          '<p class="ingr__detail-body">' + esc(ing.gut) + '</p>' +
          (ing.prods.length ? '<span class="ingr__detail-tag">Steckt drin</span><div class="ingr__detail-prods">' +
            ing.prods.map((n) => '<span class="ingr__detail-prod">' + esc(n) + '</span>').join("") + '</div>' : "");
        requestAnimationFrame(() => detail.classList.remove("is-swapping"));
        setTimeout(() => detail.classList.remove("is-swapping"), 60);
      };
      setTimeout(paint, ctx.prefersReduced ? 0 : 140);
    }

    list.querySelectorAll(".ingr__item").forEach((btn) => {
      const select = () => {
        const i = +btn.dataset.i;
        if (i === active) return;
        active = i;
        list.querySelectorAll(".ingr__item").forEach((b) => b.setAttribute("aria-selected", b === btn));
        renderDetail(i);
      };
      btn.addEventListener("click", select);
      btn.addEventListener("mouseenter", () => { if (window.matchMedia("(hover:hover)").matches) select(); });
    });
    renderDetail(0);
  });

  /* ======================================================= MODUL: BAUM-ZÄHLER */
  window.JUNGLUECK_MODULES.push(function treeCounterModule(ctx) {
    const { $ } = ctx;
    const numEl = document.querySelector("[data-count-to]");
    const mount = $('[data-mount="tree-counter"]');
    if (!numEl || !mount) return;
    const target = +numEl.dataset.countTo;
    const fmt = (n) => Math.round(n).toLocaleString("de-DE");

    function run() {
      // No-JS zeigt bereits die Zielzahl (im HTML). Animation setzt erst hier auf 0.
      if (ctx.prefersReduced) { numEl.textContent = fmt(target); return; }
      numEl.textContent = "0";
      const dur = 1600, start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      function tick(now) {
        const t = Math.min(1, (now - start) / dur);
        numEl.textContent = fmt(target * ease(t));
        if (t < 1) requestAnimationFrame(tick);
        else numEl.textContent = fmt(target);
      }
      requestAnimationFrame(tick);
      // Fallback ohne rAF (Hintergrund-Tab): nach Timeout Endwert setzen
      setTimeout(() => { if (numEl.textContent === "0") numEl.textContent = fmt(target); }, dur + 400);
    }
    whenInView(mount, run, 0.35);
  });

  /* ======================================================= MODUL: STIMMEN */
  window.JUNGLUECK_MODULES.push(function stimmenModule(ctx) {
    const { $ } = ctx;
    const stage = $('[data-mount="stimmen"]');
    const dotsEl = $('[data-mount="stimmen-dots"]');
    if (!stage || !dotsEl) return;

    const STIMMEN = [
      { q: "Endlich verstehe ich, was ich mir ins Gesicht schmiere. Ein Wirkstoff, ein Satz Erklärung, fertig.", name: "Carla Neumann", role: "seit zwei Jahren dabei" },
      { q: "Das Serum hat mich überzeugt. Dass ich das Glas zurückgeben kann, hält mich hier.", name: "Deniz Yilmaz", role: "aus Hamburg" },
      { q: "Keine zwölf Fläschchen mehr im Bad. Zwei Produkte, die tun, was sie sollen.", name: "Miriam Fuchs", role: "Mischhaut-Team" },
      { q: "Mir gefällt, dass sie ehrlich sagen, wenn etwas nicht für mich ist. Das schafft Vertrauen.", name: "Ted Achterberg", role: "empfindliche Haut" },
    ];

    stage.innerHTML = STIMMEN.map((s, i) =>
      '<figure class="stimme ' + (i === 0 ? "is-active" : "") + '" data-i="' + i + '">' +
        '<blockquote class="stimme__quote">' + esc(s.q) + '</blockquote>' +
        '<figcaption class="stimme__by"><span class="stimme__name">' + esc(s.name) + '</span>' +
        '<span class="stimme__role">' + esc(s.role) + '</span></figcaption>' +
      '</figure>').join("");
    dotsEl.innerHTML = STIMMEN.map((_, i) =>
      '<button class="stimmen__dot ' + (i === 0 ? "is-active" : "") + '" role="tab" aria-selected="' + (i === 0) + '" aria-label="Stimme ' + (i + 1) + '" data-i="' + i + '"></button>').join("");

    const slides = Array.from(stage.querySelectorAll(".stimme"));
    const dots = Array.from(dotsEl.querySelectorAll(".stimmen__dot"));
    let idx = 0, timer = null;

    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => { d.classList.toggle("is-active", i === idx); d.setAttribute("aria-selected", i === idx); });
    }
    function next() { go(idx + 1); }
    function start() { if (ctx.prefersReduced) return; stop(); timer = setInterval(next, 5200); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    dots.forEach((d) => d.addEventListener("click", () => { go(+d.dataset.i); start(); }));
    const sec = document.getElementById("stimmen");
    sec.addEventListener("mouseenter", stop);
    sec.addEventListener("mouseleave", start);
    sec.addEventListener("focusin", stop);
    // Autoplay erst starten, wenn sichtbar
    whenInView(stage, start, 0.4);
  });

  /* ======================================================= MODUL: FAQ */
  window.JUNGLUECK_MODULES.push(function faqModule(ctx) {
    const { $ } = ctx;
    const mount = $('[data-mount="faq"]');
    if (!mount) return;
    const FAQ = [
      { q: "Ist das der echte JUNGLÜCK-Shop?", a: "Nein. Das hier ist ein inoffizielles Konzept-Redesign fürs Portfolio von Oddomode. Zur echten Marke geht es über den Link im Footer." },
      { q: "Warum nur ein Wirkstoff pro Produkt?", a: "Weil du dann weißt, was du benutzt und warum. Ein Wirkstoff, richtig dosiert, kann mehr als eine lange Liste, die sich gegenseitig ausbremst." },
      { q: "Wie funktioniert das mit dem Glas?", a: "Braunglas kommt zurück, wird gereinigt und neu befüllt. In diesem Konzept ist der Kreislauf als Idee dargestellt." },
      { q: "Sind die Produkte vegan?", a: "In diesem Konzept: ja, durchgehend vegan und ohne Mikroplastik. Reale Angaben findest du bei der echten Marke." },
      { q: "Stimmen die Preise?", a: "Die Preise hier sind illustrative Konzeptwerte, damit der Shop realistisch wirkt. Keine echten Verkaufspreise." },
      { q: "Kann ich wirklich bestellen?", a: "Nein, es gibt keinen echten Checkout. Warenkorb und Wunschliste zeigen nur, wie sich das Einkaufen anfühlen würde." },
    ];
    mount.innerHTML = FAQ.map((f, i) =>
      '<div class="faq__item">' +
        '<button class="faq__q" id="faq-q-' + i + '" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
          '<span>' + esc(f.q) + '</span><span class="faq__icon" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="faq__a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '"><div><p>' + esc(f.a) + '</p></div></div>' +
      '</div>').join("");
    mount.querySelectorAll(".faq__q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        mount.querySelectorAll(".faq__q").forEach((b) => b.setAttribute("aria-expanded", "false"));
        btn.setAttribute("aria-expanded", open ? "false" : "true");
      });
    });
  });

  /* ======================================================= MODUL: NEWSLETTER */
  window.JUNGLUECK_MODULES.push(function newsletterModule(ctx) {
    const { $ } = ctx;
    const form = $('[data-mount="newsletter"]');
    if (!form) return;
    const input = form.querySelector(".field__input");
    const msg = form.querySelector(".field__msg");
    const submit = form.querySelector(".newsletter__submit");
    const label = form.querySelector(".newsletter__submit-label");
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

    function setMsg(text, kind) {
      msg.textContent = text;
      msg.classList.toggle("is-error", kind === "error");
      msg.classList.toggle("is-ok", kind === "ok");
      input.setAttribute("aria-invalid", kind === "error" ? "true" : "false");
    }

    input.addEventListener("input", () => { if (input.getAttribute("aria-invalid") === "true" && emailOk(input.value)) setMsg("", null); });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) { setMsg("Bitte gib deine E-Mail ein.", "error"); input.focus(); return; }
      if (!emailOk(v)) { setMsg("Diese E-Mail sieht noch nicht ganz richtig aus.", "error"); input.focus(); return; }
      // loading
      submit.dataset.state = "loading";
      label.textContent = "Moment ...";
      setMsg("", null);
      setTimeout(() => {
        submit.dataset.state = "";
        label.textContent = "Abonniert";
        setMsg("Danke. In diesem Konzept schicken wir natürlich keine echten Mails.", "ok");
        input.value = "";
        setTimeout(() => { label.textContent = "Abonnieren"; }, 2600);
      }, 900);
    });
  });

  /* ======================================================= MODUL: SIGNATURE-DRAW */
  window.JUNGLUECK_MODULES.push(function signatureModule(ctx) {
    const strokes = document.querySelectorAll(".sig__stroke");
    if (!strokes.length) return;
    if (ctx.prefersReduced || !("IntersectionObserver" in window)) {
      strokes.forEach((s) => s.classList.add("is-drawn"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-drawn"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    strokes.forEach((s) => {
      const r = s.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.top < vh * 0.85 && r.bottom > 0) s.classList.add("is-drawn"); // Sofort-Fallback
      else io.observe(s);
    });
  });
})();
