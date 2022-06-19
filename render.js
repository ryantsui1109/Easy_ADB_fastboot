let oprs = []
let startActionBtn = ''
let selectFile
    // if (navigator.language.includes('zh')) {
    //     oprs = oprs_zh_hant
    //     startActionBtn = startActionBtn_zh_hant
    // } else {
    //     oprs = oprs_en
    //     startActionBtn = startActionBtn_en
    // }
oprs = oprs_en
startActionBtn = startActionBtn_en
selectFile = selectFile_en

const { computeSafeArtifactNameIfNeeded } = require('app-builder-lib/out/platformPackager');
const child = require('child_process');


function displayAlert(msg, typ) {
    // 產生通知
    alertDiv = document.getElementById('alertDiv')
    var wrapper = document.createElement('div')
    wrapper.innerHTML = `<div class="alert alert-${typ} alert-dismissible" role="alert" style="transition:0.2s;">
        ${msg}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
    </button>
    </div>`

    alertDiv.prepend(wrapper)
}

function switchOprMode(oprmode) {
    // 切換標籤
    $('.container').hide();
    $(`#${oprmode}-operations`).show();
    $('.alerts').show();
}

function startAction(optmode, opt) {
    // 生成指令
    const adbPath = '.\\platform-tools\\adb.exe'
    const fastbootPath = '.\\platform-tools\\fastboot.exe'
    let hasRadio = true
    let hasFile = false
    let targetHasFile = ['sideload', 'flash', 'install', 'push', 'boot']
    let targetHasNoRadio = ['sideload', 'install', 'push', 'boot']
    let param = opt.split('-')[0]
    let params = []

    if (optmode != 'fastboot') { optmode = 'adb' }
    if (param == 'power' || param == 'system') { param = 'reboot' }
    if (param == 'active') { param = 'set_active' }

    if (targetHasNoRadio.includes(param)) { hasRadio = false }
    if (optmode == 'adb' && param == 'reboot') { hasRadio = true }

    if (targetHasFile.includes(param)) { hasFile = true }

    if (param == 'erase' && document.getElementById('use_format').checked) {
        param = 'format'
    }

    params.push(param);
    if (hasRadio) {
        let checkedRadio = document.querySelector(`input[name="${opt}"]:checked`).id
        if (checkedRadio.split('_')[1] == 'other') {
            params.push($(`#${checkedRadio.split('_')[0]}_input`).val())
        } else {
            let optTarget = ''
            if (checkedRadio.split('_')[1] == 'fastbootd') {
                optTarget = 'fastboot'
            } else {
                optTarget = checkedRadio.split('_')[1]
            }

            if (checkedRadio.split('_')[1] == 'system' && (param == 'reboot')) { optTarget = '' }
            if (checkedRadio.split('_')[1] == 'get-unlock-ability') { optTarget = 'get_unlock_ability' }
            if (optTarget) { params.push(optTarget) }
        }
    }

    if (hasFile) {
        params.push(document.getElementById(`${param}_file`).files[0].path)
    }
    if (param == 'push') { params.push('/sdcard/') }

    let cmd = ''
    if (optmode == 'fastboot') {
        cmd = fastbootPath
    }
    if (optmode == 'adb') {
        cmd = adbPath
    }
    for (x of params) {
        cmd += ' '
        cmd += x
    }
    child.exec(cmd, (error, stdout, stderr) => {
        if (error) {
            let errmsg = ''
            for (x of error.message.split('\n')) {
                errmsg += (`<p>${x}</p>`)
            }
            displayAlert(errmsg, 'danger')
        } else {
            let logmsg = ''
            for (x of stderr.split('\n')) {
                logmsg += (`<p>${x}</p>`)
            }
            displayAlert(logmsg, 'success')
        }
    })
}

function displayPath(target) {
    console.log(target)
}

