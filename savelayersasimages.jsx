
app.bringToFront();


cTID = function(s) { return cTID[s] || (cTID[s] = app.charIDToTypeID(s)); };
sTID = function(s) { return app.stringIDToTypeID(s); }; 

selectAllLayers();
function selectAllLayers() {
    var ref = new ActionReference();
    ref.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    var desc = new ActionDescriptor();
    desc.putReference(cTID('null'), ref);
    executeAction(sTID('selectAllLayers'), desc, DialogModes.NO);
}
// swich to mask ///

if(documents.length) mainm();  
function mainm(){  
var selectedlayers = getSelectedLayersIdx();  
selectedlayers.reverse();  
for(var z in selectedlayers){  
    selectLayerByIndex(selectedlayers[z]);  
    selectLayerData();  
     createMask();  
    }  
app.activeDocument.selection.deselect();  
for(var a in selectedlayers) {selectLayerByIndex(selectedlayers[a],true);}  
};  
function getSelectedLayersIdx(){   
      var selectedLayers = new Array;   
      var ref = new ActionReference();   
      ref.putProperty(charIDToTypeID('Prpr'), stringIDToTypeID('targetLayers'));  
      ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );   
      var desc = executeActionGet(ref);   
      if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){   
         desc = desc.getList( stringIDToTypeID( 'targetLayers' ));   
          var c = desc.count;   
          var selectedLayers = new Array();   
          for(var i=0;i<c;i++){   
            try{   
               activeDocument.backgroundLayer;   
               selectedLayers.push(  desc.getReference( i ).getIndex() );   
            }catch(e){   
               selectedLayers.push(  desc.getReference( i ).getIndex()+1 );   
            }   
          }   
       }else{   
         var ref = new ActionReference();   
         ref.putProperty( charIDToTypeID('Prpr') , charIDToTypeID( 'ItmI' ));   
         ref.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );   
         try{   
            activeDocument.backgroundLayer;   
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( 'ItmI' ))-1);   
         }catch(e){   
            selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( 'ItmI' )));   
         }   
     var vis = app.activeDocument.activeLayer.visible;  
        if(vis == true) app.activeDocument.activeLayer.visible = false;  
        var desc9 = new ActionDescriptor();  
    var list9 = new ActionList();  
    var ref9 = new ActionReference();  
    ref9.putEnumerated( charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );  
    list9.putReference( ref9 );  
    desc9.putList( charIDToTypeID('null'), list9 );  
    executeAction( charIDToTypeID('Shw '), desc9, DialogModes.NO );  
    if(app.activeDocument.activeLayer.visible == false) selectedLayers.shift();  
        app.activeDocument.activeLayer.visible = vis;  
      }   
      return selectedLayers;   
};  
function selectLayerByIndex(index,add){   
var ref = new ActionReference();  
ref.putIndex(charIDToTypeID('Lyr '), index);  
var desc = new ActionDescriptor();  
desc.putReference(charIDToTypeID('null'), ref );  
if(add) desc.putEnumerated( stringIDToTypeID( 'selectionModifier' ), stringIDToTypeID( 'selectionModifierType' ), stringIDToTypeID( 'addToSelection' ) );   
desc.putBoolean( charIDToTypeID( 'MkVs' ), false );   
try{  
executeAction(charIDToTypeID('slct'), desc, DialogModes.NO );  
}catch(e){}  
};  
function createMask() {  
var desc13 = new ActionDescriptor();  
desc13.putClass( charIDToTypeID('Nw  '), charIDToTypeID('Chnl') );  
var ref12 = new ActionReference();  
ref12.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Msk ') );  
desc13.putReference( charIDToTypeID('At  '), ref12 );  
desc13.putEnumerated( charIDToTypeID('Usng'), charIDToTypeID('UsrM'), charIDToTypeID('RvlS') );  
executeAction( charIDToTypeID('Mk  '), desc13, DialogModes.NO );  
};  
function selectLayerData() {  
var desc8 = new ActionDescriptor();  
var ref6 = new ActionReference();  
ref6.putProperty( charIDToTypeID('Chnl'), charIDToTypeID('fsel') );  
desc8.putReference( charIDToTypeID('null'), ref6 );  
var ref7 = new ActionReference();  
ref7.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Trsp') );  
desc8.putReference( charIDToTypeID('T   '), ref7 );  
executeAction( charIDToTypeID('setd'), desc8, DialogModes.NO );  
};  



function main() {
    // two quick checks
	if(!okDocument()) {
        alert("Document must be saved and be a layered PSD.");
        return; 
    }
    
    var len = activeDocument.layers.length;
    var ok = confirm("Note: All layers will be saved in same directory as your PSD.\nThis document contains " + len + " top level layers.\nBe aware that large numbers of layers may take some time!\nContinue?");
    if(!ok) return

    // user preferences
    prefs = new Object();
    prefs.fileType = "";
    prefs.fileQuality = 12;
    prefs.filePath = app.activeDocument.path;
    prefs.count = 0;
    prefs.folders = true;

    //instantiate dialogue
    Dialog();
    hideLayers(activeDocument);
    saveLayers(activeDocument);
    showLayers(activeDocument);
    alert("Saved " + prefs.count + " files.");
}

function hideLayers(ref) {
    var len = ref.layers.length;
    for (var i = 0; i < len; i++) {
        var layer = ref.layers[i];
        if (layer.typename == 'LayerSet') {
            layer.visible = true;
            hideLayers(layer);
        } else layer.visible = false;
    }
}

