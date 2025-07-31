(function () {
  'use strict';

  // 📦 Paso 1: Obtener el contenido HTML capturado desde otra función/script
  const htmlCrudo = window.bloqueHTMLCapturado;
  if (!htmlCrudo || typeof htmlCrudo !== 'string') {
    alert('[🧩 Extractor] ❌ No se encontró el HTML capturado o no es válido.');
    return;
  }

  // 🧱 Paso 2: Convertir el string HTML en un DOM que podamos consultar con querySelector
  const contenedorTemporal = document.createElement('div');
  contenedorTemporal.innerHTML = htmlCrudo;

  const bloque = contenedorTemporal; // Esto ahora es una estructura DOM

  // 🔍 Paso 3: Buscar por texto en elementos con etiquetas como "Orden:", "Cuenta:", etc.
  function obtenerTextoPorEtiqueta(etiqueta, multiple = false) {
    const elementos = Array.from(bloque.querySelectorAll('.info-container, section > div, div'));
    const resultados = [];

    for (const el of elementos) {
      const bold = el.querySelector('span.font-bold, div.font-bold');

      if (bold && bold.textContent.trim().toLowerCase().startsWith(etiqueta.toLowerCase())) {
        const span = bold.nextElementSibling;
        const texto = span
          ? span.textContent.trim()
          : bold.parentNode.textContent.replace(bold.textContent, '').trim();

        if (texto) {
          resultados.push(texto);
          if (!multiple) break;
        }
      }
    }

    // ✅ Eliminar duplicados si multiple = true
    return multiple ? [...new Set(resultados)] : (resultados[0] || 'N/A');
  }

  // 🗃️ Paso 4: Recolectar todos los datos deseados
  const datos = {
    orden: obtenerTextoPorEtiqueta('Orden:'),
    cuenta: obtenerTextoPorEtiqueta('Cuenta:'),
    total: obtenerTextoPorEtiqueta('Total:'),
    creado: obtenerTextoPorEtiqueta('Creado:'),
    fechaProgramada: obtenerTextoPorEtiqueta('Fecha programada:'),
    nombre: obtenerTextoPorEtiqueta('Nombre:'),
    telefono: obtenerTextoPorEtiqueta('Teléfono:'),
    direccion: obtenerTextoPorEtiqueta('Dirección:'),
    negocio: obtenerTextoPorEtiqueta('Negocio:', true).join(', ')
  };

  // 🧾 Paso 5: Formatear el resultado para mostrarlo en consola o copiar
  const resultado = `
🆔 Orden: ${datos.orden}
👤 Cuenta: ${datos.cuenta}
💰 Total: ${datos.total}
🕐 Creado: ${datos.creado}
📅 Fecha programada: ${datos.fechaProgramada}
🙋 Nombre: ${datos.nombre}
📱 Teléfono: ${datos.telefono}
📍 Dirección: ${datos.direccion}
🏪 Negocio: ${datos.negocio}
`.trim();

  // 🖨️ Mostrar en consola para depuración o revisión rápida
  console.log('[📋 Extractor Resultado]', resultado);

  // 🌐 Guardar en una variable global por si otro script lo necesita
  window.datosExtraidos = { ...datos, resultado };

  // 📋 (Opcional) Copiar al portapapeles automáticamente
  // navigator.clipboard.writeText(resultado);
})();
