const { ipcRenderer } = require("electron");

modal = document.getElementById("modal");
const btnNuevaFactura = document.querySelector(".new-invoice");
const spanClose = document.querySelector(".close");

var opcionesJSON = [];

btnNuevaFactura.onclick = function () {
  const dataSearch = ["provider", "providername"]; // 0 es nombre de la tabla, 1 es la columna a buscar
  ipcRenderer.send("sendsearchallrows", { dataSearch });
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
  const dataSearch = ["product_inventory", "productname"]; // 0 es nombre de la tabla, 1 es la columna a buscar
  ipcRenderer.send("sendsearch", { search, dataSearch });
}

ipcRenderer.on("returndata", (event, data) => {
  const miDiv = document.getElementById("table-container");

  while (miDiv.firstChild) {
    miDiv.removeChild(miDiv.firstChild);
  }
  for (let i = 0; i < data.length; i++) {
    const p = document.createElement("p");
    p.textContent = data[i].productname;
    miDiv.appendChild(p);
  }
});

ipcRenderer.on("returnalldata", (event, data) => {
  opcionesJSON = data;
});

const searchInput = document.getElementById("search-input");
const suggestionsList = document.getElementById("suggestions-list");

searchInput.addEventListener("input", function () {
  const busqueda = this.value.toLowerCase();
  console.log(opcionesJSON, "yo se cual soy")
  const opcionesFiltradas = opcionesJSON.filter((opcion) =>
    opcion.providername.toLowerCase().includes(busqueda)
  );

  mostrarSugerencias(opcionesFiltradas);
});

function mostrarSugerencias(opciones) {
  suggestionsList.innerHTML = "";

  if (opciones.length > 0) {
    opciones.forEach((opcion) => {
      const li = document.createElement("li");
      li.textContent = opcion.providername;
      li.addEventListener("click", function () {
        searchInput.value = opcion.providername;
        suggestionsList.style.display = "none";
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = "block";
  } else {
    suggestionsList.style.display = "none";
  }
}

// Ocultar sugerencias cuando se hace clic fuera del buscador
document.addEventListener("click", function (event) {
  if (
    !searchInput.contains(event.target) &&
    !suggestionsList.contains(event.target)
  ) {
    suggestionsList.style.display = "none";
  }
});
