const { ipcRenderer } = require('electron');
function send() {
const username = document.getElementById("usuario").value;
const password = document.getElementById("password").value;
ipcRenderer.send('sendvalidationusuario', {username, password});
ipcRenderer.on('returnvalidationusuario', (event, data) => {
if(data === "Acceso exitoso"){
window.location.href = "./producto.html";
}else if(data === "Acceso denegado"){
alert("Credenciales incorrectas");
}
})


}