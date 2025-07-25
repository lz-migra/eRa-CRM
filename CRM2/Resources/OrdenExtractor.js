(function () {
  'use strict';

  // 🧪 Verificación: Asegurarse que el bloque HTML esté disponible
  const bloque = window.bloqueElemento;
  if (!bloque) {
    alert('No se encontró el bloque expandido. Asegúrate de ejecutar primero IdentificadorHTML.js');
    return;
  }

  // 🔧 Reemplazo de todas las funciones para trabajar sobre el `bloque` capturado

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

  function obtenerIndiceColumnaPorNombre(nombreColumna) {
    const encabezados = bloque.querySelectorAll('.panel-body table thead tr th');
    for (let i = 0; i < encabezados.length; i++) {
      if (encabezados[i].textContent.trim().toLowerCase() === nombreColumna.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }

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

  function getDatoPorEtiqueta(etiqueta) {
    const elementos = bloque.querySelectorAll('.panel-body font');
    for (const font of elementos) {
      const label = font.textContent.trim().replace(':', '');
      if (label.toLowerCase() === etiqueta.toLowerCase()) {
        const siguienteNodo = font.nextSibling;
        if (siguienteNodo && siguienteNodo.nodeType === Node.TEXT_NODE) {
          return siguienteNodo.textContent.trim();
        }
      }
    }
    return 'N/A';
  }

  function obtenerDatosBeneficiario() {
    return {
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

  // ✅ Ejecutar y unir toda la información
  const generales = obtenerDatosDesdePanelTitle();
  const oferta = obtenerDatosOferta();
  const topup = obtenerDatosTablaTopup();
  const beneficiario = obtenerDatosBeneficiario();

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

  // Mostrar en consola
  console.log(resultado);

  // ✅ Exponer resultado globalmente para otros scripts
  window.resultadoDatosExtraidos = resultado;

  // (Opcional) Copiar al portapapeles
  // navigator.clipboard.writeText(resultado);
})();
