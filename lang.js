const lang = {
  "zh-TW": {
    system: {
      navbar: "ADB 操作 - 系統",
      items: {
        power: {
          title: "重啟",
          name: "system-power-menu",
          script: [["adb", "reboot", "$radio"]],
          content: [
            ["radio", "bootloader", "checked"],
            ["radio", "recovery"],
            ["radio", "fastbootd"],
            ["radio", "system"],
            ["radio", "sideload"],
            ["radio", "other"],
            ["input", "input", "其他模式"],
            ["br", ""],
            ["br", ""],
          ],
        },
        push: {
          title: "將檔案推送到 /sdcard",
          name: "push-menu",
          operation: "push",
          script: [["adb", "push", "$file", "/sdcard"]],
          content: [
            ["file", "file"],
            ["br", ""],
            ["br", ""],
          ],
        },
        install: {
          title: "安裝 APK",
          subtitle: "安裝 APK 用，非用於刷入 Magisk",
          name: "install-menu",
          operation: "install",
          script: [["adb", "install", "$file"]],
          content: [
            ["file", "file", ".apk,application/zip"],
            ["br", ""],
            ["br", ""],
          ],
        },
      },
    },
    recovery: {
      navbar: "ADB 操作 - Recovery",
      items: {
        sideload: {
          title: "安裝 Zip",
          subtitle: "請在此刷入 Magisk.apk",
          name: "sideload-menu",
          operation: "sideload",
          script: [["adb", "sideload", "$file"]],
          content: [
            ["file", "file", "application/zip,.apk"],
            ["br", ""],
            ["br", ""],
          ],
        },
      },
    },
    fastboot: {
      navbar: "Fastboot 操作",
      items: {
        power: {
          title: "重啟",
          name: "power-menu",
          needUnlock: false,
          script: [["fastboot", "reboot", "$radio"]],
          content: [
            ["radio", "bootloader", "checked"],
            ["radio", "recovery"],
            ["radio", "fastbootd"],
            ["radio", "system"],
            ["radio", "sideload"],
            ["radio", "other"],
            ["input", "input", "其他模式"],
            ["br", ""],
            ["br", ""],
          ],
        },
        boot: {
          title: "啟動鏡像",
          subtitle: "部分機型不支援",
          name: "boot-menu",
          needUnlock: true,
          script: [["fastboot", "boot", "$file"]],
          content: [
            ["file", "file", ".img,.bin"],
            ["br", ""],
            ["br", ""],
          ],
        },
        flash: {
          title: "刷入鏡像",
          name: "flash-menu",
          needUnlock: true,
          script: [["fastboot", "flash", "$radio", "$file"]],
          content: [
            ["radio", "boot", "checked"],
            ["radio", "recovery"],
            ["radio", "super"],
            ["radio", "system"],
            ["radio", "vendor"],
            ["radio", "data"],
            ["radio", "cache"],
            ["radio", "other"],
            ["input", "input", "其他分區"],
            ["br", ""],

            ["file", "file", ".img,.bin,.mbn,.txt,.zip"],
            ["br", ""],
            ["br", ""],
          ],
        },
        erase: {
          title: "擦除分區",
          name: "erase-menu",
          needUnlock: true,
          script: [["fastboot", "erase", "$radio"]],
          content: [
            ["radio", "boot", "checked"],
            ["radio", "recovery"],
            ["radio", "super"],
            ["radio", "system"],
            ["radio", "vendor"],
            ["radio", "cache"],
            ["radio", "other"],
            ["input", "input", "其他分區"],
            ["br", ""],
          ],
        },
        format: {
          title: "格式化分區",
          name: "format-menu",
          needUnlock: true,
          script: [["fastboot", "format", "$radio"]],
          content: [
            ["radio", "super"],
            ["radio", "system"],
            ["radio", "vendor"],
            ["radio", "cache"],
            ["radio", "userdata"],
            ["radio", "other"],
            ["input", "input", "其他分區"],
            ["br", ""],
          ],
        },
        flashing: {
          title: "flashing 指令",
          name: "flashing-menu",
          needUnlock: false,
          script: [["fastboot", "flashing", "$radio"]],
          content: [
            ["radio", "unlock", "checked"],
            ["radio", "lock"],
            ["radio", "unlock-critical"],
            ["radio", "lock-critical"],
            ["radio", "get-unlock-ability"],
            ["radio", "other"],
            ["input", "input", "其他指令"],
            ["br", ""],
          ],
        },
        oem: {
          title: "oem 指令",
          name: "oem-menu",
          needUnlock: true,
          script: [],
          content: [
            ["radio", "unlock", "checked"],
            ["radio", "lock"],
            ["radio", "unlock-critical"],
            ["radio", "lock-critical"],
            ["radio", "device-info"],
            ["radio", "other"],
            ["input", "input", "其他指令"],
            ["br", ""],
          ],
        },
        update: {
          title: "Fastboot update",
          name: "update-menu",
          needUnlock: true,
          script: [],
          content: [
            ["file", "file", "application/zip"],
            ["br", ""],
            ["br", ""],
          ],
        },
        getvar: {
          title: "取得變數",
          name: "getvar-menu",
          needUnlock: false,
          script: [["fastboot", "getvar", "$radio"]],
          content: [
            ["radio", "all", "checked"],
            ["radio", "（AB分區專用）current-slot"],
            ["radio", "unlocked"],
            ["radio", "（VAB分區專用）is-userspace"],
            ["radio", "（小米專用）anti"],
            ["radio", "other"],
            ["input", "input", "其他變數"],
            ["br", ""],
          ],
        },
        active: {
          title: "切換AB分區",
          name: "active-menu",
          needUnlock: true,
          script: [["fastboot", "set_active", "$radio"]],
          content: [
            ["radio", "a", "", "checked"],
            ["radio", "b", ""],
            ["br", ""],
          ],
        },
      },
    },
    devices: {
      navbar: "裝置",
      items: {
        devices: {
          title: "敬請期待",
          subtitle: "敬請期待",
          subtitle: "敬請期待",
          content: [],
        },
      },
    },
    settings: {
      navbar: "設定",
      items: {
        settings: {
          title: "設定",
          content: [],
        },
        updater: {
          title: "線上更新",
          content: [],
        },
      },
    },
  },
  "en-US": {
    system: {
      navbar: "System",
      items: {
        power: {
          title: "Reboot to",
          name: "system-power-menu",
          script: [["adb", "reboot", "$radio"]],
          content: [
            ["radio", "bootloader", "checked"],
            ["radio", "recovery"],
            ["radio", "fastbootd"],
            ["radio", "system"],
            ["radio", "sideload"],
            ["radio", "other"],
            ["input", "input", "Other target"],
            ["br", ""],
            ["br", ""],
          ],
        },
        push: {
          title: "Push file to /sdcard",
          name: "push-menu",
          operation: "push",
          script: [["adb", "push", "$file", "/sdcard"]],
          content: [
            ["file", "file"],
            ["br", ""],
            ["br", ""],
          ],
        },
        install: {
          title: "Install apk file",
          subtitle: "For installing apk, not for flashing magisk!",
          name: "install-menu",
          operation: "install",
          script: [["adb", "install", "$file"]],
          content: [
            ["file", "file", ".apk,application/zip"],
            ["br", ""],
            ["br", ""],
          ],
        },
      },
    },
    recovery: {
      navbar: "Recovery",
      items: {
        sideload: {
          title: "Sideload flashable zip",
          subtitle: "You can flash magisk here",
          name: "sideload-menu",
          operation: "sideload",
          script: [["adb", "sideload", "$file"]],
          content: [
            ["file", "file", "application/zip,.apk"],
            ["br", ""],
            ["br", ""],
          ],
        },
      },
    },
    fastboot: {
      navbar: "Fastboot",
      items: {
        power: {
          title: "Reboot to",
          name: "power-menu",
          needUnlock: false,
          script: [["fastboot", "reboot", "$radio"]],
          content: [
            ["radio", "bootloader", "checked"],
            ["radio", "recovery"],
            ["radio", "fastbootd"],
            ["radio", "system"],
            ["radio", "sideload"],
            ["radio", "other"],
            ["input", "input", "Other target"],
            ["br", ""],
            ["br", ""],
          ],
        },
        boot: {
          title: "Boot a image",
          subtitle: "Some models are not supported",
          name: "boot-menu",
          needUnlock: true,
          script: [["fastboot", "boot", "$file"]],
          content: [
            ["file", "file", ".img,.bin"],
            ["br", ""],
            ["br", ""],
          ],
        },
        flash: {
          title: "Flash image to partition",
          name: "flash-menu",
          needUnlock: true,
          script: [["fastboot", "flash", "$radio", "$file"]],
          content: [
            ["radio", "boot", "checked"],
            ["radio", "recovery"],
            ["radio", "super"],
            ["radio", "system"],
            ["radio", "vendor"],
            ["radio", "data"],
            ["radio", "cache"],
            ["radio", "other"],
            ["input", "input", "Partition to flash"],
            ["br", ""],

            ["file", "file", ".img,.bin,.mbn,.txt,.zip"],
            ["br", ""],
            ["br", ""],
          ],
        },
        erase: {
          title: "Erase partition",
          name: "erase-menu",
          needUnlock: true,
          script: [["fastboot", "erase", "$radio"]],
          content: [
            ["radio", "boot", "checked"],
            ["radio", "recovery"],
            ["radio", "super"],
            ["radio", "system"],
            ["radio", "vendor"],
            ["radio", "cache"],
            ["radio", "other"],
            ["input", "input", "Partition to erase"],
            ["br", ""],
          ],
        },
        format: {
          title: "Format partition",
          name: "format-menu",
          needUnlock: true,
          script: [["fastboot", "format", "$radio"]],
          content: [
            ["radio", "super"],
            ["radio", "system"],
            ["radio", "vendor"],
            ["radio", "cache"],
            ["radio", "userdata"],
            ["radio", "other"],
            ["input", "input", "Partition to format"],
            ["br", ""],
          ],
        },
        flashing: {
          title: "Fastboot flashing",
          name: "flashing-menu",
          needUnlock: false,
          script: [["fastboot", "flashing", "$radio"]],
          content: [
            ["radio", "unlock", "checked"],
            ["radio", "lock"],
            ["radio", "unlock-critical"],
            ["radio", "lock-critical"],
            ["radio", "get-unlock-ability"],
            ["radio", "other"],
            ["input", "input", "Custom command"],
            ["br", ""],
          ],
        },
        oem: {
          title: "Fastboot oem",
          name: "oem-menu",
          needUnlock: true,
          script: [],
          content: [
            ["radio", "unlock", "checked"],
            ["radio", "lock"],
            ["radio", "unlock-critical"],
            ["radio", "lock-critical"],
            ["radio", "device-info"],
            ["radio", "other"],
            ["input", "input", "Custom command"],
            ["br", ""],
          ],
        },
        update: {
          title: "Fastboot update",
          name: "update-menu",
          needUnlock: true,
          script: [],
          content: [
            ["file", "file", "application/zip"],
            ["br", ""],
            ["br", ""],
          ],
        },
        getvar: {
          title: "Fastboot getvar",
          name: "getvar-menu",
          needUnlock: false,
          script: [["fastboot", "getvar", "$radio"]],
          content: [
            ["radio", "all", "checked"],
            ["radio", "current-slot"],
            ["radio", "unlocked"],
            ["radio", "is-userspace"],
            ["radio", "anti"],
            ["radio", "other"],
            ["input", "input", "Custom variable"],
            ["br", ""],
          ],
        },
        active: {
          title: "Switch active slot to",
          name: "active-menu",
          needUnlock: true,
          script: [["fastboot", "set_active", "$radio"]],
          content: [
            ["radio", "a", "", "checked"],
            ["radio", "b", ""],
            ["br", ""],
          ],
        },
      },
    },
    devices: {
      navbar: "Devices",
      items: {
        devices: {
          title: "TODO",
          subtitle: "TODO",
          content: [],
        },
      },
    },
    settings: {
      navbar: "Settings",
      items: {
        settings: {
          title: "Settings",

          content: [],
        },
        updater: {
          title: "Online Updates",
          content: [],
        },
      },
    },
  },
};

