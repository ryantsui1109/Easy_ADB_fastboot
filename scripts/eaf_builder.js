const {
  existsSync,
  rmSync,
  writeFileSync,
  createWriteStream,
  mkdirSync,
  write,
} = require("fs");
const { type } = require("os");
const { https } = require("follow-redirects");
const builder = require("electron-builder");
const pkgInfo = require("../package.json");
function buildAPP(args) {
  const buildConfig = require("./build.json");

  if (!args.a) {
    buildConfig.appId = "io.github.ryantsui1109.eaf";
    if (args.c != "release") {
      buildConfig.appId += "." + args.c;
    }
  } else {
    buildConfig.appId = args.a;
  }
  if (args.b) {
    console.log("Start building.");
    try {
      mkdirSync("dist");
    } catch (error) {
      console.log('"dist" exist!');
    }

    writeFileSync(
      "dist/buildInfo.txt",
      `Version: ${pkgInfo.version}\nUpdate Index: ${args.i}`
    );
    builder.build({
      config: buildConfig,
    });
  }
}
function configure(args) {
  const config = require("../default_config.json");
  const updaterStatus = require("../default_updaterStatus.json");
  const cleanBeforeBuild = ["updaterStatus.json", "config.json", "update.exe"];
  cleanBeforeBuild.forEach((e) => {
    if (existsSync(e)) {
      rmSync(e);
    }
  });
  config.channel = args.c;
  config.updateIndex = args.i;
  writeFileSync("config.json", JSON.stringify(config, null, "  "));
  writeFileSync(
    "updaterStatus.json",
    JSON.stringify(updaterStatus, null, "  ")
  );
}

function checkArgs(arguments) {
  if (!arguments.d) {
    let conditions = 0;
    arguments.c ? conditions++ : console.error("Update channel must be set.");
    Number.isInteger(Number(arguments.i))
      ? conditions++
      : console.error("Update index must be set as an integer.");

    if (conditions == 2) {
      return true;
    } else {
      console.log(
        '\nFor more help, please type "node .\\scripts\\eaf_builder.js -h".'
      );
    }
  }
}
const downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, (res) => {
      console.log(`Downloading from ${url}`);
      res.pipe(file);

      file.on("finish", () => {
        resolve("done!");
      });
    });
  });
function main() {
  const args = require("args-parser")(process.argv);

  if (args.h) {
    console.log("");
    console.log("=== Easy ADB and Fastboot Build Script===");
    console.log("");
    console.log("-h    Display this message.");
    console.log("");
    console.log(
      "-a    Set AppID for this build (default: io.github.ryantsui1109.[channel])."
    );
    console.log("-b    Build with configs.");
    console.log("-c    Set update channel for this build.");
    console.log("-d    Download platform-tools");
    console.log("-i    Set update index for this build.");
    console.log("");
    console.log("Example: node .\\script\\eaf_builder.js -c=beta -i=6");
  } else {
    if (args.d) {
      console.log("Start downloading platform-tools");
      switch (type()) {
        case "Linux":
          break;
        case "Windows_NT":
          downloadFile(
            "https://dl.google.com/android/repository/platform-tools-latest-windows.zip",
            "platform-tools-windows.zip"
          );
          break;
        default:
          console.log("Platform currently not supported!");
          break;
      }
    }
    if (checkArgs(args)) {
      console.log("");
      console.log("Update channel: " + args.c);
      console.log("Update index: " + args.i);
      console.log("-----------------------------------------");
      console.log("");
      console.log("Start configuring.");
      configure(args);

      buildAPP(args);
    }
  }
}
main();
