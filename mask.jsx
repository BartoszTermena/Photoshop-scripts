/* ========================================================== 
// 2011  John J. McAssey (JJMack)  
// ======================================================= */  
  
  
// This script is supplied as is. It is provided as freeware.   
// The author accepts no liability for any problems arising from its use.  
  
  
/* Help Category note tag menu can be used to place script in automate menu 
<javascriptresource> 
<about>$$$/JavaScripts/LayerToAlphaChan./About=JJMack's Create Alpha Channels for layers placement then Flatten.^r^rCopyright 2011 Mouseprints.^r^rBuild a Photo Collage Toolkit type Template</about> 
<category>JJMack's Collage Script</category> 
</javascriptresource> 
*/  
  
  
// enable double-clicking from Mac Finder or Windows Explorer  
#target photoshop // this command only works in Photoshop CS2 and higher  
  
  
// bring application forward for double-click events  
app.bringToFront();  
  
  
// ensure at least one document open  
if (!documents.length) alert('There are no documents open.', 'No Document');  
else {  
// declare Global variables  
app.activeDocument.suspendHistory('LayerToAlphaChan','main()'); // at least one document exists proceed  
}  
///////////////////////////////////////////////////////////////////////////////  
//                            main function                                  //  
///////////////////////////////////////////////////////////////////////////////  
function main() {  
// declare local variables  
var startDisplayDialogs = app.displayDialogs;  
var orig_ruler_units = app.preferences.rulerUnits;  
app.displayDialogs = DialogModes.NO;  
app.preferences.rulerUnits = Units.PIXELS; // Set the ruler units to PIXELS  
try { code(); }  
// display error message if something goes wrong  
catch(e) { alert(e + ': on line ' + e.line, 'Script Error', true); }  
app.preferences.rulerUnits = orig_ruler_units; // Reset units to original settings  
app.displayDialogs = startDisplayDialogs;  
}  
///////////////////////////////////////////////////////////////////////////////  
//                           main function end                               //  
///////////////////////////////////////////////////////////////////////////////  
  
  
/////////////////////////////////////////////////////////////////////////////////////  
// The real code is embedded into this function so that at any point it can return //  
// to the main line function to let it restore users edit environment and end      //  
/////////////////////////////////////////////////////////////////////////////////////  
function code() {  
// Create Alpha Channels for Layers named Image 1 through Image n Then Flatten Image   
var layers = activeDocument.layers;  
if ( layers.length < 2) {  
alert("The current Document is Flat!");  
return;  
}  
activeDocument.activeLayer = layers[layers.length-1] // Target Bottom Layer;   
var imageCount = layers.length -1; // number of layer over the bottom layer  
if ( imageCount >= 54) {   
alert(imageCount + " images exceed the maximum allowed limit of 53");   
return;  
}  
for (i=1; i<imageCount +1; i++) { // Create Image n Alpha Channels  
layerForward();  
if( activeDocument.activeLayer.kind == LayerKind.SMARTOBJECT)  {rasterizeLayer();}  
if( activeDocument.activeLayer.kind == LayerKind.SOLIDFILL)  {rasterizeLayer();}  
if( activeDocument.activeLayer.kind != LayerKind.NORMAL) {continue;}  
selectTranparency();   
saveAlpha("Image " + i);  
}  
activeDocument.selection.deselect(); // Deselect  
activeDocument.flatten() // Flatten Template  
makeLayer("Mat"); // Add Layer for mat  
fillColor(); // Fill with light gray  
addTexture(); // add texture  
addStyle("Mat"); // add Mat Layer Style  
selectChannelTrans("Image 1"); // Select Image locations  
for (i=2; i<imageCount +1; i++) addChannelTrans("Image " + i);  
try {  
activeDocument.selection.clear(); // cut Mat for images  
}  
catch(e) {};  
activeDocument.selection.deselect(); // deselect  
addClipHueAdj(); // add a clipped hue and saturation adjustment layer  
targetCont("Mat"); // Target layers continiously to Mat Layer  
makeGroup("Mat"); // Make Mat Layer Group  
hideGroup(); // Hide Group  
SetViewFitonScreen()  
}  
//////////////////////////////////////////////////////////////////////////////////  
// Helper Functions //  
//////////////////////////////////////////////////////////////////////////////////  
function layerForward(){  
var idslct = charIDToTypeID( "slct" );  
    var desc26 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref19 = new ActionReference();  
         var idLyr = charIDToTypeID( "Lyr " );  
         var idOrdn = charIDToTypeID( "Ordn" );  
        var idFrwr = charIDToTypeID( "Frwr" );  
        ref19.putEnumerated( idLyr, idOrdn, idFrwr );  
     desc26.putReference( idnull, ref19 );  
    var idMkVs = charIDToTypeID( "MkVs" );  
    desc26.putBoolean( idMkVs, false );  
executeAction( idslct, desc26, DialogModes.NO );  
}  
  
  
function selectTranparency(){  
var idsetd = charIDToTypeID( "setd" );  
    var desc26 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
         var ref9 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        var idfsel = charIDToTypeID( "fsel" );  
        ref9.putProperty( idChnl, idfsel );  
    desc26.putReference( idnull, ref9 );  
    var idT = charIDToTypeID( "T   " );  
        var ref10 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        var idChnl = charIDToTypeID( "Chnl" );  
         var idTrsp = charIDToTypeID( "Trsp" );  
        ref10.putEnumerated( idChnl, idChnl, idTrsp );  
     desc26.putReference( idT, ref10 );  
executeAction( idsetd, desc26, DialogModes.NO );  
}  
  
  
function  saveAlpha(alphaName){  
var idDplc = charIDToTypeID( "Dplc" );  
    var desc27 = new ActionDescriptor();  
     var idnull = charIDToTypeID( "null" );  
        var ref11 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        var idfsel = charIDToTypeID( "fsel" );  
        ref11.putProperty( idChnl, idfsel );  
    desc27.putReference( idnull, ref11 );  
    var idNm = charIDToTypeID( "Nm  " );  
    desc27.putString( idNm, alphaName );  
try {  
executeAction( idDplc, desc27, DialogModes.NO );  
}  
catch(e) {}  
}  
  
  
function makeLayer(name){  
var idMk = charIDToTypeID( "Mk  " );  
    var desc138 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref91 = new ActionReference();  
        var idLyr = charIDToTypeID( "Lyr " );  
        ref91.putClass( idLyr );  
    desc138.putReference( idnull, ref91 );  
    var idUsng = charIDToTypeID( "Usng" );  
        var desc139 = new ActionDescriptor();  
        var idNm = charIDToTypeID( "Nm  " );  
        desc139.putString( idNm, name );  
    var idLyr = charIDToTypeID( "Lyr " );  
    desc138.putObject( idUsng, idLyr, desc139 );  
executeAction( idMk, desc138, DialogModes.NO );  
}  
  
  
function selectChannelTrans(name){    
var idsetd = charIDToTypeID( "setd" );  
    var desc22 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref20 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        var idfsel = charIDToTypeID( "fsel" );  
         ref20.putProperty( idChnl, idfsel );  
     desc22.putReference( idnull, ref20 );  
    var idT = charIDToTypeID( "T   " );  
        var ref21 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        ref21.putName( idChnl, name );  
     desc22.putReference( idT, ref21 );  
try {  
executeAction( idsetd, desc22, DialogModes.NO );  
}  
catch(e) {};  
}  
  
  
function addChannelTrans(image) {  
var idAdd = charIDToTypeID( "Add " );  
    var desc23 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref22 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        ref22.putName( idChnl, image );  
    desc23.putReference( idnull, ref22 );  
    var idT = charIDToTypeID( "T   " );  
        var ref23 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        var idfsel = charIDToTypeID( "fsel" );  
        ref23.putProperty( idChnl, idfsel );  
    desc23.putReference( idT, ref23 );  
try {  
executeAction( idAdd, desc23, DialogModes.NO );  
}  
catch(e) {};  
}  
  
  
function fillColor(){  
// Hard coded Fill with light gray  
var idFl = charIDToTypeID( "Fl  " );  
    var desc31 = new ActionDescriptor();  
    var idUsng = charIDToTypeID( "Usng" );  
    var idFlCn = charIDToTypeID( "FlCn" );  
    var idClr = charIDToTypeID( "Clr " );  
    desc31.putEnumerated( idUsng, idFlCn, idClr );  
    var idClr = charIDToTypeID( "Clr " );  
        var desc32 = new ActionDescriptor();  
         var idRd = charIDToTypeID( "Rd  " );  
        desc32.putDouble( idRd, 221.996109 );  
        var idGrn = charIDToTypeID( "Grn " );  
        desc32.putDouble( idGrn, 221.996109 );  
        var idBl = charIDToTypeID( "Bl  " );  
        desc32.putDouble( idBl, 221.996109 );  
    var idRGBC = charIDToTypeID( "RGBC" );  
     desc31.putObject( idClr, idRGBC, desc32 );  
     var idOpct = charIDToTypeID( "Opct" );  
    var idPrc = charIDToTypeID( "#Prc" );  
    desc31.putUnitDouble( idOpct, idPrc, 100.000000 );  
    var idMd = charIDToTypeID( "Md  " );  
    var idBlnM = charIDToTypeID( "BlnM" );  
    var idNrml = charIDToTypeID( "Nrml" );  
    desc31.putEnumerated( idMd, idBlnM, idNrml );  
executeAction( idFl, desc31, DialogModes.NO );  
}  
  
  
function addTexture(){    
// texturizer sandstone  
var idTxtz = charIDToTypeID( "Txtz" );  
    var desc87 = new ActionDescriptor();  
    var idGEfk = charIDToTypeID( "GEfk" );  
    var idGEft = charIDToTypeID( "GEft" );  
    var idTxtz = charIDToTypeID( "Txtz" );  
    desc87.putEnumerated( idGEfk, idGEft, idTxtz );  
    var idTxtT = charIDToTypeID( "TxtT" );  
    var idTxtT = charIDToTypeID( "TxtT" );  
    var idTxSt = charIDToTypeID( "TxSt" );  
    desc87.putEnumerated( idTxtT, idTxtT, idTxSt );  
    var idScln = charIDToTypeID( "Scln" );  
    desc87.putInteger( idScln, 85 );  
    var idRlf = charIDToTypeID( "Rlf " );  
    desc87.putInteger( idRlf, 6 );  
    var idLghD = charIDToTypeID( "LghD" );  
    var idLghD = charIDToTypeID( "LghD" );  
    var idLDTL = charIDToTypeID( "LDTL" );  
    desc87.putEnumerated( idLghD, idLghD, idLDTL );  
    var idInvT = charIDToTypeID( "InvT" );  
    desc87.putBoolean( idInvT, false );  
try{  
executeAction( idTxtz, desc87, DialogModes.NO );  
}catch(e){}  
}  
  
  
function addStyle(Style){  
var idASty = charIDToTypeID( "ASty" );  
    var desc20 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref3 = new ActionReference();  
        var idStyl = charIDToTypeID( "Styl" );  
        ref3.putName( idStyl, Style );  
    desc20.putReference( idnull, ref3 );  
    var idT = charIDToTypeID( "T   " );  
        var ref4 = new ActionReference();  
        var idLyr = charIDToTypeID( "Lyr " );  
        var idOrdn = charIDToTypeID( "Ordn" );  
        var idTrgt = charIDToTypeID( "Trgt" );  
        ref4.putEnumerated( idLyr, idOrdn, idTrgt );  
    desc20.putReference( idT, ref4 );  
try{  
executeAction( idASty, desc20, DialogModes.NO);  
}catch(e){}  
}  
  
  
function addClipHueAdj(){   
// Add a Clipped Hue and Saturation Adjustment layer  
var idMk = charIDToTypeID( "Mk  " );  
    var desc90 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref66 = new ActionReference();  
        var idAdjL = charIDToTypeID( "AdjL" );  
        ref66.putClass( idAdjL );  
    desc90.putReference( idnull, ref66 );  
    var idUsng = charIDToTypeID( "Usng" );  
        var desc91 = new ActionDescriptor();  
        var idGrup = charIDToTypeID( "Grup" );  
        desc91.putBoolean( idGrup, true );  
        var idType = charIDToTypeID( "Type" );  
            var desc92 = new ActionDescriptor();  
            var idpresetKind = stringIDToTypeID( "presetKind" );  
            var idpresetKindType = stringIDToTypeID( "presetKindType" );  
            var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );  
            desc92.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );  
            var idClrz = charIDToTypeID( "Clrz" );  
            desc92.putBoolean( idClrz, false );  
        var idHStr = charIDToTypeID( "HStr" );  
        desc91.putObject( idType, idHStr, desc92 );  
    var idAdjL = charIDToTypeID( "AdjL" );  
    desc90.putObject( idUsng, idAdjL, desc91 );  
