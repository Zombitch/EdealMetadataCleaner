ipc.on('progress', (event, arg) => {
  console.log("PROGRESS");
});

ipc.on('load_settings', (event, arg) => {
  console.log(arg);
  arg.forEach(function(element){
    addRadicalSettings(element);
  });
});
