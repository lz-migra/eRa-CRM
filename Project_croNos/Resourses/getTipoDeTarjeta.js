//============= Descripción =============
// 🔁 Escanea tarjetas cada 2 segundos en Twilio Flex.
// 📋 Guarda tarjetas activas en localStorage (id + tipo).
// 🧠 Identifica su tipo (voice, chat, ivr) y ejecuta lógica por tipo.
// 🚦 Usa banderas globales en window.estadoEjecutorTIPO.
// 🕒 Espera 2 minutos antes de detener entornos inactivos.
//=======================================

// 🕒 Temporizadores para detener entornos por tipo
const timersDeDetencion = {
  chat: null,
  voice: null,
  ivr: null
};

// 📦 Funciones helper para manejar almacenamiento en localStorage
function getTarjetasGuardadas() {
  return JSON.parse(localStorage.getItem("TARJETAS_ACTIVAS") || "[]");
}

function setTarjetasGuardadas(lista) {
  localStorage.setItem("TARJETAS_ACTIVAS", JSON.stringify(lista));
}

function addTarjeta(id, tipo) {
  const tarjetas = getTarjetasGuardadas();
  if (!tarjetas.find(t => t.id === id)) {
    tarjetas.push({ id, tipo });
    setTarjetasGuardadas(tarjetas);
  }
}

function removeTarjeta(id) {
  let tarjetas = getTarjetasGuardadas();
  tarjetas = tarjetas.filter(t => t.id !== id);
  setTarjetasGuardadas(tarjetas);
}

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
function ejecutarTipo(id, tipo) {
  const tipoMayus = tipo.toUpperCase();
  const ejecutor = window[`Ejecutor${tipoMayus}`];

  console.log(`🎯 ${tipoMayus} task detectada:`, id);
  ejecutor?.iniciar?.(); // Inicia entorno dinámico si existe

  // 🚦 Actualizar bandera global
  window[`estadoEjecutor${tipoMayus}`] = "activo";
}

// 🔄 Evalúa tarjetas activas y gestiona entornos dinámicos
function gestionarTarjetasActivas() {
  const tarjetas = getTarjetasGuardadas();

  // 🔢 Contar tarjetas activas por tipo
  const hayChat = tarjetas.some(t => t.tipo === 'chat');
  const hayVoice = tarjetas.some(t => t.tipo === 'voice');
  const hayIVR = tarjetas.some(t => t.tipo === 'ivr');

  gestionarEntornoPorTipo('chat', hayChat);
  gestionarEntornoPorTipo('voice', hayVoice);
  gestionarEntornoPorTipo('ivr', hayIVR);
}

// ⚙️ Inicia o detiene entornos según estado
function gestionarEntornoPorTipo(tipo, estaActivo) {
  const tipoMayus = tipo.toUpperCase();
  const ejecutor = window[`Ejecutor${tipoMayus}`];
  const estadoActual = window[`estadoEjecutor${tipoMayus}`] || "detenido";

  if (estaActivo && estadoActual === "detenido") {
    console.log(`✅ Tarjetas ${tipoMayus} encontradas — iniciando entorno`);
    window[`estadoEjecutor${tipoMayus}`] = "activo";

    if (timersDeDetencion[tipo]) {
      clearTimeout(timersDeDetencion[tipo]);
      timersDeDetencion[tipo] = null;
    }

    ejecutor?.iniciar?.();
    return;
  }

  if (!estaActivo && estadoActual === "activo") {
    if (!timersDeDetencion[tipo]) {
      timersDeDetencion[tipo] = setTimeout(() => {
        const sigueInactivo = !getTarjetasGuardadas().some(t => t.tipo === tipo);
        if (sigueInactivo) {
          console.log(`🛑 No hay tarjetas ${tipoMayus} — deteniendo entorno`);
          window[`estadoEjecutor${tipoMayus}`] = "detenido";
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
      if (!id) return;

      const tipo = getTipoDeTarjeta(nodo);
      if (!tipo) return;

      // 📦 Guardar tarjeta en localStorage
      addTarjeta(id, tipo);
      ejecutarTipo(id, tipo);
    });

    // 🧹 Limpiar tarjetas eliminadas (que ya no existen en DOM)
    const actuales = Array.from(tarjetas).map(n => n.getAttribute('aria-label'));
    getTarjetasGuardadas().forEach(t => {
      if (!actuales.includes(t.id)) {
        removeTarjeta(t.id);
      }
    });

    gestionarTarjetasActivas(); // Recalcular activos
  }, 2000); // Cada 2 segundos
}

// 🚀 Iniciar escaneo al cargar
iniciarEscaneoPeriodico();
