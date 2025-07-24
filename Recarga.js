(function () {
  'use strict';

  console.log('[Topup + Oferta + Info Adicional] Script ejecutado');

  // Paso 1: Buscar datos adicionales usando selectores directos
  const ordenID = document.querySelector('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > p')?.textContent.trim() || 'N/A';
  const clienteID = document.querySelector('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(2) > p')?.textContent.trim() || 'N/A';
  const fecha = document.querySelector('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(3) > p')?.textContent.trim() || 'N/A';

  // Paso 2: Buscar la fila principal de la tabla de Topup
  const filaTopup = document.querySelector('.panel-body table tbody tr');
  if (!filaTopup) {
    alert('❌ No se encontró la tabla de Topup.');
    return;
  }

  const celdas = filaTopup.querySelectorAll('td');

  // Paso 3: Extraer datos de la tabla
  const status = celdas[2]?.textContent.trim() || 'N/A';
  const destino = celdas[6]?.textContent.trim() || 'N/A';
  const nombre = celdas[7]?.textContent.trim() || 'N/A';
  const tipo = celdas[1]?.textContent.trim() || 'N/A';
  const monto = celdas[3]?.textContent.trim() || '';
  const moneda = celdas[4]?.textContent.trim() || '';
  const precioTopup = `${monto} ${moneda}`.trim();

  // Paso 4: Buscar el contenedor de la oferta
  const ofertaRow = document.querySelector('#accordion-offers .panel-heading .row');
  if (!ofertaRow) {
    alert('❌ No se encontró el bloque de la oferta.');
    return;
  }

  const cols = ofertaRow.querySelectorAll('div.col-xs-1, div.col-xs-2');

  // Paso 5: Extraer título y precio total
  const titulo = cols[1]?.textContent.trim() || 'N/A'; // Título
  const precioTotal = cols[6]?.textContent.trim() || 'N/A'; // Precio total

  // Paso 6: Armar el texto final
  const resultado = `
🆔 OrdenID: ${ordenID}
👤 ID Cliente: ${clienteID}
📅 Fecha: ${fecha}

📌 Título: ${titulo}
📞 Destino: ${destino}
👤 Nombre: ${nombre}
💬 Status: ${status}
💳 Tipo: ${tipo}
💰 Monto: ${precioTopup}
🧾 Precio total: ${precioTotal}
  `.trim();

  // Paso 7: Copiar al portapapeles
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:\n', resultado);
    alert('📋 ¡Todos los datos fueron copiados al portapapeles!');
  }).catch((err) => {
    console.error('❌ Error al copiar:', err);
  });

})();
