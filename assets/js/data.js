/* ------------------------------------------------------------------
   CONTENT. Everything the site says lives here.
   To add a reel: drop the files in assets/video, assets/preview and
   assets/poster with the same id, then add an entry to REELS.
   ------------------------------------------------------------------ */

const SITE = "https://juanhenao.pages.dev/"; /* public address, used for structured data, sitemap and llms.txt */

const CONTACT = {
  email: "juanjosehenao20@gmail.com",
  whatsapp: "573152147544",
  linkedin: "https://www.linkedin.com/in/juanhenaocyclone",
  behance: "https://www.behance.net/juanjoshenao3",
  github: "https://github.com/Juanjhenao",
};

/* cat: ads | ugc | podcast | brand. The grid is sorted by MADE, newest first. */
const REELS = [
  {
    id: "solar-vat", cat: "ads", dur: "0:30", lang: "EN",
    title: "1 April: two things go up",
    brand: "All Solar Works",
    kind: { en: "Paid social ad", es: "Anuncio para paid social" },
    hook: { en: "A deadline and a threat on frame zero.", es: "Una fecha y una amenaza en el primer fotograma." },
    did: {
      en: [
        "Cut a single take down to full phrases, with alternating punch-ins hiding every join.",
        "Built an isometric voxel house in code to explain “4 kW solar + home battery” in two seconds.",
        "Counter reveal for the £4,300 figure, AI drone B-roll and a Get Quote button with a cursor click.",
      ],
      es: [
        "Corté una sola toma a frases completas, con punch-ins alternos que tapan cada unión.",
        "Construí por código una casa vóxel isométrica para explicar «4 kW solar + batería» en dos segundos.",
        "Contador para la cifra de £4.300, B-roll aéreo con IA y un botón Get Quote con clic de cursor.",
      ],
    },
    tools: ["After Effects", "Seedance 2.0", "Python"],
  },
  {
    id: "deel", cat: "ads", dur: "0:35", lang: "EN",
    title: "The best person for your team is asleep right now",
    brand: "Deel",
    kind: { en: "Ad concept · paid social", es: "Concepto de anuncio · paid social" },
    hook: { en: "A line that makes a hiring manager stop.", es: "Una frase que frena a quien contrata." },
    did: {
      en: [
        "Concept to final render: AI-generated B-roll, no AI faces talking to camera.",
        "A dotted 3D globe carries the whole middle of the ad, with hires arcing across it.",
        "Hero counters for the public figures: 150+ countries, $11.2B paid, 4.83 rating.",
      ],
      es: [
        "Del concepto al render final: B-roll generado con IA, sin caras IA hablando a cámara.",
        "Un globo 3D de puntos sostiene todo el centro del anuncio, con contrataciones que lo cruzan.",
        "Contadores para las cifras públicas: 150+ países, USD 11.200 M pagados, 4,83 de calificación.",
      ],
    },
    tools: ["After Effects", "AI video B-roll"],
  },
  {
    id: "nus", cat: "ads", dur: "0:25", lang: "EN",
    title: "Creatine without the scoop",
    brand: "NUS Capital",
    kind: { en: "Paid social ad · e-commerce", es: "Anuncio para paid social · e-commerce" },
    hook: { en: "Product in hand, benefit card beside it.", es: "Producto en mano y la tarjeta del beneficio al lado." },
    did: {
      en: [
        "A 3D moment that acts out the script: powder turns into “5g”, then into the gummy.",
        "Serif title cards and dark B-roll for the “no scoop, no forgetting it” beats.",
        "Shared-element transitions, so the edit never passes through black.",
      ],
      es: [
        "Un momento 3D que actúa el guion: el polvo se vuelve «5g» y luego la gomita.",
        "Títulos en serif y B-roll oscuro para los golpes de «sin scoop, sin olvidarlo».",
        "Transiciones con un elemento compartido: la edición nunca pasa por negro.",
      ],
    },
    tools: ["After Effects", "Three.js", "AI video B-roll"],
  },
  {
    id: "pim-clip", cat: "podcast", dur: "0:32", lang: "EN",
    title: "Agency = shared cost",
    brand: "Personal Injury Mastermind",
    kind: { en: "Podcast clip", es: "Clip de podcast" },
    hook: { en: "The math appears while he says it.", es: "La cuenta aparece mientras la dice." },
    did: {
      en: [
        "Split frame: the speaker below, a live infographic above that does the math as he talks.",
        "$10,000 a month per person becomes $40,000 for four, built up icon by icon.",
        "Word-level captions with the keyword highlighted in the brand lime.",
      ],
      es: [
        "Pantalla dividida: abajo quien habla, arriba una infografía que hace la cuenta en vivo.",
        "USD 10.000 al mes por persona se vuelven 40.000 por cuatro, ícono por ícono.",
        "Captions palabra por palabra con la palabra clave en el lima de la marca.",
      ],
    },
    tools: ["After Effects"],
  },
  {
    id: "rankings", cat: "ads", dur: "0:19", lang: "EN",
    title: "I asked ChatGPT to pick my lawyer",
    brand: "Rankings.io",
    kind: { en: "Ad concept · paid social", es: "Concepto de anuncio · paid social" },
    hook: { en: "The prompt is the hook.", es: "El prompt es el gancho." },
    did: {
      en: [
        "Opens on the chat prompt as an on-screen bubble, in sync with the line.",
        "Vector UI in brand colors: ten search links collapse into three names.",
        "Kinetic type close: “Page one used to be the prize.”",
      ],
      es: [
        "Abre con el prompt como burbuja en pantalla, sincronizado con la frase.",
        "UI vectorial con los colores de marca: diez enlaces se reducen a tres nombres.",
        "Cierre en tipografía cinética: «Page one used to be the prize.»",
      ],
    },
    tools: ["After Effects"],
  },
  {
    id: "roofing", cat: "ads", dur: "1:51", lang: "EN",
    title: "Solar on Steroids",
    brand: "All Roofing Works",
    kind: { en: "Long-form ad · multicam", es: "Anuncio largo · multicámara" },
    hook: { en: "Drone over the property, then the presenter.", es: "Dron sobre la propiedad y luego el presentador." },
    did: {
      en: [
        "Edited A cam, B cam and drone into one 1:51 walkthrough.",
        "Title cards and counters land on each claim, clear of the presenter’s face.",
        "Rebuilt the logo in vectors for a clean animated sign-off.",
      ],
      es: [
        "Monté cámara A, cámara B y dron en un recorrido de 1:51.",
        "Títulos y contadores caen sobre cada afirmación, sin tapar la cara del presentador.",
        "Reconstruí el logo en vectores para un cierre animado limpio.",
      ],
    },
    tools: ["After Effects", "Audition"],
  },
  {
    id: "pim-short", cat: "podcast", dur: "0:30", lang: "EN",
    title: "Your video strategy is already broken",
    brand: "Personal Injury Mastermind",
    kind: { en: "Podcast short", es: "Short de podcast" },
    hook: { en: "One red word does the work.", es: "Una sola palabra en rojo hace el trabajo." },
    did: {
      en: [
        "Motion-graphics-led short cut from a long episode: the voice drives, the graphics explain.",
        "Checklists, a ×30 multiplier and a task stack built as vector UI in the brand palette.",
        "AI B-roll covers the two stretches where the master had no usable camera.",
      ],
      es: [
        "Short guiado por motion graphics a partir de un episodio largo: la voz manda, los gráficos explican.",
        "Checklists, un multiplicador ×30 y una pila de tareas como UI vectorial en la paleta de marca.",
        "B-roll con IA cubre los dos tramos donde el máster no tenía cámara utilizable.",
      ],
    },
    tools: ["After Effects", "AI video B-roll"],
  },
  {
    id: "doit", cat: "brand", dur: "0:32", lang: "EN",
    title: "4 words that separate",
    brand: "La Haus",
    kind: { en: "Personal-brand reel", es: "Reel de marca personal" },
    hook: { en: "A number, then a promise of four words.", es: "Un número y la promesa de cuatro palabras." },
    did: {
      en: [
        "Opens wide on a big “4”, then cuts in close as the phrase lands.",
        "“I do it anyway” builds in oversized serif type behind the speaker, with the key word boxed in lime.",
        "Background drops to black and white so the type and the speaker carry the frame.",
      ],
      es: [
        "Abre en plano general con un «4» grande y corta a plano cercano cuando cae la frase.",
        "«I do it anyway» se arma en serif gigante detrás de quien habla, con la palabra clave en caja lima.",
        "El fondo pasa a blanco y negro para que la tipografía y el orador sostengan el cuadro.",
      ],
    },
    tools: ["Premiere Pro", "After Effects"],
  },
  {
    id: "habito", cat: "brand", dur: "0:36", lang: "ES",
    title: "Hábito que frena, hábito que avanza",
    brand: "La Haus",
    kind: { en: "Personal-brand reel", es: "Reel de marca personal" },
    hook: { en: "Two columns promise a comparison.", es: "Dos columnas prometen una comparación." },
    did: {
      en: [
        "A two-column comparison builds above the speaker, one tag per habit.",
        "Rounded B-roll insets and a split screen break up the talking head.",
        "Serif and grotesque title pairing in the brand’s single lime accent.",
      ],
      es: [
        "Una comparación a dos columnas se arma sobre quien habla, una etiqueta por hábito.",
        "Insertos de B-roll redondeados y pantalla dividida rompen el busto parlante.",
        "Títulos en serif y grotesca con el único acento lima de la marca.",
      ],
    },
    tools: ["Premiere Pro", "After Effects"],
  },
  {
    id: "misogi", cat: "brand", dur: "0:51", lang: "ES",
    title: "Misogi",
    brand: "La Haus",
    kind: { en: "Personal-brand reel", es: "Reel de marca personal" },
    hook: { en: "A question set in type, first frame.", es: "Una pregunta en tipografía, primer fotograma." },
    did: {
      en: [
        "Editorial type hook that asks the question before he does.",
        "AI B-roll inserts that match the room’s light, so cutaways feel shot, not stock.",
        "Karaoke captions with lime emphasis on the words that carry the idea.",
      ],
      es: [
        "Gancho tipográfico editorial que hace la pregunta antes que él.",
        "Insertos de B-roll con IA que igualan la luz del lugar: parecen grabados, no de stock.",
        "Captions tipo karaoke con énfasis lima en las palabras que cargan la idea.",
      ],
    },
    tools: ["Premiere Pro", "AI video B-roll"],
  },
  {
    id: "solar-roof", cat: "ads", dur: "0:20", lang: "EN",
    title: "£2,000 a year from the roof",
    brand: "All Solar Works",
    kind: { en: "Paid social ad", es: "Anuncio para paid social" },
    hook: { en: "The number first, the presenter second.", es: "Primero la cifra, después el presentador." },
    did: {
      en: [
        "Presenter cut out over the headline so the number reads first.",
        "Panel specs laid onto the roof in perspective over the drone shot.",
        "Animated counters and icons for output and savings, then the logo sting.",
      ],
      es: [
        "Presentador recortado sobre el titular para que la cifra se lea primero.",
        "Las especificaciones del panel van sobre el tejado, en perspectiva, en la toma de dron.",
        "Contadores e íconos animados para producción y ahorro, y cierre con el logo.",
      ],
    },
    tools: ["After Effects"],
  },
  {
    id: "hooks", cat: "brand", dur: "0:44", lang: "EN",
    title: "6 types of hooks",
    brand: "La Haus",
    kind: { en: "Educational reel", es: "Reel educativo" },
    hook: { en: "A blurred list you want to unblur.", es: "Una lista borrosa que quieres destapar." },
    did: {
      en: [
        "A six-item list that unblurs one line at a time, holding attention to the end.",
        "Background swaps and a comment-keyword CTA built in.",
        "Captions placed inside the safe zone, clear of the app UI.",
      ],
      es: [
        "Una lista de seis puntos que se destapa línea por línea y sostiene la atención hasta el final.",
        "Cambios de fondo y un CTA de palabra clave en comentarios.",
        "Captions dentro de la zona segura, sin chocar con la interfaz de la app.",
      ],
    },
    tools: ["Premiere Pro", "After Effects"],
  },
];

