const electron = require('electron');
const MCEngine = require("../../api/metadatacleaner/mcengine");
const menu = electron.Menu;
const ipc = electron.ipcMain;
const app = electron.app;

var MainMenu = {
  subscribeToSettingsDidFinishLoadEvent : false,
  template : [{
    label: 'File',
    submenu: [
      {
        label: 'Recharger',
        accelerator: "CmdOrCtrl+R"
      },
      {
        label: 'Paramètres',
        accelerator: "CmdOrCtrl+P"
      },
      {
        label: 'DevTools',
        accelerator: "CmdOrCtrl+D"
      },
      {
        label: 'Quitter',
        accelerator: "CmdOrCtrl+Q",
        click: () => {
          app.quit();
        }
      }
    ]
  }],

  /**
  * Get the menu to display
  * @param The main window where is displayed the menu
  * @return Builded menu
  */
  getMenu : function(mainWindow){
    var self = this;
    this.template[0].submenu[0].click = function(){
      mainWindow.reload();
    }

    this.template[0].submenu[1].click = function(){
      mainWindow.loadURL('file://'+__dirname+'../../../views/settings.html', {"extraHeaders" : "pragma: no-cache\n"});

      //Load setting only once otherwise it will duplicate settings entry in the parameter view
      if(trueself.subscribeToSettingsDidFinishLoadEvent){
        mainWindow.webContents.on("did-finish-load", function(){
          MCEngine.getSettings().then(function(data){
            if(data != false){
              mainWindow.webContents.send('load_settings', data);
            }
          }).catch(function(){
            console.log("No settings file found");
          });
        });
        self.subscribeToSettingsDidFinishLoadEvent = true;
      }
    }

    this.template[0].submenu[2].click = function(){
      mainWindow.toggleDevTools();
    }

    return menu.buildFromTemplate(this.template);
  }
};

module.exports = MainMenu;
