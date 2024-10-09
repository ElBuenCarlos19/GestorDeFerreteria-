const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { verificarCredenciales } = require("./scripts/validator");
const {
  searchProduct,
  searchallrows,
  insertOneRow,
  FillTables,
  searchrowwhere,
} = require("./scripts/search");
const { table } = require("console");

// Proceso de renderizado(Cliente) y proceso principal(node)
function createWindow() {
  const win = new BrowserWindow({
    width: 850,
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
  win.on("minimize", (event) => {
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
    }
    0;
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

  ipcMain.on("sendFillTable", async (event, table) => {
    try {
      const data = await FillTables(table);
      win.webContents.send("returnfilltable", data);
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
    }
  });

  ipcMain.on("generarfactura", async (event, Factura) => {
    try {
      const error1 = await insertOneRow(Factura.invoice);
      const tableObject = {
        table: "invoice",
        row: "invoiceid",
        column: "invoicecode",
        value: Factura.invoice.row.invoicecode,
      };
      const invoiceid = await searchrowwhere(tableObject);
      console.log(Factura.details.row, " ", Factura.details.row.length);
      for (let i = 0; i < Factura.details.row.length; i++) {
        let invoicedetailObject = {
          table: "invoicedetail",
          row: {
            invoiceid: invoiceid[0].invoiceid,
            productinventoryid: Factura.details.row[i].productinventoryid,
            quantity: Factura.details.row[i].quantity,
            unitprice: Factura.details.row[i].unitprice,
            totalprice: Factura.details.row[i].totalprice,
          },
        };
        console.log(invoicedetailObject);
        const error2 = await insertOneRow(invoicedetailObject);
        console.log(error2);
        if (error2 | error1) {
          console.log(
            "Error al insertar factura:",
            error1.message,
            "error al insertar detalle de factura:",
            error2.message
          );
          win.webContents.send("returngenerate", 2);
        }
      }
      win.webContents.send("returngenerate", 1);

    } catch (error) {
      console.error("Error al buscar producto:", error.message);
    }
  });

  ipcMain.on("buscarcampoconwhere", async (event, data) => {
    try {
      let datita = []
      for (let i = 0; i < data.length; i++) {
        datita.push(await searchrowwhere(data[i]));
      }
      win.webContents.send("returndataconwhere", datita);
      
    } catch (error) {
      console.error("Error al buscar producto:", error.message);
    }

  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
