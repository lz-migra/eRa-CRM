(function () {
  'use strict';

  console.log('[Topup + Oferta + Info Adicional] Script ejecutado');

  // 📌 Función para obtener el índice de una columna según su nombre
  function obtenerIndiceColumnaPorNombre(nombreColumna) {
    const ths = document.querySelectorAll('.panel-body table thead th');
    for (let i = 0; i < ths.length; i++) {
      const texto = ths[i].textContent.trim().toLowerCase();
      if (texto === nombreColumna.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }

  // ✅ Paso 1: Obtener Ordercode, Cliente Id, Fecha y Monto Pagado
  let ordenID = 'N/A', clienteID = 'N/A', fecha = 'N/A', montoPagado = 'N/A';

  const panelHeading = document.querySelector('.panel.panel-default > .panel-heading');
  if (panelHeading) {
    const filas = panelHeading.querySelectorAll('.row');
    if (filas.length >= 2) {
      const columnas = filas[1].querySelectorAll('div.col-sm-1 p');
      ordenID = columnas[0]?.textContent.trim() || 'N/A';
      clienteID = columnas[1]?.textContent.trim() || 'N/A';
      fecha = columnas[2]?.textContent.trim() || 'N/A';
      montoPagado = columnas[4]?.textContent.trim() || 'N/A'; // 👉 Monto Pagado
    }
  }

  // ✅ Paso 2: Buscar fila principal de la tabla TOPUP
  const filaTopup = document.querySelector('.panel-body table tbody tr');
  if (!filaTopup) {
    alert('❌ No se encontró la tabla Topup. Por favor, extiende la oferta.');
    return;
  }

  const celdas = filaTopup.querySelectorAll('td');

  // ✅ Paso 3: Obtener índices dinámicos de columnas
  const idxStatus = obtenerIndiceColumnaPorNombre('status');
  const idxDestino = obtenerIndiceColumnaPorNombre('destino');
  const idxNombre = obtenerIndiceColumnaPorNombre('nombre');

  // ✅ Paso 4: Extraer datos de la fila
  const status = celdas[idxStatus]?.textContent.trim() || 'N/A';
  const destino = celdas[idxDestino]?.textContent.trim() || 'N/A';
  const nombre = celdas[idxNombre]?.textContent.trim() || 'N/A';

  // ✅ Paso 5: Extraer título y precio total de la oferta
  const ofertaRow = document.querySelector('#accordion-offers .panel-heading .row');
  const cols = ofertaRow?.querySelectorAll('div.col-xs-1, div.col-xs-2') || [];
  const titulo = cols[1]?.textContent.trim() || 'N/A';
  const precioTotal = cols[6]?.textContent.trim() || 'N/A';

  // ✅ Paso 6: Armar y copiar mensaje final
  const resultado = `
ID del cliente: ${clienteID}
Order code: ${ordenID}
Fecha: ${fecha}
Monto Pagado: ${montoPagado}
Servicio: Recarga
Status: ${status}
Destino: ${destino}
Nombre: ${nombre}
Oferta: ${titulo}
Precio total: ${precioTotal}
Solicitud:
  `.trim();

  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:\n', resultado);
    alert('📋 ¡Todos los datos fueron copiados al portapapeles!. El escalamiento ha sido generado correctamente.');
  }).catch((err) => {
    console.error('❌ ¡Error al copiar al portapapeles!', err);
  });

})();
