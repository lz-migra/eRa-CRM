(function () {
  'use strict';

  console.log('[Remesa.js] Script ejecutado');

  const getText = (selector) => {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : 'N/A';
  };

  const getXPathText = (xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.STRING_TYPE,
      null
    );
    return result.stringValue.trim() || 'N/A';
  };

  const IDcliente = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(2) > p');
  const Tipoderemesa = 'Domicilio';
  const Povincia = getXPathText('//*[@id="accordion-offers-body-25668313-2"]/div/table/tbody/tr[2]/td/div/div/div[2]/div[3]/p[3]/text()');
  const NroReparto = getXPathText('//*[@id="accordion-offers-body-25631105-2"]/div/table/tbody/tr[2]/td/div/div/div[3]/div/div/p[1]/text()');
  const orderCode = getText('#root > div > div.main-panel.ps.ps--active-y > div.main-content > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > p');
  const FoiID = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(1)');
  const status = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(4)');
  const Proveedor = getText('#accordion-offers-body-25631105-2 > div > table > tbody > tr:nth-child(1) > td:nth-child(3)');
  const solicitud = '';

  const resultado = `
ID del cliente: ${IDcliente}
Tipo de remesa: ${Tipoderemesa}
Provincia: ${Povincia}
Número de reparto: ${NroReparto}
Order code: ${orderCode}
ID o FOI: ${FoiID}
Status: ${status}
Proveedor: ${Proveedor}
Solicitud: ${solicitud}
  `.trim();

  navigator.clipboard.writeText(resultado).then(() => {
    console.log('✅ Información copiada al portapapeles:');
    console.log(resultado);
    alert('📋 ¡Datos copiados al portapapeles! 📋');
  }).catch((err) => {
    console.error('❌ Error al copiar al portapapeles:', err);
  });

})();
