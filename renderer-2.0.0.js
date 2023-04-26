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

let config;
let updaterStatus;
let updateURL;
let language;
let theme;

let checkUpdateClicked = false;
let updaterCreated = false;
let progressBarCreated = false;
let updatePending = false;
function renderNavbar(elements, language) {
  const locale = lang[language];
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
        `<p class="operations user-select-none" value="${element}.items.${e}" onclick="switchOpr($(this).attr('value'))">${locale[element].items[e].title}</p>`
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
        if (content[i][2] == "checked") {
          opArea.find(`#${content[i][1]}`).attr("checked", "checked");
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
            ${messages.ui.fileSelectorBtn[language]}
          </label>
          <input class="d-none file-input" type="file" name="${operation.name}" id="file-input" accept="${content[i][2]}"/>
          <h5 id="file-path" class="user-select-none">${messages.ui.fileSelectorDefault[language]}</h5>
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
        opArea.append(`<h6>${messages.settings[curSet.name][language]}
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
      <h6 class="card-title">${messages.info.appVersion[language]}${_version}</h6>
      <h6 class="card-title">${messages.info.chromeVersion[language]}${crVersion}</h6>
      <h6 class="card-title">${messages.info.osType[language]}${osType}</h6>
      <h6 class="card-title">${messages.info.osVersion[language]}${osRelease}</h6>
    </div>
  </div>`);
}

function saveSettings() {
  console.log(JSON.stringify(config, null, "  "));
  writeFile("./config.json", JSON.stringify(config, null, "  "), (err) => {
    alert(
      messages.alert.restartAlert[language],
      messages.alert.restartAlertTitle[language]
    );
  });
}

let latestIndex = "";

function downloadingUI(url) {
  console.log(url)
  api.send('download-update', url);
  const updater = $("#operation-area").find("#eaf-updater");

}

async function showUpdates(updaterArea, newIndex) {
  progressBarCreated = false;
  const xhrVer = new XMLHttpRequest();
  let latestVersion = await getURL(
    `${config.updateURL}/${config.channel}/latestVersion`
  );
  let changelog = await getURL(
    `${config.updateURL}/${config.channel}/changelog_${language}`
  );
  let finalURL = `${config.downloadURL}${config.channel}-${newIndex}/`
  switch (osType) {
    case 'Windows_NT':
      finalURL += 'setup.exe'
      break;
    case 'Linux':
      finalURL += 'easy_adb_fastboot-linux.tar.gz'
  }

  updaterArea.empty();
  updaterArea.append(
    `<h5 class="card-title ">${messages.update.updateFound[language]}</h5>`
  );
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
        ${messages.update.viewFullChangelog[language]}
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
      ${messages.update.downloadUpdate[language]}
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
      <p class="mb-0 h5 text-muted">${messages.update.checkingUpdate[language]}</p>
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
  const eafUpdater = $("#operation-area").find("#eaf-updater");
  console.log(newIndex, config.updateIndex)
  if (newIndex > config.updateIndex) {
    showUpdates(eafUpdater, newIndex);
  } else {
    eafUpdater.empty();
    $(eafUpdater).append(
      `<p class="mb-0 h5 text-muted">${messages.update.noUpdates[language]}</p>`
    );
  }
  checkUpdateClicked = true;
}

function renderUpdater(opArea) {
  opArea.append(`
    <button class="btn btn-info mb-2" onclick="checkUpdatesUI();" >${messages.update.updateEafBtn[language]}</button>
  `);
}
function renderSettings(opArea) {
  generateSettings(opArea);
  renderAbouts(opArea);

  opArea.append(`<button class="btn btn-primary" onclick="saveSettings()">
    ${messages.ui.saveSettingsBtn[language]}
  </button>`);
}

function switchOpr(keyPath) {
  const target = keyPath2obj(keyPath, oprs);
  const langTarget = keyPath2obj(keyPath, lang[language]);
  const opArea = $("#operation-area");
  opArea.empty();

  generateTitle(opArea, langTarget.title, langTarget.subtitle);
  if (target.needUnlock) {
    opArea.append(
      `<div class="alert alert-info user-select-none">${messages.ui.unlockAlertMsg[language]}</div>`
    );
  } else {
    opArea.append(`<div style="width:100%"></div>`);
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
      ${messages.ui.startBtn[language]}
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
}

function printLogs(data) {
  const logsOutput = document.getElementById("logs-output");
  $("#logs-output").append(`<p class="log-message font-monospace">${data}</p>`);
  logsOutput.scrollTo(0, logsOutput.scrollHeight);
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
    api.runCommand(execFile, params);
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

const renderUI = () =>
  $(function () {
    api.handle("print-log", (text) => {
      printLogs(text);
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
    #logs-output {
      background-color: black;
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
  #logs-output {
    background-color: gray;
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

    $("#sidebar").width(screen.width / 5);
    $("#logs").width((screen.width / 5) * 2.5);
    // $("#operation-area").width(
    //   window.width - $("#sidebar").width() - $("#logs").width()
    // );
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
    $("#nothing-selected").text(messages.ui.nothingSelected[language]);
    renderNavbar(oprs, language);

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