/* date each cut was finished; only used for ordering, never shown */
const MADE = {
  "pim-short": "2026-11-10T06:23", "pim-clip": "2026-11-10T05:36", deel: "2026-11-10T02:54",
  roofing: "2026-11-05", nus: "2026-11-04T05:46", rankings: "2026-11-04T04:41", "solar-vat": "2026-11-03",
  "solar-roof": "2026-10-30", doit: "2026-07-14", hooks: "2026-06-24", misogi: "2026-06-23", habito: "2026-06-19",
};
REELS.sort((a, b) => (MADE[b.id] || "").localeCompare(MADE[a.id] || ""));

const PROJECTS = [
  {
    id: "catan", name: "Colonos", year: "2026",
    img: "assets/img/catan.png", demo: "assets/img/catan-demo.mp4",
    line: {
      en: "A full digital Catan you can play in the browser.",
      es: "Un Catan digital completo, jugable en el navegador.",
    },
    body: {
      en: "Deterministic rules engine, bots with difficulty levels, a procedural board and LAN multiplayer with an authoritative server. 243 tests keep the rules honest.",
      es: "Motor de reglas determinista, bots con niveles de dificultad, tablero procedural y multijugador en LAN con servidor autoritativo. 243 pruebas cuidan las reglas.",
    },
    tags: ["TypeScript", "WebSocket", "Canvas"],
    links: [
      { t: { en: "Play it", es: "Jugar" }, href: "https://juanjhenao.github.io/catan-digital/", primary: true },
      { t: { en: "Code", es: "Código" }, href: "https://github.com/Juanjhenao/catan-digital" },
    ],
  },
  {
    id: "agency-os", name: "Agency OS", year: "2026",
    img: "assets/img/agency-os.png", demo: "assets/img/agency-os-demo.mp4",
    line: {
      en: "One app for an agency’s whole sales cycle.",
      es: "Una sola app para todo el ciclo comercial de una agencia.",
    },
    body: {
      en: "CRM, proposals, e-signed contracts, multi-currency invoicing and daily automations, from first contact to signed contract and invoice.",
      es: "CRM, propuestas, contratos con firma electrónica, facturación multimoneda y automatizaciones diarias: del primer contacto al contrato firmado y la factura.",
    },
    tags: ["Node.js", "Express", "Vanilla JS"],
    links: [{ t: { en: "Code", es: "Código" }, href: "https://github.com/Juanjhenao/agency-os", primary: true }],
  },
  {
    id: "metanoia", name: "Metanoia", year: "2026",
    img: "assets/img/metanoia.png", demo: "assets/img/metanoia-demo.mp4",
    line: {
      en: "A habit, work and chores app for the whole home.",
      es: "Una app de hábitos, trabajo y tareas para toda la casa.",
    },
    body: {
      en: "Multi-user PWA with live sync over Server-Sent Events, Web Push notifications and LAN HTTPS through a self-hosted certificate authority.",
      es: "PWA multiusuario con sincronización en vivo por Server-Sent Events, notificaciones Web Push y HTTPS en LAN con una autoridad certificadora propia.",
    },
    tags: ["Node.js", "PWA", "Web Push", "SSE"],
    links: [{ t: { en: "Code", es: "Código" }, href: "https://github.com/Juanjhenao/metanoia-habit-tracker", primary: true }],
  },
  {
    id: "vem", name: "Video Editing Machine", year: "2026", art: "timeline",
    line: {
      en: "The pipeline behind the reels on this site.",
      es: "El pipeline detrás de los reels de este sitio.",
    },
    body: {
      en: "Post-production driven from Claude Code: it cuts on full phrases, removes silences, keeps text inside the social safe zone, mixes sound effects and audits every cut before a render goes out. Projects stay editable in After Effects.",
      es: "Postproducción dirigida desde Claude Code: corta por frases completas, quita silencios, mantiene el texto en la zona segura de redes, mezcla efectos de sonido y audita cada corte antes de entregar. Los proyectos quedan editables en After Effects.",
    },
    tags: ["Python", "FFmpeg", "Whisper", "After Effects"],
    links: [],
    note: { en: "Private repo", es: "Repo privado" },
  },
];

