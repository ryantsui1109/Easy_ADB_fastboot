const child = require('child_process');

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