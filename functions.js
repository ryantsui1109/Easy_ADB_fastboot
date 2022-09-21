const child = require("child_process");
const { stdout, stderr } = require("process");
const fs = require("fs");
const upath = require("upath");
const getPlatform = require("os").platform;
const isPackaged = require("electron-is-packaged").isPackaged;
let settings = "";
const { dirname } = require("path");
if (isPackaged) {
  settings = require(upath.toUnix(__dirname) + "/../../settings.json");
} else {
  settings = require("./settings.json");
}

let adbPath = "";
let fastbootPath = "";

if (getPlatform() == "win32") {
  adbPath = ".\\platform-tools-win\\adb.exe";
  fastbootPath = ".\\platform-tools-win\\fastboot.exe";
}

if (getPlatform() == "linux") {
  adbPath = "./platform-tools-linux/adb";
  fastbootPath = "./platform-tools-linux/fastboot";
}

let foundDevices = [];
let selectedDevices = [];

child.exec(`${adbPath} start-server`, (error, stdout, stderr) => {
  console.log(stderr);
});

function startActionMultidevice(optmode, opt, multipleCommands) {
  console.log(multipleCommands);
  if (selectedDevices.length == 0) {
    startAction(optmode, opt, null);
  } else {
    for (x of selectedDevices) {
      startAction(optmode, opt, x);
    }
  }
}

function startAction(optmode, opt, deviceSN) {
  // 生成指令

  let hasRadio = true;
  let hasFile = false;
  let targetHasFile = [
    "sideload",
    "flash",
    "install",
    "push",
    "boot",
    "update",
  ];
  let targetHasNoRadio = ["sideload", "install", "push", "boot", "update"];
  let param = opt.split("-")[0];
  let params = [];
  let cmdByArray = "";

  if (optmode != "fastboot") {
    optmode = "adb";
  }

  if (targetHasNoRadio.includes(param)) {
    hasRadio = false;
  }
  if (optmode == "adb" && param == "reboot") {
    hasRadio = true;
  }

  if (targetHasFile.includes(param)) {
    hasFile = true;
  }
  if (deviceSN != null) {
    params.push("-s");
    params.push(deviceSN);
  }

  if (param == "power" || param == "system") {
    param = "reboot";
  }
  if (param == "active") {
    param = "set_active";
  }

  if (param == "erase" && document.getElementById("use_format").checked) {
    param = "format";
  }

  params.push(param);
  if (hasRadio) {
    let checkedRadio = document.querySelector(
      `input[name="${opt}"]:checked`
    ).id;
    if (checkedRadio.split("_")[1] == "other") {
      params.push($(`#${checkedRadio.split("_")[0]}_input`).val());
    } else {
      let optTarget = "";
      if (checkedRadio.split("_")[1] == "fastbootd") {
        optTarget = "fastboot";
      } else {
        optTarget = checkedRadio.split("_")[1];
      }

      if (checkedRadio.split("_")[1] == "system" && param == "reboot") {
        optTarget = "";
      }
      if (checkedRadio.split("_")[1] == "get-unlock-ability") {
        optTarget = "get_unlock_ability";
      }
      if (optTarget) {
        params.push(optTarget);
      }
    }
  }

  if (hasFile) {
    params.push(document.getElementById(`${param}_file`).files[0].path);
  }
  if (param == "push") {
    params.push("/sdcard/");
  }

  if (optmode == "fastboot") {
    cmdByArray = fastbootPath;
  }
  if (optmode == "adb") {
    cmdByArray = adbPath;
  }
  console.log(cmdByArray, param);
  let startTime = Date.now().toString();
  runCommand = child.spawn(cmdByArray, params);
  console.log(cmdByArray, params);

  runCommand.stdout.on("data", (data) => {
    console.log(`${data}`);
    displayAlert(data, "info", startTime);
  });

  runCommand.stderr.on("data", (data) => {
    console.log(`${data}`);
    displayAlert(data, "info", startTime);
  });
}

function refreshDevices() {
  foundDevices = [];
  let cmd = "";
  let callingExe = "";
  if (currentOprMode == "fastboot") {
    cmd = fastbootPath;
    callingExe = "fastboot";
  }
  if (
    currentOprMode == "recovery" ||
    currentOprMode == "system" ||
    currentOprMode == "settings"
  ) {
    cmd = adbPath;
    callingExe = "adb";
  }

  cmd += " devices";

  let finddevice = child.execSync(cmd);
  output = finddevice.toString().split("\n");
  if (callingExe == "adb") {
    output.shift();
    output.pop();
    output.pop();
  }
  if (callingExe == "fastboot") {
    output.pop();
  }

  for (x of output) {
    foundDevices.push(x.split("\t")[0]);
  }

  renderDevices(foundDevices);
}

function selectDevice() {
  selectedDevices = [];

  for (x of foundDevices) {
    if ($("body").find(`#${x}`).is(":checked")) {
      selectedDevices.push(x);
    }
  }
}
