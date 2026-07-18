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
  function placeholder(p) {
    return (
      '<div class="ph" role="img" aria-label="Produktbild ' + esc(p.name) + ' (Platzhalter)">' +
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
    // Schnellansicht (in A3 aktiviert; hier vorbereitet)
    if (opts.quickview) {
      el.querySelector(".product-card__media").addEventListener("click", () => opts.quickview(p));
      el.querySelector(".product-card__media").style.cursor = "pointer";
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
