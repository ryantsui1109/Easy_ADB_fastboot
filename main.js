const { exec } = require("child_process");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isPackaged = require("electron-is-packaged").isPackaged;
const execFile = require("child_process").execFile;
const execSync = require("child_process").execSync;
const getPlatform = require("os").platform;
let adbPath = "";

if (getPlatform() == "win32") {
  adbPath = ".\\platform-tools-win\\adb.exe";
}

if (getPlatform() == "linux") {
  adbPath = "./platform-tools-linux/adb";
}

let indexFile;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 500,
    minWidth:1080,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // allowRunningInsecureContent: true
      nodeIntegration: true,
      contextIsolation: false,
      devTools: !isPackaged,
      webviewTag: true,
      icon: __dirname + "./favicon_256.ico",
    },
  });
  if (isPackaged) {
    win.setMenu(null);
  }

  win.webContents.openDevTools();
  // if (isPackaged) {
  //   indexFile = "index.obfuscated.html";
  // } else {
  //   indexFile = "index.html";
  // }
  indexFile = "index.html";
  win.loadFile("index.html");
  ipcMain.on("close-window", () => {
    win.close();
  });
  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("minimize-window", () => {
    win.minimize();
  });
};
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  app.on("before-quit", () => {
    console.log("Trying to kill adb server");

    execFile(adbPath, ["kill-server"], (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    });
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin");
  app.quit();
});
