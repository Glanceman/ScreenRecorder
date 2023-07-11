const { contextBridge, ipcRenderer, desktopCapturer } = require("electron");
const { writeFile } = require("fs");

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

contextBridge.exposeInMainWorld("$ipc", {
  closeWindow: () => ipcRenderer.send("close-window"),
  minWindow: () => ipcRenderer.send("min-window"),
  maxWindow: () => ipcRenderer.send("max-window"),
  unMaxWindow: () => ipcRenderer.send("unmax-window"),
  popUpVideoSource: () => ipcRenderer.invoke("popUpVideoSource"),
  getVideoSources: () => ipcRenderer.invoke("getVideoSources"),
  selectFilePath: async () => await ipcRenderer.invoke("selectFilePath"),
  saveFile: async (data) => await ipcRenderer.invoke("saveFile", data),
  saveFileBuffer: async (data) => {
    console.log(data);
    const blob = new Blob(data, {
      type: "video/webm",
    });
    let buffer = Buffer.from(await blob.arrayBuffer());
    //ipcRenderer.invoke("saveFile", buffer);
    const path =await ipcRenderer.invoke("selectFilePath","webm");
    if(path!=undefined){
      writeFile(path,buffer,()=>{console.log("save")});
    }
  },

});
