// 🔑 Si quieres usar una versión estable, pon aquí el commit. Si es null, usa main automáticamente
const COMMIT_HASH = null; // ej: "a1b2c3d" o null para desarrollo

// Usuario y repositorio
const USUARIO = "lz-migra";
const REPO = "eRa-CRM";

/**
 * Obtiene el último commit de main usando la API de GitHub
 * @returns {Promise<string>} - Hash del último commit
 */
async function obtenerUltimoCommit() {
    const url = `https://api.github.com/repos/${USUARIO}/${REPO}/commits/main`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo obtener el commit");
    const data = await response.json();
    return data.sha; // hash completo del commit
}

/**
 * Convierte raw URL de GitHub a jsDelivr usando un commit fijo
 * @param {string} rawUrl - URL raw de GitHub
 * @param {string} commitHash - hash de commit a usar
 * @returns {string} - URL jsDelivr apuntando al commit
 */
function githubRawToJsDelivr(rawUrl, commitHash) {
    if (!rawUrl.includes("raw.githubusercontent.com")) return null;

    const parts = rawUrl.split("/");
    const usuario = parts[3];
    const repo = parts[4];
    const archivo = parts.includes("refs") ? parts.slice(8).join("/") : parts.slice(6).join("/");

    return `https://cdn.jsdelivr.net/gh/${usuario}/${repo}@${commitHash}/${archivo}`;
}

/**
 * Carga y ejecuta scripts secuenciales desde URLs raw de GitHub
 * @param {string[]} rawUrls - Array de URLs raw
 */
async function cargarScripts(rawUrls) {
    // Decide el commit a usar
    const commitHash = COMMIT_HASH || await obtenerUltimoCommit();

    for (const rawUrl of rawUrls) {
        const jsDelivrUrl = githubRawToJsDelivr(rawUrl, commitHash);
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
    "https://raw.githubusercontent.com/lz-migra/eRa-CRM/refs/heads/main/Project_croNos/Resourses/EjecutorCHAT.js"
];

cargarScripts(rawScripts)
    .then(() => console.log("Todos los scripts cargados 🎉"))
    .catch(err => console.error(err));