const EARLY = [
  ["Calculator", "https://github.com/Juanjhenao/Calculator"],
  ["Etch-a-sketch", "https://github.com/Juanjhenao/Etch-a-sketch"],
  ["Tic-Tac-Toe", "https://github.com/Juanjhenao/Tic-Tac-Toe"],
  ["Library", "https://github.com/Juanjhenao/Library"],
  ["Admin Dashboard", "https://github.com/Juanjhenao/Admin-Dashboard"],
  ["Sign-up Form", "https://github.com/Juanjhenao/Sign-Up-Form"],
];

const FAQ = [
  {
    q: { en: "What does Juan José Henao do?", es: "¿Qué hace Juan José Henao?" },
    a: {
      en: "I’m an AI video editor for paid social. I edit short-form ads, UGC-style ads, podcast clips and personal-brand reels for TikTok, Instagram Reels, YouTube Shorts and Meta ads. Edit, motion graphics, AI B-roll and sound design come in one delivery.",
      es: "Soy editor de video con IA para paid social. Edito anuncios cortos, anuncios estilo UGC, clips de podcast y reels de marca personal para TikTok, Instagram Reels, YouTube Shorts y Meta Ads. Edición, motion graphics, B-roll con IA y diseño de sonido van en una sola entrega.",
    },
  },
  {
    q: { en: "Who is this for?", es: "¿Para quién es?" },
    a: {
      en: "Startups, mid-size and large companies, and the agencies that serve them, when they run paid social and need fresh ad creative every week instead of one video a quarter.",
      es: "Startups, empresas medianas y grandes, y las agencias que las atienden, cuando hacen paid social y necesitan creatividad nueva cada semana en lugar de un video por trimestre.",
    },
  },
  {
    q: { en: "What do I get in a delivery?", es: "¿Qué recibo en una entrega?" },
    a: {
      en: "A finished vertical video ready to run: hook on the first frame, cuts on full phrases, word-level captions, motion graphics for every claim, B-roll and a mixed soundtrack. The project file stays editable, so changes don’t mean starting over.",
      es: "Un video vertical terminado y listo para pautar: gancho en el primer fotograma, cortes en frases completas, captions palabra por palabra, motion graphics para cada afirmación, B-roll y sonido mezclado. El proyecto queda editable: un cambio no obliga a empezar de cero.",
    },
  },
  {
    q: { en: "How do you use AI?", es: "¿Cómo usas la IA?" },
    a: {
      en: "For speed and for shots that would otherwise need a shoot: AI B-roll with Seedance and Kling, avatars and voice with HeyGen and ElevenLabs, and my own pipeline that finds silences, aligns captions and audits every cut. The taste and the final check are mine. Anything showing an AI-generated person is labelled as such.",
      es: "Para ir más rápido y para tomas que de otro modo pedirían un rodaje: B-roll con Seedance y Kling, avatares y voz con HeyGen y ElevenLabs, y un pipeline propio que detecta silencios, alinea captions y audita cada corte. El criterio y la revisión final son míos. Todo lo que muestre a una persona generada con IA va rotulado.",
    },
  },
  {
    q: { en: "How do we work together?", es: "¿Cómo trabajamos?" },
    a: {
      en: "On a monthly retainer. You send raw footage or a brief, I send back finished ads, and what the numbers say shapes the next batch. I’m remote, based in Medellín, Colombia (UTC−5), and work US business hours. English and Spanish.",
      es: "Con un retainer mensual. Envías material en bruto o un brief, te devuelvo anuncios terminados y lo que digan los números define la siguiente tanda. Trabajo remoto desde Medellín, Colombia (UTC−5), en horario de EE. UU. Inglés y español.",
    },
  },
  {
    q: { en: "How do I start?", es: "¿Cómo empiezo?" },
    a: {
      en: "Message me on WhatsApp or by email. Or start with a free tool: score your current ad with the Frame-Zero Checklist, pull hooks from the Hook File, or ask for ten ad ideas written for your brand.",
      es: "Escríbeme por WhatsApp o por correo. O empieza con una herramienta gratis: califica tu anuncio actual con el Checklist Frame-Zero, saca ganchos del Hook File o pide diez ideas de anuncios escritas para tu marca.",
    },
  },
];

