(function () {
  const API_URL = "/api/chat"; // Vercel serverless function path

  const QUICK_REPLIES = [
    "What projects has he built?",
    "What's his tech stack?",
    "How can I hire him?",
  ];

  let history = []; // { role: 'user'|'assistant', content: string }
  let isOpen = false;
  let hasGreeted = false;

  // ── Build widget DOM ──────────────────────────────────────
  const toggle = document.createElement("button");
  toggle.className = "chat-toggle";
  toggle.setAttribute("aria-label", "Open AI chat");
  toggle.innerHTML = `
    <i class="fa-solid fa-comment-dots"></i>
    <i class="fa-solid fa-xmark"></i>
  `;

  const panel = document.createElement("div");
  panel.className = "chat-panel";
  panel.innerHTML = `
    <div class="chat-header">
      <h3>Ask about Manik</h3>
      <p>AI Assistant · Powered by <span>Groq</span></p>
    </div>
    <div class="chat-messages" id="chatMessages"></div>
    <div class="chat-quick-replies" id="chatChips"></div>
    <div class="chat-input-row">
      <input type="text" id="chatInput" placeholder="Type a question..." maxlength="300" />
      <button class="chat-send" id="chatSend" aria-label="Send message">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector("#chatMessages");
  const chipsEl = panel.querySelector("#chatChips");
  const inputEl = panel.querySelector("#chatInput");
  const sendBtn = panel.querySelector("#chatSend");

  // ── Cursor hover integration (matches existing custom cursor) ──
  [toggle, panel].forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });

  // ── Toggle open/close ──
  toggle.addEventListener("click", () => {
    isOpen = !isOpen;
    toggle.classList.toggle("open", isOpen);
    panel.classList.toggle("open", isOpen);

    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      addMessage(
        "bot",
        "Hey! I'm here to answer anything about Manik — his projects, skills, or how to get in touch. What do you want to know?",
      );
      renderChips();
    }

    if (isOpen) inputEl.focus();
  });

  // ── Render quick reply chips ──
  function renderChips() {
    chipsEl.innerHTML = QUICK_REPLIES.map(
      (q) => `<button class="chat-chip">${q}</button>`,
    ).join("");

    chipsEl.querySelectorAll(".chat-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        sendMessage(chip.textContent);
        chipsEl.innerHTML = ""; // hide chips after first use
      });
    });
  }

  // ── Add a message bubble ──
  function addMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-msg ${role === "user" ? "user" : "bot"}`;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ── Typing indicator ──
  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "chat-typing";
    typing.id = "chatTyping";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById("chatTyping");
    if (typing) typing.remove();
  }

  // ── Send message to backend ──
  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMessage("user", trimmed);
    history.push({ role: "user", content: trimmed });

    inputEl.value = "";
    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json();
      hideTyping();

      const reply = data.reply || "Sorry, something went wrong. Try again!";
      addMessage("bot", reply);
      history.push({ role: "assistant", content: reply });
    } catch (err) {
      hideTyping();
      addMessage(
        "bot",
        "Couldn't reach the server. Please try again, or email Manik directly at manikkori697@gmail.com",
      );
      console.error("Chat error:", err);
    } finally {
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  // ── Input handlers ──
  sendBtn.addEventListener("click", () => sendMessage(inputEl.value));
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(inputEl.value);
  });
})();
