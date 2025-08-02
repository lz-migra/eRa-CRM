(function () {
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

    tarjetasGuardadas = limpiarTarjetasObsoletas(tarjetasGuardadas); // 🧹 Limpiar viejas

    // 🔁 Actualizar si ya existe o agregar si es nueva
    tarjetasNuevas.forEach(nueva => {
      const index = tarjetasGuardadas.findIndex(t => t.nombre === nueva.nombre);
      if (index !== -1) {
        tarjetasGuardadas[index] = nueva; // 🔄 Reemplazar si ya existe
      } else {
        tarjetasGuardadas.push(nueva);    // ➕ Agregar si es nueva
      }
    });

    // 🧽 Ordenar por fecha y limitar a 10
    tarjetasGuardadas.sort((a, b) => b.timestamp - a.timestamp);
    tarjetasGuardadas = tarjetasGuardadas.slice(0, LIMITE_TARJETAS);

    // 💾 Guardar todo de nuevo
    guardarTarjetas(tarjetasGuardadas);

    // 🕒 Mostrar en consola solo si han pasado 15 segundos
    const ahora = Date.now();
    if (ahora - ultimaConsola >= 15000) {
      console.log(`[🕒 ${new Date().toLocaleTimeString()}] 💾 Tarjetas actualizadas. Total: ${tarjetasGuardadas.length}`);
      ultimaConsola = ahora;
    }
  }

  // 🚀 Ejecutar la actualización cada 5 segundos
  setInterval(actualizarAlmacenamiento, 5000);

  // 🌐 Función global: ver tarjetas en consola
  window.verTarjetasGuardadas = function () {
    const tarjetas = cargarTarjetasGuardadas();
    if (tarjetas.length === 0) {
      console.warn('📭 No hay tarjetas guardadas.');
    } else {
      console.table(tarjetas); // 📋 Mostrar como tabla
    }
  };

  // 🌐 Función global: borrar tarjetas del almacenamiento
  window.borrarTarjetasGuardadas = function () {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🧹 Tarjetas eliminadas del almacenamiento.');
  };

  // ✅ Mensaje de inicio
  console.log('✅ Monitor de tarjetas iniciado. Usa verTarjetasGuardadas() o borrarTarjetasGuardadas() desde la consola.');
})();