jQuery(function() {
    function renderNavbar(items) {
        for (let x in items) {
            const item = items[x]
                // 從items參數讀取上方導引欄並推入
            $('#navbar').append(`
                <li class="nav-item">
                    <a class="nav-link" href="javascript:void(0)" id="${item.navbar.toLowerCase()}" onclick="switchOprMode('${item.navbar.toLowerCase()}')">${item.navbar}</a>
                </li>
                `);
        }
    }

    function renderBody(oprs) {
        for (let x in oprs) {
            const item = oprs[x]
            if (item.navbar == "Fastboot") {
                // 上方導引欄對應的conatiner，按照id執行
                // 預設啟動時顯示fastboot的操作
                $('body').append(
                    `
                <div class="container" id="${item.navbar.toLowerCase()}-operations" >
                </div>
                `
                );
            } else {
                // 對於非fastboot的操作，生成後隱藏
                $('body').append(`
                <div class="container" id="${item.navbar.toLowerCase()}-operations" style="display:none;">
                </div>
                `);
            }
        }
    }

    function processOpt(content) {
        for (z in content) {
            opt = content[z]
            let displayText = opt[1].split('_')[1]
            if (displayText === 'partition') {
                displayText = 'other'
            }
            if (displayText == 'get-unlock-ability') {
                displayText = 'get_unlock_ability'
            }
            if (opt[0] == 'radio') {
                // 讀取items.js，並產生元素，radio為單選按鈕
                if (opt[2] == 'checked') {
                    // 第一個選項設為預設，較整齊
                    $('body').find(`#${card.name}`).append(
                        `<div class="${card.name}">
                    <input class="form-check-input" type="radio" name="${card.name}" id="${opt[1]}" checked>
                    <label class="form-check-label" id="${opt[1]}_radio" for="${opt[1]}" style="cursor: pointer;">
                            ${displayText}
                        </label>
                </div>`
                    )
                } else {
                    $('body').find(`#${card.name}`).append(
                        `<div class="${card.name}">
                    <input class="form-check-input" type="radio" name="${card.name}" id="${opt[1]}">
                    <label class="form-check-label" id="${opt[1]}_radio" for="${opt[1]}">
                            ${displayText}
                        </label>
                </div>`
                    )
                }

            }
            if (opt[0] == 'input') {
                // 產生文字輸入框
                $('body').find(`#${card.name}`).append(
                    `
                    <input type="text" placeholder="${opt[2]}" id="${opt[1]}" style="border: 1px solid rgba(0,0,0,.125);border-radius:.25rem;">
                    `
                )
            }

            if (opt[0] == 'file') {
                let optName = opt[1]
                $('body').find(`#${card.name}`).append(
                    `
                    <button class="btn btn-primary" id="${optName}_btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
                      <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                     </svg> 
                     ${selectFile}</button>
                    <input id="${optName}" type="file" name="name" style="display: none;" />
                    <h5 id="${optName}_path"></h5>
                    `
                )
                $('body').find(`#${optName}_btn`).on('click', function() {
                    document.getElementById(`${optName}`).click()
                });
                document.getElementById(`${optName}`).onchange = function() {
                    let realPath = document.getElementById(`${optName}`).files[0].path
                    $('body').find(`#${optName}_path`).text(realPath);
                }
            }
            if (opt[0] == 'check') {
                // 產生勾選框
                $('body').find(`#${card.name}`).append(
                    `
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="${opt[1]}">
                    <label class="form-check-label" id="${opt[1]}_label" for="${opt[1]}">
                        ${opt[2]}
                </label>
                    `
                )
            }
            if (opt[0] == 'br') {
                // 針對排版產生換行符
                $('body').find(`#${card.name}`).append(`<br>`)
            }
        }
    }

    function renderCards(oprs) {
        for (let x in oprs) {
            const opr = oprs[x]
            currentOpr = opr.navbar;
            for (let y in opr.content) {
                card = opr.content[y]
                currentCard = card.name
                    //產生各式指令的卡片
                $('body').find(`#${ currentOpr.toLowerCase()}-operations`).append(
                    `<div class="card"style = "margin-bottom: 1rem;" >
                    <div class="card-body" id="${card.name}">
                    <h4 class="card-title" id="${card.name}_title">${card.title}</h4>
                    </div>
                    </div>`
                    // card.title為卡片的標題
                )
                if (card.subtitle != undefined) {
                    // 若有，則產生副標題
                    $('body').find(`#${card.name}`).append(
                        `<h5 class="card-subtitle mb-2 text-muted" id="${card.name}_subtitle" style="font-weight:380;">${card.subtitle}</h5>`
                    )
                }
                processOpt(card.content)
                    // 開始按鈕
                $('body').find(`#${card.name}`).append(`
                <button type="button" class="btn btn-primary startAction-btn" id="${card.name}-btn" onclick="startAction('${currentOpr.toLowerCase()}','${card.name}')">${startActionBtn}</button>`)
            }
        }
    }

    function processLang() {
        let lang = []
        if (navigator.language.includes('zh')) {
            lang = lang_zh
            startActionBtn = startActionBtn_zh_hant
            selectFile = selectFile_zh_hant
            for (let x of lang_zh) {
                for (let y of x.content) {
                    $('body').find(`#${y.name}_title`).text(y.title);
                    if (y.subtitle) {
                        $('body').find(`#${y.name}_subtitle`).text(y.subtitle)
                    }
                    for (let z in y.content) {
                        item = y.content[z]
                        if (item[0] == 'input') {
                            $('body').find(`#${item[1]}`).attr('placeholder', item[2]);
                        }
                        if (item[0] == 'check') {
                            $('body').find(`#${item[1]}_label`).text(item[2])
                        }
                        if (item[0] == 'radio') {
                            console.log(item[2])
                            console.log(`#${item[1]}_radio`)
                            $('body').find(`#${item[1]}_radio`).text(item[2])
                        }
                    }
                }
            }
            $('body').find('.custom-file-upload').text(``)
            $('body').find('.custom-file-upload').append(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
                        <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"/>
                        </svg> 
                    ${selectFile}`)
            $('body').find('.startAction-btn').text(startActionBtn)
        }
    }

    renderNavbar(oprs)
    renderBody(oprs)
    renderCards(oprs)
    processLang()

});