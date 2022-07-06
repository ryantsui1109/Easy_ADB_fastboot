const oprs_en_us = [
  {
    navbar: "Fastboot",
    items: [
      {
        title: "Reboot to",
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
        title: "Boot a image",
        name: "boot-menu",
        needUnlock: true,
      },
      {
        title: "Flash image to partition",
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
        title: "Erase partition",
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
        title: "Fastboot flashing",
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
        title: "Fastboot oem",
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
        title: "Fastboot getvar",
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
        title: "(for AB devices) Switch active slot to",
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
        title: "Sideload flashable zip",
        subtitle: "You can flash magisk here",
        name: "sideload-menu",
      },
    ],
  },

  {
    navbar: "System",
    items: [
      {
        title: "Reboot to",
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
        title: "Push file to /sdcard",
        name: "push-menu",
      },
      {
        title: "Sideload apk file",
        subtitle: "For installing apk, not for flashing magisk!",
        name: "install-menu",
      },
    ],
  },
];
const startActionBtn_en_us = "開始";
const selectFile_en_us = "選擇檔案";
