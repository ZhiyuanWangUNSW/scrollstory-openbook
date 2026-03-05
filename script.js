/* ============ TTS helpers (kept for all pages) ============ */
function speak(text) {
  if (!text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-AU";
  u.rate = 0.9;
  setTimeout(() => {
  window.speechSynthesis.speak(u);},120);
}
function stopSpeech() {
  window.speechSynthesis.cancel();
}

/* escape for putting text into HTML attributes */
function escapeAttr(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/* escape for putting text into HTML */
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ============ Palette (from your current app) ============ */
const PALETTE = {
  navy: "#2d3f2e",
  teal: "#6c7659",
  pink: "#d6d1c7",
};

/* ============ Reusable: carousel page renderer ============ */
function renderPointCarousel(pageIndex) {
  const p = PAGES[pageIndex];
  const title = escapeHtml(p.title || "");


  // We keep the Read/Stop buttons in the same style/position as other pages.
  // The Read button uses data-tts, which we update as the point changes.
  return `
    <section class="slide" data-carousel="1">
      <div class="tts-topright">
        <button type="button" class="tts-btn" data-tts="">🔊 Read</button>
        <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
      </div>

      <div class="slide-header">
        <h2 class="slide-title">${title}</h2>
      </div>

      <div class="slide-media">
        <img data-carousel-img src="" alt="" />
      </div>

      <div class="point-box" data-carousel-text></div>

      <div class="point-nav" aria-label="Point navigation">
        <button class="point-arrow" type="button" data-carousel-prev aria-label="Previous point">◀</button>
        <span class="point-counter" data-carousel-counter></span>
        <button class="point-arrow" type="button" data-carousel-next aria-label="Next point">▶</button>
      </div>

      <div class="point-dots" data-carousel-dots aria-label="Point progress"></div>
    </section>
  `;
}

/* ============ Reusable: carousel logic (Page 2/3/4) ============ */
function initPointCarousel(root, page) {
  if (!page || page.kind !== "carousel") return;

  const imgEl = root.querySelector("[data-carousel-img]");
  const textEl = root.querySelector("[data-carousel-text]");
  const counterEl = root.querySelector("[data-carousel-counter]");
  const dotsEl = root.querySelector("[data-carousel-dots]");

  const readBtn = root.querySelector(".tts-btn[data-tts]");

  let idx = 0;

  function renderDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = page.points
      .map((_, i) => `
        <button
          type="button"
          class="dot ${i === idx ? "is-active" : ""}"
          aria-label="Go to point ${i + 1}"
          data-carousel-go="${i}"
        ></button>
      `)
      .join("");

    dotsEl.querySelectorAll("[data-carousel-go]").forEach(b => {
      b.addEventListener("click", () => {
        stopSpeech();
        idx = Number(b.dataset.carouselGo);
        renderPoint();
      });
    });
  }

  function renderPoint() {
    const pt = page.points[idx];

    if (imgEl) {
      imgEl.src = pt.img || "";
      imgEl.alt = pt.alt || "";
    }
    if (textEl) textEl.innerHTML = pt.html || "";
    if (counterEl) counterEl.textContent = `${idx + 1} / ${page.points.length}`;

    // Update what the existing wireTTS handler will read
    if (readBtn) readBtn.setAttribute("data-tts", page.title + ". " + (pt.tts || ""));

    renderDots();
  }

  root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
    stopSpeech();
    idx = (idx - 1 + page.points.length) % page.points.length;
    renderPoint();
  });

  root.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
    stopSpeech();
    idx = (idx + 1) % page.points.length;
    renderPoint();
  });

  renderPoint();
}

