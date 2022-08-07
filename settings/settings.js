const shell = require("electron").shell;
const fs = require("fs");
const appInfo = JSON.parse(fs.readFileSync("./package.json"));
const defaultSettings = {
  language: "auto",
  darkMode: "auto",
};
const path = "./settings.json";
const appVersion = appInfo.version.split(".");
let settings = defaultSettings;
loadedSettings = JSON.parse(fs.readFileSync(path));

function copySettings() {
  currentSettingKeys = Object.keys(loadedSettings);

  for (x of currentSettingKeys) {
    settings[x] = loadedSettings[x];
  }
}

function changeSettings(option, setting) {
  settings[option] = setting;
  console.log(option, setting);
  console.log(JSON.stringify(settings, null, "  "));
  $("body").find(`#${option}`).text(`${setting}`);
}
function loadSettings(options, Opt) {
  $(`#${options}-options`).append(
    `<li>
            <a class="dropdown-item" href="javascript:changeSettings('${options}','${Opt}')">
                ${Opt}
            </a>
          </li>`
  );
}
_options = {
  language: ["auto", "zh-TW", "en-US"],
  darkMode: ["auto", "light", "dark"],
};

copySettings();

function openWithBrowser(url) {
  shell.openExternal(url);
}

function saveChanges() {
  console.log("Current Settings", JSON.stringify(settings, null, "  "));
  fs.writeFileSync("./settings.json", JSON.stringify(settings, null, "  "));
}

$(document).ready(function () {
  for (x of Object.keys(_options)) {
    $("body").find(`#${x}`).text(`${settings[x]}`);
    for (y of _options[x]) {
      loadSettings(x, y);
    }
  }

  $("#saveConfirmation").on("shown.bs.modal", function () {
    $("#pageContent").css({ opacity: 0.5 });
  });
  $("#uiver").text("UI Version: " + appVersion[0]);
  $("#fnver").text(`Function Version: ${appVersion[1]}.${appVersion[2]}`);
});
