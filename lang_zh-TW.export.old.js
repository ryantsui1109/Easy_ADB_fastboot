const oprs = [
  {
    navbar: "Fastboot",
    items: [
      {
        title: "重啟到",
        name: "power-menu",
        needUnlock: false,
        content: {
          reboot_other: "其他模式",
          reboot_input: "自訂模式名稱",
        },
      },
      {
        title: "從鏡像啟動（免刷入需機器支援）",
        name: "boot-menu",
        needUnlock: true,
      },
      {
        title: "將鏡像檔刷入分區",
        name: "flash-menu",
        needUnlock: true,
        content: {
          flash_recovery: "recovery",
          flash_super: "(VAB分區專用) super",
          flash_other: "其他分區",
          flash_input: "欲刷入的分區",
        },
      },
      {
        title: "清除分區",
        name: "erase-menu",
        needUnlock: true,
        content: {
          erase_super: "(VAB分區專用) super",
          erase_other: "其他分區",
          erase_input: "欲清除的分區",
          use_format: "格式化",
        },
      },
      {
        title: "執行 flashing 指令",
        name: "flashing-menu",
        needUnlock: false,
        content: {
          "flashing_get-unlock-ability": "get_unlock_ability",
          flashing_other: "其他指令",
          flashing_input: "自訂 flashing 指令",
        },
      },
      {
        title: "執行 oem 指令",
        name: "oem-menu",
        needUnlock: true,
        content: {
          oem_other: "其他指令",
          oem_input: "自訂 oem 指令",
        },
      },
      {
        title: "Fastboot update",
        name: "update-menu",
        needUnlock: true,
        content: [
          ["file", "update_file", "application/zip"],
          ["br", ""],
          ["br", ""],
        ],
      },
      {
        title: "取得 fastboot 中的變數",
        name: "getvar-menu",
        needUnlock: false,
        content: {
          getvar_all: "所有變數",
          "getvar_current-slot": "(AB分區專用)current-slot",
          "getvar_is-userspace": "(VAB裝置專用) is-userspace",
          getvar_anti: "(小米裝置專用) anti",
          getvar_other: "其他變數",
          getvar_input: "自訂變數",
        },
      },
      {
        title: "(AB分區專用) 切換 Active 槽位到",
        name: "active-menu",
        needUnlock: true,
        content: {},
      },
    ],
  },

  {
    navbar: "Recovery",
    items: [
      {
        title: "安裝 Recovery 卡刷包",
        subtitle: "此處可直接刷入 magisk.apk",
        name: "sideload-menu",
      },
    ],
  },

  {
    navbar: "System",
    items: [
      {
        title: "重啟到",
        name: "system-power-menu",
        content: {
          "system-reboot_other": "其他模式",
          "system-reboot_input": "自訂模式名稱",
        },
      },
      {
        title: "將檔案推至 /sdcard",
        name: "push-menu",
      },
      {
        title: "安裝apk檔案",
        subtitle: "請勿在此“刷入”magisk",
        name: "install-menu",
      },
      {
        title: "列出已安裝的 APP",
        subtitle: "需要 adb shell",
        name: "list-menu0",
        content: { "shell_cmd package list packages": "列出已安裝的APP" },
      },
    ],
  },
  {
    navbar: "Settings",
    items: [],
  },
];
export const startActionBtn = "開始";
export const selectFile = "選擇檔案";
