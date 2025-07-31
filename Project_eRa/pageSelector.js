(function () {
  const url = window.location.href;

  // ###########################################
  // # Decide en qué entorno se está trabajando #
  // ###########################################

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
          console.log('✅ Script cargado con éxito.');
        } catch (e) {
          console.error('❌ Error al ejecutar el script:', e);
        }
      })
      .catch(error => {
        alert(`⚠️ Error al cargar el script.\n${error}`);
        console.error(error);
      });
  };

  // Expresiones regulares para ocultar dominios explícitos
  const crm2Regex = /^https:\/\/crm2-soporte\.[^\/]+/;
  const backOfficeRegex = /^https:\/\/dlv-office\.[^\/]+/;

  if (crm2Regex.test(url)) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_eRa/CRM2/Main.js");
    console.log(`Entorno CRM2 detectado`);
  } else if (backOfficeRegex.test(url)) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_eRa/BackOffice/Main.js");
    console.log(`Entorno BackOffice detectado`);
  } else {
    console.warn("🌐 No se reconoce el entorno para cargar un script automáticamente.");
  }
})();
