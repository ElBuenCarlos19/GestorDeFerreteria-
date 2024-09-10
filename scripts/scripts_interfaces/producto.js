const { ipcRenderer } = require('electron');
function send() {
    const search = document.getElementById("search").value;
    const dataSearch = ['product_inventory', 'productname'];
    ipcRenderer.send('sendsearchproduct', {search, dataSearch});
}

ipcRenderer.on('returndata', (event, data) => {
    console.log(data);
    const miDiv = document.getElementById('table-container');

    while (miDiv.firstChild) {
        miDiv.removeChild(miDiv.firstChild);
    }
    for(let i = 0; i < data.length; i++){
        const p = document.createElement('p');
        p.textContent = data[i].productname;
        miDiv.appendChild(p);
    }

})