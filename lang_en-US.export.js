exports.oprs = [
  {
    navbar: "Fastboot",
    items: [
      {
        title: "Reboot To",
        name: "power-menu",
        needUnlock: false,
        content: {
          reboot_bootloader: "bootloader",
          reboot_recovery: "recovery",
          reboot_fastbootd: "fastbootd",
          reboot_system: "system",
          reboot_sideload: "sideload",
          reboot_other: "other",
          reboot_input: "Other target",
        },
      },
      {
        title: "Boot a Image",
        name: "boot-menu",
        needUnlock: true,
      },
      {
        title: "Flash Image To Partition",
        name: "flash-menu",
        needUnlock: true,
        content: {
          flash_boot: "boot",
          flash_recovery: "recovery",
          flash_super: "(for VAB devices) super",
          flash_system: "system",
          flash_vendor: "vendor",
          flash_data: "data",
          flash_cache: "cache",
          flash_other: "other",
          flash_input: "Partition to flash",
        },
      },
      {
        title: "Erase Partition",
        name: "erase-menu",
        needUnlock: true,
        content: {
          erase_boot: "boot",
          erase_recovery: "recovery",
          erase_super: "(for VAB devices) super",
          erase_system: "system",
          erase_vendor: "vendor",
          erase_cache: "cache",
          erase_other: "other",
          erase_input: "Partition to erase",
          use_format: "Use format instead of erase",
        },
      },
      {
        title: "Fastboot Flashing",
        name: "flashing-menu",
        needUnlock: false,
        content: {
          flashing_unlock: "unlock",
          flashing_lock: "lock",
          "flashing_unlock-critical": "unlock-critical",
          "flashing_lock-critical": "lock-critical",
          "flashing_get-unlock-ability": "get_unlock_ability",
          flashing_other: "other",
          flashing_input: "Custom command",
        },
      },
      {
        title: "Fastboot Oem",
        name: "oem-menu",
        needUnlock: true,
        content: {
          oem_unlock: "unlock",
          oem_lock: "lock",
          "oem_unlock-critical": "unlock-critical",
          "oem_lock-critical": "lock-critical",
          "oem_device-info": "device-info",
          oem_other: "other",
          oem_input: "Custom command",
        },
      },
      {
        title: "Fastboot Update",
        name: "update-menu",
        needUnlock: true,
        content: [
          ["file", "update_file", "application/zip"],
          ["br", ""],
          ["br", ""],
        ],
      },
      {
        title: "Fastboot Getvar",
        name: "getvar-menu",
        needUnlock: false,
        content: {
          getvar_all: "all",
          "getvar_current-slot": "(for AB devices)current-slot",
          getvar_unlocked: "unlocked",
          "getvar_is-userspace": "(for VAB devices) is-userspace",
          getvar_anti: "(for xiaomi) anti",
          getvar_other: "other",
          getvar_input: "Custom variable",
        },
      },
      {
        title: "(For AB Devices) Switch Active Slot To",
        name: "active-menu",
        needUnlock: true,
        content: { _a: "a", _b: "b" },
      },
    ],
  },

  {
    navbar: "Recovery",
    items: [
      {
        title: "Sideload Flashable Zip",
        subtitle: "You can flash magisk here",
        name: "sideload-menu",
      },
    ],
  },

  {
    navbar: "System",
    items: [
      {
        title: "Reboot To",
        name: "system-power-menu",
        content: {
          "system-reboot_bootloader": "bootloader",
          "system-reboot_recovery": "recovery",
          "system-reboot_fastbootd": "fastbootd",
          "system-reboot_system": "system",
          "system-reboot_sideload": "sideload",
          "system-reboot_other": "other",
          "system-reboot_input": "Other target",
        },
      },
      {
        title: "Push File To /sdcard",
        name: "push-menu",
      },
      {
        title: "Sideload APK File",
        subtitle: "For installing apk, not for flashing magisk!",
        name: "install-menu",
      },
      {
        title: "List installed apps",
        subtitle: "adb shell needed",
        name: "list-menu0",
        content: {
          "shell_cmd package list packages": "list installed apps",
        },
      },
    ],
  },
  { navbar: "Settings", item: [] },
];
exports.startActionBtn = "Start Action";
exports.selectFile = "Select a file";
