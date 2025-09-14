// 🚀 Script para agregar cronómetros ⏱ calculando tiempo transcurrido desde el reloj
(function() {
  setInterval(() => {
    const container = document.querySelector(".Twilio-TaskList-default");
    if (!container) return;

    const cards = container.querySelectorAll("[data-testid='task-item']");

    cards.forEach(card => {
      const clockLine = card.querySelector(".custom-crono-line");
      if (!clockLine) return;

      let counter = clockLine.querySelector(".custom-crono-counter");

      if (!counter) {
        counter = document.createElement("span");
        counter.className = "custom-crono-counter";
        counter.style.marginLeft = "8px";
        counter.style.fontFamily = "inherit";
        counter.style.fontWeight = "bold";
        counter.textContent = "⏱ 00:00";

        // 🎨 Agregamos la transición CSS para la animación de 1s
        counter.style.transition = "color 1s ease";

        const clockText = clockLine.textContent.trim().replace("🕒", "").trim();
        const [hh, mm, ss] = clockText.split(":").map(Number);
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);
        counter.dataset.start = startTime.getTime();
        clockLine.appendChild(counter);

        // 📝 Asignamos el color inicial
        counter.style.color = "#808080";
      } else {
        // 🔄 Recalcular tiempo transcurrido
        const start = parseInt(counter.dataset.start, 10);
        const elapsed = Math.floor((Date.now() - start) / 1000);

        const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const secs = String(elapsed % 60).padStart(2, "0");

        counter.textContent = `⏱ ${mins}:${secs}`;

        // 🎨 Lógica para cambiar el color según el tiempo
        if (elapsed >= 300) { // 5 minutos = 300 segundos
          counter.style.color = "#FF0000";
        } else if (elapsed >= 240) { // 4 minutos = 240 segundos
          counter.style.color = "#ffa600";
        } else {
          counter.style.color = "#808080";
        }
      }
    });
  }, 100);
})();
