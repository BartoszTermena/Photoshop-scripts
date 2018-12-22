// 2018, use it at your own risk;

#target "photoshop-130.064"

app.bringToFront();

if(app.documents.length != 0) {

  processLayers();

  };

////// unlock layers //////

function processLayers(){

  var ref = new ActionReference();

  ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );

  var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL')) +1;

  var selection = hasSelection();

  if (selection == true) {app.activeDocument.selection.deselect()};

  try{

  activeDocument.backgroundLayer;

  var i = 0; }catch(e){ var i = 1; };

  for(i;i<count;i++){

  if(i == 0) continue;

  ref = new ActionReference();

  ref.putIndex( charIDToTypeID( 'Lyr ' ), i );

  var desc = executeActionGet(ref);

  var layerName = desc.getString(charIDToTypeID( 'Nm  ' ));

  var Id = desc.getInteger(stringIDToTypeID( 'layerID' ));

  if(layerName.match(/^<\/Layer group/) ) continue;

  selectLayerByIndex(i,false);

  if (selection == true) {

  reselect ();

  makeLayerMask('RvlS');

  }

  else {makeLayerMask('RvlA')};

  }

  };

// by mike hale, via paul riggott;

// http://forums.adobe.com/message/1944754#1944754

function selectLayerByIndex(index,add){

add = undefined ? add = false:add

var ref = new ActionReference();

    ref.putIndex(charIDToTypeID("Lyr "), index);

    var desc = new ActionDescriptor();

    desc.putReference(charIDToTypeID("null"), ref );

       if(add) desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );

      desc.putBoolean( charIDToTypeID( "MkVs" ), false );

   try{

    executeAction(charIDToTypeID("slct"), desc, DialogModes.NO );

}catch(e){

alert(e.message);

}

};

////// add layer mask //////

function makeLayerMask(maskType) {

try {

if( maskType == undefined) maskType = 'RvlS' ; //from selection

// =======================================================

var idMk = charIDToTypeID( "Mk  " );

    var desc3 = new ActionDescriptor();

    var idNw = charIDToTypeID( "Nw  " );

    var idChnl = charIDToTypeID( "Chnl" );

    desc3.putClass( idNw, idChnl );

    var idAt = charIDToTypeID( "At  " );

        var ref1 = new ActionReference();

        var idChnl = charIDToTypeID( "Chnl" );

        var idChnl = charIDToTypeID( "Chnl" );

        var idMsk = charIDToTypeID( "Msk " );

        ref1.putEnumerated( idChnl, idChnl, idMsk );

    desc3.putReference( idAt, ref1 );

    var idUsng = charIDToTypeID( "Usng" );

    var idUsrM = charIDToTypeID( "UsrM" );

    var idRvlA = charIDToTypeID(maskType);

    desc3.putEnumerated( idUsng, idUsrM, idRvlA );

executeAction( idMk, desc3, DialogModes.NO );

} catch (e) {return false};

};

////// reselect //////

function reselect () {

try {

var idsetd = charIDToTypeID( "setd" );

    var desc7 = new ActionDescriptor();

    var idnull = charIDToTypeID( "null" );

        var ref2 = new ActionReference();

        var idChnl = charIDToTypeID( "Chnl" );

        var idfsel = charIDToTypeID( "fsel" );

        ref2.putProperty( idChnl, idfsel );

    desc7.putReference( idnull, ref2 );

    var idT = charIDToTypeID( "T   " );

    var idOrdn = charIDToTypeID( "Ordn" );

    var idPrvs = charIDToTypeID( "Prvs" );

    desc7.putEnumerated( idT, idOrdn, idPrvs );

executeAction( idsetd, desc7, DialogModes.NO );

} catch (e) {return false}

};

////// check for selection //////

function hasSelection(){

var ref10 = new ActionReference();

ref10.putProperty(stringIDToTypeID("property"), stringIDToTypeID("selection"));

ref10.putEnumerated( charIDToTypeID( "Dcmn" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );

var docDesc = executeActionGet(ref10);

return docDesc.hasKey(stringIDToTypeID("selection"));

};