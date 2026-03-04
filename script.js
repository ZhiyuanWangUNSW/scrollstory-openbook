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
        alt: "Emergency stairwells overview",
        html: `
          <p><strong>This plan shows where the emergency stairwells are located.</strong></p>
          <p>
            <span class="tooltip">
              Emergency stairwells
              <span class="tooltip-box">
                Emergency stairwells are protected stairs used to leave the building safely during an emergency.
              </span>
            </span>
            help people leave the building safely during an emergency.
          </p>
        `,
        tts: "This map shows where the emergency stairwells are located. Emergency stairwells are protected stairs used to leave the building safely during an emergency."
      },
      {
        img: "assets/page2-2.png",
        alt: "Leaving our office area",
        html: `
          <p><strong>It helps you understand how to leave our office area safely.</strong></p>
          <p>In a real emergency, follow the EXIT signs and instructions from fire wardens.</p>
        `,
        tts: "It helps you understand how to leave our office area safely. In a real emergency, follow the exit signs and instructions from fire wardens."
      },
      {
        img: "assets/page2-3.png",
        alt: "Buddy plan",
        html: `
          <p><strong>If you would like extra support during an evacuation, please talk to your manager.</strong></p>
          <p>Your manager can help you set up a personal evacuation plan.</p>
        `,
        tts: "If you would like extra support during an evacuation, please talk to your manager. Your manager can help you set up a personal evacuation plan."
      }
    ],
    render: () => renderPointCarousel(1)
  },

  /* =================== PAGE 3 (Carousel-ready, unchanged content for now) =================== */
  {
    kind: "text",
    bg: PALETTE.teal,
    tts: "Important to know. The red line shows a general path to the nearest stairwell. There are two emergency stairwells on our side. In a real emergency, follow the exit signs and instructions from fire wardens. The photos help you recognize the stairwell door.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[2].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">Important to know</h2>
        </div>

        <div class="slide-body">
          <ul>
            <li>There are two emergency stairwells on our side.</li>
            <li>
              In a real emergency, follow the
              <span class="tooltip tooltip-image">
                <strong>EXIT</strong>
                <span class="tooltip-box">
                  <img src="assets/exit-logo.png" alt="Exit sign" class="tooltip-img">
                  <span class="tooltip-caption">Exit sign</span>
                </span>
              </span>
              signs and instructions from fire wardens.
            </li>
            <li>The photos help you recognise the stairwell door.</li>
          </ul>
        </div>
      </section>
    `
  },

  {
    kind: "text",
    bg: PALETTE.teal,
    tts: "During the emergency. Stay calm. Walk. Do not run. Do not use the lift. Follow the exit signs and use the emergency stairwell.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[3].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">During the emergency</h2>
        </div>

        <div class="slide-body">
          <ul>
            <li>Stay calm.</li>
            <li>Walk. Do not run.</li>
            <li><strong>Do not use the lift.</strong></li>
            <li>Follow the EXIT signs and use the emergency stairwell.</li>
          </ul>
        </div>
      </section>
    `
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
          
          <h2 class="slide-title">Through kitchen</h2>
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
          
          <h2 class="slide-title">Emergency exit</h2>
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
    tts: "This is what the exit door looks like. Follow the exit sign and use this door.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[7].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">Exit door</h2>
        </div>

        <div class="slide-media">
          <img src="assets/Exit-photo.jpg" alt="Photo of the exit door" />
        </div>

        <p class="caption">
          This is what the exit door looks like.<br>
          Follow the EXIT sign and use this door.
        </p>
      </section>
    `
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "There is another emergency exit near the locker area. You can use this exit if you are closer to it. Follow the exit signs.",
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
          Use this exit if you are closer to you.
        </p>
      </section>
    `
  },

  {
    kind: "map",
    bg: PALETTE.pink,
    tts: "This is what the second exit door looks like. Follow the exit sign and use this door if it is closer to you.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[9].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          
          <h2 class="slide-title">Second exit door</h2>
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
    kind: "end",
    bg: PALETTE.navy,
    tts: "You re ready. You now know where the emergency exits are and how to leave safely.",
    render: () => `
      <section class="slide cover-slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[10].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="cover-grid">
          <div class="cover-hero">
            <img class="cover-hero-img" src="assets/cover-bg.png" alt="Background image" />

            <div class="cover-overlay">
              <h2 class="cover-overlay-title">You’re ready</h2>
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
