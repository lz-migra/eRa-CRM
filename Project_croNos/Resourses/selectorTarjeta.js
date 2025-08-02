// 🌐 Función global para obtener la clase de la tarjeta activa
function obtenerClaseTarjetaActiva() {
  // 🔍 Paso 1: Obtener el texto del encabezado de la tarjeta activa (panel derecho)
  const encabezadoActivo = document.querySelector(
    '.Twilio-TaskCanvasHeader-Name span'
  )?.innerText?.trim();

  if (!encabezadoActivo) {
    console.warn('⚠️ No se pudo obtener el encabezado activo');
    return;
  }

  // 📋 Paso 2: Buscar todas las tarjetas en la lista lateral
  const tarjetas = document.querySelectorAll('[data-testid="task-item"]');

  for (const tarjeta of tarjetas) {
    // 🏷️ Buscar el encabezado dentro de cada tarjeta de la lista
    const textoTarjeta = tarjeta.querySelector(
      '[data-testid="task-item-first-line"] span'
    )?.innerText?.trim();

    // ✅ Paso 3: Comparar con el encabezado activo
    if (textoTarjeta === encabezadoActivo) {
      // 🌐 Guardar la clase como variable global
      window.claseTarjetaActiva = tarjeta.className;

      // 🧪 Mostrarla en consola para depuración
      console.log('🎯 Clase de la tarjeta activa:', window.claseTarjetaActiva);
      return;
    }
  }

  // ❌ No se encontró ninguna tarjeta que coincida
  console.warn('❌ No se encontró una tarjeta que coincida con el encabezado activo');
}

//obtenerClaseTarjetaActiva();
//Luego puedes usar: window.claseTarjetaActiva