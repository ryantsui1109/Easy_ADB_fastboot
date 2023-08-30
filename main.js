const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const isPackaged = require("electron-is-packaged").isPackaged;
const { download } = require("electron-dl");
const child_process = require("child_process");
const fs = require("fs");
const os = require("os");
const platform = os.platform();
const { autoUpdater } = require("electron-updater");
const { INSPECT_MAX_BYTES } = require("buffer");

let channel = app.getVersion().split("-")[1];

if (!channel) {
  channel = "latest";
}

autoUpdater.channel = channel;
console.log(autoUpdater.channel);

let config, updaterStatus, lang, messages;
if (isPackaged) {
  config = require("../../config.json");
  updaterStatus = require("../../updaterStatus.json");
} else {
  config = require("./config.json");
  updaterStatus = require("./updaterStatus.json");
}

console.log(app.getPath("home"));

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
  ipcMain.on("download-update", async (e, args) => {
    if (!fs.existsSync(app.getPath("home") + "/.eaf")) {
      fs.mkdirSync(app.getPath("home") + "/.eaf");
    }
    const channel = args[0];
    const newIndex = args[1];
    if (platform == "linux") {
      shell.openExternal(
        `https://github.com/ryantsui1109/eaf-binary/releases/tag/${channel}-${newIndex}`
      );
    } else {
      const url = `${config.downloadURL}${channel}-${newIndex}/setup.exe`;
      await download(win, url, {
        showProgressBar: true,
        directory: app.getPath("home") + "/.eaf",
        filename: "update.exe",
        overwrite: true,
        onProgress: (progress) =>
          win.webContents.send(
            "update-progress",
            Math.floor(progress.percent * 100)
          ),
        onCompleted: () => {
          win.webContents.send("update-complete");
          updaterStatus.downloadComplete = true;
        },
      }).catch((err) => {
        console.log(err);
      });
    }
  });

  ipcMain.on("run-command", (e, command, params) => {
    const process = child_process.spawn(command, params);
    process.stderr.on("data", (data) => {
      console.log(`${data}`);
      win.webContents.send("print-log", `${data}`);
    });
    process.stdout.on("data", (data) => {
      console.log(`${data}`);
      win.webContents.send("print-log", `${data}`);
    });
  });
  ipcMain.on("write-file", (e, fileName, data) => {
    try {
      fs.writeFile(fileName, data, (err) => {});
    } catch (err) {
      console.log(err);
    }
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
    // console.log(exec)
    function findDevice() {
      child_process.execFile(exec, ["devices"], (error, stdout, stderr) => {
        win.webContents.send("found-devices",[mode,stdout])
      });
    }
    findDevice();
  });
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
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();

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

    if (updaterStatus.downloadComplete) {
      console.log("Update found, installing");
      const cp = child_process.spawn(
        app.getPath("home") + "/.eaf" + "/update.exe",
        [],
        {
          detached: true,
          stdio: ["ignore", "ignore", "ignore"],
        }
      );
      cp.unref();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
