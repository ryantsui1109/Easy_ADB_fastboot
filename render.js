let oprs = []
let startActionBtn = ''
if (navigator.language.includes('zh')) {
    oprs = oprs_zh_hant
    startActionBtn = startActionBtn_zh_hant
} else {
    oprs = oprs_en
    startActionBtn = startActionBtn_en
}

const child = require('child_process');
const adbPath = '.\\platform-tools\\adb.exe'
const fastbootPath = '.\\platform-tools\\fastboot.exe'

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

    if (param == 'flashing' && document.getElementById('use_oem').checked) {
        param = 'oem'
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
            if (opt[0] == 'radio') {
                // 讀取items.js，並產生元素，radio為單選按鈕
                if (opt[2] == 'checked') {
                    // 第一個選項設為預設，較整齊
                    $('body').find(`#${card.name}`).append(
                        `<div class="${card.name}">
                    <input class="form-check-input" type="radio" name="${card.name}" id="${opt[1]}" checked>
                    <label class="form-check-label" for="${card.name}${Number(z)+1}">
                            ${displayText}
                        </label>
                </div>`
                    )
                } else {
                    $('body').find(`#${card.name}`).append(
                        `<div class="${card.name}">
                    <input class="form-check-input" type="radio" name="${card.name}" id="${opt[1]}">
                    <label class="form-check-label" for="${card.name}${Number(z)+1}">
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
                // 產生檔案選擇器
                $('body').find(`#${card.name}`).append(
                    `<input type="file" id="${opt[1]}">`
                )
            }
            if (opt[0] == 'check') {
                // 產生勾選框
                $('body').find(`#${card.name}`).append(
                    `
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="${opt[1]}">
                    <label class="form-check-label" for="flexCheckDefault">
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
                    <h4 class="card-title">${card.title}</h4></div></div>`
                    // card.title為卡片的標題
                )
                if (card.subtitle != undefined) {
                    // 若有，則產生副標題
                    $('body').find(`#${card.name}`).append(
                        `<h5 class="card-subtitle mb-2 text-muted">${card.subtitle}</h5>`
                    )
                }
                processOpt(card.content)
                    // 開始按鈕
                $('body').find(`#${card.name}`).append(`
                <button type="button" class="btn btn-primary" id="${card.name}-btn" onclick="startAction('${currentOpr.toLowerCase()}','${card.name}')">${startActionBtn}</button>`)
            }
        }
    }
    renderNavbar(oprs)
    renderBody(oprs)
    renderCards(oprs)
});