// ==UserScript==
// @name         Cargador de entorno (Carga remota)
// @version      2.2
// @namespace    http://era-crm.local/
// @description  Agrega herramientas (identificador global + carga remota)
// @author       Lorenzo Navarro
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      raw.githubusercontent.com
// @license      MIT
// @run-at       document-start
// ==/UserScript==

(function () {
  if (unsafeWindow.MiIdentificador) return; // 🛡️ Evita múltiples ejecuciones

  const CLAVE = "miIdentificador";
  let valorInterno = null;

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

  const inicializar = async () => {
    valorInterno = await GM_getValue(CLAVE, null);
    if (valorInterno) {
      console.log("🔁 Valor cargado desde almacenamiento global:", valorInterno);
    } else {
      console.log("🧪 No se encontró valor, solicitando uno nuevo...");
      await pedirNuevoValor();
    }

    function Identificador() {
      if (valorInterno === null) {
        console.warn("⏳ Identificador aún no está listo.");
      }
      return valorInterno;
    }

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

    // 🌍 Exponer al contexto real de la página
    unsafeWindow.MiIdentificador = Identificador;

    console.log(`🧠 Métodos disponibles para MiIdentificador:
- MiIdentificador()          → Devuelve el valor actual
- MiIdentificador.ver()      → Muestra el valor en consola
- MiIdentificador.editar()   → Solicita nuevo valor
- MiIdentificador.resetear() → Borra y vuelve a pedir
- MiIdentificador.borrar()   → Borra sin pedir nuevamente`);
  };

  inicializar();
})();


//============= Descripción =============
// 📦 Carga y ejecuta dinámicamente un script JS desde GitHub (o cualquier URL).
// 🔄 Agrega ?nocache=timestamp para evitar caché.
// ✅ Uso: window.cargarScriptGitHub("https://tudominio.github.io/archivo.js")
// ⚠️ Si hay error de red o ejecución, lo informa en consola.
//========================================

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

// 🛰️ Cargar script principal remoto
cargarScriptGitHub('https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/pageSelector.js');
