const { ipcRenderer } = require("electron");

var opcionesJSON = [];
var selectedProviderId;
const tablesFill = {
  table: "product_inventory",
  row: {
    provider: "provider(providername)",
    productcode: "productcode",
    productname: "productname",
    description: "description",
    quantity: "quantity",
    price: "price",
  },
};

function send() {
  const search = document.getElementById("product-search").value;
  const dataSearch = [
    "product_inventory",
    "productname",
    "productcode",
    "description",
    "quantity",
    "price",
    "provider(providername)",
  ]; // 0 es nombre de la tabla, 1 es la columna a buscar 2... Son columnas a select
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
  fill(data);
});

document.addEventListener("DOMContentLoaded", function () {
  fillTable(tablesFill);
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
        price: newProduct.price,
      },
    };
    form.reset();
    ipcRenderer.send("insertonerow", dataInsert);
    ipcRenderer.on("returninsert", (event, error) => {
      if (!error) {
        fillTable(tablesFill);
      }
    });
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

async function fillTable(tablesFill) {
  ipcRenderer.send("sendFillTable", tablesFill);
  ipcRenderer.on("returnfilltable", (event, data) => {
    fill(data);
  });
}

function fill(data) {
  const tbody = document.getElementById("table-content");
  if (data.length === 0) {
    return;
  }

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  data.forEach((item) => {
    const row = document.createElement("tr");
    Object.values(item).forEach((value) => {
      const td = document.createElement("td");
      if (typeof value === "object" && value !== null) {
        td.textContent = Object.values(value).join(", ");
      } else {
        td.textContent = value;
      }
      row.appendChild(td);
    });
    const actionCell = document.createElement("td");
    actionCell.className = "action-cell";
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "​​​🔄​​";
    updateBtn.onclick = function () {
      const modal = document.getElementById("newProductModal");
      modal.style.display = "block";

      // Si el usuario confirma, procedemos con la actualización
      if (isConfirmed) {
        
        fillTable(tablesFill);
        
      }
    };
    updateBtn.className = "action-btn update-btn";
    updateBtn.setAttribute("aria-label", "Actualizar item");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "​❌​";
    deleteBtn.className = "action-btn delete-btn";
    deleteBtn.onclick = function () {
      console.log(item);
      const isConfirmed = confirm(
        "¿Estás seguro de que quieres eliminar este elemento?"
      );

      // Si el usuario confirma, procedemos con la eliminación
      if (isConfirmed) {
        ipcRenderer.send("deleterow", {
          table: "product_inventory",
          column: "productcode",
          value: item.productcode,
        });
        ipcRenderer.on("returndeleterow", (event, error) => {
          console.log(error);
          if (!error) {
            row.remove();

            //Hemano hay un problemita aqui, resuelvelo despues que no se te olvide
          }
        });
      }
    };
    deleteBtn.setAttribute("aria-label", "Eliminar item");
    actionCell.appendChild(updateBtn);
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);
    tbody.appendChild(row);
  });
}
