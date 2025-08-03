//============= Descripción =============
// 👁️ Este script observa nuevas tarjetas en Twilio Flex.
// 📋 Mantiene una lista de tarjetas activas actualizada.
// 🧠 Identifica su tipo (voice, chat, ivr) y ejecuta lógica por tipo.
// 🕒 Si ya no hay tarjetas de un tipo, espera 2 minutos antes de detener el entorno.
// 🧩 Puedes definir tus funciones de inicio/detención por tipo si lo deseas.
//============= Descripción =============

// 🗂️ Lista global de tarjetas activas (clave: ID o aria-label, valor: nodo)
const TARJETAS_ACTIVAS = new Map();

// 🕒 Temporizadores para detener entornos por tipo
const timersDeDetencion = {
  chat: null,
  voice: null,
  ivr: null
};

// 🧠 Control de estado por tipo para evitar mensajes repetidos
const estadoEntornos = {
  chat: false,
  voice: false,
  ivr: false
};

// 🧠 Función para identificar el tipo de tarjeta (task)
function getTipoDeTarjeta(tarjetaElement) {
  const ariaLabel = tarjetaElement.getAttribute('aria-label') || '';

  if (ariaLabel.includes('voice task')) return 'voice';
  if (ariaLabel.includes('chat task')) return 'chat';
  if (ariaLabel.includes('ivr-live-callback task')) return 'ivr';

  console.warn('⚠️ Tipo de tarjeta no identificado:', ariaLabel);
  return null;
}

// 📞 Función para tareas VOICE
function ejecutarVoice(tarjeta) {
  console.log('📞 VOICE task detectada:', tarjeta);
  // 🔧 Lógica específica para VOICE
}

// 💬 Función para tareas CHAT
function ejecutarChat(tarjeta) {
  console.log('💬 CHAT task detectada:', tarjeta);
  // 🔧 Lógica específica para CHAT
}

// 📟 Función para tareas IVR
function ejecutarIVR(tarjeta) {
  console.log('📟 IVR task detectada:', tarjeta);
  // 🔧 Lógica específica para IVR
}

// 👁️‍🗨️ Observador de tarjetas
function iniciarObservadorDeTarjetas() {
  const contenedor = document.querySelector('.Twilio-TaskList-default');

  if (!contenedor) {
    console.warn('⚠️ Contenedor .Twilio-TaskList-default no encontrado');
    return;
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((nodo) => {
          if (nodo.nodeType === 1 && nodo.matches('[data-testid="task-item"]')) {
            const tipo = getTipoDeTarjeta(nodo);
            if (!tipo) return;

            const id = nodo.getAttribute('aria-label') || Date.now().toString() + Math.random();
            TARJETAS_ACTIVAS.set(id, nodo);

            if (tipo === 'voice') ejecutarVoice(nodo);
            if (tipo === 'chat') ejecutarChat(nodo);
            if (tipo === 'ivr') ejecutarIVR(nodo);

            // 📊 Evaluar tipos activos
            gestionarTarjetasActivas();
          }
        });
      }
    }
  });

  observer.observe(contenedor, { childList: true, subtree: false });
  console.log('👁️ Observador de tarjetas activado sobre .Twilio-TaskList-default ✅');
}

// 🔄 Función que analiza los tipos activos y gestiona entornos por tipo
function gestionarTarjetasActivas() {
  // 🧹 Eliminar tarjetas que ya no están en el DOM
  for (const [id, nodo] of TARJETAS_ACTIVAS.entries()) {
    if (!document.body.contains(nodo)) {
      TARJETAS_ACTIVAS.delete(id);
    }
  }

  // 🔢 Contadores de tipos activos
  let hayChat = false;
  let hayVoice = false;
  let hayIVR = false;

  for (const [, nodo] of TARJETAS_ACTIVAS.entries()) {
    const tipo = getTipoDeTarjeta(nodo);
    if (tipo === 'chat') hayChat = true;
    if (tipo === 'voice') hayVoice = true;
    if (tipo === 'ivr') hayIVR = true;
  }

  // 🧩 Evaluar lógica para cada tipo
  gestionarEntornoPorTipo('chat', hayChat);
  gestionarEntornoPorTipo('voice', hayVoice);
  gestionarEntornoPorTipo('ivr', hayIVR);
}

// ⚙️ Gestiona activación o detención por tipo, con delay de 2 minutos
function gestionarEntornoPorTipo(tipo, estaActivo) {
  // ✅ Si hay tarjetas activas del tipo y no estaba activo antes
  if (estaActivo && !estadoEntornos[tipo]) {
    console.log(`✅ Tarjetas ${tipo.toUpperCase()} encontradas — iniciando entorno`);
    estadoEntornos[tipo] = true;

    // ⛔ Cancelar temporizador de detención si existía
    if (timersDeDetencion[tipo]) {
      clearTimeout(timersDeDetencion[tipo]);
      timersDeDetencion[tipo] = null;
    }

    // 🧩 Aquí podrías llamar: iniciarEntornoDeTipo(tipo);
    return;
  }

  // 🛑 Si ya no hay tarjetas de ese tipo, iniciar temporizador
  if (!estaActivo && estadoEntornos[tipo]) {
    if (!timersDeDetencion[tipo]) {
      timersDeDetencion[tipo] = setTimeout(() => {
        // Verificar si realmente sigue inactivo
        const sigueInactivo = !Array.from(TARJETAS_ACTIVAS.values()).some(n => getTipoDeTarjeta(n) === tipo);
        if (sigueInactivo) {
          console.log(`🛑 No hay tarjetas ${tipo.toUpperCase()} — deteniendo entorno`);
          estadoEntornos[tipo] = false;

          // 🧩 Aquí podrías llamar: detenerEntornoDeTipo(tipo);
        }

        timersDeDetencion[tipo] = null;
      }, 2 * 60 * 1000); // ⏳ 2 minutos
    }
  }
}

// 🚀 Ejecutar automáticamente
iniciarObservadorDeTarjetas();
