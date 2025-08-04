// ==UserScript==
// @name         Cargador de entorno (Carga remota)
// @version      1.5
// @namespace    http://era-crm.local/
// @description  Agrega herramientas
// @author       Lorenzo Navarro (Lz-Migra)
// @match        https://*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
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
    const nuevo = prompt("📝 Ingresa el valor que deseas guardar:");
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
})();
