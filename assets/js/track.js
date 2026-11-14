/* ------------------------------------------------------------------
   Lead attribution. Loaded by every page.

   1. Works with no setup: it remembers where each visitor first came
      from (a ?ref= or ?utm_source= tag, or the referring site) and adds
      a short "(ref: linkedin · checklist)" line to every
      email message the site prepares. You see the source in the message.
   2. Optional counting: put your GoatCounter code in `goatcounter` to
      get page views and button clicks per source (free, no cookies).
   3. Optional log: put a URL in `endpoint` (for example a Google Apps
      Script web app) and every lead action is posted there as JSON.

   Share links with a tag so the source is exact, for example:
     https://your-site/?ref=linkedin      ?ref=instagram     ?ref=cold-email
   ------------------------------------------------------------------ */
(() => {
  "use strict";
  const CFG = {
    goatcounter: "", // e.g. "juanjhenao" for juanjhenao.goatcounter.com
    endpoint: "",    // e.g. "https://script.google.com/macros/s/XXXX/exec"
    email: "juanjosehenao20@gmail.com",
  };
  const KNOWN = [
    ["linkedin", "linkedin"], ["lnkd.in", "linkedin"], ["instagram", "instagram"], ["facebook", "facebook"], ["fb.", "facebook"],
    ["tiktok", "tiktok"], ["youtube", "youtube"], ["youtu.be", "youtube"], ["twitter", "x"], ["t.co", "x"], ["x.com", "x"],
    ["behance", "behance"], ["github", "github"], ["contra", "contra"], ["upwork", "upwork"], ["fiverr", "fiverr"],
    ["chatgpt", "chatgpt"], ["openai", "chatgpt"], ["perplexity", "perplexity"], ["claude", "claude"], ["gemini", "gemini"],
    ["copilot", "copilot"], ["google", "google"], ["bing", "bing"], ["duckduckgo", "duckduckgo"], ["whatsapp", "whatsapp"], ["wa.me", "whatsapp"],
  ];
  const clean = (v) => String(v || "").toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const name = (v) => { const c = clean(v); const hit = KNOWN.find(([k]) => c.includes(k)); return hit ? hit[1] : c; };
  const read = (s, k) => { try { return JSON.parse(s.getItem(k)); } catch { return null; } };
  const write = (s, k, v) => { try { s.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };

  function detect() {
    const q = new URLSearchParams(location.search);
    const tagged = q.get("ref") || q.get("utm_source") || q.get("source");
    let src = "";
    if (tagged) src = name(tagged);
    else if (document.referrer) {
      try { const h = new URL(document.referrer).hostname; if (h && h !== location.hostname) src = name(h.replace(/^www\./, "")); } catch { /* bad referrer */ }
    }
    return { src, medium: clean(q.get("utm_medium")), campaign: clean(q.get("utm_campaign")), page: location.pathname.split("/").pop() || "index.html", at: new Date().toISOString() };
  }

  const now = detect();
  let first = read(localStorage, "jj_first");
  if (!first || (!first.src && now.src)) { first = now; write(localStorage, "jj_first", first); }
  if (now.src || !read(sessionStorage, "jj_last")) write(sessionStorage, "jj_last", now);
  const last = read(sessionStorage, "jj_last") || now;
  const src = () => first.src || last.src || "direct";

  const tag = (magnet) => `\n\n(ref: ${[src(), first.campaign, magnet].filter(Boolean).join(" · ")})`;

  function track(event, extra) {
    const data = Object.assign({ event, src: src(), last: last.src || "direct", campaign: first.campaign || "", page: now.page, at: new Date().toISOString() }, extra || {});
    if (CFG.goatcounter && window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: `event/${event}/${data.src}`, title: event, event: true });
    }
    if (CFG.endpoint) {
      try { navigator.sendBeacon(CFG.endpoint, new Blob([JSON.stringify(data)], { type: "text/plain" })); } catch { /* offline */ }
    }
    return data;
  }

  if (CFG.goatcounter) {
    const s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.dataset.goatcounter = `https://${CFG.goatcounter}.goatcounter.com/count`;
    document.head.append(s);
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]"); if (el) track(el.dataset.track);
  });

  window.JJ = {
    src, track, email: CFG.email,
    mail: (subject, body, magnet) => `mailto:${CFG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + tag(magnet))}`,
  };
})();
