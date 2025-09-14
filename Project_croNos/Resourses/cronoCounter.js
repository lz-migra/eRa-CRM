(function() {
  const container = document.querySelector(".Twilio-TaskList-default");
  if (!container) return;

  // 1. Función para iniciar el cronómetro en una tarjeta específica
  function initializeCardTimer(card) {
    const clockLine = card.querySelector(".custom-crono-line");
    if (!clockLine) return;

    // Verificar si el contador ya existe para evitar duplicados
    if (clockLine.querySelector(".custom-crono-counter")) return;

    let counter = document.createElement("span");
    counter.className = "custom-crono-counter";
    counter.style.marginLeft = "8px";
    counter.style.fontFamily = "inherit";
    counter.style.fontWeight = "bold";
    counter.style.transition = "color 1s ease-in-out";

    const clockText = clockLine.textContent.trim().replace("🕒", "").trim();
    const [hh, mm, ss] = clockText.split(":").map(Number);
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
    counter.dataset.start = startTime.getTime();
    counter.style.color = "#808080";
    counter.textContent = "⏱ 00:00";
    clockLine.appendChild(counter);
  }

  // 2. Función que se ejecuta en cada intervalo para actualizar el cronómetro
  function updateTimers() {
    const cards = container.querySelectorAll("[data-testid='task-item']");
    cards.forEach(card => {
      const counter = card.querySelector(".custom-crono-counter");
      if (!counter) {
        // Si el contador no existe, lo inicializamos. Esto es clave.
        initializeCardTimer(card);
        return; // Salir y esperar al siguiente intervalo
      }

      const start = parseInt(counter.dataset.start, 10);
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      
      const minsDisplay = String(mins).padStart(2, "0");
      const secsDisplay = String(secs).padStart(2, "0");

      counter.textContent = `⏱ ${minsDisplay}:${secsDisplay}`;
      
      if (mins >= 5) {
        counter.style.color = "#FF0000";
      } else if (mins >= 4) {
        counter.style.color = "#ffa600";
      } else {
        counter.style.color = "#808080";
      }
    });
  }

  // 3. MutationObserver para detectar cuando se añaden nuevos elementos
  const observer = new MutationObserver((mutationsList, observer) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.matches("[data-testid='task-item']")) {
            // Un nuevo elemento de tarjeta ha sido añadido, inicializar su cronómetro
            initializeCardTimer(node);
          }
        });
      }
    }
  });

  // 4. Iniciar la observación del contenedor
  observer.observe(container, { childList: true });

  // 5. Iniciar el bucle de actualización para los elementos que ya existen
  updateTimers(); // Llama una vez al inicio
  setInterval(updateTimers, 100);

})();