//============= Descripción =============
// 🔍 Esta función compara el mensaje actual del agente con el mensaje guardado en localStorage.
// ✅ Devuelve `true` si son iguales, `false` si son distintos o si falta algún dato.
//    Los valores que devuelve son Boleanos.
// 🧪 También imprime en consola el resultado de la comparación.
//============= Descripción =============

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