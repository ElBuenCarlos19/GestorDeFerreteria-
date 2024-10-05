const { ipcRenderer } = require("electron");

const tablesFill = {
  table: "users",
  row: {
    names: "names",
  lastnames: "lastnames",
    identification: "identification",
    email: "email",
    username: "username",
    rolename: "role(namerole)"
  },
};

document.addEventListener("DOMContentLoaded", function () {
  fillTable(tablesFill);
  const modal = document.getElementById("newUsertModal");
  const newUserBtn = document.querySelector(".new-user-btn");
  const closeBtn = document.querySelector(".close");
  const form = document.getElementById("newUserForm");
  const closeBtnForm = document.querySelector(".btn-close");
  newUserBtn.addEventListener("click", function (event) {
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
      const newClient = Object.fromEntries(formData.entries());
      console.log("New client:", newClient);
      const dataInsert = {
        table: "client",
        row: {
          names: newClient.name,
          lastnames: newClient.lastname,
          identification: newClient.identification,
          address: newClient.address,
          phonenumber: newClient.phonenumber,
          email: newClient.email,
        },
      };
      ipcRenderer.send("insertonerow", dataInsert);
      ipcRenderer.on("returninsert", (event, error) => {
        if (!error) {
          fillTable(tablesFill);
        }
      });
      form.reset();
    });

    // Prevent clicks inside the modal from closing it
    modal.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  async function fillTable(tablesFill) {
    ipcRenderer.send("sendFillTable", tablesFill);
    ipcRenderer.on("returnfilltable", (event, data) => {
      fill(data);
    });
  }
  
  function fill(data) {
    console.log(data, "alaaa");
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
          updateBtn.className = "action-btn update-btn";
          updateBtn.setAttribute("aria-label", "Actualizar item");
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "​❌​";
          deleteBtn.className = "action-btn delete-btn";
          deleteBtn.setAttribute("aria-label", "Eliminar item");
          actionCell.appendChild(updateBtn);
          actionCell.appendChild(deleteBtn);
          row.appendChild(actionCell);
        tbody.appendChild(row);
      });
  }