let lang_zh = [{
    "navbar": "Fastboot",
    "content": [{
            "title": "重啟到",
            "name": "power-menu",
            "content": [
                ["input", "reboot_input", "其他模式"],
            ]
        }, {
            "title": "從鏡像啟動",
        },
        {
            "title": "將鏡像刷入分區",
            "name": "flash-menu",
            "content": [
                ["input", "flash_input", "欲刷入的分區"]
            ]
        }, {
            "title": "清除分區",
            "name": "erase-menu",
            "content": [
                ["input", "erase_input", "欲清除的分區"],
                ["check", "use_format", "使用格式化"],
            ]
        }, {
            "title": "Fastboot flashing",
            "name": "flashing-menu",
            "content": [
                ["input", "flashing_input", "自訂指令"],
            ]
        }, {
            "title": "Fastboot oem",
            "name": "oem-menu",
            "content": [

                ["input", "oem_input", "自訂OEM指令"],
            ]
        },
        {
            "title": "切換A/B分區",
            "name": "active-menu",
        }
    ]
}, {
    "navbar": "Recovery",
    "content": [{
        "title": "Sideload刷機包",
        "subtitle": "magisk請在此刷入",
        "name": "sideload-menu",
    }]
}, {
    "navbar": "System",
    "content": [{
        "title": "將檔案push至/sdcard",
        "name": "push-menu",
    }, {
        "title": "安裝apk檔案",
        "subtitle": "用於安裝apk，magisk請移步",
        "name": "install-menu",
    }, {
        "title": "重啟到",
        "name": "system-power-menu",
        "content": [
            ["input", "system-reboot_input", "其他模式"],
        ]
    }]
}]
let startActionBtn_zh_hant = '開始'