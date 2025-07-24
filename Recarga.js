(function () {
  'use strict';

  console.log('[Recarga.js] Script ejecutado');

  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : '[NO ENCONTRADO]';
  };

  const clienteID = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(2) > p');
  const orderCode = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > p');
  const status = getText('#accordion-offers-body-25667679-2 > div > table > tbody > tr > td:nth-child(3)');
  const servicio = 'Recarga';
  const solicitud = '';

  const resultado = `
ID del cliente: ${clienteID}
Order code: ${orderCode}
Servicio: ${servicio}
Status: ${status}
Solicitud: ${solicitud}
  `.trim();

  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:');
    console.log(resultado);
    alert('Datos copiados al portapapeles ✔️');
  }).catch((err) => {
    console.error('❌ Error al copiar al portapapeles:', err);
  });

})();
