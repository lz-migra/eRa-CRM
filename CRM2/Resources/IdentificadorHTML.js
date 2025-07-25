'use strict';

const expandedContent = document.querySelector('.panel-collapse.in');

if (!expandedContent) {
  console.log("No se encontró ningún bloque expandido.");
  alert("No se encontró ningún bloque expandido.");
} else {
  const fullPanel = expandedContent.closest('.panel.panel-default');
  if (fullPanel) {
    const htmlExpandido = fullPanel.outerHTML;
    console.log(htmlExpandido);
  }
}
