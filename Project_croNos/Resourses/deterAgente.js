function detectarNombreAgente(opciones = {}) {
  const {
    intervaloMs = 500,     // ⏱️ Intervalo entre intentos
    tiempoMaxMs = 60000,   // ⌛ Tiempo máximo para intentar
    onDetectado = null     // 🎯 Callback cuando se detecta el nombre
  } = opciones;

  const regexNombre = /User\s(.+?)\. Click for option to log out\./;

  function buscarNombre() {
    const elementos = document.querySelectorAll('[title], [aria-label]');
    for (const el of elementos) {
      const attr = el.getAttribute('title') || el.getAttribute('aria-label');
      if (attr && regexNombre.test(attr)) {
        const match = regexNombre.exec(attr);
        if (match && match[1]) {
          const nombre = match[1].trim();
          window.AGENT_NAME = nombre;
          console.log("[detectarNombreAgente] ✅ Nombre detectado:", nombre);
          clearInterval(intervalo);
          if (typeof onDetectado === 'function') {
            onDetectado(nombre);
          }
          return;
        }
      }
    }
  }

  const intervalo = setInterval(buscarNombre, intervaloMs);
  setTimeout(() => clearInterval(intervalo), tiempoMaxMs);
}

// 🌍 Exponer como función global
window.detectarNombreAgente = detectarNombreAgente;
