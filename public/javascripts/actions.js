/**
* Ask main process to start cleaning file.
*/
function startProcess(){
  ipc.send('clean', {filepath:$("#filename").val()});
}

/**
* Action happened when user click on choose file button, then display appropriate dialog
*/
function chooseFile(){
  remote.dialog.showOpenDialog({
      properties: ['openFile']
  }, function (files) {
    if (files){
      $("#filename").val(files[0]);
    }
  });
}
