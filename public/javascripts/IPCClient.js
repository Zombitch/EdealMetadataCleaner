ipc.on('progress', (event, arg) => {
  setProgress(parseInt(arg.percentage));
  console.log(parseInt(arg.percentage));
});

ipc.on('load_settings', (event, arg) => {
  console.log(arg);
  arg.forEach(function(element){
    addRadicalSettings(element);
  });
});
