//============= Descripción =============
// 🧠 EjecutorVOICE: Control de lógica para tarjetas de tipo VOICE.
//
// 📋 Este entorno realiza lo siguiente:
// - Observa el contenedor de tarjetas (.Twilio-TaskList-default) para detectar nuevas.
// - Consulta la lista TARJETAS_ACTIVAS (mantenida por el sistema principal).
// - Identifica tarjetas de tipo VOICE.
// - Agrega relojes a tarjetas VOICE que no los tengan.
// - Detecta cambios de estado en cada tarjeta VOICE activa.
// - Si cambia el estado, actualiza el reloj de la tarjeta que sufrio cambios.
//
// 📌 Requiere que existan globalmente:
// - TARJETAS_ACTIVAS (Map con todas las tarjetas activas)
// - getTipoDeTarjeta(nodo) → 'chat' | 'voice' | 'ivr'
// - agregarRelojATarjeta({ nombre, actualizar, localStorage })
// - obtenerEstadoDeTarjeta(tarjetaElement)
// - La función obtenerEstadoDeTarjeta se define a continuación para filtrar contadores y separar por "|"
//
// 🛠️ Métodos disponibles:
// - EjecutorVOICE.iniciar()  → Inicia el observador
// - EjecutorVOICE.detener()  → Detiene el observador
//========================================

// 📌 Función auxiliar para extraer el estado filtrado de una tarjeta VOICE
const obtenerEstadoDeTarjeta = (tarjetaElement) => {
  const contenedorEstado = tarjetaElement.querySelector('.Twilio-TaskListBaseItem-SecondLine');
  if (!contenedorEstado) return null;

  const span = contenedorEstado.querySelector('span');
  if (!span) return null;

  const texto = span.textContent.trim();

  // Si hay "|", nos quedamos con lo de la izquierda (evita contadores tipo "En llamada | 00:01")
  if (texto.includes('|')) {
    return texto.split('|')[0].trim();
  }

  // Si no hay "|", devolvemos el texto completo (ej: "Connecting call…")
  return texto;
};

const EjecutorVOICE = (() => {
  let observerTarjetas = null;
  const SELECTOR_TARJETAS = '.Twilio-TaskList-default';
  const SELECTOR_ESTADO = '.Twilio-TaskListBaseItem-SecondLine';
  const observersPorTarjeta = new Map();

  // 🔍 Obtiene tarjetas de tipo VOICE desde TARJETAS_ACTIVAS
  function obtenerTarjetasVOICE() {
    return Array.from(TARJETAS_ACTIVAS.entries())
      .filter(([_, nodo]) => getTipoDeTarjeta(nodo) === 'voice')
      .map(([id, nodo]) => ({
        id,
        nodo,
        nombre: nodo.innerText.trim()
      }));
  }

  // 🔁 Detecta cambios de estado dentro de una tarjeta
  function observarEstadoDeTarjeta(tarjeta) {
    const contenedorEstado = tarjeta.querySelector(SELECTOR_ESTADO);
    if (!contenedorEstado) return;

    let estadoAnterior = obtenerEstadoDeTarjeta(tarjeta);

    const observerEstado = new MutationObserver(() => {
      const nuevoEstado = obtenerEstadoDeTarjeta(tarjeta);
      if (nuevoEstado && nuevoEstado !== estadoAnterior) {
        console.log(`🔍 Cambio de estado detectado en VOICE: '${estadoAnterior}' → '${nuevoEstado}'`);
        estadoAnterior = nuevoEstado;
        const nombre = tarjeta.innerText.trim();
        console.log(`🕒 Actualizando reloj en tarjeta VOICE: ${nombre}`);
        agregarRelojATarjeta({ nombre, actualizar: true, localStorage: true });
      });
        console.log(`🔁 Estado cambiado. Reloj actualizado en: ${nombre}`);
      });
        console.log(`🔁 Estado cambiado. Reloj actualizado en: ${nombre}`);
      });
        console.log(`🔁 Estado cambiado. Reloj actualizado en: ${nombre}`);
      }
    });

    observerEstado.observe(contenedorEstado, { childList: true, subtree: true, characterData: true });
    observersPorTarjeta.set(tarjeta, observerEstado);
  }

  // ⏰ Agrega relojes a tarjetas VOICE sin reloj y empieza a observar su estado
  function agregarRelojesYObservarEstados() {
    const tarjetas = obtenerTarjetasVOICE();
    tarjetas.forEach(({ nodo, nombre }) => {
      const yaTiene = document.querySelector(`[data-reloj="${nombre}"]`);
      if (!yaTiene) {
        agregarRelojATarjeta({ nombre, actualizar: false, localStorage: true });
        console.log(`📞 Reloj agregado a tarjeta VOICE: ${nombre}`);
      }
      if (!observersPorTarjeta.has(nodo)) {
        observarEstadoDeTarjeta(nodo);
      }
    });
  }

  // 👁️ Observa el contenedor de tarjetas para detectar nuevas
  function observarTarjetas() {
    const contenedor = document.querySelector(SELECTOR_TARJETAS);
    if (!contenedor) {
      console.warn('⚠️ Contenedor de tarjetas no encontrado');
      return;
    }

    observerTarjetas = new MutationObserver(() => {
      setTimeout(() => {
        agregarRelojesYObservarEstados();
      }, 1000);
    });

    observerTarjetas.observe(contenedor, { childList: true, subtree: false });
    console.log('👁️ Observando tarjetas VOICE...');
  }

  return {
    iniciar() {
      this.detener();
      observarTarjetas();
      agregarRelojesYObservarEstados();
    },
    detener() {
      if (observerTarjetas) {
        observerTarjetas.disconnect();
        observerTarjetas = null;
        console.log('🛑 Observador de tarjetas VOICE detenido');
      }

      observersPorTarjeta.forEach((obs) => obs.disconnect());
      observersPorTarjeta.clear();
      console.log('🛑 Observadores de estado VOICE detenidos');
    }
  };
})();
