const { ipcRenderer } = require("electron");

modal = document.getElementById("modal");
const btnNuevaFactura = document.querySelector(".new-invoice");
const spanClose = document.querySelector(".close");

btnNuevaFactura.onclick = function () {
  modal.style.display = "flex";
};

spanClose.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function send() {
    const search = document.getElementById("search").value;
    const dataSearch = ['invoice', 'invoicecode']; // 0 es nombre de la tabla, 1 es la columna a buscar
    ipcRenderer.send('sendsearch', {search, dataSearch});
}


ipcRenderer.on('returndata', (event, data) => {
  const miDiv = document.getElementById('table-container');

  while (miDiv.firstChild) {
      miDiv.removeChild(miDiv.firstChild);
  }
  for(let i = 0; i < data.length; i++){
      const p = document.createElement('p');
      p.textContent = data[i].invoicecode;
      miDiv.appendChild(p);
  }

})