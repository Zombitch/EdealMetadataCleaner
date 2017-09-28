$(document).ready(function(){
  $("#progressContainer").hide();
});

/**
* Ask main process to start cleaning file.
*/
function startProcess(){
  ipc.send('clean', {filepath:$("#filename").val()});
  $("#progressContainer").show();
  setProgress(0);
}

function setProgress(value){
  $("#progressBar").width(value);
  $("#progressText").html("Avancement: "+value+"%");
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
* Close the parameter windows
* @param shouldSave Does the system have to save data
*/
function closeParametersWindows(shouldSave){
  if(shouldSave){
    var arrayOfRadical = [];
    $("#radicalList > li > div").each(function(idx, element){
        arrayOfRadical[idx] = $(element).text().replace("delete", "");
    });
    ipc.send('confirm_parameter', {data:arrayOfRadical});
  }else{
    ipc.send('cancel_parameter');
  }
}

/**
* Add radical entered in input text, in the Table reference list
*/
function addRadicalSettings(){
  var radicalToAdd = $("#radical").val();

  addRadicalSettings(radicalToAdd);
}

/**
* Add radical send as parameter in the Table reference list
* @param radicalToAdd The radical to add to the list
*/
function addRadicalSettings(radicalToAdd){
  if(radicalToAdd == ""){
    alert("Veuillez saisir une valeur.");
  }else{
    $("#radicalList").append("<li id=\"radical_"+radicalToAdd+"\" class=\"collection-item\"><div>"+radicalToAdd+"<a href=\"javascript:deleteRadicalSettings('"+radicalToAdd+"')\" class=\"secondary-content\"><i class=\"material-icons red-text\">delete</i></a></div></li>");
  }
}

/**
* Remove a radical from the list settings
*/
function deleteRadicalSettings(radicalToDelete){
  $("#radical_"+radicalToDelete).remove();
}
