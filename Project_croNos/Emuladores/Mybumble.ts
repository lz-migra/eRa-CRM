// 📌 Función para descargar varios JS desde GitHub RAW y unirlos
async function unirScriptsGitHub(urls, nombreArchivo = "bundle.js") {
    try {
        let bundle = "";

        // 🔄 Descargar cada archivo en orden
        for (let url of urls) {
            console.log("⬇️ Descargando:", url);
            const resp = await fetch(url);
            const codigo = await resp.text();

            // 📌 Comentario para identificar cada script
            bundle += `\n\n// ===== Archivo: ${url} =====\n\n` + codigo;
        }

        // 📦 Crear un blob con el contenido final
        const blob = new Blob([bundle], { type: "text/javascript" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;

        // 💾 Simular clic para descargar
        link.click();

        console.log("✅ Bundle generado y descargado:", nombreArchivo);
    } catch (e) {
        console.error("❌ Error uniendo scripts:", e);
    }
}

// 🛠 Ejemplo de uso con tus scripts de GitHub RAW
unirScriptsGitHub([
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/getTipoDeTarjeta.js",         // 1
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/MonitorTarjetas.js",          // 2
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/AddRelojes.js",                      // 3
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/detectarNombreAgente.js",

    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/VOISE/EjecutorVOISE.js",  // 5

    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/IVR/EjecutorIVR.js",                 // 5

    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/EjecutorCHAT.js",               // 5
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/CompararMensajeConGuardado.js", // 6
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/MensajesAgenteStorage.js",      // 6
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/UltimoMensajeAgente.js"        // 6

], "miBundle.js"); // Nombre del archivo final


// 📌 Función para descargar, unir y ejecutar scripts desde GitHub RAW
async function unirYejecutarScriptsGitHub(urls, nombreArchivo = "bundle.js") {
    try {
        let bundle = "";

        // 🔄 Descargar cada archivo en orden
        for (let url of urls) {
            console.log("⬇️ Descargando:", url);
            const resp = await fetch(url);
            const codigo = await resp.text();

            // 📌 Agregar separador con nombre del archivo
            bundle += `\n\n// ===== Archivo: ${url} =====\n\n` + codigo;
        }

        // 🛠 1) Ejecutar el bundle directamente en la página
        const script = document.createElement("script");
        script.textContent = bundle;
        document.head.appendChild(script);
        console.log("🚀 Bundle ejecutado en la página");

        // 💾 2) Descargar el bundle como archivo .js
        const blob = new Blob([bundle], { type: "text/javascript" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = nombreArchivo;
        link.click();

        console.log("✅ Bundle generado y descargado:", nombreArchivo);
    } catch (e) {
        console.error("❌ Error uniendo scripts:", e);
    }
}

// 🛠 Ejemplo de uso
unirYejecutarScriptsGitHub([
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/getTipoDeTarjeta.js",         // 1
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/MonitorTarjetas.js",          // 2
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/AddRelojes.js",                      // 3
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/detectarNombreAgente.js",

    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/VOISE/EjecutorVOISE.js",  // 5

    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/IVR/EjecutorIVR.js",                 // 5

    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/EjecutorCHAT.js",               // 5
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/CompararMensajeConGuardado.js", // 6
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/MensajesAgenteStorage.js",      // 6
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/CHAT/UltimoMensajeAgente.js"        // 6

], "miBundle.js");
