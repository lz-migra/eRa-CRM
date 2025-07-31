(function () {
  'use strict';

  // 📦 Obtener el bloque HTML capturado previamente
  const bloque = window.bloqueHTMLCapturadoo;
  if (!bloque) {
    alert('[Extractor] ❌ No se encontró el bloque HTML capturado.');
    return;
  }

  // 🔍 Función para buscar el valor justo después de una etiqueta en negrita
  function obtenerTextoPorEtiqueta(etiqueta) {
    const elementos = Array.from(bloque.querySelectorAll('.info-container, section > div, div'));
    
    for (const el of elementos) {
      const bold = el.querySelector('span.font-bold, div.font-bold');
      
      // Verifica si el texto en negrita coincide con la etiqueta buscada
      if (bold && bold.textContent.trim().startsWith(etiqueta)) {
        
        // 🧷 Si hay un nodo hermano (span), lo usamos directamente
        const span = bold.nextElementSibling;
        if (span) return span.textContent.trim();

        // 🪄 Si no hay hermano, tomamos el texto restante del contenedor
        const textoPlano = bold.parentNode.textContent.replace(etiqueta, '').trim();
        if (textoPlano) return textoPlano;
      }
    }

    return 'N/A';
  }

  // 🧾 Campos requeridos
  const datos = {
    orden: obtenerTextoPorEtiqueta('Orden:'),
    cuenta: obtenerTextoPorEtiqueta('Cuenta:'),
    total: obtenerTextoPorEtiqueta('Total:'),
    creado: obtenerTextoPorEtiqueta('Creado:'),
    fechaProgramada: obtenerTextoPorEtiqueta('Fecha programada:'),
    nombre: obtenerTextoPorEtiqueta('Nombre:'),
    telefono: obtenerTextoPorEtiqueta('Teléfono:'),
    direccion: obtenerTextoPorEtiqueta('Dirección:'),
    negocio: obtenerTextoPorEtiqueta('Negocio:')
  };

  // 🖨️ Formato de salida para consola o portapapeles
  const resultado = `
Orden: ${datos.orden}
Cuenta: ${datos.cuenta}
Total: ${datos.total}
Creado: ${datos.creado}
Fecha programada: ${datos.fechaProgramada}
Nombre: ${datos.nombre}
Teléfono: ${datos.telefono}
Dirección: ${datos.direccion}
Negocio: ${datos.negocio}
`.trim();

  // 📤 Mostrar en consola
  console.log('[Extractor Resultado]', resultado);

  // 🌐 Exponer los datos para que otros scripts puedan usarlos
  window.datosExtraidosNuevo = {
    ...datos,
    resultado
  };

  // 📋 Copiar automáticamente al portapapeles (activar si se desea)
  // navigator.clipboard.writeText(resultado);

})();