function showLayers(ref) {
    var len = ref.layers.length;
    for (var i = 0; i < len; i++) {	
        layer = ref.layers[i];
        if(layer.typename == 'LayerSet') showLayers(layer);
        layer.visible = true;
    }
}

function saveLayers(ref) {
    var len = ref.layers.length;
    // rename layers top to bottom
    for (var i = 0; i < len; i++) {
        var layer = ref.layers[i];
        if (layer.typename == 'LayerSet') {
            // recurse if current layer is a group
            hideLayers(layer);
            saveLayers(layer);
        } else {
            // otherwise make sure the layer is visible and save it
            layer.visible = true;
            saveImage(layer);
            layer.visible = false;
        }
    }
}

function saveImage(layer) {
    var handle =  layer.name;
    handle = getFolder(layer, handle);
    handle = prefs.filePath + "/" + activeDocument.name.slice(0,-4) + "/" + handle;
    handle = getUniqueName(handle);
    prefs.count++;
    SaveTIFF(handle); 
   	
}						

				
function SaveTIFF(saveFile) {
    tiffSaveOptions = new TiffSaveOptions();
    activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE); 
}

function getFolder(layer, handle) {
    if (layer.parent.typename == 'LayerSet') {
        handle = layer.parent.name + '/' + handle;
        handle = getFolder(layer.parent, handle);
    }
    return handle
}

function getUniqueName(fileroot) { 
    // form a full file name
    // if the file name exists, a numeric suffix will be added to disambiguate
	
    var filename = fileroot;
    for (var i=1; i<100; i++) {
        var handle = File(filename + "." + prefs.fileType); 
        if(handle.exists) {
            filename = fileroot + "-" + padder(i, 3);
        } else {
            if(!handle.parent.exists){
                handle.parent.create();
            }
            return handle; 
        }
    }
} 

function padder(input, padLength) {
    // pad the input with zeroes up to indicated length
    var result = (new Array(padLength + 1 - input.toString().length)).join('0') + input;
    return result;
}
 

function saveFile( docRef, fileNameBody, exportInfo) {
    switch (exportInfo.fileType) {
        case tiffIndex:
            var saveFile = new File(exportInfo.destination + "/" + fileNameBody + ".tif");
            tiffSaveOptions = new TiffSaveOptions();
            docRef.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
            break;
        default:
            if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                alert(strUnexpectedError);
            }
            break;
    }
}

function Dialog() {
    // build dialogue
    var dlg = new Window ('dialog', 'Select Type'); 
    dlg.saver = dlg.add("dropdownlist", undefined, ""); 
    dlg.quality = dlg.add("dropdownlist", undefined, "");
    dlg.pngtype = dlg.add("dropdownlist", undefined, "");

    // file type
    var saveOpt = [];
    saveOpt[0] = "TIFF"; 
    for (var i=0, len=saveOpt.length; i<len; i++) {
        dlg.saver.add ("item", "Save as " + saveOpt[i]);
    }; 
	
    // trigger function
    dlg.saver.onChange = function() {
        prefs.fileType = saveOpt[parseInt(this.selection)]; 
        // decide whether to show JPG or PNG options
        if(prefs.fileType==saveOpt[1]){
            dlg.quality.show();
            dlg.pngtype.hide();
        } else {
            dlg.quality.hide();
            dlg.pngtype.show();
        }
    }; 
	  	   
    // jpg quality
    var qualityOpt = [];
    for(var i=12; i>=1; i--) {
        qualityOpt[i] = i;
        dlg.quality.add ('item', "" + i);
    }; 

    // png type
    var pngtypeOpt = [];
    pngtypeOpt[0]=8;
    pngtypeOpt[1]=24;
    dlg.pngtype.add ('item', "" + 8 );
    dlg.pngtype.add ('item', "" + 24);

    // trigger functions
    dlg.quality.onChange = function() {
        prefs.fileQuality = qualityOpt[12-parseInt(this.selection)];
    };
    dlg.pngtype.onChange = function() {
       prefs.fileQuality = pngtypeOpt[parseInt(this.selection)]; 
    };
  

    // remainder of UI
    var uiButtonRun = "Continue"; 

    dlg.btnRun = dlg.add("button", undefined, uiButtonRun ); 
    dlg.btnRun.onClick = function() {	
        this.parent.close(0); 
    }; 

    dlg.orientation = 'column'; 

    dlg.saver.selection = dlg.saver.items[0] ;
    dlg.quality.selection = dlg.quality.items[0] ;
    dlg.center(); 
    dlg.show();
}

function okDocument() {
     // check that we have a valid document
     
    if (!documents.length) return false;

    var thisDoc = app.activeDocument; 
    var fileExt = decodeURI(thisDoc.name).replace(/^.*\./,''); 
    return fileExt.toLowerCase() == 'psd'
}

function wrapper() {
    function showError(err) {
        alert(err + ': on line ' + err.line, 'Script Error', true);
    }

    try {
        // suspend history for CS3 or higher
        if (parseInt(version, 10) >= 10) {
            activeDocument.suspendHistory('Save Layers', 'main()');
        } else {
            main();
        }
    } catch(e) {
        // report errors unless the user cancelled
        if (e.number != 8007) showError(e);
    }
}

wrapper();
