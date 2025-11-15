document.addEventListener("DOMContentLoaded", function () {
  // Mark that JS is enabled for CSS targeting
  document.documentElement.classList.add("js-enabled");

  const trigger = document.querySelector(".python-trigger");
  const terminal = document.getElementById("python-terminal");

  const zenText = `The Zen of Python, by Tim Peters

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

  function typeWriter(element, text, speed = 50) {
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

  async function runPythonAnimation() {
    // Run only once
    if (!terminal.classList.contains("hidden")) return;

    terminal.innerHTML = `
      <div class="terminal-prompt">
        <span class="prompt-symbol">$</span>
        <span class="command-text"></span>
        <span class="cursor">█</span>
      </div>
    `;

    terminal.classList.remove("hidden");
    terminal.scrollIntoView({ behavior: "smooth" });

    const commandText = terminal.querySelector(".command-text");
    const cursor = terminal.querySelector(".cursor");

    await new Promise((resolve) => setTimeout(resolve, 800));

    await typeWriter(commandText, "python", 80);

    await new Promise((resolve) => setTimeout(resolve, 500));

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

    const newCommandText = terminal.querySelector(
      ".terminal-prompt:last-child .command-text",
    );
    const newCursor = terminal.querySelector(
      ".terminal-prompt:last-child .cursor",
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    await typeWriter(newCommandText, "import this", 80);

    await new Promise((resolve) => setTimeout(resolve, 500));

    newCursor.style.display = "none"; // Remove cursor

    terminal.innerHTML += `
      <div class="zen-content">${zenText}</div>
      <div class="terminal-prompt">
        <span class="repl-prompt-symbol">>>></span>
        <span class="cursor">█</span>
      </div>
    `;
  }

  function initGhostCursor() {
    let isClicked = false;
    let isAnimating = false;

    const text = trigger.textContent;

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

    async function ghostEditSession() {
      if (isClicked || isAnimating) return;

      isAnimating = true;

      // Secuencia de movimientos realista
      const actions = [
        { type: "move", pos: 0, delay: 300 },
        { type: "move", pos: 1, delay: 200 },
        { type: "move", pos: 2, delay: 180 },
        { type: "move", pos: 3, delay: 220 },
        { type: "move", pos: 2, delay: 150 },
        { type: "move", pos: 3, delay: 180 },
        { type: "edit", pos: 3, char: "X", delay: 100 },
        { type: "edit", pos: 3, char: text[3], delay: 300 },
        { type: "move", pos: 4, delay: 200 },
        { type: "move", pos: 5, delay: 250 },
      ];

      function executeAction(index) {
        if (index >= actions.length) {
          hideCursor();
          isAnimating = false;
          // Next session in 15-25 seconds
          setTimeout(ghostEditSession, Math.random() * 10000 + 15000);
          return;
        }

        const action = actions[index];
        updateCursor(action.pos, action.char);
        showCursor();

        setTimeout(() => executeAction(index + 1), action.delay);
      }

      executeAction(0);
    }

    updateCursor(0);

    // First session after 3-8 seconds
    setTimeout(ghostEditSession, Math.random() * 5000 + 3000);

    trigger.addEventListener("click", () => {
      isClicked = true;
      hideCursor();
      runPythonAnimation();
    });
  }

  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      runPythonAnimation();
    }
  });

  initGhostCursor();
});
