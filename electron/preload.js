const { contextBridge,ipcRenderer, desktopCapturer } = require('electron')

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
  console.log(require('electron'))
});

contextBridge.exposeInMainWorld('$ipc', {
  closeWindow:()=> ipcRenderer.send("close-window"),
  minWindow:()=>ipcRenderer.send('min-window'),
  maxWindow:()=>ipcRenderer.send('max-window'),
  unMaxWindow:()=>ipcRenderer.send('unmax-window'),
  popUpVideoSource:()=>ipcRenderer.invoke("popUpVideoSource"),
  getVideoSources:()=>ipcRenderer.invoke("getVideoSources")
})
