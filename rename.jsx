var doc = app.activeDocument;  
  
idLayers(doc); // Rename layers  
  
function idLayers(doc){  
    for(i=0;doc.layers.length>i;i++){  
        var currentLayer = doc.layers[i];  
        currentLayer.name= 'id:GTM_Layer '+(i+1);  
  
        idGroups(currentLayer); // Rename groups  
        idPathItems(currentLayer); // path items  
    }  
}  
  
function idGroups(layer){  
    for(j=0;layer.groupItems.length>j;j++){  
        layer.groupItems[j].name= 'id:GTM_Group '+(j+1)  
    }  
}  
  
function idPathItems(layer){  
    for(k=0;layer.pathItems.length>k;k++){  
        layer.pathItems[k].name= 'id:GTM_Path '+(k+1)  
    }  
}  