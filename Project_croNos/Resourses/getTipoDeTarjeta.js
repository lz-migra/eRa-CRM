//============= Descripción =============
// 👁️ Este script observa el contenedor de tarjetas activas en la interfaz de Twilio Flex.
// 🧠 Identifica el tipo de tarjeta (voice, chat o ivr) a través del atributo `aria-label`.
// ⚙️ Ejecuta funciones específicas para cada tipo cuando detecta una nueva tarjeta agregada.
// ✅ Llama automáticamente a iniciarObservadorDeTarjetas() para comenzar a escuchar.
// 🧩 Puedes personalizar la lógica dentro de ejecutarVoice(), ejecutarChat() y ejecutarIVR().
//============= Descripción =============

// 🧠 Función para identificar el tipo de tarjeta (task)
function getTipoDeTarjeta(tarjetaElement) {
  // 🔍 Buscar el atributo aria-label para identificar el tipo
  const ariaLabel = tarjetaElement.getAttribute('aria-label') || '';

  // 🗣️ Si es una tarea de llamada de voz
  if (ariaLabel.includes('voice task')) return 'voice';

  // 💬 Si es una tarea de chat (WhatsApp, etc.)
  if (ariaLabel.includes('chat task')) return 'chat';

  // 📟 Si es una tarea IVR con callback en vivo o tarea de salientes
  if (ariaLabel.includes('ivr-live-callback task')) return 'ivr';

  // ⚠️ Si no se puede identificar el tipo
  console.warn('⚠️ Tipo de tarjeta no identificado:', ariaLabel);
  return null;
}

// 📞 Función para manejar tareas de tipo VOICE
function ejecutarVoice(tarjeta) {
  console.log('📞 VOICE task detectada:', tarjeta);
  // 🧩 Aquí va la lógica específica para tareas de voz
}

// 💬 Función para manejar tareas de tipo CHAT
function ejecutarChat(tarjeta) {
  console.log('💬 CHAT task detectada:', tarjeta);
  // 🧩 Aquí va la lógica específica para tareas de chat
}

// 📟 Función para manejar tareas de tipo IVR
function ejecutarIVR(tarjeta) {
  console.log('📟 IVR task detectada:', tarjeta);
  // 🧩 Aquí va la lógica específica para tareas IVR
}

// 👁️‍🗨️ Observador de tarjetas: detecta cuando se agregan nuevas tareas al listado
function iniciarObservadorDeTarjetas() {
  // 📦 Contenedor donde aparecen las tarjetas (lado izquierdo)
  const contenedor = document.querySelector('.Twilio-TaskList-default');

  if (!contenedor) {
    console.warn('⚠️ Contenedor .Twilio-TaskList-default no encontrado');
    return;
  }

  // 🔭 Crear un observador que detecta nuevas tarjetas
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((nodo) => {
          // 🧱 Verifica si el nodo agregado es una tarjeta válida
          if (nodo.nodeType === 1 && nodo.matches('[data-testid="task-item"]')) {
            const tipo = getTipoDeTarjeta(nodo);

            // 📞 Ejecutar función según tipo detectado
            if (tipo === 'voice') ejecutarVoice(nodo);
            if (tipo === 'chat') ejecutarChat(nodo);
            if (tipo === 'ivr') ejecutarIVR(nodo);
          }
        });
      }
    }
  });

  // 🧷 Iniciar el observador sobre el contenedor
  observer.observe(contenedor, { childList: true, subtree: false });
  console.log('👁️ Observador de tarjetas activado sobre .Twilio-TaskList-default ✅');
}

// 🟢 Ejecutar automáticamente al cargar el script
iniciarObservadorDeTarjetas();
