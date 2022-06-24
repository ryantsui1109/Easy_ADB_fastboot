const child = require('child_process');
const { stdout, stderr } = require('process');

const adbPath = '.\\platform-tools\\adb.exe'
const fastbootPath = '.\\platform-tools\\fastboot.exe'

let foundDevices = []

child.exec(`${adbPath} start-server`, (error, stdout, stderr) => {
    console.log(stderr)
})

function startAction(optmode, opt) {
    // 生成指令

    let hasRadio = true
    let hasFile = false
    let targetHasFile = ['sideload', 'flash', 'install', 'push', 'boot']
    let targetHasNoRadio = ['sideload', 'install', 'push', 'boot']
    let param = opt.split('-')[0]
    let params = []
    let cmdByArray = ''

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
        cmdByArray = fastbootPath
    }
    if (optmode == 'adb') {
        cmd = adbPath
        cmdByArray = fastbootPath
    }
    for (x of params) {
        cmd += ' '
        cmd += x
    }
    // child.exec(cmd, (error, stderr, stdout) => {
    //     console.log(error)
    //     console.log(stdout)
    //     console.log(stderr)
    //     if (error) {
    //         let errmsg = ''
    //         for (x of error.message.split('\n')) {
    //             errmsg += (`<p>${x}</p>`)
    //         }
    //         displayAlert(errmsg, 'danger')
    //     } else {
    //         let logmsg = ''
    //         for (x of stderr.split('\n')) {
    //             logmsg += (`<p>${x}</p>`)
    //         }
    //         displayAlert(logmsg, 'success')
    //     }
    // })
    let startTime = Date.now().toString()
    runCommand = child.spawn(cmdByArray, params)


    runCommand.stdout.on('data', (data) => {
        console.log(`${data}`);
        displayAlert(data, 'info', startTime)
    });

    runCommand.stderr.on('data', (data) => {
        console.log(`${data}`);
        displayAlert(data, 'info', startTime)
    });


}

function refreshDevices() {

    foundDevices = []
    let cmd = ''
    let callingExe = ''
    if (currentOprMode == 'fastboot') {
        cmd = fastbootPath
        callingExe = 'fastboot'
    }
    if (currentOprMode == 'recovery' || currentOprMode == 'system') {
        cmd = adbPath
        callingExe = 'adb'
    }

    cmd += ' devices'


    child.exec(cmd, (error, stdout, stderr) => {
        for (x of stdout.split('\n')) {
            if (x) {
                foundDevices.push(x.split('\t')[0])
            }
        }
        if (callingExe == 'adb') {
            foundDevices.shift()
            foundDevices.pop()
        }
        console.log(foundDevices)
    })
}