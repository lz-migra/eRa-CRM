//============= Descripcion =============
// 🧠 Esta función busca el último mensaje enviado por un agente específico en la interfaz de mensajes.
// ✅ Puedes llamarla así: UltimoMensajeAgente("Nombre del Agente") ó UltimoMensajeAgente() este ultimo solo si window.AGENT_NAME ya esta definido.
// 🧩 Devuelve un string en texto plano con la hora y el texto del mensaje, o `null` si no encuentra nada.
// 📦 Usara window.AGENT_NAME [Que es definida por la funcion detectarNombreAgente()] para evitar pasar el nombre cada vez.
// 📞 Llama a UltimoMensajeAgente() y:
//    - Verás el resultado en consola.
//    - También se guardará automáticamente en window.ULTIMO_MENSAJE para que lo uses desde otros scripts.
//============= Descripcion =============

function UltimoMensajeAgente(agentName = window.AGENT_NAME) {
  // ⚠️ Verificar si se proporcionó un nombre de agente
  if (!agentName) {
    console.warn("⚠️ El nombre del agente no está definido ni en window.AGENT_NAME ni como argumento.");
    return null;
  }

  // 🔍 Selectores para identificar los elementos clave del DOM
  const messageSelector = '[data-message-item="true"]';         // 🧱 Contenedor de cada mensaje
  const senderSelector = '[data-testid="message-sendername"]';  // 🏷️ Nombre del remitente
  const bodySelector = '[data-testid="message-body"]';          // 💬 Texto del mensaje
  const timeSelector = '.Twilio-MessageBubble-Time';            // ⏰ Hora del mensaje

  // 📦 Recolectar todos los elementos de mensaje del DOM
  const allMessages = Array.from(document.querySelectorAll(messageSelector));

  // 🧼 Filtrar solo los mensajes enviados por el agente (según el nombre dado)
  const agentMessages = allMessages.filter(msg => {
    const sender = msg.querySelector(senderSelector);           // 🕵️ Obtener nombre del remitente
    return sender && sender.textContent.trim() === agentName;   // ✅ Coincidencia exacta con el nombre del agente
  });

  // ⚠️ Verificar si se encontraron mensajes del agente
  if (agentMessages.length === 0) {
    console.warn("[INFO] No se encontraron mensajes del agente:", agentName);  // 🚫 Nada encontrado
    return null;
  }

  // 📍 Obtener el último mensaje enviado por el agente
  const lastAgentMessage = agentMessages[agentMessages.length - 1];

  // 📝 Extraer el cuerpo y la hora del mensaje
  const messageBody = lastAgentMessage.querySelector(bodySelector); // 💬 Texto
  const messageTime = lastAgentMessage.querySelector(timeSelector); // 🕒 Hora

  // ✅ Si ambos elementos existen, combinarlos y devolver el resultado
  if (messageBody && messageTime) {
    const texto = messageBody.textContent.trim();  // ✂️ Limpiar texto
    const hora = messageTime.textContent.trim();   // ✂️ Limpiar hora
    const resultado = `🕒 ${hora} - 💬 ${texto}`;   // 🧩 Formato de salida

    console.log("[RESULTADO]", resultado);         // 🖨️ Mostrar en consola
    window.ULTIMO_MENSAJE = resultado;             // 💾 Guardar el resultado para otros scripts
    return resultado;                              // 📤 Devolver resultado
  } else {
    // 🚨 Algo salió mal: no se encontró el cuerpo o la hora
    console.warn("[WARN] No se encontró el cuerpo o la hora del mensaje");
    return null;
  }
}

// 🌐 Exponer la función como método global
window.UltimoMensajeAgente = UltimoMensajeAgente;
