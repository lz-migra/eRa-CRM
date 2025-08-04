(async function () {
  console.log("🚀 Cargando funciones globales...");

  // Helper para cargar scripts en orden
  async function cargarEnOrden(lista) {
    for (const url of lista) {
      console.log(`📦 Cargando: ${url}`);
      await cargarScriptGitHub(url);
    }
  }

  // ========== GLOBAL ==========
  const globalScripts = [
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/getTipoDeTarjeta.js",         // 1
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/MonitorTarjetas.js",          // 2
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/AddRelojes.js",                      // 3
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/detectarNombreAgente.js",            // 4
  ];

  await cargarEnOrden(globalScripts);
  console.log("✅ Funciones globales cargadas.");

  // ========== VOICE ==========
  const voiceScripts = [
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/VOISE/EjecutorVOISE.js",  // 5
  ];

  await cargarEnOrden(voiceScripts);
  console.log("🎙️ Funciones VOICE cargadas.");

  // ========== IVR ==========
  const ivrScripts = [
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/IVR/EjecutorIVR.js",                 // 5
  ];

  await cargarEnOrden(ivrScripts);
  console.log("📞 Funciones IVR cargadas.");

  // ========== CHAT ==========
  const chatScripts = [
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/EjecutorCHAT.js",               // 5
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/CompararMensajeConGuardado.js", // 6
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/MensajesAgenteStorage.js",      // 6
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/UltimoMensajeAgente.js",        // 6
  ];

  await cargarEnOrden(chatScripts);
  console.log("💬 Funciones CHAT cargadas.");

  console.log("✅✅✅ Todos los entornos fueron cargados correctamente.");
})();











