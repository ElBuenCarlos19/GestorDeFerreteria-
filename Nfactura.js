const modal = document.getElementById("modal");
    const btnNuevaFactura = document.querySelector(".new-invoice");
    const spanClose = document.querySelector(".close");
    
    // Mostrar el modal al hacer clic en "Nueva Factura"
    btnNuevaFactura.onclick = function () {
      modal.style.display = "flex";
    };
    
    // Cerrar el modal cuando se hace clic en la "x"
    spanClose.onclick = function () {
      modal.style.display = "none";
    };
    
    // Cerrar el modal cuando se hace clic fuera del contenido
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };