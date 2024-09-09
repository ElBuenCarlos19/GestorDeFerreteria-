const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { verificarCredenciales } = require("./scripts/validator");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("interfaces/login.html");

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
    }
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
