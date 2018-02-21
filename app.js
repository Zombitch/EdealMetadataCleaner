const electron = require('electron');
const MCEngine = require("./api/metadatacleaner/mcengine");
const RouteMenu = require("./routes/menu/mainMenu");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const menu = electron.Menu;

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL('file://'+__dirname+'/views/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  menu.setApplicationMenu(RouteMenu.getMenu(mainWindow));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Start cleaning process
ipc.on('clean', (event, arg) => {
  MCEngine.processCleaning(event, arg.filepath);
});

// Stop cleaning process
ipc.on('stop', (event, arg) => {
  MCEngine.stopProcess(event, arg.filepath);
});

// Save settings then go home
ipc.on('confirm_parameter', (event, arg) => {
  MCEngine.saveSettings(arg.data);
  mainWindow.loadURL('file://'+__dirname+'/views/index.html');
});

// Cancel settings then go home
ipc.on('cancel_parameter', (event, arg) => {
  mainWindow.loadURL('file://'+__dirname+'/views/index.html');
});
