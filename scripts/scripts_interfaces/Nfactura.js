const { ipcRenderer } = require("electron");
var opcionesJSON = [];
var selectedClientId;
var OpcionesJSONProductos = [];
var selectedEmail;
var selectedProductId;
var selectedProductcode;
var selectedPrice;
var cantidadTotal = 0;
var nameclient;
var Productosafacturar = [];
document.addEventListener("DOMContentLoaded", function () {
  const dataSearch = ["client", "names", "lastnames", "clientid", "email"]; // 0 es nombre de la tabla, 1 es la columna a buscar
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
        selectedClientId = opcion.clientid;
        selectedEmail = opcion.email;
        nameclient = opcion.names + " " + opcion.lastnames;
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

  form.onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const newProduct = Object.fromEntries(formData.entries());
    // Here you would typically send the data to your backend
    modal.style.display = "none";
    form.reset();
  };
});

function cargarProductos() {
  const dataSearch = [
    "product_inventory",
    "productname",
    "productinventoryid",
    "productcode",
    "price",
  ]; // 0 es nombre de la tabla, 1 es la columna a buscar
  ipcRenderer.send("sendsearchallrows", { dataSearch });

  ipcRenderer.on("returnalldata", (event, data) => {
    OpcionesJSONProductos = data;
    console.log(OpcionesJSONProductos);
  });
  const searchInput = document.getElementById("productoi");
  const suggestionsList = document.getElementById("suggestions-list2");

  searchInput.addEventListener("input", function () {
    const busqueda = this.value.toLowerCase();
    const opcionesFiltradas = OpcionesJSONProductos.filter((opcion) =>
      opcion.productname.toLowerCase().includes(busqueda)
    );
    mostrarSugerencias(opcionesFiltradas);
  });

  function mostrarSugerencias(opciones) {
    suggestionsList.innerHTML = "";

    if (opciones.length > 0) {
      opciones.forEach((opcion) => {
        const li = document.createElement("li");
        li.textContent = opcion.productname;
        li.addEventListener("click", function () {
          searchInput.value = opcion.productname;
          selectedProductId = opcion.productinventoryid;
          selectedProductcode = opcion.productcode;
          selectedPrice = opcion.price;
          console.log(selectedProductcode, selectedPrice, selectedProductId);

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

const form = document.getElementById("newProductForm");
form.addEventListener("submit", () => {
  const formData = new FormData(form);
  const newProduct = Object.fromEntries(formData.entries());
  form.reset();
  console.log(parseInt(newProduct.quantity * selectedPrice));
  cantidadTotal = cantidadTotal + parseInt(newProduct.quantity * selectedPrice);

  const data = [
    {
      code: selectedProductcode,
      productinventoryid: selectedProductId,
      unitprice: selectedPrice,
      quantity: newProduct.quantity,
      totalprice: parseInt(newProduct.quantity) * parseInt(selectedPrice),
    },
  ];

  const tbody = document.getElementById("table-content");

  data.forEach((item) => {
    const row = document.createElement("tr");

    let modifiedItem = {
      ...item, 
      productinventoryid: newProduct.product 
    };
  
    Object.values(modifiedItem).forEach((value) => {
      const td = document.createElement("td");
      if (typeof value === "object" && value !== null) {
        td.textContent = Object.values(value).join(", ");
      } else {
        td.textContent = value;
      }
      row.appendChild(td);
      tbody.appendChild(row);

      const total = document.getElementById("total");
      total.textContent = `Total: $${cantidadTotal.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    });
  });
  Productosafacturar.push({
    code: selectedProductcode,
    productinventoryid: selectedProductId, // Aquí se sigue usando el 'selectedProductId'
    unitprice: selectedPrice,
    quantity: newProduct.quantity,
    totalprice: parseInt(newProduct.quantity) * parseInt(selectedPrice),
  });
});

function generarfactura() {
  const Factura = {
    invoice: {
      table: "invoice",
      row: {
        clientid: selectedClientId,
        userid: "1",
        totalamount: cantidadTotal,
        paymentmethod: document.getElementById("pago").value,
        invoicecode: document.getElementById("code").value,
      },
    },
    details: {
      table: "invoicedetail",
      row: Productosafacturar
    }
  };
  const modalExistoso = document.getElementById("newFacturaExitosa");
  const modalFracaso = document.getElementById("newFacturaFracaso");
  const closeBtn = document.getElementById("closeFact");
  ipcRenderer.send("generarfactura", Factura);
  ipcRenderer.on("returngenerate", (event, data) => {
    if(data === 2){
      modalFracaso.style.display = "block";
    }else if(data === 1){
      console.log("Existe");
      const clientname = document.getElementById("nameclient");
      const addressclient = document.getElementById("addressclient");
      const identificacionclient = document.getElementById("identificacionclient");
      const numberfactura = document.getElementById("numberfactura");
      const fechaemit = document.getElementById("fechaemit");
      console.log(Factura.invoice.row.invoicecode);
      const enviar = [
        { table: "client", row: "address", column: "clientid", value: selectedClientId },
        { table: "client", row: "identification", column: "clientid", value: selectedClientId },
        { table: "invoice", row: "datetime", column: "invoicecode", value: Factura.invoice.row.invoicecode }
      ]
      
      ipcRenderer.send("buscarcampoconwhere", enviar);
      

      ipcRenderer.on("returndataconwhere", (event, data) => {
        console.log(data);
        addressclient.textContent = data[0][0].address;
        identificacionclient.textContent = data[1][0].identification;
        fechaemit.textContent = `Fecha de Emisión: ${data[2][0].datetime.slice(0, 19).replace("T", " ")}`;
      });
      clientname.textContent = nameclient;
      numberfactura.textContent = `Número de Factura: ${Factura.invoice.row.invoicecode}`;
      copiartabla();
      const numerosubTotal = document.getElementById("numeritoacambiarsubtotal");
      numerosubTotal.textContent = `$${(cantidadTotal).toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      const numeroiva = document.getElementById("numeritoacambiaiva");
      numeroiva.textContent = `$${(cantidadTotal * 0.19).toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} `;

        const numerocanttotal = document.getElementById("numeritoacambiartotal");
        numerocanttotal.textContent = `$${(cantidadTotal + (cantidadTotal * 0.19)).toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} `;
      const mediopago = document.getElementById("mediopago");
      mediopago.textContent = Factura.invoice.row.paymentmethod;
      modalExistoso.style.display = "block";
      
      closeBtn.addEventListener("click", function () {
        modalExistoso.style.display = "none";
        
      });
    }
  });
 
}

function copiartabla() {
  let tbodyOriginal = document.getElementById("table-content");
let tbodyNuevo = document.getElementById("factura-table-content");

// Copiar filas excluyendo la primera columna (Código)
for (let row of tbodyOriginal.rows) {
    let newRow = tbodyNuevo.insertRow();  // Crear una nueva fila en la segunda tabla
    
    // Recorremos las celdas desde la segunda (índice 1) hasta el final
    for (let i = 1; i < row.cells.length; i++) {
        let newCell = newRow.insertCell();  // Crear una nueva celda
        newCell.innerHTML = row.cells[i].innerHTML;  // Copiar el contenido de la celda original
    }
}
}

function enviaremail() {
  const factura = document.getElementById("envioemail");
  const notacliente = document.getElementById("notas").value;
  const rugs = {
    to_email: selectedEmail,
    html_content: factura.innerHTML,
    noutes: notacliente
  }
  ipcRenderer.send("enviaremail", rugs)
  
}