const child = require("child_process");
const { stdout, stderr } = require("process");

const adbPath = ".\\platform-tools\\adb.exe";
const fastbootPath = ".\\platform-tools\\fastboot.exe";

let foundDevices = [];
let selectedDevices = [];

child.exec(`${adbPath} start-server`, (error, stdout, stderr) => {
  console.log(stderr);
});

function selectDevice() {
  selectedDevices = [];
  for (x of foundDevices) {
    if ($("body").find(`#${x}`).is(":checked")) {
      selectedDevices.push(x);
    }
  }
  console.log(selectedDevices);
}

function startActionMultidevice(optmode, opt) {
  for (x of selectedDevices) {
    startAction(x, optmode, opt);
  }
}

function startAction(deviceSN, optmode, opt) {
  // 生成指令

  let hasRadio = true;
  let hasFile = false;
  let targetHasFile = ["sideload", "flash", "install", "push", "boot"];
  let targetHasNoRadio = ["sideload", "install", "push", "boot"];
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

  params.push("-s");
  params.push(deviceSN);

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

  let startTime = Date.now().toString();
  runCommand = child.spawn(cmdByArray, params);

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
  if (currentOprMode == "recovery" || currentOprMode == "system") {
    cmd = adbPath;
    callingExe = "adb";
  }

  cmd += " devices";

  child.exec(cmd, (error, stdout, stderr) => {
    for (x of stdout.split("\n")) {
      if (x) {
        temp1 = x.split(" ")[0].split("\t")[0];
        foundDevices.push(temp1);
      }
    }
    if (callingExe == "adb") {
      foundDevices.shift();
      foundDevices.pop();
    }
    renderDevices(foundDevices);
  });
}
