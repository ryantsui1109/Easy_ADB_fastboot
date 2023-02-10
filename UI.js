const { auto } = require("@popperjs/core");

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
      },
      push: {
        title: "Push file to /sdcard",
        name: "push-menu",
        operation: "push",
        script: [["adb", "push", "$file", "/sdcard"]],
        content: [["file", "file"]],
      },
      install: {
        title: "Install apk file",
        subtitle: "For installing apk, not for flashing magisk!",
        name: "install-menu",
        operation: "install",
        script: [["adb", "install", "$file"]],
        content: [["file", "file", ".apk,application/zip"]],
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
        content: [["file", "file", "application/zip,.apk"]],
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
      },
      boot: {
        title: "Boot a image",
        subtitle: "Some models are not supported",
        name: "boot-menu",
        needUnlock: true,
        script: [["fastboot", "boot", "$file"]],
        content: [["file", "file", ".img,.bin"]],
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

          ["file", "file", ".img,.bin,.mbn,.txt,.zip"],
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
        ],
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
        ],
      },
      oem: {
        title: "Fastboot oem",
        name: "oem-menu",
        needUnlock: true,
        script: [["fastboot", "oem", "$radio"]],
        content: [
          ["radio", "unlock", "checked"],
          ["radio", "lock"],
          ["radio", "unlock-critical"],
          ["radio", "lock-critical"],
          ["radio", "device-info"],
          ["radio", "other"],
          ["input", "input", "Custom command"],
        ],
      },
      update: {
        title: "Fastboot update",
        name: "update-menu",
        needUnlock: true,
        script: [],
        content: [["file", "file", "application/zip"]],
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
      },
      active: {
        title: "Switch active slot to",
        name: "active-menu",
        needUnlock: true,
        script: [["fastboot", "set_active", "$radio"]],
        content: [
          ["radio", "a", "", "checked"],
          ["radio", "b", ""],
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

        noStartButton: true,
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
      },
      updater: {
        title: "Online Updates",
        noStartButton: true,
      },
    },
  },
};
const availableLanguages = ["zh-TW", "en-US"];
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
};

const winURL =
  "https://dl.google.com/android/repository/platform-tools-latest-windows.zip";
const linURL =
  "https://dl.google.com/android/repository/platform-tools-latest-linux.zip";
