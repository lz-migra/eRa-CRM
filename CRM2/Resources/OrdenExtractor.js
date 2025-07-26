(function () {
  'use strict';

  // 🧪 Verificación: Asegurarse que el bloque HTML esté disponible
  const bloque = window.bloqueElemento;
  if (!bloque) {
    alert('[OrdenExtractor] \n\n' +
      '❌ Error: No se encontró el bloque expandido.\n' +
      '⚠️ No se pudo identificar la orden con la que estás trabajando.\n' +
      '✔️ Asegúrate de haber desplegado correctamente la orden o verifica tu conexión de red antes de volver a intentarlo.');
    return;
  }

  // 🔍 Extraer datos desde el panel principal
  function obtenerDatosDesdePanelTitle() {
    const panelTitle = bloque.querySelector('.panel-title > .row');
    if (!panelTitle) return {};
    const columnas = panelTitle.querySelectorAll('div.col-sm-1 > p');
    return {
      ordenID: columnas[0]?.textContent.trim() || 'N/A',
      clienteID: columnas[1]?.textContent.trim() || 'N/A',
      fecha: columnas[2]?.textContent.trim() || 'N/A',
      estadoOrden: columnas[3]?.textContent.trim() || 'N/A',
      montoPagado: columnas[4]?.textContent.trim() || 'N/A',
      tarjeta: columnas[6]?.textContent.trim() || 'N/A'
    };
  }

  // 📦 Extraer datos de la oferta
  function obtenerDatosOferta() {
    const ofertaRow = bloque.querySelector('#accordion-offers .panel.panel-default .panel-title .row');
    if (!ofertaRow) return {};
    const columnas = ofertaRow.querySelectorAll('div[class^="col-xs-"] > p');
    return {
      titulo: columnas[1]?.textContent.trim() || 'N/A',
      estado: columnas[3]?.textContent.trim() || 'N/A',
      precioListado: columnas[4]?.textContent.trim() || 'N/A',
      descuento: columnas[5]?.textContent.trim() || 'N/A',
      precioTotal: columnas[6]?.textContent.trim() || 'N/A'
    };
  }

  // 🔢 Buscar índice de una columna específica
  function obtenerIndiceColumnaPorNombre(nombreColumna) {
    const encabezados = bloque.querySelectorAll('.panel-body table thead tr th');
    for (let i = 0; i < encabezados.length; i++) {
      if (encabezados[i].textContent.trim().toLowerCase() === nombreColumna.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }

  // 📊 Extraer datos de la tabla TopUp
  function obtenerDatosTablaTopup() {
    const filaTopup = bloque.querySelector('.panel-body table tbody tr');
    if (!filaTopup) return {};
    const celdas = filaTopup.querySelectorAll('td');
    return {
      id:        celdas[obtenerIndiceColumnaPorNombre('id')]?.textContent.trim() || 'N/A',
      proveedor: celdas[obtenerIndiceColumnaPorNombre('proveedor')]?.textContent.trim() || 'N/A',
      status:    celdas[obtenerIndiceColumnaPorNombre('status')]?.textContent.trim() || 'N/A',
      operador:  celdas[obtenerIndiceColumnaPorNombre('operador')]?.textContent.trim() || 'N/A',
      destino:   celdas[obtenerIndiceColumnaPorNombre('destino')]?.textContent.trim() || 'N/A',
      nombre:    celdas[obtenerIndiceColumnaPorNombre('nombre')]?.textContent.trim() || 'N/A'
    };
  }

  // 🏷️ Función robusta para capturar valor por etiqueta
  function getDatoPorEtiqueta(etiqueta) {
    const parrafos = bloque.querySelectorAll('.panel-body p');
    for (const p of parrafos) {
      const font = p.querySelector('font');
      if (font && font.textContent.trim().toLowerCase() === etiqueta.toLowerCase() + ':') {
        const datos = [];
        let nodo = font.nextSibling;
        while (nodo) {
          if (nodo.nodeType === Node.TEXT_NODE || nodo.nodeType === Node.ELEMENT_NODE) {
            datos.push(nodo.textContent.trim());
          }
          nodo = nodo.nextSibling;
        }
        return datos.join(' ').trim();
      }
    }
    return 'N/A';
  }

  // 🧾 Extraer datos del beneficiario
  function obtenerDatosBeneficiario() {
    return {
      fechaReparto: getDatoPorEtiqueta('Fecha estimada de entrega'),
      provincia: getDatoPorEtiqueta('Provincia'),
      municipio: getDatoPorEtiqueta('Municipio'),
      direccion: getDatoPorEtiqueta('Direccion'),
      barrio: getDatoPorEtiqueta('Barrio'),
      instrucciones: getDatoPorEtiqueta('Instrucciones'),
      nroReparto: getDatoPorEtiqueta('Nro de Reparto'),
      celular: getDatoPorEtiqueta('Celular'),
      nombre: getDatoPorEtiqueta('Nombre'),
      monto: getDatoPorEtiqueta('Monto'),
      fee: getDatoPorEtiqueta('Fee')
    };
  }

  // 🔗 Consolidar toda la información
  const generales = obtenerDatosDesdePanelTitle();
  const oferta = obtenerDatosOferta();
  const topup = obtenerDatosTablaTopup();
  const beneficiario = obtenerDatosBeneficiario();

  // 🧾 Resultado formateado
  const resultado = `
ID del cliente: ${generales.clienteID}
Order code: ${generales.ordenID}
Fecha de orden: ${generales.fecha}
Estado de la orden: ${generales.estadoOrden}
Monto pagado: ${generales.montoPagado}
Tarjeta utilizada: ${generales.tarjeta}

Título de la oferta: ${oferta.titulo}
Estado de la oferta: ${oferta.estado}
Precio listado: ${oferta.precioListado}
Descuento aplicado: ${oferta.descuento}
Precio total: ${oferta.precioTotal}

ID o FOI: ${topup.id}
Proveedor: ${topup.proveedor}
Status: ${topup.status}
Operador: ${topup.operador}
Destino: ${topup.destino}
Nombre registrado: ${topup.nombre}

Fecha estimada de entrega: ${beneficiario.fechaReparto}
Provincia: ${beneficiario.provincia}
Municipio: ${beneficiario.municipio}
Dirección: ${beneficiario.direccion}
Barrio: ${beneficiario.barrio}
Instrucciones: ${beneficiario.instrucciones}
Número de reparto: ${beneficiario.nroReparto}
Celular: ${beneficiario.celular}
Nombre del beneficiario: ${beneficiario.nombre}
Monto: ${beneficiario.monto}
Fee: ${beneficiario.fee}
`.trim();

  // 🌐 Exponer para otros scripts
  window.datosExtraidos = {
    generales,
    oferta,
    topup,
    beneficiario,
    resultadoTexto: resultado
  };

  // 🖨️ Mostrar en consola
  console.log(resultado);

  // 📋 Copiar al portapapeles (opcional)
  // navigator.clipboard.writeText(resultado);

})();

