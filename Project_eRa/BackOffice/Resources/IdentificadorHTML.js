'use strict';

// Para uso en BackOffice

(function () {
  console.log("[IdentificadorHTML] 🔍 Buscando orden expandida...");

  // Paso 1️⃣: Buscar todas las órdenes en la página
  const todasLasOrdenes = document.querySelectorAll('li.item-purchase-container');

  // Paso 2️⃣: Filtrar las órdenes que están expandidas (tienen el div .expanded-info-container)
  const ordenesExpandidas = Array.from(todasLasOrdenes).filter(orden =>
    orden.querySelector('.expanded-info-container')
  );

  // 🛑 Validaciones
  if (ordenesExpandidas.length === 0) {
    // alert("[IdentificadorHTML] ❌ No se encontró ninguna orden expandida.");
    console.warn("No hay ninguna orden expandida en el DOM.");
    window.estadoEjecucion = "❌ No se encontró ninguna orden expandida.";
    return;
  }

  if (ordenesExpandidas.length > 1) {
    alert("[IdentificadorHTML] ⚠️ Hay más de una orden expandida. Por favor, colapsa las demás.");
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
