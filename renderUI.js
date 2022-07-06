// let oprs = [];
// let startActionBtn = "";
// let selectFile;
let currentOprMode = "fastboot";
let hasContent = false;
// oprs = oprs_en;
// startActionBtn = startActionBtn_en_us;
// selectFile = selectFile_en_us;

function displayAlert(msg, typ, alertId) {
  // 產生通知
  let alertDiv = $("body").find("#alertDiv");
  if ($("body").find(`#${alertId}`).length) {
    $("body")
      .find(`#${alertId}`)
      .append(
        `
            <h5>    
                ${msg}
            </h5>
            `
      );
  } else {
    let alertBox = `<div id="${alertId}" class="alert alert-${typ} alert-dismissible" role="alert" style="transition:0.2s;">
            <h5>    
            ${msg}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
            </button>
            </div>`;

    alertDiv.prepend(alertBox);
  }
}

function switchOprMode(oprmode) {
  // 切換標籤
  $(".container").hide();
  $(`#${oprmode}-operations`).show();

  $(".alerts").show();

  currentOprMode = oprmode;
}

function renderDevices(devices) {
  console.log(devices);
  $("body").find("#deviceList").empty();
  for (x of devices) {
    if (x) {
      $("body")
        .find("#deviceList")
        .append(
          `
            <div class="form-check align-self-center">
                <input class="form-check-input" type="checkbox" value="${x}" id="${x}" checked>
                <label class="form-check-label" for="${x}">
                    ${x}
                </label>
            </div>
            `
        );
    }
  }
}

jQuery(function () {
  function renderNavbar(items) {
    for (let x in items) {
      const item = oprs_multilang[x];
      // 從items參數讀取上方導引欄並推入
      $("#navbar").append(` <li clas ="nav-item">
            <a class="nav-link navbar-items" href="javascript:refreshDevices();" id="${item.navbar.toLowerCase()}" onclick="switchOprMode('${item.navbar.toLowerCase()}')"> 
            ${item.navbar}
             </a> 
             </li>
            `);
    }
  }

  function renderBody(oprs) {
    for (let x in oprs) {
      const item = oprs_multilang[x];

      $("body").append(
        ` <div class="container"id="${item.navbar.toLowerCase()}-operations"style="display:none;">
            </div>
            `
      );
      $("body").find("#fastboot-operations").show();
    }
  }

  function renderCards(oprs) {
    for (let x in oprs) {
      const opr = oprs[x];
      const opr_multilang = oprs_multilang[x];
      // console.log(opr_multilang);
      currentOpr = opr.navbar;

      for (let y in opr.items) {
        card = opr.items[y];
        let card_multilang = opr_multilang.items[y];
        // console.log(card_multilang);
        currentCard = card.name;
        //產生各式指令的卡片
        $("body")
          .find(`#${currentOpr.toLowerCase()}-operations `)
          .append(
            ` <div class="card rounded-lg "style="margin-bottom: 1.5rem;">
            <div class="card-body"
            id="${card.name}">
            <h3 class="card-title"id="${card.name}_title"> ${card_multilang.title} </h3> </div> </div>
            `
            // card.title為卡片的標題
          );
        if (card.subtitle != undefined) {
          // 若有，則產生副標題
          $("body")
            .find(`#${card.name}`)
            .append(
              ` <h5 class="card-subtitle mb-2 text-muted"id="${card.name}_subtitle"style="font-weight:380;"> ${card_multilang.subtitle} </h5>`
            );
        }
        // console.log(card_multilang);
        processOpt(card.content, card_multilang.content);
        // 開始按鈕
        $("body").find(`#${card.name}`).append(`
                <button type="button" class="btn btn-primary startAction-btn border-0" id="${
                  card.name
                }-btn" onclick="startActionMultidevice('${currentOpr.toLowerCase()}','${
          card.name
        }')">${startActionBtn_multilang}</button>`);
      }
    }
  }

  function processOptLang() {
    for (x in oprs_multilang) {
      opr_multilang = oprs_multilang[x];
      for (y in opr_multilang.items) {
        if (opr_multilang.items[y].content) {
          // console.log(opr_multilang.items[y].content);
        }
      }
    }
  }
  function processOpt(content, content_multilang) {
    if (content_multilang) {
      hasContent = true;
      console.log(hasContent);
    }else{
      hasContent=false
    }

    for (z in content) {
      opt = content[z];

      let displayText = opt[1].split("_")[1];
      if (hasContent) {
        if(content_multilang[opt[1]]){
          displayText = content_multilang[opt[1]];
        }
      }

      // if (displayText === "partition") {
      //   displayText = "other";
      // }
      // if (displayText == "get-unlock-ability") {
      //   displayText = "get_unlock_ability";
      // }
      if (opt[0] == "radio") {
        // 讀取items.js，並產生元素，radio為單選按鈕
        // 第一個選項設為預設，較整齊
        $("body")
          .find(`#${card.name}`)
          .append(
            `<div class="${card.name}">
                    <input class="form-check-input" type="radio" name="${card.name}" id="${opt[1]}">
                    <label class="form-check-label" id="${opt[1]}_radio" for="${opt[1]}" style="cursor: pointer;">
                            ${displayText}
                        </label>
                </div>`
          );

        if (opt[2] == "checked") {
          $("body").find(`#${opt[1]}`).attr("checked", "");
        }
      }

      if (opt[0] == "input") {
        // 產生文字輸入框
        $("body")
          .find(`#${card.name}`)
          .append(
            `
                    <input type="text" placeholder="${displayText}" id="${opt[1]}" style="border: 1px solid rgba(0,0,0,.125);border-radius:.25rem;margin-bottom:0.3rem;">
                    `
          );
      }

      if (opt[0] == "file") {
        let optName = opt[1];
        $("body")
          .find(`#${card.name}`)
          .append(
            `
                    <button class="btn btn-primary file-upload" id="${optName}_btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
                      <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                     </svg> 
                     ${selectFile_multilang}</button>
                    <input id="${optName}" type="file" name="name" style="display: none;" accept="${opt[2]}"/>
                    <h5 id="${optName}_path"></h5>
                    `
          );
        $("body")
          .find(`#${optName}_btn`)
          .on("click", function () {
            document.getElementById(`${optName}`).click();
          });
        document.getElementById(`${optName}`).onchange = function () {
          let realPath = document.getElementById(`${optName}`).files[0].path;
          $("body").find(`#${optName}_path`).text(realPath);
        };
      }
      if (opt[0] == "check") {
        // 產生勾選框
        $("body")
          .find(`#${card.name}`)
          .append(
            `
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="${opt[1]}">
                    <label class="form-check-label" id="${opt[1]}_label" for="${opt[1]}">
                        ${opt[2]}
                </label>
                    `
          );
      }
      if (opt[0] == "br") {
        // 針對排版產生換行符
        $("body").find(`#${card.name}`).append(`<br>`);
      }
    }
  }

  function processLang() {
    if (navigator.language.includes("zh")) {
      oprs_multilang = oprs_zh_tw;
      startActionBtn_multilang = startActionBtn_zh_tw;
      selectFile_multilang = selectFile_zh_tw;
    }else{
      oprs_multilang = oprs_en_us;
      startActionBtn_multilang = startActionBtn_en_us;
      selectFile_multilang = selectFile_en_us;
    }
  }
  processLang();
  renderNavbar(oprs);
  renderBody(oprs);
  renderCards(oprs);
  processOptLang();

});
