const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isPackaged = require("electron-is-packaged").isPackaged;
const { download } = require("electron-dl");
const child_process = require("child_process");
const fs = require("fs");
const os = require("os");
const platform = os.platform();
const config = require("./config.json");
const updaterStatus = require("./updaterStatus.json");
const { https } = require("follow-redirects");
let hasDevtools = false;
let adbPath = "";

if (platform == "win32") {
  adbPath = ".\\platform-tools-win\\adb.exe";
}

if (platform == "linux") {
  adbPath = "./platform-tools-linux/adb";
}

if (!isPackaged || config.channel == "beta") {
  hasDevtools = true;
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
      // nodeIntegration: true,
      // contextIsolation: false,
      devTools: hasDevtools,
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
  ipcMain.on("resize", () => {
    win.setSize(1080, 500);
  });
  ipcMain.on("download", async (e, url) => {
    console.log(url)
    console.log(typeof download)
    console.log(await download(win, url, {
      showProgressBar: true,
      directory: isPackaged ? __dirname + "\\..\\.." : __dirname,
      filename: "update.exe",
      overwrite: true,
      onProgress: (progress) =>
        win.webContents.send("update-progress", progress),
      onCompleted: () => {
        win.webContents.send("update-complete");
      },
    }))
    // await download(BrowserWindow.getFocusedWindow(), url, {
    //   showProgressBar: true,
    //   directory: isPackaged ? __dirname + "\\..\\.." : __dirname,
    //   filename: "update.exe",
    //   overwrite: true,
    // onProgress: (progress) =>
    //   win.webContents.send("update-progress", progress),
    // onCompleted: () => {
    //   win.webContents.send("update-complete");
    // },
    // });
  });
  ipcMain.on("run-command", (e, command, params) => {
    const process = child_process.spawn(command, params);
    process.stderr.on("data", (data) =>
      win.webContents.send("print-log", `${data}`)
    );
  });
};

ipcMain.handle("get-platform", async () => {
  return platform;
});
ipcMain.handle("get-version", async () => {
  return app.getVersion();
});
ipcMain.handle("get-os-type", async () => {
  console.log(os.type());
  return os.type();
});
ipcMain.handle("get-os-release", async () => {
  return os.release();
});
ipcMain.handle("get-config", async () => {
  return config;
});
ipcMain.handle("get-updater-status", async () => {
  return updaterStatus;
});
ipcMain.handle("is-packaged", async () => {
  return isPackaged;
});

app.whenReady().then(() => {
  createWindow();
  let processedLang;
  let lang = app.getLocale();
  if (config.language === "auto") {
    switch (lang) {
      case "zh-TW":
      case "en-US":
        processedLang = lang;
        break;
      default:
        processedLang = "en-US";
    }
  }

  console.log("starting ADB server");
  const adbServer = child_process.spawn(adbPath, ["start-server"]);
  adbServer.stderr.on("data", (data) => console.log(`${data}`.split("\n")[0]));

  app.on("before-quit", () => {
    console.log("Trying to kill adb server");

    child_process.execFile(
      adbPath,
      ["kill-server"],
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
      }
    );
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin");
  app.quit();
});
