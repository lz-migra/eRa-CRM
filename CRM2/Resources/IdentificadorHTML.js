(function () {
  'use strict';

  // Encuentra el contenido expandido
  const expandedContent = document.querySelector('.panel-collapse.in');

  if (!expandedContent) {
    console.log("No se encontró ningún bloque expandido.");
    return;
  }

  // Encuentra el contenedor principal del panel
  const fullPanel = expandedContent.closest('.panel.panel-default');

  if (fullPanel) {
    // Aquí tienes solo el HTML del bloque expandido
    const htmlExpandido = fullPanel.outerHTML;
    console.log(htmlExpandido);

    // Si quieres, puedes retornarlo o usarlo donde lo necesites
    // Por ejemplo, exportarlo a una función externa:
    // procesarPanelExpandido(htmlExpandido);
  }
})();
