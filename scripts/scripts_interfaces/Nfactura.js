const { ipcRenderer } = require("electron");
var opcionesJSON = [];
var selectedProviderId;
document.addEventListener('DOMContentLoaded', function() {
    const dataSearch = ["client", "names", "lastnames", "clientid"]; // 0 es nombre de la tabla, 1 es la columna a buscar
    ipcRenderer.send("sendsearchallrows", { dataSearch });
});

  ipcRenderer.on("returnalldata", (event, data) => {
    opcionesJSON = data;
  });



const searchInput = document.getElementById("cliente");
const suggestionsList = document.getElementById("suggestions-list");

searchInput.addEventListener("input", function () {
  const busqueda = this.value.toLowerCase();
  const opcionesFiltradas = opcionesJSON.filter((opcion) =>
    opcion.names.toLowerCase().includes(busqueda)
  );
  mostrarSugerencias(opcionesFiltradas);
});

function mostrarSugerencias(opciones) {
  suggestionsList.innerHTML = "";

  if (opciones.length > 0) {
    opciones.forEach((opcion) => {
      const li = document.createElement("li");
      li.textContent = opcion.names + " " + opcion.lastnames;
      li.addEventListener("click", function () {
        searchInput.value = opcion.names + " " + opcion.lastnames;
        selectedProviderId = opcion.clientid;

        suggestionsList.style.display = "none";
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = "block";
  } else {
    suggestionsList.style.display = "none";
  }
}

document.addEventListener("click", function (event) {
  if (
    !searchInput.contains(event.target) &&
    !suggestionsList.contains(event.target)
  ) {
    suggestionsList.style.display = "none";
  }
});