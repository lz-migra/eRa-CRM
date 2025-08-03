//============= Descripcion =============
// 🧠 Esta función intenta detectar automáticamente el nombre del agente (user logueado) en la interfaz.
// 🔍 Escanea los atributos 'title' y 'aria-label' en el DOM buscando un texto como: "User Lorenzo Navarro. Click for option to log out."
// 📦 Al detectar el nombre, lo guarda en window.AGENT_NAME y llama al callback si se proporciona.
// ⚙️ Opcionalmente puedes configurar el intervalo de búsqueda, el tiempo máximo y un callback con:
//    detectarNombreAgente({ intervaloMs: 300, tiempoMaxMs: 10000, onDetectado: (nombre) => { ... } })
//============= Descripcion =============

function detectarNombreAgente(opciones = {}) {
  const {
    intervaloMs = 500,     // ⏱️ Intervalo entre intentos de escaneo (por defecto: 500ms)
    tiempoMaxMs = 60000,   // ⌛ Tiempo máximo que se intentará detectar (por defecto: 60s)
    onDetectado = null     // 🎯 Función que se ejecutará cuando se detecte el nombre
  } = opciones;

  const regexNombre = /User\s(.+?)\. Click for option to log out\./; // 🧩 Patrón para extraer el nombre

  // 🔄 Función que busca el nombre del agente en el DOM
  function buscarNombre() {
    const elementos = document.querySelectorAll('[title], [aria-label]'); // 🔍 Elementos con posibles textos útiles

    for (const el of elementos) {
      const attr = el.getAttribute('title') || el.getAttribute('aria-label');
      if (attr && regexNombre.test(attr)) {
        const match = regexNombre.exec(attr); // 🧪 Ejecutar regex

        if (match && match[1]) {
          const nombre = match[1].trim(); // ✂️ Limpiar el nombre extraído

          window.AGENT_NAME = nombre;     // 💾 Guardar como variable global
          console.log("[detectarNombreAgente] ✅ Nombre detectado:", nombre);

          clearInterval(intervalo);       // 🛑 Detener intervalo cuando se detecta
          if (typeof onDetectado === 'function') {
            onDetectado(nombre);          // 🎯 Ejecutar callback si se definió
          }
          return;
        }
      }
    }
  }

  // 🕵️ Iniciar escaneo cada X milisegundos
  const intervalo = setInterval(buscarNombre, intervaloMs);

  // ⏳ Detener escaneo después del tiempo máximo
  setTimeout(() => clearInterval(intervalo), tiempoMaxMs);
}

// 🌍 Exponer como función global
window.detectarNombreAgente = detectarNombreAgente;
