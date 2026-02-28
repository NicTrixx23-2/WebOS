const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('notesAPI', {
  list: () => ipcRenderer.invoke('notes:list'),
  load: (name) => ipcRenderer.invoke('notes:load', name),
  save: (name, content) => ipcRenderer.invoke('notes:save', name, content),
  create: (name) => ipcRenderer.invoke('notes:create', name)
})