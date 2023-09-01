let getPlatform;

const writeFile = () => api.writeFile;
let _version;
let osType;
let osRelease;
let isPackaged;
api.invoke("get-os-type").then((result) => (osType = result));
api.invoke("get-os-release").then((result) => (osRelease = result));
api.invoke("get-platform").then((result) => (getPlatform = result));
api.invoke("get-version").then((result) => (_version = result));
api.invoke("is-packaged").then((result) => (isPackaged = result));
api.invoke("messages").then((res) => {
  messages = res;
});
api.invoke("language").then((res) => {
  lang = res;
});

let config;
let updaterStatus;
let updateURL;
let language;
let theme;

let checkUpdateClicked = false;
let updaterCreated = false;
let progressBarCreated = false;
let updatePending = false;

let dsMode = "adb";
const selectedADBDevices = new Set();
const selectedFbDevices = new Set();

function renderNavbar(elements, language) {
  const locale = lang;
  $("#navbar").empty();
  Object.keys(elements).forEach((element) => {
    $("#navbar").append(
      `<div class="mb-3 categories-div">
      <button
        class="btn btn-primary categories-btn"
        data-bs-toggle="collapse"
        data-bs-target="#${element}-categories-collapse"
      >
        ${locale[element].navbar}
      </button>
      <div id="${element}-categories-collapse" class="collapse">

      </div>
    </div>`
    );
    Object.keys(elements[element].items).forEach((e) => {
      $(`#${element}-categories-collapse`).append(
        `<p class="operations user-select-none" value="${element}.items.${e}" onclick="switchOpr($(this).attr('value'))">${locale[element].items[e].navbar}</p>`
      );
    });
  });
}

function generateTitle(opArea, title, subtitle) {
  opArea.append(`<h4 id="title">${title}</h4>`);
  if (subtitle != undefined) {
    opArea.append(`<h5 id="subtitle" class="text-muted">${subtitle}</h5>`);
    $("#operation-area").find("#subtitle").addClass("mb-3");
  } else {
    $("#operation-area").find("#title").addClass("mb-3");
  }
}
function generateContents(opArea, operation, operationLang) {
  const content = operation.content;
  const contentLang = operationLang.content;
  for (let i in content) {
    switch (content[i][0]) {
      case "radio":
        const radio = `<div class="form-check">
                        <input class="form-check-input" type="radio" name="${operation.name}" id="${content[i][1]}" value="${content[i][1]}">
                        <label class="form-check-label" for="${content[i][1]}">
                          ${contentLang[i][1]}
                        </label>
                      </div>`;
        opArea.append(radio);
        console.log(content[i]);
        // 若 UI.js 中 content 下第三項爲 checked 則將其設爲“已經勾選”
        if (content[i][2] == "checked") {
          opArea.find(`#${content[i][1]}`).prop("checked", true);
        }
        break;
      case "input":
        opArea.append(`
        <input id="${content[i][1]}" class="extra-input mb-3" type="text" placeholder="${contentLang[i][2]}" >
        `);
        break;
      case "file":
        opArea.append(`<div class="mb-3">
          <label class="btn btn-primary" for="file-input">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
            <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
          </svg>
            ${messages.ui.fileSelectorBtn}
          </label>
          <input class="d-none file-input" type="file" name="${operation.name}" id="file-input" accept="${content[i][2]}"/>
          <h5 id="file-path" class="user-select-none">${messages.ui.fileSelectorDefault}</h5>
        </div>`);
        break;
      default:
        break;
    }
  }
}

function keyPath2obj(path, initial) {
  const output = path.split(".").reduce((object, property) => {
    return object[property];
  }, initial);
  return output;
}
function updateSettings(name, value) {
  config[name] = value;
  switchOpr("settings.items.settings");
}
function generateSettings(opArea) {
  Object.keys(settings).forEach((e) => {
    const curSet = settings[e];
    switch (curSet.type) {
      case "dropdown":
        console.log(curSet.name);
        opArea.append(`<h6>${messages.settings[curSet.name]}
        <div class="dropdown mb-2 d-inline">
          <button class="btn btn-secondary dropdown-toggle d-inline" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${config[curSet.name]}
          </button>

          <ul class="dropdown-menu" id="${curSet.name}-menu">
          
          </ul>
        </div>
        
        </h6>
        
        `);
        for (let i of curSet.options) {
          $(`#${curSet.name}-menu`).append(`<li>
            <a class="dropdown-item" href="javascript:void(0)" onclick="updateSettings('${curSet.name}','${i}')">${i}</a>
          </li>`);
        }
      default:
        break;
    }
  });
}

