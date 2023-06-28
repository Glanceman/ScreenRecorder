const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const mode = app.commandLine.getSwitchValue("mode")

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight:600,
    minWidth:800,
    frame:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools:mode=="development"?true:false,
      nodeIntegration:true,
      contextIsolation:true,
    }
  })

  //win.loadFile('index.html')
  if(mode==="development"){
    win.loadURL("http://localhost:3000/")
  }else if(mode==="deployment"){
    win.loadFile(path.join(__dirname,"../dist/index.html"))
  }

  console.log("Current Mode:"+ mode);

  ipcMain.on("close-window",()=>{
    console.log("Close App")
    app.quit();
  })

  ipcMain.on("max-window",()=>{
    console.log("max App")
    win.maximize()
  })

  ipcMain.on("min-window",()=>{
    console.log("min App")
    win.minimize();
  })

  ipcMain.on("unmax-window",()=>{
    console.log("unmax App")
    win.unmaximize();
  })


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