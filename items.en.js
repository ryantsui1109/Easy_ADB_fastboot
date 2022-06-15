let oprs = [{
        "navbar": "Fastboot",
        "content": [{
                "title": "Reboot to",
                "name": "power-menu",
                "content": [
                    ["radio", "reboot_bootloader", "checked"],
                    ["radio", "reboot_recovery"],
                    ["radio", "reboot_fastbootd"],
                    ["radio", "reboot_system"],
                    ["radio", "reboot_sideload"],
                    ["radio", "reboot_other"],
                    ["input", "reboot_input", "Other target"],
                    ["br", ""],
                    ["br", ""]
                ]
            }, {
                "title": "Boot a image",
                "name": "boot-menu",
                "content": [
                    ["file", "boot_file"],
                    ["br", ""],
                    ["br", ""]
                ]
            },
            {
                "title": "Flash image to partition",
                "name": "flash-menu",
                "content": [
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
                    ["br", ""]
                ]
            }, {
                "title": "Erase partition",
                "name": "erase-menu",
                "content": [
                    ["radio", "erase_boot", "checked"],
                    ["radio", "erase_recovery"],
                    ["radio", "erase_super"],
                    ["radio", "erase_system"],
                    ["radio", "erase_vendor"],
                    ["radio", "erase_boot"],
                    ["radio", "erase_cache"],
                    ["radio", "erase_other"],
                    ["input", "erase_input", "Partition to erase"],
                    ["check", "use_format", "Use format instead of erase"],
                    ["br", ""],
                ]
            }, {
                "title": "Fastboot flashing/oem",
                "name": "flashing-menu",
                "content": [
                    ["radio", "flashing_unlock", "checked"],
                    ["radio", "flashing_lock"],
                    ["radio", "flashing_unlock-critical"],
                    ["radio", "flashing_lock-critical"],
                    ["radio", "flashing_other"],
                    ["input", "flashing_input", "Custom command"],
                    ["check", "use_oem", "Use oem instead of flashing"],
                    ["br", ""]
                ]
            },
            {
                "title": "Switch active slot to",
                "name": "active-menu",
                "content": [
                    ["radio", "_a", "checked"],
                    ["radio", "_b"],
                    ["br", ""]
                ]
            }
        ]
    }, {
        "navbar": "Recovery",
        "content": [{
            "title": "Sideload flashable zip",
            "subtitle": "You can flash magisk here",
            "name": "sideload-menu",
            "content": [
                ["file", "sideload_file"],
                ["br", ""],
                ["br", ""]
            ]
        }]
    }, {
        "navbar": "System",
        "content": [{
            "title": "Push file to /sdcard",
            "name": "push-menu",
            "content": [
                ["file", "push_file"],
                ["br", ""],
                ["br", ""]
            ]
        }, {
            "title": "Sideload apk file",
            "subtitle": "For installing apk, not for flashing magisk!",
            "name": "install-menu",
            "content": [
                ["file", "install_file"],
                ["br", ""],
                ["br", ""]
            ]

        }, {
            "title": "Reboot to",
            "name": "system-power-menu",
            "content": [
                ["radio", "system-reboot_bootloader", "checked"],
                ["radio", "system-reboot_recovery"],
                ["radio", "system-reboot_fastbootd"],
                ["radio", "system-reboot_system"],
                ["radio", "system-reboot_sideload"],
                ["radio", "system-reboot_other"],
                ["input", "system-reboot_input", "Other target"],
                ["br", ""],
                ["br", ""]
            ]
        }]
    }

]