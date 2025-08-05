//============= Descripción =============
// 🔁 Escanea tarjetas cada 2 segundos en Twilio Flex.
// 📋 Mantiene una lista de tarjetas activas actualizada.
// 🧠 Identifica su tipo (voice, chat, ivr) y ejecuta lógica por tipo.
// 🚦 Decide dinámicamente qué entorno iniciar o detener.
// 🕒 Espera 2 minutos antes de detener entornos inactivos.
//=======================================

// 🗂️ Lista global de tarjetas activas (clave: ID o aria-label, valor: nodo)
const TARJETAS_ACTIVAS = new Map();

// 🕒 Temporizadores para detener entornos por tipo
const timersDeDetencion = {
  chat: null,
  voice: null,
  ivr: null
};

// 🔁 Estado actual de cada entorno
const estadoEntornos = {
  chat: false,
  voice: false,
  ivr: false
};

// 🧠 Función para identificar el tipo de tarjeta
function getTipoDeTarjeta(tarjetaElement) {
  const ariaLabel = tarjetaElement.getAttribute('aria-label') || '';
  if (ariaLabel.includes('voice task')) return 'voice';
  if (ariaLabel.includes('chat task')) return 'chat';
  if (ariaLabel.includes('ivr-live-callback task')) return 'ivr';

  console.warn('⚠️ Tipo de tarjeta no identificado:', ariaLabel);
  return null;
}

// 🧩 Ejecutar lógica personalizada por tipo
function ejecutarTipo(tarjeta, tipo) {
  const tipoMayus = tipo.toUpperCase();
  const ejecutor = window[`Ejecutor${tipoMayus}`];

  console.log(`🎯 ${tipoMayus} task detectada:`, tarjeta);
  ejecutor?.iniciar?.(); // Inicia entorno dinámico si existe
}

// 🔄 Evalúa tarjetas activas y gestiona entornos dinámicos
function gestionarTarjetasActivas() {
  // 🧹 Eliminar nodos que ya no existen
  for (const [id, nodo] of TARJETAS_ACTIVAS.entries()) {
    if (!document.body.contains(nodo)) {
      TARJETAS_ACTIVAS.delete(id);
    }
  }

  // 🔢 Contar tarjetas activas por tipo
  let hayChat = false;
  let hayVoice = false;
  let hayIVR = false;

  for (const [, nodo] of TARJETAS_ACTIVAS.entries()) {
    const tipo = getTipoDeTarjeta(nodo);
    if (tipo === 'chat') hayChat = true;
    if (tipo === 'voice') hayVoice = true;
    if (tipo === 'ivr') hayIVR = true;
  }

  gestionarEntornoPorTipo('chat', hayChat);
  gestionarEntornoPorTipo('voice', hayVoice);
  gestionarEntornoPorTipo('ivr', hayIVR);
}

// ⚙️ Inicia o detiene entornos según estado
function gestionarEntornoPorTipo(tipo, estaActivo) {
  const tipoMayus = tipo.toUpperCase();
  const ejecutor = window[`Ejecutor${tipoMayus}`];

  if (estaActivo && !estadoEntornos[tipo]) {
    console.log(`✅ Tarjetas ${tipoMayus} encontradas — iniciando entorno`);
    estadoEntornos[tipo] = true;

    if (timersDeDetencion[tipo]) {
      clearTimeout(timersDeDetencion[tipo]);
      timersDeDetencion[tipo] = null;
    }

    ejecutor?.iniciar?.();
    return;
  }

  if (!estaActivo && estadoEntornos[tipo]) {
    if (!timersDeDetencion[tipo]) {
      timersDeDetencion[tipo] = setTimeout(() => {
        const sigueInactivo = !Array.from(TARJETAS_ACTIVAS.values()).some(n => getTipoDeTarjeta(n) === tipo);
        if (sigueInactivo) {
          console.log(`🛑 No hay tarjetas ${tipoMayus} — deteniendo entorno`);
          estadoEntornos[tipo] = false;
          ejecutor?.detener?.();
        }
        timersDeDetencion[tipo] = null;
      }, 2 * 60 * 1000); // 2 minutos
    }
  }
}

// 🔄 Escanear tarjetas activas periódicamente
function iniciarEscaneoPeriodico() {
  setInterval(() => {
    const tarjetas = document.querySelectorAll('[data-testid="task-item"]');

    tarjetas.forEach((nodo) => {
      const id = nodo.getAttribute('aria-label');
      if (!id || TARJETAS_ACTIVAS.has(id)) return;

      const tipo = getTipoDeTarjeta(nodo);
      if (!tipo) return;

      TARJETAS_ACTIVAS.set(id, nodo);
      ejecutarTipo(nodo, tipo); // Ejecutar entorno
    });

    gestionarTarjetasActivas(); // Recalcular activos
  }, 2000); // Cada 2 segundos
}

// 🚀 Iniciar escaneo al cargar
iniciarEscaneoPeriodico();


