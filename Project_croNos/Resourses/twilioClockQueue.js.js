// 🚦 Intervalo que revisa cada 500ms
setInterval(() => {
  // 🔍 Seleccionamos todas las tarjetas dentro del contenedor principal
  const tarjetas = document.querySelectorAll(".Twilio-TaskList-default .Twilio-TaskListBaseItem");

  // 📦 Obtenemos la lista actual del localStorage o la inicializamos
  let lista = JSON.parse(localStorage.getItem("cola_relojes_twilio")) || [];

  tarjetas.forEach(tarjeta => {
    // 👀 Verificamos si la tarjeta ya tiene custom-crono-line
    const tieneCrono = tarjeta.querySelector(".custom-crono-line");

    if (!tieneCrono) {
      // 🏷️ Sacamos el nombre desde el h4 > span
      const nombreEl = tarjeta.querySelector("h4.Twilio-TaskListBaseItem-FirstLine span");
      if (!nombreEl) return; // ❌ Si no hay nombre, saltamos

      const nombre = nombreEl.innerText.trim();

      // ⚙️ Construimos el objeto de la tarjeta
      const objeto = {
        nombre: nombre,
        usarStorage: true,
        actualizar: false
      };

      // 🔄 Revisamos si ya existe en la lista
      const existe = lista.some(item => item.nombre === objeto.nombre);
      if (!existe) {
        // ➕ Lo agregamos a la lista
        lista.push(objeto);

        // 💾 Guardamos en localStorage
        localStorage.setItem("cola_relojes_twilio", JSON.stringify(lista));
        console.log("✅ Tarjeta añadida:", objeto);
      }
    }
  });
}, 500);
