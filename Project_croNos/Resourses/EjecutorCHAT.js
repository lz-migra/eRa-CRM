//============= Descripción =============
// 🧠 EjecutorCHAT: Control de lógica dinámica para tarjetas de tipo CHAT.
//
// 📋 Este entorno realiza lo siguiente:
// - Observa el contenedor de tarjetas (.Twilio-TaskList-default) para detectar nuevas.
// - Observa el contenedor de mensajes (.Twilio-MessageList) para detectar nuevos mensajes.
// - Consulta la lista TARJETAS_ACTIVAS (mantenida por el sistema principal).
// - Identifica qué tarjetas son de tipo CHAT.
// - Agrega relojes a tarjetas de chat que no los tengan (usa agregarRelojATarjeta).
// - Solo actualiza el reloj de la tarjeta activa si llega un mensaje nuevo.
// - Usa CompararMensajeConGuardado() para evitar actualizar con mensajes repetidos.
//
// 📌 Requiere que existan globalmente:
// - TARJETAS_ACTIVAS (Map con todas las tarjetas activas)
// - getTipoDeTarjeta(nodo) → 'chat' | 'voice' | 'ivr'
// - CompararMensajeConGuardado() → true | false
// - agregarRelojATarjeta({ nombre, actualizar, localStorage })
//
// 🛠️ Métodos disponibles:
// - EjecutorCHAT.iniciar()  → Inicia los observadores
// - EjecutorCHAT.detener()  → Detiene ambos observadores
//========================================


const EjecutorCHAT = (() => {
  let observerTarjetas = null;
  let observerMensajes = null;
  let ultimoMensajeGuardado = null;

  // 📍 Selector de tarjetas activas
  const SELECTOR_TARJETAS = '.Twilio-TaskList-default';
  const SELECTOR_MENSAJES = '.Twilio-MessageList';
  const SELECTOR_TARJETA_ACTIVA = '.Twilio-TaskCanvasHeader-Name span';

  // ✅ Verifica si el mensaje actual es nuevo
  function mensajeEsNuevo(mensaje) {
    if (typeof CompararMensajeConGuardado !== 'function') {
      console.warn('⚠️ CompararMensajeConGuardado no está definida');
      return false;
    }

    return !CompararMensajeConGuardado(mensaje);
  }

  // 🧠 Obtiene nombre de tarjeta activa
  function obtenerNombreTarjetaActiva() {
    return document.querySelector(SELECTOR_TARJETA_ACTIVA)?.innerText?.trim() || '';
  }

  // 🔍 Busca tarjetas de tipo CHAT desde TARJETAS_ACTIVAS
  function obtenerTarjetasChat() {
    return Array.from(TARJETAS_ACTIVAS.entries())
      .filter(([_, nodo]) => getTipoDeTarjeta(nodo) === 'chat')
      .map(([id, nodo]) => ({
        id,
        nodo,
        nombre: nodo.innerText.trim()
      }));
  }

  // ⏰ Agrega relojes a todas las tarjetas de chat que no los tengan
  function agregarRelojesPendientes() {
    const tarjetas = obtenerTarjetasChat();
    tarjetas.forEach(({ nombre }) => {
      const yaTiene = document.querySelector(`[data-reloj="${nombre}"]`);
      if (!yaTiene) {
        agregarRelojATarjeta({ nombre, actualizar: false, localStorage: true });
        console.log(`🕒 Reloj agregado a tarjeta: ${nombre}`);
      }
    });
  }

  // 👁️ Observa tarjetas nuevas para buscar tarjetas de tipo chat sin reloj
  function observarTarjetas() {
    const contenedor = document.querySelector(SELECTOR_TARJETAS);
    if (!contenedor) {
      console.warn('⚠️ Contenedor de tarjetas no encontrado');
      return;
    }

    observerTarjetas = new MutationObserver(() => {
      setTimeout(() => {
        agregarRelojesPendientes();
      }, 1000); // Espera a que las tarjetas carguen visualmente
    });

    observerTarjetas.observe(contenedor, { childList: true, subtree: true });
    console.log('👀 Observando tarjetas nuevas...');
  }

  // 👁️ Observa nuevos mensajes para actualizar reloj de la tarjeta activa
  function observarMensajes() {
    const contenedor = document.querySelector(SELECTOR_MENSAJES);
    if (!contenedor) {
      console.warn('⚠️ Contenedor de mensajes no encontrado');
      return;
    }

    observerMensajes = new MutationObserver(() => {
      setTimeout(() => {
        const texto = contenedor.innerText?.trim();
        const lineas = texto?.split('\n') || [];
        const ultimoMensaje = lineas[lineas.length - 1]?.trim();

        if (!ultimoMensaje) return;

        if (mensajeEsNuevo(ultimoMensaje)) {
          ultimoMensajeGuardado = ultimoMensaje;
          const nombreActiva = obtenerNombreTarjetaActiva();
          if (nombreActiva) {
            console.log(`📩 Nuevo mensaje detectado: ${ultimoMensaje}`);
            agregarRelojATarjeta({ nombre: nombreActiva, actualizar: true, localStorage: true });
          }
        }
      }, 500);
    });

    observerMensajes.observe(contenedor, { childList: true, subtree: true });
    console.log('📡 Observando mensajes nuevos...');
  }

  // 🚀 Métodos públicos
  return {
    iniciar() {
      this.detener(); // Limpieza previa si estaban activos
      observarTarjetas();
      observarMensajes();
    },
    detener() {
      if (observerTarjetas) {
        observerTarjetas.disconnect();
        observerTarjetas = null;
        console.log('🛑 Observador de tarjetas detenido');
      }
      if (observerMensajes) {
        observerMensajes.disconnect();
        observerMensajes = null;
        console.log('🛑 Observador de mensajes detenido');
      }
    }
  };
})();
