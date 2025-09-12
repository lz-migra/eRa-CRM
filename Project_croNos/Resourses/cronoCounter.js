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
        counter.style.color = "green";
        counter.style.fontFamily = "monospace";
        counter.textContent = "⏱ 00:00";

        // 📖 Tomamos el texto del reloj base (ejemplo: "🕒 20:43:16")
        const clockText = clockLine.textContent.trim().replace("🕒", "").trim();

        // ⏳ Parseamos la hora actual del reloj
        const [hh, mm, ss] = clockText.split(":").map(Number);

        // Creamos un Date "hoy con esa hora"
        const now = new Date();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, ss);

        // Guardamos ese timestamp en el dataset
        counter.dataset.start = startTime.getTime();

        // Lo agregamos al DOM
        clockLine.appendChild(counter);
      } else {
        // 🔄 Recalcular tiempo transcurrido
        const start = parseInt(counter.dataset.start, 10);
        const elapsed = Math.floor((Date.now() - start) / 1000);

        const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const secs = String(elapsed % 60).padStart(2, "0");

        counter.textContent = `⏱ ${mins}:${secs}`;
      }
    });
  }, 100);
})();
