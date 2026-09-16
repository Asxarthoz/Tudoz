const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Tambahkan fungsi komunikasi antara renderer (React) dan main (Electron) di sini jika diperlukan
});
