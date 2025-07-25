'use strict';

(function () {
  console.log("[IdentificadorHTML] Buscando panel principal expandido...");

  // Paso 1️⃣: Buscar todos los paneles expandidos
  const allExpanded = document.querySelectorAll('.panel-collapse.in');

  // Paso 2️⃣: Filtrar los paneles que no estén anidados dentro de otro .panel-collapse
  const topLevelExpanded = Array.from(allExpanded).filter(panel => {
    return !panel.closest('.panel-collapse:not(:scope)');
  });

  // 🛑 Validaciones: ningún panel o múltiples paneles expandidos
  if (topLevelExpanded.length === 0) {
    alert("[IdentificadorHTML] ❌ No se encontró ningúna orden deplegada.");
    console.warn("No hay panel principal expandido.");
    return;
  }

  if (topLevelExpanded.length > 1) {
    alert("[IdentificadorHTML] Hay más de una orden deplegada. Por favor, colapsa las demás.");
    console.warn("[IdentificadorHTML] Múltiples paneles principales detectados:", topLevelExpanded);
    return;
  }

  // ✅ Obtener el panel principal contenedor completo
  const expanded = topLevelExpanded[0];
  const fullPanel = expanded.closest('.panel.panel-default');

  if (fullPanel) {
    const htmlExpandido = fullPanel.outerHTML;
    console.log("[IdentificadorHTML] ✅ Panel principal expandido detectado:");
    console.log(htmlExpandido);

    // 📦 Exponer el HTML capturado globalmente para usarlo desde otros scripts
    window.bloqueHTMLCapturado = htmlExpandido;

    // 📦 También puedes guardar el elemento como tal (no solo su HTML)
    window.bloqueElemento = fullPanel;

  } else {
    alert("[IdentificadorHTML] No se pudo encontrar el contenedor principal.");
    console.error("[IdentificadorHTML] No se encontró .panel.panel-default");
  }

})();
