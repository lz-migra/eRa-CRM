//============= EjecutorCHAT FINAL =============
// 🧠 Control dinámico de tarjetas tipo CHAT en Twilio
// 🔗 Integrado con:
//   - localStorage ("tarjetas_activas")
//   - Cola de solicitudes (agregarRelojATarjeta)
//   - Bandera global: window.estadoEjecutorCHAT = "activo" | "detenido"
//
// 🚀 Lógica:
// - Revisa las tarjetas activas en localStorage.
// - Detecta tarjetas tipo "chat".
// - Encola relojes para tarjetas nuevas sin reloj.
// - Encola actualización de reloj cuando llega un mensaje nuevo.
// - Se enciende/apaga automáticamente según la bandera global.
//
// =============================================

const EjecutorCHAT = (() => {
  let observerTarjetas = null;
  let observerMensajes = null;
  let ultimoMensajeGuardado = null;
  let estadoInterno = "detenido"; // estado actual interno
  const TARJETAS_ACTIVAS_KEY = "tarjetas_activas";

  // 📍 Selectores
  const SELECTOR_TARJETAS = '.Twilio-TaskList-default';
  const SELECTOR_MENSAJES = '.Twilio-MessageList';
  const SELECTOR_TARJETA_ACTIVA = '.Twilio-TaskCanvasHeader-Name span';

  // ✅ Verifica si el mensaje actual es nuevo
  function mensajeEsNuevo(mensaje) {
    if (typeof CompararMensajeConGuardado !== 'function') return true;
    return !CompararMensajeConGuardado(mensaje);
  }

  // 🧠 Obtiene nombre de tarjeta activa
  function obtenerNombreTarjetaActiva() {
    return document.querySelector(SELECTOR_TARJETA_ACTIVA)?.innerText?.trim() || '';
  }

  // 🔍 Busca tarjetas de tipo CHAT en localStorage
  function obtenerTarjetasChat() {
    let tarjetas = [];
    try {
      tarjetas = JSON.parse(localStorage.getItem(TARJETAS_ACTIVAS_KEY) || "[]");
    } catch (e) {
      console.warn("⚠️ Error al leer tarjetas activas desde localStorage.", e);
      tarjetas = [];
    }

    return tarjetas
      .filter(t => t.tipo === "chat")
      .map(t => ({
        id: t.id,
        nombre: t.id,
        procesada: t.procesada
      }));
  }

  // ⏰ Encola solicitudes de reloj para las tarjetas chat que no tengan uno
  function encolarRelojesPendientes() {
    obtenerTarjetasChat().forEach(({ nombre }) => {
      const yaTiene = document.querySelector(`[data-reloj="${nombre}"]`);
      if (!yaTiene) {
        agregarRelojATarjeta({ nombre, actualizar: false, localStorage: true });
        console.log(`🕒 Solicitud encolada para agregar reloj a: ${nombre}`);
      }
    });
  }

  // 👁️ Observa tarjetas nuevas → encola relojes
  function observarTarjetas() {
    const contenedor = document.querySelector(SELECTOR_TARJETAS);
    if (!contenedor) return;

    observerTarjetas = new MutationObserver(() => {
      setTimeout(encolarRelojesPendientes, 1000);
    });

    observerTarjetas.observe(contenedor, { childList: true, subtree: true });
    console.log("👀 Observando tarjetas nuevas (CHAT)...");
  }

  // 👁️ Observa mensajes → encola actualización de reloj
  function observarMensajes() {
    const contenedor = document.querySelector(SELECTOR_MENSAJES);
    if (!contenedor) return;

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
            console.log(`📩 Nuevo mensaje detectado en "${nombreActiva}": ${ultimoMensaje}`);
            agregarRelojATarjeta({ nombre: nombreActiva, actualizar: true, localStorage: true });
          }
        }
      }, 500);
    });

    observerMensajes.observe(contenedor, { childList: true, subtree: false });
    console.log("📡 Observando mensajes nuevos (CHAT)...");
  }

  // 🚀 Inicia observadores
  function iniciar() {
    detener(); // limpia si ya estaban activos
    observarTarjetas();
    observarMensajes();
    estadoInterno = "activo";
  }

  // 🛑 Detiene observadores
  function detener() {
    if (observerTarjetas) {
      observerTarjetas.disconnect();
      observerTarjetas = null;
      console.log("🛑 Observador de tarjetas detenido (CHAT)");
    }
    if (observerMensajes) {
      observerMensajes.disconnect();
      observerMensajes = null;
      console.log("🛑 Observador de mensajes detenido (CHAT)");
    }
    estadoInterno = "detenido";
  }

  // 🔄 Bucle de sincronización con bandera global
  setInterval(() => {
    const bandera = window.estadoEjecutorCHAT || "detenido";
    if (bandera === "activo" && estadoInterno === "detenido") {
      iniciar();
    } else if (bandera === "detenido" && estadoInterno === "activo") {
      detener();
    }
  }, 200);

  // Métodos públicos (opcional, por compatibilidad)
  return { iniciar, detener };
})();
