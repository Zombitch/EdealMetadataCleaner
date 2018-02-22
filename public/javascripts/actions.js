$(document).ready(function(){
  $("#progressContainer").hide();
  $(".modal").modal();
  enableDragAndDrop("bodyElement");
  addListenerKeyUp("radical", 13, addRadicalSettings);

  //Display version
  $("#version").html(remote.app.getVersion());
});

/**
* Add drag and drop event to an HTML element
* @param elementId
*/
function enableDragAndDrop(elementId){
  element = document.getElementById(elementId);
  if(element != null){
    element.ondragover = () => {
        return false;
    };

    element.ondragleave = () => {
        return false;
    };

    element.ondragend = () => {
        return false;
    };

    element.ondrop = (e) => {
        e.preventDefault();

        for (let f of e.dataTransfer.files) {
            $("#filename").val(f.path);
        }

        return false;
    };
  }
}

/**
* Ask main process to start cleaning file.
*/
function startProcess(){
  setProgress(0);
  $("#progressContainer").show();
  ipc.send('clean', {filepath:$("#filename").val()});
}

/**
* Cancel process cleaning
*/
function cancelProcess(){
  setProgress(0);
  $("#progressContainer").hide();
  ipc.send('stop', {filepath:$("#filename").val()});
}

/**
* Update progress bar with value
@param value Percentage value
*/
function setProgress(value){
  $("#progressBar").css("width", value+"%");
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
* Add key up event on html element
* @param element
* @param keyCode
* @param callback
* @param callbackParam
*/
function addListenerKeyUp(element, keyCode, callback, callbackParam){
  $("#"+element).keyup(function(event){
    if(event.keyCode == keyCode){
      if(typeof callbackParam === 'undefined') callback();
      else callback(callbackParam);
    }
  });
}

/**
* Add radical entered in input text, in the Table reference list
*/
function addRadicalSettings(){
  var radicalToAdd = $("#radical").val();

  addRadicalSettingsValue(radicalToAdd);
}

/**
* Add radical send as parameter in the Table reference list
* @param radicalToAdd The radical to add to the list
*/
function addRadicalSettingsValue(radicalToAdd){
  if(radicalToAdd == ""){
    alert("Veuillez saisir une valeur.");
  }else{
    var values = radicalToAdd.split(";");

    values.forEach(function(entity){
      if(entity != ""){
        $("#radicalList").append("<li id=\"radical_"+entity+"\" class=\"collection-item\"><div>"+entity+"<a href=\"javascript:deleteRadicalSettings('"+entity+"')\" class=\"secondary-content\"><i class=\"material-icons red-text\">delete</i></a></div></li>");
        $("#radical").val("");
      }
    });
  }
}

/**
* Remove a radical from the list settings
@param radicalToDelete The radical to delete from the view
*/
function deleteRadicalSettings(radicalToDelete){
  $("#radical_"+radicalToDelete).remove();
}
