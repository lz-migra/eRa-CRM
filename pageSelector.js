(function () {
  const url = window.location.href;

  // ###########################################
  // # Decide en qué entorno se está trabajando #
  // ###########################################

  // Definir Las URL de las paguinas
  const crm2 = `https://crm2-soporte.${MiIdentificador()}.com/`;
  const backOffice = https://dlv-office.${MiIdentificador()}.net/;
  const envios = https://www.${MiIdentificador()}.com/envios/admin/;
  const odoo = ;
  const twilio = ;

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
