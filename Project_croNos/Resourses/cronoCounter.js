// 🚀 Script para agregar cronómetros con transición
(function() {
  setInterval(() => {
    const container = document.querySelector(".Twilio-TaskList-default");
    if (!container) return;

    const cards = container.querySelectorAll("[data-testid='task-item']");

    cards.forEach(card => {
      const clockLine = card.querySelector(".custom-crono-line");
      const parentContainer = card.querySelector(".Twilio-TaskListBaseItem-UpperArea");
      
      if (!clockLine || !parentContainer) return;

      let counter = clockLine.querySelector(".custom-crono-counter");

      if (!counter) {
        // --- CÓDIGO DE INICIALIZACIÓN ---
        counter = document.createElement("span");
        counter.className = "custom-crono-counter";
        counter.style.marginLeft = "8px";
        counter.style.fontFamily = "inherit";
        counter.style.fontWeight = "bold";

        // Tomamos el texto del reloj base
        const clockText = clockLine.textContent.trim().replace("🕒", "").trim();
        // Parseamos la hora actual del reloj
        const [hh, mm, ss] = clockText.split(":").map(Number);
        // Creamos un Date "hoy con esa hora"
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
        // Guardamos el timestamp
        counter.dataset.start = startTime.getTime();
        
        // Lo agregamos al DOM
        clockLine.appendChild(counter);

      }
      
      // --- LÓGICA DE REFRESCADO Y CAMBIO DE COLOR ---
      // Esta lógica se ejecuta siempre
      const start = parseInt(counter.dataset.start, 10);
      const elapsed = Math.floor((Date.now() - start) / 1000);

      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      
      const minsDisplay = String(mins).padStart(2, "0");
      const secsDisplay = String(secs).padStart(2, "0");

      counter.textContent = `⏱ ${minsDisplay}:${secsDisplay}`;
      
      // Lógica para cambiar el color según el tiempo
      let newColor = "#808080";
      if (mins >= 5) {
        newColor = "#FF0000";
      } else if (mins >= 4) {
        newColor = "#ffa600";
      }
      
      // 🎨 Aplicar el color y la transición directamente al contenedor padre
      if (parentContainer.style.color !== newColor) {
        parentContainer.style.transition = "color 1s ease-in-out";
        parentContainer.style.color = newColor;
      }
    });
  }, 100);
})();