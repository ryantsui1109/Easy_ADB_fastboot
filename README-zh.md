For English version, please [click me](./README.md)

# Easy ADB and fastboot (EAF)

## EAF 是什麼

EAF 是一個圖形化的 ADB 和 fastboot 管理器

## EAF 的功能

- 常用的 adb 和 fastboot 指令
- 電源管理，包括重啓到系統、recovery 或 fastboot 模式
- 刷入和擦除分區
- fastboot oem 和 fastboot flashing 指令
- 取得 fastboot 中儲存的變數
- 切換 AB 槽
- 使用電腦安裝可刷入的 zip
- 現在支援多裝置，一鍵 root 10 台手機不再是夢～

## 截圖

![fastboot getvar function](./readme-imgs/fastboot_get_var.png)
![device manager](./readme-imgs/devices.png)
![output by groups](./readme-imgs/multiple_devices.png)

## 支援的平台

目前官方發佈 Linux 和 Windows 版，~~macOS 用戶請自行編譯~~

## 安裝與更新

### 安裝

從 [Releases](https://github.com/ryantsui1109/Easy_ADB_fastboot/releases) 頁面下載, 或從我們的 [網站](https://ryantsui1109.github.io/eaf_web/zh)

#### Windows

雙擊 exe 檔案安裝

#### Linux

解壓縮下載到的 tar.xz, 並執行 `easy_adb_fastboot`

### Update

#### Windows

每隔數天將自動檢查更新，可以在設定中變更，或手動檢查更新

#### Linux

目前不支援，請自行下載新版

### Changelog

[點我](./更新說明.md)看看最近我都做了些啥

## 從原始碼構建

1. 克隆原始碼
1. 安裝 Node.js 和 npm
1. 安裝依賴

   ```console
   $ npm install
   ```

1. 下載 platform-tools

   ```console
   $ node scripts/eaf_builder.js -d #僅支援 Windows 和 Linux，macOS 請自行下載
   ```

1. 配置
   ```console
   $ node scripts/eaf_builder.js -i=<index> -c=<channel> #index 爲一數字，channel 爲一字串
   ```
1. 建置 EAF
   ```console
   $ npm run build #此爲本地建置
   ```
   或
   ```console
   $ npm run publish #編譯並上傳到發行伺服器（需爲 electron-builder 支援者）
   ```
