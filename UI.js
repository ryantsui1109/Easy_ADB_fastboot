const oprs_en = [
  {
    navbar: "Fastboot",
    content: [
      {
        title: "Reboot to",
        name: "power-menu",
        needUnlock: false,
        content: [
          ["radio", "reboot_bootloader", "checked"],
          ["radio", "reboot_recovery"],
          ["radio", "reboot_fastbootd"],
          ["radio", "reboot_system"],
          ["radio", "reboot_sideload"],
          ["radio", "reboot_other"],
          ["input", "reboot_input", "Other target"],
          ["br", ""],
          ["br", ""],
        ],
      },
      {
        title: "Boot a image",
        name: "boot-menu",
        needUnlock: true,
        content: [
          ["file", "boot_file"],
          ["br", ""],
          ["br", ""],
        ],
      },
      {
        title: "Flash image to partition",
        name: "flash-menu",
        needUnlock: true,
        content: [
          ["radio", "flash_boot", "checked"],
          ["radio", "flash_recovery"],
          ["radio", "flash_super"],
          ["radio", "flash_system"],
          ["radio", "flash_vendor"],
          ["radio", "flash_data"],
          ["radio", "flash_cache"],
          ["radio", "flash_other"],
          ["input", "flash_input", "Partition to flash"],
          ["br", ""],

          ["file", "flash_file"],
          ["br", ""],
          ["br", ""],
        ],
      },
      {
        title: "Erase partition",
        name: "erase-menu",
        needUnlock: true,
        content: [
          ["radio", "erase_boot", "checked"],
          ["radio", "erase_recovery"],
          ["radio", "erase_super"],
          ["radio", "erase_system"],
          ["radio", "erase_vendor"],
          ["radio", "erase_cache"],
          ["radio", "erase_other"],
          ["input", "erase_input", "Partition to erase"],
          ["check", "use_format", "Use format instead of erase"],
          ["br", ""],
        ],
      },
      {
        title: "Fastboot flashing",
        name: "flashing-menu",
        needUnlock: false,
        content: [
          ["radio", "flashing_unlock", "checked"],
          ["radio", "flashing_lock"],
          ["radio", "flashing_unlock-critical"],
          ["radio", "flashing_lock-critical"],
          ["radio", "flashing_get-unlock-ability"],
          ["radio", "flashing_other"],
          ["input", "flashing_input", "Custom command"],
          ["br", ""],
        ],
      },
      {
        title: "Fastboot oem",
        name: "oem-menu",
        needUnlock: true,
        content: [
          ["radio", "oem_unlock", "checked"],
          ["radio", "oem_lock"],
          ["radio", "oem_unlock-critical"],
          ["radio", "oem_lock-critical"],
          ["radio", "oem_device-info"],
          ["radio", "oem_other"],
          ["input", "oem_input", "Custom command"],
          ["br", ""],
        ],
      },
      {
        title: "Fastboot getvar",
        name: "getvar-menu",
        needUnlock: false,
        content: [
          ["radio", "getvar_all", "checked"],
          ["radio", "getvar_current-slot"],
          ["radio", "getvar_unlocked"],
          ["radio", "getvar_is-userspace"],
          ["radio", "getvar_anti"],
          ["radio", "getvar_other"],
          ["input", "getvar_input", "Custom variable"],
          ["br", ""],
        ],
      },
      {
        title: "Switch active slot to",
        name: "active-menu",
        needUnlock: true,
        content: [
          ["radio", "_a", "checked"],
          ["radio", "_b"],
          ["br", ""],
        ],
      },
    ],
  },

  {
    navbar: "Recovery",
    content: [
      {
        title: "Sideload flashable zip",
        subtitle: "You can flash magisk here",
        name: "sideload-menu",
        content: [
          ["file", "sideload_file"],
          ["br", ""],
          ["br", ""],
        ],
      },
    ],
  },

  {
    navbar: "System",
    content: [
      {
        title: "Reboot to",
        name: "system-power-menu",
        content: [
          ["radio", "system-reboot_bootloader", "checked"],
          ["radio", "system-reboot_recovery"],
          ["radio", "system-reboot_fastbootd"],
          ["radio", "system-reboot_system"],
          ["radio", "system-reboot_sideload"],
          ["radio", "system-reboot_other"],
          ["input", "system-reboot_input", "Other target"],
          ["br", ""],
          ["br", ""],
        ],
      },
      {
        title: "Push file to /sdcard",
        name: "push-menu",
        content: [
          ["file", "push_file"],
          ["br", ""],
          ["br", ""],
        ],
      },
      {
        title: "Sideload apk file",
        subtitle: "For installing apk, not for flashing magisk!",
        name: "install-menu",
        content: [
          ["file", "install_file"],
          ["br", ""],
          ["br", ""],
        ],
      },
    ],
  },
];
const startActionBtn_en = "Start Action";
const selectFile_en = "Choose a file";
