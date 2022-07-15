const { app, BrowserWindow } = require("electron");
const path = require("path");
const isPackaged = require("electron-is-packaged").isPackaged;
let indexFile;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // allowRunningInsecureContent: true
      nodeIntegration: true,
      contextIsolation: false,
      devTools: !isPackaged,
      icon: __dirname + "./favicon_256.ico",
    },
  });
  if (isPackaged) {
    win.setMenu(null);
  }

  win.webContents.openDevTools();
  if (isPackaged) {
    indexFile = "index.obfuscated.html";
  } else {
    indexFile = "index.html";
  }
  win.loadFile(indexFile);
};
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
