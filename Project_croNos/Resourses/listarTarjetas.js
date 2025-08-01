function listarTarjetas() {
  const tarjetas = document.querySelectorAll('.Twilio-TaskListBaseItem');
  if (tarjetas.length === 0) {
    console.warn('⚠️ No se encontraron tarjetas. ¿Ya está cargada la interfaz?');
    return [];
  }

  const resultado = Array.from(tarjetas).map((tarjeta, index) => ({
    tarjeta: index + 1,
    lineaPrincipal: tarjeta.querySelector('[data-testid="task-item-first-line"] span')?.textContent.trim() || '',
    mensaje: tarjeta.querySelector('.Twilio-TaskListBaseItem-SecondLine span')?.textContent.trim() || '',
    reloj: tarjeta.querySelector('.custom-crono-line')?.textContent.trim() || '',
    sinLeer: tarjeta.querySelector('.Twilio-Badge-TextContainer')?.textContent.trim() || '0'
  }));

  console.table(resultado);
  return resultado;
}

