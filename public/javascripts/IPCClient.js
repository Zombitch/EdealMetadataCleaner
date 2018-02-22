
/**
* Main thread notify view to update in order to display progress percentage
*/
ipc.on('progress', (event, arg) => {
  setProgress(parseInt(arg.percentage));

  if(arg.done){
    setProgress(100);
    setTimeout(function(){
      alert("Le fichier a été généré.");
      $("#progressContainer").hide();
    }, 1000);
  }
});

/**
* Load settings from configuration file
*/
ipc.on('load_settings', (event, arg) => {
  arg.forEach(function(element){
    addRadicalSettingsValue(element);
  });
});
