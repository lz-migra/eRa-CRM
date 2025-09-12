// 🌍 ChatUI — Enviar mensajes con estructura Twilio, blur y arrastrable
window.ChatUI = (function () {
  let uiElement = null;
  let offsetX = 0, offsetY = 0, isDragging = false;

  // ✨ Formatear hora en estilo "06:06 p. m."
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .replace(".", ":")
      .replace("AM", "a. m.")
      .replace("PM", "p. m.");
  }

  // ✨ Crear y agregar mensaje
  function sendMessage(text) {
    const container = document.querySelector(".Twilio-MessageList");
    if (!container) {
      showNotification("⚠️ Contenedor no encontrado", true);
      return;
    }

    const msg = document.createElement("div");
    msg.className = "Twilio Twilio-MessageListItem css-zafby2 css-4x5hik";
    msg.setAttribute("role", "listitem");

    msg.innerHTML = `
      <div class="Twilio-MessageListItem-default css-18ljn0d" data-testid="flex-box">
        <div class="Twilio-MessageListItem-ContentContainer css-g7miak" data-testid="flex-box">
          <div class="Twilio-MessageListItem-AvatarContainer css-1nsblyc" data-testid="flex-box">
            <div class="Twilio-ChatItem-Avatar css-b64iu8">
              <div class="Twilio-Icon Twilio-Icon-DefaultAvatar css-1j3rlv1" data-testid="Twilio-Icon">
                <svg class="Twilio-Icon-Content" height="1em" viewBox="0 0 24 24" width="1em">
                  <g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="7.896" r="5.26"></circle>
                    <path d="M9.662 9.638c.778.78 1.557 1.17 2.338 1.17.782 0 1.564-.39 2.348-1.17M4.499 21.337c.04-2.067.774-3.756 2.199-5.067C8.123 14.958 9.89 14.31 12 14.325M19.501 21.338c-.04-2.067-.774-3.757-2.199-5.068-1.425-1.312-3.192-1.96-5.302-1.945"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div class="Twilio-MessageListItem-BubbleContainer css-1jfuie8" data-message-item="true" tabindex="-1">
            <div class="Twilio Twilio-MessageBubble css-oft7yw css-x79cgj" data-testid="flex-box">
              <div class="Twilio-MessageBubble-default css-18ljn0d" data-testid="flex-box">
                <div class="Twilio-MessageBubble-Header css-a6kf6c css-g7miak" data-testid="flex-box">
                  <div class="Twilio-MessageBubble-UserName css-1ylazt5" data-testid="message-sendername">
                    Tú
                  </div>
                  <div class="Twilio-MessageBubble-Time css-bgz8w0">
                    ${formatTime(new Date())}
                  </div>
                </div>
                <div class="Twilio-MessageBubble-Body css-xvvwlo" data-testid="message-body">
                  <span>${text}</span>
                </div>
              </div>
              <div class="Twilio-MessageBubble-end css-wicpu5" data-testid="flex-box"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="Twilio-MessageListItem-end css-wicpu5" data-testid="flex-box"></div>
    `;

    const typing = container.querySelector(".Twilio-TypingIndicator");
    container.insertBefore(msg, typing);

    showNotification("✅ Mensaje enviado");
  }

  // ✨ Notificación
  function showNotification(message, isError = false) {
    if (!uiElement) return;
    const notifArea = uiElement.querySelector("#ui-notification");
    notifArea.textContent = message;
    notifArea.style.color = isError ? "#ff6b6b" : "#6bffb8";
    notifArea.style.opacity = "1";
    setTimeout(() => { notifArea.style.opacity = "0"; }, 3000);
  }

  // ------------------ UI ------------------
  function openui() {
    if (uiElement) return;

    uiElement = document.createElement("div");
    uiElement.style.cssText = `
      position:fixed; bottom:12px; right:12px;
      background:rgba(34,34,34,0.6); color:#fff;
      backdrop-filter: blur(6px);
      padding:8px; border-radius:10px;
      box-shadow:0 4px 14px rgba(0,0,0,0.5);
      z-index:999999; font-family:sans-serif; font-size:13px;
      display:flex; flex-direction:column; gap:6px; width:240px;`;

    // --- Header arrastrable ---
    const header = document.createElement("div");
    header.style.cssText = "display:flex; justify-content:space-between; align-items:center; cursor:move;";
    header.innerHTML = `
      <div style="font-weight:700;">💬 ChatUI</div>
      <div id="ui-notification" style="flex:1;text-align:center;font-size:12px;transition:opacity 0.5s ease;opacity:0;"></div>`;
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "❌";
    closeBtn.style.cssText = "cursor:pointer; padding:2px;";
    closeBtn.onclick = () => closeui();
    header.appendChild(closeBtn);
    uiElement.appendChild(header);

    // --- Drag events ---
    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - uiElement.offsetLeft;
      offsetY = e.clientY - uiElement.offsetTop;
    });
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        uiElement.style.left = (e.clientX - offsetX) + "px";
        uiElement.style.top = (e.clientY - offsetY) + "px";
        uiElement.style.right = "auto";
        uiElement.style.bottom = "auto";
        uiElement.style.position = "fixed";
      }
    });
    document.addEventListener("mouseup", () => { isDragging = false; });

    // --- Input ---
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Escribe un mensaje...";
    textarea.style.cssText = "width:100%;height:60px;padding:6px;border-radius:6px;border:1px solid #444;background:#111;color:#fff;";
    uiElement.appendChild(textarea);

    // --- Botón enviar ---
    const sendBtn = document.createElement("button");
    sendBtn.innerText = "Enviar 🚀";
    sendBtn.style.cssText = "cursor:pointer; padding:6px; border-radius:6px; border:1px solid #27ae60; background:#2ecc71; color:white;";
    sendBtn.onclick = () => {
      const text = textarea.value.trim();
      if (text) {
        sendMessage(text);
        textarea.value = "";
      } else {
        showNotification("⚠️ Escribe algo", true);
      }
    };
    uiElement.appendChild(sendBtn);

    // --- Enter para enviar ---
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });

    document.body.appendChild(uiElement);
  }

  function closeui() {
    if (uiElement) {
      uiElement.remove();
      uiElement = null;
    }
  }

  return { openui, closeui, sendMessage };
})();

// 👉 Para abrir el panel:
ChatUI.openui();
