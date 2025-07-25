(function () {
  'use strict';

  // 🔁 Cargar un script y ejecutar un callback cuando termine
  function cargarScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    script.onerror = () => console.error(`❌ Error al cargar ${url}`);
    document.head.appendChild(script);
  }

  // 🧠 Cargar el primer script, luego el segundo
  cargarScript('https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/CRM2/Resources/IdentificadorHTML.js', function () {
    console.log('✅ IdentificadorHTML.js cargado');

    cargarScript('https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/CRM2/Resources/OrdenExtractor.js', function () {
      console.log('✅ OrdenExtractor.js cargado y ejecutado');

      // ✅ Esperar que window.datosExtraidos esté disponible
      if (!window.datosExtraidos) {
        alert('❌ datosExtraidos no está definido. Asegúrate de que OrdenExtractor.js funcione correctamente.');
        return;
      }

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

      // ✅ Plantilla
      const resultado = `
ID del cliente: ${clienteID}
Order code: ${ordenID}
Servicio: Recarga
Status: ${status}
solicitud: 
`.trim();

      // ✅ Copiar al portapapeles
      navigator.clipboard.writeText(resultado).then(() => {
        console.log('✅ Información copiada al portapapeles:\n', resultado);
        alert('📋 ¡Todos los datos fueron copiados al portapapeles!. El escalamiento ha sido generado correctamente.');
      }).catch((err) => {
        console.error('❌ ¡Error al copiar al portapapeles!', err);
      });
    });
  });

})();
