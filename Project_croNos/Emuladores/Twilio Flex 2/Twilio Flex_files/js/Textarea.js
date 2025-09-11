// =============================
// ✉️ Restaurar función de envío
// =============================

// Seleccionamos el textarea y el botón send
const inputMensaje = document.querySelector("textarea[data-testid='message-input']");
const botonSend = document.querySelector("button[data-testid='send-message']");
const contenedorMensajes = document.querySelector(".Twilio.Twilio-MessageList");

// Función para crear un nuevo mensaje
function agregarMensaje(texto) {
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "Twilio Twilio-MessageListItem css-zafby2 css-4x5hik";
    nuevoMensaje.setAttribute("role", "listitem");

    nuevoMensaje.innerHTML = `
        <div data-testid="flex-box" class="Twilio-MessageListItem-default css-18ljn0d">
            <div data-testid="flex-box" class="Twilio-MessageListItem-ContentContainer css-g7miak">
                <div data-testid="flex-box" class="Twilio-MessageListItem-AvatarContainer css-1nsblyc">
                    <div class="Twilio-ChatItem-Avatar css-1c5fhxm"></div>
                </div>
                <div data-testid="MenuListItem-BubbleContainer" class="Twilio-MessageListItem-BubbleContainer css-1k99f8h" tabindex="-1" data-message-item="true">
                    <div data-testid="flex-box" class="Twilio Twilio-MessageBubble css-oxp0yy css-x79cgj">
                        <div data-testid="flex-box" class="Twilio-MessageBubble-default css-18ljn0d">
                            <div data-testid="flex-box" class="Twilio-MessageBubble-Header css-15it28 css-g7miak">
                                <div class="Twilio-MessageBubble-UserName css-1ylazt5" data-testid="message-sendername">Nombre Agente</div>
                                <div class="Twilio-MessageBubble-Time css-bgz8w0">
                                    ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                            <div class="Twilio-MessageBubble-Body css-xvvwlo" data-testid="message-body">
                                <span>${texto}</span>
                            </div>
                        </div>
                        <div data-testid="flex-box" class="Twilio-MessageBubble-end css-wicpu5"></div>
                    </div>
                </div>
            </div>
        </div>
        <div data-testid="flex-box" class="Twilio-MessageListItem-end css-wicpu5"></div>
    `;

    // 🚀 Insertar en el contenedor de mensajes
    contenedorMensajes.appendChild(nuevoMensaje);

    // 🔽 Hacer scroll automático al final
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
}

// Función para enviar mensaje
function enviarMensaje() {
    const texto = inputMensaje.value.trim();
    if (texto !== "") {
        agregarMensaje(texto);
        inputMensaje.value = ""; // limpiar textarea
        botonSend.setAttribute("aria-disabled", "true"); // deshabilitar hasta nuevo texto
    }
}

// Evento al hacer click en "Send"
botonSend.addEventListener("click", enviarMensaje);

// Habilitar botón solo cuando hay texto
inputMensaje.addEventListener("input", () => {
    if (inputMensaje.value.trim() !== "") {
        botonSend.setAttribute("aria-disabled", "false");
    } else {
        botonSend.setAttribute("aria-disabled", "true");
    }
});

// 🚀 Enviar con Enter ↵ (Shift+Enter = salto de línea)
inputMensaje.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // evita salto de línea normal
        enviarMensaje();
    }
});
