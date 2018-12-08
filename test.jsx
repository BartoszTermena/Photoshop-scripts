#include 'json.jsx'

var doc = app.activeDocument;
var allLayers = new Array;
var rv = new Object;
var allLayers = collectAllLayers(doc, allLayers);
var rv = toObject(allLayers, rv);
function collectAllLayers (doc, allLayers){
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
		
        if (theLayer.typename === "ArtLayer"){
            allLayers.push(theLayer.name);
        }else{
            collectAllLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}


function toObject(allLayers, rv) {
  for (var i = 0; i < allLayers.length; ++i)
    if (allLayers[i] !== undefined) rv[i] = allLayers[i];
  return rv;
}
alert(JSON(rv,1));
alert(rv);


logInfo((new Date).toString());  
logInfo( JSON(rv,1) );  

function logInfo(Txt){  
var file = new File(Folder.desktop + "/" + doc.name + ".txt");  
file.open("e", "TEXT", "????");  
file.seek(0,2);  
$.os.search(/windows/i)  != -1 ? file.lineFeed = 'windows'  : file.lineFeed = 'macintosh';  
file.writeln(Txt);  
file.close();  
}; 
