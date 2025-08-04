// ==UserScript==
// @name         Cargador de entorno (Carga remota)
// @version      1.5
// @namespace    http://era-crm.local/
// @description  Agrega herramientas
// @author       Lorenzo Navarro (Lz-Migra)
// @match        https://*
// @connect      raw.githubusercontent.com
// @license      MIT
// ==/UserScript==

//============= Descripción =============
// 🧠 Este módulo permite almacenar y gestionar un valor personalizado usando LocalStorage.
// ✅ Si no existe, se solicita al cargar mediante un prompt.
// ✅ Provee acceso directo al valor mediante MiIdentificador()
// 🛠️ Métodos disponibles:
//    - MiIdentificador()          → Devuelve el valor actual
//    - MiIdentificador.ver()      → Muestra el valor en consola
//    - MiIdentificador.editar()   → Solicita nuevo valor
//    - MiIdentificador.resetear() → Borra y vuelve a pedir
//    - MiIdentificador.borrar()   → Borra sin pedir nuevamente
//========================================

//Primera funcion

(function () {
  const CLAVE = "miIdentificador";
  let valorInterno = null;

  // 📥 Inicializa y solicita el valor si no está guardado
  const inicializar = () => {
    valorInterno = localStorage.getItem(CLAVE);
    if (valorInterno) {
      console.log("🔁 Valor cargado desde localStorage:", valorInterno);
    } else {
      console.log("🧪 No se encontró valor, solicitando uno nuevo...");
      pedirNuevoValor();
    }
  };

  // 📝 Pedir nuevo valor
  const pedirNuevoValor = () => {
    const nuevo = prompt("📝 Ingresa Identificador de Entornos:");
    if (nuevo && nuevo.trim() !== "") {
      valorInterno = nuevo.trim();
      localStorage.setItem(CLAVE, valorInterno);
      console.log("✅ Valor guardado correctamente:", valorInterno);
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

  Identificador.editar = () => {
    pedirNuevoValor();
  };

  Identificador.resetear = () => {
    localStorage.removeItem(CLAVE);
    valorInterno = null;
    console.log("♻️ Valor eliminado. Solicitando uno nuevo...");
    pedirNuevoValor();
  };

  Identificador.borrar = () => {
    localStorage.removeItem(CLAVE);
    valorInterno = null;
    console.log("🗑️ Valor eliminado del almacenamiento.");
  };

  // 🚀 Inicializar inmediatamente al cargar
  inicializar();

  // 🌍 Exponer globalmente
  window.MiIdentificador = Identificador;

  console.log(`🧠 Métodos disponibles para MiIdentificador:
- MiIdentificador()          → Devuelve el valor actual
- MiIdentificador.ver()      → Muestra el valor en consola
- MiIdentificador.editar()   → Solicita nuevo valor
- MiIdentificador.resetear() → Borra y vuelve a pedir
- MiIdentificador.borrar()   → Borra sin pedir nuevamente`);
})();

//============= Descripcion =============
// 📦 Esta función permite cargar y ejecutar dinámicamente un script JS desde GitHub (o cualquier URL).
// 🔄 Agrega un parámetro ?nocache=timestamp para evitar que el navegador use una versión en caché.
// ✅ Para usarla: window.cargarScriptGitHub("https://tudominio.github.io/archivo.js")
// 🧠 El script remoto se descarga, se evalúa con Function(), y se ejecuta en el entorno actual.
// ⚠️ Si hay un error de red o en la ejecución, se muestra en consola y en una alerta.
// 🧠 Muestra en consola el nombre del archivo cargado.
//============= Descripcion =============

window.cargarScriptGitHub = function (url) {
  const timestamp = Date.now();                      // 🕒 Usado para evitar caché
  const scriptUrl = `${url}?nocache=${timestamp}`;   // 🔁 URL con timestamp

  // 🧠 Extraemos el nombre del archivo desde la URL
  const nombreArchivo = url.split("/").pop().split("?")[0];

  console.log(`📡 Cargando script desde: ${scriptUrl}`);

  fetch(scriptUrl)
    .then(response => {
      if (!response.ok) throw new Error(`Estado: ${response.status}`);
      return response.text();
    })
    .then(code => {
      try {
        new Function(code)(); // 🧠 Ejecutar el script
        console.log(`✅ Script ejecutado con éxito: ${nombreArchivo}`);
      } catch (e) {
        console.error('❌ Error al ejecutar el script:', e);
      }
    })
    .catch(error => {
      console.error('⚠️ Error al cargar el script:', error);
    });
};

cargarScriptGitHub('https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/pageSelector.js')