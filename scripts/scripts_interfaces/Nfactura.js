const { ipcRenderer } = require("electron");
var opcionesJSON = [];
var selectedProviderId;
var OpcionesJSONProductos = [];
var selectedProductId;
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
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById("newProductModal");
  const newProductBtn = document.querySelector(".new-product-btn");
  const closeBtn = document.querySelector(".close");
  const form = document.getElementById("newProductForm");
  const closeBtnForm = document.querySelector(".btn-close");
  newProductBtn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    event.stopPropagation(); // Stop event from bubbling up
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  closeBtnForm.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  form.onsubmit = function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const newProduct = Object.fromEntries(formData.entries());
      // Here you would typically send the data to your backend
      modal.style.display = 'none';
      form.reset();
  }
});

function cargarProductos() {
  const searchInput = document.getElementById("product");
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
        selectedProductId = opcion.clientid;

        suggestionsList.style.display = "none";
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.style.display = "block";
  } else {
    suggestionsList.style.display = "none";
  }
}

}