/* ============================================================================
   JUNGLÜCK — shop.js
   Aufgabe 3: Shop-Overlay (Filter/Suche/Grid) · Schnellansicht-Modal ·
   Warenkorb-Drawer · Wunschliste-Ansicht.
   Nutzt Factory/Helper aus sections.js. Registriert Modul via JUNGLUECK_MODULES.
============================================================================ */
(function () {
  "use strict";
  window.JUNGLUECK_MODULES = window.JUNGLUECK_MODULES || [];

  const $ = (s, c = document) => (c || document).querySelector(s);
  const $$ = (s, c = document) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => window.JUNGLUECK_ESC ? window.JUNGLUECK_ESC(s) : String(s);
  const euro = (n) => n.toFixed(2).replace(".", ",") + " €";

  let lastFocused = null;

  /* -------------------------------------------------- QUICKVIEW (Top-Level) */
  // Früh definiert, damit auch A2-Karten sie beim Erstellen referenzieren können.
  function openQuickview(p) {
    const State = window.JUNGLUECK_STATE;
    const toast = window.JUNGLUECK_TOAST || (() => {});
    const wrap = $("#quickview");
    const panel = $('[data-mount="quickview-panel"]');
    if (!wrap || !panel || !p) return;
    const pressed = State.inWishlist(p.id);
    panel.innerHTML =
      '<button class="icon-btn qv__close" aria-label="Schließen">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
      '</button>' +
      '<div class="qv">' +
        '<div class="qv__media">' + window.JUNGLUECK_PLACEHOLDER(p) + '</div>' +
        '<div class="qv__body">' +
          '<span class="qv__tag">' + esc(p.kategorie) + '</span>' +
          '<h3 class="qv__name">' + esc(p.name) + '</h3>' +
          '<p class="qv__wirk">' + esc(p.wirkstoff) + '</p>' +
          '<p class="qv__benefit">' + esc(p.kurznutzen) + '</p>' +
          '<div class="qv__facts">' +
            '<span class="qv__fact">' + esc(p.groesse) + '</span>' +
            '<span class="qv__fact">Für ' + esc(p.hauttyp) + '</span>' +
            '<span class="qv__fact">Vegan</span>' +
          '</div>' +
          '<p class="qv__price">' + euro(p.preis) + '<small>Konzept-Preis</small></p>' +
          '<div class="qv__actions">' +
            '<button class="btn btn--primary" data-qv-add>In den Korb</button>' +
            '<button class="btn btn--ghost" data-qv-wish aria-pressed="' + pressed + '">' + (pressed ? "Gemerkt" : "Merken") + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    panel.querySelector(".qv__close").addEventListener("click", closeQuickview);
    panel.querySelector("[data-qv-add]").addEventListener("click", () => {
      State.addToCart(p.id, 1); toast(p.name + " ist im Korb.");
    });
    panel.querySelector("[data-qv-wish]").addEventListener("click", (e) => {
      State.toggleWishlist(p.id);
      const on = State.inWishlist(p.id);
      e.currentTarget.setAttribute("aria-pressed", on);
      e.currentTarget.textContent = on ? "Gemerkt" : "Merken";
      toast(on ? p.name + " gemerkt." : p.name + " entfernt.", on);
    });

    lastFocused = document.activeElement;
    wrap.dataset.open = "true";
    wrap.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => panel.querySelector(".qv__close").focus(), 40);
  }
  function closeQuickview() {
    const wrap = $("#quickview");
    if (!wrap) return;
    wrap.dataset.open = "false";
    wrap.setAttribute("aria-hidden", "true");
    if (!isAnyOverlayOpen()) document.body.style.overflow = "";
    if (lastFocused) { try { lastFocused.focus(); } catch (_) {} }
  }
  window.JUNGLUECK_QUICKVIEW = openQuickview;

  function isAnyOverlayOpen() {
    return ["#shop", "#cart"].some((s) => { const el = $(s); return el && el.dataset.open === "true"; });
  }

  /* ============================================================= HAUPT-MODUL */
  window.JUNGLUECK_MODULES.push(function shopModule(ctx) {
    const { PRODUKTE, KATEGORIEN, State, toast, prefersReduced } = ctx;

    /* ---------------- QUICKVIEW: Scrim + Escape ---------------- */
    $("#qv-scrim") && $("#qv-scrim").addEventListener("click", closeQuickview);

    /* =========================== WARENKORB-DRAWER =========================== */
    const cart = $("#cart");
    const cartScrim = $("#cart-scrim");
    const cartBody = $('[data-mount="cart-body"]');
    const cartFoot = $('[data-mount="cart-foot"]');

    function openCart() {
      lastFocused = document.activeElement;
      cart.dataset.open = "true"; cart.setAttribute("aria-hidden", "false");
      cartScrim.dataset.open = "true"; cartScrim.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => $("#close-cart").focus(), 40);
    }
    function closeCart() {
      cart.dataset.open = "false"; cart.setAttribute("aria-hidden", "true");
      cartScrim.dataset.open = "false"; cartScrim.setAttribute("aria-hidden", "true");
      if (!isAnyOverlayOpen() && $("#quickview").dataset.open !== "true") document.body.style.overflow = "";
      if (lastFocused) { try { lastFocused.focus(); } catch (_) {} }
    }
    $("#open-cart").addEventListener("click", openCart);
    $("#close-cart").addEventListener("click", closeCart);
    cartScrim.addEventListener("click", closeCart);

    const BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';

    function renderCart() {
      const rows = State.cart;
      if (!rows.length) {
        cartBody.innerHTML = '<div class="cart__empty">' + BAG + '<p>Dein Korb ist noch leer.</p>' +
          '<button class="btn btn--ghost" id="cart-to-shop">Produkte ansehen</button></div>';
        cartFoot.innerHTML = "";
        const b = $("#cart-to-shop"); b && b.addEventListener("click", () => { closeCart(); openShop(); });
        return;
      }
      cartBody.innerHTML = rows.map((row) => {
        const p = PRODUKTE.find((x) => x.id === row.id);
        return '<div class="cart-line" data-id="' + p.id + '">' +
          '<div class="cart-line__media">' + window.JUNGLUECK_PLACEHOLDER(p) + '</div>' +
          '<div class="cart-line__info">' +
            '<span class="cart-line__name">' + esc(p.name) + '</span>' +
            '<span class="cart-line__meta">' + esc(p.wirkstoff) + ' · ' + esc(p.groesse) + '</span>' +
            '<div class="cart-line__ctrls">' +
              '<div class="qty">' +
                '<button data-dec aria-label="Weniger">−</button>' +
                '<span aria-live="polite">' + row.menge + '</span>' +
                '<button data-inc aria-label="Mehr">+</button>' +
              '</div>' +
              '<button class="cart-line__remove" data-rm>Entfernen</button>' +
            '</div>' +
          '</div>' +
          '<span class="cart-line__price">' + euro(p.preis * row.menge) + '</span>' +
        '</div>';
      }).join("");
      cartBody.querySelectorAll(".cart-line").forEach((line) => {
        const id = +line.dataset.id;
        const row = State.cart.find((r) => r.id === id);
        line.querySelector("[data-inc]").addEventListener("click", () => State.setMenge(id, row.menge + 1));
        line.querySelector("[data-dec]").addEventListener("click", () => State.setMenge(id, row.menge - 1));
        line.querySelector("[data-rm]").addEventListener("click", () => State.removeFromCart(id));
      });
      cartFoot.innerHTML =
        '<div class="cart__sum"><span class="cart__sum-label">Zwischensumme</span>' +
        '<span class="cart__sum-total">' + euro(State.cartTotal()) + '</span></div>' +
        '<button class="btn btn--primary cart__checkout" id="cart-checkout">Zur Kasse</button>' +
        '<p class="cart__note">Konzept-Demo, kein echter Checkout und keine Zahlung.</p>';
      $("#cart-checkout").addEventListener("click", () => toast("Konzept-Demo: hier würde die Kasse starten.", false));
    }
    State.on(renderCart);
    renderCart();

    /* =============================== SHOP-OVERLAY =============================== */
    const shop = $("#shop");
    const grid = $('[data-mount="shop-grid"]');
    const searchInput = $("#shop-search");
    const countEl = $("#shop-count");
    const emptyEl = $("#shop-empty");
    const priceRange = $("#price-range");
    const priceOut = $("#price-out");
    const resultBar = $(".shop__result-bar");

    const filters = { kategorie: new Set(), hauttyp: new Set(), maxPrice: 40, q: "", wishlistOnly: false };

    // Filter-Chips: Kategorie
    const katMount = $('[data-mount="filter-kategorie"]');
    katMount.innerHTML = KATEGORIEN.map((k) =>
      '<button class="filter-chip" role="button" aria-pressed="false" data-kat="' + esc(k) + '">' + esc(k) + '</button>').join("");
    katMount.querySelectorAll(".filter-chip").forEach((chip) =>
      chip.addEventListener("click", () => toggleSet(filters.kategorie, chip.dataset.kat, chip)));

    // Filter-Chips: Hauttyp (aus Daten, unique)
    const hauttypen = Array.from(new Set(PRODUKTE.map((p) => p.hauttyp)));
    const htMount = $('[data-mount="filter-hauttyp"]');
    htMount.innerHTML = hauttypen.map((h) =>
      '<button class="filter-chip" role="button" aria-pressed="false" data-ht="' + esc(h) + '">' + esc(h) + '</button>').join("");
    htMount.querySelectorAll(".filter-chip").forEach((chip) =>
      chip.addEventListener("click", () => toggleSet(filters.hauttyp, chip.dataset.ht, chip)));

    function toggleSet(set, val, chip) {
      if (set.has(val)) set.delete(val); else set.add(val);
      chip.setAttribute("aria-pressed", set.has(val));
      applyFilters();
    }

    // Preis-Range
    priceRange.addEventListener("input", () => {
      filters.maxPrice = +priceRange.value;
      priceOut.textContent = filters.maxPrice + " €";
      applyFilters();
    });

    // Suche
    searchInput.addEventListener("input", () => { filters.q = searchInput.value.trim().toLowerCase(); applyFilters(); });

    // Reset
    $("#filter-reset").addEventListener("click", resetFilters);
    function resetFilters() {
      filters.kategorie.clear(); filters.hauttyp.clear();
      filters.maxPrice = 40; filters.q = ""; filters.wishlistOnly = false;
      priceRange.value = 40; priceOut.textContent = "40 €"; searchInput.value = "";
      $$(".filter-chip", shop).forEach((c) => c.setAttribute("aria-pressed", "false"));
      updateWishToggle();
      applyFilters();
    }

    // Wunschliste-Umschalter im Result-Bar
    const wishToggle = document.createElement("button");
    wishToggle.className = "filter-chip";
    wishToggle.setAttribute("aria-pressed", "false");
    wishToggle.addEventListener("click", () => {
      filters.wishlistOnly = !filters.wishlistOnly;
      updateWishToggle(); applyFilters();
    });
    resultBar.appendChild(wishToggle);
    function updateWishToggle() {
      wishToggle.textContent = "♥ Merkliste (" + State.wishlist.length + ")";
      wishToggle.setAttribute("aria-pressed", filters.wishlistOnly);
    }
    State.on(updateWishToggle);
    updateWishToggle();

    function matches(p) {
      if (filters.wishlistOnly && !State.inWishlist(p.id)) return false;
      if (filters.kategorie.size && !filters.kategorie.has(p.kategorie)) return false;
      if (filters.hauttyp.size && !filters.hauttyp.has(p.hauttyp)) return false;
      if (p.preis > filters.maxPrice) return false;
      if (filters.q) {
        const hay = (p.name + " " + p.wirkstoff + " " + p.kategorie + " " + p.kurznutzen + " " + p.hauttyp).toLowerCase();
        if (!hay.includes(filters.q)) return false;
      }
      return true;
    }

    function applyFilters() {
      const list = PRODUKTE.filter(matches);
      grid.innerHTML = "";
      list.forEach((p) => grid.appendChild(window.JUNGLUECK_CARD(p, ctx, { quickview: openQuickview })));
      countEl.textContent = list.length + (list.length === 1 ? " Produkt" : " Produkte");
      emptyEl.hidden = list.length !== 0;
      window.JUNGLUECK_REVEAL && window.JUNGLUECK_REVEAL();
    }

    // Karten bei Wunschlisten-Änderung aktualisieren (aria-pressed der Herzen)
    State.on(() => {
      $$(".product-card", grid).forEach((card) => {
        const wb = card.querySelector(".product-card__wish");
        if (wb) wb.setAttribute("aria-pressed", State.inWishlist(+card.dataset.id));
      });
      if (filters.wishlistOnly) applyFilters();
    });

    function openShop(opts = {}) {
      lastFocused = document.activeElement;
      if (opts.wishlist) { filters.wishlistOnly = true; updateWishToggle(); }
      applyFilters();
      shop.dataset.open = "true"; shop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInput.focus(), 60);
    }
    function closeShop() {
      shop.dataset.open = "false"; shop.setAttribute("aria-hidden", "true");
      if (!isAnyOverlayOpen() && $("#quickview").dataset.open !== "true") document.body.style.overflow = "";
      if (lastFocused) { try { lastFocused.focus(); } catch (_) {} }
    }
    window.JUNGLUECK_OPENSHOP = openShop;

    // Öffner
    $("#open-shop").addEventListener("click", () => openShop());
    $("#close-shop").addEventListener("click", closeShop);
    $("#open-wishlist").addEventListener("click", () => openShop({ wishlist: true }));
    $$("[data-open-shop]").forEach((b) => b.addEventListener("click", () => openShop()));
    const menuShop = $("#menu-shop-link");
    menuShop && menuShop.addEventListener("click", (e) => {
      e.preventDefault();
      const menu = $("#mobile-menu");
      if (menu) { menu.dataset.open = "false"; $("#open-menu") && $("#open-menu").setAttribute("aria-expanded", "false"); }
      openShop();
    });

    // Erstbefüllung
    applyFilters();

    /* ------------------------- GLOBAL: Escape schließt Overlays ------------------------- */
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if ($("#quickview").dataset.open === "true") return closeQuickview();
      if (cart.dataset.open === "true") return closeCart();
      if (shop.dataset.open === "true") return closeShop();
    });

    // Focus-Trap für Shop + Cart
    trapFocus(shop);
    trapFocus(cart);
    trapFocus($("#quickview"));
  });

  /* -------------------------------------------------- Focus-Trap Helper */
  function trapFocus(container) {
    if (!container) return;
    container.addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || container.dataset.open !== "true") return;
      const f = $$('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])', container)
        .filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
