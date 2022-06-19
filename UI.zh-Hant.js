const lang_zh = [{
    "navbar": "Fastboot",
    "content": [{
            "title": "重啟到",
            "name": "power-menu",
            "content": [
                ["input", "reboot_input", "其他模式"],
            ]
        }, {
            "title": "從鏡像啟動（免刷入需機器支援）",
            "name": "boot-menu"
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
            "title": "執行 flashing 指令",
            "name": "flashing-menu",
            "content": [
                ["input", "flashing_input", "自訂指令"],
            ]
        }, {
            "title": "執行 OEM 指令",
            "name": "oem-menu",
            "content": [

                ["input", "oem_input", "自訂OEM指令"],
            ]
        },
        {
            "title": "切換 A/B 分區",
            "name": "active-menu",
        }
    ]
}, {
    "navbar": "Recovery",
    "content": [{
        "title": "安裝 Recovery 卡刷包",
        "subtitle": "請在此刷入 magisk",
        "name": "sideload-menu",
    }]
}, {
    "navbar": "System",
    "content": [{
        "title": "將檔案傳送至 /sdcard",
        "name": "push-menu",
    }, {
        "title": "安裝 apk 檔案",
        "subtitle": "用於安裝 apk，非刷入 magisk",
        "name": "install-menu",
    }, {
        "title": "重啟到",
        "name": "system-power-menu",
        "content": [
            ["input", "system-reboot_input", "其他模式"],
        ]
    }]
}]
const startActionBtn_zh_hant = '開始'
const selectFile_zh_hant = '選擇檔案'