/* ============ Pages (NSW-style: solid bg + white card) ============ */
const PAGES = [
  {
    kind: "cover",
    bg: PALETTE.navy,
    tts: "Emergency Exit Plan. Health Translation Hub. Level 6. North.",
    render: () => `
      <section class="slide cover-slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[0].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="cover-grid">
          <div class="cover-hero" aria-hidden="true">
            <img class="cover-hero-img" src="assets/cover-bg.png" alt="Cover image" />

            <div class="cover-overlay">
              <h1 class="cover-overlay-title">Emergency Exit Plan</h1>
              <div class="cover-overlay-sub">
                Health Translation Hub<br>
                Level 6<br>
                North
              </div>
            </div>

            <img class="cover-logo" src="assets/logo.png" alt="Logo" />
          </div>
        </div>
      </section>
    `
  },

  /* =================== PAGE 2 (Carousel) =================== */
  {
    kind: "carousel",
    bg: PALETTE.teal,
    title: "What is this",
    points: [
       {
    img: "assets/page2-1.png",
    alt: "Emergency exit plan overview",
    html: `
      <p><strong>About this plan</strong></p>
      <p>This plan shows where the <strong>emergency stairwells</strong> are located.</p>
      <p>Emergency stairwells help people leave the building safely during an emergency.</p>
    `,
    tts: "About this plan. This plan shows where the emergency stairwells are located. Emergency stairwells help people leave the building safely during an emergency."
  },

  {
    img: "assets/page2-2.png",
    alt: "Follow exit signs",
    html: `
      <p><strong>Follow exit signs</strong></p>
      <p>In an emergency:</p>
      <p> Follow the <strong>EXIT signs</strong> and use the nearest stairwell</p>
      
    `,
    tts: "Follow exit signs. In an emergency, follow the exit signs and use the nearest stairwell."
  },

  {
    img: "assets/page2-3.png",
    alt: "Fire warden",
    html: `
      <p><strong>Fire warden</strong></p>
      <p>Listen to instructions from the <strong>fire warden</strong>.</p>
      <p>A fire warden is the person who helps everyone evacuate safely.</p>
    `,
    tts: "Fire warden. Listen to instructions from the fire warden. A fire warden is the person who helps everyone evacuate safely."
  },

  {
    img: "assets/page2-4.png",
    alt: "Extra support",
    html: `
      <p><strong>Extra support</strong></p>
      <p>If you would like extra support during an evacuation, please talk to your manager.</p>
      <p>Your manager can help you set up a <strong>personal evacuation plan</strong>.</p>
    `,
    tts: "Extra support. If you would like extra support during an evacuation, please talk to your manager. Your manager can help you set up a personal evacuation plan."
  }
    ],
    render: () => renderPointCarousel(1)
  },

  /* =================== PAGE 3 (Carousel-ready, unchanged content for now) =================== */
  {
    kind: "carousel",
  bg: PALETTE.teal,
  title: "Important to know",

  points: [
     {
      img: "assets/page3-0.png",
      alt: "Two emergency stairwells",
      html: `
        <p>There are <strong>two emergency stairwells</strong> on our side.</p>
      `,
      tts: " There are two emergency stairwells on our side."
    },

    {
      img: "assets/page3-1.jpg",
      alt: "Stairwell near the lockers",
      html: `
        <p><strong>Stairwell near the lockers</strong></p>
        <p>One emergency stairwell is located <strong>near the lockers</strong>.</p>
      `,
      tts: "Stairwell near the lockers. One emergency stairwell is located near the lockers."
    },

    {
      img: "assets/page3-2.jpg",
      alt: "Stairwell near the restrooms",
      html: `
        <p><strong>Stairwell near the restrooms</strong></p>
        <p>Another emergency stairwell is located <strong>near the lifts</strong>.</p>
      `,
      tts: "Stairwell near the restrooms. Another emergency stairwell is located near the lifts."
    }
  ],

  render: () => renderPointCarousel(2)
  },

  {
    kind: "carousel",
  bg: PALETTE.teal,
  title: "During an emergency",

  points: [
    {
      img: "assets/page4-1.png",
      alt: "Stay calm",
      html: `
        <p><strong>Stay calm</strong></p>
      `,
      tts: " Stay calm."
    },

    {
      img: "assets/page4-2.png",
      alt: "Walk, do not run",
      html: `
        <p><strong>Walk.</strong> Do not run.</p>
      `,
      tts: "Walk. Do not run."
    },

    {
      img: "assets/page4-3.png",
      alt: "Do not use lifts",
      html: `
        <p><strong>Do not use the lift.</strong></p>
      `,
      tts: "Do not use lifts."
    },

    {
      img: "assets/page4-4.png",
      alt: "Use the emergency stairwell",
      html: `
        <p>Use the <strong>emergency stairwell</strong>.</p>
      `,
      tts: "Use the emergency stairwell."
    }
  ],

  render: () => renderPointCarousel(3)
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "Here is our area.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[4].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">Here is our area</h2>
        </div>

        <div class="slide-media">
          <img src="assets/area.png" alt="Our area map" />
        </div>
      </section>
    `
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "Go through the kitchen.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[5].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title"> Go through the kitchen</h2>
        </div>

        <div class="slide-media">
          <img src="assets/path.png" alt="Route through the kitchen" />
        </div>
      </section>
    `
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "The emergency exit is here.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[6].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">The emergency exit is here</h2>
        </div>

        <div class="slide-media">
          <img src="assets/exit.png" alt="Emergency exit location" />
        </div>
      </section>
    `
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "Stairwell near the lifts. This is the door to the emergency stairwell. Follow the exit sign and use this door.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[7].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">Stairwell near the lifts</h2>
        </div>

        <div class="slide-media">
          <img src="assets/Exit-photo.jpg" alt="Photo of the exit door" />
        </div>

        <p class="caption">
          This is the door to the emergency stairwell.<br>
          Follow the <strong>EXIT</strong> sign and use this door.
        </p>
      </section>
    `
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "Another emergency exit. There is another emergency exit near the locker area. Use this exit if you are closer to it.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[8].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">Another emergency exit</h2>
        </div>

        <div class="slide-media">
          <img src="assets/exit2.png" alt="Second exit location on the map" />
        </div>

        <p class="caption">
          There is another emergency exit near the locker area.<br>
          Use this exit if you are closer to it.
        </p>
      </section>
    `
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "Stairwell near the lockers. This is what the second exit door looks like. Use this exit if it is closer to you.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[9].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">Stairwell near the lockers</h2>
        </div>

        <div class="slide-media">
          <img src="assets/door2.png" alt="Photo of the second exit door" />
        </div>

        <p class="caption">
          This is what the second exit door looks like.<br>
          Use this exit if it is closer to you.
        </p>
      </section>
    `
  },
   {
  kind: "map",
  bg: PALETTE.pink,
  tts: "This is our assembly area. After leaving the building, go to the writtle park. The assembly area is the place where everyone gathers after leaving the building. ",

  render: () => `
    <section class="slide">

      <div class="tts-topright">
        <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[10].tts)}">🔊 Read</button>
        <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
      </div>

      <div class="slide-header">
        <h2 class="slide-title">This is our Assembly area</h2>
      </div>

      <div class="slide-media">
        <img src="assets/meeting.jpg" alt="Assembly area meeting point" />
      </div>

      <p class="caption">
        After leaving the building,
        go to the <strong>writtle park</strong>.<br>
        The <strong>assembly area</strong> is the place where everyone gathers after leaving the building.
      </p>

    </section>
  `
},

  {
    kind: "end",
    bg: PALETTE.navy,
    tts: "You are ready. You now know where the emergency exits are. and how to leave safely.",
    render: () => `
      <section class="slide cover-slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[11].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="cover-grid">
          <div class="cover-hero">
            <img class="cover-hero-img" src="assets/cover-bg.png" alt="Background image" />

            <div class="cover-overlay">
              <h2 class="cover-overlay-title">You are ready</h2>
              <div class="cover-overlay-sub">
                You now know where the emergency exits are<br>
                and how to leave safely.
              </div>
            </div>

            <img class="cover-logo" src="assets/logo.png" alt="Logo" />
          </div>
        </div>
      </section>
    `
  }
 
  
];

