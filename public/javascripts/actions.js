$(document).ready(function(){
  $("#progressContainer").hide();
});

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

/**
*
*/
function closeParametersWindows(shouldSave){
  if(shouldSave){
    ipc.send('confirm_parameter', {data:""});
  }else{
    ipc.send('cancel_parameter');
  }
}
