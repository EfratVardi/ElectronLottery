const { Console } = require('console')
const { app, BrowserWindow, ipcMain, session, dialog } = require('electron')
const path = require('path');

const fs = require('fs')
let mainWindow

function createWindow() {
  let ses = session.defaultSession

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.loadFile('Main.html')
  mainWindow.menuBarVisible = false
  mainWindow.fullScreen = true;
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ses.on('will-download', (e, downloadItem, webContents) => {
    let name = downloadItem.getFilename()
    const existingFilePath = app.getPath('downloads') + `/${name}`
    if (fs.existsSync(existingFilePath)) {
      fs.unlink(existingFilePath, (err) => {
        if (err) {
          console.error('Error removing the file:', err);
        } else {
          downloadItem.setSavePath(existingFilePath)
        }
      });
    }
    else {
      downloadItem.setSavePath(existingFilePath)
    }

    downloadItem.once('done', (event, state) => {
      if (state === 'completed') {
        dialog.showMessageBox({
          type: 'info',
          title: 'הודעת מערכת',
          message: 'הקובץ ירד בהצלחה!'
        })
      } else {
        dialog.showErrorBox('הודעת מערכת', 'הקובץ לא נשמר')
      }
    })
  })
}

app.on('ready', createWindow)

ipcMain.on("sendReadExcel", (event, args) => {
  const resourcePath = path.join(app.getAppPath(), 'resources');
  const fullPath = path.join(resourcePath, args + '.json')
  fs.readFile(fullPath,
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
      if (err) {
        mainWindow.webContents.send("receiveReadExcel" + args, 0);
      }
      else {
        mainWindow.webContents.send("receiveReadExcel" + args, JSON.parse(data));
        console.log(data.password)
      }
    });
});

ipcMain.on("sendWriteExcel", (event, args) => {
  const resourcePath = path.join(app.getAppPath(), 'resources');
  const fullPath = path.join(resourcePath, args[0] + '.json')
  fs.writeFile(fullPath, JSON.stringify(args[1]), err => {
    if (err) {
      console.error(err);
    }
    else {
      mainWindow.webContents.send("receiveWriteExcel" + args[0], 1);
    }
  });
});

ipcMain.on('close', () => {
  app.quit()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
