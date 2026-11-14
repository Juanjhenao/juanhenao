/* ------------------------------------------------------------------
   Liquid-glass heart: the reveal that plays when someone likes a reel.
   A glass droplet blooms out of the button, holds the heart against its
   rim (where the glass bends it into colour), then lets go and leaves
   the heart behind.

   Plain-JS port of the "Glass Icon Reveal" shader by zanwei
   (github.com/zanwei/glass-icon-reveal, MIT), via the 21st.dev
   component. Changes: the mark is a heart, the canvas is transparent so
   it sits over video, and the timing is cut to ~2 s for a like.
   One WebGL2 pass, no dependencies. Falls back to a CSS pop.
   ------------------------------------------------------------------ */
(() => {
  "use strict";

  const HEART = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" d="M12 21.2 10.6 20C5.4 15.3 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.8-8.6 11.5L12 21.2Z"/></svg>`;

  /* Look: dark glass on a navy plate, cream heart (palette "Premium Confidence"). */
  const P = {
    tileSize: 60, logoScale: 0.334, finalScale: 1, logoOffset: [0, 0], iconPlate: true, keepPlate: false,
    opticalDepth: 0.8, dispersion: 1.1, colorBleed: 0.6, doubleBevel: 1, bevelWidth: 0.22, corner: 2,
    cornerPull: 1.4, cornerWidth: 1.2, cornerFocus: 0.4, edgeSmear: 1.2, stretch: 0, tilt: 0, bulge: 1,
    specular: 1, halo: 1, shadow: 0, ripple: 0.6,
    bounce: 0.12, response: 0.34, startSize: 0.2, startZoom: 1, glide: 0.9, present: 1.05, drift: 0.04, swell: 0.5, focus: 1,
    sheen: 1, lightTurn: 0.9,
    background: "#0D1321", plateColor: "#1D2D44", logoColor: "#F0EBD8",
  };

  const TEX = 512, BOX = 0.75;

  /* ---------------------------------------------------- heart → SDF */
  function loadHeart() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas"); c.width = c.height = TEX;
        const x = c.getContext("2d", { willReadFrequently: true });
        /* path bounds 2..22 × 3..21.2 → centre it and fill BOX of the texture */
        const s = (TEX * BOX) / 20;
        x.drawImage(img, TEX / 2 - 12 * s, TEX / 2 - 12.1 * s, 24 * s, 24 * s);
        resolve({ canvas: c, sdf: buildSdf(c) });
      };
      img.onerror = () => reject(new Error("heart"));
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(HEART);
    });
  }
  function buildSdf(canvas) {
    const n = TEX * TEX, alpha = canvas.getContext("2d").getImageData(0, 0, TEX, TEX).data, INF = 1e20;
    const outer = new Float64Array(n), inner = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const a = alpha[i * 4 + 3] / 255;
      if (a >= 1) { outer[i] = 0; inner[i] = INF; }
      else if (a <= 0) { outer[i] = INF; inner[i] = 0; }
      else { const d = 0.5 - a; outer[i] = d > 0 ? d * d : 0; inner[i] = d < 0 ? d * d : 0; }
    }
    const f = new Float64Array(TEX), z = new Float64Array(TEX + 1), v = new Uint16Array(TEX);
    edt(outer, f, v, z, INF); edt(inner, f, v, z, INF);
    const sdf = new Float32Array(n);
    for (let i = 0; i < n; i++) sdf[i] = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / TEX;
    return sdf;
  }
  function edt(g, f, v, z, INF) {
    for (let x = 0; x < TEX; x++) edt1d(g, x, TEX, f, v, z, INF);
    for (let y = 0; y < TEX; y++) edt1d(g, y * TEX, 1, f, v, z, INF);
  }
  function edt1d(g, off, st, f, v, z, INF) {
    v[0] = 0; z[0] = -INF; z[1] = INF; f[0] = g[off];
    for (let q = 1, k = 0, s = 0; q < TEX; q++) {
      f[q] = g[off + q * st];
      const q2 = q * q;
      do { const r = v[k]; s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2; } while (s <= z[k] && --k > -1);
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    for (let q = 0, k = 0; q < TEX; q++) {
      while (z[k + 1] < q) k++;
      const r = v[k], qr = q - r;
      g[off + q * st] = f[r] + qr * qr;
    }
  }

  /* ---------------------------------------------------------- shader */
  const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uCenter; uniform float uTile; uniform sampler2D uSdf; uniform float uBoxFrac;
uniform float uPlateScale, uShapeN, uCornerN, uOptics, uPlateAlpha, uLogoHalf; uniform vec2 uLogoOff;
uniform float uBold, uBlur, uFrost, uDome, uDrop, uPinch, uTilt, uRim, uHalo, uShadow, uGhost, uRipR, uRipA, uBare;
uniform float uReach, uCornerPull, uStreak, uWiden, uSlab, uEtaSpread, uFocus, uFocusK, uFocusSplit, uRimLine, uCornerOn;
uniform float uDissolve, uGlow, uFaceDisp, uVivid, uDisp, uDouble, uBevelW, uSpec, uIconPlate, uLightScene, uLightGlass;
uniform float uKeep, uSheen, uSweep, uLightAng;
uniform vec3 uBg, uPlateCol, uLogoCol;
float px;
vec2 rot(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
vec4 logoAt(vec2 q, float blur, float aa) {
  float L = uLogoHalf; float k = 0.5 * uBoxFrac / L;
  vec2 uv = vec2(0.5 + (q.x - uLogoOff.x) * k, 0.5 - (q.y - uLogoOff.y) * k);
  float d = texture(uSdf, uv).r / k;
  float w = 0.75 * aa + blur;
  return vec4(uLogoCol, 1.0 - smoothstep(-w, w, d - uBold * L));
}
float shape(vec2 p, float scale, float n, out vec2 nOut, out float g, out vec2 dg) {
  vec2 pp = p / scale; vec2 a = max(abs(pp), vec2(1e-6));
  g = pow(pow(a.x, n) + pow(a.y, n), 1.0 / n);
  dg = sign(pp) * pow(a, vec2(n - 1.0)) * pow(max(g, 1e-6), 1.0 - n);
  float dgl = max(length(dg), 1e-6); nOut = dg / dgl;
  return (g - 1.0) / dgl * scale;
}
float contourRadius(vec2 p, float scale, float n) {
  vec2 a = max(abs(p / scale), vec2(1e-4)); vec2 a1 = pow(a, vec2(n - 1.0)); vec2 a2 = pow(a, vec2(n - 2.0));
  float k = (n - 1.0) * (a2.x * a1.y * a1.y + a2.y * a1.x * a1.x) / pow(max(dot(a1, a1), 1e-30), 1.5);
  return scale / max(k, 1e-3);
}
vec2 refractSample(float x, float bwF, float eta, float R, vec2 dirOut, vec2 p, float dome, float offMul) {
  float u = clamp(1.0 - x, 0.0, 0.995); float th = asin(u), thr = asin(u / eta);
  float z = uSlab + bwF * sqrt(1.0 - u * u);
  float off = offMul * z * tan(th - thr); off = off / (1.0 + off / (6.0 * R));
  return p - (dirOut * off + p * dome) * uOptics;
}
float gauss(float x, float c, float w) { float d = (x - c) / w; return exp(-0.5 * d * d); }
float band(float x, float a, float b, float w) { return smoothstep(a - w, a, x) * (1.0 - smoothstep(b, b + w, x)); }
float bump(float x, float c, float w) { float d = (x - c) / w; return exp(-0.5 * d * d); }
vec3 spectrum(float x) { return vec3(bump(x, 0.34, 0.2) + 0.08 * bump(x, 0.93, 0.05), bump(x, 0.58, 0.1), bump(x, 0.8, 0.11)); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  px = 2.0 / uTile;
  vec2 p = (gl_FragCoord.xy - uCenter) * px;
  vec4 lg = logoAt(p, uBlur, px);
  vec3 plain = mix(uBg, lg.rgb, lg.a * uBare);
  vec2 nOut, dg; float g;
  float sd = shape(p, uPlateScale, uShapeN, nOut, g, dg);
  float s = -sd; float bw = max(uBevelW, 0.004) * uPlateScale; float x = clamp(s / bw, 0.0, 1.0);
  float R = contourRadius(p, uPlateScale, uShapeN);
  vec2 pq = p * p; float diag = 4.0 * pq.x * pq.y / max((pq.x + pq.y) * (pq.x + pq.y), 1e-6);
  float tilt = mix(1.0 - uTilt, 1.0, smoothstep(-0.02, 0.02, p.x * p.y));
  float pinchPart = uPinch * min(g * g, 1.0) * diag * diag * tilt;
  float dome = uDome * (1.0 - min(g * g, 1.0)) + pinchPart;
  vec2 dirOut = normalize(mix(nOut, p / max(length(p), 1e-4), 0.2));
  float cornerness = max(smoothstep(0.1, 0.9, 4.0 * nOut.x * nOut.x * nOut.y * nOut.y), smoothstep(0.15, 0.75, diag));
  float offMul = 1.0 + 0.4 * max(uCornerPull - 1.0, 0.0) * tilt * cornerness * uCornerOn;
  vec2 focus = sign(p) * (pow(0.5, 1.0 / uShapeN) - uFocus * 0.70710678) * uPlateScale;
  float focusW = tilt * cornerness * uOptics * uCornerOn;
  float bwF = max(uReach, 0.004) * (1.0 + uWiden * tilt * cornerness * uCornerOn);
  float xf = clamp(s / bwF, 0.0, 1.0);
  vec2 qc = refractSample(xf, bwF, 1.5, R, dirOut, p, dome, offMul);
  float foot = max(max(length(dFdx(qc)), length(dFdy(qc))), 0.25 * px);
  vec3 bg = uBg;
  vec3 lift = mix(uBg + vec3(0.06), mix(uBg, vec3(1.0), 0.55), uLightScene);
  if (uGhost > 0.001) {
    vec2 gn, gdg; float gg; float gsd = shape(p, 1.0, uCornerN, gn, gg, gdg);
    bg = mix(bg, lift, uGhost * 0.12 * (1.0 - smoothstep(-0.16, 0.14, gsd)));
  }
  float outside = max(sd, 0.0);
  if (uRipA > 0.001) {
    float d0 = (uRipR - 1.0) * uPlateScale; float rx = (sd - d0) / 0.022; float ring = exp(-rx * rx);
    bg += uRipA * ring * (0.04 * (0.55 + 0.45 * dot(nOut, normalize(vec2(-0.5, 0.8))))) * 0.5;
  }
  vec3 haloCol = vec3(0.62, 0.69, 0.80);
  bg = mix(bg, haloCol, clamp(uHalo * (0.30 * exp(-outside / (0.025 * uPlateScale)) + 0.07 * exp(-outside / (0.12 * uPlateScale))), 0.0, 1.0) * step(0.0, sd));
  float cov = 0.0, aG = 0.0; vec3 fG = vec3(0.0);
  float soft = px + uBlur * 0.8 + 0.06 * uDissolve * (1.0 - uKeep) * uPlateScale;
  if (sd < soft) {
    float y1 = 1.0 - x; const float K = 2.6;
    float base1 = max(1.0 - pow(y1, K), 1e-4);
    float db = min(pow(y1, K - 1.0) * pow(base1, 1.0 / K - 1.0), 25.0);
    float s1 = bw * 0.62; float w2 = bw * 0.22; float t2 = clamp((s - s1) / w2, -1.0, 1.0);
    float dh2 = uDouble * bw * 0.16;
    float dd = dh2 * 0.5 * cos(t2 * 1.5707963) * 1.5707963 / w2 * step(abs(t2), 0.999);
    vec2 gDome = -uDome * 2.0 * g * dg * step(g, 1.0);
    vec2 grad = -(db + dd) * nOut + gDome;
    vec3 back = mix(uBg, uPlateCol, uIconPlate);
    vec3 liftG = mix(back + vec3(0.06), mix(back, vec3(1.0), 0.55), uLightGlass);
    float rblur = uBlur + 0.05 * length(qc - p) + min(uGlow * uOptics * (1.0 - xf) * foot / px, 0.04);
    float cornerW = smoothstep(0.1, 0.9, 4.0 * nOut.x * nOut.x * nOut.y * nOut.y);
    float streak = 0.35 * uStreak * bw * mix(0.15, 1.0, cornerW) * pow(1.0 - xf, 1.5) * uOptics;
    vec2 tangent = vec2(-nOut.y, nOut.x);
    vec3 acc = vec3(0.0), wsum = vec3(0.0);
    for (int i = 0; i < 16; i++) {
      float lam = (float(i) + 0.5) / 16.0;
      float c = uDisp * (1.0 - 2.0 * lam);
      vec2 along = tangent * (streak * 2.0 * (fract(float(i) * 0.618034 + 0.31) - 0.5));
      float cf = uDisp * (1.0 - 2.0 * lam) * (lam > 0.5 ? 1.0 : 0.5);
      vec2 sp = refractSample(xf, bwF, 1.5 + uEtaSpread * c, R, dirOut, p + along, dome + pinchPart * 0.3 * c, offMul);
      vec2 focusL = focus - sign(p) * (0.70710678 * uFocusSplit * c * uPlateScale);
      float wFocus = pow(1.0 - xf, uFocusK) * smoothstep(0.0, uRimLine * (1.0 + 0.6 * c), xf);
      sp = mix(sp, mix(p + along, focusL, wFocus), focusW);
      float faceOnly = smoothstep(0.7, 1.0, xf) * uOptics;
      sp *= 1.0 + uFaceDisp * cf * faceOnly;
      vec4 l = logoAt(sp, rblur + 0.12 * streak + uFaceDisp * 0.5 * max(c, 0.0) * faceOnly, foot);
      vec3 w = spectrum(lam);
      acc += mix(back, l.rgb, l.a) * w; wsum += w;
    }
    vec3 trans = acc / wsum;
    float tl = dot(trans, vec3(0.2126, 0.7152, 0.0722));
    trans = clamp(tl + (trans - tl) * (1.0 + uVivid * uOptics), 0.0, 1.0);
    float hazeLum = dot(trans, vec3(0.2126, 0.7152, 0.0722));
    float hazeGate = mix(1.0 - smoothstep(0.25, 0.75, hazeLum), smoothstep(0.25, 0.75, hazeLum), uLightGlass);
    trans = mix(trans, liftG, uFrost * 0.45 * hazeGate);
    float glassAmt = pow(1.0 - uDissolve, 1.5);
    float lit = uSpec * glassAmt;
    vec3 rimCol = vec3(0.80, 0.87, 0.97);
    vec3 Nl = normalize(vec3(-grad, 1.0));
    float edge = 1.0 - Nl.z;
    vec2 ldir = rot(normalize(vec2(-0.62, 0.78)), uLightAng);
    float side = dot(nOut, ldir);
    float fres = pow(edge, 1.5);
    vec3 rim = rimCol * fres * (0.35 + 0.65 * max(side, -side * 0.8)) * uRim * 0.65;
    vec3 Hv = normalize(normalize(vec3(-0.45, 0.6, 0.66)) + vec3(0.0, 0.0, 1.0));
    float spc = pow(max(dot(Nl, Hv), 0.0), 140.0) * 0.8 * smoothstep(0.0, 0.25, y1);
    vec3 glass = trans * (1.0 - 0.25 * fres) + (rim + vec3(spc)) * lit;
    glass = mix(glass, rimCol, uDrop * 0.4 * uSpec * (1.0 - smoothstep(0.0, 0.1 * uPlateScale, s)));
    float sweepD = dot(p / uPlateScale, normalize(vec2(0.8, 0.6))) - uSweep;
    float sheen = uSheen * glassAmt * exp(-sweepD * sweepD / 0.03) * (0.55 + 0.45 * (1.0 - x));
    glass = mix(glass, vec3(1.0), sheen * 0.22);
    cov = clamp(0.5 - sd / soft, 0.0, 1.0);
    /* clear glass: only what is brighter than the plate (rim light, colour, the heart) stays opaque */
    vec3 lp = max(glass - back, 0.0) / max(vec3(1.0) - back, vec3(1e-3));
    aG = clamp(0.1 + max(lp.r, max(lp.g, lp.b)), 0.0, 1.0);
    fG = clamp((glass - back * (1.0 - aG)) / aG, 0.0, 1.0);
  }
  /* glow and ripple outside the glass, un-blended from the backdrop */
  vec3 lb = max(bg - uBg, 0.0) / max(vec3(1.0) - uBg, vec3(1e-3));
  float aB = clamp(max(lb.r, max(lb.g, lb.b)), 0.0, 1.0);
  vec3 fB = clamp((bg - uBg * (1.0 - aB)) / max(aB, 1e-3), 0.0, 1.0);
  float A1 = cov * aG;
  vec3 P1 = fG * A1 + fB * aB * (1.0 - A1);
  float AG = A1 + aB * (1.0 - A1);
  float aL = lg.a * uBare;
  vec3 Pm = mix(uLogoCol * aL, P1, uPlateAlpha);
  float Am = clamp(mix(aL, AG, uPlateAlpha) + (hash(gl_FragCoord.xy) - 0.5) / 255.0, 0.0, 1.0);
  outColor = vec4(Pm, Am);
}`;

  /* ---------------------------------------------------------- timeline */
  const TAIL = 0.9;
  const SPEED = 1.3; /* 30% faster than the timeline above */
  const END = P.present + TAIL;
  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const smoother = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * t * (t * (t * 6 - 15) + 10); };
  const rgb = (h) => { const v = parseInt(h.slice(1), 16); return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]; };
  function spring(t, response, damping) {
    if (t <= 0) return 0;
    const w = (2 * Math.PI) / response;
    if (damping >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
    const wd = w * Math.sqrt(1 - damping * damping);
    return 1 - Math.exp(-damping * w * t) * (Math.cos(wd * t) + ((damping * w) / wd) * Math.sin(wd * t));
  }
  function reach(level, response, damping) {
    let lo = 0, hi = 3;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (spring(m, response, damping) < level) lo = m; else hi = m; }
    return hi;
  }
  const DAMP = 1 - P.bounce;
  const TL = reach(0.85, P.response, DAMP) - 0.01, TM = reach(0.92, P.response, DAMP) - 0.01;
  const BG = rgb(P.background), PLATE = rgb(P.plateColor), INK = rgb(P.logoColor);

  function frameAt(T) {
    const tx = P.present;
    const grow = spring(T + 0.01, P.response, DAMP);
    const morph = spring(T - TM, 0.4, 1);
    const drop = 1 - smooth(0.05, 1, morph);
    const appear = smooth(0, 0.08, T);
    const drift = P.drift * spring(T - 0.3, 2.2, 1);
    const zoomIn = 0.25 * spring(T, 0.7, 1) + 0.75 * smoother(0, P.glide, T);
    const settle = spring(T - 0.5, 2.4, 1);
    const exit = spring(T - tx, 0.6, 1);
    const release = spring(T - tx - 0.05, 0.5, 1);
    const view = (1 + (P.startZoom - 1) * (1 - zoomIn)) * (1 - 0.045 * settle) * mix(1, P.finalScale, exit);
    const bandW = mix(P.bevelWidth, Math.max(P.bevelWidth, 0.4), drop);
    const plateScale = mix(P.startSize, 1, grow) * (1 + drift) * (1 + 0.14 * release);
    return {
      uPlateScale: plateScale, uShapeN: mix(2, P.corner, morph), uCornerN: P.corner,
      uOptics: 1 - smooth(0.55, 1, release), uPlateAlpha: appear * (1 - smooth(0.45, 1, release)),
      uLogoHalf: P.logoScale * view, uKeep: 0, uSheen: P.sheen,
      uSweep: mix(-1.6, 1.6, smoother(0.4, tx - 0.05, T)), uLightAng: P.lightTurn * smoother(0.2, tx + 0.3, T),
      uBold: P.swell * 0.03 * (1 - zoomIn), uBlur: P.focus * 0.05 * (1 - smooth(0.3, 0.95, grow)),
      uFrost: P.focus * (1 - smooth(0.5, 0.95, grow)), uPinch: 0, uTilt: P.tilt,
      uDome: 0.15 * P.bulge * (1 - smooth(0.4, 0.95, grow)), uDrop: drop, uRim: 1 + 0.8 * drop,
      uHalo: P.halo * (0.5 + 0.5 * drop), uShadow: 0,
      uGhost: smooth(0, 0.03, T) * (1 - smooth(0.04, 0.08, T)),
      uRipR: 1 + 0.9 * Math.max(0, T - TL), uRipA: P.ripple * smooth(TL, TL + 0.06, T) * Math.exp(-Math.max(0, T - TL) / 0.5),
      uBare: smooth(tx - 0.2, tx, T), uReach: bandW * plateScale,
      uCornerPull: P.cornerPull, uStreak: P.edgeSmear, uWiden: P.cornerWidth, uSlab: 0.3 * P.opticalDepth,
      uEtaSpread: 0.06, uFocus: P.cornerFocus, uFocusK: 1, uFocusSplit: 0.056 * P.colorBleed, uRimLine: 0.09,
      uCornerOn: smooth(0.35, 1, morph), uGlow: 0.012 * P.colorBleed, uFaceDisp: 0.012 * P.dispersion, uVivid: 0.85,
      uDissolve: release, uDisp: P.dispersion, uDouble: P.doubleBevel, uBevelW: bandW * (1 - release),
      uSpec: P.specular, uIconPlate: 1, uLightScene: 0, uLightGlass: 0,
    };
  }

  /* ---------------------------------------------------------- renderer */
  let heart = null;
  const heartJob = () => (heart = heart || loadHeart());

  function renderer(canvas) {
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: true, alpha: true });
    if (!gl) return null;
    const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    for (let i = 0, n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS); i < n; i++) { const u = gl.getActiveUniform(prog, i); U[u.name] = gl.getUniformLocation(prog, u.name); }
    return {
      setHeart(h) {
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, TEX, TEX, 0, gl.RED, gl.FLOAT, h.sdf);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(U.uSdf, 0);
      },
      draw(fr, w, h, tile) {
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.uCenter, w / 2, h / 2); gl.uniform1f(U.uTile, tile); gl.uniform1f(U.uBoxFrac, BOX);
        for (const k in fr) if (U[k]) gl.uniform1f(U[k], fr[k]);
        gl.uniform3fv(U.uBg, BG); gl.uniform3fv(U.uPlateCol, PLATE); gl.uniform3fv(U.uLogoCol, INK);
        gl.uniform2f(U.uLogoOff, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      clear() { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); },
      dispose() { gl.getExtension("WEBGL_lose_context")?.loseContext(); },
    };
  }

  /* ---------------------------------------------------------- public API
     LiquidHeart.play(button, canvas) → Promise that resolves when the
     glass has let go. Rejects when WebGL is unavailable (use the CSS pop). */
  const CALM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let gfx = null, gfxCanvas = null, raf = 0;

  function play(canvas) {
    if (CALM) return Promise.reject(new Error("reduced motion"));
    return heartJob().then((h) => new Promise((resolve, reject) => {
      if (gfxCanvas !== canvas) {
        try { gfx = renderer(canvas); } catch (e) { gfx = null; console.error(e); }
        gfxCanvas = canvas;
        if (gfx) gfx.setHeart(h);
      }
      if (!gfx) { reject(new Error("no webgl")); return; }
      cancelAnimationFrame(raf);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
      const tile = Math.min(P.tileSize, Math.min(cw, ch) / 1.75) * dpr;
      const t0 = performance.now();
      const tick = (now) => {
        const T = Math.min(((now - t0) / 1000) * SPEED, END);
        gfx.draw(frameAt(T), canvas.width, canvas.height, tile);
        if (T < END) raf = requestAnimationFrame(tick);
        else { gfx.clear(); resolve(); }
      };
      raf = requestAnimationFrame(tick);
    }));
  }
  function stop() { cancelAnimationFrame(raf); gfx?.clear(); }

  window.LiquidHeart = { play, stop, preload: heartJob, size: () => P.tileSize * P.logoScale * P.finalScale };
})();
