const oprs = {
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
          ["radio", "fastboot"],
          ["radio", "system"],
          ["radio", "sideload"],
          ["radio", "other"],
          ["input", "input", "Other target"],
        ],
        navbar: "Reboot to",
      },
      push: {
        title: "Push file to /sdcard",
        name: "push-menu",
        script: [["adb", "push", "$file", "/sdcard"]],
        content: [["file", "file"]],
        navbar: "Push file to /sdcard",
      },
      install: {
        title: "Install apk file",
        subtitle: "For installing apk, not for flashing magisk!",
        name: "install-menu",
        script: [["adb", "install", "$file"]],
        content: [["file", "file", ".apk,application/zip"]],
        navbar: "Install apk file",
      },
      getprop: {
        title: "Get infos from *.prop file",
        name: "getprop-menu",
        script: [["adb", "shell", "getprop", "$radio"]],
        content: [
          ["radio", "ro.boot.slot_suffix", "checked"],
          ["radio", "ro.apex.updatable"],
          ["radio", "ro.build.fingerprint"],
          ["radio", "ro.build.version.release"],
          ["radio", "ro.build.version.security_patch"],
          ["radio", "ro.product.board"],
          ["radio", "ro.product.brand"],
          ["radio", "ro.product.model"],
          ["radio","ro.secure"],
          ["radio","ro.adb.secure"],
          ["radio", "sys.usb.config"],
          ["radio",""],
          ["radio", "other"],
          ["input", "input", "Other property"],
        ],
        navbar: "Get properties",
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

        script: [["adb", "sideload", "$file"]],
        content: [["file", "file", "application/zip,.apk"]],
        navbar: "Sideload flashable zip",
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
          ["radio", "fastboot"],
          ["radio", "system"],
          ["radio", "sideload"],
          ["radio", "other"],
          ["input", "input", "Other target"],
        ],
        navbar: "Reboot to",
      },
      boot: {
        title: "Boot a image",
        subtitle: "Some models are not supported",
        name: "boot-menu",
        needUnlock: true,
        script: [["fastboot", "boot", "$file"]],
        content: [["file", "file", ".img,.bin"]],
        navbar: "Boot a image",
      },
      flash: {
        title: "Flash image to partition",
        name: "flash-menu",
        needUnlock: true,
        script: [["fastboot", "flash", "$radio", "$file"]],
        content: [
          ["radio", "boot", "checked"],
          ["radio", "bootloader"],
          ["radio", "init_boot"],
          ["radio", "dtbo"],
          ["radio", "vbmeta"],
          ["radio", "recovery"],
          ["radio", "radio"],
          ["radio", "super"],
          ["radio", "system"],
          ["radio", "vendor"],
          ["radio", "userdata"],
          ["radio", "other"],
          ["input", "input", "Partition to flash"],
          ["file", "file", ".img,.bin,.mbn,.txt,.zip"],
        ],
        navbar: "Flash image to partition",
      },
      flash_remove_verity: {
        title: "Disable dm-verity (by flashing modifed vbmeta image)",
        name: "flash-menu",
        needUnlock: true,
        script: [
          [
            "fastboot",
            "flash",
            "--disable-verity",
            "--disable-verification",
            "vbmeta",
            "$file",
          ],
        ],
        content: [["file", "file", ".img,.bin,.mbn,.txt,.zip"]],
        navbar: "Disable dm-verity",
      },
      erase: {
        title: "Erase partition",
        name: "erase-menu",
        needUnlock: true,
        script: [["fastboot", "erase", "$radio"]],
        content: [
          ["radio", "boot", "checked"],
          ["radio", "init_boot"],
          ["radio", "dtbo"],
          ["radio", "vbmeta"],
          ["radio", "recovery"],
          ["radio", "super"],
          ["radio", "system"],
          ["radio", "vendor"],
          ["radio", "cache"],
          ["radio", "userdata"],
          ["radio", "metadata"],
          ["radio", "other"],
          ["input", "input", "Partition to erase"],
        ],
        navbar: "Erase partition",
      },
      format: {
        title: "Format partition",
        name: "format-menu",
        needUnlock: true,
        script: [["fastboot", "format", "$radio"]],
        content: [
          ["radio", "super", "checked"],
          ["radio", "system"],
          ["radio", "vendor"],
          ["radio", "cache"],
          ["radio", "userdata"],
          ["radio", "other"],
          ["input", "input", "Partition to format"],
        ],
        navbar: "Format partition",
      },
      flashing: {
        title: "Fastboot flashing",
        name: "flashing-menu",
        needUnlock: false,
        script: [["fastboot", "flashing", "$radio"]],
        content: [
          ["radio", "unlock", "checked"],
          ["radio", "lock"],
          ["radio", "unlock_critical"],
          ["radio", "lock_critical"],
          ["radio", "get_unlock_ability"],
          ["radio", "other"],
          ["input", "input", "Custom command"],
        ],
        navbar: "Fastboot flashing",
      },
      oem: {
        title: "Fastboot oem",
        name: "oem-menu",
        needUnlock: true,
        script: [["fastboot", "oem", "$radio"]],
        content: [
          ["radio", "unlock", "checked"],
          ["radio", "lock"],
          ["radio", "device-info"],
          ["radio", "cdms"],
          ["radio", "other"],
          ["input", "input", "Custom command"],
        ],
        navbar: "Fastboot oem",
      },
      update: {
        title: "Fastboot update",
        name: "update-menu",
        needUnlock: true,
        script: ["fastboot", "update", "$file"],
        content: [["file", "file", "application/zip"]],
        navbar: "Fastboot update",
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
        ],
        navbar: "Fastboot getvar",
      },
      active: {
        title: "Switch active slot to",
        name: "active-menu",
        needUnlock: true,
        script: [["fastboot", "set_active", "$radio"]],
        content: [
          ["radio", "a", "checked"],
          ["radio", "b", ""],
        ],
        navbar: "Switch active slot to",
      },
    },
  },
  settings: {
    navbar: "Settings",
    items: {
      settings: {
        title: "TODO",
        subtitle: "TODO",
        noStartButton: true,
        navbar: "TODO",
      },
      updater: {
        title: "Online Updates",
        noStartButton: true,
        navbar: "Online Updates",
      },
    },
  },
};

const availableLanguages = ["zh-TW", "zh-CN", "en-US"];
const settings = {
  language: {
    title: "Language:",
    type: "dropdown",
    name: "language",
    options: [...availableLanguages, "auto"],
  },
  theme: {
    title: "Theme:",
    type: "dropdown",
    name: "theme",
    options: ["light", "dark", "auto"],
  },
  updateFrequency: {
    title: "Update frequency (days):",
    type: "dropdown",
    name: "updateFrequency",
    options: ["1", "2", "3", "7", "14"],
  },
};

const winURL =
  "https://dl.google.com/android/repository/platform-tools-latest-windows.zip";
const linURL =
  "https://dl.google.com/android/repository/platform-tools-latest-linux.zip";
