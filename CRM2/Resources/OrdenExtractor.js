(function () {
  'use strict';

  // 🧠 FUNCIÓN 1: Obtener datos generales desde el panel superior
  function obtenerDatosDesdePanelTitle() {
    const panelTitle = document.querySelector('.panel-title > .row');
    if (!panelTitle) return {};
    const columnas = panelTitle.querySelectorAll('div.col-sm-1 > p');
    return {
      ordenID: columnas[0]?.textContent.trim() || 'N/A',         // Código de orden
      clienteID: columnas[1]?.textContent.trim() || 'N/A',       // ID del cliente
      fecha: columnas[2]?.textContent.trim() || 'N/A',           // Fecha
      estadoOrden: columnas[3]?.textContent.trim() || 'N/A',     // Estado
      montoPagado: columnas[4]?.textContent.trim() || 'N/A',     // Monto total
      tarjeta: columnas[6]?.textContent.trim() || 'N/A'          // Tarjeta usada
    };
  }

  // 🧠 FUNCIÓN 2: Obtener datos de la oferta (segundo panel)
  function obtenerDatosOferta() {
    const ofertaRow = document.querySelector('#accordion-offers .panel.panel-default .panel-title .row');
    if (!ofertaRow) return {};
    const columnas = ofertaRow.querySelectorAll('div[class^="col-xs-"] > p');
    return {
      titulo: columnas[1]?.textContent.trim() || 'N/A',          // Título del producto u oferta
      estado: columnas[3]?.textContent.trim() || 'N/A',          // Estado
      precioListado: columnas[4]?.textContent.trim() || 'N/A',   // Precio listado
      descuento: columnas[5]?.textContent.trim() || 'N/A',       // Descuento
      precioTotal: columnas[6]?.textContent.trim() || 'N/A'      // Precio total final
    };
  }

  // 🧠 FUNCIÓN 3: Obtener índice de una columna según su nombre
  function obtenerIndiceColumnaPorNombre(nombreColumna) {
    const encabezados = document.querySelectorAll('.panel-body table thead tr th');
    for (let i = 0; i < encabezados.length; i++) {
      const texto = encabezados[i].textContent.trim().toLowerCase();
      if (texto === nombreColumna.toLowerCase()) return i;
    }
    return -1; // No se encontró
  }

  // 🧠 FUNCIÓN 4: Obtener datos de la tabla dinámica (topup)
  function obtenerDatosTablaTopup() {
    const filaTopup = document.querySelector('.panel-body table tbody tr');
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

  // 🧠 FUNCIÓN 5: Buscar un valor dinámicamente por etiqueta visible
  function getDatoPorEtiqueta(etiqueta) {
    const elementos = document.querySelectorAll('.panel-body font');
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

  // 🧠 FUNCIÓN 6: Obtener todos los datos del beneficiario (último panel)
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

  // ✅ RECOGER TODOS LOS DATOS USANDO LAS FUNCIONES
  const generales = obtenerDatosDesdePanelTitle();
  const oferta = obtenerDatosOferta();
  const topup = obtenerDatosTablaTopup();
  const beneficiario = obtenerDatosBeneficiario();

  // 🧾 FORMAR TEXTO PLANO CON TODA LA INFORMACIÓN
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

  // 🧾 Mostrar resultado en consola
  console.log(resultado);

  // 📋 OPCIONAL: Copiar al portapapeles automáticamente (descomenta si lo deseas)
  // navigator.clipboard.writeText(resultado);
})();
