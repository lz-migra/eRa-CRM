window.MonitorTarjetas = (function () {
  const STORAGE_KEY = 'tarjetas_guardadas';        // 🗝️ Clave de almacenamiento
  const LIMITE_TARJETAS = 10;                      // 🔢 Límite de tarjetas guardadas
  const TIEMPO_EXPIRACION_MS = 60 * 60 * 1000;     // ⏳ 1 hora
  let ultimaConsola = 0;                           // 🕒 Tiempo del último log

  // 🧾 Cargar tarjetas desde localStorage
  function cargarTarjetas() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 💾 Guardar tarjetas en localStorage
  function guardarTarjetas(tarjetas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarjetas));
  }

  // 🧹 Eliminar tarjetas obsoletas (1h)
  function limpiarObsoletas(tarjetas) {
    const ahora = Date.now();
    return tarjetas.filter(t => ahora - t.timestamp < TIEMPO_EXPIRACION_MS);
  }

  // 🔍 Obtener tarjetas del DOM
  function obtenerTarjetasDOM() {
    const tarjetasDOM = document.querySelectorAll('.Twilio-TaskListBaseItem');

    return Array.from(tarjetasDOM).map(tarjeta => {
      const nombre = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim();
      const reloj = tarjeta.querySelector('.custom-crono-line')?.textContent?.trim();
      if (!nombre || !reloj) return null;

      return { nombre, reloj, timestamp: Date.now() };
    }).filter(Boolean);
  }

  // 🔄 Lógica de actualización periódica
  function actualizarAlmacenamiento() {
    const nuevas = obtenerTarjetasDOM();
    let almacenadas = cargarTarjetas();

    const antes = almacenadas.map(t => t.nombre);
    almacenadas = limpiarObsoletas(almacenadas);
    const despues = almacenadas.map(t => t.nombre);
    const eliminadas = antes.filter(nombre => !despues.includes(nombre));

    const nuevasAgregadas = [];
    let huboCambios = false;

    nuevas.forEach(nueva => {
      const index = almacenadas.findIndex(t => t.nombre === nueva.nombre);
      if (index !== -1) {
        if (almacenadas[index].reloj !== nueva.reloj) {
          almacenadas[index] = nueva;
          huboCambios = true;
        }
      } else {
        almacenadas.push(nueva);
        nuevasAgregadas.push(nueva.nombre);
        huboCambios = true;
      }
    });

    almacenadas.sort((a, b) => b.timestamp - a.timestamp);
    almacenadas = almacenadas.slice(0, LIMITE_TARJETAS);

    guardarTarjetas(almacenadas);

    const ahora = Date.now();
    if ((nuevasAgregadas.length > 0 || huboCambios || eliminadas.length > 0) && ahora - ultimaConsola >= 15000) {
      console.log(`[🕒 ${new Date().toLocaleTimeString()}] 💾 Tarjetas actualizadas. Total: ${almacenadas.length}`);

      if (nuevasAgregadas.length > 0) console.log("🆕 Nuevas tarjetas:", nuevasAgregadas.join(", "));
      if (huboCambios) console.log("🔄 Tarjetas actualizadas por reloj.");
      if (eliminadas.length > 0) console.log("❌ Tarjetas eliminadas por antigüedad:", eliminadas.join(", "));

      ultimaConsola = ahora;
    }
  }

  // 🚀 Arranca automáticamente al cargar
  setInterval(actualizarAlmacenamiento, 5000);
  console.log("✅ Monitor de tarjetas iniciado automáticamente.");

  return {
    ver: function () {
      const tarjetas = cargarTarjetas();
      if (tarjetas.length === 0) {
        console.warn('📭 No hay tarjetas guardadas.');
      } else {
        console.table(tarjetas);
        console.log(`💾 Tarjetas actuales. Total: ${tarjetas.length}`);
      }
    },

    eliminar: function (nombre) {
      if (!nombre) {
        console.warn("⚠️ Debes especificar el nombre de la tarjeta a eliminar.");
        return;
      }
      let tarjetas = cargarTarjetas();
      const inicial = tarjetas.length;
      tarjetas = tarjetas.filter(t => t.nombre !== nombre);
      guardarTarjetas(tarjetas);
      const eliminadas = inicial - tarjetas.length;
      if (eliminadas > 0) {
        console.log(`🗑️ Tarjeta "${nombre}" eliminada.`);
      } else {
        console.warn(`⚠️ No se encontró la tarjeta "${nombre}".`);
      }
    },

    EliminarTodos: function () {
      localStorage.removeItem(STORAGE_KEY);
      console.log("🧹 Todas las tarjetas eliminadas del almacenamiento.");
    }
  };
})();

// MonitorTarjetas.ver();               // 🔍 Muestra tarjetas en consola
// MonitorTarjetas.eliminar("Nombre");  // 🗑️ Elimina tarjeta por nombre
// MonitorTarjetas.EliminarTodos();     // 🧹 Borra todas las tarjetas

