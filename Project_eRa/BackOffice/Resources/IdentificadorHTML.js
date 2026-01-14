'use strict';

// Para uso en BackOffice

(function () {
  console.log("[IdentificadorHTML] 🔍 Buscando orden expandida...");

  // Paso 1️⃣: Buscar directamente los iconos de "flecha arriba" que indican una orden expandida
  // El selector de clase 'li.item-purchase-container' ya no es fiable, así que buscamos por el contenido SVG.
  const pathsExpandidos = document.querySelectorAll('path[d="m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"]');

  // Paso 2️⃣: Obtener los contenedores 'li' padres de esos iconos
  const ordenesExpandidas = Array.from(pathsExpandidos)
    .map(path => path.closest('li'))
    .filter(li => li !== null);

  // 🛑 Validaciones
  if (ordenesExpandidas.length === 0) {
    // alert("[IdentificadorHTML] ❌ No se encontró ninguna orden expandida.");
    console.warn("No hay ninguna orden expandida en el DOM.");
    window.estadoEjecucion = "❌ No se detectó ninguna orden activa. Por favor, despliega la orden con la que estás trabajando.";
    return;
  }

  if (ordenesExpandidas.length > 1) {
   // alert("[IdentificadorHTML] ⚠️ Se detectaron varias órdenes desplegadas. Por favor, cierra las demás; solo puedes tener una activa a la vez.");
    window.estadoEjecucion = "[IdentificadorHTML] ⚠️ Se detectaron varias órdenes desplegadas. Por favor, cierra las demás; solo puedes tener una activa a la vez.";
    console.warn("Varias órdenes expandidas detectadas:", ordenesExpandidas);
    return;
  }

  // ✅ Obtener la única orden expandida
  const ordenExpandida = ordenesExpandidas[0];

  // Extraer el HTML completo del bloque
  const htmlExpandido = ordenExpandida.outerHTML;
  console.log("[IdentificadorHTML] ✅ Orden expandida detectada:");
  console.log(htmlExpandido);

  // 📦 Exponer el HTML y el elemento globalmente para uso en otros scripts
  window.bloqueHTMLCapturado = htmlExpandido;
  window.bloqueElemento = ordenExpandida;
})();
