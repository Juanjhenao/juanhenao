/* Juan José Henao · portfolio interactions. No dependencies. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const CALM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  let lang = store.get("lang") === "es" ? "es" : "en"; /* English first; Spanish only if the visitor chose it */
  let filter = "all";
  const t = (k) => (!FINE && I18N[lang][`${k}.touch`]) || I18N[lang][k] || I18N.en[k] || k;
  const reelById = (id) => REELS.find((r) => r.id === id);
  const visibleReels = () => REELS.filter((r) => filter === "all" || r.cat === filter);

  /* ---------------------------------------------------------------- i18n */
  function splitWords(el) {
    let i = 0;
    const wrap = (text, into) => {
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { into.append(" "); return; }
        const w = document.createElement("span"); w.className = "w";
        const s = document.createElement("span"); s.textContent = part; s.style.setProperty("--i", i++);
        w.append(s); into.append(w);
      });
    };
    const src = document.createElement("div"); src.innerHTML = el.innerHTML; el.textContent = "";
    src.childNodes.forEach((n) => {
      if (n.nodeType === 3) wrap(n.textContent, el);
      else { const e = document.createElement(n.tagName); wrap(n.textContent, e); el.append(e); }
    });
  }

  function applyLang() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
      if ("split" in el.dataset) splitWords(el);
    });
    $$(".lang span").forEach((s) => s.classList.toggle("is-on", s.dataset.lang === lang));
    $$("[data-mail]").forEach((a) => { a.href = JJ.mail(lang === "es" ? "Creatividad para anuncios" : "Ad creative", t(a.dataset.mail)); });
    $("#mailto").href = JJ.mail("Ad creative", t("cta.talk"));
    $("#faqlist").innerHTML = FAQ.map((f, i) => `<details class="qa reveal is-in" ${i === 0 ? "open" : ""}><summary><span>${f.q[lang]}</span><i></i></summary><p>${f.a[lang]}</p></details>`).join("");
    renderGrid(); renderProjects(); placePill();
    if (!$("#lb").hidden) fillInfo();
  }

  $(".lang").addEventListener("click", () => {
    lang = lang === "en" ? "es" : "en"; store.set("lang", lang); applyLang();
  });

  /* ------------------------------------------------------------ reel grid */
  const grid = $("#grid");
  function renderGrid() {
    grid.innerHTML = REELS.map((r, i) => `
      <article class="card reveal" data-id="${r.id}" data-cat="${r.cat}" style="--d:${(i % 4) * 60}ms">
        <button class="card__btn" type="button" data-reel="${r.id}" aria-label="${r.title}">
          <div class="card__frame" style="background-image:url(assets/poster/${r.id}.jpg)">
            <div class="card__shade"></div>
            <div class="card__top">
              <span class="tag">${r.dur}</span>
              <span class="tag">${r.lang}</span>
            </div>
            <div class="card__meta">
              <p class="card__brand">${r.brand}</p>
              <h3 class="card__title">${r.title}</h3>
            </div>
            <span class="card__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
            <div class="card__bar"><i></i></div>
          </div>
        </button>
      </article>`).join("");
    $$(".chip").forEach((c) => {
      const f = c.dataset.filter;
      $("i", c).textContent = String(f === "all" ? REELS.length : REELS.filter((r) => r.cat === f).length).padStart(2, "0");
    });
    applyFilter(false);
    $$(".card", grid).forEach((c) => { io.observe(c); bindCard(c); });
  }

  function applyFilter(animate = true) {
    const cards = $$(".card", grid);
    const show = (c) => filter === "all" || c.dataset.cat === filter;
    if (!animate || CALM) { cards.forEach((c) => { c.hidden = !show(c); }); return; }
    cards.forEach((c) => c.classList.add("is-hiding"));
    setTimeout(() => {
      let n = 0;
      cards.forEach((c) => {
        c.hidden = !show(c);
        if (!c.hidden) { c.style.transitionDelay = `${n++ * 35}ms`; c.classList.add("is-in"); }
      });
      requestAnimationFrame(() => requestAnimationFrame(() => cards.forEach((c) => c.classList.remove("is-hiding"))));
      setTimeout(() => cards.forEach((c) => { c.style.transitionDelay = ""; }), 700);
    }, 240);
  }

  $$(".chip").forEach((c) => c.addEventListener("click", () => {
    if (c.dataset.filter === filter) return;
    filter = c.dataset.filter;
    $$(".chip").forEach((x) => x.classList.toggle("is-on", x === c));
    applyFilter();
  }));

  /* hover preview + tilt (desktop) / autoplay in view (touch) */
  function previewVideo(card) {
    let v = $("video", card);
    if (!v) {
      v = document.createElement("video");
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "auto" });
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.src = `assets/preview/${card.dataset.id}.mp4`;
      v.addEventListener("timeupdate", () => card.style.setProperty("--p", v.duration ? v.currentTime / v.duration : 0));
      $(".card__frame", card).prepend(v);
    }
    return v;
  }
  const startPreview = (card) => { const v = previewVideo(card); v.play().then(() => card.classList.add("is-playing")).catch(() => {}); };
  const stopPreview = (card) => { const v = $("video", card); if (!v) return; v.pause(); card.classList.remove("is-playing"); };

  const touchIO = new IntersectionObserver((es) => es.forEach((e) => {
    if ($("#lb").hidden && e.intersectionRatio > 0.8) startPreview(e.target); else stopPreview(e.target);
  }), { threshold: [0, 0.8] });

  function bindCard(card) {
    if (!FINE) { if (!CALM) touchIO.observe(card); return; }
    const frame = $(".card__frame", card);
    card.addEventListener("pointerenter", () => startPreview(card));
    card.addEventListener("pointerleave", () => {
      stopPreview(card); const v = $("video", card); if (v) v.currentTime = 0;
      frame.style.setProperty("--rx", "0deg"); frame.style.setProperty("--ry", "0deg");
    });
    card.addEventListener("pointermove", (e) => {
      const b = frame.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      frame.style.setProperty("--gx", `${x * 100}%`); frame.style.setProperty("--gy", `${y * 100}%`);
      if (CALM) return;
      frame.style.setProperty("--ry", `${(x - 0.5) * 9}deg`); frame.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    });
  }

  /* ------------------------------------------------------------- projects */
  function renderProjects() {
    $("#plist").innerHTML = PROJECTS.map((p, i) => `
      <article class="proj reveal" data-id="${p.id}">
        <div class="proj__media">
          ${p.art ? `<div class="art">${Array.from({ length: 7 }, (_, k) => `<i style="--i:${k};width:${[92, 58, 76, 40, 84, 66, 50][k]}%;margin-left:${[0, 12, 6, 30, 4, 18, 26][k]}%"></i>`).join("")}<b></b></div>`
            : `<img src="${p.img}" alt="${p.name}" loading="lazy"><span class="tag proj__live">Demo</span>`}
        </div>
        <div class="proj__body">
          <p class="proj__n"><b>${String(i + 1).padStart(2, "0")}</b> / ${String(PROJECTS.length).padStart(2, "0")} · ${p.year}</p>
          <h2 class="proj__name">${p.name}</h2>
          <p class="proj__line">${p.line[lang]}</p>
          <p class="proj__text">${p.body[lang]}</p>
          <div class="proj__tags">${p.tags.map((x) => `<span>${x}</span>`).join("")}</div>
          <div class="proj__links">
            ${p.links.map((l) => `<a class="btn ${l.primary ? "btn--accent" : "btn--ghost"} magnetic" href="${l.href}" target="_blank" rel="noopener"><span>${l.t[lang]}</span><svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></a>`).join("")}
            ${p.note ? `<span class="proj__note">${p.note[lang]}</span>` : ""}
          </div>
        </div>
      </article>`).join("");
    $("#early").innerHTML = EARLY.map(([n, h]) => `<a href="${h}" target="_blank" rel="noopener">${n}</a>`).join("");
    $$(".proj").forEach((el) => {
      io.observe(el);
      const p = PROJECTS.find((x) => x.id === el.dataset.id);
      if (!p.demo) return;
      const media = $(".proj__media", el);
      const play = () => {
        let v = $("video", media);
        if (!v) {
          v = document.createElement("video");
          Object.assign(v, { muted: true, loop: true, playsInline: true, src: p.demo });
          v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); media.append(v);
        }
        v.play().then(() => el.classList.add("is-playing")).catch(() => {});
      };
      const stop = () => { const v = $("video", media); if (v) v.pause(); el.classList.remove("is-playing"); };
      if (FINE) { el.addEventListener("pointerenter", play); el.addEventListener("pointerleave", stop); }
      else if (!CALM) new IntersectionObserver(([e]) => (e.intersectionRatio > 0.7 ? play() : stop()), { threshold: [0, 0.7] }).observe(media);
    });
    bindMagnetic();
  }

  /* ------------------------------------------------------- reveal on view */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in"); io.unobserve(e.target);
    $$("[data-count]", e.target).forEach(countUp);
  }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  function countUp(el) {
    const to = +el.dataset.count, from = +(el.dataset.from || 0);
    if (CALM) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1300;
    (function tick(now) {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ------------------------------------------------- hero arc carousel */
  /* Cards sit on an even pitch and take their size from how far they are
     from the centre, like the inside of a cylinder. Geometry is in "u":
     1/1440 of the row on desktop, 1/640 on phones. */
  const arc = $("#arc");
  const PITCH = 196, PLAY = '<span class="arc__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>';
  arc.innerHTML = REELS.map((r) => `<button class="arc__card" type="button" data-id="${r.id}" aria-label="${r.title}" style="background-image:url(assets/poster/${r.id}.jpg)">${PLAY}</button>`).join("");
  const arcCards = $$(".arc__card", arc).map((el) => ({ el, id: el.dataset.id, video: null, shown: false }));
  const A = { u: 1, W: 0, H: 0, scroll: 0, vel: 0, drag: false, moved: false, run: false, seen: false, hover: false, last: 0, px: 0, pt: 0 };
  const f1 = (n) => n.toFixed(1);

  function roundedQuad(pts, r) {
    let d = "";
    for (let i = 0; i < 4; i++) {
      const p = pts[i], a = pts[(i + 3) % 4], b = pts[(i + 1) % 4];
      const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const k1 = Math.min(r, la / 2) / la, k2 = Math.min(r, lb / 2) / lb;
      d += `${i ? "L" : "M"}${f1(p[0] + (a[0] - p[0]) * k1)} ${f1(p[1] + (a[1] - p[1]) * k1)}Q${f1(p[0])} ${f1(p[1])} ${f1(p[0] + (b[0] - p[0]) * k2)} ${f1(p[1] + (b[1] - p[1]) * k2)}`;
    }
    return `${d}Z`;
  }

  function arcMeasure() {
    A.W = arc.clientWidth;
    A.u = Math.min(A.W / (A.W > 820 ? 1440 : 640), 1.5);
    arc.style.setProperty("--u", `${A.u}px`);
    A.H = 400 * A.u;
    arcLayout();
  }

  function arcShow(c, on) {
    if (c.shown === on) return;
    c.shown = on; c.el.style.visibility = on ? "" : "hidden";
    if (CALM) return;
    if (on) {
      if (!c.video) {
        const v = c.video = document.createElement("video");
        Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "auto", src: `assets/preview/${c.id}.mp4` });
        v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
        v.addEventListener("playing", () => c.el.classList.add("is-ready"), { once: true });
        c.el.prepend(v);
      }
      if (A.run) c.video.play().catch(() => {});
    } else if (c.video) c.video.pause();
  }

  function arcLayout() {
    const u = A.u, half = A.W / 2 - 14 * u, L = arcCards.length * PITCH * u, cx = A.W / 2, cyBase = A.H / 2 + 8 * u;
    arcCards.forEach((c, i) => {
      const t = ((((i * PITCH * u - A.scroll) + L / 2) % L) + L) % L - L / 2;
      const x = t * (1 + 0.083 * (t / half) ** 2), d = Math.abs(x) / half;
      if (d > 1.28) { arcShow(c, false); return; }
      arcShow(c, true);
      const w = (170 + 48 * d * d) * u, xl = x - w / 2, xr = x + w / 2;
      const hl = (280 + 92 * Math.min(1.25, Math.abs(xl) / half) ** 2.6) * u;
      const hr = (280 + 92 * Math.min(1.25, Math.abs(xr) / half) ** 2.6) * u;
      const m = Math.max(hl, hr), cy = cyBase - 12 * d * d * u;
      const st = c.el.style;
      st.width = `${f1(w)}px`; st.height = `${f1(m)}px`;
      st.transform = `translate3d(${f1(cx + xl)}px, ${f1(cy - m / 2)}px, 0)`;
      st.clipPath = `path("${roundedQuad([[0, (m - hl) / 2], [w, (m - hr) / 2], [w, (m + hr) / 2], [0, (m + hl) / 2]], 15 * u)}")`;
      st.setProperty("--pb", `${f1((m - hl) / 2)}px`);
    });
  }

  function arcFrame(now) {
    if (!A.run) return;
    const dt = Math.min(0.05, (now - A.last) / 1000); A.last = now;
    if (!A.drag) {
      A.vel *= Math.pow(0.05, dt); /* momentum loses about 95% per second */
      if (Math.abs(A.vel) < 3) A.vel = 0;
      const auto = CALM ? 0 : 50 * A.u * (A.hover ? 0.35 : 1);
      A.scroll += (A.vel + auto) * dt;
    }
    arcLayout();
    requestAnimationFrame(arcFrame);
  }
  function heroVideos(on) {
    const go = !!on && A.seen && !views.reels.hidden && lb.hidden;
    if (go === A.run) return;
    A.run = go;
    if (go) { A.last = performance.now(); arcCards.forEach((c) => c.shown && c.video && c.video.play().catch(() => {})); requestAnimationFrame(arcFrame); }
    else arcCards.forEach((c) => c.video && c.video.pause());
  }
  new IntersectionObserver(([e]) => { A.seen = e.isIntersecting; heroVideos(A.seen); }).observe(arc);
  addEventListener("resize", arcMeasure);

  arc.addEventListener("pointerdown", (e) => {
    if (e.button) return;
    A.drag = true; A.moved = false; A.vel = 0; A.px = A.sx = e.clientX; A.pt = performance.now();
    A.target = e.target.closest(".arc__card");
  });
  arc.addEventListener("pointermove", (e) => {
    if (!A.drag) return;
    const now = performance.now(), dx = e.clientX - A.px;
    if (!A.moved && Math.abs(e.clientX - A.sx) > 6) { A.moved = true; arc.classList.add("is-drag"); arc.setPointerCapture(e.pointerId); }
    if (!A.moved) return;
    A.scroll -= dx;
    A.vel = 0.7 * (-dx / Math.max(0.001, (now - A.pt) / 1000)) + 0.3 * A.vel;
    A.px = e.clientX; A.pt = now;
    if (!A.run) arcLayout();
  });
  const arcEnd = (e) => {
    if (!A.drag) return;
    A.drag = false; arc.classList.remove("is-drag");
    if (performance.now() - A.pt > 90) A.vel = 0; /* held still before letting go */
    if (!A.moved && e.type === "pointerup" && A.target) openReel(A.target.dataset.id);
  };
  arc.addEventListener("pointerup", arcEnd);
  arc.addEventListener("pointercancel", arcEnd);
  arc.addEventListener("pointerenter", () => { A.hover = true; });
  arc.addEventListener("pointerleave", () => { A.hover = false; });
  arc.addEventListener("click", (e) => { /* keyboard activation only; pointers are handled above */
    const c = e.target.closest(".arc__card"); if (c && e.detail === 0) openReel(c.dataset.id);
  });
  arc.addEventListener("dragstart", (e) => e.preventDefault());

  /* ------------------------------------------------------------- lightbox */
  const lb = $("#lb"), video = $(".lb__video"), scrub = $(".lb__scrub");
  let list = [], idx = 0, lastFocus = null;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  function fillInfo() {
    const r = reelById(list[idx]);
    $(".lb__count").textContent = r.brand;
    $(".lb__title").textContent = r.title;
    $(".lb__kind").textContent = r.kind[lang];
    $(".lb__hook").textContent = r.hook[lang];
    $(".lb__did").innerHTML = r.did[lang].map((x) => `<li>${x}</li>`).join("");
    $(".lb__tools").innerHTML = r.tools.map((x) => `<span>${x}</span>`).join("");
  }
  function load() {
    const r = reelById(list[idx]);
    video.poster = `assets/poster/${r.id}.jpg`;
    video.src = `assets/video/${r.id}.mp4`;
    scrub.style.setProperty("--p", 0); scrub.style.setProperty("--b", 0);
    $(".lb__time").textContent = `0:00 / ${r.dur}`;
    fillInfo(); syncLike();
    history.replaceState(null, "", `${location.pathname}?reel=${r.id}`);
    video.play().catch(() => lb.classList.add("is-paused"));
  }
  function openReel(id) {
    JJ.track("play-reel", { reel: id });
    const vis = visibleReels().map((r) => r.id);
    list = vis.includes(id) ? vis : REELS.map((r) => r.id);
    idx = list.indexOf(id); lastFocus = document.activeElement;
    lb.hidden = false; document.documentElement.style.overflow = "hidden";
    $(".dock").classList.add("is-away"); heroVideos(false); $$(".card").forEach(stopPreview);
    lb.classList.remove("is-paused", "is-sheet"); video.muted = false; lb.classList.remove("is-muted");
    load();
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add("is-open")));
    $(".lb__close").focus({ preventScroll: true });
  }
  function closeReel() {
    lb.classList.remove("is-open"); video.pause(); LiquidHeart.stop();
    history.replaceState(null, "", location.pathname);
    setTimeout(() => { lb.hidden = true; video.removeAttribute("src"); video.load(); heroVideos(true); }, 320);
    document.documentElement.style.overflow = ""; $(".dock").classList.remove("is-away");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function step(d, y = false) {
    if (list.length < 2) return;
    lb.classList.toggle("is-y", y);
    lb.style.setProperty("--dir", d); lb.classList.add("is-swap"); video.pause();
    setTimeout(() => {
      idx = (idx + d + list.length) % list.length; load();
      lb.style.setProperty("--dir", -d);
      requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.remove("is-swap")));
    }, CALM ? 0 : 170);
  }
  const toggle = () => (video.paused ? video.play() : video.pause());

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-reel]"); if (b) openReel(b.dataset.reel);
  });
  $(".lb__close").addEventListener("click", closeReel);
  $(".lb__bg").addEventListener("click", closeReel);
  $(".lb__nav--prev").addEventListener("click", () => step(-1));
  $(".lb__nav--next").addEventListener("click", () => step(1));
  $(".lb__pp").addEventListener("click", toggle);
  $(".lb__mute").addEventListener("click", () => { video.muted = !video.muted; lb.classList.toggle("is-muted", video.muted); });
  $(".lb__more").addEventListener("click", () => lb.classList.toggle("is-sheet"));
  video.addEventListener("play", () => lb.classList.remove("is-paused"));
  video.addEventListener("pause", () => { if (!video.ended && !scrub.classList.contains("is-drag")) lb.classList.add("is-paused"); });
  video.addEventListener("ended", () => step(1, true));
  /* keep the reel's own proportion; whatever the screen has left over stays black */
  video.addEventListener("loadedmetadata", () => {
    if (video.videoWidth) lb.style.setProperty("--ar", `${video.videoWidth} / ${video.videoHeight}`);
  });

  /* scroll (mouse wheel / trackpad) moves through the reels like a feed */
  let wheelAcc = 0, wheelLock = false, wheelT = 0;
  lb.addEventListener("wheel", (e) => {
    const info = e.target.closest(".lb__info");
    if (info && info.scrollHeight > info.clientHeight + 1) return; /* let the notes scroll */
    e.preventDefault();
    clearTimeout(wheelT);
    wheelT = setTimeout(() => { wheelAcc = 0; wheelLock = false; }, 200); /* waits out trackpad inertia */
    if (wheelLock) return;
    wheelAcc += Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(wheelAcc) > 40) { wheelLock = true; step(wheelAcc > 0 ? 1 : -1, true); wheelAcc = 0; }
  }, { passive: false });
  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    scrub.style.setProperty("--p", video.currentTime / video.duration);
    $(".lb__time").textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  });
  video.addEventListener("progress", () => {
    if (video.duration && video.buffered.length) scrub.style.setProperty("--b", video.buffered.end(video.buffered.length - 1) / video.duration);
  });

  /* ------------------------------------------------ like (no counts shown) */
  const likeBtn = $(".lb__like"), glass = $(".lb__glass");
  const likes = new Set((() => { try { return JSON.parse(store.get("likes") || "[]"); } catch { return []; } })());
  function syncLike() {
    const on = likes.has(list[idx]);
    likeBtn.classList.toggle("is-on", on); likeBtn.setAttribute("aria-pressed", on);
    likeBtn.classList.remove("is-glass", "is-pop"); LiquidHeart.stop();
  }
  /* sound + touch feedback: a short synthesized tick (no audio file) and a tap of vibration */
  let audio = null;
  function tick(on) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(on ? 520 : 420, t);
      o.frequency.exponentialRampToValueAtTime(on ? 980 : 300, t + 0.09);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(on ? 0.16 : 0.08, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + 0.2);
    } catch { /* no audio */ }
  }
  /* Android: Vibration API. iOS Safari has none, but toggling a native switch gives a haptic tap (iOS 18+). */
  const hapticSwitch = document.createElement("label");
  hapticSwitch.setAttribute("aria-hidden", "true");
  hapticSwitch.style.cssText = "position:fixed;left:-200px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
  hapticSwitch.innerHTML = '<input type="checkbox" switch tabindex="-1">';
  document.body.appendChild(hapticSwitch);
  function buzz(on) {
    if (navigator.vibrate) navigator.vibrate(on ? [14, 40, 22] : 10);
    else hapticSwitch.click();
  }
  /* private count on the server (never shown on the site) */
  const report = (reel, on) => {
    if (!location.protocol.startsWith("http")) return;
    fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reel, on }), keepalive: true }).catch(() => {});
  };

  likeBtn.addEventListener("click", () => {
    const id = list[idx], on = !likes.has(id);
    on ? likes.add(id) : likes.delete(id);
    store.set("likes", JSON.stringify([...likes]));
    tick(on); buzz(on); report(id, on);
    likeBtn.classList.toggle("is-on", on); likeBtn.setAttribute("aria-pressed", on);
    likeBtn.classList.remove("is-pop", "is-glass");
    if (!on) return;
    JJ.track("like-reel", { reel: id });
    likeBtn.classList.add("is-glass");
    LiquidHeart.play(glass)
      .then(() => likeBtn.classList.remove("is-glass"))
      .catch(() => { likeBtn.classList.remove("is-glass"); void likeBtn.offsetWidth; likeBtn.classList.add("is-pop"); });
  });
  if ("requestIdleCallback" in window) requestIdleCallback(() => LiquidHeart.preload());

  /* ------------------------------------------- share: one link per reel */
  const toast = $(".lb__toast"); let toastT = 0;
  const say = (t) => { toast.textContent = t; toast.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("is-on"), 1800); };
  const shareUrl = (id) => `${location.protocol.startsWith("http") ? location.origin + "/" : SITE}r/${id}`;
  $(".lb__share").addEventListener("click", async () => {
    const r = reelById(list[idx]), url = shareUrl(r.id);
    JJ.track("share-reel", { reel: r.id });
    if (navigator.share && !FINE) { try { await navigator.share({ title: `${r.title} · ${r.brand}`, url }); } catch { /* closed */ } return; }
    try { await navigator.clipboard.writeText(url); say(lang === "es" ? "Link copiado" : "Link copied"); }
    catch { say(url); }
  });

  /* scrubbing */
  const seek = (e) => {
    const b = scrub.getBoundingClientRect();
    const k = Math.min(1, Math.max(0, (e.clientX - b.left) / b.width));
    if (video.duration) { video.currentTime = k * video.duration; scrub.style.setProperty("--p", k); }
  };
  scrub.addEventListener("pointerdown", (e) => { scrub.setPointerCapture(e.pointerId); scrub.classList.add("is-drag"); seek(e); });
  scrub.addEventListener("pointermove", (e) => { if (scrub.classList.contains("is-drag")) seek(e); });
  scrub.addEventListener("pointerup", () => scrub.classList.remove("is-drag"));
  scrub.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { video.currentTime += 2; e.stopPropagation(); }
    if (e.key === "ArrowLeft") { video.currentTime -= 2; e.stopPropagation(); }
  });

  /* tap to pause, swipe to change reel (touch) */
  let sx = 0, sy = 0, st = 0;
  const tap = $(".lb__tap");
  tap.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; st = performance.now(); });
  tap.addEventListener("pointerup", (e) => {
    const dx = e.clientX - sx, dy = e.clientY - sy, far = Math.max(Math.abs(dx), Math.abs(dy));
    if (far < 12 && performance.now() - st < 500) { toggle(); return; }
    if (far < 40) return;
    if (Math.abs(dy) > Math.abs(dx)) step(dy < 0 ? 1 : -1, true); else step(dx < 0 ? 1 : -1);
  });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeReel();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); step(1, true); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1, true); }
    else if (e.key === " " && !e.target.closest("button")) { e.preventDefault(); toggle(); }
    else if (e.key.toLowerCase() === "m") $(".lb__mute").click();
    else if (e.key === "Tab") { /* keep focus inside the dialog */
      const f = $$("button, [tabindex]", lb).filter((x) => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------------------------------------------------- views/tabs */
  const views = { reels: $("#view-reels"), projects: $("#view-projects") };
  let view = "reels";
  function placePill() {
    const on = $(".tabs__tab.is-on"), pill = $(".tabs__pill");
    if (!on || !on.offsetWidth) return;
    pill.style.width = `${on.offsetWidth}px`; pill.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  function showView(name) {
    view = name;
    Object.entries(views).forEach(([k, el]) => { el.hidden = k !== name; el.classList.toggle("is-on", k === name); });
    $$("[data-view]").forEach((a) => a.classList.toggle("is-on", a.dataset.view === name && !a.classList.contains("brand")));
    placePill(); heroVideos(name === "reels");
    $$(".reveal:not(.is-in), [data-split]:not(.is-in)", views[name]).forEach((el) => io.observe(el));
  }
  function go(name, after) {
    if (name === view) { after ? after() : scrollTo({ top: 0, behavior: CALM ? "auto" : "smooth" }); return; }
    const cut = $(".cut");
    const swap = () => { showView(name); scrollTo({ top: 0, behavior: "instant" }); if (after) after(); };
    if (CALM) { swap(); return; }
    cut.classList.remove("is-out"); cut.classList.add("is-in");
    setTimeout(() => {
      swap(); cut.classList.remove("is-in"); cut.classList.add("is-out");
      setTimeout(() => cut.classList.remove("is-out"), 360);
    }, 270);
  }
  const jump = (id) => { const el = document.getElementById(id); if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--top-h")) || 60) + 1, behavior: CALM ? "auto" : "smooth" }); };

  document.addEventListener("click", (e) => {
    const v = e.target.closest("[data-view]");
    if (v) { e.preventDefault(); history.replaceState(null, "", `#${v.dataset.view}`); go(v.dataset.view); return; }
    const g = e.target.closest("[data-goto]");
    if (g) {
      e.preventDefault(); const id = g.dataset.goto;
      if (views.reels.contains(document.getElementById(id))) go("reels", () => requestAnimationFrame(() => jump(id)));
      else jump(id);
    }
  });
  addEventListener("resize", placePill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placePill);

  /* ------------------------------------------- magnetic buttons + cursor */
  function bindMagnetic() {
    $$(".btn").forEach((b) => {
      if (b.dataset.bound) return; b.dataset.bound = "1";
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--mx", `${e.clientX - r.left}px`); b.style.setProperty("--my", `${e.clientY - r.top}px`);
        if (!FINE || CALM || !b.classList.contains("magnetic")) return;
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.06}px, ${(e.clientY - r.top - r.height / 2) * 0.1}px)`;
      });
      b.addEventListener("pointerleave", () => { b.style.transform = ""; });
    });
  }

  /* ----------------------------------- header timecode + scroll progress */
  const bar = $(".top__progress i");
  const tc = (ms, fps = 24) => {
    const f = Math.floor((ms / 1000) * fps), p = (n) => String(n).padStart(2, "0");
    return `${p(Math.floor(f / (fps * 3600)))}:${p(Math.floor(f / (fps * 60)) % 60)}:${p(Math.floor(f / fps) % 60)}:${p(f % fps)}`;
  };
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------- method timeline */
  const LANES = {
    titles: [[0, 17, "", [0]], [30, 13, "", [2]], [62, 15, "", [2]]],
    gfx: [[18, 10, "", [2]], [44, 13, "", [2]], [79, 14, "", [2]]],
    video: [[0, 22, "cutmark", [0]], [22, 3, "gap", [1]], [25, 24, "cutmark", []], [49, 3, "gap", [1]], [52, 26, "cutmark", []], [78, 2.5, "gap", [1]], [80.5, 19.5, "", []]],
    voice: [[0, 22, "wave", []], [25, 24, "wave", []], [52, 26, "wave", []], [80.5, 19.5, "wave", []]],
    sfx: [[0, 5, "wave", [3]], [18, 4, "wave", [3]], [30, 4, "wave", [3]], [44, 5, "wave", [3]], [62, 4, "wave", [3]], [79, 5, "wave", [3]]],
  };
  const HEAD = [[0, 0], [23.5, 7050], [44, 13200], [79, 23700]];
  Object.entries(LANES).forEach(([lane, clips]) => {
    $(`[data-lane="${lane}"]`).innerHTML = clips.map(([l, w, c, r]) => `<span class="clip ${c}" data-rules="${r.join(",")}" style="left:${l}%;width:${w}%"></span>`).join("");
  });
  const tl = $(".tl");
  let ruleTimer = null;
  function setRule(n) {
    tl.dataset.ruleOn = n;
    $$(".clip", tl).forEach((c) => c.classList.toggle("hot", c.dataset.rules.split(",").includes(String(n))));
    $(".tl__head").style.setProperty("--hp", HEAD[n][0] / 100);
    $(".tl__tc").textContent = tc(HEAD[n][1], 30);
  }
  setRule(0);
  if (!CALM) {
    new IntersectionObserver(([e]) => {
      clearInterval(ruleTimer);
      if (e.isIntersecting) ruleTimer = setInterval(() => setRule((+tl.dataset.ruleOn + 1) % 4), 3600);
    }, { threshold: 0.3 }).observe($(".method__body"));
  }

  /* -------------------------------------------------------------- marquee */
  $("#marquee").innerHTML = [...STACK, ...STACK].map((s) => `<span>${s}</span>`).join("");

  /* -------------------------------------------------------------- contact */
  $("#s-li").href = CONTACT.linkedin; $("#s-be").href = CONTACT.behance; $("#s-gh").href = CONTACT.github;

  /* ----------------------------------------------------------------- boot */
  applyLang(); arcMeasure();
  $$(".reveal, [data-split]").forEach((el) => io.observe(el));
  bindMagnetic(); onScroll();
  const start = location.hash.replace("#", "");
  if (start === "projects") showView("projects");
  else { showView("reels"); if (start && document.getElementById(start) && start !== "reels") setTimeout(() => jump(start), 60); }
  /* a shared link (/r/<id> → ?reel=<id>) opens that reel straight away */
  const want = new URLSearchParams(location.search).get("reel");
  if (want && reelById(want)) openReel(want);
})();
