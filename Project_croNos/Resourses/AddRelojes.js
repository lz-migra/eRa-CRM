// 🧠 Esta función busca una tarjeta visible en Twilio según su nombre y le agrega (o actualiza) un reloj estático.
// ⚙️ Opciones disponibles:
//    - nombre: Nombre visible de la tarjeta que deseas modificar. (🎯 Obligatorio)
//    - actualizar: true/false => Si ya tiene reloj, ¿debe reemplazarlo? (por defecto: false)
//    - localStorage: true/false => ¿Debe buscar la hora guardada en localStorage? (por defecto: false)
// ✅ Ejemplo de uso:
//    agregarRelojATarjeta({ nombre: "+1 813-368-8728", actualizar: true, localStorage: false });

window.agregarRelojATarjeta = function ({ nombre, actualizar = false, localStorage: usarStorage = false }) {
  const STORAGE_KEY = 'tarjetas_guardadas';
  const selectorTarjetas = '.Twilio-TaskListBaseItem';

  if (!nombre) {
    console.warn("⚠️ Debes proporcionar un nombre de tarjeta.");
    return;
  }

  // 🧠 Buscar tarjeta visible que coincida con el nombre
  const tarjetas = document.querySelectorAll(selectorTarjetas);
  let tarjetaObjetivo = null;

  tarjetas.forEach(tarjeta => {
    const nombreDOM = tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent?.trim();
    if (nombreDOM === nombre) {
      tarjetaObjetivo = tarjeta;
    }
  });

  if (!tarjetaObjetivo) {
    console.warn(`❌ No se encontró la tarjeta con nombre: "${nombre}"`);
    return;
  }

  const contenedor = tarjetaObjetivo.querySelector('.Twilio-TaskListBaseItem-Content');
  if (!contenedor) {
    console.warn("⚠️ No se encontró el contenedor interno para agregar el reloj.");
    return;
  }

  const relojExistente = tarjetaObjetivo.querySelector('.custom-crono-line');
  if (relojExistente && !actualizar) {
    console.log(`⏱️ La tarjeta "${nombre}" ya tiene reloj y no se solicitó actualizar.`);
    return;
  }

  if (relojExistente && actualizar) {
    contenedor.removeChild(relojExistente);
    console.log(`🔄 Actualizando reloj de la tarjeta "${nombre}"`);
  }

  // 🧩 Crear nuevo reloj
  const reloj = document.createElement('div');
  reloj.className = 'custom-crono-line';
  reloj.style.fontSize = '13px';
  reloj.style.color = '#0066cc';
  reloj.style.marginTop = '4px';
  reloj.style.fontFamily = 'monospace';

  // 🕒 Obtener hora: desde storage o generar nueva
  let horaParaMostrar = null;

  if (usarStorage) {
    try {
      const tarjetasGuardadas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const encontrada = tarjetasGuardadas.find(t => t.nombre === nombre);
      if (encontrada) {
        horaParaMostrar = encontrada.reloj;
        console.log(`✅ Usando hora guardada en localStorage para "${nombre}"`);
      }
    } catch (e) {
      console.warn("⚠️ Error al acceder a localStorage");
    }
  }

  if (!horaParaMostrar) {
    const ahora = new Date();
    const hrs = String(ahora.getHours()).padStart(2, '0');
    const mins = String(ahora.getMinutes()).padStart(2, '0');
    const secs = String(ahora.getSeconds()).padStart(2, '0');
    horaParaMostrar = `🕒 ${hrs}:${mins}:${secs}`;
    console.log(`🆕 Generando hora actual para "${nombre}": ${horaParaMostrar}`);
  }

  reloj.textContent = horaParaMostrar;
  tarjetaObjetivo.style.height = 'auto';
  tarjetaObjetivo.style.overflow = 'visible';
  contenedor.appendChild(reloj);

  console.log(`✅ Reloj agregado a la tarjeta "${nombre}"`);
};
