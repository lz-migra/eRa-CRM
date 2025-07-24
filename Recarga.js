(function () {
  'use strict';

  console.log('[Topup + Oferta] Script ejecutado');

  // Paso 1: Buscar la fila principal de la tabla de Topup
  const filaTopup = document.querySelector('.panel-body table tbody tr');
  if (!filaTopup) {
    alert('❌ No se encontró la tabla de Topup.');
    return;
  }

  const celdas = filaTopup.querySelectorAll('td');

  // Paso 2: Extraer datos de la tabla
  const status = celdas[2]?.textContent.trim() || 'N/A';
  const destino = celdas[6]?.textContent.trim() || 'N/A';
  const nombre = celdas[7]?.textContent.trim() || 'N/A';
  const tipo = celdas[1]?.textContent.trim() || 'N/A';
  const monto = celdas[3]?.textContent.trim() || '';
  const moneda = celdas[4]?.textContent.trim() || '';
  const precioTopup = `${monto} ${moneda}`.trim();

  // Paso 3: Buscar el contenedor de la oferta (título y precio total)
  const ofertaRow = document.querySelector('#accordion-offers .panel-heading .row');
  if (!ofertaRow) {
    alert('❌ No se encontró el bloque de la oferta.');
    return;
  }

  const cols = ofertaRow.querySelectorAll('div.col-xs-1, div.col-xs-2');

  const titulo = cols[1]?.textContent.trim() || 'N/A'; // Columna 2
  const precioTotal = cols[6]?.textContent.trim() || 'N/A'; // Columna 7

  // Paso 4: Obtener la fecha desde el selector proporcionado
  const fechaEl = document.querySelector('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(3) > p');
  const fecha = fechaEl?.textContent.trim() || 'N/A';

  // Paso 5: Armar el texto final
  const resultado = `
Título: ${titulo}
Status: ${status}
Destino: ${destino}
Nombre: ${nombre}
Tipo: ${tipo}
Monto: ${precioTopup}
Precio total: ${precioTotal}
Fecha: ${fecha}
  `.trim();

  // Paso 6: Copiar al portapapeles
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:');
    console.log(resultado);
    alert('📋 ¡Datos copiados al portapapeles! 📋');
  }).catch((err) => {
    console.error('❌ Error al copiar al portapapeles:', err);
  });

})();
