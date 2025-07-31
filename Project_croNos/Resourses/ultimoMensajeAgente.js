(function () {
  const agentName = "Lorenzo Navarro";  //reemplazar con la funcion que determine el nombre del agente.
  const messageSelector = '[data-message-item="true"]';
  const senderSelector = '[data-testid="message-sendername"]';
  const bodySelector = '[data-testid="message-body"]';
  const timeSelector = '.Twilio-MessageBubble-Time';

  // Obtener todos los bloques de mensaje
  const allMessages = Array.from(document.querySelectorAll(messageSelector));

  // Filtrar solo los mensajes del agente
  const agentMessages = allMessages.filter(msg => {
    const sender = msg.querySelector(senderSelector);
    return sender && sender.textContent.trim() === agentName;
  });

  if (agentMessages.length === 0) {
    console.warn("[INFO] No se encontraron mensajes del agente:", agentName);
    return null;
  }

  // Obtener el último mensaje del agente
  const lastAgentMessage = agentMessages[agentMessages.length - 1];
  const messageBody = lastAgentMessage.querySelector(bodySelector);
  const messageTime = lastAgentMessage.querySelector(timeSelector);

  if (messageBody && messageTime) {
    const texto = messageBody.textContent.trim();
    const hora = messageTime.textContent.trim();
    const resultado = `🕒 ${hora} - 💬 ${texto}`;
    console.log("[RESULTADO]", resultado);
    return resultado;
  } else {
    console.warn("[WARN] No se encontró el cuerpo o la hora del mensaje");
    return null;
  }
})();
