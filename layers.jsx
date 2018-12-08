#include json2.js
var doc = app.activeDocument;
var allLayers = [];
var allLayers = collectAllLayers(doc, allLayers);

function collectAllLayers (doc, allLayers){
    for (var m = 0; m < doc.layers.length; m++){
        var theLayer = doc.layers[m];
        if (theLayer.typename === "ArtLayer"){
            allLayers.push(theLayer);
        }else{
            collectAllLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}


alert(allLayers);