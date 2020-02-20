const electron = require("electron");
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");

const request = require('request');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const READ_MODE = {
    whole: "READ_WHOLE_FILE",
    streaming: "READ_BY_KEY"
}

// require('electron-reload')(__dirname);

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        }
    });
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

function readJSONByKey(url, fieldName) {
    return new Promise((resolve, reject) => {
        try {
            const timeFrom = Date.now();
            request({ url: url })
            .pipe(JSONStream.parse(fieldName))
            .pipe(es.mapSync(function(data) {
                const timeTo = Date.now();
                resolve({ 
                    data: data,
                    executeTime: timeTo - timeFrom
                });
            }));
        } catch(e) {
            reject(e);
        }
    });
}

function readWholeJson(url) {
    console.log('[start reading whole file...]');
    return new Promise((resolve, reject) => {
        try {
            const timeFrom = Date.now();
            request(url, function(error, response, body) {
                const timeTo = Date.now();
                resolve({ 
                    data: JSON.parse(body),
                    executeTime: timeTo - timeFrom,
                })
            })
        } catch(e) {
            console.log('[Error!]');
            reject(e);
        }
    })
}

ipcMain.on('READ_HUGE_JSON', (event, arg) => {
    // args - mode, key, url
    if (arg.mode === READ_MODE.streaming) {
        readJSONByKey(arg.url, arg.key).then(result => {
            result.mode = arg.mode;
            event.reply('HUGE_JSON_REPLY', result)
        });
    } else {
        readWholeJson(arg.url).then(result => {
            result.mode = arg.mode;
            event.reply('HUGE_JSON_REPLY', result);
        })
    }
})
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});