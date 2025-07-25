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
    return -1; // No encontrado
  }

  // ✅ Paso 1: Obtener Ordercode, Cliente Id y Fecha
  const encabezados = Array.from(document.querySelectorAll('#accordion-example-heading-23954487 .row'))[1];
  const columnas = encabezados?.querySelectorAll('div.col-sm-1 p.category');

  const ordenID = columnas?.[0]?.textContent.trim() || 'N/A';
  const clienteID = columnas?.[1]?.textContent.trim() || 'N/A';
  const fecha = columnas?.[2]?.textContent.trim() || 'N/A';

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

  // ✅ Paso 4: Extraer datos de la fila usando índices
  const status = celdas[idxStatus]?.textContent.trim() || 'N/A';
  const destino = celdas[idxDestino]?.textContent.trim() || 'N/A';
  const nombre = celdas[idxNombre]?.textContent.trim() || 'N/A';

  // ✅ Paso 5: Buscar contenedor de la oferta
  const ofertaRow = document.querySelector('#accordion-offers .panel-heading .row');
  if (!ofertaRow) {
    alert('❌ No se encontró el bloque de la oferta.');
    return;
  }

  const cols = ofertaRow.querySelectorAll('div.col-xs-1, div.col-xs-2');

  // ✅ Paso 6: Extraer título y precio total
  const titulo = cols[1]?.textContent.trim() || 'N/A'; // Título
  const precioTotal = cols[6]?.textContent.trim() || 'N/A'; // Precio total

  // ✅ Paso 7: Armar el mensaje final
  const resultado = `
ID del cliente: ${clienteID}
Order code: ${ordenID}
Fecha: ${fecha}
Servicio: Recarga
Status: ${status}
Destino: ${destino}
Nombre: ${nombre}
Oferta: ${titulo}
Precio total: ${precioTotal}
Solicitud:
  `.trim();

  // ✅ Paso 8: Copiar al portapapeles
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:\n', resultado);
    alert('📋 ¡Todos los datos fueron copiados al portapapeles!. El escalamiento ha sido generado correctamente.');
  }).catch((err) => {
    console.error('❌ ¡Error al copiar al portapapeles!', err);
  });

})();