const STACK = [
  "Premiere Pro", "After Effects", "Audition", "HeyGen", "Kling", "Seedance",
  "Higgsfield", "ElevenLabs", "CapCut", "Claude Code",
];

const I18N = {
  en: {
    "nav.reels": "Reels", "nav.projects": "Projects", "nav.cta": "Work with me", "dock.cta": "Let’s talk",
    "head.tag1": "AI video editor for paid social", "head.tag2": "Remote, US hours",
    "faq.kicker": "Questions", "faq.h2": "Before you ask.",
    "tools.kicker": "Free tools", "tools.h2": "This can <em>help you.</em>",
    "mg1.time": "5 minutes", "mg1.t": "The Frame-Zero Checklist", "mg1.d": "Twelve checks to score the ad you’re paying to show right now, and see where it loses people.", "mg1.cta": "Score my ad",
    "mg2.time": "Instant", "mg2.t": "The Hook File", "mg2.d": "24 fill-in-the-blank ad hooks. Type your product and audience, copy the ones that fit.", "mg2.cta": "Open the hooks",
    "mg3.time": "Made for you", "mg3.t": "10 ad ideas for your brand", "mg3.d": "Tell me what you sell and who buys it. I send back ten ad ideas written for your product, each with its hook.", "mg3.cta": "Request my 10 ideas",
    "cta.push": "Want to push your project forward? <em>Message me.</em>", "cta.wa2": "Message me on WhatsApp", "cta.mail2": "Email me",
    "cta.talk": "Hi Juan, I’d like to talk about ad creative for my brand.",
    "hero.eyebrow": "AI video editor for paid social · Remote, US hours",
    "hero.h1": "Ads they can’t <em>skip.</em>",
    "hero.sub": "Short-form ad creative for brands that test new hooks every week. Edit, motion graphics, AI B-roll and sound design in one delivery, from one editor.",
    "hero.cta1": "Message me on WhatsApp", "hero.cta2": "See the free tools",
    "hero.hint": "Drag to browse · click a reel for sound",
    "stat.1": "videos a week, edited at La Haus", "stat.2": "subscriber YouTube channel edited",
    "stat.4": "the year I started editing for a living",
    "reels.kicker": "Selected work", "reels.h2": "Twelve reels. Sound on.",
    "reels.sub": "Hover to preview, click to watch the full cut and see what I did on each one.",
    "reels.sub.touch": "Tap a reel to watch the full cut and see what I did on it. Swipe up for the next one.",
    "f.all": "All", "f.ads": "Ads", "f.podcast": "Podcast clips", "f.brand": "Personal brand",
    "method.kicker": "How I cut", "method.h2": "Four rules every edit has to pass.",
    "m1.t": "The hook is on frame zero", "m1.d": "Text and movement are on screen before the first word lands. I write ten hooks and kill seven.",
    "m2.t": "Cuts land on full phrases", "m2.d": "Pauses over a fifth of a second go. Words never get clipped. Every join is checked twelve frames each side.",
    "m3.t": "One animation per claim", "m3.d": "A number gets a counter. A product gets a 3D moment. Nothing moves just to move.",
    "m4.t": "Every move has a sound", "m4.d": "Each visible animation gets its own effect, aligned to the peak, with the voice always on top.",
    "stack.kicker": "Tools",
    "exp.kicker": "Experience", "exp.h2": "Where the hours went.",
    "e1.r": "AI Video Editor", "e1.d": "10+ videos a week with AI-assisted workflows.",
    "e2.r": "Multimedia Content Producer", "e2.c": "Freelance", "e2.d": "Vertical short-form and e-commerce product ads for 3–4 clients at a time. CTR and view duration decide the pacing of the next edit.",
    "e3.r": "Video Editor", "e3.c": "Freelance · Fiverr", "e3.d": "Long- and short-form for a YouTube channel with 56K+ subscribers. Color, audio and event films.",
    "e4.r": "Audiovisual Communication", "e4.d": "Plus The Odin Project (full-stack JavaScript) and the Google Data Analytics certificate.",
    "now": "Now",
    "cta.kicker": "Free · 5 minutes", "cta.h2": "Score your ad before you <em>spend on it.</em>",
    "cta.sub": "The Frame-Zero Checklist: the 12 checks every edit of mine passes before it ships. Run it on the ad you’re paying to show right now and see exactly where it loses people.",
    "cta.wa": "Get it on WhatsApp", "cta.mail": "Get it by email", "cta.copy": "Copy email", "cta.copied": "Copied",
    "cta.msg": "Hi Juan, send me the Frame-Zero Checklist.",
    "hero.wa": "Hi Juan, I saw your reels and want to talk about ad creative.",
    "cta.meta": "Remote · UTC−5 · English B2, Spanish native",
    "proj.kicker": "Projects", "proj.h2": "What I build when the <em>edit is done.</em>",
    "proj.sub": "Web apps, tools and the pipeline I edit with. Hover a card to see it run.",
    "proj.sub.touch": "Web apps, tools and the pipeline I edit with. Each card plays its own demo.",
    "early.t": "Where it started: The Odin Project, 2022",
    "proj.more": "Everything else is on GitHub",
    "lb.did": "What I did", "lb.tools": "Tools", "lb.hook": "The hook", "lb.details": "Details",
    "foot": "Designed and built by Juan José Henao.",
  },
  es: {
    "nav.reels": "Reels", "nav.projects": "Proyectos", "nav.cta": "Trabajemos", "dock.cta": "Hablemos",
    "head.tag1": "Editor de video con IA para paid social", "head.tag2": "Remoto, horario de EE. UU.",
    "faq.kicker": "Preguntas", "faq.h2": "Antes de que preguntes.",
    "tools.kicker": "Herramientas gratis", "tools.h2": "Esto te puede <em>ayudar.</em>",
    "mg1.time": "5 minutos", "mg1.t": "Checklist Frame-Zero", "mg1.d": "Doce revisiones para calificar el anuncio que estás pautando hoy y ver dónde pierde a la gente.", "mg1.cta": "Calificar mi anuncio",
    "mg2.time": "Inmediato", "mg2.t": "The Hook File", "mg2.d": "24 ganchos para rellenar. Escribe tu producto y tu audiencia y copia los que te sirvan.", "mg2.cta": "Abrir los ganchos",
    "mg3.time": "Hecho para ti", "mg3.t": "10 ideas de anuncios para tu marca", "mg3.d": "Cuéntame qué vendes y quién lo compra. Te devuelvo diez ideas de anuncios escritas para tu producto, cada una con su gancho.", "mg3.cta": "Pedir mis 10 ideas",
    "cta.push": "¿Quieres impulsar tu proyecto? <em>Escríbeme.</em>", "cta.wa2": "Escríbeme por WhatsApp", "cta.mail2": "Escríbeme un correo",
    "cta.talk": "Hola Juan, quiero hablar de creatividad en video para mi marca.",
    "hero.eyebrow": "Editor de video con IA para paid social · Remoto, horario de EE. UU.",
    "hero.h1": "Anuncios que no se <em>saltan.</em>",
    "hero.sub": "Creatividad en video corto para marcas que prueban ganchos nuevos cada semana. Edición, motion graphics, B-roll con IA y diseño de sonido en una sola entrega, de un solo editor.",
    "hero.cta1": "Escríbeme por WhatsApp", "hero.cta2": "Ver las herramientas gratis",
    "hero.hint": "Arrastra para explorar · toca un reel para oírlo",
    "stat.1": "videos por semana, editados en La Haus", "stat.2": "suscriptores en el canal de YouTube que edité",
    "stat.4": "el año en que empecé a vivir de editar",
    "reels.kicker": "Trabajo seleccionado", "reels.h2": "Doce reels. Con sonido.",
    "reels.sub": "Pasa el cursor para la vista previa y haz clic para ver el corte completo y qué hice en cada uno.",
    "reels.sub.touch": "Toca un reel para ver el corte completo y qué hice en él. Desliza hacia arriba para el siguiente.",
    "f.all": "Todos", "f.ads": "Anuncios", "f.podcast": "Clips de podcast", "f.brand": "Marca personal",
    "method.kicker": "Cómo corto", "method.h2": "Cuatro reglas que cada edición tiene que pasar.",
    "m1.t": "El gancho está en el fotograma cero", "m1.d": "Texto y movimiento están en pantalla antes de la primera palabra. Escribo diez ganchos y mato siete.",
    "m2.t": "Los cortes caen en frases completas", "m2.d": "Las pausas de más de un quinto de segundo se van. Nunca se mutila una palabra. Reviso doce cuadros a cada lado de cada unión.",
    "m3.t": "Una animación por afirmación", "m3.d": "Una cifra lleva contador. Un producto lleva su momento 3D. Nada se mueve por moverse.",
    "m4.t": "Cada movimiento suena", "m4.d": "Cada animación visible lleva su efecto, alineado al pico, con la voz siempre encima.",
    "stack.kicker": "Herramientas",
    "exp.kicker": "Experiencia", "exp.h2": "En qué se fueron las horas.",
    "e1.r": "AI Video Editor", "e1.d": "Más de 10 videos por semana con flujos asistidos por IA.",
    "e2.r": "Productor de contenido multimedia", "e2.c": "Freelance", "e2.d": "Contenido vertical y anuncios de producto para e-commerce, con 3 a 4 clientes a la vez. El CTR y la duración de visualización deciden el ritmo de la siguiente edición.",
    "e3.r": "Editor de video", "e3.c": "Freelance · Fiverr", "e3.d": "Videos largos y cortos para un canal de YouTube con más de 56.000 suscriptores. Color, audio y videos de eventos.",
    "e4.r": "Comunicación Audiovisual", "e4.d": "Además, The Odin Project (JavaScript full-stack) y el certificado de Google Data Analytics.",
    "now": "Hoy",
    "cta.kicker": "Gratis · 5 minutos", "cta.h2": "Califica tu anuncio antes de <em>pagar por mostrarlo.</em>",
    "cta.sub": "El Checklist Frame-Zero: las 12 revisiones que pasa cada edición mía antes de entregarse. Aplícalo al anuncio que estás pautando hoy y mira exactamente dónde pierde a la gente.",
    "cta.wa": "Recíbelo por WhatsApp", "cta.mail": "Recíbelo por correo", "cta.copy": "Copiar correo", "cta.copied": "Copiado",
    "cta.msg": "Hola Juan, envíame el Checklist Frame-Zero.",
    "hero.wa": "Hola Juan, vi tus reels y quiero hablar de creatividad para anuncios.",
    "cta.meta": "Remoto · UTC−5 · Español nativo, inglés B2",
    "proj.kicker": "Proyectos", "proj.h2": "Lo que construyo cuando <em>termina la edición.</em>",
    "proj.sub": "Apps web, herramientas y el pipeline con el que edito. Pasa el cursor por una tarjeta para verla funcionar.",
    "proj.sub.touch": "Apps web, herramientas y el pipeline con el que edito. Cada tarjeta reproduce su propia demo.",
    "early.t": "Donde empezó: The Odin Project, 2022",
    "proj.more": "Todo lo demás está en GitHub",
    "lb.did": "Qué hice", "lb.tools": "Herramientas", "lb.hook": "El gancho", "lb.details": "Detalles",
    "foot": "Diseñado y construido por Juan José Henao.",
  },
};
