/**
 * Convierte un enlace raw de GitHub a jsDelivr CDN de manera flexible
 * @param {string} rawUrl - URL de raw.githubusercontent.com
 * @returns {string|null} - URL equivalente en jsDelivr o null si no es válido
 */
function githubRawToJsDelivrTurbo(rawUrl) {
    if (!rawUrl.includes("raw.githubusercontent.com")) return null;

    const parts = rawUrl.split("/");

    const usuario = parts[3];
    const repo = parts[4];
    let rama = "";
    let archivo = "";

    // Detectar si tiene "refs/heads"
    if (parts[5] === "refs" && parts[6] === "heads") {
        rama = parts[7];
        archivo = parts.slice(8).join("/");
    } else {
        // URL normal sin "refs/heads"
        rama = parts[5];
        archivo = parts.slice(6).join("/");
    }

    if (!usuario || !repo || !rama || !archivo) return null;

    return `https://cdn.jsdelivr.net/gh/${usuario}/${repo}@${rama}/${archivo}`;
}

/**
 * Carga y ejecuta scripts secuenciales desde URLs raw de GitHub
 * @param {string[]} rawUrls - Array de URLs raw
 * @returns {Promise<void>}
 */
async function cargarScriptsRawTurbo(rawUrls) {
    for (const rawUrl of rawUrls) {
        const jsDelivrUrl = githubRawToJsDelivrTurbo(rawUrl);
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

// Ejemplo de uso:
const rawScriptsTurbo = [
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/MonitorTarjetas.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/AddRelojes.js",
];

cargarScriptsRawTurbo(rawScriptsTurbo)
    .then(() => console.log("Todos los scripts cargados y ejecutados 🎉"))
    .catch(err => console.error(err));
