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
  const dataSearch = ["client", "names"]; // 0 es nombre de la tabla, 1 es la columna a buscar
  ipcRenderer.send("sendsearch", { search, dataSearch });
}

ipcRenderer.on("returndata", (event, data) => {
  const miDiv = document.getElementById("table-container");

  while (miDiv.firstChild) {
    miDiv.removeChild(miDiv.firstChild);
  }
  for (let i = 0; i < data.length; i++) {
    const p = document.createElement("p");
    p.textContent = data[i].names;
    miDiv.appendChild(p);
  }
});

function agregarCliente() {
  const names = document.getElementById("names").value;
  const lastNames = document.getElementById("lastNames").value;
  const identification = document.getElementById("identification").value;
  const adress = document.getElementById("address").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const email = document.getElementById("email").value;
  const dataInsert = {
    table: "client",
    row: {
      names: names,
      lastnames: lastNames,
      identification: identification,
      address: adress,
      phonenumber: phoneNumber,
      email: email,
    },
  };
  console.log(dataInsert);
  ipcRenderer.send("insertonerow", dataInsert);
}

ipcRenderer.on("returninsert", (event, error) => {
  if (!error) {
    document.getElementById("names").value = "";
    document.getElementById("lastNames").value = "";
    document.getElementById("identification").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("email").value = "";
    alert("Cliente insertado con éxito");
  } else {
    alert("Error al insertar cliente");
  }
});
