document.addEventListener("DOMContentLoaded", function () {
    fillTable(tablesFill)
    const modal = document.getElementById("newUserModal");
    const newUserBtn = document.querySelector(".new-user-btn");
    const closeBtn = document.querySelector(".close");
    const form = document.getElementById("newUsertForm");
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