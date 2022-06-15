const path = require('path');
const builder = require('electron-builder');

builder.build({

        projectDir: path.resolve(__dirname), // 專案路徑 

        win: ['portable'], // nsis . portable
        config: {
            "appId": "io.github.ryantsui1109.eaf",
            "productName": "Easy ADB and fastboot",
            "directories": {
                "output": "out/win"
            },
            "win": {
                "icon": path.resolve(__dirname, './favicon_256.ico'),
            }
        },
    })
    .then(
        data => console.log(data),
        err => console.error(err)
    );