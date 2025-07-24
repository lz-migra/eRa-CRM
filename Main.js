(function () {
    'use strict';

    // --- ESTILOS CSS (usando appendChild de <style>) ---
    const style = document.createElement('style');
    style.textContent = `
        #custom-bottom-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: #ffffff;
            padding: 6px 0;
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            border-top: 1px solid #e0e0e0;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
            font-family: Arial, Helvetica, sans-serif;
        }

        #custom-bottom-bar a.custom-button {
            color: #333333;
            text-decoration: none;
            padding: 5px 12px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s, color 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #custom-bottom-bar a.custom-button:hover {
            background-color: #007bff;
            color: #ffffff !important;
        }
    `;
    document.head.appendChild(style);

    // --- HTML DE LA BARRA ---
    const customBar = document.createElement('div');
    customBar.id = 'custom-bottom-bar';

    // --- CONFIGURACIÓN DE BOTONES ---
    const buttons = [
        {
            icon: '📱', text: 'Recarga', color: '#ea4c89', action: () => {
                const scriptUrl = 'https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Recarga.js';
                console.log(`Cargando script desde: ${scriptUrl}`);

                fetch(scriptUrl)
                    .then(response => {
                        if (!response.ok) throw new Error(`Estado: ${response.status}`);
                        return response.text();
                    })
                    .then(code => {
                        new Function(code)(); // Ejecuta el script cargado
                    })
                    .catch(error => {
                        alert(`Error al cargar el script de Recarga.\n${error}`);
                    });
            }
        },
        { icon: '💵', text: 'Remesa', color: '#87cb16', action: () {
                const scriptUrl = 'https://raw.githubusercontent.com/lz-migra/eRa-CRM/main/Remesa.js';
                console.log(`Cargando script desde: ${scriptUrl}`);

                fetch(scriptUrl)
                    .then(response => {
                        if (!response.ok) throw new Error(`Estado: ${response.status}`);
                        return response.text();
                    })
                    .then(code => {
                        new Function(code)(); // Ejecuta el script cargado
                    })
                    .catch(error => {
                        alert(`Error al cargar el script de Recarga.\n${error}`);
                    });
            } },
        { icon: '💳', text: 'MLC', color: '#23ccef', action: () => alert('Función de MLC') },
        { icon: '📦', text: 'TN', color: '#ff4500', action: () => window.open('https://www.google.com/search?q=noticias', '_blank') },
        { icon: '🌍', text: 'Ingles', color: '#1769ff', action: () => window.open('https://translate.google.com/', '_blank') }
    ];

    buttons.forEach(btnInfo => {
        const button = document.createElement('a');
        button.href = '#';
        button.className = 'custom-button';
        button.innerHTML = `${btnInfo.icon} ${btnInfo.text}`;

        if (btnInfo.color) {
            button.style.color = btnInfo.color;
        }

        button.addEventListener('click', function (event) {
            event.preventDefault();
            btnInfo.action();
        });

        customBar.appendChild(button);
    });

    document.body.appendChild(customBar);
})();
