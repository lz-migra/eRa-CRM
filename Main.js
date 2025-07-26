(function () {
  'use strict';

  // =========================
  // 🧾 1. ESTILOS DE LA BARRA
  // =========================

  const style = document.createElement('style');
  style.textContent = `
    #custom-bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #ffffff;
        padding: 6px 15px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 15px;
        border-top: 1px solid #e0e0e0;
        box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 13px;
    }

    #custom-bottom-bar span.section-label {
        font-weight: bold;
        margin-right: 8px;
    }

    #custom-bottom-bar .button-group {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    #custom-bottom-bar a.custom-button {
        color: #333;
        text-decoration: none;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        transition: background-color 0.2s, color 0.2s;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    #custom-bottom-bar a.custom-button:hover {
        background-color: #007bff;
        color: #ffffff !important;
    }

    #custom-bottom-bar .divider {
        margin: 0 10px;
        color: #999;
    }
  `;
  document.head.appendChild(style);

  // =========================
  // 🕒 2. PREVENIR CACHÉ
  // =========================
  // Se agrega un parámetro ?nocache=timestamp a las URLs para forzar la recarga del script.
  const timestamp = '?nocache=' + Date.now();

  // =========================
  // 🛠️ 3. FUNCIÓN PARA CREAR BOTONES
  // =========================
  const createButton = (icon, text, color, scriptPath) => {
    const button = document.createElement('a');
    button.href = '#';
    button.className = 'custom-button';
    button.innerHTML = `${icon} ${text}`;
    button.style.color = color;

    // Evento que carga y ejecuta el script al hacer clic
    button.addEventListener('click', event => {
      event.preventDefault();
      const scriptUrl = `https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/${scriptPath}${timestamp}`;
      console.log(`Cargando script desde: ${scriptUrl}`);

      fetch(scriptUrl)
        .then(res => {
          if (!res.ok) throw new Error(`Estado: ${res.status}`);
          return res.text();
        })
        .then(code => new Function(code)()) // Ejecuta el script cargado
        .catch(err => alert(`Error al cargar el script de ${text}.\n${err}`));
    });

    return button;
  };

  // =========================
  // 📦 4. CREACIÓN DE LA BARRA INFERIOR
  // =========================
  const customBar = document.createElement('div');
  customBar.id = 'custom-bottom-bar';

  // --- Título principal ---
  const mainLabel = document.createElement('span');
  mainLabel.className = 'section-label';
  mainLabel.textContent = 'Barra de Herramientas';
  customBar.appendChild(mainLabel);

  // =========================
  // 🧭 5. SECCIÓN ESCALAMIENTO
  // =========================
  const escalaLabel = document.createElement('span');
  escalaLabel.className = 'section-label';
  escalaLabel.textContent = 'Escalamiento:';
  customBar.appendChild(escalaLabel);

  const groupEscalamiento = document.createElement('div');
  groupEscalamiento.className = 'button-group';

  groupEscalamiento.appendChild(createButton('📱', 'Recarga', '#ea4c89', 'CRM2/Recarga.js'));
  groupEscalamiento.appendChild(createButton('💵', 'Remesa', '#87cb16', 'CRM2/Remesa.js'));
  groupEscalamiento.appendChild(createButton('💳', 'MLC', '#23ccef', 'CRM2/MLC.js'));
  groupEscalamiento.appendChild(createButton('📦', 'TN', '#ff4500', 'CRM2/TN.js'));
  groupEscalamiento.appendChild(createButton('🌍', 'Ingles', '#1769ff', 'CRM2/Ingles.js'));

  customBar.appendChild(groupEscalamiento);

  // =========================
  // 🔲 6. SEPARADOR VISUAL
  // =========================
  const divider = document.createElement('span');
  divider.className = 'divider';
  divider.textContent = '|';
  customBar.appendChild(divider);

  // =========================
  // 💬 7. SECCIÓN TWILIO CHAT
  // =========================
  const chatLabel = document.createElement('span');
  chatLabel.className = 'section-label';
  chatLabel.textContent = 'Twilio Chat:';
  customBar.appendChild(chatLabel);

  const groupChat = document.createElement('div');
  groupChat.className = 'button-group';

  groupChat.appendChild(createButton('📱', 'Recarga TW', '#ea4c89', 'CRM2/RecargaTW.js'));
  groupChat.appendChild(createButton('💵', 'Remesa TW', '#87cb16', 'CRM2/RemesaTW.js'));

  customBar.appendChild(groupChat);

  // =========================
  // 📥 8. AÑADIR LA BARRA AL DOM
  // =========================
  document.body.appendChild(customBar);
})();
