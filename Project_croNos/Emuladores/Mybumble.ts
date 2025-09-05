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
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/getTipoDeTarjeta.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Project_croNos/Resourses/otroArchivo.js"
], "miBundle.js"); // Nombre del archivo final
