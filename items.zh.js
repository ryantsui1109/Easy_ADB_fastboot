let oprs = [{
        "navbar": "Fastboot",
        "content": [{
                "title": "重啟到",
                "name": "power-menu",
                "content": [
                    ["radio", "reboot_bootloader", "checked"],
                    ["radio", "reboot_recovery"],
                    ["radio", "reboot_fastbootd"],
                    ["radio", "reboot_system"],
                    ["radio", "reboot_sideload"],
                    ["radio", "reboot_other"],
                    ["input", "reboot_input", "其他模式"],
                    ["br", ""],
                    ["br", ""]
                ]
            }, {
                "title": "從鏡像啟動",
                "name": "boot-menu",
                "content": [
                    ["file", "boot_file"],
                    ["br", ""],
                    ["br", ""]
                ]
            },
            {
                "title": "將鏡像刷入分區",
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
                    ["input", "flash_input", "欲刷入的分區"],
                    ["br", ""],
                    ["file", "flash_file"],
                    ["br", ""],
                    ["br", ""]
                ]
            }, {
                "title": "清除分區",
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
                    ["input", "erase_input", "欲清除的分區"],
                    ["check", "use_format", "使用格式化"],
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
                    ["input", "flashing_input", "自訂指令"],
                    ["check", "use_oem", "使用fastboot oem"],
                    ["br", ""]
                ]
            },
            {
                "title": "切換A/B分區",
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
            "title": "Sideload刷機包",
            "subtitle": "magisk請在此刷入",
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
            "title": "將檔案push至/sdcard",
            "name": "push-menu",
            "content": [
                ["file", "push_file"],
                ["br", ""],
                ["br", ""]
            ]
        }, {
            "title": "安裝apk檔案",
            "subtitle": "用於安裝apk，magisk請移步",
            "name": "install-menu",
            "content": [
                ["file", "install_file"],
                ["br", ""],
                ["br", ""]
            ]

        }, {
            "title": "重啟到",
            "name": "system-power-menu",
            "content": [
                ["radio", "system-reboot_bootloader", "checked"],
                ["radio", "system-reboot_recovery"],
                ["radio", "system-reboot_fastbootd"],
                ["radio", "system-reboot_system"],
                ["radio", "system-reboot_sideload"],
                ["radio", "system-reboot_other"],
                ["input", "system-reboot_input", "其他模式"],
                ["br", ""],
                ["br", ""]
            ]
        }]
    }

]