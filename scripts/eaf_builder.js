const {
  existsSync,
  rmSync,
  writeFileSync,
  createWriteStream,
  createReadStream,
  mkdirSync,
  write,
  renameSync,
} = require("fs");
const { type } = require("os");
const { https } = require("follow-redirects");
const builder = require("electron-builder");
const pkgInfo = require("../package.json");
const args = require("args-parser")(process.argv);
const buildInfo = require("./build.json");
const appConfig = require("../default_config.json");
const updaterStatus = require("../default_updaterStatus.json");
const downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, (res) => {
      console.log(`Downloading from ${url}`);
      res.pipe(file);
      file.on("finish", () => {
        resolve("Download completed");
      });
    });
  });

const decompress = require("decompress");

async function main() {
  if (args.h) {
    console.log("");
    console.log("=== Easy ADB and Fastboot Build Script ===");
    console.log("");
    console.log("-h    Display this message.");
    console.log("");
    console.log("-b    Build with configs.");
    console.log("-d    Download platform-tools (Automatically detect OS)");
    console.log("-v    Set build variant.")
    console.log("");
    console.log("Example: node .\\script\\eaf_builder.js -d=beta -d");
  } else {
    if (args.d) {
      const downloadPT = new Promise((resolve, reject) => {
        // download platform-tools
        console.log("Start downloading platform-tools");
        let downloadProcess;
        const platform = type();
        switch (platform) {
          case "Linux":
            downloadProcess = downloadFile(
              "https://dl.google.com/android/repository/platform-tools-latest-linux.zip",
              "platform-tools.zip"
            );
            break;
          case "Windows_NT":
            downloadProcess = downloadFile(
              "https://dl.google.com/android/repository/platform-tools-latest-windows.zip",
              "platform-tools.zip"
            );
            break;
          default:
            reject("Platform currently not supported!");
            break;
        }
        downloadProcess.then((result) => {
          console.log(result);
          if (existsSync("platform-tools.zip")) {
            console.log("Unzipping platform-tools.zip");
            decompress("platform-tools.zip", ".")
              .then((files) => {
                switch (platform) {
                  case "Linux":
                    rmSync("platform-tools-linux", {
                      recursive: true,
                      force: true,
                    });
                    renameSync("platform-tools", "platform-tools-linux");
                    break;
                  case "Windows_NT":
                    rmSync("platform-tools-win", {
                      recursive: true,
                      force: true,
                    });
                    renameSync("platform-tools", "platform-tools-win");
                    break;
                  default:
                    break;
                }
                resolve("Unzip finished");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      });
      await downloadPT
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const checkArgs = new Promise((resolve, reject) => {
      args.v?resolve("OK"):reject("Build variant must be set.")
    });
    await checkArgs
      .then((result) => {
        console.log(result);
        appConfig.variant=args.v
        writeFileSync("config.json", JSON.stringify(appConfig, null, "  "));
        writeFileSync(
          "updaterStatus.json",
          JSON.stringify(updaterStatus, null, "  ")
        );
        if (args.b) {
          console.log("Start building");
          if (args.c !== "release") {
            buildInfo.appId += "." + args.c;
          }

          builder.build({ config: buildInfo });
        }
      })
      .catch((result) => {
        console.log(result);
      });
  }
}
main();
