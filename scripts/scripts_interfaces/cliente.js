const { ipcRenderer } = require("electron");

function send() {
  const search = document.getElementById("product-search").value;
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

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("newClientModal");
  const newClientBtn = document.querySelector(".new-client-btn");
  const closeBtn = document.querySelector(".close");
  const form = document.getElementById("newClientForm");
  const closeBtnForm = document.querySelector(".btn-close");

  newClientBtn.addEventListener("click", function (event) {
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
    form.reset();
  });

  // Prevent clicks inside the modal from closing it
  modal.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});

ipcRenderer.on("returninsert", (event, error) => {
  if (!error) {
    alert("Cliente insertado con éxito");
  } else {
    console.log(error);
    alert("Error al insertar cliente");
    console.log(error);
  }
});
