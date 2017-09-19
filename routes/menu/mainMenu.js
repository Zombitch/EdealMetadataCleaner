const electron = require('electron');
const menu = electron.Menu;

var MainMenu = {

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
      },{
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
    this.template[0].submenu[0].click = function(){
      mainWindow.reload();
    }

    this.template[0].submenu[1].click = function(){
      mainWindow.loadURL('file://'+__dirname+'../../../views/settings.html');
    }

    return menu.buildFromTemplate(this.template);
  }
};

module.exports = MainMenu;
