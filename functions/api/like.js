/* POST /api/like  { reel: "misogi", on: true|false }
   Private like counter for the reels. Nothing here is ever shown on the site.

   Storage: a Workers KV namespace bound to this Pages project as LIKES.
     likes:<reel>          → number of people who currently like the reel
     seen:<reel>:<visitor> → "1" while that visitor likes it (so reloads and
                              repeat clicks don't inflate the number)
   A visitor is a one-way hash of IP + browser; the raw IP is never stored.
   Read the numbers in the Cloudflare dashboard (Storage & Databases → KV)
   or with:  node tools/likes.mjs                                        */

const ok = () => new Response(null, { status: 204 });

export async function onRequestPost({ request, env }) {
  if (!env.LIKES) return ok(); /* storage not set up yet: the button still works */

  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== url.host) return new Response(null, { status: 403 });

  let body;
  try { body = await request.json(); } catch { return new Response(null, { status: 400 }); }
  const reel = String(body?.reel || "");
  const on = body?.on === true;
  if (!/^[a-z0-9-]{1,40}$/.test(reel)) return new Response(null, { status: 400 });

  /* only real reels: each one has a poster on the site */
  const poster = await env.ASSETS.fetch(new URL(`/assets/poster/${reel}.jpg`, url), { method: "HEAD" });
  if (!poster.ok) return new Response(null, { status: 404 });

  const who = `${request.headers.get("CF-Connecting-IP") || ""}|${request.headers.get("User-Agent") || ""}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${who}|${reel}`));
  const visitor = [...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");

  const seenKey = `seen:${reel}:${visitor}`, countKey = `likes:${reel}`;
  const seen = await env.LIKES.get(seenKey);
  if (on === Boolean(seen)) return ok(); /* nothing changed */

  const count = parseInt((await env.LIKES.get(countKey)) || "0", 10) || 0;
  if (on) {
    await env.LIKES.put(seenKey, "1");
    await env.LIKES.put(countKey, String(count + 1));
  } else {
    await env.LIKES.delete(seenKey);
    await env.LIKES.put(countKey, String(Math.max(0, count - 1)));
  }
  return ok();
}

/* any other method gets 405 from Pages, since only POST has a handler */
