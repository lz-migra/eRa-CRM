// 🔑 Define aquí el commit de la versión estable
const COMMIT_HASH = "022ee79f20b3ad00e5f258d601235b0b85011e76"; // Reemplaza con el hash del commit estable

/**
 * Convierte un enlace raw de GitHub a jsDelivr usando un commit fijo
 * @param {string} rawUrl - URL de raw.githubusercontent.com
 * @returns {string|null} - URL jsDelivr apuntando al commit
 */
function githubRawToJsDelivrConHash(rawUrl) {
    if (!rawUrl.includes("raw.githubusercontent.com")) return null;

    const parts = rawUrl.split("/");

    const usuario = parts[3];
    const repo = parts[4];
    let archivo = "";

    // Detectar si la URL tiene "refs/heads"
    if (parts[5] === "refs" && parts[6] === "heads") {
        archivo = parts.slice(8).join("/");
    } else {
        archivo = parts.slice(6).join("/");
    }

    if (!usuario || !repo || !archivo) return null;

    return `https://cdn.jsdelivr.net/gh/${usuario}/${repo}@${COMMIT_HASH}/${archivo}`;
}

/**
 * Carga y ejecuta scripts secuenciales desde URLs raw de GitHub usando commit fijo
 * @param {string[]} rawUrls - Array de URLs raw
 * @returns {Promise<void>}
 */
async function cargarScriptsConHash(rawUrls) {
    for (const rawUrl of rawUrls) {
        const jsDelivrUrl = githubRawToJsDelivrConHash(rawUrl);
        if (!jsDelivrUrl) {
            console.warn(`URL inválida: ${rawUrl} ⚠️`);
            continue;
        }

        await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = jsDelivrUrl;
            script.async = false; // asegura ejecución secuencial
            script.onload = () => {
                console.log(`Script cargado: ${jsDelivrUrl} ✅`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Error al cargar script: ${jsDelivrUrl} ❌`);
                reject(new Error(`No se pudo cargar ${jsDelivrUrl}`));
            };
            document.head.appendChild(script);
        });
    }
}

// Ejemplo de uso
const rawScripts = [
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/MonitorTarjetas.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/twilioClockQueue.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/cronoCounter.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/EjecutorCHAT.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/cronoCounter-color.js"
];

cargarScriptsConHash(rawScripts)
    .then(() => console.log("Todos los scripts cargados con commit fijo 🎉"))
    .catch(err => console.error(err));

