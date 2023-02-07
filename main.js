const { exec } = require("child_process");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isPackaged = require("electron-is-packaged").isPackaged;
const execFile = require("child_process").execFile;
const execSync = require("child_process").execSync;
const os = require("os");
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
    height: 501,
    minWidth: 1080,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // allowRunningInsecureContent: true
      nodeIntegration: true,
      contextIsolation: false,
      // devTools: !isPackaged,
      webviewTag: true,
      icon: __dirname + "./favicon_256.ico",
    },
  });
  if (isPackaged) {
    win.setMenu(null);
  }
  win.webContents.openDevTools({ mode: "undocked" });
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
  ipcMain.on("get-version", (e) => {
    e.returnValue = app.getVersion();
  });
  ipcMain.on("resize", () => {
    win.setSize(1080, 500);
  });
  ipcMain.on("get-osInfo", (e) => {
    e.returnValue = [os.type(), os.release()];
  });
  ipcMain.on("is-packaged", (e) => {
    e.returnValue = isPackaged;
  });
};
app.whenReady().then(() => {
  createWindow();

  console.log("starting ADB server");
  execFile(adbPath, ["start-server"], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stderr);
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
