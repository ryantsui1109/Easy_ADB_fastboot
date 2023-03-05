const { existsSync, rmSync, writeFileSync } = require("fs");
const builder = require("electron-builder");
function buildAPP(args) {
  const buildConfig = require("./build.json");

  if (!args.a) {
    buildConfig.appId = "io.github.ryantsui1109";
    if (args.c != "release") {
      buildConfig.appId += "." + args.c;
    }
  } else {
    buildConfig.appId = args.a;
  }
  builder.build({
    config: buildConfig,
  });
}
function configure(args) {
  const config = require("../default_config.json");
  if (existsSync("config.json")) {
    rmSync("config.json");
  }
  if (existsSync("update.exe")) {
    rmSync("update.exe");
  }
  config.channel = args.c;
  config.updateIndex = args.i;
  writeFileSync("config.json", JSON.stringify(config, null, "  "));
}

function checkArgs(arguments) {
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
    console.log("-c    Set update channel for this build.");
    console.log("-i    Set update index for this build.");
    console.log("");
    console.log("Example: node .\\script\\eaf_builder.js -c=beta -i=6");
  } else {
    if (checkArgs(args)) {
      console.log("");
      console.log("Update channel: " + args.c);
      console.log("Update index: " + args.i);
      console.log("-----------------------------------------");
      console.log("");
      console.log("Start configuring.");

      configure(args);
      
      console.log("Start building.");
      buildAPP(args);
    }
  }
}
main();
