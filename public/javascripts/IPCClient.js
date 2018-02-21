
/**
* Main thread notify view to update in order to display progress percentage
*/
ipc.on('progress', (event, arg) => {
  if(arg.done){
    $("#progressContainer").hide();
    //alert("Le fichier a été généré.");
  }else{
      setProgress(parseInt(arg.percentage));
  }
});

/**
* Load settings from configuration file
*/
ipc.on('load_settings', (event, arg) => {
  arg.forEach(function(element){
    addRadicalSettings(element);
  });
});
