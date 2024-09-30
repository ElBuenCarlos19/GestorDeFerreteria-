const { ipcRenderer } = require("electron");

var opcionesJSON = [];
var selectedProviderId;

function send() {
  const search = document.getElementById("product-search").value;
  const dataSearch = ["product_inventory", "productname"]; // 0 es nombre de la tabla, 1 es la columna a buscar
  ipcRenderer.send("sendsearch", { search, dataSearch });
}

function insert() {
  const dataSearch = ["provider", "providerid", "providername"]; // 0 es nombre de la tabla, 1 es la columna a buscar
  ipcRenderer.send("sendsearchallrows", { dataSearch });
}

ipcRenderer.on("returnalldata", (event, data) => {
  opcionesJSON = data;
});

ipcRenderer.on("returninsert", (event, error) => {
  if (!error) {
    alert("Producto insertado con éxito");
  } else {
    alert("Error al insertar producto");
  }
});

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

document.addEventListener("DOMContentLoaded", function () {
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

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const newProduct = Object.fromEntries(formData.entries());
    console.log("New product:", newProduct);
    const dataInsert = {
      table: "product_inventory",
      row: {
        providerid: selectedProviderId,
        productcode: newProduct.code,
        productname: newProduct.name,
        description: newProduct.description,  
        quantity: newProduct.quantity,
      },
    };
    form.reset();
    ipcRenderer.send("insertonerow", dataInsert);
  });

  // Prevent clicks inside the modal from closing it
  modal.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});

const searchInput = document.getElementById("proveedor");
const suggestionsList = document.getElementById("suggestions-list");

searchInput.addEventListener("input", function () {
  const busqueda = this.value.toLowerCase();
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
        selectedProviderId = opcion.providerid;

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
