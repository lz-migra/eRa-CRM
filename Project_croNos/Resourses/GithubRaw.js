//============= Descripcion =============
// 📦 Esta función permite cargar y ejecutar dinámicamente un script JS desde GitHub (o cualquier URL).
// 🔄 Agrega un parámetro ?nocache=timestamp para evitar que el navegador use una versión en caché.
// ✅ Para usarla: window.cargarScriptGitHub("https://tudominio.github.io/archivo.js")
// 🧠 El script remoto se descarga, se evalúa con Function(), y se ejecuta en el entorno actual.
// ⚠️ Si hay un error de red o en la ejecución, se muestra en consola y en una alerta.
//=======================================

window.cargarScriptGitHub = function (url) {
  const timestamp = Date.now();                       // 🕒 Usado para evitar caché
  const scriptUrl = `${url}?nocache=${timestamp}`;    // 🔁 URL con marca de tiempo

  console.log(`Cargando script desde: ${scriptUrl}`);

  fetch(scriptUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Estado: ${response.status}`); // 🚫 Error de red
      return response.text(); // 📥 Leer el contenido JS
    })
    .then(code => {
      try {
        new Function(code)();                         // 🧠 Ejecutar el script cargado
        console.log('✅ Script ejecutado con éxito.');
      } catch (e) {
        console.error('❌ Error al ejecutar el script:', e); // 🚨 Error al ejecutar
      }
    })
    .catch(error => {
//      alert(`⚠️ Error al cargar el script.\n${error}`);     // 🚨 Mostrar alerta
      console.error(error);                                // 🪵 Mostrar en consola
    });
};

// 📌 Puedes llamar esta función de dos formas:
//    window.cargarScriptGitHub("url") ✅ Siempre funciona (más seguro)
//    cargarScriptGitHub("url") ✅ También funciona si estás en contexto global
