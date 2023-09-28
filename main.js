const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const isPackaged = require("electron-is-packaged").isPackaged;
const { download } = require("electron-dl");
const child_process = require("child_process");
const fs = require("fs");
const os = require("os");
const platform = os.platform();
const { autoUpdater } = require("electron-updater");
const { INSPECT_MAX_BYTES, constants } = require("buffer");

let channel = app.getVersion().split("-")[1];


if (!channel) {
  channel = "latest";
}


autoUpdater.channel = channel;
console.debug("Welcome to EAF v"+app.getVersion());
console.debug("The update channel is "+channel)

let config, updaterStatus, lang, messages;
if (isPackaged) {
  config = require("../../config.json");
  updaterStatus = require("../../updaterStatus.json");
} else {
  config = require("./config.json");
  updaterStatus = require("./updaterStatus.json");
}

let hasDevtools = false;
let adbPath = "";
let fbPath = "";

if (platform == "win32") {
  adbPath = ".\\platform-tools-win\\adb.exe";
  fbPath = ".\\platform-tools-win\\fastboot.exe";
}

if (platform == "linux") {
  adbPath = "./platform-tools-linux/adb";
  fbPath = "./platform-tools-linux/fastboot";
}

if (!isPackaged || config.variant == "beta") {
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
      devTools: hasDevtools,
      icon: __dirname + "./favicon_256.ico",
    },
  });

  if (isPackaged) {
    win.setMenu(null);
  }
  win.webContents.openDevTools({ mode: "undocked" });
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
  ipcMain.on("run-command", (e, command, params) => {
    const process = child_process.spawn(command, params);
    process.stderr.on("data", (data) => {
      console.log(`${data}`);
      if (params[0] == "-s") {
        win.webContents.send("print-log", [params[1], `${data}`]);
      } else {
        win.webContents.send("print-log", ["main", `${data}`]);
      }
    });
    process.stdout.on("data", (data) => {
      console.log(`${data}`);
      if (params[0] == "-s") {
        win.webContents.send("print-log", [params[1], `${data}`]);
      } else {
        win.webContents.send("print-log", ["main", `${data}`]);
      }
    });
  });
  ipcMain.on("write-file", (e, fileName, data) => {
    writeFile(fileName, data);
  });
  ipcMain.on("get-devices", (e, mode) => {
    let exec = "";
    switch (mode) {
      case "adb":
        exec = adbPath;
        break;
      case "fb":
        exec = fbPath;
        break;
      default:
        break;
    }
    function findDevice() {
      child_process.execFile(exec, ["devices"], (error, stdout, stderr) => {
        win.webContents.send("found-devices", [mode, stdout]);
      });
    }
    findDevice();
  });
  ipcMain.on("check-updates", (e) => {
    autoUpdater.checkForUpdates();
  });

  autoUpdater.on("update-not-available", (info) => {
    win.webContents.send("updater-status", ['update-not-avalable',{}]);
  });

  autoUpdater.on("update-available", (info) => {
    win.webContents.send("updater-status", ['update-available',info]);
  });

  autoUpdater.on("update-downloaded",(info)=>{
    win.webContents.send('updater-status',['update-downloaded',{}])
  })
};

ipcMain.handle("get-platform", async () => {
  return platform;
});
ipcMain.handle("get-version", async () => {
  return app.getVersion();
});
ipcMain.handle("get-os-type", async () => {
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
ipcMain.handle("messages", async () => {
  return messages;
});
ipcMain.handle("language", async () => {
  return lang;
});

app.on("ready", () => {
  let processedLang;
  let locale = app.getLocale();
  if (config.language === "auto") {
    switch (locale) {
      case "zh-TW":
      case "en-US":
        processedLang = locale;
        break;
      default:
        processedLang = "en-US";
    }
  } else {
    processedLang = config.language;
  }
  if (isPackaged) {
    lang = require(`${__dirname}/res/json/lang/${processedLang}/lang.json`);
    messages = require(`${__dirname}/res/json/lang/${processedLang}/messages.json`);
  } else {
    lang = require(`${__dirname}/res/json/lang/${processedLang}/lang.json`);
    messages = require(`${__dirname}/res/json/lang/${processedLang}/messages.json`);
  }
});

app.whenReady().then(() => {
  const updateInterval = Date.now() - updaterStatus.lastUpdateCheck;
  const updateFrequency = Number(config.updateFrequency) * 24 * 60 * 60 * 1000;
  createWindow();
  if (updateInterval >= updateFrequency) {
    autoUpdater.checkForUpdatesAndNotify();
    updaterStatus.lastUpdateCheck = Date.now();
    writeFile("updaterStatus.json", JSON.stringify(updaterStatus, null, "  "));
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
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function writeFile(file, data) {
  try {
    fs.writeFile(file, data, (err) => {});
  } catch (err) {
    console.log(err);
  }
}
