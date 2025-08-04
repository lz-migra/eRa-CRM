//============= Descripcion =============
// 🧠 Esta función detecta automáticamente el nombre del agente en la interfaz,
//    y lo guarda en window.AGENT_NAME y también en localStorage como respaldo.
// 🧩 Escanea atributos 'title' y 'aria-label' buscando: "User "Nombre de agente". Click for option to log out."
// 💾 Si no logra detectarlo en el tiempo asignado, intentará restaurarlo desde localStorage.
//============= Descripcion =============

function detectarNombreAgente(opciones = {}) {
  const {
    intervaloMs = 500,     // ⏱️ Intervalo entre intentos de escaneo
    tiempoMaxMs = 60000,   // ⌛ Tiempo máximo que se intentará detectar
    onDetectado = null     // 🎯 Callback al detectar el nombre
  } = opciones;

  const regexNombre = /User\s(.+?)\. Click for option to log out\./; // 🧩 Patrón para extraer el nombre
  const CLAVE_STORAGE = 'nombre_agente_guardado'; // 🔐 Clave para almacenamiento local

  // 🔄 Función que busca el nombre del agente en el DOM
  function buscarNombre() {
    const elementos = document.querySelectorAll('[title], [aria-label]');

    for (const el of elementos) {
      const attr = el.getAttribute('title') || el.getAttribute('aria-label');
      if (attr && regexNombre.test(attr)) {
        const match = regexNombre.exec(attr);

        if (match && match[1]) {
          const nombre = match[1].trim();

          window.AGENT_NAME = nombre; // 💾 Variable global
          localStorage.setItem(CLAVE_STORAGE, nombre); // 💾 Guardar respaldo local
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

  // 🕵️ Iniciar escaneo cada X milisegundos
  const intervalo = setInterval(buscarNombre, intervaloMs);

  // ⏳ Detener escaneo después del tiempo máximo y restaurar desde localStorage si es necesario
  setTimeout(() => {
    clearInterval(intervalo);

    if (!window.AGENT_NAME) {
      const nombreGuardado = localStorage.getItem(CLAVE_STORAGE);
      if (nombreGuardado) {
        window.AGENT_NAME = nombreGuardado;
        console.warn("[detectarNombreAgente] ⚠️ Nombre no detectado, restaurado desde localStorage:", nombreGuardado);

        if (typeof onDetectado === 'function') {
          onDetectado(nombreGuardado);
        }
      } else {
        console.error("[detectarNombreAgente] ❌ No se pudo detectar ni restaurar el nombre del agente.");
      }
    }
  }, tiempoMaxMs);
}

// 🌍 Exponer como función global
window.detectarNombreAgente = detectarNombreAgente;
