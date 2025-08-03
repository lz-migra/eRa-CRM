//============= Descripcion =============
// 🧠 Este script monitorea las tarjetas activas en la interfaz de Twilio.
// 🔄 Cada 5 segundos detecta los nombres y relojes de las tarjetas visibles.
// 💾 Guarda un máximo de 10 tarjetas en localStorage bajo la clave 'tarjetas_guardadas'.
// 🧹 Las tarjetas con más de 1 hora sin actualizarce se eliminan automáticamente.
// ✅ Usa iniciarMonitorTarjetas() para iniciar el monitoreo.
// 🔍 Usa verTarjetasGuardadas() para revisar en consola.
// 🗑️ Usa borrarTarjetasGuardadas() para limpiar el almacenamiento.
//=======================================

// 🌐 Función global para iniciar el monitor de tarjetas
function iniciarMonitorTarjetas() {
  const STORAGE_KEY = 'tarjetas_guardadas';        // 🗝️ Nombre usado en localStorage
  const LIMITE_TARJETAS = 10;                      // 🔢 Máximo de tarjetas a guardar
  const TIEMPO_EXPIRACION_MS = 60 * 60 * 1000;     // ⏳ 1 hora
  let ultimaConsola = 0;                           // 🕒 Último log

  // 🧾 Cargar tarjetas desde localStorage
  function cargarTarjetasGuardadas() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 💾 Guardar tarjetas en localStorage
  function guardarTarjetas(tarjetas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarjetas));
  }

  // 🧹 Eliminar tarjetas obsoletas
  function limpiarTarjetasObsoletas(tarjetas) {
    const ahora = Date.now();
    return tarjetas.filter(t => ahora - t.timestamp < TIEMPO_EXPIRACION_MS);
  }

  // 🔍 Obtener tarjetas visibles en DOM
  function obtenerTarjetasDOM() {
    const tarjetasDOM = document.querySelectorAll('.Twilio-TaskListBaseItem');

    return Array.from(tarjetasDOM).map(tarjeta => {
      const nombre = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim();
      const reloj = tarjeta.querySelector('.custom-crono-line')?.textContent?.trim();
      if (!nombre || !reloj) return null;

      return {
        nombre,
        reloj,
        timestamp: Date.now()
      };
    }).filter(Boolean);
  }

  // 🔄 Comparar y actualizar almacenamiento
  function actualizarAlmacenamiento() {
    const tarjetasNuevas = obtenerTarjetasDOM();
    let tarjetasGuardadas = cargarTarjetasGuardadas();

    const antesLimpieza = tarjetasGuardadas.map(t => t.nombre);
    tarjetasGuardadas = limpiarTarjetasObsoletas(tarjetasGuardadas);
    const despuesLimpieza = tarjetasGuardadas.map(t => t.nombre);

    const eliminadas = antesLimpieza.filter(nombre => !despuesLimpieza.includes(nombre));
    const nuevasAgregadas = [];
    let huboActualizaciones = false;

    tarjetasNuevas.forEach(nueva => {
      const index = tarjetasGuardadas.findIndex(t => t.nombre === nueva.nombre);
      if (index !== -1) {
        const actual = tarjetasGuardadas[index];
        if (actual.reloj !== nueva.reloj) {
          tarjetasGuardadas[index] = nueva;
          huboActualizaciones = true;
        }
      } else {
        tarjetasGuardadas.push(nueva);
        nuevasAgregadas.push(nueva.nombre);
      }
    });

    tarjetasGuardadas.sort((a, b) => b.timestamp - a.timestamp);
    tarjetasGuardadas = tarjetasGuardadas.slice(0, LIMITE_TARJETAS);

    guardarTarjetas(tarjetasGuardadas);

    const ahora = Date.now();
    if ((nuevasAgregadas.length > 0 || huboActualizaciones || eliminadas.length > 0) && ahora - ultimaConsola >= 15000) {
      console.log(`[🕒 ${new Date().toLocaleTimeString()}] 💾 Tarjetas actualizadas. Total: ${tarjetasGuardadas.length}`);

      if (nuevasAgregadas.length > 0) {
        console.log("🆕 Nuevas tarjetas agregadas:", nuevasAgregadas.join(", "));
      }

      if (huboActualizaciones) {
        console.log("🔄 Tarjetas actualizadas por cambio en reloj.");
      }

      if (eliminadas.length > 0) {
        console.log("❌ Tarjetas eliminadas por antigüedad:", eliminadas.join(", "));
      }

      ultimaConsola = ahora;
    }
  }

  setInterval(actualizarAlmacenamiento, 5000); // ⏱️ Cada 5 segundos
  console.log('✅ Monitor de tarjetas iniciado. Usa verTarjetasGuardadas() o borrarTarjetasGuardadas() desde la consola.');
}

// 🌐 Funciones globales auxiliares
window.iniciarMonitorTarjetas = iniciarMonitorTarjetas;

window.verTarjetasGuardadas = function () {
  const data = localStorage.getItem('tarjetas_guardadas');
  const tarjetas = data ? JSON.parse(data) : [];
  if (tarjetas.length === 0) {
    console.warn('📭 No hay tarjetas guardadas.');
  } else {
    console.table(tarjetas);
    console.log(`💾 Tarjetas actuales en almacenamiento. Total: ${tarjetas.length}`);
  }
};

window.borrarTarjetasGuardadas = function () {
  localStorage.removeItem('tarjetas_guardadas');
  console.log('🧹 Tarjetas eliminadas del almacenamiento.');
  console.log('💾 Tarjetas actualizadas. Total: 0');
};

// iniciarMonitorTarjetas();        // 🚀 Inicia el monitoreo
// verTarjetasGuardadas();          // 🔍 Ver tarjetas en consola
// borrarTarjetasGuardadas();       // 🗑️ Eliminar todas las tarjetas
