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
