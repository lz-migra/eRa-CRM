'use strict';

(function () {
  console.log("[IdentificadorHTML] Buscando panel principal expandido...");

  // Paso 1: buscar todos los bloques colapsados que están expandidos
  const allExpanded = document.querySelectorAll('.panel-collapse.in');

  // Paso 2: filtrar solo los que NO están anidados en otro .panel-collapse
  const topLevelExpanded = Array.from(allExpanded).filter(panel => {
    return !panel.closest('.panel-collapse:not(:scope)');
  });

  if (topLevelExpanded.length === 0) {
    alert("No se encontró ningún bloque principal expandido.");
    console.warn("No hay panel principal expandido.");
    return;
  }

  if (topLevelExpanded.length > 1) {
    alert("Hay más de un panel principal expandido. Por favor, colapse los demás.");
    console.warn("Múltiples paneles principales detectados:", topLevelExpanded);
    return;
  }

  const expanded = topLevelExpanded[0];
  const fullPanel = expanded.closest('.panel.panel-default');

  if (fullPanel) {
    const htmlExpandido = fullPanel.outerHTML;
    console.log("Panel principal expandido detectado:");
    console.log(htmlExpandido);

    // Si deseas, puedes pasarlo a otra variable global:
    window.bloqueHTMLCapturado = htmlExpandido;
  } else {
    alert("No se pudo encontrar el contenedor principal.");
    console.error("No se encontró .panel.panel-default");
  }
})();