/* Wire TTS buttons inside a container */
function wireTTS(root) {
  root.querySelectorAll("[data-tts]").forEach(btn => {
    btn.addEventListener("click", () => speak(btn.getAttribute("data-tts")));
  });
  root.querySelectorAll("[data-stop]").forEach(btn => {
    btn.addEventListener("click", stopSpeech);
  });
}

/* ============ Navigation (Option A) ============ */
const app = document.getElementById("app");
let current = 0;

function goTo(idx) {
  const next = Math.max(0, Math.min(PAGES.length - 1, idx));
  if (next === current) return;

  stopSpeech(); // stop reading when leaving a page
  current = next;
  render();
}

function render() {
  const page = PAGES[current];
  const isFirst = current === 0;
  const isLast = current === PAGES.length - 1;

  const dots = PAGES.map((_, i) => `
    <button
      class="dot ${i === current ? "is-active" : ""}"
      type="button"
      aria-label="Go to page ${i + 1}"
      data-go="${i}"
    ></button>
  `).join("");

  app.innerHTML = `
    <section class="screen" style="--bg: ${page.bg || PALETTE.navy}">
      <div class="card">
        ${page.render()}
      </div>
    </section>

    <div class="navbar" role="navigation" aria-label="Module navigation">
      <div class="navbar-inner">
        <button class="navbtn" type="button" aria-label="Previous" ${isFirst ? "disabled" : ""} data-prev="1">‹</button>
        <div class="dots" aria-label="Progress">${dots}</div>
        <button class="continue" type="button" ${isLast ? "disabled" : ""} data-next="1">
          ${isLast ? "Done" : "Continue"}
        </button>
      </div>
    </div>
  `;

  // 1) bind TTS buttons
  wireTTS(app);

  // 2) bind main navigation
  app.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => goTo(Number(b.dataset.go))));
  app.querySelectorAll("[data-prev]").forEach(b => b.addEventListener("click", () => goTo(current - 1)));
  app.querySelectorAll("[data-next]").forEach(b => b.addEventListener("click", () => goTo(current + 1)));

  // 3) init carousel pages (Page 2 / 3 / 4 later)
  if (page.kind === "carousel") {
    const slideRoot = app.querySelector("[data-carousel]");
    initPointCarousel(slideRoot || app, page);
  }
}

/* Keyboard nav: left/right arrows */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

render();
