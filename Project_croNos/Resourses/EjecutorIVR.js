//============= Descripción =============
// 🧠 EjecutorIVR: Control de lógica para tarjetas de tipo IVR.
//
// 📋 Este entorno realiza lo siguiente:
// - Observa el contenedor de tarjetas (.Twilio-TaskList-default) para detectar nuevas.
// - Consulta la lista TARJETAS_ACTIVAS (mantenida por el sistema principal).
// - Identifica tarjetas de tipo IVR.
// - Agrega relojes a tarjetas IVR que no los tengan (usa agregarRelojATarjeta).
//
// 📌 Requiere que existan globalmente:
// - TARJETAS_ACTIVAS (Map con todas las tarjetas activas)
// - getTipoDeTarjeta(nodo) → 'chat' | 'voice' | 'ivr'
// - agregarRelojATarjeta({ nombre, actualizar, localStorage })
//
// 🛠️ Métodos disponibles:
// - EjecutorIVR.iniciar()  → Inicia el observador
// - EjecutorIVR.detener()  → Detiene el observador
//========================================

const EjecutorIVR = (() => {
  let observerTarjetas = null;

  const SELECTOR_TARJETAS = '.Twilio-TaskList-default';

  // 🔍 Busca tarjetas de tipo IVR desde TARJETAS_ACTIVAS
  function obtenerTarjetasIVR() {
    return Array.from(TARJETAS_ACTIVAS.entries())
      .filter(([_, nodo]) => getTipoDeTarjeta(nodo) === 'ivr')
      .map(([id, nodo]) => ({
        id,
        nodo,
        nombre: nodo.innerText.trim()
      }));
  }

  // ⏰ Agrega relojes a todas las tarjetas IVR que no lo tengan
  function agregarRelojesPendientes() {
    const tarjetas = obtenerTarjetasIVR();
    tarjetas.forEach(({ nombre }) => {
      const yaTiene = document.querySelector(`[data-reloj="${nombre}"]`);
      if (!yaTiene) {
        agregarRelojATarjeta({ nombre, actualizar: false, localStorage: true });
        console.log(`📟 Reloj agregado a tarjeta IVR: ${nombre}`);
      }
    });
  }

  // 👁️ Observa tarjetas nuevas y agrega reloj si es IVR
  function observarTarjetas() {
    const contenedor = document.querySelector(SELECTOR_TARJETAS);
    if (!contenedor) {
      console.warn('⚠️ Contenedor de tarjetas no encontrado');
      return;
    }

    observerTarjetas = new MutationObserver(() => {
      setTimeout(() => {
        agregarRelojesPendientes();
      }, 1000); // Leve espera para garantizar carga
    });

    observerTarjetas.observe(contenedor, { childList: true, subtree: false });
    console.log('👁️ Observando tarjetas IVR...');
  }

  return {
    iniciar() {
      this.detener();
      observarTarjetas();
    },
    detener() {
      if (observerTarjetas) {
        observerTarjetas.disconnect();
        observerTarjetas = null;
        console.log('🛑 Observador IVR detenido');
      }
    }
  };
})();
