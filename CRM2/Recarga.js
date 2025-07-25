(function () {
  'use strict';

  // Definir datos
  const { generales, oferta, topup, beneficiario } = window.datosExtraidos;

  // 🔢 Datos generales
  const ordenID       = generales.ordenID;
  const clienteID     = generales.clienteID;
  const fecha         = generales.fecha;
  const estadoOrden   = generales.estadoOrden;
  const montoPagado   = generales.montoPagado;
  const tarjeta       = generales.tarjeta;

  // 🎁 Datos de oferta
  const tituloOferta     = oferta.titulo;
  const estadoOferta     = oferta.estado;
  const precioListado    = oferta.precioListado;
  const descuento        = oferta.descuento;
  const precioTotal      = oferta.precioTotal;

  // 📦 Datos Topup
  const idTopup     = topup.id;
  const proveedor   = topup.proveedor;
  const status      = topup.status;
  const operador    = topup.operador;
  const destino     = topup.destino;
  const nombreTopup = topup.nombre;

  // 👤 Datos del beneficiario
  const provincia     = beneficiario.provincia;
  const municipio     = beneficiario.municipio;
  const direccion     = beneficiario.direccion;
  const barrio        = beneficiario.barrio;
  const instrucciones = beneficiario.instrucciones;
  const nroReparto    = beneficiario.nroReparto;
  const celular       = beneficiario.celular;
  const nombre        = beneficiario.nombre;
  const monto         = beneficiario.monto;
  const fee           = beneficiario.fee;

  // ✅ Plantilla final
  const resultado = `
ID del cliente: ${clienteID}
Order code: ${ordenID}
Fecha: ${fecha}
Servicio: Recarga
Status: ${status}
Destino: ${destino}
Nombre: ${nombre}
Celular: ${celular}
Provincia: ${provincia}
Municipio: ${municipio}
Dirección: ${direccion}, Barrio: ${barrio}, Reparto: ${nroReparto}
Instrucciones: ${instrucciones}

💳 Pago:
Tarjeta: ${tarjeta}
Monto pagado: ${montoPagado}
Fee: ${fee}

🎁 Oferta:
Título: ${tituloOferta}
Estado de la oferta: ${estadoOferta}
Precio listado: ${precioListado}
Descuento: ${descuento}
Precio total: ${precioTotal}

📌 Solicitud:
Por favor, revisar el estado del topup con ID: ${idTopup} correspondiente al operador: ${operador} y proveedor: ${proveedor}.
`.trim();

  // ✅ Copiar al portapapeles
  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:\n', resultado);
    alert('📋 ¡Todos los datos fueron copiados al portapapeles!. El escalamiento ha sido generado correctamente.');
  }).catch((err) => {
    console.error('❌ ¡Error al copiar al portapapeles!', err);
  });

})();