function renderAbouts(opArea) {
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

  const crVersion = parseInt(raw[2], 10);
  opArea.append(`<div class="card mb-2">
    <div class="card-body">
      <h6 class="card-title">${messages.info.appVersion}${_version}</h6>
      <h6 class="card-title">${messages.info.chromeVersion}${crVersion}</h6>
      <h6 class="card-title">${messages.info.osType}${osType}</h6>
      <h6 class="card-title">${messages.info.osVersion}${osRelease}</h6>
    </div>
  </div>`);
}

function saveSettings() {
  console.log(JSON.stringify(config, null, "  "));

  api.writeFile("./config.json", JSON.stringify(config, null, "  "));
  printLogs("main", messages.alert.restartAlert);
  // (err) => {
  //   alert(
  //     messages.alert.restartAlert[language],
  //     messages.alert.restartAlertTitle[language]
  //   );
  // }
}

let latestIndex = "";

function downloadingUI(url) {
  const newIndex = localStorage.getItem("newIndex");
  if (getPlatform == "linux") {
    if (alert(messages.alert.windowsOnlyAlert[lang])) {
      api.send("download-update", [config.channel, newIndex]);
    }
  } else {
    api.send("download-update", [config.channel, newIndex]);
  }

  const updater = $("#operation-area").find("#eaf-updater");
  updater.find("#download-update-btn").addClass("disabled");
}

async function showUpdates(updaterArea, newIndex, updateLocalStorage) {
  progressBarCreated = false;

  let latestVersion;
  let changelog;

  if (updateLocalStorage) {
    latestVersion = await getURL(
      `${config.updateURL}/${config.channel}/latestVersion`
    );
    changelog = await getURL(
      `${config.updateURL}/${config.channel}/changelog_${language}`
    );
    localStorage.setItem("changelog", changelog);
    localStorage.setItem("newVer", latestVersion);
  }

  latestVersion = localStorage.getItem("newVer");
  changelog = localStorage.getItem("changelog");

  let finalURL = `${config.downloadURL}${config.channel}-${newIndex}/`;
  switch (osType) {
    case "Windows_NT":
      finalURL += "setup.exe";
      break;
    case "Linux":
      finalURL += "easy_adb_fastboot-linux.tar.gz";
  }

  updaterArea.empty();
  updaelement += "</tbody></table>";
  terArea.append(`<h5 class="card-title ">${messages.update.updateFound}</h5>`);
  updaterArea.append(
    `<h6 class="card-title text-muted">${_version} &rarr; ${latestVersion}</h6>`
  );
  updaterArea.append(
    `<p>
      <a
        data-bs-toggle="collapse"
        href="#full-changelog"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        ${messages.update.viewFullChangelog}
      </a>
    </p>
    `
  );
  updaterArea.append(
    `<div class="collapse" id="full-changelog">
      <div>${changelog}</div>
    </div>`
  );
  updaterArea.append(
    `
    <button class="btn btn-info" id="download-update-btn" onclick="downloadingUI('${finalURL}');">
      ${messages.update.downloadUpdate}
    </button>
    `
  );
  checkUpdateClicked = false;
}

async function getURL(url) {
  let response = await fetch(url);
  let text = await response.text();
  return text;
}

async function checkUpdatesUI() {
  if (!checkUpdateClicked) {
    if (!updaterCreated) {
      $("#operation-area").append(`<div class="card mb-2">
    <div id="eaf-updater" class="card-body">
    <div class="d-flex align-items-center m-2">
      <p class="mb-0 h5 text-muted">${messages.update.checkingUpdate}</p>
      <div
        class="spinner-border spinner-border-sm ms-auto"
        role="status"
        aria-hidden="true"
      ></div>
    </div>
    </div>`);
    }
    updaterCreated = true;
  }
  const indexURL = config.updateURL + config.channel + "/latestUpdateIndex";
  const newIndex = Number(await getURL(indexURL));
  console.log(localStorage.getItem("newIndex"));
  let updateLocalStorage = false;

  if (!localStorage.getItem("newIndex")) {
    if (newIndex > Number(localStorage.getItem("newIndex"))) {
      localStorage.setItem("newIndex", newIndex);
      updateLocalStorage = true;
    }
  }

  const eafUpdater = $("#operation-area").find("#eaf-updater");
  console.log(newIndex, config.updateIndex);
  if (newIndex > config.updateIndex) {
    showUpdates(eafUpdater, newIndex, updateLocalStorage);
  } else {
    eafUpdater.empty();
    $(eafUpdater).append(
      `<p class="mb-0 h5 text-muted">${messages.update.noUpdates}</p>`
    );
  }
  checkUpdateClicked = true;
}

