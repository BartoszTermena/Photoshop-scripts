  getExportSelectedLayer = function(layer) {

 

 

    var path = activeDocument.path.fsName;

    try { 

      var desc = new ActionDescriptor(); 

      var ref = new ActionReference(); 

 

 

      ref.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum")); 

      desc.putReference(stringIDToTypeID("null"), ref); 

 

 

      desc.putString(stringIDToTypeID("fileType"), "png"); 

      desc.putInteger(stringIDToTypeID("quality"), 32); 

      desc.putInteger(stringIDToTypeID("metadata"), 0); 

      desc.putString(stringIDToTypeID("destFolder"), path); 

      desc.putBoolean(stringIDToTypeID("sRGB"), true); 

      desc.putBoolean(stringIDToTypeID("openWindow"), false); 

 

 

      executeAction(stringIDToTypeID("exportSelectionAsFileTypePressed"), desc, DialogModes.NO); 

      return path + '/' + layer.name;

    } catch (e) {

      return '';

    }

    return '';

  }