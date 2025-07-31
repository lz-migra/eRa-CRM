(function () {
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
          console.log("[deterAgente]✅ Nombre del agente detectado:", nombre);
          clearInterval(intervalo);
          return;
        }
      }
    }
  }

  // Buscar cada 500ms hasta encontrar el nombre
  const intervalo = setInterval(buscarNombre, 500);

  // Detener intento tras 60 segundos si no aparece
  setTimeout(() => clearInterval(intervalo), 60000);
})();
