(function () {
  const url = window.location.href;

//              ###########################################
//              # Decide en que entorno se esa trabajando #
//              ###########################################

  // Función ya definida para cargar scripts desde GitHub
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

  // Lógica para decidir qué script ejecutar según el dominio
  if (url.startsWith("https://crm2-soporte.cuballama.com/")) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/CRM2/Main.js");
  } else if (url.startsWith("https://dlv-office.cuballama.net/")) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/CRM2/Mercado/Main.js");
  } else {
    console.warn("🌐 No se reconoce el dominio para cargar un script automáticamente.");
  }
})();
