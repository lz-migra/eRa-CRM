(function () {
  'use strict';

  console.log('[Remesa.js] Script ejecutado');

  // 🔍 Función genérica para buscar cualquier valor por su etiqueta <font> dentro de <p>
  const getDatoPorEtiqueta = (etiqueta) => {
    const elementos = document.querySelectorAll('p');
    for (const el of elementos) {
      const font = el.querySelector('font');
      if (font && font.textContent.toLowerCase().includes(etiqueta.toLowerCase())) {
        return el.textContent.replace(font.textContent, '').trim();
      }
    }
    return 'N/A';
  };

  // 🔧 Función para seleccionar texto por CSS selector
  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : 'N/A';
  };

  // --- Datos obtenidos por etiqueta dinámica ---
  const Provincia = getDatoPorEtiqueta('Provincia');
  const Municipio = getDatoPorEtiqueta('Municipio');
  const Direccion = getDatoPorEtiqueta('Direccion');
  const Barrio = getDatoPorEtiqueta('Barrio');
  const Instrucciones = getDatoPorEtiqueta('Instrucciones');
  const NroReparto = getDatoPorEtiqueta('Nro de Reparto');
  const Celular = getDatoPorEtiqueta('Celular');
  const Nombre = getDatoPorEtiqueta('Nombre');
  const Monto = getDatoPorEtiqueta('Monto');
  const Fee = getDatoPorEtiqueta('Fee');

  // --- Datos por selectores fijos del CRM ---
  const IDcliente = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(2) > p');
  const orderCode = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > p');
  const FoiID = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(1)');
  const status = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(4)');
  const Proveedor = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(3)');

  // --- Armar el resultado final ---
  const resultado = `
ID del cliente: ${IDcliente}
Tipo de remesa: Domicilio
Provincia: ${Provincia}
Número de reparto: ${NroReparto}
Order code: ${orderCode}
ID o FOI: ${FoiID}
Status: ${status}
Proveedor: ${Proveedor}
Solicitud: 
  `.trim();

  // 📋 Copiar al portapapeles
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:');
    console.log(resultado);
    alert('📋 ¡Datos copiados al portapapeles! 📋');
  }).catch((err) => {
    console.error('❌ Error al copiar al portapapeles:', err);
  });

})();
