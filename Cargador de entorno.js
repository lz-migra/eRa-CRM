// ==UserScript==
// @name         Cargador de entorno (Carga remota)
// @version      2.0
// @namespace    http://era-crm.local/
// @description  Agrega herramientas (identificador global + carga remota)
// @author       Lorenzo Navarro (Lz-Migra)
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      raw.githubusercontent.com
// @license      MIT
// @run-at       document-start
// ==/UserScript==

//============= Descripción =============
// 🧠 Este módulo permite almacenar y gestionar un valor personalizado usando almacenamiento GLOBAL de Tampermonkey.
// ✅ El valor se solicita solo una vez, sin importar el dominio.
// ✅ Provee acceso directo al valor mediante MiIdentificador()
// 🛠️ Métodos disponibles:
//    - MiIdentificador()          → Devuelve el valor actual
//    - MiIdentificador.ver()      → Muestra el valor en consola
//    - MiIdentificador.editar()   → Solicita nuevo valor
//    - MiIdentificador.resetear() → Borra y vuelve a pedir
//    - MiIdentificador.borrar()   → Borra sin pedir nuevamente
//========================================

(function () {
  if (window.MiIdentificador) return; // 🛡️ Evita múltiples ejecuciones

  const CLAVE = "miIdentificador";
  let valorInterno = null;

  // 📥 Inicializa: intenta cargar desde almacenamiento global
  const inicializar = async () => {
    valorInterno = await GM_getValue(CLAVE, null);
    if (valorInterno) {
      console.log("🔁 Valor cargado desde almacenamiento global:", valorInterno);
    } else {
      console.log("🧪 No se encontró valor, solicitando uno nuevo...");
      await pedirNuevoValor();
    }
  };

  // 📝 Pedir nuevo valor
  const pedirNuevoValor = async () => {
    const nuevo = prompt("📝 Ingresa Identificador de Entornos:");
    if (nuevo && nuevo.trim() !== "") {
      valorInterno = nuevo.trim();
      await GM_setValue(CLAVE, valorInterno);
      console.log("✅ Valor guardado globalmente:", valorInterno);
    } else {
      console.warn("⚠️ No se ingresó un valor válido.");
    }
  };

  // 🏗️ Función principal que devuelve el valor actual
  function Identificador() {
    return valorInterno;
  }

  // 🧩 Métodos públicos
  Identificador.ver = () => {
    console.log("🔍 Valor actual:", valorInterno);
    return valorInterno;
  };

  Identificador.editar = async () => {
    await pedirNuevoValor();
  };

  Identificador.resetear = async () => {
    await GM_deleteValue(CLAVE);
    valorInterno = null;
    console.log("♻️ Valor eliminado. Solicitando uno nuevo...");
    await pedirNuevoValor();
  };

  Identificador.borrar = async () => {
    await GM_deleteValue(CLAVE);
    valorInterno = null;
    console.log("🗑️ Valor eliminado del almacenamiento global.");
  };

  // 🌍 Exponer globalmente
  window.MiIdentificador = Identificador;

  // 🚀 Inicializar (async, no se puede usar await aquí directamente)
  inicializar();

  console.log(`🧠 Métodos disponibles para MiIdentificador:
- MiIdentificador()          → Devuelve el valor actual
- MiIdentificador.ver()      → Muestra el valor en consola
- MiIdentificador.editar()   → Solicita nuevo valor
- MiIdentificador.resetear() → Borra y vuelve a pedir
- MiIdentificador.borrar()   → Borra sin pedir nuevamente`);
})();

//============= Descripción =============
// 📦 Esta función permite cargar y ejecutar dinámicamente un script JS desde GitHub (o cualquier URL).
// 🔄 Agrega un parámetro ?nocache=timestamp para evitar que el navegador use una versión en caché.
// ✅ Para usarla: window.cargarScriptGitHub("https://tudominio.github.io/archivo.js")
// 🧠 El script remoto se descarga, se evalúa con Function(), y se ejecuta en el entorno actual.
// ⚠️ Si hay un error de red o en la ejecución, se muestra en consola y en una alerta.
//============= ==========================

window.cargarScriptGitHub = function (url) {
  const timestamp = Date.now();
  const scriptUrl = `${url}?nocache=${timestamp}`;
  const nombreArchivo = url.split("/").pop().split("?")[0];

  console.log(`📡 Cargando script desde: ${scriptUrl}`);

  fetch(scriptUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Estado: ${response.status}`);
      return response.text();
    })
    .then(code => {
      try {
        new Function(code)();
        console.log(`✅ Script ejecutado con éxito: ${nombreArchivo}`);
      } catch (e) {
        console.error('❌ Error al ejecutar el script:', e);
      }
    })
    .catch(error => {
      console.error('⚠️ Error al cargar el script:', error);
    });
};

// 🛰️ Cargar script remoto principal
cargarScriptGitHub('https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/pageSelector.js');
