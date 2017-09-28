const electron = require('electron');
const MCEngine = require("./api/metadatacleaner/mcengine");
const RouteMenu = require("./routes/menu/mainMenu");
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
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

ipc.on('clean', (event, arg) => {
  var instream = fs.createReadStream(arg.filepath);
  var outstream = new stream;
  var reader = null;

  MCEngine.computeLineCountFromFile(arg.filepath).then(function(totalLine){
    var currentLine = 1;
    reader = readline.createInterface(instream, outstream);
    reader.on('line', function(line) {
      console.log(line);
      currentLine++;
      event.sender.send('progress', {percentage: 99, done: false});
    })
  });
});

ipc.on('confirm_parameter', (event, arg) => {
  MCEngine.saveSettings(arg.data);
  mainWindow.loadURL('file://'+__dirname+'/views/index.html');
});

ipc.on('cancel_parameter', (event, arg) => {
  mainWindow.loadURL('file://'+__dirname+'/views/index.html');
});
