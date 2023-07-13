const { contextBridge, ipcRenderer, desktopCapturer } = require("electron");
const { writeFile } = require("fs");
//const {fixWebmMetaInfo} = require("fix-webm-metainfo");


// const ebml = require("ts-ebml");

// async function fixWebmMetaInfo(blob) {
//   const reader = new ebml.Reader();
//   const decoder = new ebml.Decoder();

//   const bufSlices = [];
//   const sliceLength = 1 * 1024 * 1024 * 1024; //(1GB)

//   for (let i = 0; i < blob.size; i = i + sliceLength) {
//     // 切割Blob，并读取ArrayBuffer
//     const bufSlice = await blob
//       .slice(i, Math.min(i + sliceLength, blob.size))
//       .arrayBuffer();
//     bufSlices.push(bufSlice);
//   }

//   decoder.decode(bufSlices).forEach((elm) => reader.read(elm));
//   // 利用reader生成好的cues与duration，重建meta头，并转换回arrayBuffer

//   const refinedMetadataBuf = ebml.tools.makeMetadataSeekable(
//     reader.metadatas,
//     reader.duration,
//     reader.cues
//   );
//   const firstPartSlice = bufSlices.shift();
//   const firstPartSliceWithoutMetadata = firstPartSlice.slice(
//     reader.metadataSize
//   );
//   // 重建回Blob
//   return new Blob(
//     [refinedMetadataBuf, firstPartSliceWithoutMetadata, ...bufSlices],
//     { type: blob.type }
//   );
// }

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
    // console.log(data);

    // const blob = new Blob(data, {
    //   type: "video/webm",
    // });

    let buffer = Buffer.from(await data.arrayBuffer());
    //ipcRenderer.invoke("saveFile", buffer);
    const path = await ipcRenderer.invoke("selectFilePath", "webm");
    if (path != undefined) {
      writeFile(path, buffer, () => {
        console.log("save");
      });
    }
  },
});