executeAction( idMk, desc90, DialogModes.NO );  
  
  
// Adjust hue adjustment layer  
var idsetd = charIDToTypeID( "setd" );  
    var desc182 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref106 = new ActionReference();  
        var idAdjL = charIDToTypeID( "AdjL" );  
        var idOrdn = charIDToTypeID( "Ordn" );  
        var idTrgt = charIDToTypeID( "Trgt" );  
        ref106.putEnumerated( idAdjL, idOrdn, idTrgt );  
    desc182.putReference( idnull, ref106 );  
    var idT = charIDToTypeID( "T   " );  
        var desc183 = new ActionDescriptor();  
        var idClrz = charIDToTypeID( "Clrz" );  
        desc183.putBoolean( idClrz, true );  
        var idAdjs = charIDToTypeID( "Adjs" );  
            var list27 = new ActionList();  
                var desc184 = new ActionDescriptor();  
                var idChnl = charIDToTypeID( "Chnl" );  
                var idChnl = charIDToTypeID( "Chnl" );  
                var idCmps = charIDToTypeID( "Cmps" );  
                desc184.putEnumerated( idChnl, idChnl, idCmps );  
                var idH = charIDToTypeID( "H   " );  
                desc184.putInteger( idH, 48 );  
                var idStrt = charIDToTypeID( "Strt" );  
                desc184.putInteger( idStrt, 78 );  
                var idLght = charIDToTypeID( "Lght" );  
                desc184.putInteger( idLght, 2 );  
            var idHsttwo = charIDToTypeID( "Hst2" );  
            list27.putObject( idHsttwo, desc184 );  
        desc183.putList( idAdjs, list27 );  
    var idHStr = charIDToTypeID( "HStr" );  
    desc182.putObject( idT, idHStr, desc183 );  
