(function () {
  const url = window.location.href;

  // 🧠 Verificamos que MiIdentificador esté definido
  if (typeof MiIdentificador !== "function" || !MiIdentificador()) {
    console.warn("⚠️ Identificador no definido. Asegúrate de cargar primero el entorno.");
    return;
  }

  const ID = MiIdentificador();

  // ###########################################
  // #    Decide en qué entorno se trabaja     #
  // ###########################################

  // 🌐 Definir las URLs base
  const crm2 = `https://crm2-soporte.${ID}.com/`;
  const backOffice = `https://dlv-office.${ID}.net/`;
  const envios = `https://www.${ID}.com/envios/admin/`;
  const odoo = `https://odoo.${ID}.com/`;
  const twilio = `https://flex.twilio.com/`;
  const localhost = `http://localhost:8000/`; // ⚡ Nuevo entorno local

  // 🚀 Cargar scripts según el entorno detectado
  if (url.startsWith(crm2)) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_eRa/CRM2/Main.js");
    console.log("🌐 Entorno CRM2 detectado");

  } else if (url.startsWith(backOffice)) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_eRa/BackOffice/Main.js");
    console.log("🌐 Entorno BackOffice detectado");

  } else if (url.startsWith(envios)) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_eRa/Envios/Main.js");
    console.log("🌐 Entorno Envíos detectado");

  } else if (url.startsWith(odoo)) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_eRa/Odoo/Main.js");
    console.log("🌐 Entorno Odoo detectado");

  } else if (url.startsWith(twilio)) {
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/CargadorEntornoTwilio.js");
    console.log("🌐 Entorno Twilio detectado");

  } else if (url.startsWith(localhost)) {
    // 🏠 Entorno de desarrollo local
    window.cargarScriptGitHub("https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/CargadorEntornoTwilio.js");
    console.log("🏠 Entorno Localhost detectado");

  } else {
    console.warn("🌐 No se reconoce el entorno. No se cargó ningún script.");
  }
})();


