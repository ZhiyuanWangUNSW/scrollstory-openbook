const scroller = scrollama();
const book = document.getElementById("pdf");

/* ---------- TTS helpers ---------- */
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

/* ---------- Page templates ---------- */
const PAGES = [
  // 0) Cover
  {
    kind: "cover",
    tts: "Emergency Exit Plan. Health Translation Hub. Level 6. North.",
    render: () => `
      <div class="cover">
        <img class="cover-bg" src="assets/cover-bg.png" alt="Cover background" />
        <div class="cover-content">

          <div class="tts-topright">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[0].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <div class="cover-text">
            <div class="title">Emergency Exit Plan</div>
            <div class="sub">Health Translation Hub<br>Level 6<br>North</div>
          </div>

          <img class="logo" src="assets/logo.png" alt="Logo" />
        </div>
      </div>
    `
  },

  // 1) What is this
  {
    kind: "text",
    tts: "What is this. This map shows where the emergency stairwells are located. It helps you understand how to leave our office area safely.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/text-bg.png" alt="Text background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[1].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page2-title">What is this</h2>
          <ul class="page2-list">
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
          </ul>
        </div>
      </div>
    `
  },

  // 2) Important to know
  {
    kind: "text",
    tts: "Important to know. The red line shows a general path to the nearest stairwell. There are two emergency stairwells on our side. In a real emergency, follow the exit signs and instructions from fire wardens. The photos help you recognize the stairwell door.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/text-bg.png" alt="Text background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[2].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page3-title">Important to<br>know</h2>
          <ul class="page3-list">
            <li>The red line shows a general path to the nearest stairwell.</li>
            <li>There are two emergency stairwells on our side.</li>
            <li>
            In a real emergency, follow the
            <span class="tooltip tooltip-image">
              <strong>EXIT</strong>
              <span class="tooltip-box">
                <img src="assets/exit-logo.png" alt="Exit door" class="tooltip-img">
                <span class="tooltip-caption">Exit door</span>
              </span>
            </span>
            signs and instructions from fire wardens.
            </li>
            <li>The photos help you recognize the stairwell door.</li>
          </ul>
        </div>
      </div>
    `
  },

  // 3) During the emergency
  {
    kind: "text",
    tts: "During the emergency. Stay calm. Walk. Do not run. Do not use the lift. Follow the exit signs and use the emergency stairwell.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/text-bg.png" alt="Text background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[3].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page4-title">During the<br>emergency</h2>
          <ul class="page4-list">
            <li>Stay calm</li>
            <li>Walk. Do not run</li>
            <li><strong>Do not use the lift</strong></li>
            <li>Follow the Exit signs and use the emergency stairwell</li>
          </ul>
        </div>
      </div>
    `
  },

  // 4) Our Area
  {
    kind: "map",
    tts: "Here is our area.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/map-bg.png" alt="Background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[4].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page2-title">Here is our area</h2>
          <img src="assets/area.png" class="map-slide" alt="Our Area map" />
        </div>
      </div>
    `
  },

  // 5) Through kitchen
  {
    kind: "map",
    tts: "Go through the kitchen.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/map-bg.png" alt="Background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[5].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page2-title">Through kitchen</h2>
          <img src="assets/path.png" class="map-slide" alt="Through kitchen path" />
        </div>
      </div>
    `
  },

  // 6) Emergency exit (map)
  {
    kind: "map",
    tts: "The emergency exit is here.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/map-bg.png" alt="Background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[6].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page2-title">Emergency exit</h2>
          <img src="assets/exit.png" class="map-slide" alt="Exit map" />
        </div>
      </div>
    `
  },

  // 7) Exit door photo
  {
    kind: "map",
    tts: "This is what the exit door looks like. Follow the exit sign and use this door.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/map-bg.png" alt="Background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[7].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page2-title">Exit door</h2>

          <img src="assets/Exit-photo.png" class="map-slide" alt="Exit door photo" />

          <p class="door-caption">
            This is what the exit door looks like.<br>
            Follow the EXIT sign and use this door.
          </p>
        </div>
      </div>
    `
  },

  // 8) Alternative emergency exit
  {
    kind: "map",
    tts: "There is another emergency exit near the locker area. You can use this exit if you are closer to it. Follow the exit signs.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/map-bg.png" alt="Background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[8].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page2-title">Another emergency<br>exit</h2>

          <img src="assets/exit2.png" class="map-slide" alt="Second exit location" />

          <p class="door-caption">
            There is another emergency exit near the locker area.<br>
            Use this exit if you are closer to it.
          </p>
        </div>
      </div>
    `
  },

  // 9) Second exit door photo
  {
    kind: "map",
    tts: "This is what the second exit door looks like. Follow the exit sign and use this door if it is closer to you.",
    render: () => `
      <div class="page">
        <img class="page-bg" src="assets/map-bg.png" alt="Background" />
        <div class="page-content">
          <div class="page-tts">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[9].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <h2 class="page2-title">Second exit door</h2>

          <img src="assets/door2.png" class="map-slide" alt="Second exit door photo" />

          <p class="door-caption">
            This is what the second exit door looks like.<br>
            Use this exit if it is closer to you.
          </p>
        </div>
      </div>
    `
  },

  // 10) End page (same background as cover)
  {
    kind: "end",
    tts: "You're ready. You now know where the emergency exits are and how to leave safely.",
    render: () => `
      <div class="cover">
        <img class="cover-bg" src="assets/cover-bg.png" alt="Cover background" />
        <div class="cover-content">

          <div class="tts-topright">
            <button type="button" class="tts-btn" data-tts="${escapeAttr(PAGES[10].tts)}">🔊 Read</button>
            <button type="button" class="tts-btn" data-stop="1">⏹ Stop</button>
          </div>

          <div class="cover-text cover-text--left">
            <div class="title">You’re ready</div>
            <div class="sub">
              You now know where the emergency exits are<br>
              and how to leave safely.
            </div>
          </div>

          <img class="logo" src="assets/logo.png" alt="Logo" />
        </div>
      </div>
    `
  }
];