function renderUpdater(opArea) {
  opArea.append(`
    <div class="alert alert-info" role="alert">
      ${messages.update.deprecated}
    </div>
    <button class="btn btn-info mb-2" onclick="checkUpdatesUI();" >${messages.update.updateEafBtn}</button>
  `);
}

function clearUpdateCache() {
  localStorage.removeItem("newIndex");
  localStorage.removeItem("newVer");
  localStorage.removeItem("changelog");
}

function generateClearCacheBtn(opArea) {
  opArea.append(`
    <button class="btn btn-secondary mb-2" onclick="clearUpdateCache();">${messages.settings.clearCache}</button>
  `);
}
function renderSettings(opArea) {
  generateSettings(opArea);
  generateClearCacheBtn(opArea);
  renderAbouts(opArea);

  opArea.append(`<button class="btn btn-primary" onclick="saveSettings()">
    ${messages.ui.saveSettingsBtn}
  </button>`);
}

function switchOpr(keyPath) {
  console.log(keyPath);
  const target = keyPath2obj(keyPath, oprs);
  const langTarget = keyPath2obj(keyPath, lang);
  const opArea = $("#operation-area");
  opArea.empty();

  generateTitle(opArea, langTarget.title, langTarget.subtitle);
  if (target.needUnlock) {
    opArea.append(
      `<div class="alert alert-info user-select-none">${messages.ui.unlockAlertMsg}</div>`
    );
  } else {
    opArea.append(`<div style="width:100%"></div>`);
  }
  if (keyPath == "fastboot.items.boot") {
    opArea.append(
      `<div class="alert alert-info" role="alert">${messages.tips.boot}</div>`
    );
  }
  generateContents(opArea, target, langTarget);
  opArea.append(`<div></div>`);
  if (!target.noStartButton) {
    opArea.append(
      `<button
      type="button"
      class="btn btn-primary startAction-btn border-0"
      id="${target.name}-btn"
      onclick="runScript('${keyPath}','${target.name}')"
    >
      ${messages.ui.startBtn}
    </button>`
    );
  }
  if (keyPath == "settings.items.settings") {
    renderSettings(opArea);
  }
  if (keyPath == "settings.items.updater") {
    renderUpdater(opArea);
  }
  checkUpdateClicked = false;
  updaterCreated = false;
  progressBarCreated = false;

  $("#operation-area")
    .find("#input")
    .on("focus", function (e) {
      e.stopPropagation();
      console.log(document.querySelector(`input:checked`));
      $("#other").prop("checked", true);
    });
  $("#operation-area")
    .find("#other")
    .on("click", function (e) {
      e.stopPropagation();
      $("#input").trigger("focus");
    });
}

function printLogs(channel, data) {
  const logsOutput = document.getElementById("logs-output");
  console.log(data);
  if (!$(`#${channel}-logs`).length) {
    $("#logs-with-channels").append(`<div class="accordion-item" id="${channel}-logs-item">
  <h2 class="accordion-header">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${channel}-logs"
      aria-expanded="true" aria-controls="collapseOne">
      ${channel}
    </button>
  </h2>
  <div id="${channel}-logs" class="accordion-collapse collapse">
    <div class="accordion-body logs-body">
      <p id="${channel}-logs-body" class="font-monospace"></p>
      <button class="btn btn-primary float-end" onclick="cleanLogs('${channel}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
          <path
            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg></button>
    </div>
  </div>
</div>`);
  }
  $(`#${channel}-logs-body`).append(data);
}

