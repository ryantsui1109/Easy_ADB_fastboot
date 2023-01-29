const ipc = require("electron").ipcRenderer;
const getPlatform = require("os").platform;
const child = require("child_process");
const { stdout, stderr } = require("process");
const { Z_ASCII } = require("zlib");
const language = "zh_TW";

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
        `<p class="operations user-select-none" value="${element}.items.${e}" onclick="switchOpr($(this).attr('value'),'zh_TW')">${locale[element].items[e].title}</p>`
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
            ${fileSelectorBtn[language]}
          </label>
          <input class="d-none file-input" type="file" name="${operation.name}" id="file-input" accept="${content[i][2]}"/>
          <h5 id="file-path">${fileSelectorDefault[language]}</h5>
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

function switchOpr(keyPath, language) {
  const target = keyPath2obj(keyPath, oprs);
  const langTarget = keyPath2obj(keyPath, lang[language]);
  const opArea = $("#operation-area");
  opArea.empty();

  generateTitle(opArea, langTarget.title, langTarget.subtitle);
  if (target.needUnlock) {
    opArea.append(
      `<div class="alert alert-info">${unlockAlertMsg[language]}</div>`
    );
  } else {
    opArea.append(`<div style="width:100%"></div>`);
  }
  generateContents(opArea, target, langTarget);
  opArea.append(`<div></div>`);
  opArea.append(
    `<button
      type="button"
      class="btn btn-primary startAction-btn border-0"
      id="${target.name}-btn"
      onclick="runScript('${keyPath}','${target.name}')"
    >
      ${startBtn[language]}
    </button>`
  );
}

function printLogs(data) {
  $("#logs-output").append(`<p class="log-message font-monospace">${data}</p>`);
}
function runCommand(execFile, parameters) {
  cmd = child.spawn(execFile, parameters);
  console.log(execFile, parameters);
  cmd.stdout.on("data", (data) => {
    console.log(data);
    printLogs(data);
  });
  cmd.stderr.on("data", (data) => {
    console.log(data);
    printLogs(data);
  });
}
function runScript(path, name) {
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
  const scripts = keyPath2obj(path, oprs).script;

  for (let commandList of scripts) {
    let params = [];
    let execFile = "";
    for (const j of commandList) {
      switch (j) {
        case "adb":
          execFile = adbPath;
          break;
        case "fastboot":
          execFile = fastbootPath;
          break;
        case "$radio":
          params.push(readRadio(name));
          break;
        case "$file":
          params.push(readFileSelector("file-input"));
          break;
        default:
          params.push(j);
          break;
      }
    }
    runCommand(execFile, params);
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
  console.log(name);
  return document.getElementById(name).files[0].path;
}

$(function () {
  $("#close-btn").on("click", (e) => {
    e.preventDefault();
    ipc.send("close-window");
  });
  $("#max-btn").on("click", (e) => {
    e.preventDefault();
    ipc.send("maximize-window");
  });
  $("#min-btn").on("click", (e) => {
    e.preventDefault();
    ipc.send("minimize-window");
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
  $("#nothing-selected").text(nothingSelected[language]);
  renderNavbar(oprs, language);
  ipc.send("resize");
});
