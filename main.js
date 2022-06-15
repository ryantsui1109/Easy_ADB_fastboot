const { app, BrowserWindow } = require('electron')
const path = require('path')
const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // allowRunningInsecureContent: true
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false,
            icon: __dirname + './favicon_256.ico'

        }
    })
    win.setMenu(null)
    win.webContents.openDevTools()
    win.loadFile('index.html')
}
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})