/* A blank right page (cover spread, or after the end) */
function blankPageHTML() {
  return `
    <div class="page">
      <div class="page-content">
        <!-- intentionally blank -->
      </div>
    </div>
  `;
}

/* Render ONE page by index (or blank if out of range) */
function pageHTML(idx) {
  if (idx < 0 || idx >= PAGES.length) return blankPageHTML();
  return PAGES[idx].render();
}

/* Wire TTS buttons inside a container */
function wireTTS(root) {
  root.querySelectorAll("[data-tts]").forEach(btn => {
    btn.addEventListener("click", () => speak(btn.getAttribute("data-tts")));
  });
  root.querySelectorAll("[data-stop]").forEach(btn => {
    btn.addEventListener("click", stopSpeech);
  });
}

/* Render the 2-page spread: left=i, right=i+1 */
function renderSpread(leftIdx) {
  const rightIdx = leftIdx + 1;

  book.innerHTML = `
    <div class="book-page" id="page-left" aria-label="Left page">
      ${pageHTML(leftIdx)}
    </div>
    <div class="book-page" id="page-right" aria-label="Right page">
      ${pageHTML(rightIdx)}
    </div>
  `;

  wireTTS(book);
}

/* ---------- Flip animation (advance by 1) ---------- */
let currentLeft = 0;
let isAnimating = false;

function flipTo(nextLeft, direction) {
  if (isAnimating) return;
  isAnimating = true;

  const leftEl = document.getElementById("page-left");
  const rightEl = document.getElementById("page-right");

  // DOWN = flip RIGHT page forward
  // UP   = flip LEFT page back
  const target = direction === "down" ? rightEl : leftEl;
  const cls = direction === "down" ? "flip-out-forward" : "flip-out-back";

  if (!target) {
    // fallback
    renderSpread(nextLeft);
    currentLeft = nextLeft;
    isAnimating = false;
    return;
  }

  target.classList.add(cls);

  const onEnd = (e) => {
    if (e.propertyName !== "transform") return;
    target.removeEventListener("transitionend", onEnd);

    // Swap spread at the flip edge
    renderSpread(nextLeft);
    currentLeft = nextLeft;

    // Remove flip class on NEW elements (after re-render)
    requestAnimationFrame(() => {
      const newLeft = document.getElementById("page-left");
      const newRight = document.getElementById("page-right");
      if (newLeft) newLeft.classList.remove("flip-out-forward", "flip-out-back");
      if (newRight) newRight.classList.remove("flip-out-forward", "flip-out-back");

      setTimeout(() => { isAnimating = false; }, 460);
    });
  };

  target.addEventListener("transitionend", onEnd);
}

/* Scrollama handler */
function onStepEnter(res) {
  const nextLeft = Number(res.element.getAttribute("data-step"));
  if (Number.isNaN(nextLeft) || nextLeft === currentLeft) return;
  flipTo(nextLeft, res.direction);
}

function init() {
  renderSpread(0);
  currentLeft = 0;

  scroller
    .setup({
      step: ".step",
      offset: 0.6,
      debug: false
    })
    .onStepEnter(onStepEnter);

  window.addEventListener("resize", scroller.resize);
}

init();