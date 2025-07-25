'use strict';

(function () {
  console.log("[IdentificadorHTML] Ejecutando búsqueda...");

  // Buscar paneles expandidos actuales
  const expandedPanels = document.querySelectorAll('.panel-collapse.in');

  if (expandedPanels.length === 0) {
    alert("No se encontró ningún bloque expandido.");
    console.warn("No hay paneles expandidos.");
    return;
  }

  if (expandedPanels.length > 1) {
    alert("Hay más de un panel expandido. Por favor, asegúrese de expandir solo uno.");
    console.warn("Más de un panel expandido:", expandedPanels);
    return;
  }

  const expandedContent = expandedPanels[0];
  const fullPanel = expandedContent.closest('.panel.panel-default');

  if (fullPanel) {
    const htmlExpandido = fullPanel.outerHTML;
    console.log("Panel expandido detectado:");
    console.log(htmlExpandido);
    // Aquí podrías enviar `htmlExpandido` a otro script si lo deseas
  } else {
    alert("No se pudo identificar el bloque completo.");
    console.error("No se encontró .panel.panel-default como contenedor.");
  }
})();
