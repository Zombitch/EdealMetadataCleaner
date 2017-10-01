const electron = require('electron');
const stream = require('stream');
const readline = require('readline');
const fs = require('fs');
const app = electron.app;
const ipc = electron.ipcMain;

MCEngine = {

  isCleaning: false,

  cleanAnalyzer: {
    startWith: "<reference",
    endWith: "</reference>",
    attributName: "radical"
  },

  /**
  * Get the clean Analyzer json
  */
  getCleanAnalyzer: function(){
    return this.cleanAnalyzer;
  },

  /**
  * Launch the cleaning process
  * @param event Event that send data to the client in order to notice about progress running percentage
  */
  processCleaning:function(event, filepath){
    var readStream = fs.createReadStream(filepath);
    var writeStream = fs.createWriteStream(filepath+".new");
    var outstream = new stream;
    var reader = null;
    var radicalToClean = this.getSettings();
    var self = this;

    this.computeLineCountFromFile(filepath).then(function(totalLine){
      var currentLine = 1;
      reader = readline.createInterface(readStream, outstream);
      reader.on('line', function(line) {
        var trimedLine = line.trim();

        if(!self.isCleaning && trimedLine.startsWith(self.cleanAnalyzer.startWith)){
          var startIndex = trimedLine.indexOf(self.cleanAnalyzer.attributName)+self.cleanAnalyzer.attributName.length + 2;
          var endIndex = startIndex+3
          console.log(trimedLine.substring(startIndex, endIndex));
          self.isCleaning = true;
        }

        if(!self.isCleaning){
          writeStream.write(line+"\n");
        }

        if(self.isCleaning && trimedLine.startsWith(self.cleanAnalyzer.endWith)){
          self.isCleaning = false;
        }

        currentLine++;
        event.sender.send('progress', {percentage: parseInt(currentLine/totalLine*100), done: false});
      }).on("end", function(){
        self.isCleaning = false;
        writeStream.end();
        event.sender.send('progress', {percentage: 100, done: true});
      });
    });
  },

  /**
  * Count line from file
  * @param filepath
  */
  computeLineCountFromFile:function(filepath){
    return new Promise((resolve, reject) => {
      var count = 1;
      fs.createReadStream(filepath).on("data", function(chunk) {
        for (i=0; i < chunk.length; ++i)
          if (chunk[i] == 10) count++;
      }).on("end", function() {
        resolve(count);
      }).on("error", function(){
        reject();
      });
    });
  },

  /**
  * Retrieve settings from file
  */
  getSettings:function(){
    var filepath = this.getPathToSettings();
    return new Promise((resolve, reject) => {
      fs.readFile(filepath, "utf-8", (err, data) => {
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
  getPathToSettings: function(){
    return app.getPath("appData")+"/settings.raw";
  }
};

module.exports = MCEngine;
