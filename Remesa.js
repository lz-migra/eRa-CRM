(function () {
  'use strict';

  console.log('[Remesa.js] Script ejecutado');

  // Función auxiliar para obtener texto por selector
  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : 'N/A';
  };

  // ✅ Función para extraer "Provincia" desde la sección con clase `.col-sm-5`
  const getProvincia = () => {
    const elementos = document.querySelectorAll('.col-sm-5 p');
    for (const el of elementos) {
      const font = el.querySelector('font');
      if (font && font.textContent.trim().toLowerCase().includes('provincia')) {
        return el.textContent.replace(font.textContent, '').trim();
      }
    }
    return 'N/A';
  };

  // --- Extracción de datos ---
  const IDcliente = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(2) > p');
  const Tipoderemesa = 'Domicilio';
  const Provincia = getProvincia();  // 👈 este es el nuevo método
  const NroReparto = 'N/A'; // si no lo tienes, lo dejamos fijo
  const orderCode = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > p');
  const FoiID = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(1)');
  const status = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(4)');
  const Proveedor = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(3)');
  const solicitud = '';

  // --- Resultado final ---
  const resultado = `
ID del cliente: ${IDcliente}
Tipo de remesa: ${Tipoderemesa}
Provincia: ${Provincia}
Número de reparto: ${NroReparto}
Order code: ${orderCode}
ID o FOI: ${FoiID}
Status: ${status}
Proveedor: ${Proveedor}
Solicitud: ${solicitud}
  `.trim();

  // --- Copiar al portapapeles ---
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:');
    console.log(resultado);
    alert('📋 ¡Datos copiados al portapapeles! 📋');
  }).catch((err) => {
    console.error('❌ Error al copiar al portapapeles:', err);
  });

})();