function runScript(path, name) {
  let fileExtension = "";
  let execDir = "";
  if (getPlatform == "win32") {
    execDir = ".\\platform-tools-win\\";
    fileExtension = ".exe";
  }
  if (getPlatform == "linux") {
    execDir = "./platform-tools-linux/";
  }
  const scripts = keyPath2obj(path, oprs).script;

  for (let commandList of scripts) {
    let params = [];
    let execFile = "";
    let operation = "";
    for (const j in commandList) {
      if (j == 1) {
        operation = commandList[j];
      }

      if (j == 0) {
        switch (commandList[j]) {
          case "adb":
            execFile = execDir + "adb" + fileExtension;
            break;
          case "fastboot":
            execFile = execDir + "fastboot" + fileExtension;
            break;
          default:
            break;
        }
      } else {
        switch (commandList[j]) {
          case "$radio":
            if (!(readRadio(name) == "system" && operation == "reboot")) {
              params.push(readRadio(name));
            }

            break;
          case "$file":
            params.push(readFileSelector("file-input"));
            break;
          default:
            params.push(commandList[j]);
            break;
        }
      }
    }
    let mode = path.split(".")[0];
    let hint = "Running command: ";
    hint += commandList[0];
    params.forEach((param) => (hint += " " + param));
    printLogs("main", hint + "</br>");
    switch (mode) {
      case "system":
      case "recovery":
        if (selectedADBDevices.size) {
          printLogs(
            "main",
            `Running on devices: ${Array.from(selectedADBDevices)}</br>`
          );
          for (let sn of selectedADBDevices) {
            api.runCommand(execFile, ["-s", sn, ...params]);
          }
        } else {
          api.runCommand(execFile, params);
        }
      case "fastboot":
        if (selectedFbDevices.size) {
          printLogs(
            "main",
            `Running on devices: ${Array.from(selectedFbDevices)}</br>`
          );
          for (let sn of selectedFbDevices) {
            api.runCommand(execFile, ["-s", sn, ...params]);
          }
        } else {
          api.runCommand(execFile, params);
        }
    }
  }
}
function readRadio(name) {
  const checkedRadio = document.querySelector(
    `input[name="${name}"]:checked`
  ).id;
  if (checkedRadio == "other") {
    return $("#operation-area").find("#input").val();
  } else {
    return $(`#${checkedRadio}`).val();
  }
}
function readFileSelector(name) {
  return document.getElementById(name).files[0].path;
}
function updateProgress(progress) {
  const updater = $("#operation-area").find("#eaf-updater");
  updater.find("#download-update-btn").hide();
  if (!progressBarCreated) {
    updater.append(
      `<div class="progress">
        <div id="download-progress" class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style="width: 0%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>`
    );
    progressBarCreated = true;
  }
  updaelement += "</tbody></table>";
  ter.find("#download-progress").css("width", progress + "%");
}

function cleanLogs(channel) {
  $(`#${channel}-logs-item`).remove();

}