const messages = {
  settings: {
    language: {
      "zh-TW": "語言：",
      "en-US": "Language: ",
    },
    theme: {
      "zh-TW": "主題：",
      "en-US": "Theme: ",
    },
    updateFrequency: {
      "zh-TW": "檢查更新頻率（天）：",
      "en-US": "Update frequency (days): ",
    },
  },
  alert: {
    restartAlert: {
      "zh-TW": "重啟 APP 以套用變更",
      "en-US": "Restart the app to take effect",
    },
    restartAlertTitle: {
      "zh-TW": "請重啟 APP",
      "en-US": "Please restart the app",
    },
    updateFoundAlert1: {
      "zh-TW": "有可用的更新：",
      "en-US": "New updates found: ",
    },
    updateFoundAlert2: {
      "zh-TW": "是否更新？",
      "en-US": "Do you want to install?",
    },
    updateStartedAlert: {
      "zh-TW": "更新已經開始，欲查看下載進度，請見工作列的進度條",
      "en-US":
        "Update started, to view the download progress, please see at taskbar",
    },
    updateCompleteAlert: {
      "zh-TW": "請點擊右上角的重啟 APP 以完成更新",
      "en-US": "Restart the app to apply update",
    },
    updateCompleteAlertTitle: {
      "zh-TW": "請重啟 APP",
      "en-US": "Please restart the app",
    },
    windowsOnlyAlert: {
      "zh-TW": "非 Windows 無法自動更新，將開啟 release 頁面，請自行下載",
      "en-US": "Downloading updates is only availiable in Windows, now opening release page of EAF in browser",
    },
  },
  ui: {
    fileSelectorBtn: {
      "zh-TW": "選擇檔案",
      "en-US": "Select a file",
    },
    fileSelectorDefault: {
      "zh-TW": "請選擇檔案",
      "en-US": "Nothing selected...",
    },
    saveSettingsBtn: {
      "zh-TW": "儲存",
      "en-US": "Save",
    },
    nothingSelected: {
      "zh-TW": "從側邊欄選取功能以開始",
      "en-US": "Select any of the operations from the left to start.",
    },
    unlockAlertMsg: {
      "zh-TW": "請在BL解鎖後再執行",
      "en-US": "This operation needs bootloader to be unlocked first.",
    },
    startBtn: {
      "zh-TW": "開始",
      "en-US": "Start",
    },
  },
  info: {
    appVersion: {
      "zh-TW": "版本：",
      "en-US": "Version:",
    },
    chromeVersion: {
      "zh-TW": "Chromium 版本：",
      "en-US": "Chromium Version:",
    },
    osType: {
      "zh-TW": "系統：",
      "en-US": "OS:",
    },
    osVersion: {
      "zh-TW": "系統版本：",
      "en-US": "OS Version",
    },
  },
  update: {
    updaterTitle: {
      "zh-TW": "線上更新",
      "en-US": "Online Updates",
    },
    updateEafBtn: {
      "zh-TW": "更新 EAF",
      "en-US": "Update EAF",
    },
    checkingUpdate: {
      "zh-TW": "正在檢查更新",
      "en-US": "Checking for updates…",
    },
    updateFound: {
      "zh-TW": "有可用的更新",
      "en-US": "New update availiable",
    },
    viewFullChangelog: {
      "zh-TW": "查看完整更新說明",
      "en-US": "View full changelog",
    },
    downloadUpdate: {
      "zh-TW": "下載更新",
      "en-US": "Download update",
    },
    noUpdates: {
      "zh-TW": "已在最新版本",
      "en-US": "You are at the latest version",
    },
    beforeUpdateRemind1: {
      "zh-TW": "點擊重啟APP後，畫面卡住無反應為正常現象，數秒後將會自動關閉",
      "en-US":
        "If the window freezed after clicking the restart app button, please wait for few seconds, the app will close automatically",
    },
    beforeUpdateRemind2: {
      "zh-TW":
        "若更新中提示“Easy ADB and fastoot正在運行”請點擊“確定”以繼續更新",
      "en-US":
        'If "Easy ADB and Fastboot is running" is seen, please click "OK" to continue the update process',
    },
  },
  template: { "zh-TW": "", "en-US": "" },
};
