ipc.on('progress', (event, arg) => {
  if(arg.done){
    $("#progressContainer").hide();
    alert("Le fichier a été généré.");
  }else{
      setProgress(parseInt(arg.percentage));
  }
});

ipc.on('load_settings', (event, arg) => {
  console.log(arg);
  arg.forEach(function(element){
    addRadicalSettings(element);
  });
});
