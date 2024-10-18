const { ipcRenderer } = require("electron");


function send() {
    const search = document.getElementById("search").value;
    const dataSearch = ['invoice', 'invoicecode']; // 0 es nombre de la tabla, 1 es la columna a buscar
    ipcRenderer.send('sendsearch', {search, dataSearch});
}

document.addEventListener('DOMContentLoaded', function () {
  const tablesFill = {
    table: "invoice",
    row: {
      invoicecode: "invoicecode",
      paymentmethod: "paymentmethod",
      totalamount: "totalamount",
      datetime: "datetime",
    },
  };
  console.log("ghkapsjd")
  fillTable(tablesFill);

})

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
    item.datetime = item.datetime.slice(0, 19).replace("T", " ");
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
