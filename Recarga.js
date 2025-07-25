(function () {
  'use strict';

  console.log('[Topup + Oferta + Info Adicional] Script ejecutado');

  // 📌 Verificar si estamos dentro de un bloque expandido
  const panelCollapse = document.querySelector('.panel-collapse');
  const isExpanded = panelCollapse?.classList.contains('in');

  if (!isExpanded) {
    alert('⚠️ El bloque está contraído. Por favor, expándelo para continuar.');
    return;
  }

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

  // 🧠 Funciones para obtener datos generales
  function obtenerDatosDesdePanelTitle() {
    const panelTitle = document.querySelector('.panel-title > .row');
    if (!panelTitle) return null;
    const columnas = panelTitle.querySelectorAll('div.col-sm-1 > p');
    return {
      ordenID: columnas[0]?.textContent.trim() || 'N/A',
      clienteID: columnas[1]?.textContent.trim() || 'N/A',
      fecha: columnas[2]?.textContent.trim() || 'N/A',
    };
  }

  function obtenerDatosDesdeContainerFluid() {
    const contenedor = document.querySelector('.container-fluid > .row + .row');
    if (!contenedor) return null;
    const columnas = contenedor.querySelectorAll('div.col-sm-1 > p.category');
    return {
      ordenID: columnas[0]?.textContent.trim() || 'N/A',
      clienteID: columnas[1]?.textContent.trim() || 'N/A',
      fecha: columnas[2]?.textContent.trim() || 'N/A',
    };
  }

  function obtenerDatosGenerales() {
    return obtenerDatosDesdePanelTitle()
      || obtenerDatosDesdeContainerFluid()
      || { ordenID: 'N/A', clienteID: 'N/A', fecha: 'N/A' };
  }

  // ✅ Paso 1: Obtener datos generales
  const { ordenID, clienteID, fecha } = obtenerDatosGenerales();

  // ✅ Paso 2: Buscar fila principal de la tabla TOPUP
  const filaTopup = document.querySelector('.panel-body table tbody tr');
  if (!filaTopup) {
    alert('❌ No se encontró la tabla Topup. Por favor, extiende la oferta.');
    return;
  }

  const celdas = filaTopup.querySelectorAll('td');

  // ✅ Paso 3: Obtener índices dinámicos
  const idxStatus = obtenerIndiceColumnaPorNombre('status');
  const idxDestino = obtenerIndiceColumnaPorNombre('destino');
  const idxNombre = obtenerIndiceColumnaPorNombre('nombre');

  // ✅ Paso 4: Extraer datos de fila
  const status = celdas[idxStatus]?.textContent.trim() || 'N/A';
  const destino = celdas[idxDestino]?.textContent.trim() || 'N/A';
  const nombre = celdas[idxNombre]?.textContent.trim() || 'N/A';

  // ✅ Paso 5: Obtener info de la oferta
  const ofertaRow = document.querySelector('#accordion-offers .panel-heading .row');
  if (!ofertaRow) {
    alert('❌ No se encontró el bloque de la oferta.');
    return;
  }

  const cols = ofertaRow.querySelectorAll('div.col-xs-1, div.col-xs-2');
  const titulo = cols[1]?.textContent.trim() || 'N/A';
  const precioTotal = cols[6]?.textContent.trim() || 'N/A';

  // ✅ Paso 6: Armar mensaje
  const resultado = `
ID del cliente: ${clienteID}
Order code: ${ordenID}
Fecha: ${fecha}
Servicio: Recarga
Status: ${status}
Destino: ${destino}
Nombre: ${nombre}
Oferta: ${titulo}
Precio Total: ${precioTotal}
Solicitud: 
`.trim();

  // ✅ Paso 7: Copiar al portapapeles
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:\n', resultado);
    alert('📋 ¡Todos los datos fueron copiados al portapapeles!. El escalamiento ha sido generado correctamente.');
  }).catch((err) => {
    console.error('❌ ¡Error al copiar al portapapeles!', err);
  });

})();
