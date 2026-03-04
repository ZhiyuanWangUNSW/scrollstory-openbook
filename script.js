/* ============ TTS helpers (kept for all pages) ============ */
function speak(text) {
  if (!text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-AU";
  window.speechSynthesis.speak(u);
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

/* ============ Palette (from your current app) ============ */
const PALETTE = {
  navy: "#2d3f2e",
  teal: "#6c7659",
  pink: "#d6d1c7",
};

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

  {
    kind: "text",
    bg: PALETTE.teal,
    tts: "What is this. This map shows where the emergency stairwells are located. It helps you understand how to leave our office area safely. If you would like extra support during an evacuation, please talk to your manager about setting up a buddy plan.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[1].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          <p class="slide-kicker">Emergency exit</p>
          <h2 class="slide-title">What is this</h2>
        </div>

        <div class="slide-body">
          <ul>
            <li>
              This map shows where the
              <span class="tooltip">
                emergency stairwells
                <span class="tooltip-box">
                  Emergency stairwells are protected stairs used to leave the building safely during an emergency.
                </span>
              </span>
              are located.
            </li>
            <li>It helps you understand how to leave our office area safely.</li>
            <li>If you would like extra support during an evacuation, 
            please talk to your manager.</li>
          </ul>
        </div>
      </section>
    `
  },

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
          <p class="slide-kicker">Emergency exit</p>
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
          <p class="slide-kicker">Emergency exit</p>
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
          <p class="slide-kicker">Emergency exit</p>
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
          <p class="slide-kicker">Emergency exit</p>
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
          <p class="slide-kicker">Emergency exit</p>
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
          <p class="slide-kicker">Emergency exit</p>
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
          <p class="slide-kicker">Emergency exit</p>
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
    tts: "This is what the second exit door looks like. Follow the exit sign and use this door if it is closer to you.",
    render: () => `
      <section class="slide">
        <div class="tts-topright">
          <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[9].tts)}">🔊 Read</button>
          <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
        </div>

        <div class="slide-header">
          <p class="slide-kicker">Emergency exit</p>
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
    tts: "You are ready. You now know where the emergency exits are and how to leave safely.",
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

  wireTTS(app);

  app.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => goTo(Number(b.dataset.go))));
  app.querySelectorAll("[data-prev]").forEach(b => b.addEventListener("click", () => goTo(current - 1)));
  app.querySelectorAll("[data-next]").forEach(b => b.addEventListener("click", () => goTo(current + 1)));
}

/* Keyboard nav: left/right arrows */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(current - 1);
  if (e.key === "ArrowRight") goTo(current + 1);
});

render();
