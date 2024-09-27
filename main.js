const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { verificarCredenciales } = require("./scripts/validator");
const { searchProduct, searchallrows, insertOneRow } = require("./scripts/search");


// Proceso de renderizado(Cliente) y proceso principal(node)
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.setMenuBarVisibility(false);
  win.loadFile("interfaces/login.html");
  win.on('minimize', (event) => {
    event.preventDefault();
  });

  win.on("closed", () => {
    win = null;
  });
  ipcMain.on("sendvalidationusuario", async (event, data) => {
    try {
      const resultado = await verificarCredenciales(
        data.username,
        data.password
      );

      if (resultado === 1) {
        win.webContents.send("returnvalidationusuario", "Acceso exitoso");
      } else {
        win.webContents.send("returnvalidationusuario", "Acceso denegado");
      }
    } catch (error) {
      console.error("Error al verificar credenciales:", error.message);
    }0.
  });

  ipcMain.on("sendsearch", async (event, data) => {
    try {
      const dataResult = await searchProduct(data.search, data.dataSearch);
      win.webContents.send("returndata", dataResult);
    } catch (error) {
      console.error("Error al buscar producto:", error.message);
    }
  });

  ipcMain.on("sendsearchallrows", async (event, data) => {
    try {
      const dataResult = await searchallrows(data.dataSearch);
      win.webContents.send("returnalldata", dataResult);
    } catch (error) {
      console.error("Error al buscar producto:", error.message);
    }
  });

  ipcMain.on("insertonerow", async (event, data) => {
    try {
       const error = await insertOneRow(data);
       win.webContents.send("returninsert", error);
      
    } catch (error) {
      console.error("Error al insertar producto:", error.message);
    }
  });
  
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
