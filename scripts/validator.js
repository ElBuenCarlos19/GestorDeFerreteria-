function obtenerUsuario() {
    var usuario = document.getElementById("usuario").value;
    var password = document.getElementById("password").value;
    return {usuario, password };
}
function validar(data) {

   
    if (obtenerUsuario().usuario === data.username && obtenerUsuario().password === data.password) {
        window.location.href = "./factura.html";
    } else {
        document.getElementById("error").style.display = "block";
    }

}

module.exports = { obtenerUsuario,
    validar
 };