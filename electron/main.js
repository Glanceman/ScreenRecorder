const {
  app,
  BrowserWindow,
  ipcMain,
  desktopCapturer,
  Menu,
  dialog,
} = require("electron");

app.commandLine.appendSwitch("--in-process-gpu");


const { writeFile } = require("fs");
const path = require("path");

const mode = app.commandLine.getSwitchValue("mode");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: mode == "development" ? true : false,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  //win.loadFile('index.html')
  if (mode === "development") {
    win.loadURL("http://localhost:3000/");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  console.log("Current Mode:" + mode);
  console.log(process.env);
  ipcMain.on("close-window", (event) => {
    console.log("Close App");
    app.quit();
  });

  ipcMain.on("max-window", (event) => {
    console.log("max App");
    win.maximize();
  });

  ipcMain.on("min-window", (event) => {
    console.log("min App");
    win.minimize();
  });

  ipcMain.on("unmax-window", (event) => {
    console.log("unmax App");
    win.unmaximize();
  });

  ipcMain.handle("popUpVideoSource", async (event) => {
    const videoSources = await desktopCapturer.getSources({
      types: ["screen", "window"],
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
      videoSources.map((source) => {
        return {
          label: source.name,
          click: () => console.log(source),
        };
      })
    );
    videoOptionsMenu.popup();
  });

  ipcMain.handle("getVideoSources", async (event) => {
    const videoSources = await desktopCapturer.getSources({
      types: ["screen", "window"],
    });
    return videoSources;
  });

  ipcMain.handle("selectFilePath", async (event,extension) => {
    console.log(extension)
    let res = await dialog.showSaveDialog({
      buttonLabel: "Save video",
      defaultPath: `vid-${Date.now()}.`+extension,
    });
    return res.filePath;
  });

  ipcMain.handle("saveFile",async (event,data,extension) => {
    console.log("saveFile")
    console.log(data)
    // Convert base64 string to a Buffer
    let res = await dialog.showSaveDialog({
      buttonLabel: "Save video",
      defaultPath: `vid-${Date.now()}.`+extension,
    });
    writeFile(res.filePath,data,()=>{console.log("save")});
  });

}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
