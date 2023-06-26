const { app, BrowserWindow } = require('electron')
const path = require('path')

const mode = app.commandLine.getSwitchValue("mode")

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true,
      contextIsolation:true,
    }
  })

  //win.loadFile('index.html')
  if(mode==="development"){
    win.webContents.openDevTools();
    win.loadURL("http://localhost:3000/")
  }else if(mode==="deployment"){
    win.loadFile(path.join(__dirname,"../dist/index.html"))
  }

  console.log("Current Mode:"+ mode);

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})