const renderUI = () =>
  $(function () {
    api.handle("found-devices", (result) => {
      const mode = result[0];
      const text = result[1];
      let devicesUnparsed;
      switch (mode) {
        case "adb":
          devicesUnparsed = text.replace(/\r\n/, "\n").split("\n");
          devicesUnparsed.shift();
          devicesUnparsed.splice(-2, 2);
          break;
        case "fb":
          console.log(`${text}`);
          devicesUnparsed = text.replace(/\r\n/, "\n").split("\n");
          devicesUnparsed.splice(-2, 2);
          if (getPlatform == "linux") {
            devicesUnparsed = devicesUnparsed.flatMap((element, index) => {
              if (index % 2) {
                return [];
              } else {
                return element;
              }
            });
          }
          console.log(devicesUnparsed);
          break;
        default:
          break;
      }

      const devices = devicesUnparsed.map((device) => device.split(/\t/));
      function showDevices(id, mode) {
        $(id).empty();
        let element = ``;
        devices.forEach(([sn, stat], index) => {
          element += `<tr>
            <th scope="row">${index + 1}</th>
            <td>${sn}</td>
            <td>${stat}</td>
            <td><div class="form-check">
            <input class="form-check-input select-device-${mode}" type="checkbox" value="" id="${sn}"`;

          switch (mode) {
            case "adb":
              if (selectedADBDevices.has(sn)) {
                element += "checked";
              }
              break;
            case "fb":
              if (selectedFbDevices.has(sn)) {
                element += "checked";
              }
            default:
              console.log("hi");
              break;
          }
          element += `></div></td></tr>`;
        });

        $(id).append(element);
      }

      switch (mode) {
        case "adb":
          showDevices("#ds-adb-tbody", mode);
          break;
        case "fb":
          showDevices("#ds-fb-tbody", mode);
          break;
        default:
          break;
      }
    });
    api.handle("print-log", ([channel, text]) => {
      printLogs(channel, text.replace(/\n/g, "</br>").replace(/ /g, "\u00a0"));
      // console.log(JSON.stringify(text))
    });

    api.handle("update-progress", (progress) => {
      console.log(progress);
      updateProgress(progress);
    });

    api.handle("update-complete", () => {
      printLogs("main", messages.alert.updateCompleteAlert);
      console.log("download complete!");
      $("#close-btn").empty();
      $("#close-btn")
        .append(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
      </svg>`);
    });

    $("html").attr("data-bs-theme", theme);
    if (theme == "dark") {
      $("style").append(`.winCtrl-btn {
      background-color: rgba(255, 255, 255, 0);
      color: white;
    }
    #close-btn:hover {
      background-color: brown;
    }
    #max-btn:hover,
    #min-btn:hover {
      background-color: #3c3642;
    }
    .operations:hover {
      color: white;
  }`);
    } else {
      $("style").append(`
    .winCtrl-btn {
    background-color: white;
  }
  #close-btn:hover {
    background-color: red;
  }
  #max-btn:hover,
  #min-btn:hover {
    background-color: darkgray;
  }
  .operations:hover {
    color: black;
  }
    `);
    }
    $("#close-btn").on("click", (e) => {
      e.preventDefault();
      api.send("close-window");
    });
    $("#max-btn").on("click", (e) => {
      e.preventDefault();
      api.send("maximize-window");
    });
    $("#min-btn").on("click", (e) => {
      e.preventDefault();
      api.send("minimize-window");
    });
    $("#sidebar").width(screen.width / 7);
    $("#logs").width((screen.width / 5) * 2.5);
    $("#operation-area").width($("#operation-area").width() / 1.2);
    $(window).on("resize", function () {
      $("#main-content").css(
        "height",
        `calc(100vh - ${$("#winCtrl-bar").height()}px)`
      );
    });
    $("#operation-area").on("change", "#file-input", function () {
      const realPath = document.getElementById("file-input").files[0].path;
      $("#file-path").text(realPath);
    });

    renderNavbar(oprs, language);
    $("#nothing-selected").text(messages.ui.nothingSelected);
    $("#devices-btn").text(messages.ui.deviceSelectorBtn);
    $("#ds-title").text(messages.devices.selectDevices);
    $("#ds-close-btn").text(messages.devices.closeBtn);
    $("#ds-save-btn").text(messages.devices.saveBtn);

    $("#ds-adb-tab").on("click", function () {
      dsMode = "adb";
    });
    $("#ds-fb-tab").on("click", function () {
      dsMode = "fb";
    });

    $("#ds-save-btn").on("click", function (e) {
      e.preventDefault();
      console.log();
      switch (dsMode) {
        case "adb":
          selectedADBDevices.clear();
          $(".select-device-adb:checked").each((index, element) => {
            selectedADBDevices.add(element.id);
          });
          console.log(selectedADBDevices);
          break;
        case "fb":
          selectedFbDevices.clear();
          $(".select-device-fb:checked").each((index, element) => {
            selectedFbDevices.add(element.id);
          });

          console.log(selectedFbDevices);
          break;
        default:
          break;
      }
    });
    $("#devices-btn,#reload-devices").on("click", () => {
      api.send("get-devices", "fb");
      api.send("get-devices", "adb");
    });

    api.send("resize");
  });

Promise.all([api.invoke("get-config"), api.invoke("get-updater-status")]).then(
  (resultArr) => {
    config = resultArr[0];
    updaterStatus = resultArr[1];

    updateURL = config.updateURL + config.channel + "/";
    console.log(config.updateURL + config.channel);
    language = config.language;
    theme = config.theme;
    if (config.language === "auto") {
      switch (navigator.language) {
        case "zh-TW":
        case "en-US":
          language = navigator.language;
          break;
        default:
          language = "en-US";
      }
    }

    if (config.theme === "auto") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      } else {
        theme = "light";
      }
    }
    renderUI();
  }
);
