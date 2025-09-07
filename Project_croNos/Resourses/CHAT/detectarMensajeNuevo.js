necesio integrar toda esta logina en un solo script

no puedo usar funciones globales asi que pense en usar un setinverval para validar ell esado de una varible global y ejecutar aciones de manera interna

function CompararMensajeConGuardado() {
  const STORAGE_KEY = 'mensajes_agente_por_tarjeta'; // 🗂️ Clave del almacenamiento

  // 🧠 Obtener el encabezado (nombre de la tarjeta activa)
  const encabezado = document.querySelector('.Twilio-TaskCanvasHeader-Name span')?.innerText?.trim();
  if (!encabezado) {
    console.warn('⚠️ No se pudo obtener el nombre de la tarjeta activa');
    return false;
  }

  // 💬 Obtener el mensaje actual desde UltimoMensajeAgente()
  const mensajeActual = UltimoMensajeAgente();
  if (!mensajeActual) {
    console.warn('⚠️ No se pudo obtener el mensaje actual del agente');
    return false;
  }

  // 📤 Cargar datos guardados desde localStorage
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const guardado = data[encabezado]?.mensaje;

  if (!guardado) {
    console.warn(`📭 No se encontró un mensaje guardado para la tarjeta: "${encabezado}"`);
    return false;
  }

  // 🔁 Comparar mensajes
  const iguales = mensajeActual === guardado;

  if (iguales) {
    console.log(`✅ El mensaje actual coincide con el guardado para "${encabezado}"`);
  } else {
    console.log(`❌ El mensaje actual es diferente al guardado para "${encabezado}"`);
    console.log('🆕     Actual:', mensajeActual);
    console.log('📦   Guardado:', guardado);
  }

  return iguales;
}

