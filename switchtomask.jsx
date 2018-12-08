#target photoshop;  
app.bringToFront();  
  
if(documents.length) main();  
function main(){  
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
