const electron = require('electron');
const stream = require('stream');
const readline = require('readline');
const fs = require('fs');
const app = electron.app;
const ipc = electron.ipcMain;

MCEngine = {

  isCleaning: false,
  shouldStop: false,
  reader: null,

  /**
  * Specify what to be cleaned.
  * In this exemple : systeme will clean everything that start with <reference which had an attribute "radical" and the value to that attribute is in the parameter list defined by user.
  * It will delete all line until </reference> is found.
  * /!\ The XML file should be formatted correctly (each tag should return a new line).
  */
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
  * Stop Cleaning and delete created file
  */
  stopProcess:function(event, filepath){
    this.shouldStop = true;
    reader.close();
  },

  /**
  * Launch the cleaning process
  * @param event Event that send data to the client in order to notice about progress running percentage
  */
  processCleaning:function(event, filepath){
    var readStream = fs.createReadStream(filepath);
    var writeStream = fs.createWriteStream(filepath+".new");
    var outstream = new stream;
    var self = this;

    this.getSettings().then(function(radicalToClean){
      self.computeLineCountFromFile(filepath).then(function(totalLine){
        var currentLine = 1;
        reader = readline.createInterface(readStream, outstream);
        reader.on('line', function(line) {
          var trimedLine = line.trim();

          if(!self.isCleaning && trimedLine.startsWith(self.cleanAnalyzer.startWith)){
            var startIndex = trimedLine.indexOf(self.cleanAnalyzer.attributName)+self.cleanAnalyzer.attributName.length + 2;
            var endIndex = startIndex+3
            var currentRadical = trimedLine.substring(startIndex, endIndex);

            if(radicalToClean.includes(currentRadical)){
              self.isCleaning = true;
            }
          }

          if(!self.isCleaning){
            writeStream.write(line+"\n");
          }

          if(self.isCleaning && trimedLine.startsWith(self.cleanAnalyzer.endWith)){
            self.isCleaning = false;
          }

          currentLine++;
          reader.pause();

          //Timeout in order to give some air to the CPU and refresh the view
          setTimeout(function () {
            event.sender.send('progress', {percentage: parseInt(currentLine/totalLine*100), done: false});
            reader.resume();
          }, 2*1000);
        }).on("close", function(){
          writeStream.end();
          //If shouldStop is true, then it means the user want to stop the analysis, then delete the created file
          if(self.shouldStop){
            if (fs.existsSync(filepath+".new")) {
              fs.unlink(filepath+".new", (err) => {
                if (err) console.log(err);
              });
            }
          }else{
            event.sender.send('progress', {percentage: 100, done: true});
          }
          self.isCleaning = false;
          self.shouldStop = false;
        });
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
