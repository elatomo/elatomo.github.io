/**
 * Easter eggs for navika.io
 *
 * Ghost cursor animation + Python REPL with "import this"
 */

const CONFIG = {
  TYPING_SPEED: 80,
  INITIAL_DELAY: 800,
  COMMAND_DELAY: 500,
  GHOST_CURSOR: {
    MIN_DELAY: 3000,
    MAX_DELAY: 8000,
    NEXT_SESSION_MIN: 15000,
    NEXT_SESSION_MAX: 25000,
  },
};

const ZEN_OF_PYTHON = `The Zen of Python, by Tim Peters

Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!`;

/**
 * Typewriter effect for terminal output
 */
function typeWriter(element, text, speed = CONFIG.TYPING_SPEED) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

/**
 * Generate random delay within range
 */
function randomDelay(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Runs the full Python REPL animation sequence
 */
async function runPythonAnimation() {
  const terminal = document.getElementById("python-terminal");
  const trigger = document.querySelector(".python-trigger");

  // Run only once
  if (!terminal.classList.contains("hidden")) return;

  // Disable ghost cursor
  trigger.style.cursor = "default";

  // Initialize terminal with shell prompt
  terminal.innerHTML = `
    <div class="terminal-prompt">
      <span class="prompt-symbol">$</span>
      <span class="command-text"></span>
      <span class="cursor">█</span>
    </div>
  `;

  terminal.classList.remove("hidden");

  const commandText = terminal.querySelector(".command-text");
  const cursor = terminal.querySelector(".cursor");

  // Initial delay before typing
  await new Promise((resolve) => setTimeout(resolve, CONFIG.INITIAL_DELAY));

  // Type "python" command
  await typeWriter(commandText, "python", CONFIG.TYPING_SPEED);
  await new Promise((resolve) => setTimeout(resolve, CONFIG.COMMAND_DELAY));

  // Remove cursor and show Python startup
  cursor.style.display = "none";

  terminal.innerHTML += `
    <div class="terminal-line">Python 3.14.159 (main, Jan  1 1970, 00:00:00) on linux</div>
    <div class="terminal-line">Type "help", "copyright", "credits" or "license" for more information.</div>
    <div class="terminal-prompt">
      <span class="repl-prompt-symbol">>>></span>
      <span class="command-text"></span>
      <span class="cursor">█</span>
    </div>
  `;

  // Get new elements for REPL
  const newCommandText = terminal.querySelector(
    ".terminal-prompt:last-child .command-text",
  );
  const newCursor = terminal.querySelector(
    ".terminal-prompt:last-child .cursor",
  );

  await new Promise((resolve) => setTimeout(resolve, CONFIG.COMMAND_DELAY));

  // Type "import this"
  await typeWriter(newCommandText, "import this", CONFIG.TYPING_SPEED);
  await new Promise((resolve) => setTimeout(resolve, CONFIG.COMMAND_DELAY));

  // Remove cursor and show Zen of Python
  newCursor.style.display = "none";

  terminal.innerHTML += `
    <div class="zen-content">${ZEN_OF_PYTHON}</div>
    <div class="terminal-prompt">
      <span class="repl-prompt-symbol">>>></span>
      <span class="cursor">█</span>
    </div>
  `;
}

/**
 * Initializes the ghost cursor effect on the Python trigger
 * Simulates realistic editing behavior with cursor movements
 */
function initGhostCursor() {
  const trigger = document.querySelector(".python-trigger");
  const text = trigger.textContent;

  let isClicked = false;
  let isAnimating = false;

  /**
   * Updates cursor position and character
   */
  function updateCursor(position, char = null) {
    const displayChar = char || text[position] || "";
    trigger.style.setProperty("--cursor-pos", `${position}ch`);
    trigger.setAttribute("data-cursor-char", displayChar);
  }

  function showCursor() {
    trigger.classList.add("show-cursor");
  }

  function hideCursor() {
    trigger.classList.remove("show-cursor");
  }

  /**
   * Runs a realistic ghost editing session
   * Simulates cursor movements and brief editing
   */
  async function ghostEditSession() {
    if (isClicked || isAnimating) return;

    isAnimating = true;

    // Realistic editing sequence
    const actions = [
      { type: "move", pos: 0, delay: 300 },
      { type: "move", pos: 1, delay: 200 },
      { type: "move", pos: 2, delay: 180 },
      { type: "move", pos: 3, delay: 220 },
      { type: "move", pos: 2, delay: 150 }, // Go back
      { type: "move", pos: 3, delay: 180 },
      { type: "edit", pos: 3, char: "X", delay: 100 }, // Brief typo
      { type: "edit", pos: 3, char: text[3], delay: 300 }, // Correct it
      { type: "move", pos: 4, delay: 200 },
      { type: "move", pos: 5, delay: 250 },
    ];

    function executeAction(index) {
      if (index >= actions.length) {
        hideCursor();
        isAnimating = false;
        // Schedule next session
        const nextDelay = randomDelay(
          CONFIG.GHOST_CURSOR.NEXT_SESSION_MIN,
          CONFIG.GHOST_CURSOR.NEXT_SESSION_MAX,
        );
        setTimeout(ghostEditSession, nextDelay);
        return;
      }

      const action = actions[index];
      updateCursor(action.pos, action.char);
      showCursor();

      setTimeout(() => executeAction(index + 1), action.delay);
    }

    executeAction(0);
  }

  // Initialize cursor
  updateCursor(0);

  // Start first session after random delay
  const initialDelay = randomDelay(
    CONFIG.GHOST_CURSOR.MIN_DELAY,
    CONFIG.GHOST_CURSOR.MAX_DELAY,
  );
  setTimeout(ghostEditSession, initialDelay);

  // Disable ghost cursor on interaction
  trigger.addEventListener("click", () => {
    isClicked = true;
    hideCursor();
    runPythonAnimation();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Mark that JS is enabled for CSS targeting
  document.documentElement.classList.add("js-enabled");

  const trigger = document.querySelector(".python-trigger");

  // Initialize ghost cursor effect
  initGhostCursor();

  // Keyboard accessibility
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      runPythonAnimation();
    }
  });
});
