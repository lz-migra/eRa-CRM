// 📦 Esta función permite cargar y ejecutar dinámicamente un script JS desde GitHub (o cualquier URL).
// 🔄 Agrega un parámetro ?nocache=timestamp para evitar que el navegador use una versión en caché.
// ✅ Para usarla: window.cargarScriptGitHub("https://tudominio.github.io/archivo.js")
// 🧠 El script remoto se descarga, se evalúa con Function(), y se ejecuta en el entorno actual.
// ⚠️ Si hay un error de red o en la ejecución, se muestra en consola y en una alerta.


window.cargarScriptGitHub = function (url) {
    const timestamp = Date.now();
    const scriptUrl = `${url}?nocache=${timestamp}`;

    console.log(`Cargando script desde: ${scriptUrl}`);

    fetch(scriptUrl)
        .then(response => {
            if (!response.ok) throw new Error(`Estado: ${response.status}`);
            return response.text();
        })
        .then(code => {
            try {
                new Function(code)(); // Ejecuta el script cargado
                console.log('✅ Script ejecutado con éxito.');
            } catch (e) {
                console.error('❌ Error al ejecutar el script:', e);
            }
        })
        .catch(error => {
            alert(`⚠️ Error al cargar el script.\n${error}`);
            console.error(error);
        });
};
