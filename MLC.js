(function () {
  'use strict';

  console.log('[Remesa.js] Script ejecutado');

  const filaTopup = document.querySelector('.panel-body table tbody tr');
  if (!filaTopup) {
    alert('❌ No se encontró la tabla de Topup. Por favor extiende la oferta');
    return;
  }

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

  // 🧱 Función para obtener FOI, Proveedor y Status desde la tabla
  const getDatosDesdeTabla = () => {
    const primeraFila = document.querySelector('table.table tbody tr');
    if (!primeraFila) return { FoiID: 'N/A', Proveedor: 'N/A', Status: 'N/A' };

    const celdas = primeraFila.querySelectorAll('td');
    return {
      FoiID: celdas[0]?.textContent.trim() || 'N/A',
      Proveedor: celdas[2]?.textContent.trim() || 'N/A',
      Status: celdas[3]?.textContent.trim() || 'N/A'
    };
  };

  // --- Datos por etiqueta dinámica ---
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

  // --- Datos fijos por selector ---
  const IDcliente = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(2) > p');
  const orderCode = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > p');

  // --- Obtener datos desde la tabla ---
  const { FoiID, Proveedor, Status } = getDatosDesdeTabla();

  // --- Construcción del resultado ---
  const resultado = `
ID del cliente: ${IDcliente}
Tipo de remesa: MLC
Provincia: ${Provincia}
Order code: ${orderCode}
ID o FOI: ${FoiID}
Status: ${Status}
Proveedor: ${Proveedor}
Solicitud: 

  `.trim();

  // 📋 Copiar al portapapeles
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:');
    console.log(resultado);
    alert('📋 ¡Datos copiados al portapapeles! 📋 El escalamieto ha sido generado para "MLC" correctamente');
  }).catch((err) => {
    console.error('❌ Error al copiar al portapapeles:', err);
  });

})();
