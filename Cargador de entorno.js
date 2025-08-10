// ==UserScript==
// @name         Cargador de entorno (Carga remota global)
// @version      2.6
// @namespace    http://era-crm.local/
// @description  Agrega herramientas (identificador global + carga remota expuesto en entorno real)
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

(async function () {
    const CLAVE = "miIdentificador";
    let valorInterno = null;

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

    // 📥 Inicializa el identificador
    valorInterno = await GM_getValue(CLAVE, null);
    if (!valorInterno) {
        await pedirNuevoValor();
    } else {
        console.log("🔁 Valor cargado desde almacenamiento global:", valorInterno);
    }

    // 🌍 Exponer MiIdentificador globalmente
    function MiIdentificador() {
        return valorInterno;
    }

    MiIdentificador.ver = () => {
        console.log("🔍 Valor actual:", valorInterno);
        return valorInterno;
    };

    MiIdentificador.editar = async () => {
        await pedirNuevoValor();
    };

    MiIdentificador.resetear = async () => {
        await GM_deleteValue(CLAVE);
        valorInterno = null;
        console.log("♻️ Valor eliminado. Solicitando uno nuevo...");
        await pedirNuevoValor();
    };

    MiIdentificador.borrar = async () => {
        await GM_deleteValue(CLAVE);
        valorInterno = null;
        console.log("🗑️ Valor eliminado del almacenamiento global.");
    };

    unsafeWindow.MiIdentificador = MiIdentificador;

    // 🌍 Exponer cargarScriptGitHub globalmente (inyección DOM para contexto real)
    unsafeWindow.cargarScriptGitHub = function (url) {
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
                    const s = document.createElement('script');
                    s.textContent = code;
                    document.documentElement.appendChild(s);
                    s.remove();
                    console.log(`✅ Script inyectado globalmente: ${nombreArchivo}`);
                } catch (e) {
                    console.error('❌ Error al inyectar el script:', e);
                }
            })
            .catch(error => {
                console.error('⚠️ Error al cargar el script:', error);
            });
    };

    // 🚀 Cargar script por defecto cuando el DOM esté listo
    window.addEventListener("DOMContentLoaded", () => {
        unsafeWindow.cargarScriptGitHub(
            'https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/pageSelector.js'
        );
    });

    console.log(`✅ Listo. Puedes usar desde consola:
- MiIdentificador()          → Devuelve el valor actual
- MiIdentificador.ver()      → Muestra el valor en consola
- MiIdentificador.editar()   → Solicita nuevo valor
- MiIdentificador.resetear() → Borra y vuelve a pedir
- MiIdentificador.borrar()   → Borra sin pedir nuevamente

- cargarScriptGitHub("https://...")`);
})();
