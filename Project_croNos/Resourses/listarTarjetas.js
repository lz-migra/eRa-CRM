//============= Descripcion =============
// 🧠 Este script monitorea las tarjetas activas en la interfaz de Twilio.
// 🔄 Cada 5 segundos detecta los nombres y relojes de las tarjetas visibles.
// 💾 Guarda un máximo de 10 tarjetas en localStorage bajo la clave 'tarjetas_guardadas'.
// 🧹 Las tarjetas con más de 1 hora sin actualizarce se eliminan automáticamente.
// ✅ Usa iniciarMonitorTarjetas() para iniciar el monitoreo.
// 🔍 Usa verTarjetasGuardadas() para revisar en consola.
// 🗑️ Usa borrarTarjetasGuardadas() para limpiar el almacenamiento.
[
    {
        "nombre": "⏰ ['Remesas Round 1 | Acc: 1002731']", // Nombre para identificar la tarjeta
        "reloj": "🕒 17:59:08",                            // El reloj guardado
        "timestamp": 1754089363521                         // El tiempa desde la ultima actulizacion. "Este solo o usa la funcion listartarjetas()?"
    },
    {
        "nombre": "+1 813-368-8728",
        "reloj": "🕒 18:00:04",
        "timestamp": 1754089273517
    },
]
//=======================================

// 🌐 Función global para iniciar el monitor de tarjetas
function iniciarMonitorTarjetas() {
  // 📦 Claves y configuraciones generales
  const STORAGE_KEY = 'tarjetas_guardadas';        // 🗝️ Nombre usado en localStorage
  const LIMITE_TARJETAS = 10;                      // 🔢 Máximo de tarjetas a guardar
  const TIEMPO_EXPIRACION_MS = 60 * 60 * 1000;     // ⏳ 1 hora en milisegundos
  let ultimaConsola = 0;                           // 🕒 Última vez que se mostró el log en consola

  // 🧾 Cargar tarjetas desde el almacenamiento local
  function cargarTarjetasGuardadas() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 💾 Guardar tarjetas en el almacenamiento local
  function guardarTarjetas(tarjetas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarjetas));
  }

  // 🧹 Eliminar tarjetas que tienen más de 1 hora sin actualizarse
  function limpiarTarjetasObsoletas(tarjetas) {
    const ahora = Date.now();
    return tarjetas.filter(t => ahora - t.timestamp < TIEMPO_EXPIRACION_MS);
  }

  // 🔍 Extraer tarjetas del DOM (interfaz visual)
  function obtenerTarjetasDOM() {
    const tarjetasDOM = document.querySelectorAll('.Twilio-TaskListBaseItem');

    return Array.from(tarjetasDOM).map((tarjeta) => {
      const nombre = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim();
      const reloj = tarjeta.querySelector('.custom-crono-line')?.textContent?.trim();
      if (!nombre || !reloj) return null; // ❌ Ignorar si no tiene datos clave

      return {
        nombre,
        reloj,
        timestamp: Date.now() // ⏱️ Hora actual para control de antigüedad
      };
    }).filter(Boolean); // ✅ Elimina los null
  }

  // 🔄 Comparar y actualizar tarjetas guardadas
  function actualizarAlmacenamiento() {
    const tarjetasNuevas = obtenerTarjetasDOM();         // 🆕 Las del DOM actual
    let tarjetasGuardadas = cargarTarjetasGuardadas();   // 📂 Las que ya estaban en localStorage

    const antesLimpieza = tarjetasGuardadas.map(t => t.nombre); // 📝 Para detectar eliminadas
    tarjetasGuardadas = limpiarTarjetasObsoletas(tarjetasGuardadas); // 🧹 Limpiar viejas
    const despuesLimpieza = tarjetasGuardadas.map(t => t.nombre);

    const eliminadas = antesLimpieza.filter(nombre => !despuesLimpieza.includes(nombre)); // ❌

    const nuevasAgregadas = [];

    // 🔁 Actualizar si ya existe o agregar si es nueva
    tarjetasNuevas.forEach(nueva => {
      const index = tarjetasGuardadas.findIndex(t => t.nombre === nueva.nombre);
      if (index !== -1) {
        tarjetasGuardadas[index] = nueva; // 🔄 Reemplazar si ya existe
      } else {
        tarjetasGuardadas.push(nueva);    // ➕ Agregar si es nueva
        nuevasAgregadas.push(nueva.nombre); // 🆕 Guardar nombre para log
      }
    });

    // 🧽 Ordenar por fecha y limitar a 10
    tarjetasGuardadas.sort((a, b) => b.timestamp - a.timestamp);
    tarjetasGuardadas = tarjetasGuardadas.slice(0, LIMITE_TARJETAS);

    // 💾 Guardar todo de nuevo
    guardarTarjetas(tarjetasGuardadas);

    // 🕒 Mostrar logs solo si han pasado 15 segundos
    const ahora = Date.now();
    if (ahora - ultimaConsola >= 15000) {
      console.log(`[🕒 ${new Date().toLocaleTimeString()}] 💾 Tarjetas actualizadas. Total: ${tarjetasGuardadas.length}`);

      if (nuevasAgregadas.length > 0) {
        console.log("🆕 Nuevas tarjetas agregadas:", nuevasAgregadas.join(", "));
      }

      if (eliminadas.length > 0) {
        console.log("❌ Tarjetas eliminadas por antigüedad:", eliminadas.join(", "));
      }

      ultimaConsola = ahora;
    }
  }

  // 🚀 Ejecutar la actualización cada 5 segundos
  setInterval(actualizarAlmacenamiento, 5000);

  // ✅ Mensaje de inicio
  console.log('✅ Monitor de tarjetas iniciado. Usa verTarjetasGuardadas() o borrarTarjetasGuardadas() desde la consola.');
}

// 🌐 Exponer funciones globales
window.iniciarMonitorTarjetas = iniciarMonitorTarjetas;

window.verTarjetasGuardadas = function () {
  const data = localStorage.getItem('tarjetas_guardadas');
  const tarjetas = data ? JSON.parse(data) : [];
  if (tarjetas.length === 0) {
    console.warn('📭 No hay tarjetas guardadas.');
  } else {
    console.table(tarjetas);
  }
};

window.borrarTarjetasGuardadas = function () {
  localStorage.removeItem('tarjetas_guardadas');
  console.log('🧹 Tarjetas eliminadas del almacenamiento.');
};

//iniciarMonitorTarjetas();        // 🚀 Inicia el monitoreo
//verTarjetasGuardadas();          // 🔍 Ver tarjetas en consola
//borrarTarjetasGuardadas();       // 🗑️ Eliminar todas las tarjetas