executeAction( idsetd, desc182, DialogModes.NO );  
}  
  
  
function targetCont(name){  
var idslct = charIDToTypeID( "slct" );  
    var desc96 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref68 = new ActionReference();  
        var idLyr = charIDToTypeID( "Lyr " );  
        ref68.putName( idLyr, name );  
    desc96.putReference( idnull, ref68 );  
    var idselectionModifier = stringIDToTypeID( "selectionModifier" );  
    var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );  
    var idaddToSelectionContinuous = stringIDToTypeID( "addToSelectionContinuous" );  
    desc96.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelectionContinuous );  
    var idMkVs = charIDToTypeID( "MkVs" );  
    desc96.putBoolean( idMkVs, false );  
executeAction( idslct, desc96, DialogModes.NO );  
}  
  
  
function makeGroup(name){    
var idMk = charIDToTypeID( "Mk  " );  
    var desc97 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var ref69 = new ActionReference();  
        var idlayerSection = stringIDToTypeID( "layerSection" );  
        ref69.putClass( idlayerSection );  
    desc97.putReference( idnull, ref69 );  
    var idFrom = charIDToTypeID( "From" );  
        var ref70 = new ActionReference();  
        var idLyr = charIDToTypeID( "Lyr " );  
        var idOrdn = charIDToTypeID( "Ordn" );  
        var idTrgt = charIDToTypeID( "Trgt" );  
        ref70.putEnumerated( idLyr, idOrdn, idTrgt );  
    desc97.putReference( idFrom, ref70 );  
    var idUsng = charIDToTypeID( "Usng" );  
        var desc98 = new ActionDescriptor();  
        var idNm = charIDToTypeID( "Nm  " );  
        desc98.putString( idNm, name );  
    var idlayerSection = stringIDToTypeID( "layerSection" );  
    desc97.putObject( idUsng, idlayerSection, desc98 );  
executeAction( idMk, desc97, DialogModes.NO );  
}  
  
  
function hideGroup(){   
var idHd = charIDToTypeID( "Hd  " );  
    var desc118 = new ActionDescriptor();  
    var idnull = charIDToTypeID( "null" );  
        var list11 = new ActionList();  
            var ref78 = new ActionReference();  
            var idLyr = charIDToTypeID( "Lyr " );  
            var idOrdn = charIDToTypeID( "Ordn" );  
            var idTrgt = charIDToTypeID( "Trgt" );  
            ref78.putEnumerated( idLyr, idOrdn, idTrgt );  
        list11.putReference( ref78 );  
    desc118.putList( idnull, list11 );  
executeAction( idHd, desc118, DialogModes.NO );  
}  
  
  
//==================== Set View Fit on Screen ==============  
function SetViewFitonScreen() {  
// Menu View>screen Mode Standard  
var desc1 = new ActionDescriptor();  
var ref1 = new ActionReference();  
ref1.putEnumerated(charIDToTypeID('Mn  '), charIDToTypeID('MnIt'), stringIDToTypeID("screenModeStandard"));  
desc1.putReference(charIDToTypeID('null'), ref1);  
executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);  
// Menu View>Fit on screen  
var desc1 = new ActionDescriptor();  
var ref1 = new ActionReference();  
ref1.putEnumerated(charIDToTypeID('Mn  '), charIDToTypeID('MnIt'), charIDToTypeID('FtOn'));  
desc1.putReference(charIDToTypeID('null'), ref1);  
executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);  
};  
  
  
// ================ rasterizeLayer =======================================  
function rasterizeLayer() {  
var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );  
var desc47 = new ActionDescriptor();  
var idnull = charIDToTypeID( "null" );  
var ref24 = new ActionReference();  
var idLyr = charIDToTypeID( "Lyr " );  
var idOrdn = charIDToTypeID( "Ordn" );  
var idTrgt = charIDToTypeID( "Trgt" );  
ref24.putEnumerated( idLyr, idOrdn, idTrgt );  
desc47.putReference( idnull, ref24 );  
executeAction( idrasterizeLayer, desc47, DialogModes.NO );  
}  