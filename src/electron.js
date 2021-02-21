const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const game = require('./game');
const { name, version } = require('../package.json');

const settings = {
    mode: 'gui',
    ia: 'easy', // ou 'easy' ou 'intermediate' ou 'difficult' ou 'auto'
    height: '4',
    width: (2 * 4) - 1,
};

function createWindow() {
    const win = new BrowserWindow({
        title: 'aimulette',
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    win.loadFile('index.html');

    win.webContents.on('did-finish-load', () => {
        const windowTitle = `${name} ${version}`;
        win.setTitle(windowTitle);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipc.on('setSettings', (event, arg) => {
    const res = event;
    settings.ia = arg.ia;
    settings.height = Number(arg.height);
    settings.width = (2 * settings.height) - 1;
    res.returnValue = 'OK';
});

ipc.on('startGame', (event) => {
    const res = event;
    game(settings);
    res.returnValue = 'OK';
});
