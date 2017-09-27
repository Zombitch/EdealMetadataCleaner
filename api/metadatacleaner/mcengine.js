const electron = require('electron');
const fs = require('fs');
const app = electron.app;

MCEngine = {

  /**
  * Retrieve settings from file
  */
  getSettings:function(){
    var filepath = this.getPathToSettings();
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
          console.log("An error ocurred creating the file "+ err.message);
          reject(false);
        }

        if(data !== undefined && data.length > 0){
          resolve(data.split(","));
        }else{
          resolve(false);
        }
      });
    });
  },

  /**
  * Save settings to a file
  */
  saveSettings:function(data){
    var filepath = this.getPathToSettings();
    fs.writeFile(filepath, data, (err) => {
      if(err){
        console.log("An error ocurred creating the file "+ err.message);
      }
    });
  },

  /**
  * Get path to settings file
  */
  getPathToSettings(){
    return app.getPath("appData")+"/settings.raw";
  }
};

module.exports = MCEngine;
