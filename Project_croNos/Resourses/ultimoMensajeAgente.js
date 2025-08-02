(function () {
  // 👤 Nombre del agente que estamos buscando en los mensajes
  const agentName = "Lorenzo Navarro";  // 🔄 Puedes reemplazar esto con una función que obtenga el nombre dinámicamente

  // 🔍 Selectores de elementos dentro del DOM
  const messageSelector = '[data-message-item="true"]';         // 🧱 Selector para todos los mensajes
  const senderSelector = '[data-testid="message-sendername"]';  // 🏷️ Selector para el nombre del remitente
  const bodySelector = '[data-testid="message-body"]';          // 💬 Selector para el contenido del mensaje
  const timeSelector = '.Twilio-MessageBubble-Time';            // ⏰ Selector para la hora del mensaje

  // 📦 Obtener todos los bloques de mensajes del DOM
  const allMessages = Array.from(document.querySelectorAll(messageSelector));

  // 🧼 Filtrar solo los mensajes que fueron enviados por el agente especificado
  const agentMessages = allMessages.filter(msg => {
    const sender = msg.querySelector(senderSelector);
    return sender && sender.textContent.trim() === agentName;
  });

  // ⚠️ Si no se encuentra ningún mensaje del agente, se muestra una advertencia
  if (agentMessages.length === 0) {
    console.warn("[INFO] No se encontraron mensajes del agente:", agentName);
    return null;
  }

  // ✅ Tomar el último mensaje enviado por el agente
  const lastAgentMessage = agentMessages[agentMessages.length - 1];

  // 📑 Obtener el contenido y la hora del mensaje
  const messageBody = lastAgentMessage.querySelector(bodySelector);
  const messageTime = lastAgentMessage.querySelector(timeSelector);

  // 🧾 Si se encuentra el cuerpo y la hora del mensaje, los combinamos en un string
  if (messageBody && messageTime) {
    const texto = messageBody.textContent.trim();  // ✂️ Limpiar texto
    const hora = messageTime.textContent.trim();   // ✂️ Limpiar hora

    const resultado = `🕒 ${hora} - 💬 ${texto}`;  // 🧩 Formatear el resultado final

    console.log("[RESULTADO]", resultado);         // 🖨️ Mostrar en la consola
    return resultado;
  } else {
    // ⚠️ Si falta alguno de los datos, mostramos una advertencia
    console.warn("[WARN] No se encontró el cuerpo o la hora del mensaje");
    return null;
  }
})();
